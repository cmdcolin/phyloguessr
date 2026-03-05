#!/usr/bin/env node

import { createWriteStream, createReadStream, existsSync, mkdirSync } from 'fs'
import { writeFile } from 'fs/promises'
import { createInterface } from 'readline'
import { pipeline } from 'stream/promises'
import { createGunzip } from 'zlib'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const DUMP_URL =
  'https://ftp.ncbi.nlm.nih.gov/pub/taxonomy/new_taxdump/new_taxdump.tar.gz'
const WORK_DIR = join(ROOT, '.taxonomy-build')
const OUT_DIR = join(ROOT, 'public', 'taxonomy')

const CURATED_TAX_IDS = [
  9689, 9685, 9612, 9644, 9796, 9785, 9771, 9606, 9598, 9258, 9321, 59463, 9807,
  9813, 9913, 69293, 46004, 9818, 9778, 9361, 9720, 42254, 10090, 9833, 9739,
  28737, 9365, 9371, 9654, 9649, 9678, 10116, 9986, 1868482, 9447, 9601, 9593,
  9974, 9937, 9646, 9801, 8932, 9214, 7899, 52644, 9031, 9233, 8801, 190676,
  85066, 61221, 8496, 8469, 8665, 8296, 8407, 92724, 13397, 80972, 7897, 109280,
  8030, 7757, 7460, 13037, 7227, 258706, 41139, 214820, 6645, 6535, 34573,
  80829, 34559, 7604, 7668, 6145, 6130, 6398, 6204, 307972, 6049, 45351, 27849,
  7719, 7739, 10224, 6850, 232323, 55084, 110365, 6706, 6730, 111074, 6763,
  96821, 3702, 38942, 3663, 3349, 29780, 52860, 4081, 13533, 69266, 4442, 3635,
  3641, 4355, 3562, 167676, 4432, 4411, 57918, 32247, 74632, 38705, 3359, 38739,
  4472, 13894, 35122, 4232, 4362, 4530, 3218, 99814, 4932, 41956, 5076, 5775,
  5885, 5833, 562, 1148, 2173,
]

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

async function downloadAndExtract() {
  if (!existsSync(WORK_DIR)) {
    mkdirSync(WORK_DIR, { recursive: true })
  }

  const tarPath = join(WORK_DIR, 'new_taxdump.tar.gz')

  if (!existsSync(join(WORK_DIR, 'nodes.dmp'))) {
    console.log('Downloading NCBI taxonomy dump...')
    const response = await fetch(DUMP_URL)
    if (!response.ok) {
      throw new Error(`Download failed: ${response.status}`)
    }
    const fileStream = createWriteStream(tarPath)
    await pipeline(response.body, fileStream)
    console.log('Extracting...')
    execSync(`tar xzf ${tarPath} -C ${WORK_DIR} nodes.dmp names.dmp`)
    console.log('Extracted nodes.dmp and names.dmp')
  } else {
    console.log('Using cached taxonomy dump')
  }
}

async function parseNodes() {
  console.log('Parsing nodes.dmp...')
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

async function parseNames() {
  console.log('Parsing names.dmp...')
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

function getLineage(taxId, parents) {
  const lineage = []
  let current = taxId
  const seen = new Set()
  while (current !== 1 && !seen.has(current)) {
    seen.add(current)
    lineage.push(current)
    const parent = parents.get(current)
    if (parent === undefined || parent === current) {
      break
    }
    current = parent
  }
  lineage.push(1) // root
  return lineage
}

function buildSpeciesPool(parents, ranks, scientificNames, commonNames) {
  console.log('Building species pool...')
  const pool = []

  for (const [taxId, rank] of ranks) {
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

function buildPrunedAncestorTree(
  pool,
  curatedIds,
  parents,
  ranks,
  scientificNames,
) {
  console.log('Building pruned ancestor tree...')
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
      const parent = parents.get(current)
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
    const parent = parents.get(taxId)
    if (parent !== undefined) {
      prunedParents[taxId] = parent
    }
    const name = scientificNames.get(taxId)
    if (name) {
      prunedNames[taxId] = name
    }
    const rank = ranks.get(taxId)
    if (rank && rank !== 'no rank') {
      prunedRanks[taxId] = rank
    }
  }

  console.log(`  ${Object.keys(prunedParents).length} ancestor nodes`)
  return { parents: prunedParents, names: prunedNames, ranks: prunedRanks }
}

function buildCuratedLineages(curatedIds, parents, ranks, scientificNames) {
  console.log('Building curated lineages...')
  const lineages = {}
  const nodeNameSet = new Set()

  for (const taxId of curatedIds) {
    const lineage = getLineage(taxId, parents)
    lineages[taxId] = lineage
    for (const ancestorId of lineage) {
      nodeNameSet.add(ancestorId)
    }
  }

  const nodeNames = {}
  for (const taxId of nodeNameSet) {
    const name = scientificNames.get(taxId)
    const rank = ranks.get(taxId)
    if (name) {
      nodeNames[taxId] = { name, rank: rank || 'no rank' }
    }
  }

  return { lineages, nodeNames }
}

async function main() {
  await downloadAndExtract()

  const { parents, ranks } = await parseNodes()
  const { scientificNames, commonNames } = await parseNames()

  // Build species pool
  const pool = buildSpeciesPool(parents, ranks, scientificNames, commonNames)

  // Build pruned ancestor tree
  const ancestorTree = buildPrunedAncestorTree(
    pool,
    CURATED_TAX_IDS,
    parents,
    ranks,
    scientificNames,
  )

  // Write output files
  mkdirSync(OUT_DIR, { recursive: true })

  console.log('Writing species-pool.json...')
  await writeFile(join(OUT_DIR, 'species-pool.json'), JSON.stringify(pool))

  console.log('Writing parents.json...')
  await writeFile(join(OUT_DIR, 'parents.json'), JSON.stringify(ancestorTree))

  // Build curated lineages for organisms.ts
  const { lineages, nodeNames } = buildCuratedLineages(
    CURATED_TAX_IDS,
    parents,
    ranks,
    scientificNames,
  )

  // Print lineage data to paste into organisms.ts
  console.log('\n// === PASTE INTO organisms.ts ===\n')

  console.log('// Lineages for each organism (taxId → root path)')
  console.log('export const lineages: Record<number, number[]> = {')
  for (const taxId of CURATED_TAX_IDS) {
    const lineage = lineages[taxId]
    if (lineage) {
      console.log(`  ${taxId}: [${lineage.join(', ')}],`)
    }
  }
  console.log('}\n')

  console.log('// Node names for all ancestors of curated organisms')
  console.log(
    'export const nodeNames: Record<number, { name: string, rank: string }> = {',
  )
  const sortedIds = Object.keys(nodeNames)
    .map(Number)
    .sort((a, b) => a - b)
  for (const taxId of sortedIds) {
    const entry = nodeNames[taxId]
    const nameEscaped = entry.name.replace(/'/g, "\\'")
    console.log(
      `  ${taxId}: { name: '${nameEscaped}', rank: '${entry.rank}' },`,
    )
  }
  console.log('}')

  console.log('\n// === END PASTE ===')

  const poolStats = await import('fs').then(fs =>
    fs.statSync(join(OUT_DIR, 'species-pool.json')),
  )
  const parentsStats = await import('fs').then(fs =>
    fs.statSync(join(OUT_DIR, 'parents.json')),
  )
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
