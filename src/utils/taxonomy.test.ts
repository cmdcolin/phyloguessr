import { describe, expect, it } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";

import {
  findClosestPairFromData,
  getLineageFromParents,
  buildTreeFromLineages,
} from "./taxonomy.ts";

import type { TaxonomyData } from "./taxonomy.ts";

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
      "10": 1,
      "20": 10,
      "30": 10,
      "21": 20,
      "22": 20,
      "31": 30,
    },
    names: {
      "1": "root",
      "10": "Eukaryota",
      "20": "Plants",
      "30": "Animals",
      "21": "Species A",
      "22": "Species B",
      "31": "Species C",
    },
    ranks: {
      "10": "domain",
      "20": "kingdom",
      "30": "kingdom",
      "21": "species",
      "22": "species",
      "31": "species",
    },
  };
}

describe("getLineageFromParents", () => {
  const data = makeMockData();

  it("returns full lineage from leaf to root", () => {
    const lineage = getLineageFromParents(21, data.parents);
    expect(lineage).toEqual([21, 20, 10, 1]);
  });

  it("returns [taxId, 1] when taxId is missing from parents", () => {
    const lineage = getLineageFromParents(9999, data.parents);
    expect(lineage).toEqual([9999, 1]);
  });

  it("handles root directly", () => {
    const lineage = getLineageFromParents(1, data.parents);
    expect(lineage).toEqual([1]);
  });
});

describe("findClosestPairFromData", () => {
  const data = makeMockData();

  it("identifies the correct sister pair", () => {
    // A (21) and B (22) share parent Plants (20)
    // C (31) is under Animals (30)
    const result = findClosestPairFromData([21, 22, 31], data);
    expect(new Set([result.sister1TaxId, result.sister2TaxId])).toEqual(
      new Set([21, 22]),
    );
    expect(result.outgroupTaxId).toBe(31);
  });

  it("works regardless of input order", () => {
    const orderings: [number, number, number][] = [
      [21, 22, 31],
      [21, 31, 22],
      [31, 21, 22],
      [31, 22, 21],
      [22, 21, 31],
      [22, 31, 21],
    ];
    for (const order of orderings) {
      const result = findClosestPairFromData(order, data);
      expect(new Set([result.sister1TaxId, result.sister2TaxId])).toEqual(
        new Set([21, 22]),
      );
      expect(result.outgroupTaxId).toBe(31);
    }
  });

  it("returns correct LCA info for the sister pair", () => {
    const result = findClosestPairFromData([21, 22, 31], data);
    expect(result.sisterLca.taxId).toBe(20);
    expect(result.sisterLca.name).toBe("Plants");
  });

  it("returns correct overall LCA", () => {
    const result = findClosestPairFromData([21, 22, 31], data);
    expect(result.overallLca.taxId).toBe(10);
    expect(result.overallLca.name).toBe("Eukaryota");
  });

  it("gives wrong answer when a taxId is missing from parents (documents the bug)", () => {
    // If taxId 21 is missing, its lineage is [21, 1] (length 2).
    // LCA(21,22) = root (depth 1), LCA(22,31) = Eukaryota (depth 2)
    // So 22+31 wins instead of 21+22.
    const brokenData: TaxonomyData = {
      ...data,
      parents: { ...data.parents },
    };
    delete brokenData.parents["21"];

    const result = findClosestPairFromData([21, 22, 31], brokenData);
    // With broken data, it picks the WRONG pair
    expect(new Set([result.sister1TaxId, result.sister2TaxId])).not.toEqual(
      new Set([21, 22]),
    );
  });
});

describe("findClosestPairFromData polytomy", () => {
  it("detects a polytomy when all three share the same LCA", () => {
    // All three species under the same parent
    const data: TaxonomyData = {
      parents: {
        "10": 1,
        "11": 10,
        "12": 10,
        "13": 10,
      },
      names: {
        "1": "root",
        "10": "Clade",
        "11": "A",
        "12": "B",
        "13": "C",
      },
      ranks: {
        "10": "family",
        "11": "species",
        "12": "species",
        "13": "species",
      },
    };
    const result = findClosestPairFromData([11, 12, 13], data);
    expect(result.isPolytomy).toBe(true);
  });

  it("does not flag a polytomy when one pair is closer", () => {
    const data = makeMockData();
    const result = findClosestPairFromData([21, 22, 31], data);
    expect(result.isPolytomy).toBe(false);
  });
});

