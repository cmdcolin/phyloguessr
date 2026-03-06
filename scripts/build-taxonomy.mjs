#!/usr/bin/env node

import {
  createWriteStream,
  createReadStream,
  existsSync,
  mkdirSync,
  readFileSync,
  statSync,
} from "fs";
import { writeFile } from "fs/promises";
import { createInterface } from "readline";
import { pipeline } from "stream/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const NCBI_DUMP_URL =
  "https://ftp.ncbi.nlm.nih.gov/pub/taxonomy/new_taxdump/new_taxdump.tar.gz";
const OTL_TREE_URL =
  "https://files.opentreeoflife.org/synthesis/opentree16.1/opentree16.1_tree.tgz";
const OTT_TAXONOMY_URL =
  "https://files.opentreeoflife.org/ott/ott3.7.3/ott3.7.3.tgz";
const WORK_DIR = join(ROOT, ".taxonomy-build");
const OTL_DIR = join(WORK_DIR, "opentree");
const OUT_DIR = join(ROOT, "public", "taxonomy");

function extractCuratedTaxIds() {
  const src = readFileSync(join(ROOT, "src", "data", "organisms.ts"), "utf8");
  const ids = [...src.matchAll(/ncbiTaxId:\s*(\d+)/g)].map((m) => Number(m[1]));
  return [...new Set(ids)];
}

const CURATED_TAX_IDS = extractCuratedTaxIds();

const EXCLUDE_PATTERNS = [
  /unidentified/i,
  /uncultured/i,
  /environmental/i,
  /unclassified/i,
  /incertae sedis/i,
  /\bsp\.\b/,
  /\bcf\.\b/,
  /\baff\.\b/,
];

// --- NCBI download and parsing (for species pool) ---

async function downloadNcbi() {
  if (!existsSync(WORK_DIR)) {
    mkdirSync(WORK_DIR, { recursive: true });
  }

  const tarPath = join(WORK_DIR, "new_taxdump.tar.gz");

  if (!existsSync(join(WORK_DIR, "nodes.dmp"))) {
    console.log("Downloading NCBI taxonomy dump...");
    const response = await fetch(NCBI_DUMP_URL);
    if (!response.ok) {
      throw new Error(`Download failed: ${response.status}`);
    }
    const fileStream = createWriteStream(tarPath);
    await pipeline(response.body, fileStream);
    console.log("Extracting...");
    execSync(`tar xzf ${tarPath} -C ${WORK_DIR} nodes.dmp names.dmp`);
    console.log("Extracted nodes.dmp and names.dmp");
  } else {
    console.log("Using cached NCBI taxonomy dump");
  }
}

