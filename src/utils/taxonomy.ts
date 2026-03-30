export interface LcaResult {
  taxId: number
  name: string
  rank: string
  depth: number
}

export interface ClosestPairResult {
  sister1TaxId: number
  sister2TaxId: number
  outgroupTaxId: number
  sisterLca: LcaResult
  overallLca: LcaResult
  isPolytomy: boolean
}

export interface TreeNode {
  taxId: number
  label: string
  rank: string
  children: TreeNode[]
}

export function countLeaves(node: TreeNode): number {
  if (node.children.length === 0) {
    return 1
  }
  let n = 0
  for (const c of node.children) {
    n += countLeaves(c)
  }
  return n
}

export function getMaxDepth(node: TreeNode): number {
  if (node.children.length === 0) {
    return 0
  }
  let max = 0
  for (const child of node.children) {
    const d = getMaxDepth(child)
    if (d > max) {
      max = d
    }
  }
  return max + 1
}

export function collapseSingleChildren(
  node: TreeNode,
  orgTaxIds: Set<number>,
): TreeNode {
  const collapsed = node.children.map(c => collapseSingleChildren(c, orgTaxIds))
  if (collapsed.length === 1 && !orgTaxIds.has(node.taxId)) {
    return collapsed[0]
  }
  return { ...node, children: collapsed }
}

export interface TaxonomyData {
  parents: Record<string, number>
  names: Record<string, string>
  ranks: Record<string, string>
}

export type SpeciesPoolEntry = [number, string, string, string?]

export interface HardModeResult {
  picks: SpeciesPoolEntry[]
  clade?: { taxId: number; name: string; rank: string }
}

export function resolveOrganism(
  taxId: number,
  knownOrganisms: {
    ncbiTaxId: number
    commonName: string
    scientificName: string
    wikiTitle: string
    group: string
    imageUrl?: string
  }[],
  pool: SpeciesPoolEntry[] | null,
  data: TaxonomyData | null,
) {
  const known = knownOrganisms.find(o => o.ncbiTaxId === taxId)
  if (known) {
    return known
  }
  if (pool) {
    const entry = pool.find(([id]) => id === taxId)
    if (entry) {
      const [, commonName, scientificName, imageUrl] = entry
      return {
        commonName,
        scientificName,
        ncbiTaxId: taxId,
        wikiTitle: scientificName.replace(/ /g, '_'),
        group: 'shared',
        imageUrl,
      }
    }
  }
  if (data) {
    const name = data.names[String(taxId)]
    if (name) {
      return {
        commonName: name,
        scientificName: name,
        ncbiTaxId: taxId,
        wikiTitle: name.replace(/ /g, '_'),
        group: 'shared',
      }
    }
  }
  return null
}

export function getLineageFromParents(
  taxId: number,
  parents: Record<string, number>,
) {
  const lineage: number[] = []
  let current = taxId
  const seen = new Set<number>()
  while (current !== 1 && !seen.has(current)) {
    seen.add(current)
    lineage.push(current)
    const parent = parents[String(current)]
    if (parent === undefined || parent === current) {
      break
    }
    current = parent
  }
  lineage.push(1)
  return lineage
}

function getLcaFromParents(a: number, b: number, data: TaxonomyData) {
  const lineageA = getLineageFromParents(a, data.parents)
  const lineageB = getLineageFromParents(b, data.parents)
  const setB = new Set(lineageB)
  for (let i = 0; i < lineageA.length; i++) {
    if (setB.has(lineageA[i])) {
      const taxId = lineageA[i]
      return {
        taxId,
        name: data.names[String(taxId)] ?? String(taxId),
        rank: data.ranks[String(taxId)] ?? 'no rank',
        depth: lineageA.length - i,
      }
    }
  }
  return { taxId: 1, name: 'root', rank: 'no rank', depth: 0 }
}

export function findClosestPairFromData(
  taxIds: [number, number, number],
  data: TaxonomyData,
) {
  const [a, b, c] = taxIds

  const lcaAB = getLcaFromParents(a, b, data)
  const lcaAC = getLcaFromParents(a, c, data)
  const lcaBC = getLcaFromParents(b, c, data)

  const pairs = [
    { lca: lcaAB, s1: a, s2: b, out: c, otherLcas: [lcaAC, lcaBC] },
    { lca: lcaAC, s1: a, s2: c, out: b, otherLcas: [lcaAB, lcaBC] },
    { lca: lcaBC, s1: b, s2: c, out: a, otherLcas: [lcaAB, lcaAC] },
  ]

  const isPolytomy = lcaAB.taxId === lcaAC.taxId && lcaAC.taxId === lcaBC.taxId

  let best = pairs[0]
  for (let i = 1; i < pairs.length; i++) {
    if (
      lcaClosenessScore(pairs[i].lca, data) > lcaClosenessScore(best.lca, data)
    ) {
      best = pairs[i]
    }
  }

  const overallLca =
    lcaClosenessScore(best.otherLcas[0], data) <
    lcaClosenessScore(best.otherLcas[1], data)
      ? best.otherLcas[0]
      : best.otherLcas[1]

  return {
    sister1TaxId: best.s1,
    sister2TaxId: best.s2,
    outgroupTaxId: best.out,
    sisterLca: best.lca,
    overallLca:
      lcaClosenessScore(overallLca, data) < lcaClosenessScore(best.lca, data)
        ? overallLca
        : best.lca,
    isPolytomy,
  } satisfies ClosestPairResult
}

let easyTaxonomyPromise: Promise<TaxonomyData> | undefined
let fullTaxonomyPromise: Promise<TaxonomyData> | undefined
let speciesPoolPromise: Promise<SpeciesPoolEntry[]> | undefined

interface CompactTaxonomyData {
  R: string[]
  D: Record<string, [number, string, number]>
}

function unpackTaxonomyData(compact: CompactTaxonomyData) {
  const parents: Record<string, number> = {}
  const names: Record<string, string> = {}
  const ranks: Record<string, string> = {}
  for (const [id, [parent, name, rankIdx]] of Object.entries(compact.D)) {
    parents[id] = parent
    if (name) {
      names[id] = name
    }
    if (rankIdx >= 0) {
      ranks[id] = compact.R[rankIdx]
    }
  }
  return { parents, names, ranks } satisfies TaxonomyData
}

function fetchTaxonomy(file: string) {
  return fetch(`/taxonomy/${file}`)
    .then(r => {
      if (!r.ok) {
        throw new Error(`Failed to load taxonomy data: ${r.status}`)
      }
      return r.json() as Promise<CompactTaxonomyData>
    })
    .then(unpackTaxonomyData)
}

export function loadEasyTaxonomyData() {
  if (!easyTaxonomyPromise) {
    easyTaxonomyPromise = fetchTaxonomy('parents-easy.json')
  }
  return easyTaxonomyPromise
}

export function loadTaxonomyData() {
  if (!fullTaxonomyPromise) {
    fullTaxonomyPromise = fetchTaxonomy('parents.json')
  }
  return fullTaxonomyPromise
}

