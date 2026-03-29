import { useCallback, useEffect, useState } from 'react'

import Button from './Button.tsx'
import Timer from './Timer.tsx'
import Header from './Header.tsx'
import MultiResultScreen from './MultiResultScreen.tsx'
import OrganismCard from './OrganismCard.tsx'
import {
  buildShareUrl,
  comboKey,
  getDifficulty,
  parseSharedIds,
  resolveOrganism,
  toggleSelect,
} from './gameUtils.ts'
import { addHistoryEntry, loadHistory, loadStats } from '../utils/history.ts'
import {
  findTaxId,
  getAllPairLcas,
  lcaClosenessScore,
  loadSpeciesPool,
  loadTaxonomyData,
  pickNFromClade,
  pickNHardModeDistance,
} from '../utils/taxonomy.ts'

import type { MultiResultData } from './MultiResultScreen.tsx'
import type { Organism } from '../data/organisms.ts'
import type { HistoryEntry, HistoryStats } from '../utils/history.ts'
import type { SpeciesPoolEntry, TaxonomyData } from '../utils/taxonomy.ts'

type GameState = 'loading' | 'selecting' | 'result'

const SPECIES_COUNT = 6

export default function MultiGame() {
  const difficulty = getDifficulty()
  const cladeFilter =
    typeof window !== 'undefined'
      ? (new URLSearchParams(window.location.search).get('id') ?? '')
      : ''
  const [state, setState] = useState<GameState>('loading')
  const [organisms, setOrganisms] = useState<Organism[]>([])
  const [selected, setSelected] = useState<number[]>([])
  const [result, setResult] = useState<MultiResultData | null>(null)
  const [taxonomyData, setTaxonomyData] = useState<TaxonomyData | null>(null)
  const [speciesPool, setSpeciesPool] = useState<SpeciesPoolEntry[] | null>(
    null,
  )
  const [loadingMessage, setLoadingMessage] = useState('')
  const [timedOut, setTimedOut] = useState(false)
  const [stats, setStats] = useState<HistoryStats | null>(null)

  const refreshStats = () => {
    loadStats().then(s => setStats(s ?? null))
  }
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
    setTimedOut(false)

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

    const cladeTaxId = cladeFilter.trim()
      ? findTaxId(cladeFilter.trim(), data)
      : undefined

    let finalOrgs: Organism[] = []
    let finalClade: { taxId: number; name: string; rank: string } | undefined

    for (let attempt = 0; attempt < 20; attempt++) {
      let picks: SpeciesPoolEntry[]
      if (cladeTaxId !== undefined) {
        const result = pickNFromClade(SPECIES_COUNT, cladeTaxId, pool, data)
        if (!result) {
          break
        }
        picks = result
      } else {
        const hardResult = pickNHardModeDistance(
          SPECIES_COUNT,
          pool,
          data,
          'order',
        )
        picks = hardResult.picks
        finalClade = hardResult.clade
      }

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
      if (
        pairs.length >= 2 &&
        lcaClosenessScore(pairs[0].lca, data) >
          lcaClosenessScore(pairs[1].lca, data)
      ) {
        finalOrgs = orgs
        break
      }
    }

    if (finalOrgs.length === 0) {
      setLoadingMessage(
        "Couldn't find a valid set of species — please try again",
      )
      return
    }
    if (finalClade) {
      setRandomClade(finalClade)
    }
    recordCombo(finalOrgs)
    const shuffled = finalOrgs.sort(() => Math.random() - 0.5)
    setOrganisms(shuffled)
    history.pushState(null, '', buildShareUrl(shuffled))
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
    refreshStats()
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

  const handleSubmit = async (expired = false) => {
    if (!expired && (selected.length !== 2 || !taxonomyData || organisms.length === 0)) {
      return
    }
    if (!taxonomyData || organisms.length === 0) {
      return
    }

    if (expired) {
      setTimedOut(true)
    }

    const taxIds = organisms.map(o => o.ncbiTaxId)
    const allPairs = getAllPairLcas(taxIds, taxonomyData)
    const bestPair = allPairs[0]

    let userPair: typeof bestPair
    let rank: number
    let score: number

    if (expired || selected.length !== 2) {
      userPair = allPairs[allPairs.length - 1]
      rank = allPairs.length
      score = 0
    } else {
      const userTaxA = organisms[selected[0]].ncbiTaxId
      const userTaxB = organisms[selected[1]].ncbiTaxId
      userPair = allPairs.find(
        p =>
          (p.taxIdA === userTaxA && p.taxIdB === userTaxB) ||
          (p.taxIdA === userTaxB && p.taxIdB === userTaxA),
      )!

      const userScore = lcaClosenessScore(userPair.lca, taxonomyData)
      const betterCount = allPairs.filter(
        p => lcaClosenessScore(p.lca, taxonomyData) > userScore,
      ).length
      rank = betterCount + 1
      const totalPairs = allPairs.length
      const t = totalPairs <= 1 ? 1 : (totalPairs - rank) / (totalPairs - 1)
      score = Math.round(t * t * 100)
    }

    const totalPairs = allPairs.length

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
        score,
      }
      await addHistoryEntry(entry)
      refreshStats()

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
          {stats &&
            stats.multiTotalPlayed !== undefined &&
            stats.multiTotalPlayed > 0 && (
              <div className="game-stats">
                <span className="game-stats-item">
                  Avg score:{' '}
                  <strong>
                    {Math.round(
                      (stats.multiTotalScore ?? 0) / stats.multiTotalPlayed,
                    )}
                  </strong>
                </span>
                <span className="game-stats-item">
                  Total points: <strong>{stats.multiTotalScore ?? 0}</strong>
                </span>
              </div>
            )}
          <Timer key={organisms.map(o => o.ncbiTaxId).join(',')} onExpire={() => handleSubmit(true)} />
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
                onClick={() => setSelected(prev => toggleSelect(prev, i))}
                mapColor={undefined}
                difficulty={difficulty}
              />
            ))}
          </div>
          <div className="selecting-actions">
            <Button onClick={handleSubmit} disabled={selected.length !== 2}>
              Submit
            </Button>
            <button className="nav-icon-btn" onClick={startRound} title="Skip">
              <span className="nav-icon-btn-label">Skip</span> →
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
          timedOut={timedOut}
        />
      )}
    </div>
  )
}
