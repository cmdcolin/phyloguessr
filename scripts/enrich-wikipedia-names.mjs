#!/usr/bin/env node

// Enriches species-pool.json common names using English Wikipedia article titles.
// Wikipedia article titles are often the best common names for species
// (e.g., "Lion" for Panthera leo, "Dog" for Canis lupus familiaris).
//
// This fetches titles via Wikidata SPARQL (sitelinks to en.wikipedia),
// then patches species-pool.json and wikidata-supplement.json.
//
// Usage:
//   node scripts/enrich-wikipedia-names.mjs [--refresh]

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
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
const BATCH_SIZE = 2000

async function fetchSparql(query) {
  const url = `${SPARQL_ENDPOINT}?query=${encodeURIComponent(query)}&format=json`
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } })
    if (res.ok) {
      const text = await res.text()
      try {
        return JSON.parse(text)
      } catch (e) {
        console.log(`  JSON parse error (got ${text.length} chars), retrying...`)
        await new Promise(r => setTimeout(r, 10000 * (attempt + 1)))
        continue
      }
    }
    if (res.status === 429 || res.status === 503 || res.status === 504) {
      console.log(`  Server error (${res.status}), waiting ${30 * (attempt + 1)}s...`)
      await new Promise(r => setTimeout(r, 30000 * (attempt + 1)))
      continue
    }
    throw new Error(`SPARQL query failed: ${res.status} ${res.statusText}`)
  }
  throw new Error('SPARQL query failed after retries')
}

async function fetchWikipediaNames(refresh) {
  if (!refresh && existsSync(NAMES_CACHE_PATH)) {
    const cached = JSON.parse(readFileSync(NAMES_CACHE_PATH, 'utf8'))
    console.log(`Using cached Wikipedia names (${Object.keys(cached).length} entries)`)
    return cached
  }

  console.log('Fetching Wikipedia article titles from Wikidata SPARQL...')
  const nameMap = {}

  const partialPath = NAMES_CACHE_PATH + '.partial'
  let offset = 0
  if (!refresh && existsSync(partialPath)) {
    const partial = JSON.parse(readFileSync(partialPath, 'utf8'))
    Object.assign(nameMap, partial)
    offset = Object.keys(nameMap).length
    console.log(`  Resuming from ~${offset} (partial cache)`)
    // Round offset to nearest batch
    offset = Math.floor(offset / BATCH_SIZE) * BATCH_SIZE
  }

  while (true) {
    // Fetch species with NCBI IDs that have English Wikipedia articles.
    // schema:name on the sitelink gives the Wikipedia article title,
    // which is typically the common name.
    const query = `
SELECT ?taxId ?scientificName ?wpTitle ?commonName WHERE {
  ?item wdt:P685 ?taxId .
  ?item wdt:P225 ?scientificName .
  ?item wdt:P105 wd:Q7432 .
  ?article schema:about ?item ;
           schema:isPartOf <https://en.wikipedia.org/> ;
           schema:name ?wpTitle .
  OPTIONAL {
    ?item rdfs:label ?commonName .
    FILTER(LANG(?commonName) = "en")
  }
}
LIMIT ${BATCH_SIZE} OFFSET ${offset}
`
    console.log(`  Fetching offset ${offset}...`)
    const data = await fetchSparql(query)
    const results = data.results.bindings

    if (results.length === 0) {
      break
    }

    for (const r of results) {
      const taxId = r.taxId.value
      if (nameMap[taxId]) {
        continue
      }
      nameMap[taxId] = {
        scientificName: r.scientificName.value,
        wpTitle: r.wpTitle.value,
        wdLabel: r.commonName?.value || '',
      }
    }

    console.log(`  Got ${results.length} results (total unique: ${Object.keys(nameMap).length})`)

    writeFileSync(partialPath, JSON.stringify(nameMap))

    offset += BATCH_SIZE
    if (results.length < BATCH_SIZE) {
      break
    }
    await new Promise(r => setTimeout(r, 5000))
  }

  mkdirSync(dirname(NAMES_CACHE_PATH), { recursive: true })
  writeFileSync(NAMES_CACHE_PATH, JSON.stringify(nameMap, null, 2))
  if (existsSync(partialPath + '')) {
    try {
      const { unlinkSync } = await import('fs')
      unlinkSync(partialPath)
    } catch {
      // ignore
    }
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

  const nameMap = await fetchWikipediaNames(refresh)

  // Patch species-pool.json
  if (existsSync(POOL_PATH)) {
    const pool = JSON.parse(readFileSync(POOL_PATH, 'utf8'))
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
  }

  // Patch wikidata-supplement.json
  if (existsSync(SUPPLEMENT_PATH)) {
    const supplement = JSON.parse(readFileSync(SUPPLEMENT_PATH, 'utf8'))
    let updated = 0

    for (const entry of supplement) {
      const taxId = String(entry[0])
      const info = nameMap[taxId]
      if (!info) {
        continue
      }

      const bestName = pickBestName(info.wpTitle, info.wdLabel, entry[2])
      if (bestName && bestName !== entry[1]) {
        entry[1] = bestName
        updated++
      }
    }

    writeFileSync(SUPPLEMENT_PATH, JSON.stringify(supplement))
    console.log(`Wikidata supplement: ${updated} names updated`)
  }
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
