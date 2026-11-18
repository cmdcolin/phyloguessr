import { readFileSync } from 'fs'
import { resolve } from 'path'

import { describe, expect, it } from 'vitest'

import { CURATED_MICROORGANISMS } from '../../scripts/curated-microorganisms.mjs'
import cladeHints from '../data/clade-hints.json'
import { organisms } from '../data/organisms.ts'
import {
  buildContextDiagram,
  buildTreeFromLineages,
  findClosestPairFromData,
  getAllPairLcas,
  getLineageFromParents,
  lcaClosenessScore,
  isCompactTaxonomyData,
  treeNodeToDiagramNode,
  landmarkTaxIds,
  landmarks,
  unpackTaxonomyData,
} from './taxonomy.ts'

import type {
  CompactTaxonomyData,
  DiagramNode,
  TaxonomyData,
  TreeNode,
} from './taxonomy.ts'

function loadTaxonomyFile(path: string): TaxonomyData {
  try {
    const raw: unknown = JSON.parse(readFileSync(path, 'utf8'))
    return isCompactTaxonomyData(raw)
      ? unpackTaxonomyData(raw)
      : { parents: {}, names: {}, ranks: {} }
  } catch {
    return { parents: {}, names: {}, ranks: {} }
  }
}

function findNode(node: TreeNode, label: string): boolean {
  return node.label === label || node.children.some(c => findNode(c, label))
}

function labelsDown(node: DiagramNode): string[] {
  return [node.label, ...(node.children ?? []).flatMap(labelsDown)]
}

function chainLabels(nodes: [number, string][]) {
  const [top] = nodes.reduceRight<TreeNode[]>(
    (children, [taxId, label]) => [{ taxId, label, rank: 'clade', children }],
    [],
  )
  return labelsDown(treeNodeToDiagramNode(top, new Map()))
}

interface ScenarioOrganism {
  ncbiTaxId: number
  commonName: string
}

interface Scenario {
  difficulty: unknown
  organisms: ScenarioOrganism[]
  correctPair?: string[]
}

function isScenarioOrganism(value: unknown): value is ScenarioOrganism {
  return (
    typeof value === 'object' &&
    value !== null &&
    'ncbiTaxId' in value &&
    typeof value.ncbiTaxId === 'number' &&
    'commonName' in value &&
    typeof value.commonName === 'string'
  )
}

function isScenario(value: unknown): value is Scenario {
  return (
    typeof value === 'object' &&
    value !== null &&
    'organisms' in value &&
    Array.isArray(value.organisms) &&
    value.organisms.every(isScenarioOrganism) &&
    (!('correctPair' in value) ||
      (Array.isArray(value.correctPair) &&
        value.correctPair.every((name: unknown) => typeof name === 'string')))
  )
}

// A small mock taxonomy tree:
//
//        1 (root)
//        |
//       10 (Eukaryota)
//      /    \
//    20      30
//  (Plants) (Animals)
//   /  \       \
//  21   22      31
// (A)  (B)     (C)
//
function makeMockData(): TaxonomyData {
  return {
    parents: {
      '10': 1,
      '20': 10,
      '30': 10,
      '21': 20,
      '22': 20,
      '31': 30,
    },
    names: {
      '1': 'root',
      '10': 'Eukaryota',
      '20': 'Plants',
      '30': 'Animals',
      '21': 'Species A',
      '22': 'Species B',
      '31': 'Species C',
    },
    ranks: {
      '10': 'domain',
      '20': 'kingdom',
      '30': 'kingdom',
      '21': 'species',
      '22': 'species',
      '31': 'species',
    },
  }
}

describe('getLineageFromParents', () => {
  const data = makeMockData()

  it('returns full lineage from leaf to root', () => {
    const lineage = getLineageFromParents(21, data.parents)
    expect(lineage).toEqual([21, 20, 10, 1])
  })

  it('returns [taxId, 1] when taxId is missing from parents', () => {
    const lineage = getLineageFromParents(9999, data.parents)
    expect(lineage).toEqual([9999, 1])
  })

  it('handles root directly', () => {
    const lineage = getLineageFromParents(1, data.parents)
    expect(lineage).toEqual([1])
  })
})

