#!/usr/bin/env node

// Builds src/data/clade-hints.json: plain-English hints for tree levels that
// have no hand-written landmark. Every hint comes from data, not prose:
//
// - "includes ..." examples are recognizable organisms (easy-mode organisms
//   and scenario organisms) that sit under the node in parents.json, so they
//   are true by construction for the tree the diagram draws.
// - Common names are the English Wikipedia article title or the Wikidata
//   "taxon common name" (P1843) of the item with that NCBI taxonomy ID,
//   skipping names that only echo the scientific name.
//
// Usage:
//   node scripts/build-clade-hints.mjs [--refresh]
//
// --refresh re-queries Wikidata instead of using .taxonomy-build/ cache.

import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const PARENTS_PATH = join(ROOT, 'public', 'taxonomy', 'parents.json')
const POOL_PATH = join(ROOT, 'public', 'taxonomy', 'species-pool.json')
const ORGANISMS_DIR = join(ROOT, 'src', 'data', 'organisms')
const SCENARIOS_DIR = join(ROOT, 'scenarios')
const CACHE_PATH = join(ROOT, '.taxonomy-build', 'wikidata-clade-names.json')
const OUT_PATH = join(ROOT, 'src', 'data', 'clade-hints.json')

const SPARQL_ENDPOINT = 'https://query.wikidata.org/sparql'
const USER_AGENT = 'PhyloGuessr/1.0 (https://phyloguessr.com)'
const BATCH_SIZE = 400
const MAX_EXAMPLES = 3

const CONTEXT_RANKS = new Set([
  'kingdom',
  'phylum',
  'subphylum',
  'superclass',
  'class',
  'subclass',
  'infraclass',
  'superorder',
  'order',
  'suborder',
  'infraorder',
  'superfamily',
  'family',
])
const LEAF_RANKS = new Set([
  'species',
  'subspecies',
  'strain',
  'varietas',
  'forma',
  'biotype',
])
const SKIP_TAX_IDS = new Set(['1', '131567'])

const PROPER_WORDS = new Set([
  'African',
  'American',
  "Anna's",
  'Asian',
  'Asiatic',
  'Atlantic',
  'Australasian',
  'Australian',
  'Australo-Papuan',
  'Bath',
  'Brazil',
  'California',
  'Candida',
  'Chinese',
  'Egyptian',
  'English',
  'European',
  'Galápagos',
  'Gondwanan',
  'Indian',
  "John's-wort",
  'Komodo',
  'Madagascar',
  'Malayan',
  'Mexican',
  'Nile',
  'Patagonian',
  'Philippine',
  'Portuguese',
  'Ross',
  'Scots',
  'Siamese',
  'St',
  'Tasmanian',
  'Valdivian',
  'Venus',
  'West',
  'World',
  'Zealand',
])

const LATIN_SUFFIX =
  /(ae|ea|ia|ida|idae|ota|oidea|oidei|ales|aceae|ina|ini|morpha|phyta|ptera|zoa|oda)$/i

// Taxa whose Wikidata name was checked by hand and found wrong or misleading
// for the NCBI group (a name of a different group, too broad, too narrow)
const REJECTED_TAXA = new Set([
  'Acariformes',
  'Acroporidae',
  'Aizoaceae',
  'Batoidea',
  'Circoviridae',
  'Clusiaceae',
  'Coenobitidae',
  'Cucurbita',
  'Digenea',
  'Ebriacea',
  'Hepadnaviridae',
  'Lamprophiidae',
  'Lomariopsidaceae',
  'Lymnaeidae',
  'Mimiviridae',
  'Pegasidae',
  'Phycodnaviridae',
  'Piperaceae',
  'Psychrolutidae',
  'Scolopendromorpha',
  'Togaviridae',
  'Tridactylidae',
  'Yangochiroptera',
  'Yinpterochiroptera',
])

function loadParents() {
  const { R, D } = JSON.parse(readFileSync(PARENTS_PATH, 'utf8'))
  const nodes = new Map()
  for (const [id, entry] of Object.entries(D)) {
    if (typeof entry[1] === 'string') {
      nodes.set(id, {
        parent: String(entry[0]),
        name: entry[1],
        rank: R[entry[2]],
      })
    }
  }
  return nodes
}

function ancestors(id, nodes) {
  const out = []
  let cur = nodes.get(id)?.parent
  while (cur !== undefined && nodes.has(cur) && !out.includes(cur)) {
    out.push(cur)
    cur = nodes.get(cur).parent
  }
  return out
}

