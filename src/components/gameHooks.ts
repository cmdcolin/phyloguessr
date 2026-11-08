import { useCallback, useState } from 'react'

import { sessionStorageGetItem } from '../utils/storage.ts'
import { fetchWikipediaAbstract } from '../utils/wikipedia.ts'
import { comboKey } from './gameUtils.ts'

import type { Organism } from '../data/organisms.ts'

export function useSeenCombos(storageKey: string) {
  const [seenCombos, setSeenCombos] = useState<Set<string>>(() => {
    const saved: unknown = JSON.parse(sessionStorageGetItem(storageKey) ?? '[]')
    return new Set(
      Array.isArray(saved)
        ? saved.filter((key): key is string => typeof key === 'string')
        : [],
    )
  })

  const recordCombo = useCallback(
    (orgs: { ncbiTaxId: number }[]) => {
      const key = comboKey(orgs)
      setSeenCombos(prev => {
        const next = new Set(prev)
        next.add(key)
        sessionStorage.setItem(storageKey, JSON.stringify([...next]))
        return next
      })
    },
    [storageKey],
  )

  const clearSeenCombos = useCallback(() => setSeenCombos(new Set()), [])

  return { seenCombos, recordCombo, clearSeenCombos }
}

export function useHints() {
  const [hints, setHints] = useState<(string | null)[]>([])
  const [hintLoading, setHintLoading] = useState(false)
  const [hintUsed, setHintUsed] = useState(false)
  const [showHintPenalty, setShowHintPenalty] = useState(false)

  const resetHints = useCallback(() => {
    setHints([])
    setHintLoading(false)
    setHintUsed(false)
    setShowHintPenalty(false)
  }, [])

  const loadHints = useCallback(async (orgs: Organism[]) => {
    setHintUsed(true)
    setShowHintPenalty(true)
    setTimeout(() => setShowHintPenalty(false), 1500)
    setHintLoading(true)
    const results = await Promise.all(
      orgs.map(org => fetchWikipediaAbstract(org.wikiTitle)),
    )
    setHints(results.map(r => r ?? 'Hint unavailable'))
    setHintLoading(false)
  }, [])

  return {
    hints,
    hintLoading,
    hintUsed,
    showHintPenalty,
    resetHints,
    loadHints,
  }
}