describe('findClosestPairFromData', () => {
  const data = makeMockData()

  it('identifies the correct sister pair', () => {
    // A (21) and B (22) share parent Plants (20)
    // C (31) is under Animals (30)
    const result = findClosestPairFromData([21, 22, 31], data)
    expect(new Set([result.sister1TaxId, result.sister2TaxId])).toEqual(
      new Set([21, 22]),
    )
    expect(result.outgroupTaxId).toBe(31)
  })

  it('works regardless of input order', () => {
    const orderings: [number, number, number][] = [
      [21, 22, 31],
      [21, 31, 22],
      [31, 21, 22],
      [31, 22, 21],
      [22, 21, 31],
      [22, 31, 21],
    ]
    for (const order of orderings) {
      const result = findClosestPairFromData(order, data)
      expect(new Set([result.sister1TaxId, result.sister2TaxId])).toEqual(
        new Set([21, 22]),
      )
      expect(result.outgroupTaxId).toBe(31)
    }
  })

  it('returns correct LCA info for the sister pair', () => {
    const result = findClosestPairFromData([21, 22, 31], data)
    expect(result.sisterLca.taxId).toBe(20)
    expect(result.sisterLca.name).toBe('Plants')
  })

  it('returns correct overall LCA', () => {
    const result = findClosestPairFromData([21, 22, 31], data)
    expect(result.overallLca.taxId).toBe(10)
    expect(result.overallLca.name).toBe('Eukaryota')
  })

  it('gives wrong answer when a taxId is missing from parents (documents the bug)', () => {
    // If taxId 21 is missing, its lineage is [21, 1] (length 2).
    // LCA(21,22) = root (depth 1), LCA(22,31) = Eukaryota (depth 2)
    // So 22+31 wins instead of 21+22.
    const brokenData: TaxonomyData = {
      ...data,
      parents: { ...data.parents },
    }
    delete brokenData.parents['21']

    const result = findClosestPairFromData([21, 22, 31], brokenData)
    // With broken data, it picks the WRONG pair
    expect(new Set([result.sister1TaxId, result.sister2TaxId])).not.toEqual(
      new Set([21, 22]),
    )
  })
})

describe('findClosestPairFromData polytomy', () => {
  it('detects a polytomy when all three share the same LCA', () => {
    // All three species under the same parent
    const data: TaxonomyData = {
      parents: {
        '10': 1,
        '11': 10,
        '12': 10,
        '13': 10,
      },
      names: {
        '1': 'root',
        '10': 'Clade',
        '11': 'A',
        '12': 'B',
        '13': 'C',
      },
      ranks: {
        '10': 'family',
        '11': 'species',
        '12': 'species',
        '13': 'species',
      },
    }
    const result = findClosestPairFromData([11, 12, 13], data)
    expect(result.isPolytomy).toBe(true)
  })

  it('does not flag a polytomy when one pair is closer', () => {
    const data = makeMockData()
    const result = findClosestPairFromData([21, 22, 31], data)
    expect(result.isPolytomy).toBe(false)
  })
})

