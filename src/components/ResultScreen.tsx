import { useState } from 'preact/hooks'

import Button from './Button.tsx'
import DiagramTree from './DiagramTree.tsx'
import FullTree from './FullTree.tsx'
import { ShareButton } from './Game.tsx'
import PhyloTree from './PhyloTree.tsx'
import SpeciesMap, { MAP_COLORS } from './SpeciesMap.tsx'
import { capitalize } from '../utils/format.ts'
import { getLineageFromParents } from '../utils/taxonomy.ts'

import type { Organism } from '../data/organisms.ts'
import type { DiagramNode } from '../data/surprisingFacts.ts'
import type { MrcaInfo } from '../utils/format.ts'
import type { TaxonomyData } from '../utils/taxonomy.ts'

interface ResultScreenProps {
  correct: boolean
  sister1: Organism
  sister2: Organism
  outgroup: Organism
  cladeLabel: string
  sisterMrca: MrcaInfo
  overallMrca: MrcaInfo
  isPolytomy: boolean
  taxonomyData: TaxonomyData
  images: Record<number, string | null>
  userSelectedTaxIds: Set<number>
  organismColors: Record<number, string>
  funFact?: string
  sourceUrl?: string
  sourceLabel?: string
  diagram?: DiagramNode
  shareUrl: string
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
          {' '}
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
  )
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
  )
}

function Explanation({
  sister1,
  sister2,
  outgroup,
  sisterMrca,
  overallMrca,
  isPolytomy,
  funFact,
  sourceUrl,
  sourceLabel,
}: {
  sister1: Organism
  sister2: Organism
  outgroup: Organism
  sisterMrca: MrcaInfo
  overallMrca: MrcaInfo
  isPolytomy: boolean
  funFact?: string
  sourceUrl?: string
  sourceLabel?: string
}) {
  if (isPolytomy) {
    return (
      <div className="result-explanation">
        <p>
          All three share a most recent common ancestor in{' '}
          <TaxLink name={sisterMrca.name} taxId={sisterMrca.taxId} /> (
          {formatRank(sisterMrca.rank)}). None of the three is more closely
          related to another — any pair is equally correct!
                </p>
        {funFact && <p>Fun fact: {funFact}</p>}
        {sourceUrl && (
          <p className="fun-fact-source">
            Source:{' '}
            <a href={sourceUrl} target="_blank" rel="noopener noreferrer">
              {sourceLabel ?? sourceUrl}
            </a>
          </p>
        )}
      </div>
    )
  }
  return (
    <div className="result-explanation">
      <p>
        <OrganismLink organism={sister1} /> and{' '}
        <OrganismLink organism={sister2} /> share a most recent common ancestor
        in <TaxLink name={sisterMrca.name} taxId={sisterMrca.taxId} /> (
        {formatRank(sisterMrca.rank)}).
        {overallMrca.name !== sisterMrca.name && (
          <>
            {' '}
            To include <OrganismLink organism={outgroup} />, you have to go back
            further to{' '}
            <TaxLink name={overallMrca.name} taxId={overallMrca.taxId} /> (
            {formatRank(overallMrca.rank)}).
          </>
        )}
      </p>
        {funFact && <p>Fun fact: {funFact}</p>}
      {sourceUrl && (
        <p className="fun-fact-source">
          Source:{' '}
          <a href={sourceUrl} target="_blank" rel="noopener noreferrer">
            {sourceLabel ?? sourceUrl}
          </a>
        </p>
      )}
    </div>
  )
}

const majorRanks = new Set([
  'domain',
  'kingdom',
  'phylum',
  'class',
  'order',
  'family',
  'genus',
  'species',
])

function getDivergenceStart(lineages: BreadcrumbStep[][]) {
  const minLen = Math.min(...lineages.map(l => l.length))
  let commonLen = 0
  for (let i = 0; i < minLen; i++) {
    const id = lineages[0][i].taxId
    if (lineages.every(l => l[i].taxId === id)) {
      commonLen = i + 1
    } else {
      break
    }
  }
  // Walk back from divergence to find the nearest major rank above it
  const ref = lineages[0]
  for (let i = commonLen - 1; i >= 0; i--) {
    if (majorRanks.has(ref[i].rank)) {
      return i
    }
  }
  return 0
}

