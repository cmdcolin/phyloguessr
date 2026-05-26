#!/usr/bin/env node

// One-time splitter: explodes public/taxonomy/easy-scenarios.json into
// individual per-scenario files under scenarios/. After running this once,
// the scenarios/ directory becomes the source of truth and is built back
// into public/taxonomy/easy-scenarios.json by build-easy-scenarios.mjs.

import { readFileSync, writeFileSync, mkdirSync, readdirSync, unlinkSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const SOURCE = join(ROOT, 'public', 'taxonomy', 'easy-scenarios.json')
const OUT_DIR = join(ROOT, 'scenarios')

function slugSpecies(scientificName) {
  return scientificName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function scenarioFilename(scenario) {
  return scenario.organisms.map(o => slugSpecies(o.scientificName)).join('_') + '.json'
}

const scenarios = JSON.parse(readFileSync(SOURCE, 'utf8'))
mkdirSync(OUT_DIR, { recursive: true })

for (const f of readdirSync(OUT_DIR)) {
  if (f.endsWith('.json')) {
    unlinkSync(join(OUT_DIR, f))
  }
}

const used = new Map()
for (const scenario of scenarios) {
  let name = scenarioFilename(scenario)
  const count = used.get(name) ?? 0
  if (count > 0) {
    name = name.replace(/\.json$/, `-${count + 1}.json`)
  }
  used.set(scenarioFilename(scenario), count + 1)
  writeFileSync(join(OUT_DIR, name), JSON.stringify(scenario, null, 2) + '\n')
}

console.log(`Wrote ${scenarios.length} scenario files to ${OUT_DIR}`)
