import { useCallback, useEffect, useState } from 'react'

import Button from './Button.tsx'
import Header from './Header.tsx'
import MultiResultScreen from './MultiResultScreen.tsx'
import type { MultiResultData } from './MultiResultScreen.tsx'
import OrganismCard from './OrganismCard.tsx'

import { organisms as allOrganisms } from '../data/organisms.ts'
import { recordMultiRound, startPresence } from '../firebase.ts'
import { addHistoryEntry, loadHistory } from '../utils/history.ts'
import {
  getAllPairLcas,
  loadSpeciesPool,
  loadTaxonomyData,
  pickNHardModeDistance,
  resolveOrganism as resolveOrganismUtil,
} from '../utils/taxonomy.ts'

import type { Organism } from '../data/organisms.ts'
import type { HistoryEntry } from '../utils/history.ts'
import type { SpeciesPoolEntry, TaxonomyData } from '../utils/taxonomy.ts'

const SPECIES_COUNT = 6

function parseSharedIds() {
  const params = new URLSearchParams(window.location.search)
  const raw = params.get('ids')
  if (!raw) {
    return null
  }
  const ids = raw.split(',').map(Number)
  if (ids.length < 3 || ids.some(n => !Number.isFinite(n) || n <= 0)) {
    return null
  }
  return ids
}

function updateUrlWithIds(orgs: Organism[]) {
  const url = new URL(window.location.href)
  url.search = ''
  url.searchParams.set('ids', orgs.map(o => o.ncbiTaxId).join(','))
  history.pushState(null, '', url.toString())
}

function buildShareUrl(orgs: Organism[]) {
  const url = new URL(window.location.href)
  url.search = ''
  url.searchParams.set('ids', orgs.map(o => o.ncbiTaxId).join(','))
  return url.toString()
}

function resolveOrganism(
  taxId: number,
  pool: SpeciesPoolEntry[] | null,
  data: TaxonomyData | null,
) {
  return resolveOrganismUtil(taxId, allOrganisms, pool, data)
}

type GameState = 'loading' | 'selecting' | 'result'

function comboKey(orgs: { ncbiTaxId: number }[]) {
  return orgs
    .map(o => o.ncbiTaxId)
    .sort((a, b) => a - b)
    .join(',')
}

