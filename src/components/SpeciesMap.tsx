import { useEffect, useRef, useState, useMemo } from 'preact/hooks'
import { lazy, Suspense } from 'preact/compat'
import { getGbifTaxonKey } from '../api/gbif.ts'
import { capitalize } from '../utils/format.ts'
import type { Organism } from '../data/organisms.ts'

const InteractiveMap = lazy(() => import('./InteractiveMap.tsx'))

export const MAP_COLORS = ['#e07020', '#2070d0', '#20a050']

const TILE_COORDS = [
  { x: 0, y: 0, sub: 'a' },
  { x: 1, y: 0, sub: 'b' },
  { x: 0, y: 1, sub: 'c' },
  { x: 1, y: 1, sub: 'd' },
]

const TILE_SIZE = 512
const FULL_SIZE = TILE_SIZE * 2
const SAMPLE_STEP = 4
const DOT_RADIUS = 4

// Crop region in the full Mercator square (~70N to ~58S)
const CROP_TOP = Math.round(FULL_SIZE * 0.13)
const CROP_BOTTOM = Math.round(FULL_SIZE * 0.8)
const SRC_CROP_HEIGHT = CROP_BOTTOM - CROP_TOP

// Display dimensions: full width, squished height
const DISPLAY_W = FULL_SIZE
const DISPLAY_H = 550

// Reusable offscreen canvas for reading tile pixels (lazy to avoid SSR issues)
let scratchCtx: CanvasRenderingContext2D | null = null
function getScratchCtx() {
  if (!scratchCtx) {
    const c = document.createElement('canvas')
    c.width = TILE_SIZE
    c.height = TILE_SIZE
    scratchCtx = c.getContext('2d')!
  }
  return scratchCtx
}

function baseTileUrl(x: number, y: number, sub: string) {
  return `https://${sub}.basemaps.cartocdn.com/light_nolabels/1/${x}/${y}@2x.png`
}

function densityTileUrl(taxonKey: number, x: number, y: number) {
  return `https://api.gbif.org/v2/map/occurrence/density/1/${x}/${y}@2x.png?taxonKey=${taxonKey}&style=classic.point`
}

function loadImage(url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = url
  })
}

function findOccurrencePoints(img: HTMLImageElement) {
  const ctx = getScratchCtx()
  ctx.clearRect(0, 0, TILE_SIZE, TILE_SIZE)
  ctx.drawImage(img, 0, 0, TILE_SIZE, TILE_SIZE)
  const pixels = ctx.getImageData(0, 0, TILE_SIZE, TILE_SIZE).data

  const points: { cx: number; cy: number }[] = []
  for (let py = 0; py < TILE_SIZE; py += SAMPLE_STEP) {
    for (let px = 0; px < TILE_SIZE; px += SAMPLE_STEP) {
      if (pixels[(py * TILE_SIZE + px) * 4 + 3] > 0) {
        points.push({ cx: px, cy: py })
      }
    }
  }
  return points
}

function mapToDisplay(tx: number, ty: number, cx: number, cy: number) {
  const srcX = tx * TILE_SIZE + cx
  const srcY = ty * TILE_SIZE + cy
  return {
    dx: (srcX / FULL_SIZE) * DISPLAY_W,
    dy: ((srcY - CROP_TOP) / SRC_CROP_HEIGHT) * DISPLAY_H,
  }
}

export type MapMode = 'static' | 'hex' | 'square'

const MAP_MODES: { value: MapMode; label: string }[] = [
  { value: 'static', label: 'Static' },
  { value: 'hex', label: 'Interactive: Hex' },
  { value: 'square', label: 'Interactive: Square' },
]

