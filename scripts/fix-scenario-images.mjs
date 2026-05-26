#!/usr/bin/env node
// Replaces non-Wikipedia image URLs (NCBI, iNaturalist, etc.) in the
// per-scenario source files under scenarios/ with Wikipedia thumbnails.
// Run build-easy-scenarios.mjs afterward to rebuild the runtime bundle.

import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const SCENARIOS_DIR = join(ROOT, 'scenarios')

const CONCURRENCY = 4
const RATE_DELAY_MS = 300

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

async function main() {
  const files = readdirSync(SCENARIOS_DIR).filter(f => f.endsWith('.json'))
  const scenarios = files.map(f => ({
    file: f,
    data: JSON.parse(readFileSync(join(SCENARIOS_DIR, f), 'utf8')),
  }))

  const needsReplacement = new Map()
  for (const { data: scenario } of scenarios) {
    for (const org of scenario.organisms) {
      if (
        org.imageUrl &&
        !isWikipediaUrl(org.imageUrl) &&
        !needsReplacement.has(org.scientificName)
      ) {
        needsReplacement.set(org.scientificName, {
          wikiTitle: org.wikiTitle,
          commonName: org.commonName,
        })
      }
    }
  }

  console.log(
    `Found ${needsReplacement.size} unique organisms with non-Wikipedia images`,
  )

  if (needsReplacement.size === 0) {
    console.log('Nothing to update.')
    return
  }

  const toFetch = [...needsReplacement.entries()].map(([sciName, info]) => ({
    sciName,
    ...info,
  }))

  const urlMap = new Map()
  for (let i = 0; i < toFetch.length; i += CONCURRENCY) {
    const batch = toFetch.slice(i, i + CONCURRENCY)
    await Promise.all(
      batch.map(async ({ sciName, wikiTitle, commonName }) => {
        const url = await fetchWikiThumbnail(wikiTitle)
        urlMap.set(sciName, url)
        const status = url ? '✓' : '✗ no image'
        console.log(`  ${commonName}: ${status}`)
      }),
    )
    if (i + CONCURRENCY < toFetch.length) {
      await new Promise(r => setTimeout(r, RATE_DELAY_MS))
    }
  }

  let replaced = 0
  let failed = 0
  const dirtyFiles = new Set()
  for (const { file, data: scenario } of scenarios) {
    for (const org of scenario.organisms) {
      if (!org.imageUrl || isWikipediaUrl(org.imageUrl)) {
        continue
      }
      const url = urlMap.get(org.scientificName)
      if (url) {
        org.imageUrl = url
        replaced++
        dirtyFiles.add(file)
      } else {
        console.warn(
          `  No Wikipedia image for ${org.commonName} (${org.scientificName}), keeping existing URL`,
        )
        failed++
      }
    }
  }

  for (const { file, data } of scenarios) {
    if (dirtyFiles.has(file)) {
      writeFileSync(join(SCENARIOS_DIR, file), JSON.stringify(data, null, 2) + '\n')
    }
  }
  console.log(
    `\nDone: ${replaced} images replaced, ${failed} kept existing (no Wikipedia image found)`,
  )
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
