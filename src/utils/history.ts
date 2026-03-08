import { openDB } from 'idb'

import type { DBSchema } from 'idb'

export interface HistoryEntry {
  correct: boolean
  organisms: string[]
  sister: string[]
  mode: string
  timestamp: number
  ncbiTaxIds?: number[]
  score?: number
}

export interface HistoryStats {
  totalPlayed: number
  totalWins: number
  bestStreak: number
  currentStreak: number
  multiTotalScore?: number
  multiTotalPlayed?: number
}

interface PhyloSchema extends DBSchema {
  history: {
    value: HistoryEntry
    key: number
  }
  stats: {
    value: HistoryStats
    key: string
  }
}

export const PAGE_SIZE = 20
const MAX_HISTORY = 500

let dbPromise: ReturnType<typeof openDB<PhyloSchema>> | null = null

function getDb() {
  if (!dbPromise) {
    dbPromise = openDB<PhyloSchema>('phyloguessr', 2, {
      upgrade(db, oldVersion) {
        if (oldVersion < 1) {
          db.createObjectStore('history', { autoIncrement: true })
        }
        if (oldVersion < 2) {
          db.createObjectStore('stats')
        }
      },
    })
  }
  return dbPromise
}

export async function loadHistory() {
  const db = await getDb()
  return db.getAll('history')
}

export async function loadHistoryPage(page: number) {
  const db = await getDb()
  const results: HistoryEntry[] = []
  let cursor = await db.transaction('history').store.openCursor(null, 'prev')
  if (cursor && page > 0) {
    cursor = await cursor.advance(page * PAGE_SIZE)
  }
  while (cursor && results.length < PAGE_SIZE) {
    results.push(cursor.value)
    cursor = await cursor.continue()
  }
  return results
}

export async function loadHistoryCount() {
  const db = await getDb()
  return db.count('history')
}

export async function loadStats(modeKey?: string) {
  const db = await getDb()
  if (modeKey) {
    return db.get('stats', `mode:${modeKey}`)
  }
  return db.get('stats', 'global')
}

export async function addHistoryEntry(entry: HistoryEntry) {
  const db = await getDb()
  const tx = db.transaction(['history', 'stats'], 'readwrite')
  const historyStore = tx.objectStore('history')
  const statsStore = tx.objectStore('stats')

  await historyStore.add(entry)

  const count = await historyStore.count()
  if (count > MAX_HISTORY) {
    const cursor = await historyStore.openCursor()
    if (cursor) {
      await cursor.delete()
    }
  }

  const updateStreak = async (key: string, correct: boolean) => {
    const existing = await statsStore.get(key)
    const prev = existing ?? {
      totalPlayed: 0,
      totalWins: 0,
      bestStreak: 0,
      currentStreak: 0,
    }
    const streak = correct ? prev.currentStreak + 1 : 0
    await statsStore.put(
      {
        totalPlayed: prev.totalPlayed + 1,
        totalWins: prev.totalWins + (correct ? 1 : 0),
        bestStreak: Math.max(prev.bestStreak, streak),
        currentStreak: streak,
      },
      key,
    )
  }

  const isMulti = entry.mode === 'multi'
  const existing = await statsStore.get('global')
  const prev = existing ?? {
    totalPlayed: 0,
    totalWins: 0,
    bestStreak: 0,
    currentStreak: 0,
  }
  const globalStreak = entry.correct ? prev.currentStreak + 1 : 0
  await statsStore.put(
    {
      totalPlayed: prev.totalPlayed + 1,
      totalWins: prev.totalWins + (entry.correct ? 1 : 0),
      bestStreak: Math.max(prev.bestStreak, globalStreak),
      currentStreak: globalStreak,
      multiTotalScore:
        (prev.multiTotalScore ?? 0) + (isMulti ? (entry.score ?? 0) : 0),
      multiTotalPlayed: (prev.multiTotalPlayed ?? 0) + (isMulti ? 1 : 0),
    },
    'global',
  )

  if (entry.mode && entry.mode !== 'multi') {
    await updateStreak(`mode:${entry.mode}`, entry.correct)
  }

  await tx.done
}

export async function clearHistory() {
  const db = await getDb()
  const tx = db.transaction(['history', 'stats'], 'readwrite')
  await tx.objectStore('history').clear()
  await tx.objectStore('stats').clear()
  await tx.done
}
