#!/usr/bin/env node

// Replaces iNaturalist image URLs with NCBI taxonomy images.
// iNaturalist search often returns wrong species photos.
// NCBI provides curated images via:
//   https://api.ncbi.nlm.nih.gov/datasets/v2/taxonomy/taxon/{taxId}/image
//
// Usage:
//   node scripts/replace-inat-with-ncbi.mjs

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const POOL_PATH = join(ROOT, 'public', 'taxonomy', 'species-pool.json')
const CACHE_PATH = join(ROOT, '.taxonomy-build', 'image-cache.json')

const CONCURRENCY = 3
const RATE_DELAY_MS = 500

function loadCache() {
  if (existsSync(CACHE_PATH)) {
    return new Map(Object.entries(JSON.parse(readFileSync(CACHE_PATH, 'utf8'))))
  }
  return new Map()
}

function saveCache(cache) {
  writeFileSync(CACHE_PATH, JSON.stringify(Object.fromEntries(cache), null, 2))
}

async function checkNcbiImage(taxId) {
  const url = `https://api.ncbi.nlm.nih.gov/datasets/v2/taxonomy/taxon/${taxId}/image`
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const res = await fetch(url, { redirect: 'follow' })
      const type = res.headers.get('content-type') || ''
      // Consume body to avoid connection leak
      await res.arrayBuffer()
      if (res.status === 200 && type.startsWith('image/')) {
        return url
      }
      if (res.status === 429) {
        await new Promise(r => setTimeout(r, 5000 * (attempt + 1)))
        continue
      }
      return null
    } catch {
      await new Promise(r => setTimeout(r, 3000))
    }
  }
  return null
}

async function main() {
  const pool = JSON.parse(readFileSync(POOL_PATH, 'utf8'))
  const cache = loadCache()

  // Find entries with iNaturalist images
  const inatIndices = []
  for (let i = 0; i < pool.length; i++) {
    const url = pool[i][3] || ''
    if (url.includes('inaturalist')) {
      inatIndices.push(i)
    }
  }

  console.log(`Pool: ${pool.length} species`)
  console.log(`iNaturalist images to replace: ${inatIndices.length}`)

  // Backup iNaturalist image mappings before replacing
  const inatBackup = {}
  for (const idx of inatIndices) {
    const entry = pool[idx]
    inatBackup[entry[2]] = { taxId: entry[0], url: entry[3] }
  }
  const backupPath = join(ROOT, '.taxonomy-build', 'inaturalist-backup.json')
  writeFileSync(backupPath, JSON.stringify(inatBackup, null, 2))
  console.log(`Backed up iNaturalist mappings to ${backupPath}`)

  // Also purge iNaturalist entries from cache
  let cachePurged = 0
  for (const [key, value] of cache) {
    const url = typeof value === 'object' ? value.url : value
    if (url && typeof url === 'string' && url.includes('inaturalist')) {
      cache.delete(key)
      cachePurged++
    }
  }
  console.log(`Purged ${cachePurged} iNaturalist entries from cache`)

  let replaced = 0
  let removed = 0
  let checked = 0

  for (let i = 0; i < inatIndices.length; i += CONCURRENCY) {
    const batch = inatIndices.slice(i, i + CONCURRENCY)
    const promises = batch.map(async (poolIdx, j) => {
      const entry = pool[poolIdx]
      const taxId = entry[0]
      const sciName = entry[2]

      await new Promise(r => setTimeout(r, j * RATE_DELAY_MS))

      const ncbiUrl = await checkNcbiImage(taxId)
      if (ncbiUrl) {
        entry[3] = ncbiUrl
        cache.set(sciName, { url: ncbiUrl, ts: Date.now() })
        replaced++
      } else {
        entry[3] = null
        removed++
      }
    })

    await Promise.all(promises)
    checked += batch.length

    if (checked % 100 === 0 || checked === inatIndices.length) {
      console.log(
        `  ${checked}/${inatIndices.length}: ${replaced} replaced with NCBI, ${removed} removed`,
      )
      saveCache(cache)
    }
  }

  // Filter out entries without images
  const filtered = pool.filter(e => e[3])
  const finalRemoved = pool.length - filtered.length

  console.log(`\nResults:`)
  console.log(`  ${replaced} replaced with NCBI images`)
  console.log(`  ${finalRemoved} species removed (no image available)`)
  console.log(`  ${filtered.length} species remaining`)

  writeFileSync(POOL_PATH, JSON.stringify(filtered))
  saveCache(cache)
  console.log(`Wrote updated pool and cache`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
