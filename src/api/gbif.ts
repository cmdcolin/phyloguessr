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
