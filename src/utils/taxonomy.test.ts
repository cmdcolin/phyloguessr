import { readFileSync } from 'fs'
import { resolve } from 'path'

import { describe, expect, it } from 'vitest'

import {
  buildContextDiagram,
  buildTreeFromLineages,
  findClosestPairFromData,
  getAllPairLcas,
  getLineageFromParents,
  lcaClosenessScore,
} from './taxonomy.ts'
import { CURATED_MICROORGANISMS } from '../../scripts/curated-microorganisms.mjs'
import { organisms } from '../data/organisms.ts'

import type { TaxonomyData } from './taxonomy.ts'

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
    const organisms = [
      { ncbiTaxId: 21, commonName: 'A', scientificName: 'Species A' },
      { ncbiTaxId: 22, commonName: 'B', scientificName: 'Species B' },
      { ncbiTaxId: 31, commonName: 'C', scientificName: 'Species C' },
    ]
    const nameMap: Record<number, { name: string; rank: string }> = {}
    const tree = buildTreeFromLineages(organisms, nameMap, undefined, data)

    // Root should be Eukaryota (domain) since single-child root gets collapsed
    expect(tree.label).toBe('Eukaryota')
    expect(tree.children.length).toBe(2)

    const childLabels = tree.children.map(c => c.label).sort()
    expect(childLabels).toEqual(['Animals', 'Plants'])

    const plants = tree.children.find(c => c.label === 'Plants')!
    expect(plants.children.length).toBe(2)
    const plantSpecies = plants.children.map(c => c.label).sort()
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
    const organisms = [
      { ncbiTaxId: 31, commonName: 'C', scientificName: 'Species C' },
    ]
    const tree = buildTreeFromLineages(organisms, {}, undefined, extData)

    // The unranked "Subgroup" node should be collapsed
    function findNode(
      node: {
        label: string
        children: { label: string; children: unknown[] }[]
      },
      label: string,
    ): boolean {
      if (node.label === label) {
        return true
      }
      return node.children.some(c => findNode(c as typeof node, label))
    }
    expect(findNode(tree, 'Subgroup')).toBe(false)
    expect(findNode(tree, 'Species C')).toBe(true)
  })
})

describe('compact format round-trip', () => {
  it('unpacks compact format back to TaxonomyData correctly', () => {
    const original: TaxonomyData = {
      parents: { '10': 1, '20': 10, '21': 20 },
      names: { '10': 'Eukaryota', '20': 'Plants', '21': 'Rose' },
      ranks: { '10': 'domain', '20': 'kingdom', '21': 'species' },
    }

    // Simulate compact format (same logic as build script)
    const rankList = [...new Set(Object.values(original.ranks))].sort()
    const rankMap = Object.fromEntries(rankList.map((r, i) => [r, i]))
    const compact = {
      R: rankList,
      D: Object.fromEntries(
        Object.keys(original.parents).map(id => [
          id,
          [
            original.parents[id],
            original.names[id] || '',
            rankMap[original.ranks[id]] ?? -1,
          ],
        ]),
      ),
    }

    // Unpack (same logic as client)
    const parents: Record<string, number> = {}
    const names: Record<string, string> = {}
    const ranks: Record<string, string> = {}
    for (const [id, [parent, name, rankIdx]] of Object.entries(compact.D) as [
      string,
      [number, string, number],
    ][]) {
      parents[id] = parent
      if (name) {
        names[id] = name
      }
      if (rankIdx >= 0) {
        ranks[id] = compact.R[rankIdx]
      }
    }

    expect(parents).toEqual(original.parents)
    expect(names).toEqual(original.names)
    expect(ranks).toEqual(original.ranks)
  })
})

describe('all curated organisms have valid taxonomy data', () => {
  const dataPath = resolve(__dirname, '../../public/taxonomy/parents.json')
  let data: TaxonomyData

  try {
    const raw = JSON.parse(readFileSync(dataPath, 'utf8'))
    if (raw.D && raw.R) {
      const parents: Record<string, number> = {}
      const names: Record<string, string> = {}
      const ranks: Record<string, string> = {}
      for (const [id, [parent, name, rankIdx]] of Object.entries(raw.D) as [
        string,
        [number, string, number],
      ][]) {
        parents[id] = parent
        if (name) {
          names[id] = name
        }
        if (rankIdx >= 0) {
          ranks[id] = raw.R[rankIdx]
        }
      }
      data = { parents, names, ranks }
    } else {
      data = raw
    }
  } catch {
    data = { parents: {}, names: {}, ranks: {} }
  }

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
  const microorganisms = CURATED_MICROORGANISMS as [number, string, string][]

  it('no duplicate tax IDs in microorganism list', () => {
    const seen = new Set<number>()
    const dupes: [number, string][] = []
    for (const [taxId, name] of microorganisms) {
      if (seen.has(taxId)) {
        dupes.push([taxId, name])
      }
      seen.add(taxId)
    }
    expect(dupes).toEqual([])
  })
})

describe('buildContextDiagram', () => {
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
    expect(outBranch.children![0].label).toBe('Serpentes — snakes (Snake)')

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
