import { useCallback, useEffect, useState } from 'react'

import Button from './Button.tsx'
import Header from './Header.tsx'
import OrganismCard from './OrganismCard.tsx'
import ResultScreen, { TaxLink } from './ResultScreen.tsx'
import SpeciesMap, { MAP_COLORS } from './SpeciesMap.tsx'

import { organisms as allOrganisms } from '../data/organisms.ts'
import { surprisingScenarios } from '../data/surprisingFacts.ts'
import { recordRound, startPresence } from '../firebase.ts'
import { addHistoryEntry, loadHistory } from '../utils/history.ts'
import { sessionStorageGetItem } from '../utils/storage.ts'
import {
  findClosestPairFromData,
  findTaxId,
  loadEasyTaxonomyData,
  loadSpeciesPool,
  loadTaxonomyData,
  pickThreeFromClade,
  pickThreeHardModeDistance,
  pickThreeMicrobialCrossKingdom,
  searchTaxonNames,
} from '../utils/taxonomy.ts'

import type { Organism } from '../data/organisms.ts'
import type { MrcaInfo } from '../utils/format.ts'
import type { HistoryEntry } from '../utils/history.ts'
import type { SpeciesPoolEntry, TaxonomyData } from '../utils/taxonomy.ts'

type GameState =
  | 'customizing'
  | 'loading'
  | 'selecting'
  | 'result'
  | 'easyCompleted'
type GameMode = 'easy' | 'random' | 'custom'

interface RoundData {
  organisms: Organism[]
}

interface ResultData {
  correct: boolean
  sister1: Organism
  sister2: Organism
  outgroup: Organism
  cladeLabel: string
  sisterMrca: MrcaInfo
  overallMrca: MrcaInfo
  isPolytomy: boolean
  funFact?: string
  sourceUrl?: string
  sourceLabel?: string
}

function comboKey(orgs: { ncbiTaxId: number }[]) {
  return orgs
    .map(o => o.ncbiTaxId)
    .sort((a, b) => a - b)
    .join(',')
}


function parseSharedQuestion() {
  const params = new URLSearchParams(window.location.search)
  const a = params.get('a')
  const b = params.get('b')
  const c = params.get('c')
  if (!a || !b || !c) {
    return null
  }
  const ids = [Number(a), Number(b), Number(c)]
  if (ids.some(n => !Number.isFinite(n) || n <= 0)) {
    return null
  }
  return ids as [number, number, number]
}

function resolveOrganism(
  taxId: number,
  pool: SpeciesPoolEntry[] | null,
  data: TaxonomyData | null,
) {
  const known = allOrganisms.find(o => o.ncbiTaxId === taxId)
  if (known) {
    return known
  }
  if (pool) {
    const entry = pool.find(([id]) => id === taxId)
    if (entry) {
      const [, commonName, scientificName, imageUrl] = entry
      return {
        commonName,
        scientificName,
        ncbiTaxId: taxId,
        wikiTitle: scientificName.replace(/ /g, '_'),
        group: 'shared',
        imageUrl,
      } satisfies Organism
    }
  }
  if (data) {
    const name = data.names[String(taxId)]
    if (name) {
      return {
        commonName: name,
        scientificName: name,
        ncbiTaxId: taxId,
        wikiTitle: name.replace(/ /g, '_'),
        group: 'shared',
      } satisfies Organism
    }
  }
  return null
}

function buildShareUrl(orgs: Organism[]) {
  const url = new URL(window.location.href)
  url.search = ''
  url.searchParams.set('a', String(orgs[0].ncbiTaxId))
  url.searchParams.set('b', String(orgs[1].ncbiTaxId))
  url.searchParams.set('c', String(orgs[2].ncbiTaxId))
  return url.toString()
}

function updateUrlWithQuestion(orgs: Organism[]) {
  const url = new URL(window.location.href)
  url.search = ''
  url.searchParams.set('a', String(orgs[0].ncbiTaxId))
  url.searchParams.set('b', String(orgs[1].ncbiTaxId))
  url.searchParams.set('c', String(orgs[2].ncbiTaxId))
  history.pushState(null, '', url.toString())
}



function makeCorrectnessPredicate(orgs: Organism[], selectedIndices: number[]) {
  const userPickedTaxIds = new Set(
    selectedIndices
      .filter(i => i >= 0 && i < orgs.length)
      .map(i => orgs[i].ncbiTaxId),
  )
  return (pair: ReturnType<typeof findClosestPairFromData>) =>
    pair.isPolytomy ||
    (userPickedTaxIds.has(pair.sister1TaxId) &&
      userPickedTaxIds.has(pair.sister2TaxId))
}