describe('lcaClosenessScore', () => {
  it('ranks genus closer than family', () => {
    const genus = { taxId: 1, name: 'G', rank: 'genus', depth: 5 }
    const family = { taxId: 2, name: 'F', rank: 'family', depth: 5 }
    expect(lcaClosenessScore(genus)).toBeGreaterThan(lcaClosenessScore(family))
  })

  it('ranks genus closer than family even when family has higher depth', () => {
    const genus = { taxId: 1, name: 'G', rank: 'genus', depth: 5 }
    const family = { taxId: 2, name: 'F', rank: 'family', depth: 50 }
    expect(lcaClosenessScore(genus)).toBeGreaterThan(lcaClosenessScore(family))
  })

  it('uses depth as tiebreaker within same rank', () => {
    const deep = { taxId: 1, name: 'A', rank: 'genus', depth: 10 }
    const shallow = { taxId: 2, name: 'B', rank: 'genus', depth: 5 }
    expect(lcaClosenessScore(deep)).toBeGreaterThan(lcaClosenessScore(shallow))
  })

  it('falls back to depth for unranked nodes without data', () => {
    const deep = { taxId: 1, name: 'A', rank: 'no rank', depth: 20 }
    const shallow = { taxId: 2, name: 'B', rank: 'no rank', depth: 10 }
    expect(lcaClosenessScore(deep)).toBeGreaterThan(lcaClosenessScore(shallow))
  })

  it('uses nearest ranked ancestor for unranked nodes when data is provided', () => {
    // Unranked node 15 sits between genus 20 and species 11
    const data: TaxonomyData = {
      parents: { '10': 1, '15': 10, '20': 15 },
      names: { '10': 'Family X', '15': 'Some clade', '20': 'Genus Y' },
      ranks: { '10': 'family', '15': 'no rank', '20': 'genus' },
    }
    const unrankedLca = {
      taxId: 15,
      name: 'Some clade',
      rank: 'no rank',
      depth: 8,
    }
    const familyLca = { taxId: 10, name: 'Family X', rank: 'family', depth: 5 }

    // Without data, unranked scores by raw depth only
    expect(lcaClosenessScore(unrankedLca)).toBeLessThan(
      lcaClosenessScore(familyLca),
    )
    // With data, unranked node finds family as nearest ranked ancestor,
    // then uses depth as tiebreaker — so it scores higher than the family node
    expect(lcaClosenessScore(unrankedLca, data)).toBeGreaterThan(
      lcaClosenessScore(familyLca, data),
    )
  })
})

describe('getAllPairLcas rank-aware sorting', () => {
  it('genus pair ranks above family pair despite uneven tree depth', () => {
    // Build a tree where the family-level LCA has more intermediate nodes
    // (higher raw depth) than the genus-level LCA
    //
    //              1 (root)
    //              |
    //             10 (kingdom)
    //            /          \
    //          20 (order)    30 (order)
    //          |              |
    //         25 (family)    35 (no rank)
    //         |               |
    //         26 (genus)     36 (no rank)
    //        /  \             |
    //       27   28          37 (no rank)
    //      (sp) (sp)          |
    //                        38 (family)
    //                       /  \
    //                      39   40
    //                     (sp) (sp)
    const data: TaxonomyData = {
      parents: {
        '10': 1,
        '20': 10,
        '25': 20,
        '26': 25,
        '27': 26,
        '28': 26,
        '30': 10,
        '35': 30,
        '36': 35,
        '37': 36,
        '38': 37,
        '39': 38,
        '40': 38,
      },
      names: {
        '1': 'root',
        '10': 'Life',
        '20': 'Order A',
        '25': 'Family A',
        '26': 'Genus A',
        '27': 'Species 1',
        '28': 'Species 2',
        '30': 'Order B',
        '35': 'Clade X',
        '36': 'Clade Y',
        '37': 'Clade Z',
        '38': 'Family B',
        '39': 'Species 3',
        '40': 'Species 4',
      },
      ranks: {
        '10': 'kingdom',
        '20': 'order',
        '25': 'family',
        '26': 'genus',
        '27': 'species',
        '28': 'species',
        '30': 'order',
        '35': 'no rank',
        '36': 'no rank',
        '37': 'no rank',
        '38': 'family',
        '39': 'species',
        '40': 'species',
      },
    }

    const pairs = getAllPairLcas([27, 28, 39, 40], data)

    // Species 1+2 share genus, Species 3+4 share family
    // Genus pair should be ranked first despite family pair having more
    // intermediate nodes (higher raw depth from root)
    expect(pairs[0].lca.rank).toBe('genus')
    expect(new Set([pairs[0].taxIdA, pairs[0].taxIdB])).toEqual(
      new Set([27, 28]),
    )
  })
})