async function parseNcbiNodes() {
  console.log("Parsing NCBI nodes.dmp...");
  const parents = new Map();
  const ranks = new Map();

  const rl = createInterface({
    input: createReadStream(join(WORK_DIR, "nodes.dmp")),
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    const parts = line.split("\t|\t");
    const taxId = parseInt(parts[0].trim(), 10);
    const parentId = parseInt(parts[1].trim(), 10);
    const rank = parts[2].trim();
    parents.set(taxId, parentId);
    ranks.set(taxId, rank);
  }

  console.log(`  ${parents.size} nodes`);
  return { parents, ranks };
}

async function parseNcbiNames() {
  console.log("Parsing NCBI names.dmp...");
  const scientificNames = new Map();
  const commonNames = new Map();

  const rl = createInterface({
    input: createReadStream(join(WORK_DIR, "names.dmp")),
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    const parts = line.split("\t|\t");
    const taxId = parseInt(parts[0].trim(), 10);
    const name = parts[1].trim();
    const nameClass = parts[3]?.replace("\t|", "").trim();

    if (nameClass === "scientific name") {
      scientificNames.set(taxId, name);
    } else if (
      nameClass === "genbank common name" ||
      nameClass === "common name"
    ) {
      if (!commonNames.has(taxId)) {
        commonNames.set(taxId, name);
      }
    }
  }

  console.log(
    `  ${scientificNames.size} scientific names, ${commonNames.size} common names`,
  );
  return { scientificNames, commonNames };
}

function buildSpeciesPool(ncbiParents, ncbiRanks, scientificNames, commonNames) {
  console.log("Building species pool...");
  const pool = [];

  for (const [taxId, rank] of ncbiRanks) {
    if (rank !== "species") {
      continue;
    }
    const commonName = commonNames.get(taxId);
    if (!commonName) {
      continue;
    }
    const sciName = scientificNames.get(taxId);
    if (!sciName) {
      continue;
    }

    let excluded = false;
    for (const pat of EXCLUDE_PATTERNS) {
      if (pat.test(sciName) || pat.test(commonName)) {
        excluded = true;
        break;
      }
    }
    if (excluded) {
      continue;
    }

    pool.push([taxId, commonName, sciName]);
  }

  console.log(`  ${pool.length} species with common names`);
  return pool;
}

// --- Open Tree of Life download and parsing ---

async function downloadOtl() {
  if (!existsSync(OTL_DIR)) {
    mkdirSync(OTL_DIR, { recursive: true });
  }

  const treeTar = join(OTL_DIR, "opentree_tree.tgz");
  const treeFile = join(
    OTL_DIR,
    "opentree16.1_tree",
    "labelled_supertree",
    "labelled_supertree.tre",
  );

  if (!existsSync(treeFile)) {
    console.log("Downloading Open Tree of Life synthetic tree...");
    const response = await fetch(OTL_TREE_URL);
    if (!response.ok) {
      throw new Error(`OTL tree download failed: ${response.status}`);
    }
    const fileStream = createWriteStream(treeTar);
    await pipeline(response.body, fileStream);
    console.log("Extracting OTL tree...");
    execSync(`tar xzf ${treeTar} -C ${OTL_DIR}`);
  } else {
    console.log("Using cached OTL synthetic tree");
  }

  const ottTar = join(OTL_DIR, "ott.tgz");
  const ottFile = join(OTL_DIR, "ott3.7.3", "taxonomy.tsv");

  if (!existsSync(ottFile)) {
    console.log("Downloading OTT taxonomy...");
    const response = await fetch(OTT_TAXONOMY_URL);
    if (!response.ok) {
      throw new Error(`OTT taxonomy download failed: ${response.status}`);
    }
    const fileStream = createWriteStream(ottTar);
    await pipeline(response.body, fileStream);
    console.log("Extracting OTT taxonomy...");
    execSync(`tar xzf ${ottTar} -C ${OTL_DIR}`);
  } else {
    console.log("Using cached OTT taxonomy");
  }

  return { treeFile, ottFile };
}

async function parseOttTaxonomy(ottFile) {
  console.log("Parsing OTT taxonomy (NCBI <-> OTT mappings)...");
  const ncbiToOtt = new Map();
  const ottToNcbi = new Map();
  const ottNames = new Map();
  const ottRanks = new Map();
  const ottParents = new Map();

  const rl = createInterface({
    input: createReadStream(ottFile),
    crlfDelay: Infinity,
  });

  let first = true;
  for await (const line of rl) {
    if (first) {
      first = false;
      continue;
    }
    const parts = line.split("\t|\t");
    const ottId = parseInt(parts[0], 10);
    const parentUid = parts[1] ? parseInt(parts[1], 10) : undefined;
    const name = parts[2];
    const rank = parts[3];
    const sourceinfo = parts[4] || "";

    ottNames.set(ottId, name);
    if (parentUid !== undefined && !isNaN(parentUid)) {
      ottParents.set(ottId, parentUid);
    }
    if (rank && rank !== "no rank" && rank !== "no rank - terminal") {
      ottRanks.set(ottId, rank);
    }

    const ncbiMatch = sourceinfo.match(/ncbi:(\d+)/);
    if (ncbiMatch) {
      const ncbiId = parseInt(ncbiMatch[1], 10);
      ncbiToOtt.set(ncbiId, ottId);
      ottToNcbi.set(ottId, ncbiId);
    }
  }

  console.log(
    `  ${ncbiToOtt.size} NCBI<->OTT mappings, ${ottNames.size} OTT names`,
  );
  return { ncbiToOtt, ottToNcbi, ottNames, ottRanks, ottParents };
}

function parseOtlTree(treeFile) {
  console.log("Parsing OTL synthetic tree (Newick)...");
  const tree = readFileSync(treeFile, "utf8");

  const parents = new Map();
  let nextSyntheticId = -1;
  const stack = [];
  let currentLabel = "";

  for (let i = 0; i < tree.length; i++) {
    const ch = tree[i];
    if (ch === "(") {
      stack.push({ children: [] });
      currentLabel = "";
    } else if (ch === ",") {
      if (currentLabel) {
        stack[stack.length - 1].children.push(currentLabel);
      }
      currentLabel = "";
    } else if (ch === ")") {
      if (currentLabel) {
        stack[stack.length - 1].children.push(currentLabel);
      }
      currentLabel = "";
      let label = "";
      let j = i + 1;
      while (
        j < tree.length &&
        tree[j] !== "(" &&
        tree[j] !== ")" &&
        tree[j] !== "," &&
        tree[j] !== ";"
      ) {
        label += tree[j];
        j++;
      }
      i = j - 1;

      const ctx = stack.pop();
      const parentLabel = label || `_syn${nextSyntheticId--}`;
      for (const child of ctx.children) {
        parents.set(child, parentLabel);
      }
      currentLabel = parentLabel;
    } else if (ch === ";") {
      break;
    } else {
      currentLabel += ch;
    }
  }

  console.log(`  ${parents.size} parent-child relationships`);
  return parents;
}

function getOttLineage(ottId, ottTaxParents) {
  const lineage = [];
  let cur = ottId;
  const seen = new Set();
  while (cur !== undefined && !seen.has(cur)) {
    seen.add(cur);
    lineage.push(cur);
    cur = ottTaxParents.get(cur);
  }
  return lineage;
}

function getOttLca(ottId1, ottId2, ottTaxParents) {
  const lineage1 = getOttLineage(ottId1, ottTaxParents);
  const set1 = new Set(lineage1);
  const lineage2 = getOttLineage(ottId2, ottTaxParents);
  for (const id of lineage2) {
    if (set1.has(id)) {
      return id;
    }
  }
  return undefined;
}

function buildOtlAncestorTree(
  pool,
  curatedIds,
  otlParents,
  ott,
  ncbiScientificNames,
) {
  const { ncbiToOtt, ottToNcbi, ottNames, ottRanks, ottParents: ottTaxParents } = ott;
  console.log("Building pruned ancestor tree from OTL...");

  // Map from OTL label (e.g. "ott770315") to a stable numeric ID.
  // Prefer NCBI IDs for nodes that have them; use negative IDs for OTL-only nodes.
  let nextId = -1;
  const ottLabelToNumericId = new Map();

  function resolveId(ottLabel) {
    if (ottLabelToNumericId.has(ottLabel)) {
      return ottLabelToNumericId.get(ottLabel);
    }

    const m = ottLabel.match(/^ott(\d+)$/);
    if (m) {
      const ottId = parseInt(m[1], 10);
      const ncbiId = ottToNcbi.get(ottId);
      if (ncbiId !== undefined) {
        ottLabelToNumericId.set(ottLabel, ncbiId);
        return ncbiId;
      }
      const synId = nextId--;
      ottLabelToNumericId.set(ottLabel, synId);
      return synId;
    }
    const synId = nextId--;
    ottLabelToNumericId.set(ottLabel, synId);
    return synId;
  }

  // Resolve mrcaott labels to a taxonomic name by finding the LCA
  // of the two referenced OTT taxa in the OTT taxonomy hierarchy
  function resolveMrcaLabel(label) {
    const m = label.match(/^mrcaott(\d+)ott(\d+)$/);
    if (!m) {
      return undefined;
    }
    const ottId1 = parseInt(m[1], 10);
    const ottId2 = parseInt(m[2], 10);
    const lcaOttId = getOttLca(ottId1, ottId2, ottTaxParents);
    if (lcaOttId === undefined) {
      return undefined;
    }
    const ncbiId = ottToNcbi.get(lcaOttId);
    const name = ncbiScientificNames.get(ncbiId) || ottNames.get(lcaOttId);
    const rank = ottRanks.get(lcaOttId);
    return { name, rank };
  }

  // Collect all leaf NCBI IDs that need lineages
  const allNcbiIds = new Set([...pool.map((s) => s[0]), ...curatedIds]);

  // Walk up from each leaf, collecting needed OTL nodes
  const neededLabels = new Set();
  let missing = 0;

  for (const ncbiId of allNcbiIds) {
    const ottId = ncbiToOtt.get(ncbiId);
    if (ottId === undefined) {
      missing++;
      continue;
    }

    let cur = `ott${ottId}`;
    const seen = new Set();
    while (cur && !seen.has(cur)) {
      if (neededLabels.has(cur)) {
        break;
      }
      seen.add(cur);
      neededLabels.add(cur);
      cur = otlParents.get(cur);
    }
  }

  if (missing > 0) {
    console.log(`  Warning: ${missing} NCBI IDs not found in OTT`);
  }

  // Build numeric parent/name/rank maps
  const prunedParents = {};
  const prunedNames = {};
  const prunedRanks = {};
  let mrcaResolved = 0;

  for (const label of neededLabels) {
    const id = resolveId(label);
    const parentLabel = otlParents.get(label);
    if (parentLabel && neededLabels.has(parentLabel)) {
      prunedParents[id] = resolveId(parentLabel);
    }

    const m = label.match(/^ott(\d+)$/);
    if (m) {
      const ottId = parseInt(m[1], 10);
      const ncbiId = ottToNcbi.get(ottId);
      const name =
        ncbiScientificNames.get(ncbiId) || ottNames.get(ottId);
      if (name) {
        prunedNames[id] = name;
      }
      const rank = ottRanks.get(ottId);
      if (rank && rank !== "no rank") {
        prunedRanks[id] = rank;
      }
    } else {
      const resolved = resolveMrcaLabel(label);
      if (resolved?.name) {
        prunedNames[id] = resolved.name;
        mrcaResolved++;
      }
      if (resolved?.rank && resolved.rank !== "no rank") {
        prunedRanks[id] = resolved.rank;
      }
    }
  }

  console.log(`  ${Object.keys(prunedParents).length} ancestor nodes`);
  console.log(`  ${mrcaResolved} mrca nodes resolved to taxonomy names`);
  return { parents: prunedParents, names: prunedNames, ranks: prunedRanks };
}

// --- NCBI-only fallback ancestor tree (for species not in OTL) ---

function buildNcbiAncestorTree(pool, curatedIds, ncbiParents, ncbiRanks, ncbiNames) {
  console.log("Building NCBI fallback ancestor tree...");
  const neededNodes = new Set();

  const allLeafIds = [...pool.map((s) => s[0]), ...curatedIds];
  for (const taxId of allLeafIds) {
    let current = taxId;
    const seen = new Set();
    while (current !== 1 && !seen.has(current)) {
      if (neededNodes.has(current)) {
        break;
      }
      seen.add(current);
      neededNodes.add(current);
      const parent = ncbiParents.get(current);
      if (parent === undefined || parent === current) {
        break;
      }
      current = parent;
    }
    neededNodes.add(1);
  }

  const prunedParents = {};
  const prunedNames = {};
  const prunedRanks = {};

  for (const taxId of neededNodes) {
    const parent = ncbiParents.get(taxId);
    if (parent !== undefined) {
      prunedParents[taxId] = parent;
    }
    const name = ncbiNames.get(taxId);
    if (name) {
      prunedNames[taxId] = name;
    }
    const rank = ncbiRanks.get(taxId);
    if (rank && rank !== "no rank") {
      prunedRanks[taxId] = rank;
    }
  }

  console.log(`  ${Object.keys(prunedParents).length} ancestor nodes`);
  return { parents: prunedParents, names: prunedNames, ranks: prunedRanks };
}

// --- Collapse redundant chains ---

function collapseRedundantNodes(tree) {
  const { parents, names, ranks } = tree;
  let collapsed = 0;

  for (const id of Object.keys(parents)) {
    const name = names[id];
    const rank = ranks[id];
    if (!name || !rank) {
      continue;
    }
    let parentId = parents[id];
    while (
      parentId !== undefined &&
      names[parentId] === name &&
      ranks[parentId] === rank
    ) {
      parentId = parents[parentId];
      collapsed++;
    }
    if (parentId !== undefined) {
      parents[id] = parentId;
    }
  }

  console.log(`  Collapsed ${collapsed} redundant intermediate nodes`);
  return tree;
}

// --- Merge OTL + NCBI trees ---

function mergeAncestorTrees(otlTree, ncbiTree) {
  console.log("Merging OTL and NCBI ancestor trees...");
  const parents = { ...otlTree.parents };
  const names = { ...otlTree.names };
  const ranks = { ...otlTree.ranks };

  let added = 0;
  for (const [id, parent] of Object.entries(ncbiTree.parents)) {
    if (parents[id] === undefined) {
      parents[id] = parent;
      added++;
    }
  }
  for (const [id, name] of Object.entries(ncbiTree.names)) {
    if (names[id] === undefined) {
      names[id] = name;
    }
  }
  for (const [id, rank] of Object.entries(ncbiTree.ranks)) {
    if (ranks[id] === undefined) {
      ranks[id] = rank;
    }
  }

  console.log(
    `  ${Object.keys(parents).length} total nodes (${added} NCBI-only fallback nodes)`,
  );
  return { parents, names, ranks };
}

// --- Main ---

async function main() {
  // Download both data sources
  await downloadNcbi();
  const { treeFile, ottFile } = await downloadOtl();

  // Parse NCBI (needed for species pool common names)
  const { parents: ncbiParents, ranks: ncbiRanks } = await parseNcbiNodes();
  const { scientificNames, commonNames } = await parseNcbiNames();

  // Build species pool from NCBI
  const pool = buildSpeciesPool(ncbiParents, ncbiRanks, scientificNames, commonNames);

  // Parse OTL data
  const ott = await parseOttTaxonomy(ottFile);
  const otlParents = parseOtlTree(treeFile);

  // Build ancestor tree from OTL (primary, better phylogenetic resolution)
  const otlTree = buildOtlAncestorTree(
    pool,
    CURATED_TAX_IDS,
    otlParents,
    ott,
    scientificNames,
  );

  // Build NCBI fallback (for species not in OTL tree)
  const ncbiTree = buildNcbiAncestorTree(
    pool,
    CURATED_TAX_IDS,
    ncbiParents,
    ncbiRanks,
    scientificNames,
  );

  // Merge: OTL takes priority, NCBI fills gaps
  const ancestorTree = mergeAncestorTrees(otlTree, ncbiTree);

  // Collapse chains of nodes with the same name+rank
  console.log("Collapsing redundant nodes...");
  collapseRedundantNodes(ancestorTree);

  // Write output files
  mkdirSync(OUT_DIR, { recursive: true });

  console.log("Writing species-pool.json...");
  await writeFile(join(OUT_DIR, "species-pool.json"), JSON.stringify(pool));

  console.log("Writing parents.json...");
  await writeFile(join(OUT_DIR, "parents.json"), JSON.stringify(ancestorTree));

  const poolStats = statSync(join(OUT_DIR, "species-pool.json"));
  const parentsStats = statSync(join(OUT_DIR, "parents.json"));
  console.log(`\nOutput sizes:`);
  console.log(
    `  species-pool.json: ${(poolStats.size / 1024 / 1024).toFixed(1)} MB`,
  );
  console.log(
    `  parents.json: ${(parentsStats.size / 1024 / 1024).toFixed(1)} MB`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
