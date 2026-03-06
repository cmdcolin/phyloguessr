const gbifKeyCache = new Map<string, number | null>();

export async function getGbifTaxonKey(scientificName: string) {
  const cached = gbifKeyCache.get(scientificName);
  if (cached !== undefined) {
    return cached;
  }
  try {
    const res = await fetch(
      `https://api.gbif.org/v1/species/match?name=${encodeURIComponent(scientificName)}`,
    );
    if (!res.ok) {
      gbifKeyCache.set(scientificName, null);
      return null;
    }
    const data = await res.json();
    const key = (data.usageKey as number) ?? null;
    gbifKeyCache.set(scientificName, key);
    return key;
  } catch {
    gbifKeyCache.set(scientificName, null);
    return null;
  }
}

export function gbifTileUrl(taxonKey: number, style: string) {
  return `https://api.gbif.org/v2/map/occurrence/density/{z}/{x}/{y}@1x.png?taxonKey=${taxonKey}&style=${style}`;
}
