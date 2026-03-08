#!/usr/bin/env node

// Imports species images from Wikidata via SPARQL.
// Wikidata links NCBI taxonomy IDs to Wikimedia Commons images.
// This finds species we're missing from NCBI common names + jb2hubs.
//
// Usage:
//   node scripts/import-wikidata-images.mjs

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const CACHE_PATH = join(ROOT, '.taxonomy-build', 'image-cache.json')
const WIKIDATA_CACHE_PATH = join(
  ROOT,
  '.taxonomy-build',
  'wikidata-species.json',
)

const SPARQL_ENDPOINT = 'https://query.wikidata.org/sparql'
const USER_AGENT = 'PhyloGuessr/1.0 (https://phyloguessr.com)'
const BATCH_SIZE = 20000

function loadCache() {
  if (existsSync(CACHE_PATH)) {
    return new Map(Object.entries(JSON.parse(readFileSync(CACHE_PATH, 'utf8'))))
  }
  return new Map()
}

function saveCache(cache) {
  writeFileSync(CACHE_PATH, JSON.stringify(Object.fromEntries(cache), null, 2))
}

// Convert Wikimedia Commons file URL to a usable thumbnail URL
function toThumbUrl(commonsUrl, width = 330) {
  // Input:  http://commons.wikimedia.org/wiki/Special:FilePath/Example.jpg
  // Output: https://upload.wikimedia.org/wikipedia/commons/thumb/hash/Example.jpg/330px-Example.jpg
  const filename = decodeURIComponent(commonsUrl.split('/').pop())
  return `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(filename)}`
}

async function fetchSparql(query) {
  const url = `${SPARQL_ENDPOINT}?query=${encodeURIComponent(query)}&format=json`
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } })
    if (res.ok) {
      return res.json()
    }
    if (res.status === 429 || res.status === 503 || res.status === 504) {
      console.log(`  Server error (${res.status}), waiting...`)
      await new Promise(r => setTimeout(r, 30000 * (attempt + 1)))
      continue
    }
    throw new Error(`SPARQL query failed: ${res.status}`)
  }
  throw new Error('SPARQL query failed after retries')
}

async function fetchAllSpecies() {
  // Check for cached results
  if (existsSync(WIKIDATA_CACHE_PATH)) {
    const cached = JSON.parse(readFileSync(WIKIDATA_CACHE_PATH, 'utf8'))
    console.log(`Using cached Wikidata results (${cached.length} species)`)
    return cached
  }

  console.log('Fetching species from Wikidata SPARQL...')
  let allResults = []

  // Load partial progress if it exists
  const partialPath = WIKIDATA_CACHE_PATH + '.partial'
  let offset = 0
  if (existsSync(partialPath)) {
    allResults = JSON.parse(readFileSync(partialPath, 'utf8'))
    offset = allResults.length
    console.log(`  Resuming from ${offset} (partial cache)`)
  }

  while (true) {
    const query = `
SELECT ?taxId ?scientificName ?image ?commonName WHERE {
  ?item wdt:P685 ?taxId .
  ?item wdt:P18 ?image .
  ?item wdt:P225 ?scientificName .
  ?item wdt:P105 wd:Q7432 .
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

    if (results.length === 0) break

    for (const r of results) {
      allResults.push({
        taxId: Number(r.taxId.value),
        scientificName: r.scientificName.value,
        commonName: r.commonName?.value || '',
        imageUrl: r.image.value,
      })
    }

    console.log(`  Got ${results.length} results (total: ${allResults.length})`)

    // Save partial progress
    writeFileSync(partialPath, JSON.stringify(allResults))

    offset += BATCH_SIZE
    if (results.length < BATCH_SIZE) break
    await new Promise(r => setTimeout(r, 5000))
  }

  // Save final cache and remove partial
  mkdirSync(dirname(WIKIDATA_CACHE_PATH), { recursive: true })
  writeFileSync(WIKIDATA_CACHE_PATH, JSON.stringify(allResults))
  if (existsSync(partialPath)) {
    const { unlinkSync } = await import('fs')
    unlinkSync(partialPath)
  }
  console.log(`Cached ${allResults.length} species to ${WIKIDATA_CACHE_PATH}`)

  return allResults
}

function commonsUrlToThumb(commonsUrl, width = 330) {
  // http://commons.wikimedia.org/wiki/Special:FilePath/Foo.jpg
  // -> https://upload.wikimedia.org/wikipedia/commons/thumb/<md5[0]>/<md5[0:2]>/Foo.jpg/330px-Foo.jpg
  const filename = decodeURIComponent(commonsUrl.split('/').pop()).replace(
    / /g,
    '_',
  )
  // Use the Wikimedia thumbnail API shortcut
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(filename)}?width=${width}`
}

async function main() {
  const species = await fetchAllSpecies()

  // Deduplicate by taxId (keep first)
  const byTaxId = new Map()
  for (const s of species) {
    if (!byTaxId.has(s.taxId)) {
      byTaxId.set(s.taxId, s)
    }
  }
  console.log(`${byTaxId.size} unique species by taxId`)

  // Update image cache with Wikidata images
  const cache = loadCache()
  const existingSize = cache.size
  let added = 0

  for (const [taxId, s] of byTaxId) {
    const existing = cache.get(s.scientificName)
    if (existing && existing.url) continue

    const thumbUrl = commonsUrlToThumb(s.imageUrl)
    cache.set(s.scientificName, { url: thumbUrl, ts: Date.now() })
    added++
  }

  console.log(
    `Image cache: ${existingSize} existing, ${added} added from Wikidata`,
  )
  saveCache(cache)

  // Write supplemental species list for build-taxonomy to pick up
  const supplementPath = join(
    ROOT,
    '.taxonomy-build',
    'wikidata-supplement.json',
  )
  const supplement = []
  for (const [taxId, s] of byTaxId) {
    const name = s.commonName || s.scientificName
    const thumbUrl = commonsUrlToThumb(s.imageUrl)
    supplement.push([taxId, name, s.scientificName, thumbUrl])
  }
  writeFileSync(supplementPath, JSON.stringify(supplement))
  console.log(`Wrote ${supplement.length} species to ${supplementPath}`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
