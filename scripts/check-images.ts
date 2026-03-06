import { organisms } from '../src/data/organisms.ts'

async function getWikiThumbnail(wikiTitle: string) {
  const res = await fetch(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wikiTitle)}`,
  )
  if (!res.ok) {
    return null
  }
  const data = await res.json()
  return (data.thumbnail?.source as string) ?? null
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
  return (taxon?.default_photo?.medium_url as string) ?? null
}

async function checkOrganism(org: (typeof organisms)[number]) {
  const wikiImg = await getWikiThumbnail(org.wikiTitle)
  if (wikiImg) {
    return { org, source: 'wiki' as const }
  }
  const inatImg = await getINaturalistPhoto(org.scientificName)
  if (inatImg) {
    return { org, source: 'inat' as const }
  }
  return { org, source: 'none' as const }
}

const BATCH_SIZE = 5
const results: Awaited<ReturnType<typeof checkOrganism>>[] = []

console.log(`Checking ${organisms.length} organisms for images...\n`)

for (let i = 0; i < organisms.length; i += BATCH_SIZE) {
  const batch = organisms.slice(i, i + BATCH_SIZE)
  const batchResults = await Promise.all(batch.map(checkOrganism))
  for (const r of batchResults) {
    results.push(r)
    const icon = r.source === 'wiki' ? '✓' : r.source === 'inat' ? '~' : '✗'
    const label = r.source === 'none' ? 'NO IMAGE' : r.source
    console.log(`${icon} ${r.org.commonName} (${label})`)
  }
  if (i + BATCH_SIZE < organisms.length) {
    await new Promise(r => setTimeout(r, 200))
  }
}

const wikiCount = results.filter(r => r.source === 'wiki').length
const inatCount = results.filter(r => r.source === 'inat').length
const missing = results.filter(r => r.source === 'none')

console.log(`\n--- Summary ---`)
console.log(`Wikipedia: ${wikiCount}`)
console.log(`iNaturalist fallback: ${inatCount}`)
console.log(`No image: ${missing.length}`)

if (missing.length > 0) {
  console.log(`\nMissing images:`)
  for (const r of missing) {
    console.log(
      `  - ${r.org.commonName} (${r.org.scientificName}) [wiki: ${r.org.wikiTitle}]`,
    )
  }
  process.exit(1)
}
