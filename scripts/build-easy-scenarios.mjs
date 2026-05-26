#!/usr/bin/env node

// Concatenates scenarios/*.json (source of truth) into the single bundle at
// public/taxonomy/easy-scenarios.json that the app fetches at runtime.
// Files are emitted in alphabetical filename order for deterministic output.

import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const SRC_DIR = join(ROOT, 'scenarios')
const OUT = join(ROOT, 'public', 'taxonomy', 'easy-scenarios.json')

const files = readdirSync(SRC_DIR).filter(f => f.endsWith('.json')).sort()
const scenarios = files.map(f => JSON.parse(readFileSync(join(SRC_DIR, f), 'utf8')))

writeFileSync(OUT, JSON.stringify(scenarios, null, 2) + '\n')
console.log(`Built ${OUT} from ${files.length} scenario files`)
