import { useState } from 'react'

import Button from './Button.tsx'
import { DISPLAY_TREE } from '../utils/cladePresets.ts'
import { findTaxId, searchTaxonNames } from '../utils/taxonomy.ts'

import type { TaxonomyData } from '../utils/taxonomy.ts'

function ResolvedStatus({
  trimmed,
  taxonomyData,
  resolvedTaxId,
}: {
  trimmed: string
  taxonomyData: TaxonomyData
  resolvedTaxId: number | undefined
}) {
  if (trimmed === 'micro') {
    return (
      <p className="clade-resolved">
        <span className="clade-check">✓</span> Microorganisms (cross-kingdom)
      </p>
    )
  }
  if (/^\d+$/.test(trimmed)) {
    const name = taxonomyData.names[trimmed]
    const hasParent = taxonomyData.parents[trimmed] !== undefined
    if (name || hasParent) {
      const rank = taxonomyData.ranks[trimmed]
      return (
        <p className="clade-resolved">
          <span className="clade-check">✓</span> {name ?? `Taxon ${trimmed}`}
          {rank ? ` (${rank})` : ''}
        </p>
      )
    }
    return (
      <p className="clade-error">
        <span className="clade-x">✕</span> No taxon found for ID {trimmed}
      </p>
    )
  }
  if (resolvedTaxId !== undefined) {
    const name = taxonomyData.names[String(resolvedTaxId)]
    const rank = taxonomyData.ranks[String(resolvedTaxId)]
    return (
      <p className="clade-resolved">
        <span className="clade-check">✓</span> {name ?? trimmed}
        {rank ? ` (${rank})` : ''}
      </p>
    )
  }
  return (
    <p className="clade-error">
      <span className="clade-x">✕</span> No taxon found for "{trimmed}"
    </p>
  )
}

function buildPlayUrl(trimmed: string, resolvedTaxId: number | undefined) {
  const params = new URLSearchParams()
  if (trimmed === 'micro') {
    params.set('id', 'micro')
  } else if (/^\d+$/.test(trimmed)) {
    params.set('id', trimmed)
  } else if (resolvedTaxId !== undefined) {
    params.set('id', String(resolvedTaxId))
  }
  const qs = params.toString()
  return `/random${qs ? `?${qs}` : ''}`
}

export default function AdvancedTaxonSearch({
  taxonomyData,
}: {
  taxonomyData: TaxonomyData | null
}) {
  const [cladeFilter, setCladeFilter] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)

  const trimmed = cladeFilter.trim()
  const isNumeric = trimmed.length > 0 && /^\d+$/.test(trimmed)

  const resolvedTaxId =
    taxonomyData && trimmed.length >= 2 && trimmed !== 'micro' && !isNumeric
      ? findTaxId(trimmed, taxonomyData)
      : undefined

  const numericFound =
    isNumeric && taxonomyData
      ? taxonomyData.names[trimmed] !== undefined ||
        taxonomyData.parents[trimmed] !== undefined
      : false

  const isValid =
    !taxonomyData ||
    trimmed === 'micro' ||
    numericFound ||
    resolvedTaxId !== undefined

  const suggestions =
    showSuggestions && taxonomyData
      ? searchTaxonNames(cladeFilter, taxonomyData)
      : []

  return (
    <details className="advanced-tree-details">
      <summary className="advanced-tree-summary">
        Browse full taxonomy tree or search
      </summary>
      <div className="advanced-tree-content">
        <ul className="clade-presets-list">
          {DISPLAY_TREE.map(entry =>
            entry.type === 'header' ? (
              <li key={entry.label} className="clade-tree-header">
                {entry.label}
              </li>
            ) : (
              <li
                key={entry.id}
                className={`clade-preset-item ${cladeFilter === entry.id ? 'active' : ''}`}
                onClick={() => {
                  setCladeFilter(prev => (prev === entry.id ? '' : entry.id))
                  setShowSuggestions(false)
                }}
              >
                <span className="clade-tree-prefix">{entry.prefix}</span>
                {entry.label}{' '}
                <span className="clade-preset-scientific">({entry.name})</span>
              </li>
            ),
          )}
        </ul>

        <div className="clade-search-row">
          <span className="clade-search-label">Search:</span>
          <div className="clade-autocomplete-inline">
            <input
              type="text"
              className="clade-input-inline"
              placeholder="taxon name or ID..."
              value={cladeFilter}
              onChange={e => {
                setCladeFilter(e.target.value)
              }}
              onBlur={() => {
                setTimeout(() => setShowSuggestions(false), 150)
              }}
              onFocus={() => setShowSuggestions(true)}
            />
            {suggestions.length > 0 && (
              <ul className="clade-suggestions">
                {suggestions.map(s => (
                  <li key={s.id}>
                    <button
                      onMouseDown={e => e.preventDefault()}
                      onClick={() => {
                        setCladeFilter(s.name)
                        setShowSuggestions(false)
                      }}
                    >
                      <span className="suggestion-name">{s.name}</span>
                      {s.rank && (
                        <span className="suggestion-rank">{s.rank}</span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        {taxonomyData && trimmed.length >= 2 && (
          <ResolvedStatus
            trimmed={trimmed}
            taxonomyData={taxonomyData}
            resolvedTaxId={resolvedTaxId}
          />
        )}

        <div className="custom-actions">
          <Button
            disabled={!trimmed || !isValid}
            href={buildPlayUrl(trimmed, resolvedTaxId)}
          >
            Play
          </Button>
        </div>
      </div>
    </details>
  )
}