export function loadSpeciesPool() {
  if (!speciesPoolPromise) {
    speciesPoolPromise = fetch(`/taxonomy/species-pool.json`).then(r => {
      if (!r.ok) {
        throw new Error(`Failed to load species pool: ${r.status}`)
      }
      return r.json()
    })
  }
  return speciesPoolPromise
}

function isDescendantOf(
  taxId: number,
  ancestorId: number,
  parents: Record<string, number>,
) {
  let current = taxId
  const seen = new Set<number>()
  while (current !== 1 && !seen.has(current)) {
    if (current === ancestorId) {
      return true
    }
    seen.add(current)
    const parent = parents[String(current)]
    if (parent === undefined || parent === current) {
      break
    }
    current = parent
  }
  return current === ancestorId
}

export function findTaxId(query: string, data: TaxonomyData) {
  const trimmed = query.trim()
  if (/^\d+$/.test(trimmed)) {
    const id = Number(trimmed)
    if (data.parents[id] !== undefined || data.names[id] !== undefined) {
      return id
    }
  }
  return findTaxIdByName(trimmed, data)
}

export function findTaxIdByName(query: string, data: TaxonomyData) {
  const lower = query.toLowerCase()
  for (const [id, name] of Object.entries(data.names)) {
    if (name.toLowerCase() === lower) {
      return Number(id)
    }
  }
  return undefined
}

const speciesRanks = new Set(['species', 'subspecies', 'varietas', 'forma'])

export function searchTaxonNames(query: string, data: TaxonomyData, limit = 8) {
  const lower = query.toLowerCase()
  if (lower.length < 2) {
    return []
  }
  const prefixMatches: { id: string; name: string; rank: string }[] = []
  const containsMatches: { id: string; name: string; rank: string }[] = []
  for (const [id, name] of Object.entries(data.names)) {
    const rank = data.ranks[id] ?? ''
    if (speciesRanks.has(rank)) {
      continue
    }
    const nameLower = name.toLowerCase()
    if (nameLower.startsWith(lower)) {
      prefixMatches.push({ id, name, rank })
      if (prefixMatches.length >= limit) {
        break
      }
    } else if (nameLower.includes(lower) && containsMatches.length < limit) {
      containsMatches.push({ id, name, rank })
    }
  }
  return [...prefixMatches, ...containsMatches].slice(0, limit)
}

function getGenus(lineage: number[], data: TaxonomyData) {
  for (const id of lineage) {
    if (data.ranks[String(id)] === 'genus') {
      return id
    }
  }
  return -1
}

function allDistinctGenera(
  lineages: number[][],
  data: TaxonomyData,
) {
  const genera = lineages.map(l => getGenus(l, data))
  for (let i = 0; i < genera.length; i++) {
    if (genera[i] === -1) {
      continue
    }
    for (let j = i + 1; j < genera.length; j++) {
      if (genera[i] === genera[j]) {
        return false
      }
    }
  }
  return true
}

function pickFromAncestor(
  ancestorId: number,
  pool: SpeciesPoolEntry[],
  data: TaxonomyData,
) {
  const matches: SpeciesPoolEntry[] = []
  for (let i = 0; i < pool.length; i++) {
    if (isDescendantOf(pool[i][0], ancestorId, data.parents)) {
      matches.push(pool[i])
    }
  }

  if (matches.length < 3) {
    return undefined
  }

  const ancestorRank = data.ranks[String(ancestorId)]
  const skipDiversityCheck =
    ancestorRank === 'genus' ||
    ancestorRank === 'subgenus' ||
    ancestorRank === 'species group'

  for (let pickAttempt = 0; pickAttempt < 50; pickAttempt++) {
    const indices = new Set<number>()
    while (indices.size < 3) {
      indices.add(Math.floor(Math.random() * matches.length))
    }
    const picks = [...indices].map(i => matches[i])

    if (skipDiversityCheck) {
      return picks
    }

    const lineage0 = getLineageFromParents(picks[0][0], data.parents)
    const lineage1 = getLineageFromParents(picks[1][0], data.parents)
    const lineage2 = getLineageFromParents(picks[2][0], data.parents)

    const genusOrFamily = (lin: number[]) => {
      for (const id of lin) {
        const rank = data.ranks[String(id)]
        if (rank === 'genus' || rank === 'family') {
          return id
        }
      }
      return -1
    }

    const g0 = genusOrFamily(lineage0)
    const g1 = genusOrFamily(lineage1)
    const g2 = genusOrFamily(lineage2)

    if (
      g0 !== g1 && g0 !== g2 && g1 !== g2 &&
      allDistinctGenera([lineage0, lineage1, lineage2], data)
    ) {
      return picks
    }
  }

  const indices = new Set<number>()
  while (indices.size < 3) {
    indices.add(Math.floor(Math.random() * matches.length))
  }
  return [...indices].map(i => matches[i])
}

export function pickThreeFromClade(
  ancestorTaxId: number,
  pool: SpeciesPoolEntry[],
  data: TaxonomyData,
) {
  return pickFromAncestor(ancestorTaxId, pool, data)
}

const targetRankList = ['family', 'order', 'class', 'phylum'] as const

// NCBI taxonomy IDs for major kingdoms
const KINGDOM_IDS = {
  Metazoa: 33208,
  Viridiplantae: 33090,
  Fungi: 4751,
} as const

// Weights for kingdom-based sampling (higher = more frequent)
const KINGDOM_WEIGHTS = {
  Metazoa: 70,
  Viridiplantae: 20,
  Fungi: 5,
  Other: 5,
} as const

type KingdomKey = keyof typeof KINGDOM_WEIGHTS

interface CladeEntry {
  taxId: number
  name: string
  rank: string
  kingdom: KingdomKey
}

let cladeIndexCache:
  | {
      pool: SpeciesPoolEntry[]
      byRank: Map<string, CladeEntry[]>
    }
  | undefined

function buildCladeIndex(pool: SpeciesPoolEntry[], data: TaxonomyData) {
  if (cladeIndexCache && cladeIndexCache.pool === pool) {
    return cladeIndexCache.byRank
  }

  const targetRanks = new Set<string>(targetRankList)
  const cladeCounts = new Map<number, number>()
  const cladeKingdoms = new Map<number, KingdomKey>()

  for (let i = 0; i < pool.length; i++) {
    const lineage = getLineageFromParents(pool[i][0], data.parents)

    let speciesKingdom: KingdomKey = 'Other'
    const lineageSet = new Set(lineage)
    if (lineageSet.has(KINGDOM_IDS.Metazoa)) {
      speciesKingdom = 'Metazoa'
    } else if (lineageSet.has(KINGDOM_IDS.Viridiplantae)) {
      speciesKingdom = 'Viridiplantae'
    } else if (lineageSet.has(KINGDOM_IDS.Fungi)) {
      speciesKingdom = 'Fungi'
    }

    for (const id of lineage) {
      const rank = data.ranks[String(id)]
      if (rank !== undefined && targetRanks.has(rank)) {
        cladeCounts.set(id, (cladeCounts.get(id) ?? 0) + 1)
        if (!cladeKingdoms.has(id)) {
          cladeKingdoms.set(id, speciesKingdom)
        }
      }
    }
  }

  const byRank = new Map<string, CladeEntry[]>()
  for (const r of targetRankList) {
    byRank.set(r, [])
  }

  for (const [taxId, count] of cladeCounts) {
    if (count >= 3) {
      const rank = data.ranks[String(taxId)] ?? ''
      const bucket = byRank.get(rank)
      if (bucket) {
        bucket.push({
          taxId,
          name: data.names[String(taxId)] ?? `Taxon ${taxId}`,
          rank,
          kingdom: cladeKingdoms.get(taxId) ?? 'Other',
        })
      }
    }
  }

  cladeIndexCache = { pool, byRank }
  return byRank
}

