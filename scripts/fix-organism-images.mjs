#!/usr/bin/env node

// Replaces iNaturalist image URLs in organisms.ts with Wikipedia or NCBI images.
//
// For each organism with an iNaturalist URL:
// 1. Try Wikipedia API (using wikiTitle field)
// 2. Try NCBI taxonomy image API
// 3. Keep existing URL if neither works (with a warning)
//
// Usage:
//   node scripts/fix-organism-images.mjs

import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const ORGANISMS_PATH = join(ROOT, 'src', 'data', 'organisms.ts')

const RATE_DELAY_MS = 200

async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url)
      if (res.ok) return res
      if (res.status === 429) {
        await res.arrayBuffer()
        await new Promise(r => setTimeout(r, 2000 * (i + 1)))
        continue
      }
      await res.arrayBuffer()
      return null
    } catch {
      await new Promise(r => setTimeout(r, 2000))
    }
  }
  return null
}

async function getWikipediaImage(wikiTitle) {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wikiTitle)}`
  const res = await fetchWithRetry(url)
  if (!res) return null
  const data = await res.json()
  return data.thumbnail?.source ?? null
}

async function checkNcbiImage(taxId) {
  const url = `https://api.ncbi.nlm.nih.gov/datasets/v2/taxonomy/taxon/${taxId}/image`
  const res = await fetchWithRetry(url)
  if (!res) return null
  const type = res.headers.get('content-type')
  await res.arrayBuffer()
  if (type && type.startsWith('image/')) return url
  return null
}

async function main() {
  const src = readFileSync(ORGANISMS_PATH, 'utf8')

  // Find all iNaturalist image URLs with their context
  const inatPattern = /imageUrl:\s*'(https?:\/\/[^']*inaturalist[^']*)'/g
  const matches = [...src.matchAll(inatPattern)]
  console.log(`Found ${matches.length} iNaturalist URLs in organisms.ts`)

  // Extract wikiTitle and taxId for each match
  const replacements = new Map()
  let replaced = 0
  let kept = 0

  for (let i = 0; i < matches.length; i++) {
    const match = matches[i]
    const oldUrl = match[1]
    const beforeContext = src.slice(Math.max(0, match.index - 300), match.index)

    // Extract wikiTitle
    const wikiMatch = beforeContext.match(/wikiTitle:\s*'([^']+)'/)
    const wikiTitle = wikiMatch ? wikiMatch[1] : null

    // Extract taxId
    const taxIdMatch = beforeContext.match(/ncbiTaxId:\s*(\d+)/)
    const taxId = taxIdMatch ? Number(taxIdMatch[1]) : null

    // Extract commonName for logging
    const nameMatch = beforeContext.match(/commonName:\s*'([^']+)'/)
    const name = nameMatch ? nameMatch[1] : `taxId=${taxId}`

    await new Promise(r => setTimeout(r, RATE_DELAY_MS))

    // Try Wikipedia first
    let newUrl = null
    if (wikiTitle) {
      newUrl = await getWikipediaImage(wikiTitle)
    }

    // Try NCBI if Wikipedia didn't work
    if (!newUrl && taxId) {
      newUrl = await checkNcbiImage(taxId)
    }

    if (newUrl && newUrl !== oldUrl) {
      replacements.set(oldUrl, newUrl)
      replaced++
      console.log(`  [${i + 1}/${matches.length}] ${name}: replaced`)
    } else {
      kept++
      console.log(`  [${i + 1}/${matches.length}] ${name}: kept (no alternative found)`)
    }
  }

  // Apply replacements
  let newSrc = src
  for (const [oldUrl, newUrl] of replacements) {
    newSrc = newSrc.split(oldUrl).join(newUrl)
  }

  writeFileSync(ORGANISMS_PATH, newSrc)
  console.log(`\nResults: ${replaced} replaced, ${kept} kept`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
