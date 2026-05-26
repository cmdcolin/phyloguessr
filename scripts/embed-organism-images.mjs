#!/usr/bin/env node

// Fetches Wikipedia thumbnail URLs for organisms in organisms.ts that don't
// already have a Wikipedia image, replacing NCBI/iNaturalist/stale URLs.
//
// Usage:
//   node scripts/embed-organism-images.mjs

import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const ORGANISMS_PATH = join(ROOT, 'src', 'data', 'organisms.ts')

const CONCURRENCY = 3
const RATE_DELAY_MS = 500

function isWikipediaUrl(url) {
  return url.includes('upload.wikimedia.org')
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

  const needFetch = organisms.filter(
    o => !o.imageUrl || !isWikipediaUrl(o.imageUrl),
  )

  console.log(
    `${organisms.length - needFetch.length} already have Wikipedia images, ${needFetch.length} need fetching`,
  )

  if (needFetch.length === 0) {
    console.log('Nothing to update.')
    return
  }

  console.log('Fetching images from Wikipedia...')
  let fetched = 0
  const fetchResults = await processInBatches(needFetch, async o => {
    const url = await fetchWikiThumbnail(o.wikiTitle)
    fetched++
    if (fetched % 10 === 0) {
      console.log(`  ${fetched}/${needFetch.length}`)
    }
    return url
  })

  let updated = src
  let embedded = 0
  let failed = 0

  for (const o of needFetch) {
    const imageUrl = fetchResults.get(o.scientificName)
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
    `\nDone: ${embedded} organisms updated with Wikipedia image URLs, ${failed} without images`,
  )
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