describe('findClosestPairFromData rank-aware', () => {
  it('picks genus pair over family pair with deeper tree', () => {
    // Same uneven tree as above, but with 3 species for the trio game
    const data: TaxonomyData = {
      parents: {
        '10': 1,
        '20': 10,
        '25': 20,
        '26': 25,
        '27': 26,
        '28': 26,
        '30': 10,
        '35': 30,
        '36': 35,
        '37': 36,
        '38': 37,
        '39': 38,
      },
      names: {
        '1': 'root',
        '10': 'Life',
        '20': 'Order A',
        '25': 'Family A',
        '26': 'Genus A',
        '27': 'Species 1',
        '28': 'Species 2',
        '30': 'Order B',
        '35': 'Clade X',
        '36': 'Clade Y',
        '37': 'Clade Z',
        '38': 'Family B',
        '39': 'Species 3',
      },
      ranks: {
        '10': 'kingdom',
        '20': 'order',
        '25': 'family',
        '26': 'genus',
        '27': 'species',
        '28': 'species',
        '30': 'order',
        '35': 'no rank',
        '36': 'no rank',
        '37': 'no rank',
        '38': 'family',
        '39': 'species',
      },
    }

    const result = findClosestPairFromData([27, 28, 39], data)
    expect(new Set([result.sister1TaxId, result.sister2TaxId])).toEqual(
      new Set([27, 28]),
    )
    expect(result.sisterLca.rank).toBe('genus')
    expect(result.outgroupTaxId).toBe(39)
  })
})

describe('buildTreeFromLineages', () => {
  const data = makeMockData()

  it('builds a tree with correct structure', () => {
    const orgs = [
      { ncbiTaxId: 21, commonName: 'A', scientificName: 'Species A' },
      { ncbiTaxId: 22, commonName: 'B', scientificName: 'Species B' },
      { ncbiTaxId: 31, commonName: 'C', scientificName: 'Species C' },
    ]
    const nameMap: Record<number, { name: string; rank: string }> = {}
    const tree = buildTreeFromLineages(orgs, nameMap, undefined, data)

    // Root should be Eukaryota (domain) since single-child root gets collapsed
    expect(tree.label).toBe('Eukaryota')
    expect(tree.children.length).toBe(2)

    const childLabels = tree.children.map(c => c.label).toSorted()
    expect(childLabels).toEqual(['Animals', 'Plants'])

    const plants = tree.children.find(c => c.label === 'Plants')!
    expect(plants.children.length).toBe(2)
    const plantSpecies = plants.children.map(c => c.label).toSorted()
    expect(plantSpecies).toEqual(['Species A', 'Species B'])
  })

  it('collapses single-child nodes without important ranks', () => {
    // Add an intermediate unranked node
    const extData: TaxonomyData = {
      parents: {
        ...data.parents,
        '40': 30,
        '31': 40,
      },
      names: {
        ...data.names,
        '40': 'Subgroup',
      },
      ranks: {
        ...data.ranks,
        '40': 'no rank',
      },
    }
    const orgs = [
      { ncbiTaxId: 31, commonName: 'C', scientificName: 'Species C' },
    ]
    const tree = buildTreeFromLineages(orgs, {}, undefined, extData)

    // The unranked "Subgroup" node should be collapsed
    expect(findNode(tree, 'Subgroup')).toBe(false)
    expect(findNode(tree, 'Species C')).toBe(true)
  })
})

describe('compact format round-trip', () => {
  it('unpacks compact format back to TaxonomyData correctly', () => {
    const parents: Record<string, number> = { '10': 1, '20': 10, '21': 20 }
    const names: Record<string, string> = {
      '10': 'Eukaryota',
      '20': 'Plants',
      '21': 'Rose',
    }
    const ranks: Record<string, string> = {
      '10': 'domain',
      '20': 'kingdom',
      '21': 'species',
    }
    const original: TaxonomyData = { parents, names, ranks }

    const rankList = [...new Set(Object.values(ranks))].toSorted()
    const rankMap = Object.fromEntries(rankList.map((r, i) => [r, i]))
    const compact: CompactTaxonomyData = {
      R: rankList,
      D: Object.fromEntries(
        Object.keys(parents).map(id => [
          id,
          [parents[id], names[id], rankMap[ranks[id]]],
        ]),
      ),
    }

    const unpacked = unpackTaxonomyData(compact)
    expect(unpacked.parents).toEqual(original.parents)
    expect(unpacked.names).toEqual(original.names)
    expect(unpacked.ranks).toEqual(original.ranks)
  })
})