function weightedPickFromBucket(clades: CladeEntry[]) {
  const byKingdom: Record<KingdomKey, CladeEntry[]> = {
    Metazoa: [],
    Viridiplantae: [],
    Fungi: [],
    Other: [],
  }
  for (const clade of clades) {
    byKingdom[clade.kingdom].push(clade)
  }

  const available: { key: KingdomKey; weight: number }[] = []
  for (const key of Object.keys(KINGDOM_WEIGHTS) as KingdomKey[]) {
    if (byKingdom[key].length > 0) {
      available.push({ key, weight: KINGDOM_WEIGHTS[key] })
    }
  }

  const totalWeight = available.reduce((s, k) => s + k.weight, 0)
  let r = Math.random() * totalWeight
  let chosenKey: KingdomKey = 'Other'
  for (const { key, weight } of available) {
    r -= weight
    if (r <= 0) {
      chosenKey = key
      break
    }
  }

  const bucket = byKingdom[chosenKey]
  return bucket[Math.floor(Math.random() * bucket.length)]
}

const MICROBIAL_GROUP_NAMES = [
  'Bacteria',
  'Archaea',
  'Fungi',
  'Viruses',
  'Alveolata',
  'Amoebozoa',
  'Euglenozoa',
  'Stramenopiles',
  'Excavata',
  'Metamonada',
  'Haptista',
  'Haptophyta',
  'Cryptophyceae',
  'Sar',
] as const

function getMicrobialGroup(taxId: number, data: TaxonomyData) {
  let current = taxId
  const seen = new Set<number>()
  while (current !== 1 && !seen.has(current)) {
    seen.add(current)
    const name = data.names[String(current)]
    if (name) {
      for (const group of MICROBIAL_GROUP_NAMES) {
        if (name === group) {
          return group
        }
      }
    }
    const parent = data.parents[String(current)]
    if (parent === undefined || parent === current) {
      break
    }
    current = parent
  }
  return undefined
}

let microbialGroupCache:
  | { pool: SpeciesPoolEntry[]; byGroup: Map<string, SpeciesPoolEntry[]> }
  | undefined

function getMicrobialGroups(pool: SpeciesPoolEntry[], data: TaxonomyData) {
  if (microbialGroupCache && microbialGroupCache.pool === pool) {
    return microbialGroupCache.byGroup
  }
  const byGroup = new Map<string, SpeciesPoolEntry[]>()
  for (const entry of pool) {
    const group = getMicrobialGroup(entry[0], data)
    if (group) {
      let bucket = byGroup.get(group)
      if (!bucket) {
        bucket = []
        byGroup.set(group, bucket)
      }
      bucket.push(entry)
    }
  }
  microbialGroupCache = { pool, byGroup }
  return byGroup
}

export function pickThreeMicrobialCrossKingdom(
  pool: SpeciesPoolEntry[],
  data: TaxonomyData,
) {
  const byGroup = getMicrobialGroups(pool, data)
  const groupNames = [...byGroup.keys()].filter(
    g => (byGroup.get(g)?.length ?? 0) > 0,
  )
  if (groupNames.length < 3) {
    return undefined
  }

  for (let attempt = 0; attempt < 30; attempt++) {
    const shuffled = [...groupNames]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      const tmp = shuffled[i]
      shuffled[i] = shuffled[j]
      shuffled[j] = tmp
    }
    const threeGroups = shuffled.slice(0, 3)
    const picks: SpeciesPoolEntry[] = []
    for (const g of threeGroups) {
      const bucket = byGroup.get(g)!
      picks.push(bucket[Math.floor(Math.random() * bucket.length)])
    }
    const taxIds: [number, number, number] = [
      picks[0][0],
      picks[1][0],
      picks[2][0],
    ]
    const pair = findClosestPairFromData(taxIds, data)
    if (!pair.isPolytomy) {
      return picks
    }
  }
  return undefined
}

const MICROBIAL_ROUND_CHANCE = 0.05

export function pickThreeHardModeDistance(
  pool: SpeciesPoolEntry[],
  data: TaxonomyData,
): HardModeResult {
  if (Math.random() < MICROBIAL_ROUND_CHANCE) {
    const picks = pickThreeMicrobialCrossKingdom(pool, data)
    if (picks) {
      return {
        picks,
        clade: { taxId: 0, name: 'Microorganisms', rank: '' },
      }
    }
  }

  const byRank = buildCladeIndex(pool, data)
  const nonEmptyRanks = targetRankList.filter(
    r => (byRank.get(r)?.length ?? 0) > 0,
  )

  for (let attempt = 0; attempt < 20; attempt++) {
    const rank = nonEmptyRanks[Math.floor(Math.random() * nonEmptyRanks.length)]
    const bucket = byRank.get(rank)!
    const clade = weightedPickFromBucket(bucket)
    const result = pickFromAncestor(clade.taxId, pool, data)
    if (result) {
      return { picks: result, clade }
    }
  }

  return { picks: pickThreeHardMode(pool, data) }
}

export function pickThreeHardMode(
  pool: SpeciesPoolEntry[],
  data: TaxonomyData,
) {
  for (let attempt = 0; attempt < 100; attempt++) {
    const indices = new Set<number>()
    while (indices.size < 3) {
      indices.add(Math.floor(Math.random() * pool.length))
    }
    const picks = [...indices].map(i => pool[i])

    const lineage0 = getLineageFromParents(picks[0][0], data.parents)
    const lineage1 = getLineageFromParents(picks[1][0], data.parents)
    const lineage2 = getLineageFromParents(picks[2][0], data.parents)

    const genusOrFamily = (lin: number[]) => {
      for (const id of lin) {
        const rank = data.ranks[String(id)]
        if (rank === 'genus' || rank === 'family') {
          return id
        }
      }
      return -1
    }

    const g0 = genusOrFamily(lineage0)
    const g1 = genusOrFamily(lineage1)
    const g2 = genusOrFamily(lineage2)

    if (
      g0 !== g1 && g0 !== g2 && g1 !== g2 &&
      allDistinctGenera([lineage0, lineage1, lineage2], data)
    ) {
      return picks
    }
  }
  const indices = new Set<number>()
  while (indices.size < 3) {
    indices.add(Math.floor(Math.random() * pool.length))
  }
  return [...indices].map(i => pool[i])
}

