#!/usr/bin/env node

// Ensures every curated organism (organisms.ts) and easy-mode scenario
// (easy-scenarios.json) taxId is present in the full taxonomy (parents.json).
//
// The full tree is downsampled, so a hand-curated species that wasn't sampled
// can be absent. This grafts each missing species' NCBI lineage onto the
// existing tree, stopping at the first ancestor already present. It is purely
// additive — existing nodes are never modified — so a full `update-all` rebuild
// is not required just to add a handful of curated taxa.
//
// Usage:
//   node scripts/patch-curated-taxonomy.mjs
// Then regenerate the easy subset:
//   node scripts/split-taxonomy.mjs

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

import { loadCuratedTaxIds } from './lib/organisms.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const PARENTS_PATH = join(ROOT, 'public', 'taxonomy', 'parents.json')
const SCENARIOS_PATH = join(ROOT, 'public', 'taxonomy', 'easy-scenarios.json')

function collectTargetIds() {
  const ids = new Set(loadCuratedTaxIds())
  if (existsSync(SCENARIOS_PATH)) {
    const scenarios = JSON.parse(readFileSync(SCENARIOS_PATH, 'utf8'))
    for (const scenario of scenarios) {
      for (const org of scenario.organisms) {
        if (org.ncbiTaxId) {
          ids.add(org.ncbiTaxId)
        }
      }
    }
  }
  return [...ids]
}

function tag(block, name) {
  const m = block.match(new RegExp(`<${name}>([^<]*)</${name}>`))
  return m ? m[1] : undefined
}

// Returns ancestor chain ordered root→self as { id, parent, name, rank }.
async function fetchLineage(taxId) {
  const url = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=taxonomy&id=${taxId}&retmode=xml`
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`efetch ${taxId} failed: ${res.status}`)
  }
  const xml = await res.text()
  const lineageBlock = xml.match(/<LineageEx>([\s\S]*?)<\/LineageEx>/)
  const selfBlock = xml.replace(/<LineageEx>[\s\S]*?<\/LineageEx>/, '')

  const ancestors = []
  if (lineageBlock) {
    for (const t of lineageBlock[1].matchAll(/<Taxon>([\s\S]*?)<\/Taxon>/g)) {
      ancestors.push({
        id: Number(tag(t[1], 'TaxId')),
        name: tag(t[1], 'ScientificName') ?? '',
        rank: tag(t[1], 'Rank') ?? 'no rank',
      })
    }
  }
  const self = {
    id: Number(tag(selfBlock, 'TaxId')),
    parent: Number(tag(selfBlock, 'ParentTaxId')),
    name: tag(selfBlock, 'ScientificName') ?? '',
    rank: tag(selfBlock, 'Rank') ?? 'no rank',
  }

  const chain = []
  for (let i = 0; i < ancestors.length; i++) {
    chain.push({
      ...ancestors[i],
      parent: i === 0 ? 1 : ancestors[i - 1].id,
    })
  }
  chain.push(self)
  return chain
}

async function main() {
  const parents = JSON.parse(readFileSync(PARENTS_PATH, 'utf8'))
  const rankIndex = new Map(parents.R.map((r, i) => [r, i]))
  const rankOf = rank => {
    if (rank === 'no rank') {
      return -1
    }
    if (!rankIndex.has(rank)) {
      rankIndex.set(rank, parents.R.length)
      parents.R.push(rank)
    }
    return rankIndex.get(rank)
  }

  const missing = collectTargetIds().filter(id => !parents.D[String(id)])
  if (missing.length === 0) {
    console.log('All curated/scenario taxIds already present in parents.json')
    return
  }
  console.log(`${missing.length} taxId(s) missing — fetching lineages from NCBI`)

  let added = 0
  for (const taxId of missing) {
    const chain = await fetchLineage(taxId)
    const byId = new Map(chain.map(n => [n.id, n]))
    let cur = taxId
    while (cur !== 1 && parents.D[String(cur)] === undefined) {
      const node = byId.get(cur)
      if (!node) {
        throw new Error(`taxId ${cur} absent from fetched lineage of ${taxId}`)
      }
      parents.D[String(cur)] = [node.parent, node.name, rankOf(node.rank)]
      added++
      cur = node.parent
    }
    console.log(`  grafted ${taxId} (${byId.get(taxId)?.name})`)
    await new Promise(r => setTimeout(r, 400))
  }

  writeFileSync(PARENTS_PATH, JSON.stringify(parents))
  console.log(
    `Added ${added} node(s); parents.json now ${Object.keys(parents.D).length} nodes`,
  )
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
