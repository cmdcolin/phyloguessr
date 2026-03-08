import { Fragment } from 'react'

import { TaxLink } from './TaxLink.tsx'
import { capitalize, formatRank } from '../utils/format.ts'
import { getLineageFromParents } from '../utils/taxonomy.ts'

import type { Organism } from '../data/organisms.ts'
import type { TaxonomyData } from '../utils/taxonomy.ts'

export interface BreadcrumbStep {
  taxId: number
  name: string
  rank: string
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

export function getFullLineage(taxId: number, data: TaxonomyData) {
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

export function getDivergenceStart(lineages: BreadcrumbStep[][]) {
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
  const ref = lineages[0]
  for (let i = commonLen - 1; i >= 0; i--) {
    if (majorRanks.has(ref[i].rank)) {
      return i
    }
  }
  return 0
}

function BreadcrumbPath({ steps }: { steps: BreadcrumbStep[] }) {
  return (
    <>
      {steps.map((step, i) => (
        <span key={step.taxId}>
          {i > 0 && <span className="breadcrumb-sep">{' \u203a '}</span>}
          <TaxLink name={step.name} taxId={step.taxId} />
          <span className="breadcrumb-rank"> ({formatRank(step.rank)})</span>
        </span>
      ))}
    </>
  )
}

export function OrganismBreadcrumbs({
  organism,
  taxonomyData,
  color,
  isUserPick,
  correct,
  startIndex,
}: {
  organism: Organism
  taxonomyData: TaxonomyData
  color?: string
  isUserPick?: boolean
  correct?: boolean
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
        {isUserPick && (
          <span
            className={`breadcrumb-pick-arrow ${correct === false ? 'breadcrumb-pick-wrong' : ''}`}
          >
            {'→ '}
          </span>
        )}
        {color && (
          <span className="map-color-dot" style={{ backgroundColor: color }} />
        )}
        {capitalize(organism.commonName)}{' '}
        {color && (
          <>
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
          </>
        )}
      </span>
      {allSteps.length > 0 ? (
        <span className="breadcrumb-path">
          <BreadcrumbPath steps={pinnedOnly} />
          {hasGap && (
            <span className="breadcrumb-sep">{' \u203a \u2026 \u203a '}</span>
          )}
          <BreadcrumbPath steps={tail} />
        </span>
      ) : (
        <span className="breadcrumb-path breadcrumb-missing">
          Lineage data missing
        </span>
      )}
    </>
  )
}

export function LineageBreadcrumbs({
  organisms,
  taxonomyData,
  organismColors,
  userSelectedTaxIds,
  correct,
}: {
  organisms: Organism[]
  taxonomyData: TaxonomyData
  organismColors?: Record<number, string>
  userSelectedTaxIds?: Set<number>
  correct?: boolean
}) {
  const lineages = organisms.map(o =>
    getFullLineage(o.ncbiTaxId, taxonomyData).reverse(),
  )
  const startIndex = getDivergenceStart(lineages)

  const sortedIndices = userSelectedTaxIds
    ? [...organisms.keys()].sort((a, b) => {
        const aSelected = userSelectedTaxIds.has(organisms[a].ncbiTaxId) ? 0 : 1
        const bSelected = userSelectedTaxIds.has(organisms[b].ncbiTaxId) ? 0 : 1
        return aSelected - bSelected
      })
    : [...organisms.keys()]

  return (
    <div className="lineage-breadcrumbs">
      {sortedIndices.map(idx => (
        <Fragment key={organisms[idx].ncbiTaxId}>
          <OrganismBreadcrumbs
            organism={organisms[idx]}
            taxonomyData={taxonomyData}
            color={organismColors?.[organisms[idx].ncbiTaxId]}
            isUserPick={userSelectedTaxIds?.has(organisms[idx].ncbiTaxId)}
            correct={correct}
            startIndex={startIndex}
          />
        </Fragment>
      ))}
    </div>
  )
}