const rankScore: Record<string, number> = {
  subspecies: 9,
  species: 8,
  subgenus: 7,
  genus: 6,
  subtribe: 5.7,
  tribe: 5.5,
  subfamily: 5.3,
  family: 5,
  superfamily: 4.5,
  infraorder: 4.4,
  suborder: 4.3,
  order: 4,
  superorder: 3.8,
  subclass: 3.5,
  class: 3,
  superclass: 2.8,
  subphylum: 2.5,
  phylum: 2,
  kingdom: 1,
  superkingdom: 0.5,
}

export function lcaClosenessScore(lca: LcaResult, data?: TaxonomyData) {
  const rs = rankScore[lca.rank]
  if (rs !== undefined) {
    return rs * 1000 + lca.depth
  }
  if (data) {
    const lineage = getLineageFromParents(lca.taxId, data.parents)
    for (let i = 1; i < lineage.length; i++) {
      const ancestorRank = data.ranks[String(lineage[i])]
      if (ancestorRank !== undefined && rankScore[ancestorRank] !== undefined) {
        return rankScore[ancestorRank] * 1000 + lca.depth
      }
    }
  }
  return lca.depth
}

export function getAllPairLcas(taxIds: number[], data: TaxonomyData) {
  const pairs: {
    i: number
    j: number
    taxIdA: number
    taxIdB: number
    lca: LcaResult
  }[] = []
  for (let i = 0; i < taxIds.length; i++) {
    for (let j = i + 1; j < taxIds.length; j++) {
      const lca = getLcaFromParents(taxIds[i], taxIds[j], data)
      pairs.push({ i, j, taxIdA: taxIds[i], taxIdB: taxIds[j], lca })
    }
  }
  pairs.sort(
    (a, b) => lcaClosenessScore(b.lca, data) - lcaClosenessScore(a.lca, data),
  )
  return pairs
}

export function pickNFromClade(
  count: number,
  ancestorTaxId: number,
  pool: SpeciesPoolEntry[],
  data: TaxonomyData,
) {
  const matches: SpeciesPoolEntry[] = []
  for (let i = 0; i < pool.length; i++) {
    if (isDescendantOf(pool[i][0], ancestorTaxId, data.parents)) {
      matches.push(pool[i])
    }
  }
  if (matches.length < count) {
    return undefined
  }

  for (let pickAttempt = 0; pickAttempt < 50; pickAttempt++) {
    const indices = new Set<number>()
    while (indices.size < count) {
      indices.add(Math.floor(Math.random() * matches.length))
    }
    const picks = [...indices].map(i => matches[i])

    const genera = new Set<number>()
    let duplicate = false
    for (const pick of picks) {
      const g = getGenus(getLineageFromParents(pick[0], data.parents), data)
      if (g !== -1) {
        if (genera.has(g)) {
          duplicate = true
          break
        }
        genera.add(g)
      }
    }
    if (!duplicate) {
      return picks
    }
  }

  const indices = new Set<number>()
  while (indices.size < count) {
    indices.add(Math.floor(Math.random() * matches.length))
  }
  return [...indices].map(i => matches[i])
}

export function pickNHardModeDistance(
  count: number,
  pool: SpeciesPoolEntry[],
  data: TaxonomyData,
  minRank?: 'family' | 'order' | 'class' | 'phylum',
): HardModeResult {
  const byRank = buildCladeIndex(pool, data)
  const minRankIdx = minRank ? targetRankList.indexOf(minRank) : 0
  const nonEmptyRanks = targetRankList.filter(
    (r, i) => i >= minRankIdx && (byRank.get(r)?.length ?? 0) > 0,
  )

  for (let attempt = 0; attempt < 20; attempt++) {
    const rank = nonEmptyRanks[Math.floor(Math.random() * nonEmptyRanks.length)]
    const bucket = byRank.get(rank)!
    const clade = bucket[Math.floor(Math.random() * bucket.length)]

    const matches: SpeciesPoolEntry[] = []
    for (let i = 0; i < pool.length; i++) {
      if (isDescendantOf(pool[i][0], clade.taxId, data.parents)) {
        matches.push(pool[i])
      }
    }
    if (matches.length < count) {
      continue
    }

    const result = pickNFromClade(count, clade.taxId, pool, data)
    if (result) {
      const taxIds = result.map(r => r[0])
      const pairs = getAllPairLcas(taxIds, data)
      if (pairs.length < 2) {
        continue
      }
      if (
        lcaClosenessScore(pairs[0].lca, data) ===
        lcaClosenessScore(pairs[1].lca, data)
      ) {
        continue
      }
      const distinctScores = new Set(
        pairs.map(p => lcaClosenessScore(p.lca, data)),
      )
      if (distinctScores.size >= Math.min(4, pairs.length)) {
        return { picks: result, clade }
      }
    }
  }

  for (let attempt = 0; attempt < 10; attempt++) {
    const result = pickNFromClade(count, 1, pool, data)
    if (result) {
      const taxIds = result.map(r => r[0])
      const pairs = getAllPairLcas(taxIds, data)
      if (
        pairs.length >= 2 &&
        lcaClosenessScore(pairs[0].lca, data) !==
          lcaClosenessScore(pairs[1].lca, data)
      ) {
        return { picks: result }
      }
    }
  }

  return { picks: pickNFromClade(count, 1, pool, data) ?? pool.slice(0, count) }
}

export interface DiagramNode {
  label: string
  highlight?: boolean
  taxId?: number
  wikiLink?: string
  children?: DiagramNode[]
}

