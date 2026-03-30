import { organisms as allOrganisms } from '../data/organisms.ts'
import { resolveOrganism as resolveOrganismUtil } from '../utils/taxonomy.ts'

import type { Organism } from '../data/organisms.ts'
import type { SpeciesPoolEntry, TaxonomyData } from '../utils/taxonomy.ts'

export function comboKey(orgs: { ncbiTaxId: number }[]) {
  return orgs
    .map(o => o.ncbiTaxId)
    .sort((a, b) => a - b)
    .join(',')
}

export function parseSharedIds() {
  const params = new URLSearchParams(window.location.search)

  const idsParam = params.get('ids')
  if (idsParam) {
    const ids = idsParam.split(',').map(Number)
    if (ids.length >= 3 && ids.every(n => Number.isFinite(n) && n > 0)) {
      return ids
    }
  }

  const a = params.get('a')
  const b = params.get('b')
  const c = params.get('c')
  if (a && b && c) {
    const ids = [Number(a), Number(b), Number(c)]
    if (ids.every(n => Number.isFinite(n) && n > 0)) {
      return ids
    }
  }

  return null
}

export function buildShareUrl(orgs: Organism[]) {
  const url = new URL(window.location.href)
  const id = url.searchParams.get('id')
  url.search = ''
  if (id) {
    url.searchParams.set('id', id)
  }
  url.searchParams.set('ids', orgs.map(o => o.ncbiTaxId).join(','))
  return url.toString()
}

export function updateUrlWithQuestion(orgs: Organism[]) {
  history.replaceState(null, '', buildShareUrl(orgs))
}

export function buildTimedOutUrl() {
  const url = new URL(window.location.href)
  url.searchParams.set('timedout', '1')
  return url.toString()
}

export function buildRetryUrl() {
  const url = new URL(window.location.href)
  url.searchParams.delete('timedout')
  url.searchParams.set('retry', '1')
  return url.toString()
}

export function resolveOrganism(
  taxId: number,
  pool: SpeciesPoolEntry[] | null,
  data: TaxonomyData | null,
) {
  return resolveOrganismUtil(taxId, allOrganisms, pool, data)
}

export type Difficulty = 'normal' | 'nolabels'

export function getDifficulty(): Difficulty {
  if (typeof window === 'undefined') return 'normal'
  const d = localStorage.getItem('phyloDifficulty')
  if (d === 'nolabels' || d === 'hard' || d === 'expert') return 'nolabels'
  return 'normal'
}

export function toggleSelect(prev: number[], idx: number) {
  if (prev.includes(idx)) {
    return prev.filter(i => i !== idx)
  }
  if (prev.length < 2) {
    return [...prev, idx]
  }
  return [prev[1], idx]
}
