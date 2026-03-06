import { useState } from "preact/hooks";
import Button from "./Button.tsx";
import { ShareButton } from "./Game.tsx";
import PhyloTree from "./PhyloTree.tsx";
import SpeciesMap, { MAP_COLORS } from "./SpeciesMap.tsx";
import { capitalize } from "../utils/format.ts";
import { getLineageFromParents } from "../utils/taxonomy.ts";

import type { Organism } from "../data/organisms.ts";
import type { MrcaInfo } from "../utils/format.ts";
import type { TaxonomyData } from "../utils/taxonomy.ts";

interface ResultScreenProps {
  correct: boolean;
  sister1: Organism;
  sister2: Organism;
  outgroup: Organism;
  cladeLabel: string;
  sisterMrca: MrcaInfo;
  overallMrca: MrcaInfo;
  isPolytomy: boolean;
  taxonomyData: TaxonomyData;
  images: Record<number, string | null>;
  userSelectedTaxIds: Set<number>;
  organismColors: Record<number, string>;
  funFact?: string;
  shareUrl: string;
  onPlayAgain: () => void;
}

function formatRank(rank: string) {
  if (rank === "no rank" || rank === "no rank - terminal") {
    return "group";
  }
  return rank;
}

interface BreadcrumbStep {
  taxId: number;
  name: string;
  rank: string;
}

function getFullLineage(taxId: number, data: TaxonomyData) {
  const lin = getLineageFromParents(taxId, data.parents);
  const steps: BreadcrumbStep[] = [];
  for (let i = 0; i < lin.length; i++) {
    const id = lin[i];
    const name = data.names[String(id)];
    const rank = data.ranks[String(id)];
    if (name) {
      steps.push({ taxId: id, name, rank: rank ?? "no rank" });
    }
  }
  return steps;
}

const importantRanks = new Set([
  "species",
  "genus",
  "family",
  "order",
  "class",
  "phylum",
  "kingdom",
  "domain",
]);

function filterToImportantRanks(steps: BreadcrumbStep[]) {
  const filtered = steps.filter((s) => importantRanks.has(s.rank));
  const seen = new Set<string>();
  const deduped: BreadcrumbStep[] = [];
  for (const step of filtered) {
    const key = `${step.name}|${step.rank}`;
    if (!seen.has(key)) {
      seen.add(key);
      deduped.push(step);
    }
  }
  return deduped;
}

export function TaxLink({ name, taxId }: { name: string; taxId: number }) {
  return (
    <span className="breadcrumb-link">
      <a
        href={`https://en.wikipedia.org/wiki/${encodeURIComponent(name)}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {name}
      </a>
      {taxId >= 0 && (
        <>
          {" "}
          <a
            className="breadcrumb-secondary-link"
            href={`https://www.ncbi.nlm.nih.gov/datasets/taxonomy/${taxId}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            ncbi
          </a>
        </>
      )}
    </span>
  );
}