describe("buildTreeFromLineages", () => {
  const data = makeMockData();

  it("builds a tree with correct structure", () => {
    const organisms = [
      { ncbiTaxId: 21, commonName: "A", scientificName: "Species A" },
      { ncbiTaxId: 22, commonName: "B", scientificName: "Species B" },
      { ncbiTaxId: 31, commonName: "C", scientificName: "Species C" },
    ];
    const nameMap: Record<number, { name: string; rank: string }> = {};
    const tree = buildTreeFromLineages(organisms, nameMap, undefined, data);

    // Root should be Eukaryota (domain) since single-child root gets collapsed
    expect(tree.label).toBe("Eukaryota");
    expect(tree.children.length).toBe(2);

    const childLabels = tree.children.map((c) => c.label).sort();
    expect(childLabels).toEqual(["Animals", "Plants"]);

    const plants = tree.children.find((c) => c.label === "Plants")!;
    expect(plants.children.length).toBe(2);
    const plantSpecies = plants.children.map((c) => c.label).sort();
    expect(plantSpecies).toEqual(["Species A", "Species B"]);
  });

  it("collapses single-child nodes without important ranks", () => {
    // Add an intermediate unranked node
    const extData: TaxonomyData = {
      parents: {
        ...data.parents,
        "40": 30,
        "31": 40,
      },
      names: {
        ...data.names,
        "40": "Subgroup",
      },
      ranks: {
        ...data.ranks,
        "40": "no rank",
      },
    };
    const organisms = [
      { ncbiTaxId: 31, commonName: "C", scientificName: "Species C" },
    ];
    const tree = buildTreeFromLineages(organisms, {}, undefined, extData);

    // The unranked "Subgroup" node should be collapsed
    function findNode(node: { label: string; children: { label: string; children: unknown[] }[] }, label: string): boolean {
      if (node.label === label) {
        return true;
      }
      return node.children.some((c) => findNode(c as typeof node, label));
    }
    expect(findNode(tree, "Subgroup")).toBe(false);
    expect(findNode(tree, "Species C")).toBe(true);
  });
});

describe("compact format round-trip", () => {
  it("unpacks compact format back to TaxonomyData correctly", () => {
    const original: TaxonomyData = {
      parents: { "10": 1, "20": 10, "21": 20 },
      names: { "10": "Eukaryota", "20": "Plants", "21": "Rose" },
      ranks: { "10": "domain", "20": "kingdom", "21": "species" },
    };

    // Simulate compact format (same logic as build script)
    const rankList = [...new Set(Object.values(original.ranks))].sort();
    const rankMap = Object.fromEntries(rankList.map((r, i) => [r, i]));
    const compact = {
      R: rankList,
      D: Object.fromEntries(
        Object.keys(original.parents).map((id) => [
          id,
          [
            original.parents[id],
            original.names[id] || "",
            rankMap[original.ranks[id]] ?? -1,
          ],
        ]),
      ),
    };

    // Unpack (same logic as client)
    const parents: Record<string, number> = {};
    const names: Record<string, string> = {};
    const ranks: Record<string, string> = {};
    for (const [id, [parent, name, rankIdx]] of Object.entries(compact.D) as [string, [number, string, number]][]) {
      parents[id] = parent;
      if (name) {
        names[id] = name;
      }
      if (rankIdx >= 0) {
        ranks[id] = compact.R[rankIdx];
      }
    }

    expect(parents).toEqual(original.parents);
    expect(names).toEqual(original.names);
    expect(ranks).toEqual(original.ranks);
  });
});

describe("all curated organisms have valid taxonomy data", () => {
  const dataPath = resolve(__dirname, "../../public/taxonomy/parents.json");
  let data: TaxonomyData;

  try {
    const raw = JSON.parse(readFileSync(dataPath, "utf8"));
    if (raw.D && raw.R) {
      const parents: Record<string, number> = {};
      const names: Record<string, string> = {};
      const ranks: Record<string, string> = {};
      for (const [id, [parent, name, rankIdx]] of Object.entries(raw.D) as [string, [number, string, number]][]) {
        parents[id] = parent;
        if (name) {
          names[id] = name;
        }
        if (rankIdx >= 0) {
          ranks[id] = raw.R[rankIdx];
        }
      }
      data = { parents, names, ranks };
    } else {
      data = raw;
    }
  } catch {
    data = { parents: {}, names: {}, ranks: {} };
  }

  // Dynamically import organisms to get all tax IDs
  // We use a static import approach since vitest handles TS imports
  const { organisms } = require("../data/organisms.ts") as {
    organisms: { commonName: string; ncbiTaxId: number }[];
  };

  it("every organism has a parent entry in taxonomy data", () => {
    const missing: { name: string; taxId: number }[] = [];
    for (const org of organisms) {
      if (data.parents[String(org.ncbiTaxId)] === undefined) {
        missing.push({ name: org.commonName, taxId: org.ncbiTaxId });
      }
    }
    expect(missing).toEqual([]);
  });

  it("every organism has a lineage of at least 5 nodes", () => {
    const short: { name: string; taxId: number; length: number }[] = [];
    for (const org of organisms) {
      const lineage = getLineageFromParents(org.ncbiTaxId, data.parents);
      if (lineage.length < 5) {
        short.push({
          name: org.commonName,
          taxId: org.ncbiTaxId,
          length: lineage.length,
        });
      }
    }
    expect(short).toEqual([]);
  });
});
