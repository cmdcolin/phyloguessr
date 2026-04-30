import { useEffect, useMemo, useRef, useState } from 'preact/hooks'

import { getGbifTaxonKey } from '../api/gbif.ts'

import type { Organism } from '../data/organisms.ts'
import type L from 'leaflet'

interface TileMode {
  style: string
  params: string
}

const TILE_CONFIG: TileMode = {
  style: 'classic.poly',
  params: '&bin=square&squareSize=32',
}

function createTileLayer(
  leaflet: typeof L,
  taxonKey: number,
  style: string,
  extraParams: string,
) {
  const url = `https://api.gbif.org/v2/map/occurrence/density/{z}/{x}/{y}@1x.png?taxonKey=${taxonKey}&style=${style}${extraParams}`
  return leaflet.tileLayer(url, {
    opacity: 0.7,
    maxZoom: 10,
  })
}

export default function InteractiveMap({
  organisms,
  onMapReady,
}: {
  organisms: Organism[]
  onMapReady?: (controls: { resetView: () => void }) => void
}) {
  const mapRef = useRef<HTMLDivElement>(null)
  const leafletMapRef = useRef<L.Map | null>(null)
  const speciesLayersRef = useRef<L.GridLayer[]>([])
  const [resolvedKeys, setResolvedKeys] = useState<(number | null)[]>([])
  const onMapReadyRef = useRef(onMapReady)
  onMapReadyRef.current = onMapReady

  const taxIdKey = useMemo(
    () => organisms.map(o => o.ncbiTaxId).join(','),
    [organisms],
  )

  const leafletRef = useRef<typeof L | null>(null)

  useEffect(() => {
    if (!mapRef.current) {
      return
    }

    let cancelled = false

    async function init() {
      const [leaflet] = await Promise.all([
        import('leaflet').then(m => m.default),
        import('leaflet/dist/leaflet.css'),
      ])
      if (cancelled || !mapRef.current) {
        return
      }
      leafletRef.current = leaflet

      if (leafletMapRef.current) {
        leafletMapRef.current.remove()
        leafletMapRef.current = null
      }

      const map = leaflet.map(mapRef.current, {
        center: [0, 0],
        zoom: 1,
        minZoom: 1,
        maxZoom: 10,
        worldCopyJump: true,
      })
      leafletMapRef.current = map
      onMapReadyRef.current?.({ resetView: () => map.setView([0, 0], 1) })

      leaflet
        .tileLayer(
          'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png',
          {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a> | <a href="https://www.gbif.org/">GBIF</a>',
            subdomains: 'abcd',
            maxZoom: 20,
          },
        )
        .addTo(map)

      const keys: (number | null)[] = []
      for (let i = 0; i < organisms.length; i++) {
        const key = await getGbifTaxonKey(organisms[i].scientificName)
        keys.push(key)
      }
      if (!cancelled) {
        setResolvedKeys(keys)
      }
    }

    init()

    return () => {
      cancelled = true
      if (leafletMapRef.current) {
        leafletMapRef.current.remove()
        leafletMapRef.current = null
      }
      speciesLayersRef.current = []
    }
  }, [organisms, taxIdKey])

  useEffect(() => {
    const map = leafletMapRef.current
    const leaflet = leafletRef.current
    if (!map || !leaflet || resolvedKeys.length === 0) {
      return
    }

    for (const layer of speciesLayersRef.current) {
      map.removeLayer(layer)
    }
    speciesLayersRef.current = []

    for (let i = 0; i < resolvedKeys.length; i++) {
      const key = resolvedKeys[i]
      if (key) {
        const layer = createTileLayer(
          leaflet,
          key,
          TILE_CONFIG.style,
          TILE_CONFIG.params,
        ).addTo(map)
        speciesLayersRef.current.push(layer)
      }
    }
  }, [resolvedKeys])

  return <div ref={mapRef} className="species-interactive-map" />
}
