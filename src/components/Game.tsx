import { useCallback, useEffect, useRef, useState } from 'react'

import Button from './Button.tsx'
import Header from './Header.tsx'
import OrganismCard from './OrganismCard.tsx'
import ResultScreen from './ResultScreen.tsx'
import { getOrganismImage } from '../api/wikipedia.ts'
import {
  organisms as allOrganisms,
  pickThreeOrganisms,
} from '../data/organisms.ts'
import { surprisingScenarios } from '../data/surprisingFacts.ts'
import { recordRound, startPresence } from '../firebase.ts'
import { saveHistory, loadHistory } from '../utils/history.ts'
import type { HistoryEntry } from '../utils/history.ts'
import {
  findClosestPairFromData,
  findTaxId,
  loadSpeciesPool,
  loadTaxonomyData,
  pickThreeFromClade,
  pickThreeHardModeDistance,
  searchTaxonNames,
} from '../utils/taxonomy.ts'

import type { Organism } from '../data/organisms.ts'
import type { SurprisingScenario } from '../data/surprisingFacts.ts'
import type { SpeciesPoolEntry, TaxonomyData } from '../utils/taxonomy.ts'
import type { MrcaInfo } from '../utils/format.ts'

type GameState = 'customizing' | 'loading' | 'selecting' | 'result'
type GameMode = 'easy' | 'random' | 'custom'

interface RoundData {
  organisms: Organism[]
  images: (string | null)[]
}

interface ResultData {
  correct: boolean
  sister1: Organism
  sister2: Organism
  outgroup: Organism
  cladeLabel?: string
  sisterMrca?: MrcaInfo
  overallMrca?: MrcaInfo
  isPolytomy: boolean
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
      const [, commonName, scientificName] = entry
      return {
        commonName,
        scientificName,
        ncbiTaxId: taxId,
        wikiTitle: scientificName.replace(/ /g, '_'),
        group: 'shared',
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
  history.replaceState(null, '', url.toString())
}

function clearQuestionFromUrl() {
  const url = new URL(window.location.href)
  url.searchParams.delete('a')
  url.searchParams.delete('b')
  url.searchParams.delete('c')
  history.replaceState(null, '', url.toString())
}

function ShareButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      className="share-btn"
      onClick={() => {
        navigator.clipboard.writeText(url).then(() => {
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        })
      }}
    >
      {copied ? 'Copied!' : 'Share'}
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
  const [randomClade, setRandomClade] = useState<{
    taxId: number
    name: string
    rank: string
  } | null>(null)
  const [cladeFilter, setCladeFilter] = useState(
    () => new URLSearchParams(window.location.search).get('id') ?? '',
  )
  const [cladeError, setCladeError] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [seenCombos, setSeenCombos] = useState<Set<string>>(() => {
    const saved = sessionStorage.getItem('phyloSeenCombos')
    if (saved) {
      return new Set(JSON.parse(saved) as string[])
    }
    return new Set()
  })

  const shownScenarioIndicesRef = useRef(shownScenarioIndices)
  shownScenarioIndicesRef.current = shownScenarioIndices

  const seenCombosRef = useRef(seenCombos)
  seenCombosRef.current = seenCombos

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
    clearQuestionFromUrl()

    let data = taxonomyData
    if (!data) {
      setLoadingMessage('Downloading taxonomy data (~5 MB)...')
      data = await loadTaxonomyData()
      setTaxonomyData(data)
    }