function displayOrganismName(name) {
  const firstWord = name.split(/[\s-]/)[0]
  return PROPER_WORDS.has(firstWord)
    ? name
    : name[0].toLowerCase() + name.slice(1)
}

function loadRecognizable() {
  const sources = [
    ...readdirSync(ORGANISMS_DIR).flatMap(f =>
      JSON.parse(readFileSync(join(ORGANISMS_DIR, f), 'utf8')),
    ),
    ...readdirSync(SCENARIOS_DIR)
      .map(f => JSON.parse(readFileSync(join(SCENARIOS_DIR, f), 'utf8')))
      .toSorted(
        (a, b) =>
          Number(b.difficulty === 'easy') - Number(a.difficulty === 'easy'),
      )
      .flatMap(s => s.organisms),
  ]
  const byTaxId = new Map()
  for (const { ncbiTaxId, commonName } of sources) {
    const id = String(ncbiTaxId)
    const existing = byTaxId.get(id)
    byTaxId.set(id, {
      name: existing?.name ?? displayOrganismName(commonName),
      weight: (existing?.weight ?? 0) + 1,
      order: existing?.order ?? byTaxId.size,
    })
  }
  return byTaxId
}

function collectExamples(nodes, recognizable) {
  const groups = new Map()
  for (const [id, organism] of recognizable) {
    if (nodes.has(id)) {
      const path = [id, ...ancestors(id, nodes)]
      for (let i = 1; i < path.length; i++) {
        const byChild = groups.get(path[i]) ?? new Map()
        groups.set(path[i], byChild)
        const members = byChild.get(path[i - 1]) ?? []
        byChild.set(path[i - 1], members)
        if (!members.some(m => m.name === organism.name)) {
          members.push(organism)
        }
      }
    }
  }
  return groups
}

function firstFork(id, groups) {
  const byChild = groups.get(id)
  const [onlyChild] = byChild.keys()
  return byChild.size === 1 && groups.has(onlyChild)
    ? firstFork(onlyChild, groups)
    : id
}

function pickExamples(byChild, commonName) {
  const queues = [...byChild.values()]
    .map(members =>
      members.toSorted((a, b) => b.weight - a.weight || a.order - b.order),
    )
    .toSorted((a, b) => b.length - a.length)
  const longest = Math.max(...queues.map(q => q.length))
  const roundRobin = Array.from({ length: longest }, (_, round) =>
    queues.filter(q => q.length > round).map(q => q[round].name),
  ).flat()
  return [...new Set(roundRobin)]
    .filter(name => name.toLowerCase() !== commonName?.toLowerCase())
    .slice(0, MAX_EXAMPLES)
}

async function fetchSparql(query) {
  for (let attempt = 0; attempt < 5; attempt++) {
    const res = await fetch(SPARQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'User-Agent': USER_AGENT,
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/sparql-results+json',
      },
      body: `query=${encodeURIComponent(query)}`,
    })
    if (res.ok) {
      return res.json()
    }
    if (![429, 500, 502, 503, 504].includes(res.status)) {
      throw new Error(`SPARQL query failed: ${res.status} ${res.statusText}`)
    }
    const wait = 15000 * (attempt + 1)
    console.log(`  Server error (${res.status}), waiting ${wait / 1000}s...`)
    await new Promise(r => setTimeout(r, wait))
  }
  throw new Error('SPARQL query failed after retries')
}

async function fetchWikidataNames(taxIds, refresh) {
  const cache =
    !refresh && existsSync(CACHE_PATH)
      ? JSON.parse(readFileSync(CACHE_PATH, 'utf8'))
      : { checked: [], names: {} }
  const checked = new Set(cache.checked)
  const remaining = taxIds.filter(id => !checked.has(id))
  console.log(
    `Wikidata names: ${remaining.length} to fetch, ${checked.size} cached`,
  )
  for (let i = 0; i < remaining.length; i += BATCH_SIZE) {
    const batch = remaining.slice(i, i + BATCH_SIZE)
    const data = await fetchSparql(`
SELECT ?taxId ?item ?wpTitle ?commonName WHERE {
  VALUES ?taxId { ${batch.map(id => `"${id}"`).join(' ')} }
  ?item wdt:P685 ?taxId .
  OPTIONAL {
    ?article schema:about ?item ;
             schema:isPartOf <https://en.wikipedia.org/> ;
             schema:name ?wpTitle .
  }
  OPTIONAL { ?item wdt:P1843 ?commonName FILTER(LANG(?commonName) = "en") }
}`)
    for (const b of data.results.bindings) {
      const entry = (cache.names[b.taxId.value] ??= {
        qid: b.item.value.split('/').pop(),
        wpTitle: b.wpTitle?.value,
        commonNames: [],
      })
      const commonName = b.commonName?.value
      if (commonName !== undefined && !entry.commonNames.includes(commonName)) {
        entry.commonNames.push(commonName)
      }
    }
    for (const id of batch) {
      checked.add(id)
    }
    cache.checked = [...checked]
    mkdirSync(dirname(CACHE_PATH), { recursive: true })
    writeFileSync(CACHE_PATH, JSON.stringify(cache))
    console.log(
      `  ${Math.min(i + BATCH_SIZE, remaining.length)}/${remaining.length}`,
    )
    await new Promise(r => setTimeout(r, 1500))
  }
  return cache.names
}

