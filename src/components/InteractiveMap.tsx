import { useEffect, useRef, useState } from "preact/hooks";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getGbifTaxonKey } from "../api/gbif.ts";
import { MAP_COLORS, type MapMode } from "./SpeciesMap.tsx";
import type { Organism } from "../data/organisms.ts";

interface TileMode {
  style: string;
  params: string;
}

const TILE_MODES: Record<Exclude<MapMode, "static">, TileMode> = {
  hex: { style: "classic.poly", params: "&bin=hex&hexPerTile=25" },
  square: { style: "classic.poly", params: "&bin=square&squareSize=32" },
};

function parseHexColor(hex: string) {
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  };
}

function createColoredTileLayer(
  taxonKey: number,
  color: string,
  style: string,
  extraParams: string,
) {
  const { r, g, b } = parseHexColor(color);
  return L.GridLayer.extend({
    createTile(coords: L.Coords, done: L.DoneCallback) {
      const canvas = document.createElement("canvas");
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext("2d")!;
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        ctx.drawImage(img, 0, 0, 256, 256);
        const imageData = ctx.getImageData(0, 0, 256, 256);
        const pixels = imageData.data;
        for (let i = 0; i < pixels.length; i += 4) {
          if (pixels[i + 3] > 0) {
            const alpha = pixels[i + 3];
            pixels[i] = r;
            pixels[i + 1] = g;
            pixels[i + 2] = b;
            pixels[i + 3] = alpha;
          }
        }
        ctx.putImageData(imageData, 0, 0);
        done(undefined, canvas);
      };
      img.onerror = () => done(undefined, canvas);
      img.src = `https://api.gbif.org/v2/map/occurrence/density/${coords.z}/${coords.x}/${coords.y}@1x.png?taxonKey=${taxonKey}&style=${style}${extraParams}`;
      return canvas;
    },
  });
}

export default function InteractiveMap({
  organisms,
  mode,
  onMapReady,
}: {
  organisms: Organism[];
  mode: Exclude<MapMode, "static">;
  onMapReady?: (controls: { resetView: () => void }) => void;
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const speciesLayersRef = useRef<L.GridLayer[]>([]);
  const [resolvedKeys, setResolvedKeys] = useState<(number | null)[]>([]);

  useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    if (leafletMap.current) {
      leafletMap.current.remove();
      leafletMap.current = null;
    }

    const map = L.map(mapRef.current, {
      center: [20, 0],
      zoom: 2,
      minZoom: 1,
      maxZoom: 10,
      worldCopyJump: true,
    });
    leafletMap.current = map;
    onMapReady?.({ resetView: () => map.setView([20, 0], 2) });

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a> | <a href="https://www.gbif.org/">GBIF</a>',
        subdomains: "abcd",
        maxZoom: 20,
      },
    ).addTo(map);

    let cancelled = false;

    async function addLayers() {
      const keys: (number | null)[] = [];
      for (let i = 0; i < organisms.length; i++) {
        const key = await getGbifTaxonKey(organisms[i].scientificName);
        keys.push(key);
      }
      if (!cancelled) {
        setResolvedKeys(keys);
      }
    }

    addLayers();

    return () => {
      cancelled = true;
      map.remove();
      leafletMap.current = null;
      speciesLayersRef.current = [];
    };
  }, [organisms.map((o) => o.ncbiTaxId).join(",")]);

  useEffect(() => {
    const map = leafletMap.current;
    if (!map || resolvedKeys.length === 0) {
      return;
    }

    for (const layer of speciesLayersRef.current) {
      map.removeLayer(layer);
    }
    speciesLayersRef.current = [];

    const tileMode = TILE_MODES[mode];
    for (let i = 0; i < resolvedKeys.length; i++) {
      const key = resolvedKeys[i];
      if (key) {
        const color = MAP_COLORS[i % MAP_COLORS.length];
        const LayerClass = createColoredTileLayer(
          key,
          color,
          tileMode.style,
          tileMode.params,
        );
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const layer = new (LayerClass as unknown as new (
          opts: L.GridLayerOptions,
        ) => L.GridLayer)({ opacity: 0.7, maxZoom: 10 }).addTo(map);
        speciesLayersRef.current.push(layer);
      }
    }
  }, [resolvedKeys, mode]);

  return <div ref={mapRef} className="species-interactive-map" />;
}