function computeResult(
  orgs: Organism[],
  data: TaxonomyData,
  correct:
    | boolean
    | ((pair: ReturnType<typeof findClosestPairFromData>) => boolean),
) {
  const taxIds: [number, number, number] = [
    orgs[0].ncbiTaxId,
    orgs[1].ncbiTaxId,
    orgs[2].ncbiTaxId,
  ]
  const pair = findClosestPairFromData(taxIds, data)
  const byTaxId = new Map(orgs.map(o => [o.ncbiTaxId, o]))
  const sister1 = byTaxId.get(pair.sister1TaxId) ?? orgs[0]
  const sister2 = byTaxId.get(pair.sister2TaxId) ?? orgs[1]
  const outgroup = byTaxId.get(pair.outgroupTaxId) ?? orgs[2]
  return {
    correct: typeof correct === 'function' ? correct(pair) : correct,
    sister1,
    sister2,
    outgroup,
    cladeLabel: pair.sisterLca.name,
    sisterMrca: {
      taxId: pair.sisterLca.taxId,
      name: pair.sisterLca.name,
      rank: pair.sisterLca.rank,
    },
    overallMrca: {
      taxId: pair.overallLca.taxId,
      name: pair.overallLca.name,
      rank: pair.overallLca.rank,
    },
    isPolytomy: pair.isPolytomy,
    pair,
  }
}

function ShareButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      className="share-icon-btn"
      title={copied ? 'Copied!' : 'Share link'}
      onClick={() => {
        navigator.clipboard.writeText(url).then(() => {
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        })
      }}
    >
      {copied ? '✓' : '🔗'}
    </button>
  )
}

export { ShareButton }

