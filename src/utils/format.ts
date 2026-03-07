export function capitalize(s: string) {
  return s[0].toUpperCase() + s.slice(1)
}

export function formatRank(rank: string) {
  if (rank === 'no rank' || rank === 'no rank - terminal') {
    return 'group'
  }
  return rank
}

export interface MrcaInfo {
  taxId: number
  name: string
  rank: string
}