describe('all curated organisms have valid taxonomy data', () => {
  const data = loadTaxonomyFile(
    resolve(__dirname, '../../public/taxonomy/parents.json'),
  )

  it('every organism has a parent entry in taxonomy data', () => {
    const missing: { name: string; taxId: number }[] = []
    for (const org of organisms) {
      if (data.parents[String(org.ncbiTaxId)] === undefined) {
        missing.push({ name: org.commonName, taxId: org.ncbiTaxId })
      }
    }
    expect(missing).toEqual([])
  })

  it('every organism has a lineage of at least 5 nodes', () => {
    const short: { name: string; taxId: number; length: number }[] = []
    for (const org of organisms) {
      const lineage = getLineageFromParents(org.ncbiTaxId, data.parents)
      if (lineage.length < 5) {
        short.push({
          name: org.commonName,
          taxId: org.ncbiTaxId,
          length: lineage.length,
        })
      }
    }
    expect(short).toEqual([])
  })

  it('no duplicate ncbiTaxId values in curated organisms', () => {
    const seen = new Map<number, string>()
    const dupes: { taxId: number; names: string[] }[] = []
    for (const org of organisms) {
      if (seen.has(org.ncbiTaxId)) {
        dupes.push({
          taxId: org.ncbiTaxId,
          names: [seen.get(org.ncbiTaxId)!, org.commonName],
        })
      }
      seen.set(org.ncbiTaxId, org.commonName)
    }
    expect(dupes).toEqual([])
  })
})

describe('curated microorganisms have valid taxonomy data', () => {
  it('no duplicate tax IDs in microorganism list', () => {
    const seen = new Set<string | number>()
    const dupes: (string | number)[][] = []
    for (const [taxId, name] of CURATED_MICROORGANISMS) {
      if (seen.has(taxId)) {
        dupes.push([taxId, name])
      }
      seen.add(taxId)
    }
    expect(dupes).toEqual([])
  })
})

describe('easy-mode data consistency', () => {
  const easyData = loadTaxonomyFile(
    resolve(__dirname, '../../public/taxonomy/parents-easy.json'),
  )

  let parsed: unknown = []
  try {
    parsed = JSON.parse(
      readFileSync(
        resolve(__dirname, '../../public/taxonomy/easy-scenarios.json'),
        'utf8',
      ),
    )
  } catch {
    // file missing — tests below will pass vacuously, flagging in CI only when file exists
  }

  const scenarios = Array.isArray(parsed) ? parsed.filter(isScenario) : []

  it('every scenario has organisms and a well-formed correctPair', () => {
    expect(scenarios.length).toBe(Array.isArray(parsed) ? parsed.length : 0)
  })

  it('all organisms.ts taxIds present in easy taxonomy', () => {
    const missing = organisms
      .filter(o => easyData.parents[String(o.ncbiTaxId)] === undefined)
      .map(o => ({ name: o.commonName, taxId: o.ncbiTaxId }))
    expect(missing).toEqual([])
  })

  it('all organisms.ts imageUrls use Wikimedia', () => {
    const nonWiki = organisms
      .filter(
        o => o.imageUrl !== undefined && !o.imageUrl.includes('wikimedia.org'),
      )
      .map(o => ({ name: o.commonName, imageUrl: o.imageUrl }))
    expect(nonWiki).toEqual([])
  })

  it('all scenario organism taxIds present in easy taxonomy', () => {
    const missing: { scenario: number; name: string; taxId: number }[] = []
    for (let i = 0; i < scenarios.length; i++) {
      for (const org of scenarios[i].organisms) {
        if (easyData.parents[String(org.ncbiTaxId)] === undefined) {
          missing.push({
            scenario: i,
            name: org.commonName,
            taxId: org.ncbiTaxId,
          })
        }
      }
    }
    expect(missing).toEqual([])
  })

  it('scenario correctPair names reference organisms in that scenario', () => {
    const bad: { scenario: number; name: string }[] = []
    for (let i = 0; i < scenarios.length; i++) {
      const { correctPair, organisms: orgs } = scenarios[i]
      if (!correctPair) continue
      const orgNames = new Set(orgs.map(o => o.commonName))
      for (const name of correctPair) {
        if (!orgNames.has(name)) {
          bad.push({ scenario: i, name })
        }
      }
    }
    expect(bad).toEqual([])
  })

  it('every scenario has an easy or tricky difficulty', () => {
    const bad = scenarios
      .map((s, i) => ({ scenario: i, difficulty: s.difficulty }))
      .filter(
        ({ difficulty }) => difficulty !== 'easy' && difficulty !== 'tricky',
      )
    expect(bad).toEqual([])
  })

  it('no duplicate organism combos across scenarios', () => {
    const seen = new Set<string>()
    const dupes: number[] = []
    for (let i = 0; i < scenarios.length; i++) {
      const key = scenarios[i].organisms
        .map(o => o.ncbiTaxId)
        .toSorted((a, b) => a - b)
        .join(',')
      if (seen.has(key)) {
        dupes.push(i)
      }
      seen.add(key)
    }
    expect(dupes).toEqual([])
  })
})

