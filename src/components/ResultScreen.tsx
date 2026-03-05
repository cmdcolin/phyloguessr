import Button from "./Button.tsx";
import PhyloTree from "./PhyloTree.tsx";
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
  cladeLabel?: string;
  sisterMrca?: MrcaInfo;
  overallMrca?: MrcaInfo;
  isPolytomy: boolean;
  taxonomyData: TaxonomyData;
  images: Record<number, string | null>;
  userSelectedTaxIds: Set<number>;
  funFact?: string;
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
  return steps.filter((s) => importantRanks.has(s.rank));
}

function TaxLink({ name, taxId }: { name: string; taxId: number }) {
  return (
    <a
      className="breadcrumb-link"
      href={`https://www.ncbi.nlm.nih.gov/datasets/taxonomy/${taxId}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      {name}
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
  sisterMrca?: MrcaInfo;
  overallMrca?: MrcaInfo;
  isPolytomy: boolean;
}) {
  if (isPolytomy && sisterMrca) {
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
      {sisterMrca ? (
        <p>
          {capitalize(sister1.commonName)} and {capitalize(sister2.commonName)}{" "}
          share a most recent common ancestor in{" "}
          <TaxLink name={sisterMrca.name} taxId={sisterMrca.taxId} /> (
          {formatRank(sisterMrca.rank)}).
        </p>
      ) : (
        <p>
          {capitalize(sister1.commonName)} and {capitalize(sister2.commonName)}{" "}
          are more closely related to each other than either is to{" "}
          {capitalize(outgroup.commonName)}.
        </p>
      )}
      {overallMrca && sisterMrca && (
        <p>
          To include {capitalize(outgroup.commonName)}, you have to go back
          further to{" "}
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
}: {
  organism: Organism;
  taxonomyData: TaxonomyData;
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
        {capitalize(organism.commonName)}
        {" ("}
        <a
          className="breadcrumb-link"
          href={`https://en.wikipedia.org/wiki/${organism.scientificName}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          wiki
        </a>
        {", "}
        <a
          className="breadcrumb-link"
          href={`https://www.ncbi.nlm.nih.gov/datasets/taxonomy/${organism.ncbiTaxId}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          ncbi
        </a>
        {")"}
      </span>
      <span className="breadcrumb-path">
        {steps.map((step, i) => (
          <span key={step.taxId}>
            {i > 0 && <span className="breadcrumb-sep">{" \u203a "}</span>}
            <a
              className="breadcrumb-link"
              href={`https://www.ncbi.nlm.nih.gov/datasets/taxonomy/${step.taxId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {step.name}
            </a>
            <span className="breadcrumb-rank"> ({formatRank(step.rank)})</span>
          </span>
        ))}
      </span>
    </>
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
  funFact,
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
      <Button onClick={onPlayAgain}>Next</Button>
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
      />
      <div className="lineage-breadcrumbs">
        <Breadcrumbs organism={sister1} taxonomyData={taxonomyData} />
        <Breadcrumbs organism={sister2} taxonomyData={taxonomyData} />
        <Breadcrumbs organism={outgroup} taxonomyData={taxonomyData} />
      </div>
    </div>
  );
}
