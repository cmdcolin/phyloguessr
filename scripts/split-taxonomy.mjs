#!/usr/bin/env node

// Extracts a minimal taxonomy subset for easy-mode from parents.json.
// Includes all taxIds referenced by organisms.ts AND easy-scenarios.json.
// Produces parents-easy.json (~25 KB gzipped vs ~985 KB for the full tree).
//
// Usage:
//   node scripts/split-taxonomy.mjs

import { readFileSync, writeFileSync, statSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const PARENTS_PATH = join(ROOT, 'public', 'taxonomy', 'parents.json')
const EASY_PATH = join(ROOT, 'public', 'taxonomy', 'parents-easy.json')
const SCENARIOS_PATH = join(ROOT, 'public', 'taxonomy', 'easy-scenarios.json')
const ORGANISMS_PATH = join(ROOT, 'src', 'data', 'organisms.ts')

const parents = JSON.parse(readFileSync(PARENTS_PATH, 'utf8'))

// Collect all taxIds from organisms.ts
const src = readFileSync(ORGANISMS_PATH, 'utf8')
const ids = [...src.matchAll(/ncbiTaxId:\s*(\d+)/g)].map(m => Number(m[1]))

// Also collect taxIds from easy-scenarios.json if it exists
if (existsSync(SCENARIOS_PATH)) {
  const scenarios = JSON.parse(readFileSync(SCENARIOS_PATH, 'utf8'))
  for (const scenario of scenarios) {
    for (const org of scenario.organisms) {
      if (org.ncbiTaxId) {
        ids.push(org.ncbiTaxId)
      }
    }
  }
}

const uniqueIds = [...new Set(ids)]
let missingCount = 0

const needed = new Set()
for (const id of uniqueIds) {
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
  if (!parents.D[String(id)]) {
    missingCount++
    console.warn(`  WARNING: taxId ${id} not found in full taxonomy — skipped`)
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
console.log(
  `Full tree: ${Object.keys(parents.D).length} nodes (${(fullSize / 1024).toFixed(0)} KB)`,
)
console.log(
  `Easy tree: ${Object.keys(easyTree.D).length} nodes (${(easySize / 1024).toFixed(0)} KB)`,
)
console.log(`Reduction: ${((1 - easySize / fullSize) * 100).toFixed(0)}%`)
if (missingCount > 0) {
  console.warn(
    `\n${missingCount} taxId(s) missing from full taxonomy — run update-all.mjs to rebuild`,
  )
}
