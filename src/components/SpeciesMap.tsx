import { useEffect, useRef, useState, useMemo } from "preact/hooks";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getGbifTaxonKey, gbifTileUrl } from "../api/gbif.ts";
import { capitalize } from "../utils/format.ts";
import type { Organism } from "../data/organisms.ts";

const TILE_STYLES = [
  { style: "classic.point", label: "blue" },
  { style: "fire.point", label: "red" },
  { style: "green.point", label: "green" },
];

export default function SpeciesMap({
  organisms,
}: {
  organisms: Organism[];
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const [legend, setLegend] = useState<
    { name: string; color: string; failed: boolean }[]
  >([]);
  const [loading, setLoading] = useState(true);

  const taxIds = useMemo(
    () => organisms.map((o) => o.ncbiTaxId).join(","),
    [organisms],
  );

  useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    if (leafletMap.current) {
      leafletMap.current.remove();
      leafletMap.current = null;
    }

    setLoading(true);
    setLegend([]);

    const map = L.map(mapRef.current, {
      center: [20, 0],
      zoom: 1,
      minZoom: 1,
      maxZoom: 8,
      worldCopyJump: true,
    });
    leafletMap.current = map;

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a> | Occurrence data from <a href="https://www.gbif.org/">GBIF</a>',
        subdomains: "abcd",
        maxZoom: 20,
      },
    ).addTo(map);

    let cancelled = false;

    async function addSpeciesLayers() {
      const results = await Promise.all(
        organisms.map(async (org, i) => {
          const key = await getGbifTaxonKey(org.scientificName);
          return { org, key, styleIdx: i % TILE_STYLES.length };
        }),
      );

      if (cancelled) {
        return;
      }

      const legendEntries: { name: string; color: string; failed: boolean }[] =
        [];

      for (const { org, key, styleIdx } of results) {
        const tileStyle = TILE_STYLES[styleIdx];
        if (key) {
          L.tileLayer(gbifTileUrl(key, tileStyle.style), {
            opacity: 0.7,
            maxZoom: 8,
          }).addTo(map);
          legendEntries.push({
            name: capitalize(org.commonName),
            color: tileStyle.label,
            failed: false,
          });
        } else {
          legendEntries.push({
            name: capitalize(org.commonName),
            color: tileStyle.label,
            failed: true,
          });
        }
      }

      setLegend(legendEntries);
      setLoading(false);
    }

    addSpeciesLayers();

    return () => {
      cancelled = true;
      map.remove();
      leafletMap.current = null;
    };
  }, [taxIds]);

  const colorMap: Record<string, string> = {
    blue: "#3388ff",
    red: "#e25822",
    green: "#2d8659",
  };

  return (
    <div className="species-map-container">
      <h3 className="species-map-title">Species Occurrence (GBIF)</h3>
      <div ref={mapRef} className="species-map" />
      {loading && (
        <div className="species-map-loading">Loading map data...</div>
      )}
      {legend.length > 0 && (
        <div className="species-map-legend">
          {legend.map((entry) => (
            <span key={entry.name} className="species-map-legend-item">
              <span
                className="species-map-legend-dot"
                style={{ backgroundColor: colorMap[entry.color] ?? "#999" }}
              />
              {entry.name}
              {entry.failed && " (no data)"}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
