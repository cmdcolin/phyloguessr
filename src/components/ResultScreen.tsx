import PhyloTree from './PhyloTree.tsx'
import { getLineageFromParents } from '../utils/taxonomy.ts'

import type { Organism } from '../data/organisms.ts'
import type { TaxonomyData } from '../utils/taxonomy.ts'

interface MrcaInfo {
  taxId: number
  name: string
  rank: string
}

interface ResultScreenProps {
  correct: boolean
  sister1: Organism
  sister2: Organism
  outgroup: Organism
  cladeLabel?: string
  sisterMrca?: MrcaInfo
  overallMrca?: MrcaInfo
  taxonomyData: TaxonomyData
  images: Record<number, string | null>
  funFact?: string
  sourceUrl?: string
  sourceLabel?: string
  onPlayAgain: () => void
}

function formatRank(rank: string) {
  if (rank === 'no rank' || rank === 'no rank - terminal') {
    return 'group'
  }
  return rank
}

interface BreadcrumbStep {
  taxId: number
  name: string
  rank: string
}

function getFullLineage(taxId: number, data: TaxonomyData) {
  const lin = getLineageFromParents(taxId, data.parents)
  const steps: BreadcrumbStep[] = []
  for (let i = 0; i < lin.length; i++) {
    const id = lin[i]
    const name = data.names[String(id)]
    const rank = data.ranks[String(id)]
    if (name) {
      steps.push({ taxId: id, name, rank: rank ?? 'no rank' })
    }
  }
  return steps
}

const importantRanks = new Set([
  'species',
  'genus',
  'family',
  'order',
  'class',
  'phylum',
  'kingdom',
  'domain',
])

function filterToImportantRanks(steps: BreadcrumbStep[]) {
  return steps.filter(s => importantRanks.has(s.rank))
}

function buildExplanation(
  sister1: Organism,
  sister2: Organism,
  outgroup: Organism,
  sisterMrca?: MrcaInfo,
  overallMrca?: MrcaInfo,
) {
  const lines: string[] = []

  if (sisterMrca) {
    lines.push(
      `${sister1.commonName} and ${sister2.commonName} share a most recent common ancestor in ${sisterMrca.name} (${formatRank(sisterMrca.rank)}).`,
    )
  } else {
    lines.push(
      `${sister1.commonName} and ${sister2.commonName} are more closely related to each other than either is to ${outgroup.commonName}.`,
    )
  }

  if (overallMrca && sisterMrca) {
    lines.push(
      `To include ${outgroup.commonName}, you have to go back further to ${overallMrca.name} (${formatRank(overallMrca.rank)}).`,
    )
  }

  return lines
}

function Breadcrumbs({
  organism,
  taxonomyData,
}: {
  organism: Organism
  taxonomyData: TaxonomyData
}) {
  const steps = filterToImportantRanks(
    getFullLineage(organism.ncbiTaxId, taxonomyData),
  ).reverse()
  if (steps.length === 0) {
    return null
  }

  return (
    <>
      <span className="breadcrumb-label">{organism.commonName}:</span>
      <span className="breadcrumb-path">
        {steps.map((step, i) => (
          <span key={step.taxId}>
            {i > 0 && <span className="breadcrumb-sep">{' \u203a '}</span>}
            <a
              className="breadcrumb-link"
              href={`https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=${step.taxId}`}
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
  )
}

export default function ResultScreen({
  correct,
  sister1,
  sister2,
  outgroup,
  cladeLabel,
  sisterMrca,
  overallMrca,
  taxonomyData,
  images,
  funFact,
  sourceUrl,
  sourceLabel,
  onPlayAgain,
}: ResultScreenProps) {
  const explanation = buildExplanation(
    sister1,
    sister2,
    outgroup,
    sisterMrca,
    overallMrca,
  )

  return (
    <div className="result-screen">
      <div className={`result-banner ${correct ? 'correct' : 'wrong'}`}>
        {correct ? 'Correct!' : 'Not quite!'}
      </div>
      <div className="result-explanation">
        {explanation.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>
      {funFact && (
        <div className="fun-fact">
          <p>{funFact}</p>
          {sourceUrl && (
            <a
              className="fun-fact-source"
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {sourceLabel || 'Learn more'}
            </a>
          )}
        </div>
      )}
      <PhyloTree
        sister1={sister1}
        sister2={sister2}
        outgroup={outgroup}
        cladeLabel={cladeLabel}
        images={images}
      />
      <div className="lineage-breadcrumbs">
        <Breadcrumbs organism={sister1} taxonomyData={taxonomyData} />
        <Breadcrumbs organism={sister2} taxonomyData={taxonomyData} />
        <Breadcrumbs organism={outgroup} taxonomyData={taxonomyData} />
      </div>
      <button className="play-again-btn" onClick={onPlayAgain}>
        Play Again
      </button>
    </div>
  )
}
