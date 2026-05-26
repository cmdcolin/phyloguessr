export function shuffled<T>(arr: T[]): T[] {
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = out[i]
    out[i] = out[j]
    out[j] = tmp
  }
  return out
}

export function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(' ')
}

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
