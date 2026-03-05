import { useCallback, useEffect, useRef, useState } from 'react'

import OrganismCard from './OrganismCard.tsx'
import ResultScreen from './ResultScreen.tsx'
import TreeIcon from './TreeIcon.tsx'
import { getOrganismImage } from '../api/wikipedia.ts'
import { pickThreeOrganisms } from '../data/organisms.ts'
import { surprisingScenarios } from '../data/surprisingFacts.ts'
import {
  findClosestPairFromData,
  findTaxId,
  loadSpeciesPool,
  loadTaxonomyData,
  pickThreeFromClade,
  pickThreeHardMode,
  pickThreeHardModeDistance,
  searchTaxonNames,
} from '../utils/taxonomy.ts'

import type { Organism } from '../data/organisms.ts'
import type { SurprisingScenario } from '../data/surprisingFacts.ts'
import type { SpeciesPoolEntry, TaxonomyData } from '../utils/taxonomy.ts'

type GameState =
  | 'idle'
  | 'customizing'
  | 'loading'
  | 'selecting'
  | 'checking'
  | 'result'
type GameMode = 'easy' | 'random' | 'custom'

interface RoundData {
  organisms: Organism[]
  images: (string | null)[]
}

interface MrcaInfo {
  taxId: number
  name: string
  rank: string
}

interface ResultData {
  correct: boolean
  sister1: Organism
  sister2: Organism
  outgroup: Organism
  cladeLabel?: string
  sisterMrca?: MrcaInfo
  overallMrca?: MrcaInfo
}

interface HistoryEntry {
  correct: boolean
  organisms: string[]
  sister: string[]
  mode: GameMode
  timestamp: number
}

function loadHistory(): HistoryEntry[] {
  const saved = localStorage.getItem('phyloHistory')
  if (saved) {
    return JSON.parse(saved) as HistoryEntry[]
  }
  return []
}

interface ParsedHash {
  state: GameState
  mode: GameMode
  cladeFilter: string
  distanceMode: boolean
}

