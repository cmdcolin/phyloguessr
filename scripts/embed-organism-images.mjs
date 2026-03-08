#!/usr/bin/env node

// Fetches image URLs for the curated organisms in organisms.ts and embeds
// them directly into the file, eliminating runtime Wikipedia/iNaturalist API
// calls for easy mode.
//
// Uses the same image-cache.json as validate-pool-images.mjs.
//
// Usage:
//   node scripts/embed-organism-images.mjs

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const ORGANISMS_PATH = join(ROOT, 'src', 'data', 'organisms.ts')
const CACHE_DIR = join(ROOT, '.taxonomy-build')
const CACHE_PATH = join(CACHE_DIR, 'image-cache.json')

const CONCURRENCY = 3
const RATE_DELAY_MS = 500

function loadCache() {
  if (existsSync(CACHE_PATH)) {
    const raw = JSON.parse(readFileSync(CACHE_PATH, 'utf8'))
    const cache = new Map()
    for (const [key, value] of Object.entries(raw)) {
      if (typeof value === 'object' && value !== null && 'ts' in value) {
        cache.set(key, value)
      } else {
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


function parseOrganisms(src) {
  const organisms = []
  const regex =
    /\{\s*commonName:\s*'([^']+)',\s*scientificName:\s*'([^']+)',\s*ncbiTaxId:\s*(\d+),\s*wikiTitle:\s*'([^']+)',\s*group:\s*'([^']+)'(?:,\s*imageUrl:\s*'([^']*)')?\s*,?\s*\}/gs
  let match
  while ((match = regex.exec(src)) !== null) {
    organisms.push({
      commonName: match[1],
      scientificName: match[2],
      ncbiTaxId: Number(match[3]),
      wikiTitle: match[4],
      group: match[5],
      imageUrl: match[6] || null,
      fullMatch: match[0],
    })
  }
  return organisms
}

async function processInBatches(items, fn) {
  const results = new Map()
  for (let i = 0; i < items.length; i += CONCURRENCY) {
    const batch = items.slice(i, i + CONCURRENCY)
    const batchResults = await Promise.all(batch.map(fn))
    for (let j = 0; j < batch.length; j++) {
      results.set(batch[j].scientificName, batchResults[j])
    }
    if (i + CONCURRENCY < items.length) {
      await new Promise(r => setTimeout(r, RATE_DELAY_MS))
    }
  }
  return results
}

async function main() {
  const src = readFileSync(ORGANISMS_PATH, 'utf8')
  const organisms = parseOrganisms(src)
  console.log(`Found ${organisms.length} organisms in organisms.ts`)

  const cache = loadCache()
  const now = Date.now()

  const needFetch = organisms.filter(o => {
    const cached = cache.get(o.scientificName)
    return !cached || !cached.url
  })

  console.log(
    `${organisms.length - needFetch.length} already cached, ${needFetch.length} need fetching`,
  )

  if (needFetch.length > 0) {
    console.log('Fetching images...')
    let fetched = 0
    await processInBatches(needFetch, async o => {
      const url = await fetchWikiThumbnail(o.wikiTitle)
      cache.set(o.scientificName, { url, ts: now })
      fetched++
      if (fetched % 20 === 0) {
        console.log(`  ${fetched}/${needFetch.length}`)
      }
      return url
    })
    saveCache(cache)
    console.log(`Fetched ${fetched} images, cache saved`)
  }

  let updated = src
  let embedded = 0
  let failed = 0

  for (const o of organisms) {
    const cached = cache.get(o.scientificName)
    const imageUrl = cached?.url
    if (!imageUrl) {
      console.warn(`  No image found for ${o.commonName} (${o.scientificName})`)
      failed++
      continue
    }

    const escaped = imageUrl.replace(/'/g, "\\'")
    const newEntry = o.fullMatch.replace(
      /group:\s*'([^']+)'(?:,\s*imageUrl:\s*'[^']*')?/,
      `group: '$1',\n    imageUrl: '${escaped}'`,
    )

    if (newEntry !== o.fullMatch) {
      updated = updated.replace(o.fullMatch, newEntry)
      embedded++
    }
  }

  writeFileSync(ORGANISMS_PATH, updated)
  console.log(
    `\nDone: ${embedded} organisms updated with image URLs, ${failed} without images`,
  )
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