export default function Game({ mode }: { mode: GameMode }) {
  const hasQueryParams =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).has('id')
  const [state, setState] = useState<GameState>(() => {
    if (mode === 'custom' && !hasQueryParams) {
      return 'customizing'
    }
    return 'loading'
  })
  const [round, setRound] = useState<RoundData | null>(null)
  const [selected, setSelected] = useState<number[]>([])
  const [result, setResult] = useState<ResultData | null>(null)
  const [taxonomyData, setTaxonomyData] = useState<TaxonomyData | null>(null)
  const [speciesPool, setSpeciesPool] = useState<SpeciesPoolEntry[] | null>(
    null,
  )
  const [loadingMessage, setLoadingMessage] = useState('')
  const [shownScenarioIndices, setShownScenarioIndices] = useState<Set<number>>(
    () => {
      const saved = sessionStorageGetItem('shownScenarios')
      if (saved) {
        return new Set(JSON.parse(saved) as number[])
      }
      return new Set()
    },
  )
  const [randomClade, setRandomClade] = useState<{
    taxId: number
    name: string
    rank: string
  } | null>(null)
  const [cladeFilter, setCladeFilter] = useState(() =>
    typeof window !== 'undefined'
      ? (new URLSearchParams(window.location.search).get('id') ?? '')
      : '',
  )
  const [cladeError, setCladeError] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [showMapHint, setShowMapHint] = useState(false)
  const [seenCombos, setSeenCombos] = useState<Set<string>>(() => {
    const saved = sessionStorageGetItem('phyloSeenCombos')
    if (saved) {
      return new Set(JSON.parse(saved) as string[])
    }
    return new Set()
  })

  const recordCombo = (orgs: { ncbiTaxId: number }[]) => {
    const key = comboKey(orgs)
    setSeenCombos(prev => {
      const next = new Set(prev)
      next.add(key)
      sessionStorage.setItem('phyloSeenCombos', JSON.stringify([...next]))
      return next
    })
  }

  const startRound = useCallback(async () => {
    setState('loading')
    setSelected([])
    setResult(null)
    setShowMapHint(false)

    let data = taxonomyData
    if (!data) {
      if (mode === 'easy') {
        setLoadingMessage('Downloading taxonomy data...')
        data = await loadEasyTaxonomyData()
      } else {
        setLoadingMessage('Downloading taxonomy data...')
        data = await loadTaxonomyData()
      }
      setTaxonomyData(data)
    }

    if (mode === 'easy') {
      setLoadingMessage('Loading organisms...')
      const unshown = surprisingScenarios
        .map((s, i) => ({ s, i }))
        .filter(({ s, i }) => {
          if (
            shownScenarioIndices.has(i) ||
            seenCombos.has(comboKey(s.organisms))
          ) {
            return false
          }
          const taxIds: [number, number, number] = [
            s.organisms[0].ncbiTaxId,
            s.organisms[1].ncbiTaxId,
            s.organisms[2].ncbiTaxId,
          ]
          if (s.correctPair) {
            return true
          }
          const pair = findClosestPairFromData(taxIds, data)
          return !pair.isPolytomy
        })
      let orgs
      if (unshown.length > 0) {
        const pick = unshown[Math.floor(Math.random() * unshown.length)]
        const next = new Set(shownScenarioIndices)
        next.add(pick.i)
        setShownScenarioIndices(next)
        sessionStorage.setItem('shownScenarios', JSON.stringify([...next]))
        orgs = [...pick.s.organisms]
      } else {
        setState('easyCompleted')
        return
      }
      const shuffled = orgs.sort(() => Math.random() - 0.5)
      recordCombo(shuffled)
      setRound({ organisms: shuffled })
      updateUrlWithQuestion(shuffled)
      setState('selecting')
    } else {
      let pool = speciesPool

      if (!pool) {
        setLoadingMessage('Downloading species pool...')
        pool = await loadSpeciesPool()
        setSpeciesPool(pool)
      }

      setLoadingMessage('Picking species...')
      setCladeError('')
      setRandomClade(null)

      const isMicroMode =
        mode === 'custom' && cladeFilter.trim() === 'micro'
      let cladeTaxId: number | undefined
      if (mode === 'custom' && cladeFilter.trim() && !isMicroMode) {
        cladeTaxId = findTaxId(cladeFilter.trim(), data)
        if (cladeTaxId === undefined) {
          setCladeError(`"${cladeFilter.trim()}" not found in taxonomy`)
          setState('customizing')
          return
        }
      }

      let finalOrgs: Organism[] = []
      let finalClade: { taxId: number; name: string; rank: string } | undefined

      for (let attempt = 0; attempt < 20; attempt++) {
        let picks: SpeciesPoolEntry[]
        let attemptClade:
          | { taxId: number; name: string; rank: string }
          | undefined

        if (isMicroMode) {
          const result = pickThreeMicrobialCrossKingdom(pool, data)
          if (!result) {
            setCladeError('Not enough microorganisms in the pool')
            setState('customizing')
            return
          }
          picks = result
          attemptClade = { taxId: 0, name: 'Microorganisms', rank: '' }
        } else if (cladeTaxId !== undefined) {
          const result = pickThreeFromClade(cladeTaxId, pool, data)
          if (!result) {
            setCladeError(
              `Not enough species found in "${cladeFilter.trim()}" — try a broader group`,
            )
            setState('customizing')
            return
          }
          picks = result
          const name = data.names[String(cladeTaxId)] ?? cladeFilter.trim()
          const rank = data.ranks[String(cladeTaxId)] ?? ''
          attemptClade = { taxId: cladeTaxId, name, rank }
        } else {
          const result = pickThreeHardModeDistance(pool, data)
          picks = result.picks
          attemptClade = result.clade
        }

        const orgs: Organism[] = picks.map(
          ([taxId, commonName, scientificName, imageUrl]) => ({
            commonName,
            scientificName,
            ncbiTaxId: taxId,
            wikiTitle: scientificName.replace(/ /g, '_'),
            group: mode,
            imageUrl,
          }),
        )

        const taxIds: [number, number, number] = [
          orgs[0].ncbiTaxId,
          orgs[1].ncbiTaxId,
          orgs[2].ncbiTaxId,
        ]
        const pair = findClosestPairFromData(taxIds, data)
        if (pair.isPolytomy || seenCombos.has(comboKey(orgs))) {
          continue
        }

        finalOrgs = orgs
        finalClade = attemptClade
        break
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
      setRound({ organisms: finalOrgs })
      updateUrlWithQuestion(finalOrgs)
      setState('selecting')
    }
  }, [
    mode,
    taxonomyData,
    speciesPool,
    cladeFilter,
    shownScenarioIndices,
    seenCombos,
  ])

  const loadSharedQuestion = useCallback(
    async (taxIds: [number, number, number]) => {
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
      setRound({ organisms: orgs })
      setState('selecting')
    },
    [taxonomyData, speciesPool, startRound],
  )

  useEffect(() => {
    startPresence()
    const sharedIds = parseSharedQuestion()
    if (sharedIds) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadSharedQuestion(sharedIds)
    } else if (mode !== 'custom' || hasQueryParams) {
      startRound()
    } else {
      loadTaxonomyData().then(data => setTaxonomyData(data))
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const handler = () => {
      const sharedIds = parseSharedQuestion()
      if (sharedIds) {
        const orgs: Organism[] = []
        for (const id of sharedIds) {
          const org = resolveOrganism(id, speciesPool, taxonomyData)
          if (org) {
            orgs.push(org)
          }
        }
        if (orgs.length === 3) {
          setRound({ organisms: orgs })
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
    if (!round || selected.length !== 2 || !taxonomyData) {
      return
    }

    const orgs = round.organisms
    const scenario = surprisingScenarios.find(s => comboKey(s.organisms) === comboKey(orgs))

    let correctnessFn: boolean | ((pair: ReturnType<typeof findClosestPairFromData>) => boolean)
    if (scenario?.correctPair) {
      const userPicked = new Set(selected.map(i => orgs[i].commonName))
      correctnessFn = scenario.correctPair.every(name =>
        userPicked.has(name),
      )
    } else {
      correctnessFn = makeCorrectnessPredicate(orgs, selected)
    }
    const fullResult = computeResult(orgs, taxonomyData, correctnessFn)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { pair, ...resultData } = fullResult

    if (scenario) {
      resultData.funFact = scenario.funFact
      resultData.sourceUrl = scenario.sourceUrl
      resultData.sourceLabel = scenario.sourceLabel
      if (scenario.correctPair) {
        const cp = scenario.correctPair
        const sister1 = orgs.find(o => o.commonName === cp[0]) ?? orgs[0]
        const sister2 = orgs.find(o => o.commonName === cp[1]) ?? orgs[1]
        const outgroup =
          orgs.find(o => o.commonName !== cp[0] && o.commonName !== cp[1]) ??
          orgs[2]
        resultData.sister1 = sister1
        resultData.sister2 = sister2
        resultData.outgroup = outgroup
        resultData.isPolytomy = false
      }
    }

    const organismNames = orgs.map(o => o.commonName)
    const sortedKey = [...organismNames].sort().join(',')
    const existingHistory = await loadHistory()
    const alreadyPlayed = existingHistory.some(
      h => [...h.organisms].sort().join(',') === sortedKey,
    )

    if (!alreadyPlayed) {
      const entry: HistoryEntry = {
        correct: resultData.correct,
        organisms: organismNames,
        sister: [resultData.sister1.commonName, resultData.sister2.commonName],
        mode,
        timestamp: Date.now(),
        ncbiTaxIds: orgs.map(o => o.ncbiTaxId),
      }
      await addHistoryEntry(entry)

      const leaderboardName = localStorage.getItem('phyloLeaderboardName')
      if (leaderboardName) {
        recordRound(leaderboardName, resultData.correct).catch(console.error)
      }
    }

    setResult(resultData)
    setState('result')
    setSelected(selected)
    history.pushState({ result: true }, '')
  }

  return (
    <div className="game">
      <Header />

      {state === 'customizing' && (
        <div className="custom-screen">
          <h2>Custom Mode</h2>
          <div className="custom-form">
            <fieldset className="custom-fieldset">
              <legend>Taxon quiz</legend>
              <ul className="clade-presets-list">
                {(
                  [
                    ['40674', 'mammals', 'Mammalia'],
                    ['8782', 'birds', 'Aves'],
                    ['8504', 'lizards & snakes', 'Lepidosauria'],
                    ['8292', 'frogs & salamanders', 'Amphibia'],
                    ['50557', 'insects', 'Insecta'],
                    ['6854', 'spiders & scorpions', 'Arachnida'],
                    ['7898', 'ray-finned fish', 'Actinopterygii'],
                    ['7777', 'sharks & rays', 'Chondrichthyes'],
                    ['32523', 'bony vertebrates', 'Tetrapoda'],
                    ['6656', 'crustaceans', 'Arthropoda'],
                    ['6447', 'snails & octopuses', 'Mollusca'],
                    ['3398', 'flowering plants', 'Magnoliopsida'],
                    ['58019', 'conifers', 'Pinopsida'],
                    ['4751', 'mushrooms & yeasts', 'Fungi'],
                    ['7742', 'vertebrates', 'Vertebrata'],
                    ['33208', 'animals', 'Metazoa'],
                    ['9443', 'primates', 'Primates'],
                    ['33554', 'songbirds', 'Passeriformes'],
                    ['7088', 'butterflies & moths', 'Lepidoptera'],
                    ['4890', 'yeasts & sac fungi', 'Ascomycota'],
                    ['micro', 'microorganisms', 'cross-kingdom'],
                  ] as const
                ).map(([id, label, name]) => (
                  <li
                    key={id}
                    className={`clade-preset-item ${cladeFilter === id ? 'active' : ''}`}
                    onClick={() => {
                      setCladeFilter(prev => (prev === id ? '' : id))
                      setCladeError('')
                      setShowSuggestions(false)
                    }}
                  >
                    {label}{' '}
                    <span className="clade-preset-scientific">({name})</span>
                  </li>
                ))}
                <li className="clade-preset-item clade-custom-item">
                  or, enter custom taxon name/id:{' '}
                  <div className="clade-autocomplete-inline">
                    <input
                      type="text"
                      className="clade-input-inline"
                      placeholder="taxon name or ID..."
                      value={cladeFilter}
                      onChange={e => {
                        setCladeFilter(e.target.value)
                        setCladeError('')
                      }}
                      onBlur={() => {
                        setTimeout(() => setShowSuggestions(false), 150)
                      }}
                      onFocus={() => setShowSuggestions(true)}
                    />
                    {showSuggestions &&
                      taxonomyData &&
                      (() => {
                        const suggestions = searchTaxonNames(
                          cladeFilter,
                          taxonomyData,
                        )
                        if (suggestions.length === 0) {
                          return null
                        }
                        return (
                          <ul className="clade-suggestions">
                            {suggestions.map(s => (
                              <li key={s.id}>
                                <button
                                  onMouseDown={e => e.preventDefault()}
                                  onClick={() => {
                                    setCladeFilter(s.name)
                                    setCladeError('')
                                    setShowSuggestions(false)
                                  }}
                                >
                                  <span className="suggestion-name">
                                    {s.name}
                                  </span>
                                  {s.rank && (
                                    <span className="suggestion-rank">
                                      {s.rank}
                                    </span>
                                  )}
                                </button>
                              </li>
                            ))}
                          </ul>
                        )
                      })()}
                  </div>
                </li>
              </ul>
              {cladeError && <p className="clade-error">{cladeError}</p>}
              {taxonomyData &&
                cladeFilter.trim().length >= 2 &&
                (() => {
                  const trimmed = cladeFilter.trim()
                  if (trimmed === 'micro') {
                    return (
                      <p className="clade-resolved">
                        <span className="clade-check">✓</span> Microorganisms
                        (cross-kingdom)
                      </p>
                    )
                  }
                  const isNumeric = /^\d+$/.test(trimmed)
                  if (isNumeric) {
                    const name = taxonomyData.names[trimmed]
                    const hasParent =
                      taxonomyData.parents[trimmed] !== undefined
                    if (name || hasParent) {
                      const rank = taxonomyData.ranks[trimmed]
                      return (
                        <p className="clade-resolved">
                          <span className="clade-check">✓</span>{' '}
                          {name ?? `Taxon ${trimmed}`}
                          {rank ? ` (${rank})` : ''}
                        </p>
                      )
                    }
                    return (
                      <p className="clade-error">
                        <span className="clade-x">✕</span> No taxon found for ID{' '}
                        {trimmed}
                      </p>
                    )
                  }
                  const match = findTaxId(trimmed, taxonomyData)
                  if (match !== undefined) {
                    const name = taxonomyData.names[String(match)]
                    const rank = taxonomyData.ranks[String(match)]
                    return (
                      <p className="clade-resolved">
                        <span className="clade-check">✓</span> {name ?? trimmed}
                        {rank ? ` (${rank})` : ''}
                      </p>
                    )
                  }
                  return (
                    <p className="clade-error">
                      <span className="clade-x">✕</span> No taxon found for "
                      {trimmed}"
                    </p>
                  )
                })()}
            </fieldset>
          </div>
          <div className="custom-actions">
            <Button
              disabled={
                !cladeFilter.trim() ||
                (!!taxonomyData &&
                  cladeFilter.trim() !== 'micro' &&
                  findTaxId(cladeFilter.trim(), taxonomyData) === undefined)
              }
              href={(() => {
                const params = new URLSearchParams()
                const trimmed = cladeFilter.trim()
                if (trimmed) {
                  if (trimmed === 'micro') {
                    params.set('id', 'micro')
                  } else if (/^\d+$/.test(trimmed)) {
                    params.set('id', trimmed)
                  } else if (taxonomyData) {
                    const taxId = findTaxId(trimmed, taxonomyData)
                    if (taxId !== undefined) {
                      params.set('id', String(taxId))
                    }
                  }
                }
                const qs = params.toString()
                return `${import.meta.env.BASE_URL}custom${qs ? `?${qs}` : ''}`
              })()}
            >
              Play
            </Button>
            <Button variant="secondary" href={import.meta.env.BASE_URL}>
              ⏮ Back
            </Button>
          </div>
        </div>
      )}

      {state === 'easyCompleted' && (
        <div className="easy-completed">
          <p>
            You&apos;ve completed all {surprisingScenarios.length} curated
            scenarios!
          </p>
          <div className="selecting-actions">
            <Button
              onClick={() => {
                setShownScenarioIndices(new Set())
                sessionStorage.removeItem('shownScenarios')
                setSeenCombos(new Set())
                startRound()
              }}
            >
              Restart Easy Mode
            </Button>
            <Button variant="secondary" href={import.meta.env.BASE_URL}>
              ⏮ Back
            </Button>
          </div>
        </div>
      )}

      {state === 'loading' && (
        <div className="loading">
          {loadingMessage}
          {loadingMessage.includes('try again') && (
            <Button onClick={startRound}>Retry</Button>
          )}
        </div>
      )}

      {state === 'selecting' && round && (
        <div className="selecting">
          {mode === 'easy' && (
            <p className="easy-disclaimer">
              Easy mode. Just kidding — these are actually curated tricky and
              surprising examples!
            </p>
          )}
          {randomClade && (
            <p className="clade-label">
              Group:{' '}
              <TaxLink name={randomClade.name} taxId={randomClade.taxId} />
              {randomClade.rank ? ` (${randomClade.rank})` : ''}
            </p>
          )}
          <p className="selecting-prompt">
            Choose the two organisms you think are most closely related
          </p>
          <div className="cards">
            {round.organisms.map((org, i) => (
              <OrganismCard
                key={org.ncbiTaxId}
                commonName={org.commonName}
                scientificName={org.scientificName}
                imageUrl={org.imageUrl ?? null}
                selected={selected.includes(i)}
                disabled={false}
                onClick={() => toggleSelect(i)}
                mapColor={MAP_COLORS[i % MAP_COLORS.length]}
              />
            ))}
          </div>
          <div className="selecting-actions">
            <button className="nav-icon-btn" onClick={() => history.back()} title="Previous question">
              ⏮
            </button>
            <Button onClick={handleSubmit} disabled={selected.length !== 2}>
              Submit
            </Button>
            <button className="nav-icon-btn" onClick={startRound} title="Skip">
              ⏭
            </button>
          </div>
          <button
            className="map-hint-link"
            onClick={() => setShowMapHint(prev => !prev)}
          >
            {showMapHint ? 'Hide species distribution map' : 'Show species distribution map (GBIF)'}
          </button>
          {showMapHint && round && <SpeciesMap organisms={round.organisms} />}
        </div>
      )}

      {state === 'result' && result && taxonomyData && round && (
        <ResultScreen
          correct={result.correct}
          sister1={result.sister1}
          sister2={result.sister2}
          outgroup={result.outgroup}
          cladeLabel={result.cladeLabel}
          sisterMrca={result.sisterMrca}
          overallMrca={result.overallMrca}
          isPolytomy={result.isPolytomy}
          taxonomyData={taxonomyData}
          images={Object.fromEntries(
            round.organisms.map(o => [o.ncbiTaxId, o.imageUrl ?? null]),
          )}
          userSelectedTaxIds={
            new Set(selected.map(i => round.organisms[i].ncbiTaxId))
          }
          organismColors={Object.fromEntries(
            round.organisms.map((o, i) => [
              o.ncbiTaxId,
              MAP_COLORS[i % MAP_COLORS.length],
            ]),
          )}
          funFact={result.funFact}
          sourceUrl={result.sourceUrl}
          sourceLabel={result.sourceLabel}
          shareUrl={buildShareUrl(round.organisms)}
          onPlayAgain={startRound}
        />
      )}
    </div>
  )
}
