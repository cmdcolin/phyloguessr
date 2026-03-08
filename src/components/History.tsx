import { useEffect, useState } from 'react'

import TaxonFilterPicker from './TaxonFilterPicker.tsx'
import { formatModeKey } from '../utils/cladePresets.ts'
import {
  PAGE_SIZE,
  clearHistory,
  loadHistory,
  loadStats,
} from '../utils/history.ts'

import type { HistoryEntry, HistoryStats } from '../utils/history.ts'

type Tab = 'normal' | 'multi'

function buildHref(h: HistoryEntry) {
  if (!h.ncbiTaxIds) {
    return null
  }
  if (h.mode === 'multi') {
    return `/multi?ids=${h.ncbiTaxIds.join(',')}`
  }
  const baseMode = h.mode.startsWith('random') ? 'random' : h.mode
  return `/${baseMode}?a=${h.ncbiTaxIds[0]}&b=${h.ncbiTaxIds[1]}&c=${h.ncbiTaxIds[2]}`
}

export default function History() {
  const [stats, setStats] = useState<HistoryStats | undefined>()
  const [allEntries, setAllEntries] = useState<HistoryEntry[]>([])
  const [tab, setTab] = useState<Tab>('normal')
  const [page, setPage] = useState(0)
  const [modeFilter, setModeFilter] = useState('')
  const [modeStats, setModeStats] = useState<HistoryStats | undefined>()

  useEffect(() => {
    loadStats().then(setStats).catch(console.error)
    loadHistory()
      .then(all => setAllEntries([...all].reverse()))
      .catch(console.error)
  }, [])

  useEffect(() => {
    if (modeFilter) {
      loadStats(modeFilter)
        .then(s => setModeStats(s ?? undefined))
        .catch(console.error)
    }
  }, [modeFilter])

  const filtered = allEntries.filter(h => {
    if (tab === 'multi') {
      return h.mode === 'multi'
    }
    if (h.mode === 'multi') {
      return false
    }
    if (modeFilter) {
      return h.mode === modeFilter
    }
    return true
  })
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const pageEntries = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  const handleTabChange = (t: Tab) => {
    setTab(t)
    setPage(0)
  }

  const handleClear = () => {
    clearHistory().catch(console.error)
    setStats(undefined)
    setModeStats(undefined)
    setAllEntries([])
    setPage(0)
  }

  const multiPlayed = allEntries.filter(h => h.mode === 'multi').length

  const displayStats = modeFilter && modeStats ? modeStats : stats

  return (
    <div className="history-page">
      <div className="history-tabs">
        <button
          className={`history-tab ${tab === 'normal' ? 'active' : ''}`}
          onClick={() => handleTabChange('normal')}
        >
          Normal
        </button>
        <button
          className={`history-tab ${tab === 'multi' ? 'active' : ''}`}
          onClick={() => handleTabChange('multi')}
        >
          Multi
        </button>
      </div>

      {tab === 'normal' && (
        <TaxonFilterPicker
          className="history-mode-filter"
          value={modeFilter}
          onChange={mode => {
            setModeFilter(mode)
            if (!mode) {
              setModeStats(undefined)
            }
            setPage(0)
          }}
          showRandom
        />
      )}

      {displayStats && tab === 'normal' && displayStats.totalPlayed > 0 && (
        <div className="history-stats">
          <span>
            {displayStats.totalWins}W /{' '}
            {displayStats.totalPlayed - displayStats.totalWins}L
          </span>
          {displayStats.bestStreak > 1 && (
            <span className="streak">
              Best streak: {displayStats.bestStreak}
            </span>
          )}
          {displayStats.currentStreak > 1 && (
            <span className="streak">{displayStats.currentStreak} streak</span>
          )}
        </div>
      )}

      {stats && tab === 'multi' && multiPlayed > 0 && (
        <div className="history-stats">
          <span>
            {multiPlayed} games &middot; Total points:{' '}
            {stats.multiTotalScore ?? 0}
          </span>
          {multiPlayed > 0 && (
            <span>
              Avg score:{' '}
              {Math.round((stats.multiTotalScore ?? 0) / multiPlayed)}
            </span>
          )}
        </div>
      )}

      {filtered.length === 0 && (
        <p className="history-empty">
          No{' '}
          {tab === 'multi'
            ? 'multi'
            : modeFilter
              ? formatModeKey(modeFilter)
              : tab}{' '}
          games played yet.
        </p>
      )}

      {pageEntries.length > 0 && (
        <ul className="history-list">
          {pageEntries.map((h, i) => {
            const href = buildHref(h)
            return (
              <li
                key={i}
                className={h.correct ? 'history-win' : 'history-loss'}
              >
                {tab === 'multi' ? (
                  <span className="history-result history-score">
                    {h.score ?? '?'}
                  </span>
                ) : (
                  <span className="history-result">
                    {h.correct ? 'W' : 'L'}
                  </span>
                )}
                <span className="history-organisms">
                  {href ? (
                    <a href={href}>{h.organisms.join(', ')}</a>
                  ) : (
                    h.organisms.join(', ')
                  )}
                </span>
                <span className="history-mode">{formatModeKey(h.mode)}</span>
              </li>
            )
          })}
        </ul>
      )}

      {totalPages > 1 && (
        <div className="history-pagination">
          <button onClick={() => setPage(p => p - 1)} disabled={page === 0}>
            Prev
          </button>
          <span>
            {page + 1} / {totalPages}
          </span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={page >= totalPages - 1}
          >
            Next
          </button>
        </div>
      )}

      <button className="reset-btn" onClick={handleClear}>
        Reset all history
      </button>
    </div>
  )
}
