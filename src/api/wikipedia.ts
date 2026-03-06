const imageCache = new Map<string, string | null>()

export async function getWikiThumbnail(wikiTitle: string) {
  const res = await fetch(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wikiTitle)}`,
  )
  if (!res.ok) {
    return null
  }
  const data = await res.json()
  return (data.thumbnail?.source as string) ?? null
}

export async function getWikiExtract(wikiTitle: string) {
  const res = await fetch(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wikiTitle)}`,
  )
  if (!res.ok) {
    return null
  }
  const data = await res.json()
  return (data.extract as string) ?? null
}

async function getINaturalistPhoto(scientificName: string) {
  const res = await fetch(
    `https://api.inaturalist.org/v1/taxa?q=${encodeURIComponent(scientificName)}&per_page=1`,
  )
  if (!res.ok) {
    return null
  }
  const data = await res.json()
  const taxon = data.results?.[0]
  if (taxon?.default_photo?.medium_url) {
    return taxon.default_photo.medium_url as string
  }
  return null
}

export async function getOrganismImage(
  wikiTitle: string,
  scientificName: string,
) {
  const key = wikiTitle
  if (imageCache.has(key)) {
    return imageCache.get(key)!
  }
  const wikiImg = await getWikiThumbnail(wikiTitle)
  if (wikiImg) {
    imageCache.set(key, wikiImg)
    return wikiImg
  }
  const inatImg = await getINaturalistPhoto(scientificName)
  imageCache.set(key, inatImg)
  return inatImg
}
