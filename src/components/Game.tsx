import { useState, useCallback, useEffect } from 'react'
import type { Organism } from '../data/organisms.ts'
import { pickThreeOrganisms } from '../data/organisms.ts'
import { surprisingScenarios } from '../data/surprisingFacts.ts'
import type { SurprisingScenario } from '../data/surprisingFacts.ts'
import { getOrganismImage } from '../api/wikipedia.ts'
import {
  findClosestPairFromData,
  findTaxIdByName,
  loadTaxonomyData,
  loadSpeciesPool,
  pickThreeHardMode,
  pickThreeHardModeDistance,
  pickThreeFromClade,
} from '../utils/taxonomy.ts'
import type { TaxonomyData, SpeciesPoolEntry } from '../utils/taxonomy.ts'
import OrganismCard from './OrganismCard.tsx'
import ResultScreen from './ResultScreen.tsx'
import TreeIcon from './TreeIcon.tsx'
import FullTree from './FullTree.tsx'

type GameState = 'idle' | 'customizing' | 'loading' | 'selecting' | 'checking' | 'result'
type GameMode = 'easy' | 'hard' | 'custom'

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

export default function Game() {
  const [state, setState] = useState<GameState>('idle')
  const [mode, setMode] = useState<GameMode>('easy')
  const [round, setRound] = useState<RoundData | null>(null)
  const [selected, setSelected] = useState<number[]>([])
  const [result, setResult] = useState<ResultData | null>(null)
  const [streak, setStreak] = useState(0)
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [seenOrganisms, setSeenOrganisms] = useState(new Map<number, Organism>())
  const [showFullTree, setShowFullTree] = useState(false)
  const [taxonomyData, setTaxonomyData] = useState<TaxonomyData | null>(null)
  const [speciesPool, setSpeciesPool] = useState<SpeciesPoolEntry[] | null>(null)
  const [loadingMessage, setLoadingMessage] = useState('')
  const [currentScenario, setCurrentScenario] = useState<SurprisingScenario | null>(null)
  const [shownScenarioIndices, setShownScenarioIndices] = useState<Set<number>>(() => {
    const saved = sessionStorage.getItem('shownScenarios')
    if (saved) {
      return new Set(JSON.parse(saved) as number[])
    }
    return new Set()
  })
  const [distanceMode, setDistanceMode] = useState(false)
  const [cladeFilter, setCladeFilter] = useState('')
  const [cladeError, setCladeError] = useState('')
const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    if (saved !== null) return saved === 'true'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
    localStorage.setItem('darkMode', String(dark))
  }, [dark])

  const switchMode = (newMode: GameMode) => {
    setMode(newMode)
    setScore({ correct: 0, total: 0 })
    setStreak(0)
    setSeenOrganisms(new Map())
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
      const images = await Promise.all(shuffled.map(o => getOrganismImage(o.wikiTitle, o.scientificName)))
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
      if (mode === 'hard') {
        picks = pickThreeHardModeDistance(pool, data)
      } else if (cladeFilter.trim()) {
        const cladeTaxId = findTaxIdByName(cladeFilter.trim(), data)
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
      const orgs: Organism[] = picks.map(([taxId, commonName, scientificName]) => ({
        commonName,
        scientificName,
        ncbiTaxId: taxId,
        wikiTitle: scientificName.replace(/ /g, '_'),
        group: mode,
      }))

      const images = await Promise.all(orgs.map(o => getOrganismImage(o.wikiTitle, o.scientificName)))
      setRound({ organisms: orgs, images })
      setState('selecting')
    }
  }, [mode, taxonomyData, speciesPool, distanceMode, cladeFilter, shownScenarioIndices])

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
    const taxIds: [number, number, number] = [orgs[0].ncbiTaxId, orgs[1].ncbiTaxId, orgs[2].ncbiTaxId]

    const pair = findClosestPairFromData(taxIds, taxonomyData!)

    const sister1 = orgs.find(o => o.ncbiTaxId === pair.sister1TaxId)!
    const sister2 = orgs.find(o => o.ncbiTaxId === pair.sister2TaxId)!
    const outgroup = orgs.find(o => o.ncbiTaxId === pair.outgroupTaxId)!

    const sisterMrca: MrcaInfo = { taxId: pair.sisterLca.taxId, name: pair.sisterLca.name, rank: pair.sisterLca.rank }
    const overallMrca: MrcaInfo = { taxId: pair.overallLca.taxId, name: pair.overallLca.name, rank: pair.overallLca.rank }

    const selectedOrgs = selected.map(i => orgs[i])
    const userPickedTaxIds = new Set(selectedOrgs.map(o => o.ncbiTaxId))
    const correct = userPickedTaxIds.has(pair.sister1TaxId) && userPickedTaxIds.has(pair.sister2TaxId)

    setScore(s => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }))
    if (correct) {
      setStreak(s => s + 1)
    } else {
      setStreak(0)
    }

    setSeenOrganisms(prev => {
      const next = new Map(prev)
      for (const org of orgs) {
        next.set(org.ncbiTaxId, org)
      }
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
            <button className="home-btn" onClick={() => { setState('idle'); setResult(null); setRound(null) }}>
              PhyloGuesser
            </button>
          </h1>
        </div>
        <div className="header-right">
          {score.total > 0 && (
            <span className="score">
              {score.correct} {score.correct === 1 ? 'win' : 'wins'}, {score.total - score.correct} {score.total - score.correct === 1 ? 'loss' : 'losses'}
            </span>
          )}
          {streak > 1 && <span className="streak">{streak} streak</span>}
          {seenOrganisms.size >= 3 && (
            <button className="view-tree-btn" onClick={() => setShowFullTree(true)}>
              View Tree
            </button>
          )}
          <button className="dark-mode-btn" onClick={() => setDark(d => !d)} aria-label="Toggle dark mode">
            {dark ? (
              <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
                <circle cx="8" cy="8" r="3.5"/>
                <line x1="8" y1="0.5" x2="8" y2="2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="8" y1="13.5" x2="8" y2="15.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="0.5" y1="8" x2="2.5" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="13.5" y1="8" x2="15.5" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="2.4" y1="2.4" x2="3.8" y2="3.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="12.2" y1="12.2" x2="13.6" y2="13.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="2.4" y1="13.6" x2="3.8" y2="12.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="12.2" y1="3.8" x2="13.6" y2="2.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            ) : (
              <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
                <path d="M6 1a6 6 0 1 0 9 8 5 5 0 0 1-9-8z"/>
              </svg>
            )}
          </button>
        </div>
      </header>

      {state === 'idle' && (
        <div className="start-screen">
          <p>Which two organisms are most closely related?</p>
          <div className="mode-selector">
            <button
              className={`mode-btn ${mode === 'easy' ? 'active' : ''}`}
              onClick={() => switchMode('easy')}
            >
              Easy
            </button>
            <button
              className={`mode-btn ${mode === 'hard' ? 'active' : ''}`}
              onClick={() => switchMode('hard')}
            >
              Hard
            </button>
            <button
              className={`mode-btn ${mode === 'custom' ? 'active' : ''}`}
              onClick={() => switchMode('custom')}
            >
              Custom
            </button>
          </div>
          <p className="mode-description">
            {mode === 'easy'
              ? 'Curated organisms from diverse groups'
              : mode === 'hard'
                ? 'Random species from a random clade'
                : 'Configure your own species pool'}
          </p>
          <button className="start-btn" onClick={mode === 'custom' ? () => setState('customizing') : startRound}>
            Play
          </button>
        </div>
      )}

      {state === 'customizing' && (
        <div className="custom-screen">
          <h2>Custom Mode</h2>
          <label className="distance-toggle">
            <input
              type="checkbox"
              checked={distanceMode}
              onChange={e => setDistanceMode(e.target.checked)}
            />
            Same clade (random depth)
          </label>
          <div className="clade-filter">
            <p className="clade-filter-label">Restrict to a taxon:</p>
            <div className="clade-presets">
              {['Mammalia', 'Aves', 'Insecta', 'Actinopteri', 'Magnoliopsida', 'Fungi'].map(name => (
                <button
                  key={name}
                  className={`clade-preset-btn ${cladeFilter === name ? 'active' : ''}`}
                  onClick={() => { setCladeFilter(prev => prev === name ? '' : name); setCladeError('') }}
                >
                  {name}
                </button>
              ))}
            </div>
            <input
              type="text"
              className="clade-input"
              placeholder="Or enter a taxon name..."
              value={cladeFilter}
              onChange={e => { setCladeFilter(e.target.value); setCladeError('') }}
            />
            {cladeError && <p className="clade-error">{cladeError}</p>}
          </div>
          <p className="mode-description">
            {cladeFilter.trim()
              ? `Species from ${cladeFilter.trim()}${distanceMode ? ' (within a random sub-clade)' : ''}`
              : distanceMode
                ? 'Species from a random clade at a random depth'
                : 'Random species from the full NCBI taxonomy'}
          </p>
          <div className="custom-actions">
            <button className="start-btn" onClick={startRound}>Play</button>
            <button className="back-btn" onClick={() => setState('idle')}>Back</button>
          </div>
        </div>
      )}

      {state === 'loading' && (
        <div className="loading">{loadingMessage}</div>
      )}

      {state === 'selecting' && round && (
        <div className="selecting">
          <p className="prompt">Select the two organisms you think are most closely related:</p>
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

      {state === 'result' && result && taxonomyData && (
        <ResultScreen
          correct={result.correct}
          sister1={result.sister1}
          sister2={result.sister2}
          outgroup={result.outgroup}
          cladeLabel={result.cladeLabel}
          sisterMrca={result.sisterMrca}
          overallMrca={result.overallMrca}
          taxonomyData={taxonomyData}
          funFact={currentScenario?.funFact}
          sourceUrl={currentScenario?.sourceUrl}
          sourceLabel={currentScenario?.sourceLabel}
          onPlayAgain={startRound}
        />
      )}

      {showFullTree && (
        <FullTree
          organisms={[...seenOrganisms.values()]}
          taxonomyData={taxonomyData}
          onClose={() => setShowFullTree(false)}
        />
      )}
    </div>
  )
}
