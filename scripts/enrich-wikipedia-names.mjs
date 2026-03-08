#!/usr/bin/env node

// Enriches species-pool.json common names using English Wikipedia article titles.
// Wikipedia article titles are often the best common names for species
// (e.g., "Lion" for Panthera leo, "Dog" for Canis lupus familiaris).
//
// Only queries Wikidata for taxIds present in species-pool.json (~12k),
// not the entire Wikidata species catalog.
//
// Usage:
//   node scripts/enrich-wikipedia-names.mjs [--refresh]

import { readFileSync, writeFileSync, existsSync, mkdirSync, unlinkSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const WORK_DIR = join(ROOT, '.taxonomy-build')
const POOL_PATH = join(ROOT, 'public', 'taxonomy', 'species-pool.json')
const SUPPLEMENT_PATH = join(WORK_DIR, 'wikidata-supplement.json')
const NAMES_CACHE_PATH = join(WORK_DIR, 'wikipedia-names.json')

const SPARQL_ENDPOINT = 'https://query.wikidata.org/sparql'
const USER_AGENT = 'PhyloGuessr/1.0 (https://phyloguessr.com)'
// Wikidata VALUES clause batch — small enough to avoid response truncation
const BATCH_SIZE = 500

async function fetchSparql(query) {
  for (let attempt = 0; attempt < 5; attempt++) {
    const res = await fetch(SPARQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'User-Agent': USER_AGENT,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/sparql-results+json',
      },
      body: `query=${encodeURIComponent(query)}`,
    })
    if (res.ok) {
      const text = await res.text()
      try {
        return JSON.parse(text)
      } catch {
        console.log(`  JSON parse error (got ${text.length} chars), retrying...`)
        await new Promise(r => setTimeout(r, 10000 * (attempt + 1)))
        continue
      }
    }
    if (res.status === 429 || res.status === 503 || res.status === 504) {
      const wait = 20000 * (attempt + 1)
      console.log(`  Server error (${res.status}), waiting ${wait / 1000}s...`)
      await new Promise(r => setTimeout(r, wait))
      continue
    }
    throw new Error(`SPARQL query failed: ${res.status} ${res.statusText}`)
  }
  throw new Error('SPARQL query failed after retries')
}

async function fetchWikipediaNames(taxIds, refresh) {
  if (!refresh && existsSync(NAMES_CACHE_PATH)) {
    const cached = JSON.parse(readFileSync(NAMES_CACHE_PATH, 'utf8'))
    console.log(`Using cached Wikipedia names (${Object.keys(cached).length} entries)`)
    return cached
  }

  const partialPath = NAMES_CACHE_PATH + '.partial'
  const nameMap = {}

  if (!refresh && existsSync(partialPath)) {
    Object.assign(nameMap, JSON.parse(readFileSync(partialPath, 'utf8')))
    console.log(`Resuming from partial cache (${Object.keys(nameMap).length} entries)`)
  }

  // Filter out taxIds we already have
  const remaining = taxIds.filter(id => !nameMap[String(id)])
  console.log(`Fetching Wikipedia names for ${remaining.length} species (${taxIds.length} total, ${Object.keys(nameMap).length} cached)...`)

  const batches = []
  for (let i = 0; i < remaining.length; i += BATCH_SIZE) {
    batches.push(remaining.slice(i, i + BATCH_SIZE))
  }

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i]
    const valuesClause = batch.map(id => `"${id}"`).join(' ')

    const query = `
SELECT ?taxId ?scientificName ?wpTitle ?commonName WHERE {
  VALUES ?taxId { ${valuesClause} }
  ?item wdt:P685 ?taxId .
  ?item wdt:P225 ?scientificName .
  ?article schema:about ?item ;
           schema:isPartOf <https://en.wikipedia.org/> ;
           schema:name ?wpTitle .
  OPTIONAL {
    ?item rdfs:label ?commonName .
    FILTER(LANG(?commonName) = "en")
  }
}
`
    console.log(`  Batch ${i + 1}/${batches.length} (${batch.length} taxIds)...`)
    const data = await fetchSparql(query)
    const results = data.results.bindings

    for (const r of results) {
      const taxId = r.taxId.value
      if (!nameMap[taxId]) {
        nameMap[taxId] = {
          scientificName: r.scientificName.value,
          wpTitle: r.wpTitle.value,
          wdLabel: r.commonName?.value || '',
        }
      }
    }

    console.log(`  Got ${results.length} results (total: ${Object.keys(nameMap).length})`)

    writeFileSync(partialPath, JSON.stringify(nameMap))
    await new Promise(r => setTimeout(r, 2000))
  }

  mkdirSync(dirname(NAMES_CACHE_PATH), { recursive: true })
  writeFileSync(NAMES_CACHE_PATH, JSON.stringify(nameMap, null, 2))
  if (existsSync(partialPath)) {
    unlinkSync(partialPath)
  }

  console.log(`Cached ${Object.keys(nameMap).length} Wikipedia names`)
  return nameMap
}

