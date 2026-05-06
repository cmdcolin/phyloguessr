#!/usr/bin/env node
// Replaces iNaturalist image URLs in easy-scenarios.json with Wikipedia thumbnails.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const SCENARIOS_PATH = join(ROOT, 'public', 'taxonomy', 'easy-scenarios.json')
const CACHE_DIR = join(ROOT, '.taxonomy-build')
const CACHE_PATH = join(CACHE_DIR, 'image-cache.json')

const CONCURRENCY = 4
const RATE_DELAY_MS = 300

function loadCache() {
  if (existsSync(CACHE_PATH)) {
    const raw = JSON.parse(readFileSync(CACHE_PATH, 'utf8'))
    const cache = new Map()
    for (const [key, value] of Object.entries(raw)) {
      if (typeof value === 'object' && value !== null && 'ts' in value) {
        cache.set(key, value)
      } else {
        cache.set(key, { url: value === 'NONE' ? null : value, ts: 0 })
      }
    }
    return cache
  }
  return new Map()
}

function saveCache(cache) {
  if (!existsSync(CACHE_DIR)) {
    mkdirSync(CACHE_DIR, { recursive: true })
  }
  writeFileSync(CACHE_PATH, JSON.stringify(Object.fromEntries(cache), null, 2))
}

async function fetchWikiThumbnail(wikiTitle) {
  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wikiTitle)}`,
    )
    if (!res.ok) {
      return null
    }
    const data = await res.json()
    return data.thumbnail?.source ?? null
  } catch {
    return null
  }
}

async function main() {
  const scenarios = JSON.parse(readFileSync(SCENARIOS_PATH, 'utf8'))
  const cache = loadCache()

  // Collect all unique organisms using iNaturalist images
  const needsReplacement = new Map() // scientificName -> { wikiTitle, commonName }
  for (const scenario of scenarios) {
    for (const org of scenario.organisms) {
      if (org.imageUrl?.includes('inaturalist') && !needsReplacement.has(org.scientificName)) {
        needsReplacement.set(org.scientificName, {
          wikiTitle: org.wikiTitle,
          commonName: org.commonName,
        })
      }
    }
  }

  console.log(`Found ${needsReplacement.size} unique organisms with iNaturalist images`)

  // Determine which need fetching (not already in cache with a URL)
  const toFetch = []
  for (const [sciName, info] of needsReplacement) {
    const cached = cache.get(sciName)
    if (!cached?.url) {
      toFetch.push({ sciName, ...info })
    }
  }

  console.log(`${needsReplacement.size - toFetch.length} already cached, ${toFetch.length} need fetching`)

  // Fetch in batches
  for (let i = 0; i < toFetch.length; i += CONCURRENCY) {
    const batch = toFetch.slice(i, i + CONCURRENCY)
    await Promise.all(
      batch.map(async ({ sciName, wikiTitle, commonName }) => {
        const url = await fetchWikiThumbnail(wikiTitle)
        cache.set(sciName, { url, ts: Date.now() })
        const status = url ? '✓' : '✗ no image'
        console.log(`  ${commonName}: ${status}`)
      }),
    )
    if (i + CONCURRENCY < toFetch.length) {
      await new Promise(r => setTimeout(r, RATE_DELAY_MS))
    }
  }

  saveCache(cache)

  // Replace iNaturalist URLs in scenarios
  let replaced = 0
  let failed = 0
  for (const scenario of scenarios) {
    for (const org of scenario.organisms) {
      if (!org.imageUrl?.includes('inaturalist')) {
        continue
      }
      const cached = cache.get(org.scientificName)
      if (cached?.url) {
        org.imageUrl = cached.url
        replaced++
      } else {
        console.warn(`  No Wikipedia image for ${org.commonName} (${org.scientificName}), keeping iNaturalist URL`)
        failed++
      }
    }
  }

  writeFileSync(SCENARIOS_PATH, JSON.stringify(scenarios, null, 2) + '\n')
  console.log(`\nDone: ${replaced} images replaced, ${failed} kept iNaturalist (no Wikipedia image found)`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
