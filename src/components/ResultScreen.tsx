import { useState } from 'react'

import { LineageBreadcrumbs } from './Breadcrumbs.tsx'
import Button from './Button.tsx'
import DiagramTree from './DiagramTree.tsx'
import { MapToggle } from './MapToggle.tsx'
import PhyloTree from './PhyloTree.tsx'
import { ShareButton } from './ShareButton.tsx'
import { TaxLink } from './TaxLink.tsx'
import { capitalize, formatRank } from '../utils/format.ts'
import { expandDiagramUp } from '../utils/taxonomy.ts'

import type { Organism } from '../data/organisms.ts'
import type { DiagramNode, LcaResult, TaxonomyData } from '../utils/taxonomy.ts'

interface ResultScreenProps {
  correct: boolean
  sister1: Organism
  sister2: Organism
  outgroup: Organism
  cladeLabel: string
  sisterMrca: LcaResult
  overallMrca: LcaResult
  isPolytomy: boolean
  taxonomyData: TaxonomyData
  images: Record<number, string | null>
  userSelectedTaxIds: Set<number>
  organismColors: Record<number, string>
  funFact?: string
  diagram?: DiagramNode
  sources?: { url: string; label: string }[]
  activelyDebated?: boolean
  shareUrl: string
  onPlayAgain: () => void
  score?: number
  questionLabel?: string
  timedOut?: boolean
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
  sources,
}: {
  sister1: Organism
  sister2: Organism
  outgroup: Organism
  sisterMrca: LcaResult
  overallMrca: LcaResult
  isPolytomy: boolean
  funFact?: string
  sources?: { url: string; label: string }[]
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
        {sources && sources.length > 0 && (
          <p className="fun-fact-source">
            {sources.length === 1 ? 'Source: ' : 'Sources: '}
            {sources.map((s, i) => (
              <span key={s.url}>
                {i > 0 && ' · '}
                <a href={s.url} target="_blank" rel="noopener noreferrer">
                  {s.label}
                </a>
              </span>
            ))}
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
      {sources && sources.length > 0 && (
        <p className="fun-fact-source">
          {sources.length === 1 ? 'Source: ' : 'Sources: '}
          {sources.map((s, i) => (
            <span key={s.url}>
              {i > 0 && ' · '}
              <a href={s.url} target="_blank" rel="noopener noreferrer">
                {s.label}
              </a>
            </span>
          ))}
        </p>
      )}
    </div>
  )
}

function ZoomableDiagram({
  diagram,
  rootTaxId,
  taxonomyData,
  correct,
  userSelectedTaxIds,
  organismColors,
}: {
  diagram: DiagramNode
  rootTaxId: number
  taxonomyData: TaxonomyData
  correct?: boolean
  userSelectedTaxIds?: Set<number>
  organismColors?: Record<number, string>
}) {
  const [currentDiagram, setCurrentDiagram] = useState(diagram)
  const [currentRootTaxId, setCurrentRootTaxId] = useState(rootTaxId)
  const [canZoom, setCanZoom] = useState(true)

  const handleZoomOut = () => {
    const expanded = expandDiagramUp(
      currentDiagram,
      currentRootTaxId,
      taxonomyData,
    )
    if (expanded) {
      setCurrentDiagram(expanded.diagram)
      setCurrentRootTaxId(expanded.rootTaxId)
    } else {
      setCanZoom(false)
    }
  }

  return (
    <DiagramTree
      root={currentDiagram}
      onZoomOut={canZoom ? handleZoomOut : undefined}
      correct={correct}
      userSelectedTaxIds={userSelectedTaxIds}
      organismColors={organismColors}
    />
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
  diagram,
  sources,
  activelyDebated,
  shareUrl,
  onPlayAgain,
  score,
  questionLabel,
  timedOut,
}: ResultScreenProps) {
  return (
    <div className="result-screen">
      {questionLabel && (
        <div className="result-question-label">{questionLabel}</div>
      )}
      <div className={`result-banner ${timedOut ? 'wrong' : activelyDebated ? 'debated' : correct ? 'correct' : 'wrong'}`}>
        {timedOut ? "Time's up!" : activelyDebated ? 'Actively Debated!' : correct ? 'Correct!' : 'Not quite!'}
        {score !== undefined && (
          <span className="result-score">+{score} pts</span>
        )}
        <ShareButton url={shareUrl} />
      </div>

      <Explanation
        sister1={sister1}
        sister2={sister2}
        outgroup={outgroup}
        sisterMrca={sisterMrca}
        overallMrca={overallMrca}
        isPolytomy={isPolytomy}
        funFact={funFact}
        sources={sources}
      />
      <div className="result-actions">
        <Button onClick={onPlayAgain}>Next</Button>
      </div>

      {activelyDebated ? (
        <div className="debated-placeholder">
          <span className="debated-question-mark">?</span>
          <p>The true branching order is still being debated by scientists.</p>
        </div>
      ) : (
        <PhyloTree
          sister1={sister1}
          sister2={sister2}
          outgroup={outgroup}
          cladeLabel={cladeLabel}
          rootLabel={
            overallMrca.name !== sisterMrca.name ? overallMrca.name : undefined
          }
          images={images}
          userSelectedTaxIds={userSelectedTaxIds}
          organismColors={organismColors}
          correct={correct}
        />
      )}
      {diagram && (
        <ZoomableDiagram
          diagram={diagram}
          rootTaxId={overallMrca.taxId}
          taxonomyData={taxonomyData}
          correct={correct}
          userSelectedTaxIds={userSelectedTaxIds}
          organismColors={organismColors}
        />
      )}
      <MapToggle
        organisms={[sister1, sister2, outgroup]}
        organismColors={organismColors}
      />
      <LineageBreadcrumbs
        organisms={[sister1, sister2, outgroup]}
        taxonomyData={taxonomyData}
        organismColors={organismColors}
        userSelectedTaxIds={userSelectedTaxIds}
        correct={correct}
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