function pickBestName(wpTitle, wdLabel, scientificName) {
  // Wikipedia title is often the best common name, but sometimes it IS
  // the scientific name (for obscure species). Prefer:
  // 1. Wikipedia title if it differs from scientific name
  // 2. Wikidata English label if it differs from scientific name
  // 3. Keep existing name

  const wpClean = wpTitle.replace(/ \(.*\)$/, '').trim()
  const sciClean = scientificName.trim()

  if (wpClean && wpClean.toLowerCase() !== sciClean.toLowerCase()) {
    return wpClean
  }
  if (wdLabel && wdLabel.toLowerCase() !== sciClean.toLowerCase()) {
    return wdLabel
  }
  return ''
}

async function main() {
  const refresh = process.argv.includes('--refresh')

  const pool = JSON.parse(readFileSync(POOL_PATH, 'utf8'))
  const taxIds = pool.map(e => e[0])

  console.log(`Species pool has ${taxIds.length} species`)

  const nameMap = await fetchWikipediaNames(taxIds, refresh)

  // Patch species-pool.json
  let updated = 0
  let alreadyGood = 0
  let noWpName = 0

  for (const entry of pool) {
    const taxId = String(entry[0])
    const info = nameMap[taxId]
    if (!info) {
      continue
    }

    const bestName = pickBestName(info.wpTitle, info.wdLabel, info.scientificName)
    if (!bestName) {
      noWpName++
      continue
    }

    const currentName = entry[1]
    if (currentName === bestName) {
      alreadyGood++
      continue
    }

    // Only update if current name looks like a scientific name or assembly name
    const currentLooksScientific =
      currentName === entry[2] ||
      currentName.toLowerCase() === entry[2].toLowerCase() ||
      /^[A-Z][a-z]+ [a-z]+/.test(currentName)

    if (currentLooksScientific || !currentName) {
      entry[1] = bestName
      updated++
    } else {
      alreadyGood++
    }
  }

  writeFileSync(POOL_PATH, JSON.stringify(pool))
  console.log(`\nSpecies pool: ${updated} names updated, ${alreadyGood} already good, ${noWpName} no Wikipedia name found`)

  // Patch wikidata-supplement.json
  if (existsSync(SUPPLEMENT_PATH)) {
    const supplement = JSON.parse(readFileSync(SUPPLEMENT_PATH, 'utf8'))
    let supUpdated = 0

    for (const entry of supplement) {
      const taxId = String(entry[0])
      const info = nameMap[taxId]
      if (!info) {
        continue
      }

      const bestName = pickBestName(info.wpTitle, info.wdLabel, entry[2])
      if (bestName && bestName !== entry[1]) {
        entry[1] = bestName
        supUpdated++
      }
    }

    writeFileSync(SUPPLEMENT_PATH, JSON.stringify(supplement))
    console.log(`Wikidata supplement: ${supUpdated} names updated`)
  }
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
