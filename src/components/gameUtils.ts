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
  url.search = ''
  url.searchParams.set('ids', orgs.map(o => o.ncbiTaxId).join(','))
  return url.toString()
}

export function updateUrlWithQuestion(orgs: Organism[]) {
  history.pushState(null, '', buildShareUrl(orgs))
}

export function resolveOrganism(
  taxId: number,
  pool: SpeciesPoolEntry[] | null,
  data: TaxonomyData | null,
) {
  return resolveOrganismUtil(taxId, allOrganisms, pool, data)
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
