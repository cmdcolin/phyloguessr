#!/usr/bin/env node

// Replaces non-Wikipedia image URLs in scenarios/*.json with Wikipedia
// thumbnails. Run build-easy-scenarios.mjs afterward to rebuild the bundle.
//
// Usage: node scripts/fix-scenario-images.mjs

import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import {
  fetchWikipediaThumbnail,
  isWikipediaUrl,
  mapWithConcurrency,
} from './lib/wikipedia.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SCENARIOS_DIR = join(__dirname, '..', 'scenarios')

function loadScenarios() {
  return readdirSync(SCENARIOS_DIR)
    .filter(f => f.endsWith('.json'))
    .map(file => ({
      file,
      data: JSON.parse(readFileSync(join(SCENARIOS_DIR, file), 'utf8')),
    }))
}

function needsReplacement(o) {
  return o.imageUrl && !isWikipediaUrl(o.imageUrl)
}

async function main() {
  const scenarios = loadScenarios()
  const allOrgs = scenarios.flatMap(s => s.data.organisms)

  const toFetch = [
    ...new Map(
      allOrgs.filter(needsReplacement).map(o => [o.scientificName, o]),
    ).values(),
  ]
  console.log(`${toFetch.length} unique organisms need Wikipedia images`)

  if (toFetch.length === 0) {
    return
  }

  const urlByName = await mapWithConcurrency(
    toFetch,
    async o => {
      const url = await fetchWikipediaThumbnail(o.wikiTitle)
      console.log(`  ${o.commonName}: ${url ? '✓' : '✗ no image'}`)
      return url
    },
    { concurrency: 4, delayMs: 300, keyOf: o => o.scientificName },
  )

  let replaced = 0
  const dirty = new Set()
  for (const { file, data } of scenarios) {
    for (const o of data.organisms) {
      if (!needsReplacement(o)) {
        continue
      }
      const url = urlByName.get(o.scientificName)
      if (url) {
        o.imageUrl = url
        replaced++
        dirty.add(file)
      }
    }
  }

  for (const { file, data } of scenarios) {
    if (dirty.has(file)) {
      writeFileSync(
        join(SCENARIOS_DIR, file),
        JSON.stringify(data, null, 2) + '\n',
      )
    }
  }

  console.log(`\nReplaced ${replaced} URLs across ${dirty.size} files`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