function Breadcrumbs({
  organism,
  taxonomyData,
  color,
  startIndex,
}: {
  organism: Organism
  taxonomyData: TaxonomyData
  color?: string
  startIndex: number
}) {
  const allSteps = getFullLineage(organism.ncbiTaxId, taxonomyData).reverse()
  const pinnedRanks = new Set(['domain', 'kingdom', 'phylum'])
  const pinned = allSteps.filter(s => pinnedRanks.has(s.rank))
  const tail = allSteps.slice(startIndex)
  const tailIds = new Set(tail.map(s => s.taxId))
  const pinnedOnly = pinned.filter(s => !tailIds.has(s.taxId))
  const hasGap = pinnedOnly.length > 0 && tail.length > 0

  return (
    <>
      <span className="breadcrumb-label">
        {color && (
          <span className="map-color-dot" style={{ backgroundColor: color }} />
        )}
        {capitalize(organism.commonName)}{' '}
        <a
          className="breadcrumb-secondary-link"
          href={`https://en.wikipedia.org/wiki/${organism.scientificName}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          wiki
        </a>{' '}
        <a
          className="breadcrumb-secondary-link"
          href={`https://www.ncbi.nlm.nih.gov/datasets/taxonomy/${organism.ncbiTaxId}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          ncbi
        </a>
      </span>
      {allSteps.length > 0 ? (
        <span className="breadcrumb-path">
          {pinnedOnly.map((step, i) => (
            <span key={step.taxId}>
              {i > 0 && <span className="breadcrumb-sep">{' \u203a '}</span>}
              <TaxLink name={step.name} taxId={step.taxId} />
              <span className="breadcrumb-rank">
                {' '}
                ({formatRank(step.rank)})
              </span>
            </span>
          ))}
          {hasGap && (
            <span className="breadcrumb-sep">{' \u203a \u2026 \u203a '}</span>
          )}
          {tail.map((step, i) => (
            <span key={step.taxId}>
              {i > 0 && <span className="breadcrumb-sep">{' \u203a '}</span>}
              <TaxLink name={step.name} taxId={step.taxId} />
              <span className="breadcrumb-rank">
                {' '}
                ({formatRank(step.rank)})
              </span>
            </span>
          ))}
        </span>
      ) : (
        <span className="breadcrumb-path breadcrumb-missing">
          Lineage data missing
        </span>
      )}
    </>
  )
}

function FullTreeToggle({
  organisms,
  taxonomyData,
  organismColors,
}: {
  organisms: [Organism, Organism, Organism]
  taxonomyData: TaxonomyData
  organismColors: Record<number, string>
}) {
  const [show, setShow] = useState(false)
  return (
    <div className="map-toggle">
      <button className="map-toggle-btn" onClick={() => setShow(s => !s)}>
        {show ? 'Hide full tree' : 'Show full tree'}
      </button>
      {show && (
        <FullTree
          organisms={organisms}
          taxonomyData={taxonomyData}
          organismColors={organismColors}
        />
      )}
    </div>
  )
}

function LineageBreadcrumbs({
  sister1,
  sister2,
  outgroup,
  taxonomyData,
  organismColors,
}: {
  sister1: Organism
  sister2: Organism
  outgroup: Organism
  taxonomyData: TaxonomyData
  organismColors: Record<number, string>
}) {
  const l1 = getFullLineage(sister1.ncbiTaxId, taxonomyData).reverse()
  const l2 = getFullLineage(sister2.ncbiTaxId, taxonomyData).reverse()
  const l3 = getFullLineage(outgroup.ncbiTaxId, taxonomyData).reverse()
  const startIndex = getDivergenceStart([l1, l2, l3])
  return (
    <div className="lineage-breadcrumbs">
      <Breadcrumbs
        organism={sister1}
        taxonomyData={taxonomyData}
        color={organismColors[sister1.ncbiTaxId]}
        startIndex={startIndex}
      />
      <Breadcrumbs
        organism={sister2}
        taxonomyData={taxonomyData}
        color={organismColors[sister2.ncbiTaxId]}
        startIndex={startIndex}
      />
      <Breadcrumbs
        organism={outgroup}
        taxonomyData={taxonomyData}
        color={organismColors[outgroup.ncbiTaxId]}
        startIndex={startIndex}
      />
    </div>
  )
}

function MapToggle({
  organisms,
  organismColors,
}: {
  organisms: Organism[]
  organismColors: Record<number, string>
}) {
  const [show, setShow] = useState(false)
  const sorted = [...organisms].sort(
    (a, b) =>
      MAP_COLORS.indexOf(organismColors[a.ncbiTaxId]) -
      MAP_COLORS.indexOf(organismColors[b.ncbiTaxId]),
  )
  return (
    <div className="map-toggle">
      <button className="map-hint-link" onClick={() => setShow(s => !s)}>
        {show
          ? 'Hide species distribution map'
          : 'Show species distribution map (GBIF)'}
      </button>
      {show && <SpeciesMap organisms={sorted} />}
    </div>
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
  isPolytomy,
  taxonomyData,
  images,
  userSelectedTaxIds,
  organismColors,
  funFact,
  sourceUrl,
  sourceLabel,
  diagram,
  shareUrl,
  onPlayAgain,
}: ResultScreenProps) {
  return (
    <div className="result-screen">
      <div className={`result-banner ${correct ? 'correct' : 'wrong'}`}>
        {correct ? 'Correct!' : 'Not quite!'}
        <ShareButton url={shareUrl} />
      </div>

      {/* {diagram && <DiagramTree root={diagram} />} */}
      <Explanation
        sister1={sister1}
        sister2={sister2}
        outgroup={outgroup}
        sisterMrca={sisterMrca}
        overallMrca={overallMrca}
        isPolytomy={isPolytomy}
        funFact={funFact}
        sourceUrl={sourceUrl}
        sourceLabel={sourceLabel}
      />
      <div className="result-actions">
        <Button onClick={onPlayAgain}>Next</Button>
      </div>

      <PhyloTree
        sister1={sister1}
        sister2={sister2}
        outgroup={outgroup}
        cladeLabel={cladeLabel}
        images={images}
        userSelectedTaxIds={userSelectedTaxIds}
        organismColors={organismColors}
      />
      {/* <FullTreeToggle
        organisms={[sister1, sister2, outgroup]}
        taxonomyData={taxonomyData}
        organismColors={organismColors}
      /> */}
      <MapToggle
        organisms={[sister1, sister2, outgroup]}
        organismColors={organismColors}
      />
      <LineageBreadcrumbs
        sister1={sister1}
        sister2={sister2}
        outgroup={outgroup}
        taxonomyData={taxonomyData}
        organismColors={organismColors}
      />
      <div className="result-actions">
        <Button onClick={onPlayAgain}>Next</Button>
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
  )
}
