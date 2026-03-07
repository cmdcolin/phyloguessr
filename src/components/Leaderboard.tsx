import { useEffect, useState } from 'react'

import {
  getTopMultiScores,
  getTopStreaks,
  getUid,
} from '../firebase.ts'

import type { LeaderboardEntry, MultiLeaderboardEntry } from '../firebase.ts'

type Tab = 'classic' | 'multi'
type MultiSort = 'total' | 'average'
const MIN_PLAYED_FOR_AVG = 5

export default function Leaderboard() {
  const [tab, setTabRaw] = useState<Tab>('classic')
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [multiEntries, setMultiEntries] = useState<MultiLeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const setTab = (t: Tab) => {
    setTabRaw(t)
    setLoading(true)
    setError('')
  }
  const [uid, setUid] = useState<string | null>(null)
  const [multiSort, setMultiSort] = useState<MultiSort>('total')

  useEffect(() => {
    let cancelled = false
    const fetchData = async () => {
      try {
        if (tab === 'classic') {
          const data = await getTopStreaks(20)
          if (!cancelled) {
            setEntries(data)
            setLoading(false)
          }
        } else {
          const data = await getTopMultiScores(20)
          if (!cancelled) {
            setMultiEntries(data)
            setLoading(false)
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError('Failed to load leaderboard')
          setLoading(false)
        }
        console.error(err)
      }
    }
    fetchData()
    getUid().then(setUid)
    return () => {
      cancelled = true
    }
  }, [tab])

  return (
    <div className="leaderboard-page">
      <div className="leaderboard-tabs">
        <button
          className={`leaderboard-tab ${tab === 'classic' ? 'active' : ''}`}
          onClick={() => setTab('classic')}
        >
          Classic
        </button>
        <button
          className={`leaderboard-tab ${tab === 'multi' ? 'active' : ''}`}
          onClick={() => setTab('multi')}
        >
          Multi
        </button>
      </div>

      {loading && <p className="leaderboard-loading">Loading...</p>}
      {error && <p className="leaderboard-error">{error}</p>}

      {!loading && tab === 'classic' && entries.length === 0 && !error && (
        <p className="leaderboard-empty">No scores yet. Be the first!</p>
      )}

      {!loading && tab === 'classic' && entries.length > 0 && (
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Best Streak</th>
              <th>Wins</th>
              <th>Played</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, i) => (
              <tr key={entry.uid} className={entry.uid === uid ? 'lb-you' : ''}>
                <td className="lb-rank">{i + 1}</td>
                <td className="lb-name">
                  {entry.name}
                  {entry.uid === uid ? ' (you)' : ''}
                </td>
                <td className="lb-streak">{entry.bestStreak}</td>
                <td>{entry.totalWins}</td>
                <td>{entry.totalPlayed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!loading && tab === 'multi' && multiEntries.length === 0 && !error && (
        <p className="leaderboard-empty">No multi scores yet. Be the first!</p>
      )}

      {!loading && tab === 'multi' && multiEntries.length > 0 && (
        <>
          <div className="leaderboard-sort">
            Sort by:{' '}
            <button
              className={`leaderboard-sort-btn ${multiSort === 'total' ? 'active' : ''}`}
              onClick={() => setMultiSort('total')}
            >
              Total Points
            </button>
            <button
              className={`leaderboard-sort-btn ${multiSort === 'average' ? 'active' : ''}`}
              onClick={() => setMultiSort('average')}
            >
              Avg (min {MIN_PLAYED_FOR_AVG} played)
            </button>
          </div>
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Total Points</th>
                <th>Avg</th>
                <th>Perfects</th>
                <th>Played</th>
              </tr>
            </thead>
            <tbody>
              {(multiSort === 'average'
                ? [...multiEntries]
                    .filter(e => e.totalPlayed >= MIN_PLAYED_FOR_AVG)
                    .sort(
                      (a, b) =>
                        b.totalPoints / b.totalPlayed -
                        a.totalPoints / a.totalPlayed,
                    )
                : multiEntries
              ).map((entry, i) => (
                <tr
                  key={entry.uid}
                  className={entry.uid === uid ? 'lb-you' : ''}
                >
                  <td className="lb-rank">{i + 1}</td>
                  <td className="lb-name">
                    {entry.name}
                    {entry.uid === uid ? ' (you)' : ''}
                  </td>
                  <td className="lb-streak">{entry.totalPoints}</td>
                  <td>
                    {entry.totalPlayed > 0
                      ? Math.round(entry.totalPoints / entry.totalPlayed)
                      : 0}
                  </td>
                  <td>{entry.perfects}</td>
                  <td>{entry.totalPlayed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  )
}
