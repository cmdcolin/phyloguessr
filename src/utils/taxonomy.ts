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

export type SpeciesPoolEntry = [number, string, string]

export function getLineageFromParents(taxId: number, parents: Record<string, number>) {
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

export function findClosestPairFromData(taxIds: [number, number, number], data: TaxonomyData) {
  const [a, b, c] = taxIds

  const lcaAB = getLcaFromParents(a, b, data)
  const lcaAC = getLcaFromParents(a, c, data)
  const lcaBC = getLcaFromParents(b, c, data)

  const pairs = [
    { lca: lcaAB, s1: a, s2: b, out: c, otherLcas: [lcaAC, lcaBC] },
    { lca: lcaAC, s1: a, s2: c, out: b, otherLcas: [lcaAB, lcaBC] },
    { lca: lcaBC, s1: b, s2: c, out: a, otherLcas: [lcaAB, lcaAC] },
  ]

  let best = pairs[0]
  for (let i = 1; i < pairs.length; i++) {
    if (pairs[i].lca.depth > best.lca.depth) {
      best = pairs[i]
    }
  }

  const overallLca = best.otherLcas[0].depth < best.otherLcas[1].depth
    ? best.otherLcas[0]
    : best.otherLcas[1]

  return {
    sister1TaxId: best.s1,
    sister2TaxId: best.s2,
    outgroupTaxId: best.out,
    sisterLca: best.lca,
    overallLca: overallLca.depth < best.lca.depth ? overallLca : best.lca,
  } satisfies ClosestPairResult
}

let taxonomyDataPromise: Promise<TaxonomyData> | undefined
let speciesPoolPromise: Promise<SpeciesPoolEntry[]> | undefined

export function loadTaxonomyData() {
  if (!taxonomyDataPromise) {
    taxonomyDataPromise = fetch('./taxonomy/parents.json').then(r => {
      if (!r.ok) {
        throw new Error(`Failed to load taxonomy data: ${r.status}`)
      }
      return r.json()
    })
  }
  return taxonomyDataPromise
}

export function loadSpeciesPool() {
  if (!speciesPoolPromise) {
    speciesPoolPromise = fetch('./taxonomy/species-pool.json').then(r => {
      if (!r.ok) {
        throw new Error(`Failed to load species pool: ${r.status}`)
      }
      return r.json()
    })
  }
  return speciesPoolPromise
}

function isDescendantOf(taxId: number, ancestorId: number, parents: Record<string, number>) {
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

export function findTaxIdByName(query: string, data: TaxonomyData) {
  const lower = query.toLowerCase()
  for (const [id, name] of Object.entries(data.names)) {
    if (name.toLowerCase() === lower) {
      return Number(id)
    }
  }
  return undefined
}

function pickFromAncestor(ancestorId: number, pool: SpeciesPoolEntry[], data: TaxonomyData) {
  const matches: SpeciesPoolEntry[] = []
  const sampleSize = Math.min(pool.length, 5000)
  const sampled = new Set<number>()

  for (let i = 0; i < sampleSize && matches.length < 50; i++) {
    let idx: number
    do {
      idx = Math.floor(Math.random() * pool.length)
    } while (sampled.has(idx))
    sampled.add(idx)

    if (isDescendantOf(pool[idx][0], ancestorId, data.parents)) {
      matches.push(pool[idx])
    }
  }

  if (matches.length < 3) {
    return undefined
  }

  for (let pickAttempt = 0; pickAttempt < 50; pickAttempt++) {
    const indices = new Set<number>()
    while (indices.size < 3) {
      indices.add(Math.floor(Math.random() * matches.length))
    }
    const picks = [...indices].map(i => matches[i])

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

  return undefined
}

export function pickThreeFromClade(ancestorTaxId: number, pool: SpeciesPoolEntry[], data: TaxonomyData) {
  for (let attempt = 0; attempt < 5; attempt++) {
    const result = pickFromAncestor(ancestorTaxId, pool, data)
    if (result) {
      return result
    }
  }
  return pickThreeHardMode(pool, data)
}

export function pickThreeHardModeDistance(pool: SpeciesPoolEntry[], data: TaxonomyData) {
  const targetRanks = ['genus', 'family', 'order', 'class', 'phylum']

  for (let attempt = 0; attempt < 20; attempt++) {
    const seedIdx = Math.floor(Math.random() * pool.length)
    const seed = pool[seedIdx]
    const lineage = getLineageFromParents(seed[0], data.parents)

    const rankedAncestors = lineage.filter(id => {
      const rank = data.ranks[String(id)]
      return rank !== undefined && targetRanks.includes(rank)
    })

    if (rankedAncestors.length < 1) {
      continue
    }

    const ancestorId = rankedAncestors[Math.floor(Math.random() * rankedAncestors.length)]
    const result = pickFromAncestor(ancestorId, pool, data)
    if (result) {
      return result
    }
  }

  return pickThreeHardMode(pool, data)
}

export function pickThreeHardMode(pool: SpeciesPoolEntry[], data: TaxonomyData) {
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

export function buildTreeFromLineages(
  organisms: { ncbiTaxId: number, commonName: string, scientificName: string }[],
  nameMap: Record<number, { name: string, rank: string }>,
  lineageMap?: Record<number, number[]>,
  taxonomyData?: TaxonomyData,
) {
  const importantRanks = new Set([
    'domain', 'kingdom', 'phylum', 'class', 'order', 'family', 'genus', 'species',
  ])

  const orgTaxIds = new Set(organisms.map(o => o.ncbiTaxId))
  const orgLineages = new Map<number, number[]>()
  for (const org of organisms) {
    if (lineageMap && lineageMap[org.ncbiTaxId]) {
      orgLineages.set(org.ncbiTaxId, lineageMap[org.ncbiTaxId])
    } else if (taxonomyData) {
      orgLineages.set(org.ncbiTaxId, getLineageFromParents(org.ncbiTaxId, taxonomyData.parents))
    }
  }

  const childMap = new Map<number, Set<number>>()
  const allNodes = new Set<number>()

  for (const [, lineage] of orgLineages) {
    for (let i = 0; i < lineage.length - 1; i++) {
      allNodes.add(lineage[i])
      allNodes.add(lineage[i + 1])
      if (!childMap.has(lineage[i + 1])) {
        childMap.set(lineage[i + 1], new Set())
      }
      childMap.get(lineage[i + 1])!.add(lineage[i])
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
    const name = typeof info === 'string' ? info : info?.name ?? String(taxId)
    const rank = typeof info === 'string'
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
      collapsedChildren.length === 1
      && !orgTaxIds.has(node.taxId)
      && !importantRanks.has(node.rank)
    ) {
      return collapsedChildren[0]
    }

    return { ...node, children: collapsedChildren }
  }

  root = collapse(root)
  return root
}
