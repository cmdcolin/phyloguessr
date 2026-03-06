import { useEffect, useRef, useState } from "preact/hooks";
import { getGbifTaxonKey } from "../api/gbif.ts";
import { capitalize } from "../utils/format.ts";
import type { Organism } from "../data/organisms.ts";

const COLORS = [
  { hex: "#e07020" },
  { hex: "#2070d0" },
  { hex: "#20a050" },
];

const TILE_COORDS = [
  { x: 0, y: 0, sub: "a" },
  { x: 1, y: 0, sub: "b" },
  { x: 0, y: 1, sub: "c" },
  { x: 1, y: 1, sub: "d" },
];

const TILE_SIZE = 512;
const FULL_SIZE = TILE_SIZE * 2;
const SAMPLE_STEP = 4;
const DOT_RADIUS = 4;

// Crop the Mercator square to cut polar regions (~72N to ~60S)
const CROP_TOP = Math.round(FULL_SIZE * 0.12);
const CROP_BOTTOM = Math.round(FULL_SIZE * 0.82);
const CROP_HEIGHT = CROP_BOTTOM - CROP_TOP;

function baseTileUrl(x: number, y: number, sub: string) {
  return `https://${sub}.basemaps.cartocdn.com/light_nolabels/1/${x}/${y}@2x.png`;
}

function densityTileUrl(taxonKey: number, x: number, y: number) {
  return `https://api.gbif.org/v2/map/occurrence/density/1/${x}/${y}@2x.png?taxonKey=${taxonKey}&style=classic.point`;
}

function loadImage(url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

function findOccurrencePoints(img: HTMLImageElement) {
  const offscreen = document.createElement("canvas");
  offscreen.width = TILE_SIZE;
  offscreen.height = TILE_SIZE;
  const offCtx = offscreen.getContext("2d")!;
  offCtx.drawImage(img, 0, 0, TILE_SIZE, TILE_SIZE);
  const imageData = offCtx.getImageData(0, 0, TILE_SIZE, TILE_SIZE);
  const pixels = imageData.data;

  const points: { cx: number; cy: number }[] = [];

  for (let py = 0; py < TILE_SIZE; py += SAMPLE_STEP) {
    for (let px = 0; px < TILE_SIZE; px += SAMPLE_STEP) {
      if (pixels[(py * TILE_SIZE + px) * 4 + 3] > 0) {
        points.push({ cx: px, cy: py });
      }
    }
  }

  return points;
}

interface SpeciesLayer {
  name: string;
  hex: string;
  hasData: boolean;
}

export default function SpeciesMap({
  organisms,
}: {
  organisms: Organism[];
}) {
  const fullCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const displayCanvasRef = useRef<HTMLCanvasElement>(null);
  const [layers, setLayers] = useState<SpeciesLayer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLayers([]);

    if (!fullCanvasRef.current) {
      fullCanvasRef.current = document.createElement("canvas");
      fullCanvasRef.current.width = FULL_SIZE;
      fullCanvasRef.current.height = FULL_SIZE;
    }

    async function render() {
      const fullCanvas = fullCanvasRef.current!;
      const ctx = fullCanvas.getContext("2d")!;
      ctx.clearRect(0, 0, FULL_SIZE, FULL_SIZE);

      for (const { x, y, sub } of TILE_COORDS) {
        try {
          const img = await loadImage(baseTileUrl(x, y, sub));
          if (cancelled) {
            return;
          }
          ctx.drawImage(
            img,
            x * TILE_SIZE,
            y * TILE_SIZE,
            TILE_SIZE,
            TILE_SIZE,
          );
        } catch {
          // basemap tile failed
        }
      }

      copyToDisplay();

      const allSpeciesData = await Promise.all(
        organisms.map(async (org, i) => {
          const color = COLORS[i % COLORS.length];
          const key = await getGbifTaxonKey(org.scientificName);
          if (!key) {
            return { org, color, points: [] as { tx: number; ty: number; cx: number; cy: number }[] };
          }
          const points: { tx: number; ty: number; cx: number; cy: number }[] = [];
          for (const { x, y } of TILE_COORDS) {
            try {
              const img = await loadImage(densityTileUrl(key, x, y));
              for (const { cx, cy } of findOccurrencePoints(img)) {
                points.push({ tx: x, ty: y, cx, cy });
              }
            } catch {
              // tile failed for this quadrant
            }
          }
          return { org, color, points };
        }),
      );

      if (cancelled) {
        return;
      }

      const speciesResults: SpeciesLayer[] = [];
      for (const { org, color, points } of allSpeciesData) {
        if (points.length > 0) {
          ctx.globalAlpha = 0.35;
          ctx.fillStyle = color.hex;
          for (const { tx, ty, cx, cy } of points) {
            ctx.beginPath();
            ctx.arc(
              tx * TILE_SIZE + cx,
              ty * TILE_SIZE + cy,
              DOT_RADIUS,
              0,
              Math.PI * 2,
            );
            ctx.fill();
          }
          ctx.globalAlpha = 1;
        }
        speciesResults.push({
          name: capitalize(org.commonName),
          hex: color.hex,
          hasData: points.length > 0,
        });
      }

      copyToDisplay();
      setLayers(speciesResults);
      setLoading(false);
    }

    function copyToDisplay() {
      const display = displayCanvasRef.current;
      if (!display || !fullCanvasRef.current) {
        return;
      }
      const dCtx = display.getContext("2d")!;
      dCtx.clearRect(0, 0, display.width, display.height);
      dCtx.drawImage(
        fullCanvasRef.current,
        0,
        CROP_TOP,
        FULL_SIZE,
        CROP_HEIGHT,
        0,
        0,
        FULL_SIZE,
        CROP_HEIGHT,
      );
    }

    render();

    return () => {
      cancelled = true;
    };
  }, [organisms.map((o) => o.ncbiTaxId).join(",")]);

  return (
    <div className="species-map-container">
      <h3 className="species-map-title">Species Occurrence (GBIF)</h3>
      <canvas
        ref={displayCanvasRef}
        width={FULL_SIZE}
        height={CROP_HEIGHT}
        className="species-map-canvas"
      />
      {loading && (
        <div className="species-map-loading">Loading map data...</div>
      )}
      <div className="species-map-legend">
        {layers.map((layer) => (
          <span key={layer.name} className="species-map-legend-item">
            <span
              className="species-map-legend-dot"
              style={{ backgroundColor: layer.hex }}
            />
            {layer.name}
            {!layer.hasData && " (no data)"}
          </span>
        ))}
      </div>
      <div className="species-map-attribution">
        &copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy;{" "}
        <a href="https://carto.com/">CARTO</a> | Occurrence data from{" "}
        <a href="https://www.gbif.org/">GBIF</a>
      </div>
    </div>
  );
}