export default function MultiGame() {
  const [state, setState] = useState<GameState>('loading')
  const [organisms, setOrganisms] = useState<Organism[]>([])
  const [selected, setSelected] = useState<number[]>([])
  const [result, setResult] = useState<MultiResultData | null>(null)
  const [taxonomyData, setTaxonomyData] = useState<TaxonomyData | null>(null)
  const [speciesPool, setSpeciesPool] = useState<SpeciesPoolEntry[] | null>(null)
  const [loadingMessage, setLoadingMessage] = useState('')
  const [randomClade, setRandomClade] = useState<{
    taxId: number
    name: string
    rank: string
  } | null>(null)
  const [seenCombos, setSeenCombos] = useState<Set<string>>(() => {
    try {
      const saved = sessionStorage.getItem('phyloMultiSeenCombos')
      if (saved) {
        return new Set(JSON.parse(saved) as string[])
      }
    } catch {
      // ignore
    }
    return new Set()
  })

  const recordCombo = (orgs: { ncbiTaxId: number }[]) => {
    const key = comboKey(orgs)
    setSeenCombos(prev => {
      const next = new Set(prev)
      next.add(key)
      sessionStorage.setItem('phyloMultiSeenCombos', JSON.stringify([...next]))
      return next
    })
  }

  const startRound = useCallback(async () => {
    setState('loading')
    setSelected([])
    setResult(null)

    let data = taxonomyData
    if (!data) {
      setLoadingMessage('Downloading taxonomy data...')
      data = await loadTaxonomyData()
      setTaxonomyData(data)
    }

    let pool = speciesPool
    if (!pool) {
      setLoadingMessage('Downloading species pool...')
      pool = await loadSpeciesPool()
      setSpeciesPool(pool)
    }

    setLoadingMessage('Picking species...')
    setRandomClade(null)

    let finalOrgs: Organism[] = []
    let finalClade: { taxId: number; name: string; rank: string } | undefined

    for (let attempt = 0; attempt < 20; attempt++) {
      const hardResult = pickNHardModeDistance(SPECIES_COUNT, pool, data, 'order')
      const picks = hardResult.picks

      const orgs: Organism[] = picks.map(
        ([taxId, commonName, scientificName, imageUrl]) => ({
          commonName,
          scientificName,
          ncbiTaxId: taxId,
          wikiTitle: scientificName.replace(/ /g, '_'),
          group: 'multi',
          imageUrl,
        }),
      )

      if (seenCombos.has(comboKey(orgs))) {
        continue
      }

      const taxIds = orgs.map(o => o.ncbiTaxId)
      const pairs = getAllPairLcas(taxIds, data)
      if (pairs.length >= 2 && pairs[0].lca.depth > pairs[1].lca.depth) {
        finalOrgs = orgs
        finalClade = hardResult.clade
        break
      }
    }

    if (finalOrgs.length === 0) {
      setLoadingMessage("Couldn't find a valid set of species — please try again")
      return
    }
    if (finalClade) {
      setRandomClade(finalClade)
    }
    recordCombo(finalOrgs)
    const shuffled = finalOrgs.sort(() => Math.random() - 0.5)
    setOrganisms(shuffled)
    updateUrlWithIds(shuffled)
    setState('selecting')
  }, [taxonomyData, speciesPool, seenCombos])

  const loadSharedQuestion = useCallback(
    async (taxIds: number[]) => {
      setState('loading')
      setLoadingMessage('Loading shared question...')

      let data = taxonomyData
      if (!data) {
        setLoadingMessage('Downloading taxonomy data...')
        data = await loadTaxonomyData()
        setTaxonomyData(data)
      }

      let pool = speciesPool
      if (!pool) {
        setLoadingMessage('Downloading species pool...')
        pool = await loadSpeciesPool()
        setSpeciesPool(pool)
      }

      const orgs: Organism[] = []
      for (const id of taxIds) {
        const org = resolveOrganism(id, pool, data)
        if (!org) {
          setLoadingMessage('Could not find one of the shared species.')
          startRound()
          return
        }
        orgs.push(org)
      }

      recordCombo(orgs)
      setOrganisms(orgs)
      setState('selecting')
    },
    [taxonomyData, speciesPool, startRound],
  )

  useEffect(() => {
    startPresence()
    const sharedIds = parseSharedIds()
    if (sharedIds) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadSharedQuestion(sharedIds)
    } else {
      startRound()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const handler = () => {
      const sharedIds = parseSharedIds()
      if (sharedIds) {
        const orgs: Organism[] = []
        for (const id of sharedIds) {
          const org = resolveOrganism(id, speciesPool, taxonomyData)
          if (org) {
            orgs.push(org)
          }
        }
        if (orgs.length === sharedIds.length) {
          setOrganisms(orgs)
          setResult(null)
          setSelected([])
          setState('selecting')
        }
      }
    }
    window.addEventListener('popstate', handler)
    return () => window.removeEventListener('popstate', handler)
  }, [taxonomyData, speciesPool])

  const toggleSelect = (idx: number) => {
    setSelected(prev => {
      if (prev.includes(idx)) {
        return prev.filter(i => i !== idx)
      }
      if (prev.length < 2) {
        return [...prev, idx]
      }
      return [prev[1], idx]
    })
  }

  const handleSubmit = async () => {
    if (selected.length !== 2 || !taxonomyData || organisms.length === 0) {
      return
    }

    const taxIds = organisms.map(o => o.ncbiTaxId)
    const allPairs = getAllPairLcas(taxIds, taxonomyData)

    const userTaxA = organisms[selected[0]].ncbiTaxId
    const userTaxB = organisms[selected[1]].ncbiTaxId
    const userPair = allPairs.find(
      p =>
        (p.taxIdA === userTaxA && p.taxIdB === userTaxB) ||
        (p.taxIdA === userTaxB && p.taxIdB === userTaxA),
    )!

    const bestPair = allPairs[0]
    const userDepth = userPair.lca.depth
    const betterCount = allPairs.filter(p => p.lca.depth > userDepth).length
    const rank = betterCount + 1
    const totalPairs = allPairs.length
    const score = totalPairs <= 1 ? 100 : Math.round(((totalPairs - rank) / (totalPairs - 1)) * 100)

    const resultData: MultiResultData = {
      score,
      rank,
      totalPairs,
      userPair,
      bestPair,
      allPairs,
      organisms,
    }

    const organismNames = organisms.map(o => o.commonName)
    const sortedKey = [...organismNames].sort().join(',')
    const existingHistory = await loadHistory()
    const alreadyPlayed = existingHistory.some(
      h => [...h.organisms].sort().join(',') === sortedKey,
    )

    if (!alreadyPlayed) {
      const entry: HistoryEntry = {
        correct: rank === 1,
        organisms: organismNames,
        sister: [
          organisms.find(o => o.ncbiTaxId === bestPair.taxIdA)!.commonName,
          organisms.find(o => o.ncbiTaxId === bestPair.taxIdB)!.commonName,
        ],
        mode: 'multi',
        timestamp: Date.now(),
        ncbiTaxIds: taxIds,
      }
      await addHistoryEntry(entry)

      const leaderboardName = localStorage.getItem('phyloLeaderboardName')
      if (leaderboardName) {
        recordMultiRound(leaderboardName, score).catch(console.error)
      }
    }

    setResult(resultData)
    setState('result')
  }

  return (
    <div className="game">
      <Header />

      {state === 'loading' && (
        <div className="loading">
          {loadingMessage}
          {loadingMessage.includes('try again') && (
            <Button onClick={startRound}>Retry</Button>
          )}
        </div>
      )}

      {state === 'selecting' && organisms.length > 0 && (
        <div className="selecting">
          {randomClade && (
            <p className="clade-label">
              Group: {randomClade.name}
              {randomClade.rank ? ` (${randomClade.rank})` : ''}
            </p>
          )}
          <p className="selecting-prompt">
            Pick the two species you think are most closely related
          </p>
          <div className="cards multi-cards">
            {organisms.map((org, i) => (
              <OrganismCard
                key={org.ncbiTaxId}
                commonName={org.commonName}
                scientificName={org.scientificName}
                imageUrl={org.imageUrl ?? null}
                selected={selected.includes(i)}
                disabled={false}
                onClick={() => toggleSelect(i)}
                mapColor={undefined}
              />
            ))}
          </div>
          <div className="selecting-actions">
            <Button onClick={handleSubmit} disabled={selected.length !== 2}>
              Submit
            </Button>
            <button className="nav-icon-btn" onClick={startRound} title="Skip">
              ⏭
            </button>
          </div>
        </div>
      )}

      {state === 'result' && result && taxonomyData && (
        <MultiResultScreen
          result={result}
          taxonomyData={taxonomyData}
          shareUrl={buildShareUrl(result.organisms)}
          onPlayAgain={startRound}
        />
      )}
    </div>
  )
}
