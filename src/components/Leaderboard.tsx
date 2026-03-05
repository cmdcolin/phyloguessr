import { useEffect, useRef, useState } from "react"
import { getTopStreaks, getUid } from "../firebase.ts"
import { getCurrentStreak } from "../utils/history.ts"
import type { LeaderboardEntry } from "../firebase.ts"
import type { HistoryEntry } from "../utils/history.ts"

export default function Leaderboard({
  history,
  onClose,
}: {
  history: HistoryEntry[]
  onClose: () => void
}) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [uid, setUid] = useState<string | null>(null)
  const [name, setName] = useState(
    () => localStorage.getItem("phyloLeaderboardName") ?? "",
  )
  const [editingName, setEditingName] = useState(
    () => !localStorage.getItem("phyloLeaderboardName"),
  )

  const prevHistoryLength = useRef(history.length)

  const loadEntries = () => {
    setLoading(true)
    getTopStreaks(20)
      .then((data) => {
        setEntries(data)
        setLoading(false)
      })
      .catch((err) => {
        setError("Failed to load leaderboard")
        setLoading(false)
        console.error(err)
      })
  }

  useEffect(() => {
    loadEntries()
    getUid().then(setUid)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (history.length !== prevHistoryLength.current) {
      prevHistoryLength.current = history.length
      loadEntries()
    }
  }, [history.length]) // eslint-disable-line react-hooks/exhaustive-deps

  const wins = history.filter((h) => h.correct).length
  const streak = getCurrentStreak(history)

  const handleSetName = () => {
    const trimmed = name.trim()
    if (!trimmed || trimmed.length > 20) {
      return
    }
    localStorage.setItem("phyloLeaderboardName", trimmed)
    window.dispatchEvent(new Event("nickname-changed"))
    setEditingName(false)
  }

  return (
    <div className="leaderboard-panel">
      <div className="leaderboard-header">
        <h3>Leaderboard</h3>
        <button className="close-btn" onClick={onClose}>
          Close
        </button>
      </div>

      <div className="leaderboard-nickname">
        {editingName ? (
          <div className="leaderboard-form">
            <input
              type="text"
              className="leaderboard-name-input"
              placeholder="Pick a nickname (max 20 chars)"
              maxLength={20}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSetName()
                }
              }}
            />
            <button
              className="leaderboard-submit-btn"
              disabled={!name.trim()}
              onClick={handleSetName}
            >
              Save
            </button>
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
        <p className="leaderboard-your-stats">
          Current streak: {streak} | Wins: {wins} | Played: {history.length}
        </p>
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
              <tr
                key={entry.uid}
                className={entry.uid === uid ? "lb-you" : ""}
              >
                <td className="lb-rank">{i + 1}</td>
                <td className="lb-name">
                  {entry.name}
                  {entry.uid === uid ? " (you)" : ""}
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
