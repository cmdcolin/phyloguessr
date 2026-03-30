import { useCallback, useEffect, useState } from 'react'

import Button from './Button.tsx'
import Timer from './Timer.tsx'
import GameOverScreen from './GameOverScreen.tsx'
import Header from './Header.tsx'
import MultiResultScreen from './MultiResultScreen.tsx'
import OrganismCard from './OrganismCard.tsx'
import {
  buildRetryUrl,
  buildShareUrl,
  buildTimedOutUrl,
  comboKey,
  getDifficulty,
  parseSharedIds,
  resolveOrganism,
  toggleSelect,
} from './gameUtils.ts'
import { sessionStorageGetItem } from '../utils/storage.ts'
import { fetchWikipediaAbstract } from '../utils/wikipedia.ts'
import { TOTAL_QUESTIONS } from '../utils/scoring.ts'
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
import type { RoundResult } from './GameOverScreen.tsx'
import type { Organism } from '../data/organisms.ts'
import type { SpeciesPoolEntry, TaxonomyData } from '../utils/taxonomy.ts'

type GameState = 'loading' | 'selecting' | 'timedOut' | 'result' | 'gameOver'

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
  const [hints, setHints] = useState<Record<number, string | null>>({})
  const [hintLoading, setHintLoading] = useState(false)
  const [hintUsed, setHintUsed] = useState(false)
  const [hintsVisible, setHintsVisible] = useState(false)
  const [showHintPenalty, setShowHintPenalty] = useState(false)
  const [questionNumber, setQuestionNumber] = useState(1)
  const [totalScore, setTotalScore] = useState(0)
  const [roundResults, setRoundResults] = useState<RoundResult[]>([])

  const [randomClade, setRandomClade] = useState<{
    taxId: number
    name: string
    rank: string
  } | null>(null)
  const [seenCombos, setSeenCombos] = useState<Set<string>>(() => {
    const saved = sessionStorageGetItem('phyloMultiSeenCombos')
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
      sessionStorage.setItem('phyloMultiSeenCombos', JSON.stringify([...next]))
      return next
    })
  }

  const startRound = useCallback(async () => {
    setState('loading')
    setSelected([])
    setResult(null)
    setHints({})
    setHintLoading(false)
    setHintUsed(false)
    setHintsVisible(false)
    setShowHintPenalty(false)

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
    async (taxIds: number[], targetState: 'selecting' | 'timedOut' = 'selecting') => {
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
      setState(targetState)
    },
    [taxonomyData, speciesPool, startRound],
  )

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const isTimedOut = params.get('timedout') === '1'
    const sharedIds = parseSharedIds()

    if (isTimedOut && sharedIds) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadSharedQuestion(sharedIds, 'timedOut')
    } else if (sharedIds) {
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

  const handleHint = useCallback(async () => {
    if (hintUsed) {
      setHintsVisible(prev => !prev)
      return
    }
    setHintUsed(true)
    setHintsVisible(true)
    setShowHintPenalty(true)
    setTimeout(() => setShowHintPenalty(false), 1500)
    setHintLoading(true)
    const results = await Promise.all(
      organisms.map(org =>
        fetchWikipediaAbstract(
          org.wikiTitle ?? org.scientificName.replace(/ /g, '_'),
        ),
      ),
    )
    const newHints: Record<number, string | null> = {}
    for (let i = 0; i < results.length; i++) {
      newHints[i] = results[i] ?? 'Hint unavailable'
    }
    setHints(newHints)
    setHintLoading(false)
  }, [organisms, hintUsed])

  const handleSubmit = async () => {
    if (!taxonomyData || organisms.length === 0) {
      return
    }
    if (selected.length !== 2) {
      return
    }

    const taxIds = organisms.map(o => o.ncbiTaxId)
    const allPairs = getAllPairLcas(taxIds, taxonomyData)
    const bestPair = allPairs[0]

    const userTaxA = organisms[selected[0]].ncbiTaxId
    const userTaxB = organisms[selected[1]].ncbiTaxId
    const userPair = allPairs.find(
      p =>
        (p.taxIdA === userTaxA && p.taxIdB === userTaxB) ||
        (p.taxIdA === userTaxB && p.taxIdB === userTaxA),
    )!

    const userScore = lcaClosenessScore(userPair.lca, taxonomyData)
    const betterCount = allPairs.filter(
      p => lcaClosenessScore(p.lca, taxonomyData) > userScore,
    ).length
    const rank = betterCount + 1
    const t = allPairs.length <= 1 ? 1 : (allPairs.length - rank) / (allPairs.length - 1)
    const score = Math.round(t * t * 100 * (hintUsed ? 0.5 : 1))

    const resultData: MultiResultData = {
      score,
      rank,
      totalPairs: allPairs.length,
      userPair,
      bestPair,
      allPairs,
      organisms,
    }

    const organismNames = organisms.map(o => o.commonName)
    setTotalScore(prev => prev + score)
    setRoundResults(prev => [
      ...prev,
      { correct: rank === 1, score, organisms: organismNames },
    ])
    setResult(resultData)
    setState('result')
  }

  const isLastQuestion = questionNumber >= TOTAL_QUESTIONS

  const handleNextQuestion = useCallback(() => {
    if (isLastQuestion) {
      setState('gameOver')
    } else {
      setQuestionNumber(prev => prev + 1)
      startRound()
    }
  }, [isLastQuestion, startRound])

  const handlePlayAgain = useCallback(() => {
    setQuestionNumber(1)
    setTotalScore(0)
    setRoundResults([])
    startRound()
  }, [startRound])

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
          <div className="game-progress">
            <span className="game-progress-question">
              Question {questionNumber}/{TOTAL_QUESTIONS}
            </span>
            <span className="game-progress-score">
              Score: <strong>{totalScore}</strong>
            </span>
          </div>
          {randomClade && (
            <p className="clade-label">
              Group: {randomClade.name}
              {randomClade.rank ? ` (${randomClade.rank})` : ''}
            </p>
          )}
          <Timer
            key={questionNumber}
            duration={60000}
            onExpire={() => {
              history.pushState(null, '', buildTimedOutUrl())
              setState('timedOut')
            }}
          />
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
                onClick={() => setSelected(prev => toggleSelect(prev, i))}
                difficulty={difficulty}
                hint={hintsVisible ? (hintLoading ? 'Loading...' : (hints[i] ?? null)) : undefined}
              />
            ))}
          </div>
          <div className="selecting-actions">
            <div className="hint-btn-wrap">
              <button
                className="hint-btn"
                onClick={handleHint}
                title={hintUsed ? 'Toggle hints' : 'Show hints for all organisms (-50% pts)'}
                style={{ opacity: hintUsed && !hintsVisible ? 0.4 : 1 }}
              >
                💡
              </button>
              {showHintPenalty && (
                <span className="hint-penalty-toast">−50% pts</span>
              )}
            </div>
            <Button onClick={() => handleSubmit()} disabled={selected.length !== 2}>
              Submit
            </Button>
            <button className="nav-icon-btn" onClick={startRound} title="Skip">
              <span className="nav-icon-btn-label">Skip</span> →
            </button>
          </div>
        </div>
      )}

      {state === 'timedOut' && (
        <div className="timed-out">
          <div className="result-banner wrong">Time's up!</div>
          <div className="selecting-actions">
            <a className="btn btn-primary" href={buildRetryUrl()}>
              Try Again
            </a>
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
          onPlayAgain={handleNextQuestion}
          questionLabel={`Question ${questionNumber}/${TOTAL_QUESTIONS} · Score: ${totalScore}`}
        />
      )}
      {state === 'gameOver' && (
        <GameOverScreen
          totalScore={totalScore}
          roundResults={roundResults}
          onPlayAgain={handlePlayAgain}
        />
      )}
    </div>
  )
}
