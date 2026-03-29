import { useCallback, useEffect, useState } from 'react'

import AdvancedTaxonSearch from './AdvancedTaxonSearch.tsx'
import Timer from './Timer.tsx'
import Button from './Button.tsx'
import GameOverScreen from './GameOverScreen.tsx'
import Header from './Header.tsx'
import { MapToggle } from './MapToggle.tsx'
import OrganismCard from './OrganismCard.tsx'
import ResultScreen from './ResultScreen.tsx'
import { MAP_COLORS } from './SpeciesMap.tsx'
import { TaxLink } from './TaxLink.tsx'
import {
  buildShareUrl,
  comboKey,
  getDifficulty,
  parseSharedIds,
  resolveOrganism,
  toggleSelect,
  updateUrlWithQuestion,
} from './gameUtils.ts'
import { loadSurprisingScenarios } from '../data/surprisingFacts.ts'
import { DISPLAY_TREE } from '../utils/cladePresets.ts'
import { calculateScore, TOTAL_QUESTIONS } from '../utils/scoring.ts'
import { sessionStorageGetItem } from '../utils/storage.ts'
import {
  buildContextDiagram,
  findClosestPairFromData,
  findTaxId,
  loadEasyTaxonomyData,
  loadSpeciesPool,
  loadTaxonomyData,
  pickThreeFromClade,
  pickThreeHardModeDistance,
  pickThreeMicrobialCrossKingdom,
} from '../utils/taxonomy.ts'
import { fetchWikipediaAbstract } from '../utils/wikipedia.ts'

import type { RoundResult } from './GameOverScreen.tsx'
import type { Organism } from '../data/organisms.ts'
import type { SurprisingScenario } from '../data/surprisingFacts.ts'
import type {
  DiagramNode,
  LcaResult,
  SpeciesPoolEntry,
  TaxonomyData,
} from '../utils/taxonomy.ts'

type GameState =
  | 'customizing'
  | 'loading'
  | 'selecting'
  | 'result'
  | 'easyCompleted'
  | 'gameOver'
type GameMode = 'easy' | 'random' | 'custom'

interface ResultData {
  correct: boolean
  sister1: Organism
  sister2: Organism
  outgroup: Organism
  cladeLabel: string
  sisterMrca: LcaResult
  overallMrca: LcaResult
  isPolytomy: boolean
  score: number
  funFact?: string
  diagram?: DiagramNode
  sources?: { url: string; label: string }[]
  activelyDebated?: boolean
}

function computeResult(orgs: Organism[], data: TaxonomyData) {
  const taxIds: [number, number, number] = [
    orgs[0].ncbiTaxId,
    orgs[1].ncbiTaxId,
    orgs[2].ncbiTaxId,
  ]
  const pair = findClosestPairFromData(taxIds, data)
  const byTaxId = new Map(orgs.map(o => [o.ncbiTaxId, o]))
  return {
    sister1: byTaxId.get(pair.sister1TaxId) ?? orgs[0],
    sister2: byTaxId.get(pair.sister2TaxId) ?? orgs[1],
    outgroup: byTaxId.get(pair.outgroupTaxId) ?? orgs[2],
    cladeLabel: pair.sisterLca.name,
    sisterMrca: pair.sisterLca,
    overallMrca: pair.overallLca,
    isPolytomy: pair.isPolytomy,
  }
}