function OrganismLink({ organism }: { organism: Organism }) {
  return (
    <a
      className="breadcrumb-link"
      href={`https://en.wikipedia.org/wiki/${encodeURIComponent(organism.scientificName)}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      {capitalize(organism.commonName)}
    </a>
  );
}

function Explanation({
  sister1,
  sister2,
  outgroup,
  sisterMrca,
  overallMrca,
  isPolytomy,
}: {
  sister1: Organism;
  sister2: Organism;
  outgroup: Organism;
  sisterMrca: MrcaInfo;
  overallMrca: MrcaInfo;
  isPolytomy: boolean;
}) {
  if (isPolytomy) {
    return (
      <div className="result-explanation">
        <p>
          All three share a most recent common ancestor in{" "}
          <TaxLink name={sisterMrca.name} taxId={sisterMrca.taxId} /> (
          {formatRank(sisterMrca.rank)}). None of the three is more closely
          related to another — any pair is equally correct!
        </p>
      </div>
    );
  }
  return (
    <div className="result-explanation">
      <p>
        <OrganismLink organism={sister1} /> and{" "}
        <OrganismLink organism={sister2} /> share a most recent common
        ancestor in{" "}
        <TaxLink name={sisterMrca.name} taxId={sisterMrca.taxId} /> (
        {formatRank(sisterMrca.rank)}).
      </p>
      {overallMrca.name !== sisterMrca.name && (
        <p>
          To include <OrganismLink organism={outgroup} />, you have to go
          back further to{" "}
          <TaxLink name={overallMrca.name} taxId={overallMrca.taxId} /> (
          {formatRank(overallMrca.rank)}).
        </p>
      )}
    </div>
  );
}

function Breadcrumbs({
  organism,
  taxonomyData,
  color,
}: {
  organism: Organism;
  taxonomyData: TaxonomyData;
  color?: string;
}) {
  const steps = filterToImportantRanks(
    getFullLineage(organism.ncbiTaxId, taxonomyData),
  ).reverse();
  if (steps.length === 0) {
    return null;
  }

  return (
    <>
      <span className="breadcrumb-label">
        {color && (
          <span
            className="map-color-dot"
            style={{ backgroundColor: color }}
          />
        )}
        {capitalize(organism.commonName)}
        {" "}
        <a
          className="breadcrumb-secondary-link"
          href={`https://en.wikipedia.org/wiki/${organism.scientificName}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          wiki
        </a>
        {" "}
        <a
          className="breadcrumb-secondary-link"
          href={`https://www.ncbi.nlm.nih.gov/datasets/taxonomy/${organism.ncbiTaxId}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          ncbi
        </a>
      </span>
      <span className="breadcrumb-path">
        {steps.map((step, i) => (
          <span key={step.taxId}>
            {i > 0 && <span className="breadcrumb-sep">{" \u203a "}</span>}
            <TaxLink name={step.name} taxId={step.taxId} />
            <span className="breadcrumb-rank"> ({formatRank(step.rank)})</span>
          </span>
        ))}
      </span>
    </>
  );
}

function MapToggle({ organisms, organismColors }: { organisms: Organism[]; organismColors: Record<number, string> }) {
  const [show, setShow] = useState(false);
  const sorted = [...organisms].sort(
    (a, b) => MAP_COLORS.indexOf(organismColors[a.ncbiTaxId]) - MAP_COLORS.indexOf(organismColors[b.ncbiTaxId]),
  );
  return (
    <div className="map-toggle">
      <button className="map-toggle-btn" onClick={() => setShow(s => !s)}>
        {show ? "Hide map" : "Show map"}
      </button>
      {show && <SpeciesMap organisms={sorted} />}
    </div>
  );
}

export default function ResultScreen({
  correct,
  sister1,
  sister2,
  outgroup,
  cladeLabel,
  sisterMrca,
  overallMrca,
  isPolytomy,
  taxonomyData,
  images,
  userSelectedTaxIds,
  organismColors,
  funFact,
  shareUrl,
  onPlayAgain,
}: ResultScreenProps) {
  return (
    <div className="result-screen">
      <div className={`result-banner ${correct ? "correct" : "wrong"}`}>
        {correct ? "Correct!" : "Not quite!"}
      </div>
      {funFact && (
        <div className="fun-fact">
          <p>{funFact}</p>
        </div>
      )}
      <div className="result-actions">
        <Button onClick={onPlayAgain}>Next</Button>
        <ShareButton url={shareUrl} />
      </div>
      <Explanation
        sister1={sister1}
        sister2={sister2}
        outgroup={outgroup}
        sisterMrca={sisterMrca}
        overallMrca={overallMrca}
        isPolytomy={isPolytomy}
      />

      <PhyloTree
        sister1={sister1}
        sister2={sister2}
        outgroup={outgroup}
        cladeLabel={cladeLabel}
        images={images}
        userSelectedTaxIds={userSelectedTaxIds}
        organismColors={organismColors}
      />
      <MapToggle organisms={[sister1, sister2, outgroup]} organismColors={organismColors} />
      <div className="lineage-breadcrumbs">
        <Breadcrumbs organism={sister1} taxonomyData={taxonomyData} color={organismColors[sister1.ncbiTaxId]} />
        <Breadcrumbs organism={sister2} taxonomyData={taxonomyData} color={organismColors[sister2.ncbiTaxId]} />
        <Breadcrumbs organism={outgroup} taxonomyData={taxonomyData} color={organismColors[outgroup.ncbiTaxId]} />
      </div>
      <a
        className="report-issue-link"
        href={`https://github.com/cmdcolin/phyloguessr/issues/new?title=${encodeURIComponent(`Issue with: ${sister1.commonName}, ${sister2.commonName}, ${outgroup.commonName}`)}&body=${encodeURIComponent(`Organisms: ${sister1.commonName} (${sister1.scientificName}), ${sister2.commonName} (${sister2.scientificName}), ${outgroup.commonName} (${outgroup.scientificName})\n\nDescribe the issue:\n`)}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Report issue with this answer
      </a>
    </div>
  );
}