export default function SpeciesMap({ organisms }: { organisms: Organism[] }) {
  const basemapCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const snapshotCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const displayCanvasRef = useRef<HTMLCanvasElement>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [mode, setMode] = useState<MapMode>('static')
  const mapControlsRef = useRef<{ resetView: () => void } | null>(null)

  const taxIdKey = useMemo(
    () => organisms.map(o => o.ncbiTaxId).join(','),
    [organisms],
  )

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(false)

    if (!basemapCanvasRef.current) {
      basemapCanvasRef.current = document.createElement('canvas')
      basemapCanvasRef.current.width = FULL_SIZE
      basemapCanvasRef.current.height = FULL_SIZE
    }

    async function render() {
      const bmCanvas = basemapCanvasRef.current
      if (!bmCanvas) {
        return
      }
      const bmCtx = bmCanvas.getContext('2d')!
      bmCtx.clearRect(0, 0, FULL_SIZE, FULL_SIZE)

      const baseTiles = await Promise.all(
        TILE_COORDS.map(async ({ x, y, sub }) => {
          try {
            return { x, y, img: await loadImage(baseTileUrl(x, y, sub)) }
          } catch {
            return { x, y, img: null }
          }
        }),
      )

      if (cancelled) {
        return
      }

      for (const { x, y, img } of baseTiles) {
        if (img) {
          bmCtx.drawImage(
            img,
            x * TILE_SIZE,
            y * TILE_SIZE,
            TILE_SIZE,
            TILE_SIZE,
          )
        }
      }

      drawToDisplay([])

      const allSpeciesData: {
        color: string
        points: { tx: number; ty: number; cx: number; cy: number }[]
      }[] = []
      for (let i = 0; i < organisms.length; i++) {
        const color = MAP_COLORS[i % MAP_COLORS.length]
        const key = await getGbifTaxonKey(organisms[i].scientificName)
        if (!key) {
          allSpeciesData.push({ color, points: [] })
          continue
        }
        const points: { tx: number; ty: number; cx: number; cy: number }[] = []
        for (const { x, y } of TILE_COORDS) {
          if (cancelled) {
            return
          }
          try {
            const img = await loadImage(densityTileUrl(key, x, y))
            for (const { cx, cy } of findOccurrencePoints(img)) {
              points.push({ tx: x, ty: y, cx, cy })
            }
          } catch {
            // tile failed for this quadrant
          }
        }
        allSpeciesData.push({ color, points })
      }

      if (cancelled) {
        return
      }

      drawToDisplay(allSpeciesData)
      setLoading(false)
    }

    function drawToDisplay(
      speciesData: {
        color: string
        points: { tx: number; ty: number; cx: number; cy: number }[]
      }[],
    ) {
      if (!basemapCanvasRef.current) {
        return
      }

      if (!snapshotCanvasRef.current) {
        snapshotCanvasRef.current = document.createElement('canvas')
        snapshotCanvasRef.current.width = DISPLAY_W
        snapshotCanvasRef.current.height = DISPLAY_H
      }

      const snap = snapshotCanvasRef.current
      const snapCtx = snap.getContext('2d')!
      snapCtx.clearRect(0, 0, DISPLAY_W, DISPLAY_H)

      snapCtx.drawImage(
        basemapCanvasRef.current,
        0,
        CROP_TOP,
        FULL_SIZE,
        SRC_CROP_HEIGHT,
        0,
        0,
        DISPLAY_W,
        DISPLAY_H,
      )

      for (const { color, points } of speciesData) {
        snapCtx.globalAlpha = 0.35
        snapCtx.fillStyle = color
        for (const { tx, ty, cx, cy } of points) {
          const { dx, dy } = mapToDisplay(tx, ty, cx, cy)
          snapCtx.beginPath()
          snapCtx.arc(dx, dy, DOT_RADIUS, 0, Math.PI * 2)
          snapCtx.fill()
        }
        snapCtx.globalAlpha = 1
      }

      const display = displayCanvasRef.current
      if (display) {
        const ctx = display.getContext('2d')!
        ctx.clearRect(0, 0, DISPLAY_W, DISPLAY_H)
        ctx.drawImage(snap, 0, 0)
      }
    }

    render().catch(() => {
      if (!cancelled) {
        setError(true)
        setLoading(false)
      }
    })

    return () => {
      cancelled = true
    }
  }, [taxIdKey])

  useEffect(() => {
    if (mode === 'static' && snapshotCanvasRef.current && displayCanvasRef.current) {
      const ctx = displayCanvasRef.current.getContext('2d')!
      ctx.clearRect(0, 0, DISPLAY_W, DISPLAY_H)
      ctx.drawImage(snapshotCanvasRef.current, 0, 0)
    }
  }, [mode])

  return (
    <div className="species-map-container">
      <h3 className="species-map-title">Species Occurrence (GBIF)</h3>
      <div className="map-toggle-row">
        <div className="map-toggle-group">
          {MAP_MODES.map(m => (
            <button
              key={m.value}
              className={`map-toggle-btn${mode === m.value ? ' map-toggle-btn--active' : ''}`}
              onClick={() => setMode(m.value)}
            >
              {m.label}
            </button>
          ))}
        </div>
        {mode !== 'static' && (
          <button
            className="map-toggle-btn map-reset-btn"
            onClick={() => mapControlsRef.current?.resetView()}
          >
            Reset zoom
          </button>
        )}
      </div>
      {mode !== 'static' ? (
        <Suspense fallback={<div className="species-map-overlay-inline">Loading interactive map...</div>}>
          <InteractiveMap organisms={organisms} mode={mode} onMapReady={c => { mapControlsRef.current = c }} />
        </Suspense>
      ) : (
        <div className="species-map-wrapper">
          <canvas
            ref={displayCanvasRef}
            width={DISPLAY_W}
            height={DISPLAY_H}
            className="species-map-canvas"
          />
          {loading && (
            <div className="species-map-overlay">
              Loading species distributions...
            </div>
          )}
          {error && (
            <div className="species-map-overlay">
              Failed to load distribution data
            </div>
          )}
        </div>
      )}
      <div className="species-map-legend">
        {organisms.map((org, i) => (
          <span key={org.ncbiTaxId} className="species-map-legend-item">
            <span
              className="species-map-legend-dot"
              style={{ backgroundColor: MAP_COLORS[i % MAP_COLORS.length] }}
            />
            {capitalize(org.commonName)}
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