const landmarks: Record<string, string> = {
  // deep tree of life
  Metazoa: 'all animals',
  Bilateria: 'animals with left-right symmetry',
  Protostomia: '"mouth first" — includes insects, snails, worms',
  Deuterostomia: '"anus first" — includes vertebrates, starfish',
  Opisthokonta: 'animals + fungi — closer to each other than to plants!',
  Eukaryota: 'all complex life — cells with nuclei',

  // vertebrate backbone
  Chordata: 'includes all vertebrates, plus sea squirts and lancelets',
  Vertebrata: 'animals with backbones',
  Gnathostomata: 'jawed vertebrates',
  Osteichthyes: 'bony fish and technically all their descendants',
  Sarcopterygii: 'lobe-finned fish — includes all land animals too!',
  Tetrapoda: 'four-limbed vertebrates — includes snakes, which lost theirs!',
  Amniota: 'land-egg vertebrates — includes reptiles, birds, mammals',

  // mammals
  Synapsida: 'the mammal lineage',
  Mammalia: 'includes humans, dogs, whales, bats, mice...',
  Theria: 'mammals that give live birth',
  Eutheria: 'placental mammals',
  Marsupialia: 'pouched mammals, e.g. kangaroos, koalas, possums',
  Monotremata: 'egg-laying mammals! just platypus + echidnas',
  Afrotheria: 'includes elephants, manatees, aardvarks',
  Xenarthra: 'sloths, armadillos, anteaters',
  Laurasiatheria: 'bats, cats, whales, horses',
  Euarchontoglires: 'primates, rodents, rabbits',
  Boreoeutheria: 'includes most placental mammals',
  Primates: 'includes monkeys, apes, lemurs, tarsiers',
  Strepsirrhini: 'wet-nosed primates — lemurs, lorises, galagos',
  Haplorhini: 'dry-nosed primates — tarsiers, monkeys, apes',
  Simiiformes: 'monkeys and apes',
  Catarrhini: 'Old World monkeys + apes — baboons to humans',
  Hominidae: 'the great apes — includes humans!',
  Homininae: 'African great apes + humans',
  Rodentia: '40% of all mammal species — mice, rats, squirrels',
  Lagomorpha: 'rabbits, hares, pikas — not rodents!',
  Carnivora: 'includes cats, dogs, bears, seals, and pandas',
  Feliformia: 'cat-side — cats, hyenas, mongooses, civets',
  Caniformia: 'dog-side — dogs, bears, seals, weasels, raccoons',
  Mustelidae: 'includes weasels, otters, wolverines, badgers',
  Cetacea: 'whales and dolphins — descended from land animals!',
  Cetartiodactyla: 'hippos are the closest living relatives of whales!',
  Chiroptera: 'bats — the only truly flying mammals',
  Perissodactyla: 'odd-toed ungulates — includes horses, rhinos, tapirs',
  Artiodactyla: 'even-toed ungulates — includes deer, pigs, cattle, hippos',
  Ruminantia: 'cud-chewers, e.g. cattle, deer, goats, antelope',
  Bovidae: 'includes cattle, goats, sheep, antelope',
  Cervidae: 'deer family, e.g. deer, elk, moose',
  Suina: 'pigs and peccaries',
  Proboscidea: 'elephants — closest relatives are hyraxes and manatees!',
  Hyracoidea: 'hyraxes — look like guinea pigs, but closest relatives are elephants!',
  Tubulidentata: 'aardvark — the sole member of its entire order',
  Didelphimorphia: 'American opossums — only marsupials in North America',
  Canidae: 'dogs, wolves, foxes, jackals, dholes',
  Felidae: 'cats — from domestic cats to lions and cheetahs',
  Ursidae: 'bears — includes polar bears, giant pandas, sun bears',
  Equidae: 'horses, donkeys, zebras — interbreed but offspring are sterile',
  Camelidae: 'camels, llamas, alpacas, vicuñas',
  Muridae: 'mice and rats — most species-rich mammal family',
  Sciuridae: 'squirrels, ground squirrels, prairie dogs, chipmunks',
  Cercopithecidae: 'Old World monkeys — baboons, macaques, vervets',
  Platyrrhini: 'New World monkeys — spider monkeys, capuchins',
  Phocidae: 'earless seals — harbor, leopard, elephant seals',
  Procyonidae: 'raccoons, coatis, ringtails, kinkajous',
  Pilosa: 'sloths and anteaters',
  Cingulata: 'armadillos',
  Eulipotyphla: 'includes hedgehogs, shrews, moles',
  Scandentia: 'tree shrews — not actually shrews!',
  Dermoptera: 'colugos ("flying lemurs")',
  Pholidota: 'pangolins — the only scaly mammals',
  Sirenia: 'manatees and dugongs — related to elephants!',
  Diprotodontia: 'includes kangaroos, koalas, wombats',

  // reptiles and birds
  Sauropsida: 'the reptile + bird lineage',
  Archelosauria: 'turtles are closer to birds than to lizards!',
  Archosauria: 'includes crocodilians + dinosaurs (including birds!)',
  Dinosauria: 'not extinct — birds are living dinosaurs!',
  Aves: 'birds — living dinosaurs',
  Neognathae: 'most living birds',
  Palaeognathae: 'includes ostriches, emus, kiwis',
  Neoaves: 'most modern birds',
  Passeriformes: 'perching birds — over half of all bird species!',
  Accipitriformes: 'includes hawks, eagles, vultures',
  Psittaciformes: 'parrots — includes macaws, cockatoos',
  Strigiformes: 'owls',
  Galliformes: 'includes chickens, turkeys, pheasants',
  Anseriformes: 'includes ducks, geese, swans',
  Sphenisciformes: 'penguins',
  Pelecaniformes: 'includes pelicans, herons, ibises',
  Falconiformes: 'falcons — closer to parrots than to hawks!',
  Caprimulgiformes: 'includes nightjars and hummingbirds — unlikely relatives!',
  Columbiformes: 'pigeons and doves — one of the most widespread bird orders',
  Charadriiformes: 'shorebirds — gulls, sandpipers, auks, puffins',
  Piciformes: 'includes woodpeckers, toucans, and honeyguides',
  Coraciiformes: 'kingfishers, bee-eaters, rollers',
  Gruiformes: 'cranes, rails, coots',
  Cuculiformes: 'cuckoos — lay eggs in other birds\' nests',
  Corvidae: 'crows, ravens, jays — make tools, recognize faces',
  Trochilidae: 'hummingbirds — can hover and fly backwards',
  Lepidosauria: 'includes lizards, snakes, tuatara',
  Squamata: 'lizards and snakes — snakes evolved from lizards',
  Serpentes: 'snakes — 3,700+ species',
  Viperidae: 'vipers — rattlesnakes, puff adders, gaboon vipers',
  Elapidae: 'cobras, mambas, coral snakes, sea snakes',
  Gekkota: 'geckos — grip smooth ceilings with adhesive toes',
  Varanidae: 'monitor lizards — includes Komodo dragon',
  Chamaeleonidae: 'chameleons — mobile eyes, ballistic tongue',
  Testudines: 'turtles and tortoises — some live over 150 years',
  Crocodylia: 'crocodiles and alligators — closer to birds than to lizards!',
  Reptilia: 'includes turtles, lizards, snakes, crocodilians',
  Rhynchocephalia: 'tuatara — sole survivor of its entire order!',

  // amphibians
  Amphibia: 'frogs, salamanders, caecilians',
  Anura: 'frogs and toads — 7,000+ species',
  Caudata: 'salamanders and newts — can regenerate lost limbs',
  Gymnophiona: 'caecilians — legless, mistaken for worms',
  Dendrobatidae: 'poison dart frogs — toxins used on blowgun darts',

  // fish
  Actinopterygii: 'ray-finned fishes — 99% of fish species',
  Teleostei: 'most living bony fishes — over 30,000 species',
  Ostariophysi: 'carps, catfish, characins, electric eels',
  Acanthomorpha: 'spiny-rayed fishes — ~1/3 of all vertebrates',
  Chondrichthyes: 'sharks, rays, skates — skeletons made of cartilage',
  Dipnoi: 'lungfishes — can breathe air!',
  Perciformes: 'perch-like fishes',
  Cypriniformes: 'includes carps and minnows',
  Salmoniformes: 'includes salmon and trout',
  Tetraodontiformes: 'includes pufferfish and ocean sunfish',
  Anguilliformes: 'eels',
  Syngnathiformes: 'includes seahorses and pipefish',
  Petromyzontiformes: 'lampreys — jawless parasitic fish',
  Myxini: 'hagfish — produce slime to escape predators',
  Clupeiformes: 'herrings, sardines, anchovies',
  Siluriformes: 'catfish — named for their whisker-like barbels',
  Gadiformes: 'cod, haddock, pollock',
  Pleuronectiformes: 'flatfishes — flounder, halibut; eyes on one side',
  Lamniformes: 'mackerel sharks — great white, mako, thresher',
  Orectolobiformes: 'carpet sharks — includes whale shark',
  Carcharhiniformes: 'ground sharks — tiger, bull, hammerhead',
  Acipenseriformes: 'sturgeons and paddlefish — source of caviar',
  Coelacanthiformes: 'coelacanths — thought extinct until 1938',
  Cichliformes: 'cichlids — rapid evolution in African rift lakes',
  Myliobatiformes: 'stingrays, manta rays, eagle rays',
  Batoidea: 'rays and skates — flat relatives of sharks',

  // arthropods
  Arthropoda: 'includes insects, spiders, crabs — most species on Earth',
  Pancrustacea: 'insects are actually land crustaceans!',
  Hexapoda: 'six-legged arthropods — includes insects and springtails',
  Insecta:
    'includes beetles, butterflies, ants — ~80% of known animal species!',
  Pterygota: 'winged insects — all insects except silverfish and springtails',
  Neoptera: 'most winged insects — can fold wings flat',
  Polyneoptera: 'cockroaches, grasshoppers, mantises, earwigs',
  Paraneoptera: 'includes Hemiptera, lice, and thrips',
  Endopterygota:
    'insects with complete metamorphosis, e.g. beetles, flies, butterflies',
  Coleoptera: 'beetles — 1 in 4 animal species is a beetle!',
  Lepidoptera: 'butterflies and moths — larvae are caterpillars',
  Phasmatodea: 'stick insects — elaborate camouflage',
  Hymenoptera: 'includes ants, bees, wasps',
  Diptera: 'true flies — only two wings, not four!',
  Hemiptera: 'includes true bugs, cicadas, aphids',
  Orthoptera: 'includes grasshoppers, crickets, katydids',
  Odonata: 'dragonflies and damselflies',
  Blattodea: 'cockroaches and termites — yes, termites are cockroaches!',
  Mantodea: 'praying mantises',
  Siphonaptera: 'fleas',
  Neuroptera: 'includes lacewings and antlions',
  Mecoptera: 'scorpionflies',
  Dermaptera: 'earwigs',
  Ephemeroptera: 'mayflies — adults live only hours to days',
  Trichoptera: 'caddisflies — larvae build silk and sand cases',
  Collembola: 'springtails — jump with spring-loaded abdomen',
  Chelicerata: 'includes spiders, scorpions, horseshoe crabs',
  Arachnida:
    'eight-legged arthropods — includes spiders, scorpions, ticks, mites',
  Araneae: 'spiders — all produce silk; ~45,000 species',
  Acari: 'ticks and mites — most species-rich arachnids',
  Opiliones: 'harvestmen (daddy longlegs) — not spiders; no silk',
  Scorpiones: 'scorpions — older than dinosaurs!',
  Crustacea: 'includes crabs, shrimp, lobsters, barnacles',
  Decapoda: 'ten-legged crustaceans, e.g. crabs, lobsters, shrimp',
  Anomura: 'hermit crabs and coconut crabs — not true crabs!',
  Brachyura: 'true crabs',
  Isopoda: 'includes woodlice, pill bugs — crustaceans on land!',
  Cirripedia: 'barnacles — Darwin spent 8 years studying them',
  Myriapoda: 'centipedes and millipedes',

  // other invertebrates
  Mollusca: 'includes snails, clams, octopuses',
  Cephalopoda: 'includes octopuses, squid, nautilus',
  Gastropoda: 'snails and slugs',
  Bivalvia: 'includes clams, mussels, oysters',
  Polyplacophora: 'chitons — 8 shell plates; curl into a ball',
  Cnidaria: 'includes jellyfish, corals, anemones',
  Anthozoa: 'corals and sea anemones',
  Hydrozoa: 'includes hydroids and man-o-war',
  Scyphozoa: 'true jellyfish',
  Echinodermata: 'includes starfish, sea urchins, sea cucumbers',
  Eleutherozoa: 'echinoderms that move freely — starfish, urchins, cucumbers; excludes sessile crinoids',
  Asterozoa: 'star-shaped echinoderms — starfish + brittle stars',
  Echinozoa: 'sea urchins + sea cucumbers — the non-star Eleutherozoa',
  Asteroidea: 'starfish',
  Echinoidea: 'sea urchins and sand dollars',
  Crinoidea: 'feather stars and sea lilies',
  Articulata: 'all living crinoids — feather stars and stalked sea lilies',
  Comatulida: 'feather stars — free-moving crinoids; sea lilies are their stalked relatives',
  Ophiuroidea: 'brittle stars',
  Holothuroidea: 'sea cucumbers — eject organs as defense',
  Annelida: 'segmented worms, e.g. earthworms, leeches, bristle worms',
  Polychaeta: 'bristle worms — tube worms, Christmas tree worms',
  Brachiopoda: 'lamp shells — look like clams, separate phylum',
  Stomatopoda: 'mantis shrimp — 16 color receptors vs our 3',
  Xiphosura: 'horseshoe crabs — closer to spiders than crabs',
  Nudibranchia: 'sea slugs — steal stinging cells from prey',
  Foraminifera: 'forams — shells make up many limestones',
  Nematoda: 'roundworms — 4 out of 5 animals on Earth!',
  Platyhelminthes: 'flatworms and tapeworms',
  Porifera: 'sponges — among the simplest animals',
  Ctenophora: 'comb jellies — possibly the oldest animal lineage',
  Tardigrada: 'tardigrades — can survive in space!',
  Onychophora: 'velvet worms — shoot slime to catch prey',
  Tunicata: 'sea squirts — blobs on rocks, yet our nearest relatives!',
  Nemertea: 'ribbon worms — possibly the longest animals ever',
  Sipuncula: 'peanut worms — retract front end like a peanut',
  Xenacoelomorpha: 'simple worm-like animals',
  Lophotrochozoa: 'includes molluscs, worms, bryozoans',
  Ecdysozoa: 'animals that moult, e.g. insects, crabs, roundworms',
  Spiralia: 'includes molluscs, annelids, flatworms',

  // plants
  Viridiplantae: 'all green plants',
  Embryophyta: 'land plants — colonized land ~470 million years ago',
  Tracheophyta: 'vascular plants — includes ferns, trees, grasses',
  Spermatophyta: 'seed plants',
  Angiospermae: 'flowering plants — 90% of all plant species',
  Magnoliopsida: 'flowering plants',
  eudicotyledons: 'eudicots — most flowering plants',
  Liliopsida: 'monocots — includes grasses, orchids, palms',
  Rosidae: 'includes roses, legumes, oaks, maples',
  Asteridae: 'includes sunflowers, mints, carrots, tomatoes',
  Fabales: 'includes legumes, peanuts, beans',
  Fabaceae: 'legumes — peanuts, beans; fix nitrogen from air',
  Rosaceae: 'includes roses, strawberries, almonds, apples, cherries',
  Asteraceae: 'largest plant family! includes daisies, sunflowers, dandelions',
  Solanaceae: 'nightshades — includes tomatoes, potatoes, peppers, tobacco',
  Brassicaceae: 'one species gave us cabbage, broccoli, kale, and cauliflower!',
  Poaceae: 'grasses — includes wheat, rice, bamboo, corn',
  Orchidaceae: 'orchids — second-largest flowering plant family',
  Arecaceae: 'palms — coconut, date, oil palm, rattan',
  Cactaceae: 'cacti — open stomata at night to conserve water',
  Malvaceae: 'includes cacao, cotton, baobabs, hibiscus',
  Apiaceae: 'includes carrots, celery, parsley, and poison hemlock',
  Ericaceae: 'includes blueberries, cranberries, rhododendrons',
  Sapindaceae: 'includes maples and lychees',
  Fagaceae: 'includes oaks, beeches, chestnuts',
  Lauraceae: 'includes avocado, cinnamon, bay laurel',
  Caryophyllales: 'includes cacti, venus flytraps, beets',
  Lamiales: 'includes mints, olives, snapdragons',
  Gentianales: 'includes coffee and milkweed',
  Malpighiales: 'includes willows, violets, poinsettias, rubber trees',
  Cucurbitaceae: 'cucurbits — includes cucumbers, melons, pumpkins, squash',
  Rutaceae: 'citrus family — includes oranges, lemons, limes',
  Euphorbiaceae: 'includes rubber tree, cassava, poinsettia',
  Vitaceae: 'grapes, Virginia creeper',
  Moraceae: 'figs, mulberries, breadfruit',
  Amaryllidaceae: 'onions, garlic, leeks, daffodils',
  Cycadopsida: 'cycads — lived alongside dinosaurs; some 1000+ yrs',
  Musaceae: 'bananas — "trunk" is not woody tissue',
  Zingiberaceae: 'ginger, turmeric, cardamom, galangal',
  Bromeliaceae: 'bromeliads — includes pineapple',
  Myrtaceae: 'includes eucalyptus, cloves, guava, allspice, feijoa',
  Ranunculales: 'includes buttercups, poppies, barberries, columbines',
  Pinopsida: 'conifers — pines, spruces, firs, tallest and oldest trees',
  Ginkgoopsida: 'ginkgo — sole survivor, unchanged for 200M years',
  Gnetales: 'includes welwitschia — lives 1000+ years with just 2 leaves!',
  Bryophyta: 'mosses — survive complete desiccation and rehydrate',
  Polypodiopsida: 'ferns — older than flowering plants',
  Magnoliidae: 'includes magnolias, avocados, black pepper',

  // fungi and microbes
  Fungi: 'mushrooms, yeasts, molds — closer to animals than plants!',
  Agaricomycetes: 'most gilled mushrooms — chanterelles, porcini, amanitas',
  Glomeromycota: 'mycorrhizal fungi — in roots of 80% of land plants',
  Chytridiomycota: 'chytrids — one species decimated dozens of frog species',
  Ascomycota: 'includes yeasts, morels, truffles, penicillium',
  Basidiomycota: 'includes mushrooms, puffballs, rusts',
  Saccharomycetes: "baker's yeast, brewer's yeast",
  Bacteria: 'single-celled organisms without nuclei',
  Cyanobacteria: 'produced Earth\'s oxygen 2.4 Bya; gave us chloroplasts',
  Proteobacteria: 'largest bacterial phylum — E. coli, Salmonella, rhizobia',
  Actinomycetota: 'soil bacteria — source of most antibiotic drugs',
  Spirochaetota: 'spiral bacteria — Lyme disease, syphilis',
  Dinoflagellata: 'cause red tides; some bioluminescent, some in coral',
  Archaea: 'single-celled organisms — not bacteria!',
  Asgardarchaeota: 'archaea closest to eukaryotes — our nearest prokaryotic relatives',
  Alveolata: 'includes ciliates, dinoflagellates, malaria parasites',
  Amoebozoa: 'amoebas and slime molds',
  Stramenopiles: 'includes kelp, diatoms, water molds',
  Sar: 'a vast group of mostly single-celled life',
  Apicomplexa: 'includes malaria parasites',
  Ciliophora: 'ciliates, e.g. paramecium, stentor',
  Microsporidia: 'tiny intracellular parasites — actually degenerate fungi!',
  Oomycota: 'water molds — caused the Irish potato famine',
  Bacillariophyta: 'diatoms — tiny algae in glass shells',
  Phaeophyceae: 'brown algae, e.g. kelp, sargassum',
  Myxozoa: 'tiny animal parasites — degenerate jellyfish relatives!',
  Euglenozoa: 'includes euglenids and trypanosomes',
  Rhodophyta: 'red algae — used to make agar and nori',
  Chlorophyta: 'green algae — ancestors of all land plants',
  Haptophyta: 'coccolithophores — built White Cliffs of Dover',
  Choanoflagellatea: 'closest unicellular relatives of animals',
  Bacillota: 'gram-positive bacteria — Lactobacillus, Bacillus, Clostridium',
}

