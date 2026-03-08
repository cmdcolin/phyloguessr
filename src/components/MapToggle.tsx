import { useState } from 'react'

import SpeciesMap, { MAP_COLORS } from './SpeciesMap.tsx'

import type { Difficulty } from './gameUtils.ts'
import type { Organism } from '../data/organisms.ts'

export function MapToggle({
  organisms,
  organismColors,
  difficulty,
}: {
  organisms: Organism[]
  organismColors?: Record<number, string>
  difficulty?: Difficulty
}) {
  const [show, setShow] = useState(false)
  const sorted = organismColors
    ? [...organisms].sort(
        (a, b) =>
          MAP_COLORS.indexOf(organismColors[a.ncbiTaxId]) -
          MAP_COLORS.indexOf(organismColors[b.ncbiTaxId]),
      )
    : organisms
  return (
    <div className="map-toggle">
      <button className="map-hint-link" onClick={() => setShow(s => !s)}>
        {show
          ? 'Hide species distribution map'
          : 'Show species distribution map (GBIF)'}
      </button>
      {show && <SpeciesMap organisms={sorted} difficulty={difficulty} />}
    </div>
  )
}