function parseHash(): ParsedHash {
  const full = window.location.hash.replace(/^#\/?/, '')
  const [path, query] = full.split('?')
  const params = new URLSearchParams(query ?? '')

  if (path === 'customize') {
    return {
      state: 'customizing',
      mode: 'custom',
      cladeFilter: params.get('id') ?? '',
      distanceMode: params.get('clade') === 'true',
    }
  }
  if (path === 'taxon') {
    return {
      state: 'idle',
      mode: 'custom',
      cladeFilter: params.get('id') ?? '',
      distanceMode: params.get('clade') === 'true',
    }
  }
  if (path === 'easy') {
    return { state: 'idle', mode: 'easy', cladeFilter: '', distanceMode: false }
  }
  if (path === 'random') {
    return {
      state: 'idle',
      mode: 'random',
      cladeFilter: '',
      distanceMode: false,
    }
  }
  return { state: 'idle', mode: 'easy', cladeFilter: '', distanceMode: false }
}

function buildCustomParams(
  cladeFilter: string,
  distanceMode: boolean,
  taxonomyData: TaxonomyData | null,
) {
  const params = new URLSearchParams()
  const trimmed = cladeFilter.trim()
  if (trimmed) {
    if (/^\d+$/.test(trimmed)) {
      params.set('id', trimmed)
    } else if (taxonomyData) {
      const taxId = findTaxId(trimmed, taxonomyData)
      if (taxId !== undefined) {
        params.set('id', String(taxId))
      }
    }
  }
  if (distanceMode) {
    params.set('clade', 'true')
  }
  return params
}

function hashForState(
  s: GameState,
  mode: GameMode,
  cladeFilter: string,
  distanceMode: boolean,
  taxonomyData: TaxonomyData | null,
) {
  switch (s) {
    case 'idle':
      return '#/'
    case 'customizing': {
      const qs = buildCustomParams(
        cladeFilter,
        distanceMode,
        taxonomyData,
      ).toString()
      return `#/customize${qs ? `?${qs}` : ''}`
    }
    case 'selecting':
    case 'loading':
    case 'checking':
    case 'result': {
      if (mode === 'custom') {
        const qs = buildCustomParams(
          cladeFilter,
          distanceMode,
          taxonomyData,
        ).toString()
        return `#/taxon${qs ? `?${qs}` : ''}`
      }
      return mode === 'random' ? '#/random' : '#/easy'
    }
  }
}

export default function Game() {
  const [initialHash] = useState(parseHash)
  const [state, setState] = useState<GameState>(initialHash.state)
  const [mode, setMode] = useState<GameMode>(initialHash.mode)
  const [round, setRound] = useState<RoundData | null>(null)
  const [selected, setSelected] = useState<number[]>([])
  const [result, setResult] = useState<ResultData | null>(null)
  const [history, setHistory] = useState<HistoryEntry[]>(loadHistory)
  const [showHistory, setShowHistory] = useState(false)

  const [taxonomyData, setTaxonomyData] = useState<TaxonomyData | null>(null)
  const [speciesPool, setSpeciesPool] = useState<SpeciesPoolEntry[] | null>(
    null,
  )
  const [loadingMessage, setLoadingMessage] = useState('')
  const [currentScenario, setCurrentScenario] =
    useState<SurprisingScenario | null>(null)
  const [shownScenarioIndices, setShownScenarioIndices] = useState<Set<number>>(
    () => {
      const saved = sessionStorage.getItem('shownScenarios')
      if (saved) {
        return new Set(JSON.parse(saved) as number[])
      }
      return new Set()
    },
  )
  const [distanceMode, setDistanceMode] = useState(initialHash.distanceMode)
  const [cladeFilter, setCladeFilter] = useState(initialHash.cladeFilter)
  const [cladeError, setCladeError] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const isPopstateRef = useRef(false)
  const roundRef = useRef(round)
  roundRef.current = round

  useEffect(() => {
    const onPopState = () => {
      isPopstateRef.current = true
      const parsed = parseHash()
      setMode(parsed.mode)
      setCladeFilter(parsed.cladeFilter)
      setDistanceMode(parsed.distanceMode)
      if (parsed.state === 'selecting' && !roundRef.current) {
        setState('idle')
      } else {
        setState(parsed.state)
      }
      isPopstateRef.current = false
    }
    window.addEventListener('popstate', onPopState)
    window.history.replaceState(
      null,
      '',
      hashForState(state, mode, cladeFilter, distanceMode, taxonomyData),
    )
    return () => window.removeEventListener('popstate', onPopState)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isPopstateRef.current) {
      return
    }
    const navigableStates: GameState[] = [
      'idle',
      'customizing',
      'selecting',
      'result',
    ]
    if (navigableStates.includes(state)) {
      const hash = hashForState(
        state,
        mode,
        cladeFilter,
        distanceMode,
        taxonomyData,
      )
      if (window.location.hash !== hash) {
        window.history.pushState(null, '', hash)
      }
    }
  }, [state, mode]) // eslint-disable-line react-hooks/exhaustive-deps

  // Update URL in place when custom params change (without creating history entries)
  useEffect(() => {
    if (state === 'customizing' || (mode === 'custom' && state !== 'idle')) {
      const hash = hashForState(
        state,
        mode,
        cladeFilter,
        distanceMode,
        taxonomyData,
      )
      window.history.replaceState(null, '', hash)
    }
  }, [cladeFilter, distanceMode, taxonomyData]) // eslint-disable-line react-hooks/exhaustive-deps

  const switchMode = (newMode: GameMode) => {
    setMode(newMode)
    setState('idle')
    setRound(null)
    setResult(null)
    setCurrentScenario(null)
  }

  const startRound = useCallback(async () => {
    setState('loading')
    setSelected([])
    setResult(null)

    let data = taxonomyData
    if (!data) {
      setLoadingMessage('Downloading taxonomy data (~5 MB)...')
      data = await loadTaxonomyData()
      setTaxonomyData(data)
    }

    if (mode === 'easy') {
      setLoadingMessage('Loading organisms...')
      const unshown = surprisingScenarios
        .map((s, i) => ({ s, i }))
        .filter(({ i }) => !shownScenarioIndices.has(i))
      let orgs
      if (unshown.length > 0) {
        const pick = unshown[Math.floor(Math.random() * unshown.length)]
        setCurrentScenario(pick.s)
        const next = new Set(shownScenarioIndices)
        next.add(pick.i)
        setShownScenarioIndices(next)
        sessionStorage.setItem('shownScenarios', JSON.stringify([...next]))
        orgs = [...pick.s.organisms]
      } else {
        setCurrentScenario(null)
        orgs = pickThreeOrganisms()
      }
      const shuffled = orgs.sort(() => Math.random() - 0.5)
      const images = await Promise.all(
        shuffled.map(o => getOrganismImage(o.wikiTitle, o.scientificName)),
      )
      setRound({ organisms: shuffled, images })
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
      let picks
      if (mode === 'random') {
        picks = pickThreeHardModeDistance(pool, data)
      } else if (cladeFilter.trim()) {
        const cladeTaxId = findTaxId(cladeFilter.trim(), data)
        if (cladeTaxId === undefined) {
          setCladeError(`"${cladeFilter.trim()}" not found in taxonomy`)
          setState('customizing')
          return
        }
        picks = pickThreeFromClade(cladeTaxId, pool, data)
      } else if (distanceMode) {
        picks = pickThreeHardModeDistance(pool, data)
      } else {
        picks = pickThreeHardMode(pool, data)
      }
      const orgs: Organism[] = picks.map(
        ([taxId, commonName, scientificName]) => ({
          commonName,
          scientificName,
          ncbiTaxId: taxId,
          wikiTitle: scientificName.replace(/ /g, '_'),
          group: mode,
        }),
      )

      const images = await Promise.all(
        orgs.map(o => getOrganismImage(o.wikiTitle, o.scientificName)),
      )
      setRound({ organisms: orgs, images })
      setState('selecting')
    }
  }, [
    mode,
    taxonomyData,
    speciesPool,
    distanceMode,
    cladeFilter,
    shownScenarioIndices,
  ])

  const toggleSelect = (idx: number) => {
    setSelected(prev => {
      if (prev.includes(idx)) {
        return prev.filter(i => i !== idx)
      }
      if (prev.length < 2) {
        return [...prev, idx]
      }
      return prev
    })
  }

  const handleSubmit = async () => {
    if (!round || selected.length !== 2) {
      return
    }
    setState('checking')

    const orgs = round.organisms
    const taxIds: [number, number, number] = [
      orgs[0].ncbiTaxId,
      orgs[1].ncbiTaxId,
      orgs[2].ncbiTaxId,
    ]

    const pair = findClosestPairFromData(taxIds, taxonomyData!)

    const sister1 = orgs.find(o => o.ncbiTaxId === pair.sister1TaxId)!
    const sister2 = orgs.find(o => o.ncbiTaxId === pair.sister2TaxId)!
    const outgroup = orgs.find(o => o.ncbiTaxId === pair.outgroupTaxId)!

    const sisterMrca: MrcaInfo = {
      taxId: pair.sisterLca.taxId,
      name: pair.sisterLca.name,
      rank: pair.sisterLca.rank,
    }
    const overallMrca: MrcaInfo = {
      taxId: pair.overallLca.taxId,
      name: pair.overallLca.name,
      rank: pair.overallLca.rank,
    }

    const selectedOrgs = selected.map(i => orgs[i])
    const userPickedTaxIds = new Set(selectedOrgs.map(o => o.ncbiTaxId))
    const correct =
      userPickedTaxIds.has(pair.sister1TaxId) &&
      userPickedTaxIds.has(pair.sister2TaxId)

    const entry: HistoryEntry = {
      correct,
      organisms: orgs.map(o => o.commonName),
      sister: [sister1.commonName, sister2.commonName],
      mode,
      timestamp: Date.now(),
    }
    setHistory(prev => {
      const next = [...prev, entry]
      localStorage.setItem('phyloHistory', JSON.stringify(next))
      return next
    })

    setResult({
      correct,
      sister1,
      sister2,
      outgroup,
      cladeLabel: sisterMrca.name,
      sisterMrca,
      overallMrca,
    })
    setState('result')
  }

  return (
    <div className="game">
      <header className="game-header">
        <div className="header-left">
          <TreeIcon size={26} />
          <h1>
            <button
              className="home-btn"
              onClick={() => {
                setState('idle')
                setResult(null)
                setRound(null)
              }}
            >
              PhyloGuesser
            </button>
          </h1>
        </div>
        <div className="header-animals" aria-hidden="true">
          <img
            className="header-animal animal-platypus"
            src="https://images.phylopic.org/images/61932f57-1fd2-49d9-bb86-042d6005581a/thumbnail/128x128.png"
            alt=""
          />
          <img
            className="header-animal animal-aardvark"
            src="https://images.phylopic.org/images/cfee2dca-3767-46b8-8d03-bd8f46e79e9e/thumbnail/128x128.png"
            alt=""
          />
          <img
            className="header-animal animal-octopus"
            src="https://images.phylopic.org/images/f400b519-3564-4183-b4bd-c3b922cc7c5e/thumbnail/128x128.png"
            alt=""
          />
          <img
            className="header-animal animal-hippo"
            src="https://images.phylopic.org/images/3769e205-b10c-4aab-affc-b4f0302f4eaa/thumbnail/128x128.png"
            alt=""
          />
          <img
            className="header-animal animal-axolotl"
            src="https://images.phylopic.org/images/575eaa51-6c9b-4d36-9881-b8463c68ebbc/thumbnail/128x128.png"
            alt=""
          />
          <img
            className="header-animal animal-horseshoecrab"
            src="https://images.phylopic.org/images/38c82deb-b187-4e85-a9f8-dba2794b42d0/thumbnail/128x128.png"
            alt=""
          />
        </div>
        <div className="header-right">
          {history.length > 0 &&
            (() => {
              const wins = history.filter(h => h.correct).length
              const losses = history.length - wins
              let streak = 0
              for (let i = history.length - 1; i >= 0; i--) {
                if (history[i].correct) {
                  streak++
                } else {
                  break
                }
              }
              return (
                <>
                  <button
                    className="score-btn"
                    onClick={() => setShowHistory(s => !s)}
                  >
                    {wins} {wins === 1 ? 'win' : 'wins'}, {losses}{' '}
                    {losses === 1 ? 'loss' : 'losses'}
                  </button>
                  {streak > 1 && (
                    <span className="streak">{streak} streak</span>
                  )}
                </>
              )
            })()}
        </div>
      </header>

      {showHistory && (
        <div className="history-panel">
          <div className="history-header">
            <h3>Game History</h3>
            <div className="history-actions">
              <button
                className="reset-btn"
                onClick={() => {
                  setHistory([])
                  localStorage.removeItem('phyloHistory')
                }}
              >
                Reset
              </button>
              <button
                className="close-btn"
                onClick={() => setShowHistory(false)}
              >
                Close
              </button>
            </div>
          </div>
          {history.length === 0 && (
            <p className="history-empty">No games played yet.</p>
          )}
          <ul className="history-list">
            {[...history].reverse().map((h, i) => (
              <li
                key={history.length - 1 - i}
                className={h.correct ? 'history-win' : 'history-loss'}
              >
                <span className="history-result">{h.correct ? 'W' : 'L'}</span>
                <span className="history-organisms">
                  {h.organisms.join(', ')}
                </span>
                <span className="history-sister">
                  Answer: {h.sister.join(' + ')}
                </span>
                <span className="history-mode">{h.mode}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {state === 'idle' && (
        <div className="start-screen">
          <h3 className="wordart-subtitle">
            The game where you try to guess which two organisms are most closely
            related
          </h3>
          <div className="mode-selector">
            <button
              className={`mode-btn mode-btn-easy ${mode === 'easy' ? 'active' : ''}`}
              onClick={() => {
                switchMode('easy')
                startRound()
              }}
            >
              Easy 🍿
            </button>
            <button
              className={`mode-btn mode-btn-random ${mode === 'random' ? 'active' : ''}`}
              onClick={() => {
                switchMode('random')
                startRound()
              }}
            >
              Random 🎰
            </button>
            <button
              className={`mode-btn mode-btn-custom ${mode === 'custom' ? 'active' : ''}`}
              onClick={async () => {
                switchMode('random')
                setState('customizing')
                if (!taxonomyData) {
                  const data = await loadTaxonomyData()
                  setTaxonomyData(data)
                }
              }}
            >
              Custom 📠
            </button>
          </div>
        </div>
      )}

      {state === 'customizing' && (
        <div className="custom-screen">
          <h2>Custom Mode</h2>
          <div className="custom-form">
            <fieldset className="custom-fieldset">
              <legend>Taxon filter</legend>
              <div className="clade-presets">
                {(
                  [
                    ['Mammalia', 'mammals'],
                    ['Aves', 'birds'],
                    ['Reptilia', 'reptiles'],
                    ['Amphibia', 'frogs & salamanders'],
                    ['Insecta', 'insects'],
                    ['Arachnida', 'spiders & scorpions'],
                    ['Actinopteri', 'ray-finned fish'],
                    ['Chondrichthyes', 'sharks & rays'],
                    ['Magnoliopsida', 'flowering plants'],
                    ['Pinopsida', 'conifers'],
                    ['Fungi', 'mushrooms & yeasts'],
                    ['Mollusca', 'snails & octopuses'],
                  ] as const
                ).map(([name, label]) => (
                  <button
                    key={name}
                    className={`clade-preset-btn ${cladeFilter === name ? 'active' : ''}`}
                    onClick={() => {
                      setCladeFilter(prev => (prev === name ? '' : name))
                      setCladeError('')
                      setShowSuggestions(false)
                    }}
                  >
                    {name} ({label})
                  </button>
                ))}
              </div>
              <div className="clade-divider">
                <span>or</span>
              </div>
              <div className="clade-autocomplete">
                <input
                  type="text"
                  className="clade-input"
                  placeholder="Search for a taxon name or ID..."
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
                              <span className="suggestion-name">{s.name}</span>
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
              {cladeError && <p className="clade-error">{cladeError}</p>}
              {taxonomyData &&
                cladeFilter.trim().length >= 2 &&
                (() => {
                  const trimmed = cladeFilter.trim()
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
            <fieldset className="custom-fieldset">
              <legend>Options</legend>
              <label className="distance-toggle">
                <input
                  type="checkbox"
                  checked={distanceMode}
                  onChange={e => setDistanceMode(e.target.checked)}
                />
                Hard mode — all 3 species from the same random clade
              </label>
              <p className="option-hint">
                Makes it trickier by picking closely related species
              </p>
            </fieldset>
          </div>
          <div className="custom-actions">
            <button className="start-btn" onClick={startRound}>
              Play
            </button>
            <button className="back-btn" onClick={() => setState('idle')}>
              Back
            </button>
          </div>
        </div>
      )}

      {state === 'loading' && <div className="loading">{loadingMessage}</div>}

      {state === 'selecting' && round && (
        <div className="selecting">
          <p className="prompt">
            Select the two organisms you think are most closely related:
          </p>
          <div className="cards">
            {round.organisms.map((org, i) => (
              <OrganismCard
                key={org.ncbiTaxId}
                commonName={org.commonName}
                scientificName={org.scientificName}
                imageUrl={round.images[i]}
                selected={selected.includes(i)}
                disabled={selected.length >= 2 && !selected.includes(i)}
                onClick={() => toggleSelect(i)}
              />
            ))}
          </div>
          {selected.length === 2 && (
            <button className="submit-btn" onClick={handleSubmit}>
              Submit
            </button>
          )}
        </div>
      )}

      {state === 'checking' && (
        <div className="loading">Checking the tree of life...</div>
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
          taxonomyData={taxonomyData}
          images={Object.fromEntries(
            round.organisms.map((o, i) => [o.ncbiTaxId, round.images[i]]),
          )}
          funFact={currentScenario?.funFact}
          sourceUrl={currentScenario?.sourceUrl}
          sourceLabel={currentScenario?.sourceLabel}
          onPlayAgain={startRound}
        />
      )}
    </div>
  )
}
