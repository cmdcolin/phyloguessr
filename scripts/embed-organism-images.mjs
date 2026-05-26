#!/usr/bin/env node

// Backfills Wikipedia thumbnail URLs into src/data/organisms/*.json for any
// organism whose imageUrl is missing or non-Wikipedia.
//
// Usage: node scripts/embed-organism-images.mjs

import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import {
  fetchWikipediaThumbnail,
  isWikipediaUrl,
  mapWithConcurrency,
} from './lib/wikipedia.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ORGANISMS_DIR = join(__dirname, '..', 'src', 'data', 'organisms')

function loadGroups() {
  return readdirSync(ORGANISMS_DIR)
    .filter(f => f.endsWith('.json'))
    .map(file => ({
      file,
      organisms: JSON.parse(readFileSync(join(ORGANISMS_DIR, file), 'utf8')),
    }))
}

function needsImage(o) {
  return !o.imageUrl || !isWikipediaUrl(o.imageUrl)
}

async function main() {
  const groups = loadGroups()
  const all = groups.flatMap(g => g.organisms)
  const needFetch = all.filter(needsImage)

  console.log(`${all.length} organisms across ${groups.length} files`)
  console.log(
    `${all.length - needFetch.length} have Wikipedia images, ${needFetch.length} need fetching`,
  )

  if (needFetch.length === 0) {
    return
  }

  const urlByName = await mapWithConcurrency(
    needFetch,
    async o => {
      const url = await fetchWikipediaThumbnail(o.wikiTitle)
      console.log(`  ${o.commonName}: ${url ? '✓' : '✗ no image'}`)
      return url
    },
    { concurrency: 3, delayMs: 500, keyOf: o => o.scientificName },
  )

  let embedded = 0
  const dirty = new Set()
  for (const { file, organisms } of groups) {
    for (const o of organisms) {
      if (!needsImage(o)) {
        continue
      }
      const url = urlByName.get(o.scientificName)
      if (url) {
        o.imageUrl = url
        embedded++
        dirty.add(file)
      }
    }
  }

  for (const { file, organisms } of groups) {
    if (dirty.has(file)) {
      writeFileSync(
        join(ORGANISMS_DIR, file),
        JSON.stringify(organisms, null, 2) + '\n',
      )
    }
  }

  console.log(`\nUpdated ${embedded} organism images across ${dirty.size} files`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
