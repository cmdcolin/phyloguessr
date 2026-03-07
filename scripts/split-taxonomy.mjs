#!/usr/bin/env node

// Extracts a minimal taxonomy subset for easy-mode organisms from parents.json.
// Produces parents-easy.json (~25 KB gzipped vs ~985 KB for the full tree).
//
// Usage:
//   node scripts/split-taxonomy.mjs

import { readFileSync, writeFileSync, statSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const PARENTS_PATH = join(ROOT, 'public', 'taxonomy', 'parents.json')
const EASY_PATH = join(ROOT, 'public', 'taxonomy', 'parents-easy.json')
const ORGANISMS_PATH = join(ROOT, 'src', 'data', 'organisms.ts')

const parents = JSON.parse(readFileSync(PARENTS_PATH, 'utf8'))
const src = readFileSync(ORGANISMS_PATH, 'utf8')
const ids = [...src.matchAll(/ncbiTaxId:\s*(\d+)/g)].map(m => Number(m[1]))

const needed = new Set()
for (const id of ids) {
  let cur = String(id)
  const seen = new Set()
  while (cur && parents.D[cur] && !seen.has(cur)) {
    seen.add(cur)
    needed.add(cur)
    cur = String(parents.D[cur][0])
  }
  if (cur) {
    needed.add(cur)
  }
}

const easyTree = { R: parents.R, D: {} }
for (const id of needed) {
  if (parents.D[id]) {
    easyTree.D[id] = parents.D[id]
  }
}

writeFileSync(EASY_PATH, JSON.stringify(easyTree))

const fullSize = statSync(PARENTS_PATH).size
const easySize = statSync(EASY_PATH).size
console.log(`Full tree: ${Object.keys(parents.D).length} nodes (${(fullSize / 1024).toFixed(0)} KB)`)
console.log(`Easy tree: ${Object.keys(easyTree.D).length} nodes (${(easySize / 1024).toFixed(0)} KB)`)
console.log(`Reduction: ${((1 - easySize / fullSize) * 100).toFixed(0)}%`)
