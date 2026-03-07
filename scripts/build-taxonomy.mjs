#!/usr/bin/env node

import {
  createWriteStream,
  createReadStream,
  existsSync,
  mkdirSync,
  readFileSync,
  statSync,
} from 'fs'
import { writeFile } from 'fs/promises'
import { createInterface } from 'readline'
import { pipeline } from 'stream/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'
import { CURATED_MICROORGANISMS } from './curated-microorganisms.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const NCBI_DUMP_URL =
  'https://ftp.ncbi.nlm.nih.gov/pub/taxonomy/new_taxdump/new_taxdump.tar.gz'
const WORK_DIR = join(ROOT, '.taxonomy-build')
const OUT_DIR = join(ROOT, 'public', 'taxonomy')

function extractCuratedTaxIds() {
  const src = readFileSync(join(ROOT, 'src', 'data', 'organisms.ts'), 'utf8')
  const ids = [...src.matchAll(/ncbiTaxId:\s*(\d+)/g)].map(m => Number(m[1]))
  return [...new Set(ids)]
}

const CURATED_TAX_IDS = extractCuratedTaxIds()

const EXCLUDE_PATTERNS = [
  /unidentified/i,
  /uncultured/i,
  /environmental/i,
  /unclassified/i,
  /incertae sedis/i,
  /\bsp\.\b/,
  /\bcf\.\b/,
  /\baff\.\b/,
]

// --- NCBI download and parsing (for species pool) ---

async function downloadNcbi() {
  if (!existsSync(WORK_DIR)) {
    mkdirSync(WORK_DIR, { recursive: true })
  }

  const tarPath = join(WORK_DIR, 'new_taxdump.tar.gz')

  if (!existsSync(join(WORK_DIR, 'nodes.dmp'))) {
    console.log('Downloading NCBI taxonomy dump...')
    const response = await fetch(NCBI_DUMP_URL)
    if (!response.ok) {
      throw new Error(`Download failed: ${response.status}`)
    }
    const fileStream = createWriteStream(tarPath)
    await pipeline(response.body, fileStream)
    console.log('Extracting...')
    execSync(`tar xzf ${tarPath} -C ${WORK_DIR} nodes.dmp names.dmp`)
    console.log('Extracted nodes.dmp and names.dmp')
  } else {
    console.log('Using cached NCBI taxonomy dump')
  }
}

async function parseNcbiNodes() {
  console.log('Parsing NCBI nodes.dmp...')
  const parents = new Map()
  const ranks = new Map()

  const rl = createInterface({
    input: createReadStream(join(WORK_DIR, 'nodes.dmp')),
    crlfDelay: Infinity,
  })

  for await (const line of rl) {
    const parts = line.split('\t|\t')
    const taxId = parseInt(parts[0].trim(), 10)
    const parentId = parseInt(parts[1].trim(), 10)
    const rank = parts[2].trim()
    parents.set(taxId, parentId)
    ranks.set(taxId, rank)
  }

  console.log(`  ${parents.size} nodes`)
  return { parents, ranks }
}

async function parseNcbiNames() {
  console.log('Parsing NCBI names.dmp...')
  const scientificNames = new Map()
  const commonNames = new Map()

  const rl = createInterface({
    input: createReadStream(join(WORK_DIR, 'names.dmp')),
    crlfDelay: Infinity,
  })

  for await (const line of rl) {
    const parts = line.split('\t|\t')
    const taxId = parseInt(parts[0].trim(), 10)
    const name = parts[1].trim()
    const nameClass = parts[3]?.replace('\t|', '').trim()

    if (nameClass === 'scientific name') {
      scientificNames.set(taxId, name)
    } else if (
      nameClass === 'genbank common name' ||
      nameClass === 'common name'
    ) {
      if (!commonNames.has(taxId)) {
        commonNames.set(taxId, name)
      }
    }
  }

  console.log(
    `  ${scientificNames.size} scientific names, ${commonNames.size} common names`,
  )
  return { scientificNames, commonNames }
}

function buildSpeciesPool(
  ncbiParents,
  ncbiRanks,
  scientificNames,
  commonNames,
) {
  console.log('Building species pool...')
  const pool = []

  for (const [taxId, rank] of ncbiRanks) {
    if (rank !== 'species') {
      continue
    }
    const commonName = commonNames.get(taxId)
    if (!commonName) {
      continue
    }
    const sciName = scientificNames.get(taxId)
    if (!sciName) {
      continue
    }

    let excluded = false
    for (const pat of EXCLUDE_PATTERNS) {
      if (pat.test(sciName) || pat.test(commonName)) {
        excluded = true
        break
      }
    }
    if (excluded) {
      continue
    }

    pool.push([taxId, commonName, sciName])
  }

  console.log(`  ${pool.length} species with common names`)
  return pool
}

