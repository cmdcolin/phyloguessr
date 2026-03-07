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
  knownOrganisms: { ncbiTaxId: number; commonName: string; scientificName: string; wikiTitle: string; group: string; imageUrl?: string }[],
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
    if (pairs[i].lca.depth > best.lca.depth) {
      best = pairs[i]
    }
  }

  const overallLca =
    best.otherLcas[0].depth < best.otherLcas[1].depth
      ? best.otherLcas[0]
      : best.otherLcas[1]

  return {
    sister1TaxId: best.s1,
    sister2TaxId: best.s2,
    outgroupTaxId: best.out,
    sisterLca: best.lca,
    overallLca: overallLca.depth < best.lca.depth ? overallLca : best.lca,
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
  return fetch(`${import.meta.env.BASE_URL}taxonomy/${file}`)
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
    speciesPoolPromise = fetch(
      `${import.meta.env.BASE_URL}taxonomy/species-pool.json`,
    ).then(r => {
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

    if (g0 !== g1 && g0 !== g2 && g1 !== g2) {
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

let cladeIndexCache:
  | {
      pool: SpeciesPoolEntry[]
      byRank: Map<string, { taxId: number; name: string; rank: string }[]>
    }
  | undefined

function buildCladeIndex(pool: SpeciesPoolEntry[], data: TaxonomyData) {
  if (cladeIndexCache && cladeIndexCache.pool === pool) {
    return cladeIndexCache.byRank
  }

  const targetRanks = new Set<string>(targetRankList)
  const cladeCounts = new Map<number, number>()

  for (let i = 0; i < pool.length; i++) {
    const lineage = getLineageFromParents(pool[i][0], data.parents)
    for (const id of lineage) {
      const rank = data.ranks[String(id)]
      if (rank !== undefined && targetRanks.has(rank)) {
        cladeCounts.set(id, (cladeCounts.get(id) ?? 0) + 1)
      }
    }
  }

  const byRank = new Map<
    string,
    { taxId: number; name: string; rank: string }[]
  >()
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
        })
      }
    }
  }

  cladeIndexCache = { pool, byRank }
  return byRank
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
  'SAR',
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
    const clade = bucket[Math.floor(Math.random() * bucket.length)]
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

    if (g0 !== g1 && g0 !== g2 && g1 !== g2) {
      return picks
    }
  }
  const indices = new Set<number>()
  while (indices.size < 3) {
    indices.add(Math.floor(Math.random() * pool.length))
  }
  return [...indices].map(i => pool[i])
}

export function getAllPairLcas(
  taxIds: number[],
  data: TaxonomyData,
) {
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
  pairs.sort((a, b) => b.lca.depth - a.lca.depth)
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

    const genera = new Map<number, number>()
    let tooMany = false
    for (const pick of picks) {
      const lineage = getLineageFromParents(pick[0], data.parents)
      for (const id of lineage) {
        const rank = data.ranks[String(id)]
        if (rank === 'genus') {
          genera.set(id, (genera.get(id) ?? 0) + 1)
          if (genera.get(id)! > 2) {
            tooMany = true
          }
          break
        }
      }
    }
    if (!tooMany) {
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
      if (pairs.length >= 2 && pairs[0].lca.depth !== pairs[1].lca.depth) {
        return { picks: result, clade }
      }
    }
  }

  return { picks: pickNFromClade(count, 1, pool, data) ?? pool.slice(0, count) }
}

interface DiagramNode {
  label: string
  highlight?: boolean
  children?: DiagramNode[]
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
    return `${clade.name} (${organism.commonName})`
  }
  return organism.commonName
}

function makeBranchNode(
  organism: { commonName: string },
  clades: CladePair,
  highlight?: boolean,
): DiagramNode {
  const leafLabel = makeLeafLabel(organism, clades.leaf ?? clades.branch)
  const leaf: DiagramNode = { label: leafLabel }
  if (highlight) {
    leaf.highlight = true
  }
  if (clades.branch && clades.leaf && clades.branch.taxId !== clades.leaf.taxId) {
    const node: DiagramNode = {
      label: clades.branch.name,
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

  const getName = (taxId: number) =>
    data.names[String(taxId)] ?? String(taxId)

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

  const sisterNode: DiagramNode = {
    label: getName(sisterLcaTaxId),
    highlight: true,
    children: [
      makeBranchNode(sister1, s1Clades, true),
      makeBranchNode(sister2, s2Clades, true),
    ],
  }

  return {
    label: getName(overallLcaTaxId),
    children: [outNode, sisterNode],
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
