import { organisms } from '../src/data/organisms.ts'

async function hasWikiThumbnail(wikiTitle: string) {
  const res = await fetch(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wikiTitle)}`,
    { method: 'HEAD' },
  )
  return res.ok
}

async function hasINaturalistPhoto(scientificName: string) {
  const res = await fetch(
    `https://api.inaturalist.org/v1/taxa?q=${encodeURIComponent(scientificName)}&per_page=1`,
  )
  if (!res.ok) {
    return false
  }
  const data = await res.json()
  const taxon = data.results?.[0]
  return !!taxon?.default_photo?.medium_url
}

async function main() {
  const missing: typeof organisms = []

  for (const org of organisms) {
    const wikiOk = await hasWikiThumbnail(org.wikiTitle)
    if (wikiOk) {
      console.log(`✓ ${org.commonName} (wiki)`)
      continue
    }

    const inatOk = await hasINaturalistPhoto(org.scientificName)
    if (inatOk) {
      console.log(`~ ${org.commonName} (iNaturalist)`)
      continue
    }

    console.log(`✗ ${org.commonName} (wiki: ${org.wikiTitle}, sci: ${org.scientificName}) — NO IMAGE`)
    missing.push(org)

    await new Promise(r => setTimeout(r, 100))
  }

  console.log('\n--- Summary ---')
  if (missing.length === 0) {
    console.log('All organisms have images!')
  } else {
    console.log(`${missing.length} organisms missing images:`)
    for (const org of missing) {
      console.log(`  - ${org.commonName} (${org.scientificName}) [wiki: ${org.wikiTitle}] [group: ${org.group}]`)
    }
  }
}

main()
