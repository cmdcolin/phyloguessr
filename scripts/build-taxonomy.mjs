#!/usr/bin/env node

import {
  createWriteStream,
  createReadStream,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
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
const FLAGGED_PATH = join(ROOT, 'public', 'flagged-species.json')

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

function isExcluded(...names) {
  for (const name of names) {
    for (const pat of EXCLUDE_PATTERNS) {
      if (pat.test(name)) return true
    }
  }
  return false
}

function mergeIntoPool(pool, poolIds, entries) {
  let added = 0
  for (const entry of entries) {
    if (!poolIds.has(entry[0])) {
      pool.push(entry)
      poolIds.add(entry[0])
      added++
    }
  }
  return added
}

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

    if (isExcluded(sciName, commonName)) {
      continue
    }

    pool.push([taxId, commonName, sciName])
  }

  console.log(`  ${pool.length} species with common names`)
  return pool
}

// --- jb2hubs species import ---

const JB2HUBS_DIR = join(process.env.HOME, 'src', 'jb2hubs', 'hubs')

function cleanJb2hubsCommonName(commonName, scientificName) {
  let name = commonName
    // Remove assembly/year suffixes like "(2009 genbank)" or "(ATCC 18224 2008 refseq)"
    .replace(/\s*\([^)]*\d{4}[^)]*(genbank|refseq)[^)]*\)/gi, '')
    .replace(/\s*\(\d{4}\)/, '')
    // Remove strain prefixes like "ascomycetes T.marneffei" or "basidiomycetes M.osmundae IAM 14324"
    .replace(
      /^(ascomycetes|basidiomycetes|apicomplexans|diplomonads)\s+\S+/i,
      '',
    )
    // Remove strain/isolate identifiers
    .replace(/\s+(ATCC|IAM|CBS|NRRL|DSM|JCM)\s+\S+/g, '')
    .trim()

  if (!name || name === scientificName) {
    return scientificName.split(' ').slice(0, 2).join(' ')
  }
  return name
}

function cleanJb2hubsSciName(scientificName) {
  // Remove strain identifiers — keep just genus + species
  return scientificName.split(' ').slice(0, 2).join(' ')
}

function scanJb2hubs(ncbiParents, ncbiRanks, scientificNames) {
  if (!existsSync(JB2HUBS_DIR)) {
    console.log('  jb2hubs not found, skipping')
    return []
  }
  console.log('Scanning jb2hubs for additional species...')
  const results = []

  function walk(dir, depth) {
    if (depth > 5) return
    let entries
    try {
      entries = readdirSync(dir)
    } catch {
      return
    }
    for (const entry of entries) {
      const full = join(dir, entry)
      try {
        if (!statSync(full).isDirectory()) continue
      } catch {
        continue
      }
      const metaPath = join(full, 'meta.json')
      const imagePath = join(full, 'image.json')
      if (existsSync(metaPath) && existsSync(imagePath)) {
        try {
          const meta = JSON.parse(readFileSync(metaPath, 'utf8'))
          const image = JSON.parse(readFileSync(imagePath, 'utf8'))
          if (meta.taxonId && meta.scientificName && image.imageUrl) {
            results.push({
              taxId: meta.taxonId,
              scientificName: meta.scientificName,
              commonName: meta.commonName || '',
              imageUrl: image.imageUrl,
            })
          }
        } catch {
          // skip malformed
        }
      } else {
        walk(full, depth + 1)
      }
    }
  }

  for (const prefix of ['GCF', 'GCA']) {
    walk(join(JB2HUBS_DIR, prefix), 0)
  }
  console.log(`  Found ${results.length} assemblies with images`)

  // Deduplicate by taxId, prefer GCF (listed first)
  const byTaxId = new Map()
  for (const r of results) {
    if (!byTaxId.has(r.taxId)) {
      byTaxId.set(r.taxId, r)
    }
  }

  // Map strain taxIds to their species-level parent when possible
  const entries = []
  const seenSpecies = new Set()
  for (const [taxId, r] of byTaxId) {
    let speciesTaxId = taxId
    const rank = ncbiRanks.get(taxId)
    // Walk up to species rank if this is a strain/subspecies
    if (rank && rank !== 'species') {
      let current = taxId
      const seen = new Set()
      while (current && !seen.has(current)) {
        seen.add(current)
        if (ncbiRanks.get(current) === 'species') {
          speciesTaxId = current
          break
        }
        const parent = ncbiParents.get(current)
        if (!parent || parent === current) break
        current = parent
      }
    }

    if (seenSpecies.has(speciesTaxId)) continue
    seenSpecies.add(speciesTaxId)

    const cleanSci = cleanJb2hubsSciName(
      scientificNames.get(speciesTaxId) || r.scientificName,
    )
    const cleanCommon = cleanJb2hubsCommonName(r.commonName, cleanSci)

    if (!isExcluded(cleanSci, cleanCommon)) {
      entries.push([speciesTaxId, cleanCommon, cleanSci, r.imageUrl])
    }
  }

  console.log(`  ${entries.length} unique species from jb2hubs`)
  return entries
}

// --- Flagged species ---

function loadFlaggedSpecies() {
  if (!existsSync(FLAGGED_PATH)) {
    return new Set()
  }
  const raw = JSON.parse(readFileSync(FLAGGED_PATH, 'utf8'))
  const ids = new Set(raw.map(e => (typeof e === 'number' ? e : e.taxId)))
  console.log(`Loaded ${ids.size} flagged species from flagged-species.json`)
  return ids
}

// --- Wikidata supplement ---

const WIKIDATA_SUPPLEMENT_PATH = join(WORK_DIR, 'wikidata-supplement.json')

