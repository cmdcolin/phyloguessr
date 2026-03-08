import { useEffect, useState } from 'react'

import {
  getTopModeMultiScores,
  getTopModeStreaks,
  getTopMultiScores,
  getTopStreaks,
  getUid,
} from '../firebase.ts'
import { formatModeKey } from '../utils/cladePresets.ts'
import TaxonFilterPicker from './TaxonFilterPicker.tsx'
import styles from './Leaderboard.module.css'

import type { LeaderboardEntry, MultiLeaderboardEntry } from '../firebase.ts'

type Tab = 'classic' | 'multi'
type StreakSort = 'bestStreak' | 'totalWins' | 'totalPlayed' | 'name'
type MultiSort = 'totalPoints' | 'avg' | 'perfects' | 'totalPlayed' | 'name'
const MIN_PLAYED_FOR_AVG = 5

interface StreakEntry {
  uid: string
  name: string
  bestStreak: number
  totalWins: number
  totalPlayed: number
}

function SortIcon({ active, dir }: { active: boolean; dir: 'asc' | 'desc' }) {
  if (!active) {
    return null
  }
  return <i className={styles.sortIcon}>{dir === 'desc' ? '↓' : '↑'}</i>
}

function StreakTable({
  entries,
  uid,
}: {
  entries: StreakEntry[]
  uid: string | null
}) {
  const [sort, setSort] = useState<StreakSort>('bestStreak')
  const [dir, setDir] = useState<'asc' | 'desc'>('desc')

  const handleSort = (col: StreakSort) => {
    if (sort === col) {
      setDir(d => (d === 'desc' ? 'asc' : 'desc'))
    } else {
      setSort(col)
      setDir(col === 'name' ? 'asc' : 'desc')
    }
  }

  const sorted = [...entries].sort((a, b) => {
    let cmp = 0
    if (sort === 'name') {
      cmp = a.name.localeCompare(b.name)
    } else if (sort === 'bestStreak') {
      cmp = a.bestStreak - b.bestStreak
    } else if (sort === 'totalWins') {
      cmp = a.totalWins - b.totalWins
    } else {
      cmp = a.totalPlayed - b.totalPlayed
    }
    return dir === 'desc' ? -cmp : cmp
  })

  const th = (col: StreakSort, label: string) => (
    <th className={styles.sortable} onClick={() => handleSort(col)}>
      {label}
      <SortIcon active={sort === col} dir={dir} />
    </th>
  )

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>#</th>
          {th('name', 'Name')}
          {th('bestStreak', 'Best Streak')}
          {th('totalWins', 'Wins')}
          {th('totalPlayed', 'Played')}
        </tr>
      </thead>
      <tbody>
        {sorted.map((entry, i) => (
          <tr
            key={entry.uid}
            className={entry.uid === uid ? styles.you : ''}
          >
            <td className={styles.rank}>{i + 1}</td>
            <td className={styles.name}>
              {entry.name}
              {entry.uid === uid ? ' (you)' : ''}
            </td>
            <td className={styles.streak}>{entry.bestStreak}</td>
            <td>{entry.totalWins}</td>
            <td>{entry.totalPlayed}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

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
  const [multiSort, setMultiSort] = useState<MultiSort>('totalPoints')
  const [multiDir, setMultiDir] = useState<'asc' | 'desc'>('desc')
  const [selectedMode, setSelectedMode] = useState<string>('random')
  const [modeEntries, setModeEntries] = useState<StreakEntry[]>([])
  const [multiMode, setMultiMode] = useState<string>('')
  const [multiModeEntries, setMultiModeEntries] = useState<MultiLeaderboardEntry[]>([])

  const handleModeSelect = (mode: string) => {
    setSelectedMode(mode === '' ? 'random' : mode)
    setLoading(true)
    setError('')
  }

  const handleMultiModeSelect = (mode: string) => {
    setMultiMode(mode)
    setLoading(true)
    setError('')
  }

  const handleMultiSort = (col: MultiSort) => {
    if (multiSort === col) {
      setMultiDir(d => (d === 'desc' ? 'asc' : 'desc'))
    } else {
      setMultiSort(col)
      setMultiDir(col === 'name' ? 'asc' : 'desc')
    }
  }

  useEffect(() => {
    let cancelled = false
    const fetchData = async () => {
      try {
        if (tab === 'classic') {
          if (selectedMode) {
            const data = await getTopModeStreaks(selectedMode, 20)
            if (!cancelled) {
              setModeEntries(data)
              setLoading(false)
            }
          } else {
            const data = await getTopStreaks(20)
            if (!cancelled) {
              setEntries(data)
              setLoading(false)
            }
          }
        } else {
          if (multiMode) {
            const data = await getTopModeMultiScores(multiMode, 20)
            if (!cancelled) {
              setMultiModeEntries(data)
              setLoading(false)
            }
          } else {
            const data = await getTopMultiScores(20)
            if (!cancelled) {
              setMultiEntries(data)
              setLoading(false)
            }
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
  }, [tab, selectedMode, multiMode])

  const classicEntries = selectedMode ? modeEntries : entries
  const activeMultiEntries = multiMode ? multiModeEntries : multiEntries
  const emptyLabel = selectedMode
    ? `No scores for ${formatModeKey(selectedMode)} yet.`
    : 'No scores yet. Be the first!'

  const sortedMulti = [...activeMultiEntries]
    .filter(e => multiSort === 'avg' ? e.totalPlayed >= MIN_PLAYED_FOR_AVG : true)
    .sort((a, b) => {
      let cmp = 0
      if (multiSort === 'name') {
        cmp = a.name.localeCompare(b.name)
      } else if (multiSort === 'totalPoints') {
        cmp = a.totalPoints - b.totalPoints
      } else if (multiSort === 'avg') {
        const avgA = a.totalPlayed > 0 ? a.totalPoints / a.totalPlayed : 0
        const avgB = b.totalPlayed > 0 ? b.totalPoints / b.totalPlayed : 0
        cmp = avgA - avgB
      } else if (multiSort === 'perfects') {
        cmp = a.perfects - b.perfects
      } else {
        cmp = a.totalPlayed - b.totalPlayed
      }
      return multiDir === 'desc' ? -cmp : cmp
    })

  const mth = (col: MultiSort, label: string) => (
    <th className={styles.sortable} onClick={() => handleMultiSort(col)}>
      {label}
      <SortIcon active={multiSort === col} dir={multiDir} />
    </th>
  )

  const multiEmptyLabel = multiMode
    ? `No multi scores for ${formatModeKey(multiMode)} yet.`
    : 'No multi scores yet. Be the first!'

  return (
    <div className="leaderboard-page">
      <div className={styles.tabs}>
        <button
          className={`${styles.tab}${tab === 'classic' ? ` ${styles.active}` : ''}`}
          onClick={() => setTab('classic')}
        >
          Classic
        </button>
        <button
          className={`${styles.tab}${tab === 'multi' ? ` ${styles.active}` : ''}`}
          onClick={() => setTab('multi')}
        >
          Multi
        </button>
      </div>

      {tab === 'classic' && (
        <TaxonFilterPicker
          className={styles.modeSection}
          value={selectedMode}
          onChange={handleModeSelect}
          showRandom
        />
      )}

      {tab === 'multi' && (
        <TaxonFilterPicker
          className={styles.modeSection}
          value={multiMode}
          onChange={handleMultiModeSelect}
        />
      )}

      {loading && <p className={styles.loading}>Loading...</p>}
      {error && <p className={styles.error}>{error}</p>}

      {!loading && tab === 'classic' && classicEntries.length === 0 && !error && (
        <p className={styles.empty}>{emptyLabel}</p>
      )}

      {!loading && tab === 'classic' && classicEntries.length > 0 && (
        <StreakTable entries={classicEntries} uid={uid} />
      )}

      {!loading && tab === 'multi' && sortedMulti.length === 0 && !error && (
        <p className={styles.empty}>{multiEmptyLabel}</p>
      )}

      {!loading && tab === 'multi' && sortedMulti.length > 0 && (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              {mth('name', 'Name')}
              {mth('totalPoints', 'Total Points')}
              {mth('avg', `Avg (min ${MIN_PLAYED_FOR_AVG})`)}
              {mth('perfects', 'Perfects')}
              {mth('totalPlayed', 'Played')}
            </tr>
          </thead>
          <tbody>
            {sortedMulti.map((entry, i) => (
              <tr
                key={entry.uid}
                className={entry.uid === uid ? styles.you : ''}
              >
                <td className={styles.rank}>{i + 1}</td>
                <td className={styles.name}>
                  {entry.name}
                  {entry.uid === uid ? ' (you)' : ''}
                </td>
                <td className={styles.streak}>{entry.totalPoints}</td>
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
      )}
    </div>
  )
}
