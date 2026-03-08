import { useState } from 'react'

import styles from './TaxonFilterPicker.module.css'
import { DISPLAY_TREE, formatModeKey } from '../utils/cladePresets.ts'

export default function TaxonFilterPicker({
  value,
  onChange,
  showRandom,
  className,
}: {
  value: string
  onChange: (mode: string) => void
  showRandom?: boolean
  className?: string
}) {
  const [treeOpen, setTreeOpen] = useState(false)

  const select = (mode: string) => {
    onChange(mode)
    if (mode) {
      setTreeOpen(false)
    }
  }

  return (
    <div className={className}>
      <div className={styles.modeBar}>
        {value ? (
          <>
            <span className={styles.modeLabel}>{formatModeKey(value)}</span>
            <button className={styles.modeClear} onClick={() => select('')}>
              Clear
            </button>
          </>
        ) : (
          <span className={styles.modeLabel}>All modes</span>
        )}
        <button
          className={styles.modeToggle}
          onClick={() => setTreeOpen(prev => !prev)}
        >
          {treeOpen ? 'Hide' : 'Taxon specific leaderboard'}
        </button>
      </div>
      {treeOpen && (
        <ul className={`clade-presets-list ${styles.taxonTree}`}>
          <li
            className={`clade-preset-item ${!value ? 'active' : ''}`}
            onClick={() => select('')}
          >
            All modes
          </li>
          <li
            className={`clade-preset-item ${value === 'easy' ? 'active' : ''}`}
            onClick={() => select('easy')}
          >
            Easy
          </li>
          {showRandom && (
            <li
              className={`clade-preset-item ${value === 'random' ? 'active' : ''}`}
              onClick={() => select('random')}
            >
              Random
            </li>
          )}
          {DISPLAY_TREE.map(entry =>
            entry.type === 'header' ? (
              <li key={entry.label} className="clade-tree-header">
                {entry.label}
              </li>
            ) : (
              <li
                key={entry.id}
                className={`clade-preset-item ${value === `random:${entry.id}` ? 'active' : ''}`}
                onClick={() => select(`random:${entry.id}`)}
              >
                <span className="clade-tree-prefix">{entry.prefix}</span>
                {entry.label}{' '}
                <span className="clade-preset-scientific">({entry.name})</span>
              </li>
            ),
          )}
        </ul>
      )}
    </div>
  )
}
