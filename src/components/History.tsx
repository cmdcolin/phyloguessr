import { useEffect, useState } from 'react'

import { PAGE_SIZE, clearHistory, loadHistory, loadStats } from '../utils/history.ts'

import type { HistoryEntry, HistoryStats } from '../utils/history.ts'

type Tab = 'normal' | 'multi'

function buildHref(h: HistoryEntry) {
  if (!h.ncbiTaxIds) {
    return null
  }
  if (h.mode === 'multi') {
    return `/multi?ids=${h.ncbiTaxIds.join(',')}`
  }
  return `/${h.mode}?a=${h.ncbiTaxIds[0]}&b=${h.ncbiTaxIds[1]}&c=${h.ncbiTaxIds[2]}`
}

export default function History() {
  const [stats, setStats] = useState<HistoryStats | undefined>()
  const [allEntries, setAllEntries] = useState<HistoryEntry[]>([])
  const [tab, setTab] = useState<Tab>('normal')
  const [page, setPage] = useState(0)

  useEffect(() => {
    loadStats().then(setStats).catch(console.error)
    loadHistory().then(all => setAllEntries([...all].reverse())).catch(console.error)
  }, [])

  const filtered = allEntries.filter(h => (tab === 'multi') === (h.mode === 'multi'))
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const pageEntries = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  const handleTabChange = (t: Tab) => {
    setTab(t)
    setPage(0)
  }

  const handleClear = () => {
    clearHistory().catch(console.error)
    setStats(undefined)
    setAllEntries([])
    setPage(0)
  }

  const normalPlayed = allEntries.filter(h => h.mode !== 'multi').length
  const multiPlayed = allEntries.filter(h => h.mode === 'multi').length

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

      {stats && tab === 'normal' && normalPlayed > 0 && (
        <div className="history-stats">
          <span>
            {stats.totalWins}W / {normalPlayed - stats.totalWins}L
          </span>
          {stats.bestStreak > 1 && (
            <span className="streak">Best streak: {stats.bestStreak}</span>
          )}
          {stats.currentStreak > 1 && (
            <span className="streak">{stats.currentStreak} streak</span>
          )}
        </div>
      )}

      {stats && tab === 'multi' && multiPlayed > 0 && (
        <div className="history-stats">
          <span>
            {multiPlayed} games &middot; Total points: {stats.multiTotalScore ?? 0}
          </span>
          {multiPlayed > 0 && (
            <span>
              Avg score: {Math.round((stats.multiTotalScore ?? 0) / multiPlayed)}
            </span>
          )}
        </div>
      )}

      {filtered.length === 0 && (
        <p className="history-empty">No {tab} games played yet.</p>
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
                  <span className="history-result history-score">{h.score ?? '?'}</span>
                ) : (
                  <span className="history-result">{h.correct ? 'W' : 'L'}</span>
                )}
                <span className="history-organisms">
                  {href ? (
                    <a href={href}>{h.organisms.join(', ')}</a>
                  ) : (
                    h.organisms.join(', ')
                  )}
                </span>
                <span className="history-mode">{h.mode}</span>
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
