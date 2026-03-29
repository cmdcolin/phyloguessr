export const MAX_POINTS = 100
export const TOTAL_QUESTIONS = 10

function applyHintPenalty(basePoints: number, hintCount: number) {
  return Math.round(basePoints / Math.pow(2, hintCount))
}

export function calculateScore(correct: boolean, hintCount: number) {
  if (!correct) {
    return 0
  }
  return applyHintPenalty(MAX_POINTS, hintCount)
}
