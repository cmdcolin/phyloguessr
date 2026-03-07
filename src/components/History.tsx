import { useEffect, useState } from 'react'

import {
  PAGE_SIZE,
  clearHistory,
  loadHistoryCount,
  loadHistoryPage,
  loadStats,
} from '../utils/history.ts'

import type { HistoryEntry, HistoryStats } from '../utils/history.ts'

export default function History() {
  const [stats, setStats] = useState<HistoryStats | undefined>()
  const [entries, setEntries] = useState<HistoryEntry[]>([])
  const [page, setPage] = useState(0)
  const [totalCount, setTotalCount] = useState<number | null>(null)

  useEffect(() => {
    loadStats().then(setStats).catch(console.error)
    loadHistoryCount().then(setTotalCount).catch(console.error)
  }, [])

  useEffect(() => {
    loadHistoryPage(page).then(setEntries).catch(console.error)
  }, [page])

  const totalPages = Math.ceil((totalCount ?? 0) / PAGE_SIZE)

  return (
    <div className="history-page">
      {stats && (
        <div className="history-stats">
          <span>
            {stats.totalWins}W / {stats.totalPlayed - stats.totalWins}L
          </span>
          {stats.bestStreak > 1 && (
            <span className="streak">Best: {stats.bestStreak}</span>
          )}
          {stats.currentStreak > 1 && (
            <span className="streak">{stats.currentStreak} streak</span>
          )}
          <button
            className="reset-btn"
            onClick={() => {
              clearHistory().catch(console.error)
              setStats(undefined)
              setEntries([])
              setTotalCount(0)
              setPage(0)
            }}
          >
            Reset
          </button>
        </div>
      )}

      {totalCount === 0 && (
        <p className="history-empty">No games played yet.</p>
      )}

      {entries.length > 0 && (
        <ul className="history-list">
          {entries.map((h, i) => {
            const href = h.ncbiTaxIds
              ? `/${h.mode}?a=${h.ncbiTaxIds[0]}&b=${h.ncbiTaxIds[1]}&c=${h.ncbiTaxIds[2]}`
              : null
            return (
              <li
                key={i}
                className={h.correct ? 'history-win' : 'history-loss'}
              >
                <span className="history-result">{h.correct ? 'W' : 'L'}</span>
                <span className="history-organisms">
                  {href ? (
                    <a href={href}>{h.organisms.join(', ')}</a>
                  ) : (
                    h.organisms.join(', ')
                  )}
                </span>
                <span className="history-sister">
                  Answer: {h.sister.join(' + ')}
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
    </div>
  )
}
