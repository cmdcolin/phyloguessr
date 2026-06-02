// Loads the curated organism list from src/data/organisms/*.json — the source
// of truth since organism data was split out of organisms.ts into per-group
// JSON files. Scripts must read these files rather than regex-parsing
// organisms.ts, which now only re-exports the imported JSON.

import { readFileSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ORGANISMS_DIR = join(__dirname, '..', '..', 'src', 'data', 'organisms')

export function loadCuratedOrganisms() {
  return readdirSync(ORGANISMS_DIR)
    .filter(f => f.endsWith('.json'))
    .sort()
    .flatMap(f =>
      JSON.parse(readFileSync(join(ORGANISMS_DIR, f), 'utf8')),
    )
}

export function loadCuratedTaxIds() {
  return [...new Set(loadCuratedOrganisms().map(o => o.ncbiTaxId))]
}
