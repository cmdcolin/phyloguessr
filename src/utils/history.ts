export interface HistoryEntry {
  correct: boolean
  organisms: string[]
  sister: string[]
  mode: string
  timestamp: number
}

const MAX_HISTORY = 500

export function loadHistory() {
  const saved = localStorage.getItem('phyloHistory')
  if (saved) {
    return JSON.parse(saved) as HistoryEntry[]
  }
  return []
}

export function saveHistory(history: HistoryEntry[]) {
  const capped =
    history.length > MAX_HISTORY
      ? history.slice(history.length - MAX_HISTORY)
      : history
  localStorage.setItem('phyloHistory', JSON.stringify(capped))
  return capped
}

export function getCurrentStreak(history: HistoryEntry[]) {
  let streak = 0
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i].correct) {
      streak++
    } else {
      break
    }
  }
  return streak
}