function buildNcbiAncestorTree(
  pool,
  curatedIds,
  ncbiParents,
  ncbiRanks,
  ncbiNames,
) {
  console.log('Building NCBI fallback ancestor tree...')
  const neededNodes = new Set()

  const allLeafIds = [...pool.map(s => s[0]), ...curatedIds]
  for (const taxId of allLeafIds) {
    let current = taxId
    const seen = new Set()
    while (current !== 1 && !seen.has(current)) {
      if (neededNodes.has(current)) {
        break
      }
      seen.add(current)
      neededNodes.add(current)
      const parent = ncbiParents.get(current)
      if (parent === undefined || parent === current) {
        break
      }
      current = parent
    }
    neededNodes.add(1)
  }

  const prunedParents = {}
  const prunedNames = {}
  const prunedRanks = {}

  for (const taxId of neededNodes) {
    const parent = ncbiParents.get(taxId)
    if (parent !== undefined) {
      prunedParents[taxId] = parent
    }
    const name = ncbiNames.get(taxId)
    if (name) {
      prunedNames[taxId] = name
    }
    const rank = ncbiRanks.get(taxId)
    if (rank && rank !== 'no rank') {
      prunedRanks[taxId] = rank
    }
  }

  console.log(`  ${Object.keys(prunedParents).length} ancestor nodes`)
  return { parents: prunedParents, names: prunedNames, ranks: prunedRanks }
}

// --- Compress single-child intermediate nodes ---

const importantRanks = new Set([
  'species',
  'genus',
  'family',
  'order',
  'class',
  'phylum',
  'kingdom',
  'domain',
])

function compressChains(tree) {
  const { parents, names, ranks } = tree

  // Build child list
  const childrenOf = {}
  for (const [id, parentId] of Object.entries(parents)) {
    const key = String(parentId)
    if (!childrenOf[key]) {
      childrenOf[key] = []
    }
    childrenOf[key].push(id)
  }

  // Remove single-child nodes without important ranks
  let removed = 0
  for (const nodeId of Object.keys(parents)) {
    const kids = childrenOf[nodeId] || []
    const rank = ranks[nodeId] || ''
    if (kids.length === 1 && !importantRanks.has(rank)) {
      const child = kids[0]
      parents[child] = parents[nodeId]
      // Update child list for the grandparent
      const gpKey = String(parents[nodeId])
      if (childrenOf[gpKey]) {
        const idx = childrenOf[gpKey].indexOf(nodeId)
        if (idx !== -1) {
          childrenOf[gpKey][idx] = child
        }
      }
      delete parents[nodeId]
      delete names[nodeId]
      delete ranks[nodeId]
      delete childrenOf[nodeId]
      removed++
    }
  }

  console.log(
    `  Removed ${removed} intermediate nodes (${Object.keys(parents).length} remaining)`,
  )
  return tree
}

// --- Compact output format ---

function toCompactFormat(tree) {
  const { parents, names, ranks } = tree
  const rankList = [...new Set(Object.values(ranks))].sort()
  const rankMap = Object.fromEntries(rankList.map((r, i) => [r, i]))

  const data = {}
  for (const id of Object.keys(parents)) {
    data[id] = [parents[id], names[id] || '', rankMap[ranks[id]] ?? -1]
  }
  return { R: rankList, D: data }
}

// --- Main ---

async function main() {
  await downloadNcbi()

  const { parents: ncbiParents, ranks: ncbiRanks } = await parseNcbiNodes()
  const { scientificNames, commonNames } = await parseNcbiNames()

  const pool = buildSpeciesPool(
    ncbiParents,
    ncbiRanks,
    scientificNames,
    commonNames,
  )

  const poolIds = new Set(pool.map(e => e[0]))
  let microAdded = 0
  for (const entry of CURATED_MICROORGANISMS) {
    if (!poolIds.has(entry[0])) {
      pool.push(entry)
      poolIds.add(entry[0])
      microAdded++
    }
  }
  console.log(
    `  Added ${microAdded} curated microorganisms (pool now ${pool.length})`,
  )

  const ancestorTree = buildNcbiAncestorTree(
    pool,
    CURATED_TAX_IDS,
    ncbiParents,
    ncbiRanks,
    scientificNames,
  )

  console.log('Compressing intermediate chains...')
  compressChains(ancestorTree)

  // Write output files
  mkdirSync(OUT_DIR, { recursive: true })

  const poolPath = join(OUT_DIR, 'species-pool.json')
  if (existsSync(poolPath)) {
    const existing = JSON.parse(readFileSync(poolPath, 'utf8'))
    if (
      Array.isArray(existing) &&
      existing.length > 0 &&
      existing[0].length >= 4
    ) {
      console.log(
        `Preserving existing species-pool.json (${existing.length} entries with images)`,
      )
      console.log('  Run validate-pool-images.mjs to rebuild from scratch')
    } else {
      console.log('Writing species-pool.json...')
      await writeFile(poolPath, JSON.stringify(pool))
    }
  } else {
    console.log('Writing species-pool.json...')
    await writeFile(poolPath, JSON.stringify(pool))
  }

  // Write compact format: { R: rankList, D: { id: [parent, name, rankIndex] } }
  console.log('Writing parents.json (compact format)...')
  const compact = toCompactFormat(ancestorTree)
  await writeFile(join(OUT_DIR, 'parents.json'), JSON.stringify(compact))

  const poolStats = statSync(join(OUT_DIR, 'species-pool.json'))
  const parentsStats = statSync(join(OUT_DIR, 'parents.json'))
  console.log(`\nOutput sizes:`)
  console.log(
    `  species-pool.json: ${(poolStats.size / 1024 / 1024).toFixed(1)} MB`,
  )
  console.log(
    `  parents.json: ${(parentsStats.size / 1024 / 1024).toFixed(1)} MB`,
  )
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