// Amniota
// ├── Lepidosauria (order)
// │   └── Serpentes (suborder) → taxId 50
// └── Archelosauria (superorder)
//     ├── Testudines (order) → taxId 60
//     └── Archosauria (superorder)
//         └── Aves (class) → taxId 70
function makeReptileData(): TaxonomyData {
  return {
    parents: {
      '100': 1,
      '110': 100,
      '120': 100,
      '50': 110,
      '60': 120,
      '130': 120,
      '70': 130,
    },
    names: {
      '1': 'root',
      '100': 'Amniota',
      '110': 'Lepidosauria',
      '120': 'Archelosauria',
      '130': 'Archosauria',
      '50': 'Serpentes',
      '60': 'Testudines',
      '70': 'Aves',
    },
    ranks: {
      '100': 'class',
      '110': 'order',
      '120': 'superorder',
      '130': 'superorder',
      '50': 'suborder',
      '60': 'order',
      '70': 'class',
    },
  }
}

describe('buildContextDiagram', () => {
  it('builds a context diagram for bird+turtle vs snake', () => {
    const data = makeReptileData()
    const result = buildContextDiagram(
      { ncbiTaxId: 70, commonName: 'Penguin' },
      { ncbiTaxId: 60, commonName: 'Snapping turtle' },
      { ncbiTaxId: 50, commonName: 'Snake' },
      120,
      100,
      data,
    )
    expect(result).toBeDefined()
    expect(result!.label).toBe(
      'Amniota (land-egg vertebrates — includes reptiles, birds, mammals)',
    )
    expect(result!.children).toHaveLength(2)

    // Outgroup should have a branch node (Lepidosauria) with leaf underneath
    const outBranch = result!.children![0]
    expect(outBranch.label).toBe(
      'Lepidosauria (includes lizards, snakes, tuatara)',
    )
    expect(outBranch.highlight).toBeFalsy()
    expect(outBranch.children).toHaveLength(1)
    expect(outBranch.children![0].label).toBe(
      'Serpentes — snakes — 3,700+ species (Snake)',
    )

    const sisterBranch = result!.children![1]
    expect(sisterBranch.label).toBe(
      'Archelosauria (turtles are closer to birds than to lizards!)',
    )
    expect(sisterBranch.highlight).toBe(true)
    expect(sisterBranch.children).toHaveLength(2)
    expect(sisterBranch.children![0].highlight).toBe(true)
    expect(sisterBranch.children![1].highlight).toBe(true)
  })

  it('returns undefined when sister and overall LCA are the same', () => {
    const data = makeReptileData()
    const result = buildContextDiagram(
      { ncbiTaxId: 70, commonName: 'Penguin' },
      { ncbiTaxId: 60, commonName: 'Turtle' },
      { ncbiTaxId: 50, commonName: 'Snake' },
      100,
      100,
      data,
    )
    expect(result).toBeUndefined()
  })

  it('uses simple mock data (Plants vs Animals)', () => {
    const data = makeMockData()
    const result = buildContextDiagram(
      { ncbiTaxId: 21, commonName: 'Orchid' },
      { ncbiTaxId: 22, commonName: 'Oak' },
      { ncbiTaxId: 31, commonName: 'Dog' },
      20,
      10,
      data,
    )
    expect(result).toBeDefined()
    expect(result!.label).toBe(
      'Eukaryota (all complex life — cells with nuclei)',
    )
    expect(result!.children![1].label).toBe('Plants')
    expect(result!.children![1].highlight).toBe(true)
  })
})