function loadWikidataSupplement(ncbiParents) {
  if (!existsSync(WIKIDATA_SUPPLEMENT_PATH)) {
    console.log('  Wikidata supplement not found, skipping')
    console.log('  Run: node scripts/import-wikidata-images.mjs')
    return []
  }
  console.log('Loading Wikidata supplement...')
  const raw = JSON.parse(readFileSync(WIKIDATA_SUPPLEMENT_PATH, 'utf8'))

  const byTaxId = new Map()
  for (const entry of raw) {
    const taxId = entry[0]
    if (!ncbiParents.has(taxId)) continue
    if (byTaxId.has(taxId)) continue

    if (!isExcluded(entry[2])) {
      byTaxId.set(taxId, entry)
    }
  }

  console.log(`  ${byTaxId.size} valid species from Wikidata`)
  return [...byTaxId.values()]
}

// --- Diversity-based downsampling ---

const KINGDOM_TARGETS = {
  Metazoa: 6000,
  Plants: 3000,
  Fungi: 2000,
  Bacteria: 2000,
  Viruses: 1000,
  Archaea: 500,
  Other: 500,
}

const KINGDOM_ANCESTORS = {
  2: 'Bacteria',
  2157: 'Archaea',
  4751: 'Fungi',
  10239: 'Viruses',
  33208: 'Metazoa',
  3193: 'Plants',
}

function classifySpecies(taxId, ncbiParents, ncbiRanks) {
  let kingdom = 'Other'
  let family = 0
  let current = taxId
  const seen = new Set()
  while (current && current !== 1 && !seen.has(current)) {
    seen.add(current)
    if (KINGDOM_ANCESTORS[current]) {
      kingdom = KINGDOM_ANCESTORS[current]
    }
    if (!family) {
      const rank = ncbiRanks.get(current)
      if (rank === 'family' || rank === 'order') family = current
    }
    if (kingdom !== 'Other' && family) break
    current = ncbiParents.get(current)
  }
  return { kingdom, family }
}

function downsamplePool(pool, ncbiParents, ncbiRanks) {
  const target = Object.values(KINGDOM_TARGETS).reduce((a, b) => a + b, 0)
  if (pool.length <= target) {
    console.log(
      `  Pool (${pool.length}) within target (${target}), no downsampling needed`,
    )
    return pool
  }

  console.log(
    `Downsampling ${pool.length} species to ~${target} with diversity priority...`,
  )

  // Group by kingdom and family
  const groups = new Map()
  for (const entry of pool) {
    const { kingdom, family } = classifySpecies(
      entry[0],
      ncbiParents,
      ncbiRanks,
    )
    const key = `${kingdom}:${family}`
    if (!groups.has(key)) groups.set(key, { kingdom, entries: [] })
    groups.get(key).entries.push(entry)
  }

  // Group families by kingdom
  const familiesByKingdom = new Map()
  for (const [, group] of groups) {
    if (!familiesByKingdom.has(group.kingdom)) {
      familiesByKingdom.set(group.kingdom, [])
    }
    familiesByKingdom.get(group.kingdom).push(group.entries)
  }

  const sampled = []
  for (const [kingdom, target] of Object.entries(KINGDOM_TARGETS)) {
    const families = familiesByKingdom.get(kingdom) || []
    if (families.length === 0) continue

    const available = families.reduce((s, f) => s + f.length, 0)
    const actualTarget = Math.min(target, available)

    // Shuffle families for randomness
    families.sort(() => Math.random() - 0.5)

    // Sample evenly across families
    const perFamily = Math.max(1, Math.floor(actualTarget / families.length))
    let picked = 0

    for (const family of families) {
      family.sort(() => Math.random() - 0.5)
      const take = Math.min(perFamily, family.length)
      for (let i = 0; i < take && picked < actualTarget; i++) {
        sampled.push(family[i])
        picked++
      }
    }

    // Fill remaining from random families
    if (picked < actualTarget) {
      const remaining = []
      for (const family of families) {
        for (let i = perFamily; i < family.length; i++) {
          remaining.push(family[i])
        }
      }
      remaining.sort(() => Math.random() - 0.5)
      for (const entry of remaining) {
        if (picked >= actualTarget) break
        sampled.push(entry)
        picked++
      }
    }

    console.log(
      `  ${kingdom}: ${picked}/${available} (${families.length} families)`,
    )
  }

  console.log(`  Total: ${sampled.length} species`)
  return sampled
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

  const microAdded = mergeIntoPool(pool, poolIds, CURATED_MICROORGANISMS)
  console.log(
    `  Added ${microAdded} curated microorganisms (pool now ${pool.length})`,
  )

  // jb2hubs names removed — assembly metadata names were low quality.
  // jb2hubs images are still imported separately via import-jb2hubs-images.mjs.

  const wikidataEntries = loadWikidataSupplement(ncbiParents)
  const wdAdded = mergeIntoPool(pool, poolIds, wikidataEntries)
  console.log(
    `  Added ${wdAdded} species from Wikidata (pool now ${pool.length})`,
  )

  // Remove flagged species
  const flaggedIds = loadFlaggedSpecies()
  if (flaggedIds.size > 0) {
    const before = pool.length
    const filtered = pool.filter(e => !flaggedIds.has(e[0]))
    pool.length = 0
    pool.push(...filtered)
    console.log(
      `  Removed ${before - pool.length} flagged species (pool now ${pool.length})`,
    )
  }

  // Downsample for diversity
  const sampledPool = downsamplePool(pool, ncbiParents, ncbiRanks)

  const ancestorTree = buildNcbiAncestorTree(
    sampledPool,
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
  console.log('Writing species-pool.json...')
  await writeFile(poolPath, JSON.stringify(sampledPool))

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
