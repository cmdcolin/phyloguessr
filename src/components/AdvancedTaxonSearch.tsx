import { useState } from 'react'

import Button from './Button.tsx'
import { DISPLAY_TREE } from '../utils/cladePresets.ts'
import { findTaxId, searchTaxonNames } from '../utils/taxonomy.ts'

import type { TaxonomyData } from '../utils/taxonomy.ts'

export default function AdvancedTaxonSearch({
  taxonomyData,
}: {
  taxonomyData: TaxonomyData | null
}) {
  const [cladeFilter, setCladeFilter] = useState('')
  const [cladeError, setCladeError] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)

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
                  setCladeFilter(prev =>
                    prev === entry.id ? '' : entry.id,
                  )
                  setCladeError('')
                  setShowSuggestions(false)
                }}
              >
                <span className="clade-tree-prefix">{entry.prefix}</span>
                {entry.label}{' '}
                <span className="clade-preset-scientific">
                  ({entry.name})
                </span>
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
                setCladeError('')
              }}
              onBlur={() => {
                setTimeout(() => setShowSuggestions(false), 150)
              }}
              onFocus={() => setShowSuggestions(true)}
            />
            {showSuggestions &&
              taxonomyData &&
              (() => {
                const suggestions = searchTaxonNames(
                  cladeFilter,
                  taxonomyData,
                )
                if (suggestions.length === 0) {
                  return null
                }
                return (
                  <ul className="clade-suggestions">
                    {suggestions.map(s => (
                      <li key={s.id}>
                        <button
                          onMouseDown={e => e.preventDefault()}
                          onClick={() => {
                            setCladeFilter(s.name)
                            setCladeError('')
                            setShowSuggestions(false)
                          }}
                        >
                          <span className="suggestion-name">
                            {s.name}
                          </span>
                          {s.rank && (
                            <span className="suggestion-rank">
                              {s.rank}
                            </span>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                )
              })()}
          </div>
        </div>
        {cladeError && <p className="clade-error">{cladeError}</p>}
        {taxonomyData &&
          cladeFilter.trim().length >= 2 &&
          (() => {
            const trimmed = cladeFilter.trim()
            if (trimmed === 'micro') {
              return (
                <p className="clade-resolved">
                  <span className="clade-check">✓</span> Microorganisms
                  (cross-kingdom)
                </p>
              )
            }
            const isNumeric = /^\d+$/.test(trimmed)
            if (isNumeric) {
              const name = taxonomyData.names[trimmed]
              const hasParent =
                taxonomyData.parents[trimmed] !== undefined
              if (name || hasParent) {
                const rank = taxonomyData.ranks[trimmed]
                return (
                  <p className="clade-resolved">
                    <span className="clade-check">✓</span>{' '}
                    {name ?? `Taxon ${trimmed}`}
                    {rank ? ` (${rank})` : ''}
                  </p>
                )
              }
              return (
                <p className="clade-error">
                  <span className="clade-x">✕</span> No taxon found for ID{' '}
                  {trimmed}
                </p>
              )
            }
            const match = findTaxId(trimmed, taxonomyData)
            if (match !== undefined) {
              const name = taxonomyData.names[String(match)]
              const rank = taxonomyData.ranks[String(match)]
              return (
                <p className="clade-resolved">
                  <span className="clade-check">✓</span> {name ?? trimmed}
                  {rank ? ` (${rank})` : ''}
                </p>
              )
            }
            return (
              <p className="clade-error">
                <span className="clade-x">✕</span> No taxon found for "
                {trimmed}"
              </p>
            )
          })()}

        <div className="custom-actions">
          <Button
            disabled={
              !cladeFilter.trim() ||
              (!!taxonomyData &&
                cladeFilter.trim() !== 'micro' &&
                findTaxId(cladeFilter.trim(), taxonomyData) === undefined)
            }
            href={(() => {
              const params = new URLSearchParams()
              const trimmed = cladeFilter.trim()
              if (trimmed) {
                if (trimmed === 'micro') {
                  params.set('id', 'micro')
                } else if (/^\d+$/.test(trimmed)) {
                  params.set('id', trimmed)
                } else if (taxonomyData) {
                  const taxId = findTaxId(trimmed, taxonomyData)
                  if (taxId !== undefined) {
                    params.set('id', String(taxId))
                  }
                }
              }
              const qs = params.toString()
              return `/random${qs ? `?${qs}` : ''}`
            })()}
          >
            Play
          </Button>
        </div>
      </div>
    </details>
  )
}
