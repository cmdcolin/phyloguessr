#!/usr/bin/env node

// Imports species image data from jb2hubs genome hub project.
// Cross-references with our species pool to:
// 1. Fill in image URLs for existing pool entries
// 2. Update the image cache for the validate-pool-images script
//
// Usage:
//   node scripts/import-jb2hubs-images.mjs

import {
  readFileSync,
  writeFileSync,
  existsSync,
  readdirSync,
  statSync,
} from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const CACHE_PATH = join(ROOT, '.taxonomy-build', 'image-cache.json')
const JB2HUBS = join(process.env.HOME, 'src', 'jb2hubs')
const HUBS_DIR = join(JB2HUBS, 'hubs')

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
  writeFileSync(CACHE_PATH, JSON.stringify(Object.fromEntries(cache), null, 2))
}

function walkHubs(prefix) {
  const results = []
  const baseDir = join(HUBS_DIR, prefix)
  if (!existsSync(baseDir)) return results

  // Structure: hubs/GCF/NNN/NNN/NNN/GCF_NNNNNNNNN.V/
  function walk(dir, depth) {
    if (depth > 5) return
    let entries
    try {
      entries = readdirSync(dir)
    } catch {
      return
    }
    for (const entry of entries) {
      const full = join(dir, entry)
      try {
        if (!statSync(full).isDirectory()) continue
      } catch {
        continue
      }

      const metaPath = join(full, 'meta.json')
      const imagePath = join(full, 'image.json')

      if (existsSync(metaPath) && existsSync(imagePath)) {
        try {
          const meta = JSON.parse(readFileSync(metaPath, 'utf8'))
          const image = JSON.parse(readFileSync(imagePath, 'utf8'))
          if (meta.taxonId && meta.scientificName && image.imageUrl) {
            results.push({
              taxId: meta.taxonId,
              scientificName: meta.scientificName,
              commonName: meta.commonName || '',
              imageUrl: image.imageUrl,
            })
          }
        } catch {
          // skip malformed files
        }
      } else {
        walk(full, depth + 1)
      }
    }
  }

  walk(baseDir, 0)
  return results
}

// Convert full-size Wikimedia Commons URLs to thumbnail URLs
const COMMONS_FULL_RE =
  /^(https:\/\/upload\.wikimedia\.org\/wikipedia\/commons)\/(\w\/\w\w)\/([^/?#]+)$/
function toThumbUrl(url, width = 400) {
  const m = url.match(COMMONS_FULL_RE)
  if (m) {
    const [, base, hashPath, filename] = m
    return `${base}/thumb/${hashPath}/${filename}/${width}px-${filename}`
  }
  return url
}

function main() {
  console.log('Scanning jb2hubs for species with images...')
  const gcfResults = walkHubs('GCF')
  console.log(`  GCF: ${gcfResults.length} assemblies with images`)
  const gcaResults = walkHubs('GCA')
  console.log(`  GCA: ${gcaResults.length} assemblies with images`)

  const allResults = [...gcfResults, ...gcaResults]

  // Deduplicate by scientific name (prefer GCF/RefSeq entries)
  const byName = new Map()
  for (const r of allResults) {
    // Clean scientific name — remove strain/subspecies info for matching
    const cleanName = r.scientificName.split(' ').slice(0, 2).join(' ')
    if (!byName.has(cleanName)) {
      byName.set(cleanName, r)
    }
  }
  console.log(`  ${byName.size} unique species with images`)

  // Load and update image cache
  const cache = loadCache()
  const existingSize = cache.size
  let added = 0
  const now = Date.now()

  for (const [cleanName, r] of byName) {
    // Try both the clean name and the full name
    for (const name of [cleanName, r.scientificName]) {
      if (!cache.has(name) || cache.get(name).url === null) {
        cache.set(name, { url: toThumbUrl(r.imageUrl), ts: now })
        added++
      }
    }
  }

  console.log(
    `\nImage cache: ${existingSize} existing, ${added} added from jb2hubs`,
  )
  saveCache(cache)
  console.log(`Saved cache to ${CACHE_PATH}`)
}

main()