export default function Game({ mode }: { mode: GameMode }) {
  const difficulty = getDifficulty()
  const [state, setState] = useState<GameState>(
    mode === 'custom' ? 'customizing' : 'loading',
  )
  const [round, setRound] = useState<Organism[] | null>(null)
  const [selected, setSelected] = useState<number[]>([])
  const [result, setResult] = useState<ResultData | null>(null)
  const [taxonomyData, setTaxonomyData] = useState<TaxonomyData | null>(null)
  const [speciesPool, setSpeciesPool] = useState<SpeciesPoolEntry[] | null>(
    null,
  )
  const [scenarios, setScenarios] = useState<SurprisingScenario[] | null>(null)
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

  const [questionNumber, setQuestionNumber] = useState(1)
  const [totalScore, setTotalScore] = useState(0)
  const [roundResults, setRoundResults] = useState<RoundResult[]>([])
  const [hints, setHints] = useState<Record<number, string | null>>({})
  const [hintLoading, setHintLoading] = useState(false)
  const [hintUsed, setHintUsed] = useState(false)
  const [showHintPenalty, setShowHintPenalty] = useState(false)
  const [timedOut, setTimedOut] = useState(false)
  const [isSharedQuestion, setIsSharedQuestion] = useState(false)

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

  const [isMulti, setIsMulti] = useState(false)
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
    setHints({})
    setHintLoading(false)
    setHintUsed(false)
    setShowHintPenalty(false)
    setTimedOut(false)

    let data = taxonomyData
    if (!data) {
      setLoadingMessage('Downloading taxonomy data...')
      data =
        mode === 'easy'
          ? await loadEasyTaxonomyData()
          : await loadTaxonomyData()
      setTaxonomyData(data)
    }

    if (mode === 'easy') {
      let loadedScenarios = scenarios
      if (!loadedScenarios) {
        setLoadingMessage('Loading scenarios...')
        loadedScenarios = await loadSurprisingScenarios()
        setScenarios(loadedScenarios)
      }
      setLoadingMessage('Loading organisms...')
      const unshown = loadedScenarios
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
        if (roundResults.length > 0) {
          setState('gameOver')
        } else {
          setState('easyCompleted')
        }
        return
      }
      const shuffled = orgs.sort(() => Math.random() - 0.5)
      recordCombo(shuffled)
      setRound(shuffled)
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
      setRandomClade(null)

      const isMicroMode = cladeFilter.trim() === 'micro'
      let cladeTaxId: number | undefined
      if (cladeFilter.trim() && !isMicroMode) {
        cladeTaxId = findTaxId(cladeFilter.trim(), data)
        if (cladeTaxId === undefined) {
          if (mode === 'custom') {
            setLoadingMessage(`"${cladeFilter.trim()}" not found in taxonomy`)
            return
          }
          setCladeFilter('')
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
            if (mode === 'custom') {
              setLoadingMessage('Not enough microorganisms in the pool')
              return
            }
            setCladeFilter('')
            continue
          }
          picks = result
          attemptClade = { taxId: 0, name: 'Microorganisms', rank: '' }
        } else if (cladeTaxId !== undefined) {
          const result = pickThreeFromClade(cladeTaxId, pool, data)
          if (!result) {
            const label = data.names[String(cladeTaxId)] ?? cladeFilter.trim()
            setLoadingMessage(
              `Not enough species in "${label}" — try a broader group`,
            )
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
      setRound(finalOrgs)
      updateUrlWithQuestion(finalOrgs)
      setState('selecting')
    }
  }, [
    mode,
    taxonomyData,
    speciesPool,
    scenarios,
    cladeFilter,
    shownScenarioIndices,
    seenCombos,
  ])

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
      setRound(orgs)
      setIsSharedQuestion(true)
      setState('selecting')
    },
    [taxonomyData, speciesPool, startRound],
  )

  useEffect(() => {
    const sharedIds = parseSharedIds()
    if (sharedIds) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadSharedQuestion(sharedIds)
    } else if (mode === 'custom') {
      loadTaxonomyData().then(setTaxonomyData)
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
        if (orgs.length === 3) {
          setRound(orgs)
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
    if (!round || hintUsed) {
      return
    }
    setHintUsed(true)
    setShowHintPenalty(true)
    setTimeout(() => setShowHintPenalty(false), 1500)
    setHintLoading(true)
    const results = await Promise.all(
      round.map(org =>
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
  }, [round, hintUsed])

  const handleSubmit = async (expired = false) => {
    if (!round || !taxonomyData) {
      return
    }
    if (!expired && selected.length !== 2) {
      return
    }

    if (expired) {
      setTimedOut(true)
    }

    const scenario = scenarios?.find(
      s => comboKey(s.organisms) === comboKey(round),
    )

    const pairResult = computeResult(round, taxonomyData)

    let correct: boolean
    if (expired || selected.length !== 2) {
      correct = false
    } else if (scenario?.correctPair) {
      const userPicked = new Set(selected.map(i => round[i].commonName))
      correct = scenario.correctPair.every(name => userPicked.has(name))
    } else {
      const userPickedTaxIds = new Set(selected.map(i => round[i].ncbiTaxId))
      correct =
        pairResult.isPolytomy ||
        (userPickedTaxIds.has(pairResult.sister1.ncbiTaxId) &&
          userPickedTaxIds.has(pairResult.sister2.ncbiTaxId))
    }

    const resultData: ResultData = {
      ...pairResult,
      correct,
      score: 0,
    }

    if (scenario) {
      resultData.funFact = scenario.funFact
      resultData.sources = scenario.sources
      if (scenario.activelyDebated) {
        resultData.activelyDebated = true
        resultData.correct = true
      }
      if (scenario.correctPair) {
        const cp = scenario.correctPair
        const sister1 = round.find(o => o.commonName === cp[0]) ?? round[0]
        const sister2 = round.find(o => o.commonName === cp[1]) ?? round[1]
        const outgroup =
          round.find(o => o.commonName !== cp[0] && o.commonName !== cp[1]) ??
          round[2]
        resultData.sister1 = sister1
        resultData.sister2 = sister2
        resultData.outgroup = outgroup
        resultData.isPolytomy = false
      }
    }

    if (!resultData.isPolytomy) {
      resultData.diagram = buildContextDiagram(
        resultData.sister1,
        resultData.sister2,
        resultData.outgroup,
        resultData.sisterMrca.taxId,
        resultData.overallMrca.taxId,
        taxonomyData,
      )
    }

    const score = calculateScore(resultData.correct, hintUsed ? 1 : 0)
    resultData.score = score
    setTotalScore(prev => prev + score)
    const organismNames = round.map(o => o.commonName)
    setRoundResults(prev => [
      ...prev,
      { correct: resultData.correct, score, organisms: organismNames },
    ])

    setResult(resultData)
    setState('result')
    history.pushState({ result: true }, '')
  }

  const maxQuestions = isSharedQuestion ? 1 : TOTAL_QUESTIONS
  const isLastQuestion = questionNumber >= maxQuestions

  const handleNextQuestion = useCallback(() => {
    if (isLastQuestion && !isSharedQuestion) {
      setState('gameOver')
    } else {
      setQuestionNumber(prev => prev + 1)
      startRound()
    }
  }, [isLastQuestion, isSharedQuestion, startRound])

  const handlePlayAgain = useCallback(() => {
    setQuestionNumber(1)
    setTotalScore(0)
    setRoundResults([])
    setIsSharedQuestion(false)
    startRound()
  }, [startRound])

  return (
    <div className="game">
      <Header />

      {state === 'customizing' && (
        <div className="custom-screen">
          <h2>Choose Your Challenge</h2>

          <div className="custom-species-toggle">
            <button
              className={`species-toggle-btn ${!isMulti ? 'active' : ''}`}
              onClick={() => setIsMulti(false)}
            >
              3 species
            </button>
            <button
              className={`species-toggle-btn ${isMulti ? 'active' : ''}`}
              onClick={() => setIsMulti(true)}
            >
              6 species
            </button>
          </div>

          <div className="clade-tree-wrap">
            <div className="clade-tree">
              {DISPLAY_TREE.map((entry, i) => {
                if (entry.type === 'header') {
                  return (
                    <div key={`h${i}`} className="clade-tree-header">
                      {entry.label}
                    </div>
                  )
                }
                const href = isMulti
                  ? `/multi?id=${entry.id}`
                  : entry.id === 'micro'
                    ? '/random?id=micro'
                    : `/random?id=${entry.id}`
                return (
                  <a
                    key={entry.id}
                    className={`clade-tree-item clade-tree-link ${cladeFilter === entry.id ? 'active' : ''}`}
                    href={href}
                  >
                    <span className="clade-tree-prefix">{entry.prefix}</span>
                    <span className="clade-tree-node">
                      {entry.emoji && (
                        <span className="clade-tree-emoji">{entry.emoji}</span>
                      )}
                      <span
                        className={`clade-tree-label${entry.emoji ? '' : ' clade-tree-label-muted'}`}
                      >
                        {entry.label}
                      </span>
                    </span>
                  </a>
                )
              })}
            </div>
          </div>

          <AdvancedTaxonSearch taxonomyData={taxonomyData} />

          <div className="custom-actions">
            <Button variant="secondary" href="/">
              ⏮ Back
            </Button>
          </div>
        </div>
      )}

      {state === 'easyCompleted' && (
        <div className="easy-completed">
          <p>
            You&apos;ve completed all {scenarios?.length ?? 0} curated
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
            <Button variant="secondary" href="/">
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
          {loadingMessage.includes('try a broader group') && (
            <Button variant="secondary" href="/custom">
              ⏮ Back
            </Button>
          )}
        </div>
      )}

      {state === 'selecting' && round && (
        <div className="selecting">
          <div className="game-meta">
            {!isSharedQuestion && (
              <div className="game-progress">
                <span className="game-progress-question">
                  Question {questionNumber}/{maxQuestions}
                </span>
                <span className="game-progress-score">
                  Score: <strong>{totalScore}</strong>
                </span>
              </div>
            )}
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
          </div>
          <Timer key={questionNumber} onExpire={() => handleSubmit(true)} />
          <p className="selecting-prompt">
            Choose the two organisms you think are most closely related
          </p>
          <div className="cards">
            {round.map((org, i) => (
              <OrganismCard
                key={org.ncbiTaxId}
                commonName={org.commonName}
                scientificName={org.scientificName}
                imageUrl={org.imageUrl ?? null}
                selected={selected.includes(i)}

                onClick={() => setSelected(prev => toggleSelect(prev, i))}
                mapColor={MAP_COLORS[i % MAP_COLORS.length]}
                difficulty={difficulty}
                hint={hintUsed ? (hintLoading ? 'Loading...' : (hints[i] ?? null)) : undefined}
              />
            ))}
          </div>
          <div className="selecting-actions">
            <div className="hint-btn-wrap">
              {!hintUsed && (
                <button
                  className="hint-btn"
                  onClick={handleHint}
                  title="Show hints for all organisms (-50% pts)"
                >
                  💡
                </button>
              )}
              {showHintPenalty && (
                <span className="hint-penalty-toast">−50% pts</span>
              )}
            </div>

            <Button
              onClick={() => handleSubmit()}
              disabled={selected.length !== 2}
            >
              Submit
            </Button>
            <button className="nav-icon-btn" onClick={startRound} title="Skip">
              <span className="nav-icon-btn-label">Skip</span> →
            </button>
          </div>
          <MapToggle organisms={round} difficulty={difficulty} />
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
            round.map(o => [o.ncbiTaxId, o.imageUrl ?? null]),
          )}
          userSelectedTaxIds={new Set(selected.map(i => round[i].ncbiTaxId))}
          organismColors={Object.fromEntries(
            round.map((o, i) => [
              o.ncbiTaxId,
              MAP_COLORS[i % MAP_COLORS.length],
            ]),
          )}
          funFact={result.funFact}
          diagram={result.diagram}
          sources={result.sources}
          activelyDebated={result.activelyDebated}
          shareUrl={buildShareUrl(round)}
          onPlayAgain={handleNextQuestion}
          timedOut={timedOut}
          score={result.score}
          questionLabel={
            isSharedQuestion
              ? undefined
              : `Question ${questionNumber}/${maxQuestions} · Score: ${totalScore}`
          }
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