function annotateLabel(name: string) {
  const displayName = displayNameOverrides[name] ?? name
  const hint = landmarks[name]
  if (hint) {
    return `${displayName} (${hint})`
  }
  return displayName
}

const contextRanks = new Set([
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

interface CladePair {
  branch: { taxId: number; name: string } | undefined
  leaf: { taxId: number; name: string } | undefined
}

function findClades(
  lineage: number[],
  aboveTaxId: number,
  data: TaxonomyData,
): CladePair {
  const idx = lineage.indexOf(aboveTaxId)
  if (idx <= 0) {
    return { branch: undefined, leaf: undefined }
  }
  const clades: { taxId: number; name: string }[] = []
  for (let i = idx - 1; i >= 0; i--) {
    const rank = data.ranks[String(lineage[i])]
    if (rank && contextRanks.has(rank)) {
      clades.push({
        taxId: lineage[i],
        name: data.names[String(lineage[i])] ?? String(lineage[i]),
      })
    }
  }
  if (clades.length === 0) {
    const taxId = lineage[idx - 1]
    return {
      branch: undefined,
      leaf: { taxId, name: data.names[String(taxId)] ?? String(taxId) },
    }
  }
  if (clades.length === 1) {
    return { branch: undefined, leaf: clades[0] }
  }
  return { branch: clades[0], leaf: clades[clades.length - 1] }
}

function makeLeafLabel(
  organism: { commonName: string },
  clade: { name: string } | undefined,
) {
  if (clade) {
    const hint = landmarks[clade.name]
    if (hint) {
      return `${clade.name} — ${hint} (${organism.commonName})`
    }
    return `${clade.name} (${organism.commonName})`
  }
  return organism.commonName
}

const wikiNameOverrides: Record<string, string> = {
  Sar: 'SAR_supergroup',
}

const displayNameOverrides: Record<string, string> = {
  Sar: 'SAR supergroup',
}

function wikiUrl(name: string) {
  const wikiName = wikiNameOverrides[name] ?? name
  return `https://en.wikipedia.org/wiki/${encodeURIComponent(wikiName)}`
}

function makeBranchNode(
  organism: { ncbiTaxId?: number; commonName: string },
  clades: CladePair,
  highlight?: boolean,
): DiagramNode {
  const leafClade = clades.leaf ?? clades.branch
  const leafLabel = makeLeafLabel(organism, leafClade)
  const leaf: DiagramNode = {
    label: leafLabel,
    wikiLink: wikiUrl(leafClade?.name ?? organism.commonName),
    taxId: organism.ncbiTaxId,
  }
  if (highlight) {
    leaf.highlight = true
  }
  if (
    clades.branch &&
    clades.leaf &&
    clades.branch.taxId !== clades.leaf.taxId
  ) {
    const node: DiagramNode = {
      label: annotateLabel(clades.branch.name),
      wikiLink: wikiUrl(clades.branch.name),
      children: [leaf],
    }
    if (highlight) {
      node.highlight = true
    }
    return node
  }
  return leaf
}

export function buildContextDiagram(
  sister1: { ncbiTaxId: number; commonName: string },
  sister2: { ncbiTaxId: number; commonName: string },
  outgroup: { ncbiTaxId: number; commonName: string },
  sisterLcaTaxId: number,
  overallLcaTaxId: number,
  data: TaxonomyData,
): DiagramNode | undefined {
  if (sisterLcaTaxId === overallLcaTaxId) {
    return undefined
  }

  const getName = (taxId: number) => data.names[String(taxId)] ?? String(taxId)

  const lin1 = getLineageFromParents(sister1.ncbiTaxId, data.parents)
  const lin2 = getLineageFromParents(sister2.ncbiTaxId, data.parents)
  const linOut = getLineageFromParents(outgroup.ncbiTaxId, data.parents)

  const outIdx = linOut.indexOf(overallLcaTaxId)
  if (outIdx <= 0) {
    return undefined
  }

  const outClades = findClades(linOut, overallLcaTaxId, data)
  const s1Clades = findClades(lin1, sisterLcaTaxId, data)
  const s2Clades = findClades(lin2, sisterLcaTaxId, data)

  const outNode = makeBranchNode(outgroup, outClades)

  const sisterName = getName(sisterLcaTaxId)
  const sisterNode: DiagramNode = {
    label: annotateLabel(sisterName),
    wikiLink: wikiUrl(sisterName),
    highlight: true,
    children: [
      makeBranchNode(sister1, s1Clades, true),
      makeBranchNode(sister2, s2Clades, true),
    ],
  }

  const overallName = getName(overallLcaTaxId)
  return {
    label: annotateLabel(overallName),
    wikiLink: wikiUrl(overallName),
    children: [outNode, sisterNode],
  }
}

export function expandDiagramUp(
  diagram: DiagramNode,
  rootTaxId: number,
  data: TaxonomyData,
): { diagram: DiagramNode; rootTaxId: number } | undefined {
  const lineage = getLineageFromParents(rootTaxId, data.parents)
  const rootIdx = lineage.indexOf(rootTaxId)
  if (rootIdx < 0 || rootIdx >= lineage.length - 1) {
    return undefined
  }

  for (let i = rootIdx + 1; i < lineage.length; i++) {
    const taxId = lineage[i]
    const name = data.names[String(taxId)]
    const rank = data.ranks[String(taxId)]
    if (name && rank && contextRanks.has(rank)) {
      return {
        diagram: {
          label: annotateLabel(name),
          wikiLink: wikiUrl(name),
          children: [diagram],
        },
        rootTaxId: taxId,
      }
    }
  }

  const parentTaxId = lineage[rootIdx + 1]
  const parentName = data.names[String(parentTaxId)] ?? String(parentTaxId)
  return {
    diagram: {
      label: annotateLabel(parentName),
      wikiLink: wikiUrl(parentName),
      children: [diagram],
    },
    rootTaxId: parentTaxId,
  }
}

export function buildTreeFromLineages(
  organisms: {
    ncbiTaxId: number
    commonName: string
    scientificName: string
  }[],
  nameMap: Record<number, { name: string; rank: string }>,
  lineageMap?: Record<number, number[]>,
  taxonomyData?: TaxonomyData,
) {
  const importantRanks = new Set([
    'domain',
    'kingdom',
    'phylum',
    'class',
    'order',
    'family',
    'genus',
    'species',
  ])

  const orgTaxIds = new Set(organisms.map(o => o.ncbiTaxId))
  const orgLineages = new Map<number, number[]>()
  for (const org of organisms) {
    if (lineageMap && lineageMap[org.ncbiTaxId]) {
      orgLineages.set(org.ncbiTaxId, lineageMap[org.ncbiTaxId])
    } else if (taxonomyData) {
      orgLineages.set(
        org.ncbiTaxId,
        getLineageFromParents(org.ncbiTaxId, taxonomyData.parents),
      )
    }
  }

  const childMap = new Map<number, Set<number>>()
  const allNodes = new Set<number>()

  for (const [, lineage] of orgLineages) {
    for (let i = 0; i < lineage.length - 1; i++) {
      allNodes.add(lineage[i])
      allNodes.add(lineage[i + 1])
      let children = childMap.get(lineage[i + 1])
      if (!children) {
        children = new Set()
        childMap.set(lineage[i + 1], children)
      }
      children.add(lineage[i])
    }
  }

  function buildNode(taxId: number): TreeNode | undefined {
    const children: TreeNode[] = []
    const kids = childMap.get(taxId)
    if (kids) {
      for (const kid of kids) {
        const child = buildNode(kid)
        if (child) {
          children.push(child)
        }
      }
    }

    if (children.length === 0 && !orgTaxIds.has(taxId)) {
      return undefined
    }

    const info = nameMap[taxId] ?? taxonomyData?.names[String(taxId)]
    const name = typeof info === 'string' ? info : (info?.name ?? String(taxId))
    const rank =
      typeof info === 'string'
        ? (taxonomyData?.ranks[String(taxId)] ?? 'no rank')
        : (info?.rank ?? 'no rank')

    return { taxId, label: name, rank, children }
  }

  let root = buildNode(1)
  if (!root) {
    return { taxId: 1, label: 'root', rank: 'no rank', children: [] }
  }

  function collapse(node: TreeNode): TreeNode {
    const collapsedChildren = node.children.map(collapse)

    if (
      collapsedChildren.length === 1 &&
      !orgTaxIds.has(node.taxId) &&
      !importantRanks.has(node.rank)
    ) {
      return collapsedChildren[0]
    }

    return { ...node, children: collapsedChildren }
  }

  root = collapse(root)
  return root
}

export function treeNodeToDiagramNode(
  node: TreeNode,
  orgNames: Map<number, string>,
  highlightTaxIds?: Set<number>,
): DiagramNode {
  const isOrganism = orgNames.has(node.taxId)
  const isLeaf = node.children.length === 0

  if (isLeaf) {
    const label = isOrganism
      ? `${annotateLabel(node.label)} (${orgNames.get(node.taxId)})`
      : annotateLabel(node.label)
    return {
      label,
      wikiLink: wikiUrl(node.label),
      highlight: highlightTaxIds ? highlightTaxIds.has(node.taxId) : false,
      taxId: node.taxId,
    }
  }

  const children = node.children.map(c =>
    treeNodeToDiagramNode(c, orgNames, highlightTaxIds),
  )
  return {
    label: annotateLabel(node.label),
    wikiLink: wikiUrl(node.label),
    children,
  }
}
