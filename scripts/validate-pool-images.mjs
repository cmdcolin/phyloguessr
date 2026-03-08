#!/usr/bin/env node

// Validates that every species in the pool has an image available from
// Wikipedia or iNaturalist. Removes species without images and embeds
// the image URL as a 4th element in each pool entry.
//
// Usage:
//   node scripts/validate-pool-images.mjs            # check new entries only
//   node scripts/validate-pool-images.mjs --refresh   # re-check entries older than 90 days
//
// Reads:  public/taxonomy/species-pool.json
// Writes: public/taxonomy/species-pool.json (filtered, with image URLs)
//         .taxonomy-build/image-cache.json (persistent lookup cache with timestamps)

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const POOL_PATH = join(ROOT, 'public', 'taxonomy', 'species-pool.json')
const CACHE_PATH = join(ROOT, '.taxonomy-build', 'image-cache.json')

const CONCURRENCY = 10
const RATE_DELAY_MS = 100
const REFRESH_MAX_AGE_MS = 90 * 24 * 60 * 60 * 1000

const refreshMode = process.argv.includes('--refresh')

// Cache entries: { url: string | null, ts: number }
function loadCache() {
  if (existsSync(CACHE_PATH)) {
    const raw = JSON.parse(readFileSync(CACHE_PATH, 'utf8'))
    const cache = new Map()
    for (const [key, value] of Object.entries(raw)) {
      if (typeof value === 'object' && value !== null && 'ts' in value) {
        cache.set(key, value)
      } else {
        // migrate old format (plain string or "NONE")
        cache.set(key, {
          url: value === 'NONE' ? null : value,
          ts: 0,
        })
      }
    }
    return cache
  }
  return new Map()
}

function saveCache(cache) {
  writeFileSync(CACHE_PATH, JSON.stringify(Object.fromEntries(cache), null, 2))
}

function isCacheStale(entry) {
  if (!refreshMode) {
    return false
  }
  return Date.now() - entry.ts > REFRESH_MAX_AGE_MS
}

async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url)
      if (res.ok) {
        return res
      }
    } catch {
      if (i < retries - 1) {
        await new Promise(r => setTimeout(r, 2000))
      }
    }
  }
  return null
}

async function checkWikipediaImage(scientificName) {
  const wikiTitle = scientificName.replace(/ /g, '_')
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wikiTitle)}`
  const res = await fetchWithRetry(url)
  if (!res) {
    return null
  }
  const data = await res.json()
  return data.thumbnail?.source ?? null
}

async function processInBatches(pool, cache) {
  let checked = 0
  let hits = 0
  let misses = 0
  let cached = 0
  let refreshed = 0
  const imageUrls = new Array(pool.length)

  for (let i = 0; i < pool.length; i += CONCURRENCY) {
    const batch = pool.slice(i, i + CONCURRENCY)
    const promises = batch.map(async (entry, j) => {
      const scientificName = entry[2]
      const idx = i + j

      // Entry already has an embedded image URL (4th element from jb2hubs)
      if (entry[3]) {
        cached++
        imageUrls[idx] = entry[3]
        cache.set(scientificName, { url: entry[3], ts: Date.now() })
        return
      }

      const cachedEntry = cache.get(scientificName)
      if (cachedEntry && !isCacheStale(cachedEntry)) {
        cached++
        imageUrls[idx] = cachedEntry.url
        return
      }

      if (cachedEntry) {
        refreshed++
      }

      await new Promise(r => setTimeout(r, j * RATE_DELAY_MS))

      const img = await checkWikipediaImage(scientificName)
      cache.set(scientificName, { url: img, ts: Date.now() })
      imageUrls[idx] = img
      if (img) {
        hits++
      } else {
        misses++
      }
    })

    await Promise.all(promises)
    checked += batch.length

    if (checked % 500 === 0 || checked === pool.length) {
      const parts = [
        `${checked}/${pool.length} checked`,
        `${hits} new hits`,
        `${misses} new misses`,
        `${cached} cached`,
      ]
      if (refreshed > 0) {
        parts.push(`${refreshed} refreshed`)
      }
      console.log(`  ${parts.join(', ')}`)
      saveCache(cache)
    }
  }

  return imageUrls
}

async function main() {
  const pool = JSON.parse(readFileSync(POOL_PATH, 'utf8'))
  console.log(`Loaded ${pool.length} species from pool`)
  if (refreshMode) {
    console.log(`Refresh mode: re-checking entries older than 90 days`)
  }

  const cache = loadCache()
  console.log(`Loaded ${cache.size} cached image lookups`)

  console.log('Checking images...')
  const imageUrls = await processInBatches(pool, cache)

  saveCache(cache)

  const filtered = []
  for (let i = 0; i < pool.length; i++) {
    if (imageUrls[i]) {
      const entry = pool[i].slice(0, 3)
      entry.push(imageUrls[i])
      filtered.push(entry)
    }
  }
  const removed = pool.length - filtered.length

  console.log(`\nResults:`)
  console.log(`  ${filtered.length} species with images`)
  console.log(`  ${removed} species without images (removed)`)

  writeFileSync(POOL_PATH, JSON.stringify(filtered))
  console.log(`Wrote filtered pool to ${POOL_PATH}`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