    if (mode === 'easy') {
      setLoadingMessage('Loading organisms...')
      const shownIndices = shownScenarioIndicesRef.current
      const unshown = surprisingScenarios
        .map((s, i) => ({ s, i }))
        .filter(({ s, i }) => {
          if (
            shownIndices.has(i) ||
            seenCombosRef.current.has(comboKey(s.organisms))
          ) {
            return false
          }
          const taxIds: [number, number, number] = [
            s.organisms[0].ncbiTaxId,
            s.organisms[1].ncbiTaxId,
            s.organisms[2].ncbiTaxId,
          ]
          const pair = findClosestPairFromData(taxIds, data)
          return !pair.isPolytomy
        })
      let orgs
      if (unshown.length > 0) {
        const pick = unshown[Math.floor(Math.random() * unshown.length)]
        setCurrentScenario(pick.s)
        const next = new Set(shownIndices)
        next.add(pick.i)
        setShownScenarioIndices(next)
        sessionStorage.setItem('shownScenarios', JSON.stringify([...next]))
        orgs = [...pick.s.organisms]
      } else {
        setCurrentScenario(null)
        let picked = pickThreeOrganisms()
        for (let i = 0; i < 50; i++) {
          picked = pickThreeOrganisms()
          const taxIds: [number, number, number] = [
            picked[0].ncbiTaxId,
            picked[1].ncbiTaxId,
            picked[2].ncbiTaxId,
          ]
          const pair = findClosestPairFromData(taxIds, data)
          if (
            !pair.isPolytomy &&
            !seenCombosRef.current.has(comboKey(picked))
          ) {
            break
          }
        }
        orgs = picked
      }
      const shuffled = orgs.sort(() => Math.random() - 0.5)
      const images = await Promise.all(
        shuffled.map(o => getOrganismImage(o.wikiTitle, o.scientificName)),
      )
      recordCombo(shuffled)
      setRound({ organisms: shuffled, images })
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

      let cladeTaxId: number | undefined
      if (mode === 'custom' && cladeFilter.trim()) {
        cladeTaxId = findTaxId(cladeFilter.trim(), data)
        if (cladeTaxId === undefined) {
          setCladeError(`"${cladeFilter.trim()}" not found in taxonomy`)
          setState('customizing')
          return
        }
      }

      let finalOrgs: Organism[] = []
      let finalImages: (string | null)[] = []
      let finalClade: { taxId: number; name: string; rank: string } | undefined

      for (let attempt = 0; attempt < 20; attempt++) {
        let picks: SpeciesPoolEntry[]
        let attemptClade:
          | { taxId: number; name: string; rank: string }
          | undefined

        if (cladeTaxId !== undefined) {
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

        const taxIds: [number, number, number] = [
          orgs[0].ncbiTaxId,
          orgs[1].ncbiTaxId,
          orgs[2].ncbiTaxId,
        ]
        const pair = findClosestPairFromData(taxIds, data)
        if (pair.isPolytomy || seenCombosRef.current.has(comboKey(orgs))) {
          continue
        }

        finalOrgs = orgs
        finalImages = images
        finalClade = attemptClade

        if (images.every(img => img !== null)) {
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
      setRound({ organisms: finalOrgs, images: finalImages })
      updateUrlWithQuestion(finalOrgs)
      setState('selecting')
    }
  }, [mode, taxonomyData, speciesPool, cladeFilter])

  const loadSharedQuestion = useCallback(
    async (taxIds: [number, number, number]) => {
      setState('loading')
      setLoadingMessage('Loading shared question...')

      let data = taxonomyData
      if (!data) {
        setLoadingMessage('Downloading taxonomy data (~5 MB)...')
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

      const images = await Promise.all(
        orgs.map(o => getOrganismImage(o.wikiTitle, o.scientificName)),
      )
      recordCombo(orgs)
      setRound({ organisms: orgs, images })
      setState('selecting')
    },
    [taxonomyData, speciesPool, startRound],
  ) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    startPresence()
    const sharedIds = parseSharedQuestion()
    if (sharedIds) {
      loadSharedQuestion(sharedIds)
    } else if (mode !== 'custom' || hasQueryParams) {
      startRound()
    } else {
      loadTaxonomyData().then(data => setTaxonomyData(data))
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

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

  const handleSubmit = () => {
    if (!round || selected.length !== 2) {
      return
    }

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
      pair.isPolytomy ||
      (userPickedTaxIds.has(pair.sister1TaxId) &&
        userPickedTaxIds.has(pair.sister2TaxId))

    const organismNames = orgs.map(o => o.commonName)
    const sortedKey = [...organismNames].sort().join(',')
    const existingHistory = loadHistory()
    const alreadyPlayed = existingHistory.some(
      h => [...h.organisms].sort().join(',') === sortedKey,
    )

    if (!alreadyPlayed) {
      const entry: HistoryEntry = {
        correct,
        organisms: organismNames,
        sister: [sister1.commonName, sister2.commonName],
        mode,
        timestamp: Date.now(),
      }
      saveHistory([...existingHistory, entry])

      const leaderboardName = localStorage.getItem('phyloLeaderboardName')
      if (leaderboardName) {
        recordRound(leaderboardName, correct).catch(console.error)
      }
    }

    setResult({
      correct,
      sister1,
      sister2,
      outgroup,
      cladeLabel: sisterMrca.name,
      sisterMrca,
      overallMrca,
      isPolytomy: pair.isPolytomy,
    })
    setState('result')
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
                  findTaxId(cladeFilter.trim(), taxonomyData) === undefined)
              }
              href={(() => {
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
                const qs = params.toString()
                return `${import.meta.env.BASE_URL}custom${qs ? `?${qs}` : ''}`
              })()}
            >
              Play
            </Button>
            <Button variant="secondary" href={import.meta.env.BASE_URL}>
              Back
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
              <a
                href={`https://www.ncbi.nlm.nih.gov/datasets/taxonomy/${randomClade.taxId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {randomClade.name}
              </a>
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
                imageUrl={round.images[i]}
                selected={selected.includes(i)}
                disabled={false}
                onClick={() => toggleSelect(i)}
              />
            ))}
          </div>
          <div className="selecting-actions">
            <Button onClick={handleSubmit} disabled={selected.length !== 2}>
              Submit
            </Button>
            <Button variant="secondary" onClick={startRound}>
              Skip
            </Button>
          </div>
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
            round.organisms.map((o, i) => [o.ncbiTaxId, round.images[i]]),
          )}
          userSelectedTaxIds={
            new Set(selected.map(i => round.organisms[i].ncbiTaxId))
          }
          funFact={currentScenario?.funFact}
          shareUrl={buildShareUrl(round.organisms)}
          onPlayAgain={startRound}
        />
      )}
    </div>
  )
}
