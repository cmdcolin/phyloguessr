import { MAX_POINTS, TOTAL_QUESTIONS } from '../utils/scoring'

export interface RoundResult {
  correct: boolean
  score: number
  organisms: string[]
}

export default function GameOverScreen({
  totalScore,
  roundResults,
  onPlayAgain,
}: {
  totalScore: number
  roundResults: RoundResult[]
  onPlayAgain: () => void
}) {
  const maxPossible = TOTAL_QUESTIONS * MAX_POINTS
  const percentage = Math.round((totalScore / maxPossible) * 100)

  return (
    <div className="game-over">
      <h2 className="game-over-title">Game Over</h2>
      <div className="game-over-score">
        <span className="game-over-points">{totalScore.toLocaleString()}</span>
        <span className="game-over-max"> / {maxPossible.toLocaleString()}</span>
      </div>
      <div className="game-over-percentage">{percentage}%</div>
      <div className="game-over-rounds">
        {roundResults.map((r, i) => (
          <div key={i} className={`game-over-round ${r.correct ? 'correct' : r.score > 0 ? 'medium' : 'wrong'}`}>
            <span className="game-over-round-num">Q{i + 1}</span>
            <span className="game-over-round-organisms">
              {r.organisms.join(' · ')}
            </span>
            <span className={`game-over-round-result ${r.correct ? 'correct' : r.score > 0 ? 'medium' : 'wrong'}`}>
              {r.correct ? '✓' : r.score > 0 ? '~' : '✗'}
            </span>
            <span className="game-over-round-score">
              {r.score > 0 ? `+${r.score}` : '0'}
            </span>
          </div>
        ))}
      </div>
      <button className="play-again-btn" onClick={onPlayAgain}>
        Play Again
      </button>
    </div>
  )
}
