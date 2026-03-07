import { useRef } from 'preact/hooks'
import { Suspense, lazy } from 'react'

import { capitalize } from '../utils/format.ts'

import type { Organism } from '../data/organisms.ts'
import type { Difficulty } from './gameUtils.ts'

const InteractiveMap = lazy(() => import('./InteractiveMap.tsx'))

export const MAP_COLORS = ['#e07020', '#2070d0', '#20a050']

export default function SpeciesMap({
  organisms,
  difficulty = 'normal',
}: {
  organisms: Organism[]
  difficulty?: Difficulty
}) {
  const showLabels = difficulty === 'normal'
  const mapControlsRef = useRef<{ resetView: () => void } | null>(null)

  return (
    <div className="species-map-container">
      <h3 className="species-map-title">Species Occurrence (GBIF)</h3>
      <div className="map-toggle-row">
        <button
          className="map-toggle-btn map-reset-btn"
          onClick={() => mapControlsRef.current?.resetView()}
        >
          Reset zoom
        </button>
      </div>
      <Suspense
        fallback={
          <div className="species-map-overlay-inline">
            Loading interactive map...
          </div>
        }
      >
        <InteractiveMap
          organisms={organisms}
          onMapReady={c => {
            mapControlsRef.current = c
          }}
        />
      </Suspense>
      <div className="species-map-legend">
        {organisms.map((org, i) => (
          <span key={org.ncbiTaxId} className="species-map-legend-item">
            <span
              className="species-map-legend-dot"
              style={{ backgroundColor: MAP_COLORS[i % MAP_COLORS.length] }}
            />
            {showLabels ? capitalize(org.commonName) : null}
          </span>
        ))}
      </div>
      <div className="species-map-attribution">
        &copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy;{' '}
        <a href="https://carto.com/">CARTO</a> | Occurrence data from{' '}
        <a href="https://www.gbif.org/">GBIF</a>
      </div>
    </div>
  )
}
