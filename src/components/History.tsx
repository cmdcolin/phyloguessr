import { useState } from 'react'

import { getCurrentStreak, loadHistory } from '../utils/history.ts'

import type { HistoryEntry } from '../utils/history.ts'

export default function History() {
  const [history, setHistory] = useState<HistoryEntry[]>(() =>
    typeof localStorage !== 'undefined' ? loadHistory() : [],
  )

  const wins = history.filter(h => h.correct).length
  const losses = history.length - wins
  const streak = getCurrentStreak(history)

  return (
    <div className="history-page">
      {history.length > 0 && (
        <div className="history-stats">
          <span>
            {wins}W / {losses}L
          </span>
          {streak > 1 && <span className="streak">{streak} streak</span>}
          <button
            className="reset-btn"
            onClick={() => {
              localStorage.removeItem('phyloHistory')
              setHistory([])
            }}
          >
            Reset
          </button>
        </div>
      )}

      {history.length === 0 && (
        <p className="history-empty">No games played yet.</p>
      )}

      {history.length > 0 && (
        <ul className="history-list">
          {[...history].reverse().map((h, i) => (
            <li
              key={history.length - 1 - i}
              className={h.correct ? 'history-win' : 'history-loss'}
            >
              <span className="history-result">{h.correct ? 'W' : 'L'}</span>
              <span className="history-organisms">
                {h.organisms.join(', ')}
              </span>
              <span className="history-sister">
                Answer: {h.sister.join(' + ')}
              </span>
              <span className="history-mode">{h.mode}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