describe('tree-level hints agree with the taxonomy', () => {
  const data = loadTaxonomyFile(
    resolve(__dirname, '../../public/taxonomy/parents.json'),
  )
  const nameCounts = new Map<string, number>()
  for (const name of Object.values(data.names)) {
    if (name !== undefined) {
      nameCounts.set(name, (nameCounts.get(name) ?? 0) + 1)
    }
  }

  const parsed: unknown = JSON.parse(
    readFileSync(
      resolve(__dirname, '../../public/taxonomy/easy-scenarios.json'),
      'utf8',
    ),
  )
  const scenarioOrganisms = Array.isArray(parsed)
    ? parsed.filter(isScenario).flatMap(s => s.organisms)
    : []
  const taxIdsByName = new Map<string, number[]>()
  for (const { commonName, ncbiTaxId } of [
    ...organisms,
    ...scenarioOrganisms,
  ]) {
    const key = commonName.toLowerCase()
    taxIdsByName.set(key, [...(taxIdsByName.get(key) ?? []), ncbiTaxId])
  }

  it('every landmark names a node in the tree', () => {
    const missing = Object.keys(landmarks).filter(name => !nameCounts.has(name))
    expect(missing).toEqual([])
  })

  it('landmarks on names shared by several nodes are pinned to a taxId', () => {
    const unpinned = Object.keys(landmarks).filter(
      name =>
        (nameCounts.get(name) ?? 0) > 1 && landmarkTaxIds[name] === undefined,
    )
    const misPinned = Object.entries(landmarkTaxIds).filter(
      ([name, taxId]) => data.names[String(taxId)] !== name,
    )
    expect({ unpinned, misPinned }).toEqual({ unpinned: [], misPinned: [] })
  })

  it('every generated hint is for a node in the tree', () => {
    const missing = Object.keys(cladeHints).filter(
      taxId => data.names[taxId] === undefined,
    )
    expect(missing).toEqual([])
  })

  it('every generated example sits under its node', () => {
    const misplaced = Object.entries(cladeHints).flatMap(
      ([taxId, [, ...examples]]) =>
        examples
          .filter(
            example =>
              !(taxIdsByName.get(example.toLowerCase()) ?? []).some(id =>
                getLineageFromParents(id, data.parents).includes(Number(taxId)),
              ),
          )
          .map(example => `${data.names[taxId]}: ${example}`),
    )
    expect(misplaced).toEqual([])
  })

  it('shows a chain of identical generated examples only once, lowest down', () => {
    expect(
      chainLabels([
        [35493, 'Streptophyta'],
        [131221, 'Streptophytina'],
        [3193, 'Embryophyta'],
      ]),
    ).toEqual([
      'Streptophyta',
      'Streptophytina (includes blueberry, sphagnum moss, mango)',
      'Embryophyta (land plants — colonized land ~470 million years ago)',
    ])
  })

  it('does not repeat a hint across a bare level or a shared common name', () => {
    const sharks = chainLabels([
      [119203, 'Selachii'],
      [119197, 'Galeomorphii'],
      [119195, 'Galeoidea'],
    ])
    const rheas = chainLabels([
      [8792, 'Rheiformes'],
      [8793, 'Rheidae'],
    ])
    expect([sharks[0], rheas[0]]).toEqual(['Selachii (shark)', 'Rheiformes'])
  })
})