function stem(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z]/g, '')
    .slice(0, 5)
}

function isProperWord(word, next) {
  const bare = word.replace(/,$/, '')
  return (
    PROPER_WORDS.has(bare) ||
    /^[A-Z]{2,}$/.test(bare) ||
    (/^(New|Old|North|South)$/.test(bare) &&
      (PROPER_WORDS.has(next ?? '') || /^(Caledonia|Guinea)$/.test(next ?? '')))
  )
}

function normalizeCommonName(name) {
  const words = name.replace(/\.$/, '').split(' ')
  return words
    .map((w, i) =>
      isProperWord(w, words[i + 1])
        ? w
        : w.replace(
            /(^|[-'])([A-Z])(?=[a-z'])/g,
            (_, sep, c) => sep + c.toLowerCase(),
          ),
    )
    .join(' ')
}

function pickCommonName(scientificName, entry) {
  if (REJECTED_TAXA.has(scientificName)) {
    return undefined
  }
  const candidates = [
    entry?.wpTitle?.replace(/ \(.*\)$/, ''),
    ...(entry?.commonNames ?? []),
  ]
  const usable = candidates.filter(
    c =>
      c !== undefined &&
      c.length > 0 &&
      stem(c) !== stem(scientificName) &&
      !(!c.includes(' ') && LATIN_SUFFIX.test(c)) &&
      !c.includes('&') &&
      !c.includes(';'),
  )
  return usable.length > 0 ? normalizeCommonName(usable[0]) : undefined
}

async function main() {
  const refresh = process.argv.includes('--refresh')
  const nodes = loadParents()
  const recognizable = loadRecognizable()
  const groups = collectExamples(nodes, recognizable)

  const exampleTargets = new Set(
    [...groups.entries()]
      .filter(([id, byChild]) => {
        const node = nodes.get(id)
        const memberCount = [...byChild.values()].reduce(
          (n, m) => n + m.length,
          0,
        )
        return (
          !SKIP_TAX_IDS.has(id) &&
          !LEAF_RANKS.has(node.rank) &&
          memberCount >= 2 &&
          (CONTEXT_RANKS.has(node.rank) || byChild.size >= 2)
        )
      })
      .map(([id]) => id),
  )

  const pool = JSON.parse(readFileSync(POOL_PATH, 'utf8'))
  const poolContextNodes = new Set(
    pool.flatMap(([taxId]) =>
      ancestors(String(taxId), nodes).filter(id =>
        CONTEXT_RANKS.has(nodes.get(id).rank),
      ),
    ),
  )
  const nameTargets = [
    ...new Set([...poolContextNodes, ...exampleTargets]),
  ].toSorted((a, b) => Number(a) - Number(b))
  const wikidata = await fetchWikidataNames(nameTargets, refresh)

  const hints = {}
  for (const id of nameTargets) {
    const commonName = pickCommonName(nodes.get(id).name, wikidata[id])
    const examples = exampleTargets.has(id)
      ? pickExamples(groups.get(firstFork(id, groups)), commonName)
      : []
    if (commonName !== undefined || examples.length > 0) {
      hints[id] = [commonName ?? '', ...examples]
    }
  }

  writeFileSync(OUT_PATH, `${JSON.stringify(hints, null, 0)}\n`)
  const withName = Object.values(hints).filter(h => h[0] !== '').length
  const withExamples = Object.values(hints).filter(h => h.length > 1).length
  console.log(
    `Wrote ${Object.keys(hints).length} hints (${withName} common names, ${withExamples} with examples) to ${OUT_PATH}`,
  )
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
