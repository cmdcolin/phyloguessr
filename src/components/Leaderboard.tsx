import { useEffect, useState } from 'react'

import { getTopStreaks, getUid, isNameTaken } from '../firebase.ts'
import { localStorageGetItem } from '../utils/storage.ts'

import type { LeaderboardEntry } from '../firebase.ts'

export default function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [uid, setUid] = useState<string | null>(null)
  const [name, setName] = useState(
    () => localStorageGetItem('phyloLeaderboardName') ?? '',
  )
  const [editingName, setEditingName] = useState(
    () => !localStorageGetItem('phyloLeaderboardName'),
  )

  const [nameError, setNameError] = useState('')
  const [checking, setChecking] = useState(false)

  useEffect(() => {
    getTopStreaks(20)
      .then(data => {
        setEntries(data)
        setLoading(false)
      })
      .catch(err => {
        setError('Failed to load leaderboard')
        setLoading(false)
        console.error(err)
      })
    getUid().then(setUid)
  }, [])

  const handleSetName = async () => {
    const trimmed = name.trim()
    if (!trimmed || trimmed.length > 20) {
      return
    }
    setNameError('')
    setChecking(true)
    try {
      const taken = await isNameTaken(trimmed)
      if (taken) {
        setNameError('That name is already taken')
        setChecking(false)
      } else {
        localStorage.setItem('phyloLeaderboardName', trimmed)
        window.dispatchEvent(new Event('nickname-changed'))
        setEditingName(false)
        setChecking(false)
      }
    } catch {
      setNameError('Could not check name availability')
      setChecking(false)
    }
  }

  return (
    <div className="leaderboard-page">
      <div className="leaderboard-nickname">
        {editingName ? (
          <div className="leaderboard-form">
            <input
              type="text"
              className="leaderboard-name-input"
              placeholder="Pick a nickname (max 20 chars)"
              maxLength={20}
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  handleSetName()
                }
              }}
            />
            <button
              className="leaderboard-submit-btn"
              disabled={!name.trim() || checking}
              onClick={handleSetName}
            >
              {checking ? 'Checking...' : 'Save'}
            </button>
            {nameError && <p className="leaderboard-error">{nameError}</p>}
          </div>
        ) : (
          <div className="leaderboard-name-display">
            <span>
              Playing as <strong>{name}</strong>
            </span>
            <button
              className="leaderboard-change-btn"
              onClick={() => setEditingName(true)}
            >
              change
            </button>
          </div>
        )}
      </div>

      {loading && <p className="leaderboard-loading">Loading...</p>}
      {error && <p className="leaderboard-error">{error}</p>}

      {!loading && entries.length === 0 && !error && (
        <p className="leaderboard-empty">No scores yet. Be the first!</p>
      )}

      {!loading && entries.length > 0 && (
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
    </div>
  )
}
