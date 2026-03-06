import { describe, expect, it } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";

import { findClosestPairFromData, getLineageFromParents } from "./taxonomy.ts";

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

describe("all curated organisms have valid taxonomy data", () => {
  const dataPath = resolve(__dirname, "../../public/taxonomy/parents.json");
  let data: TaxonomyData;

  try {
    data = JSON.parse(readFileSync(dataPath, "utf8"));
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
