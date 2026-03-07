import { organisms } from '../src/data/organisms.ts'
import { readFileSync, writeFileSync } from 'fs'

type SpeciesPoolEntry = [number, string, string, string?]

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

const BATCH_SIZE = 5

// --- Update organisms.ts ---

const imageMap = new Map<string, string>()

console.log(`Fetching images for ${organisms.length} organisms...\n`)

for (let i = 0; i < organisms.length; i += BATCH_SIZE) {
  const batch = organisms.slice(i, i + BATCH_SIZE)
  const batchResults = await Promise.all(
    batch.map(async org => {
      const url = await getWikiThumbnail(org.wikiTitle)
      return { org, url }
    }),
  )
  for (const r of batchResults) {
    const icon = r.url ? '✓' : '✗'
    console.log(`${icon} ${r.org.commonName}`)
    if (r.url) {
      imageMap.set(r.org.commonName, r.url)
    }
  }
  if (i + BATCH_SIZE < organisms.length) {
    await new Promise(r => setTimeout(r, 200))
  }
}

const src = readFileSync('src/data/organisms.ts', 'utf-8')
const lines = src.split('\n')
const output: string[] = []
let i = 0

while (i < lines.length) {
  const line = lines[i]
  const nameMatch = line.match(
    /commonName:\s*(?:"([^"]+)"|'([^']+)'|`([^`]+)`)/,
  )

  if (nameMatch) {
    const name = nameMatch[1] ?? nameMatch[2] ?? nameMatch[3]
    const url = imageMap.get(name)

    const blockLines: string[] = [line]
    i++
    while (i < lines.length && !lines[i].match(/^\s*\},?/)) {
      if (!lines[i].match(/^\s*imageUrl:/)) {
        blockLines.push(lines[i])
      }
      i++
    }
    const groupIdx = blockLines.findLastIndex(l => l.match(/^\s*group:/))
    if (url && groupIdx >= 0) {
      const indent = blockLines[groupIdx].match(/^(\s*)/)?.[1] ?? '    '
      blockLines.splice(groupIdx + 1, 0, `${indent}imageUrl: '${url}',`)
    }
    for (const bl of blockLines) {
      output.push(bl)
    }
    output.push(lines[i])
    i++
    continue
  }

  output.push(line)
  i++
}

writeFileSync('src/data/organisms.ts', output.join('\n'))

const orgMissing = organisms.length - imageMap.size
console.log(
  `\nOrganisms: ${imageMap.size} with images, ${orgMissing} missing\n`,
)

// --- Update species-pool.json ---

if (process.argv.includes('--pool')) {
  const pool: SpeciesPoolEntry[] = JSON.parse(
    readFileSync('dist/taxonomy/species-pool.json', 'utf-8'),
  )

  console.log(`Fetching images for ${pool.length} species pool entries...\n`)

  let poolUpdated = 0
  let poolMissing = 0

  for (let j = 0; j < pool.length; j += BATCH_SIZE) {
    const batch = pool.slice(j, j + BATCH_SIZE)
    const batchResults = await Promise.all(
      batch.map(async (entry, idx) => {
        const [, , scientificName] = entry
        const wikiTitle = scientificName.replace(/ /g, '_')
        const url = await getWikiThumbnail(wikiTitle)
        return { index: j + idx, url }
      }),
    )
    for (const r of batchResults) {
      const entry = pool[r.index]
      const icon = r.url ? '✓' : '✗'
      console.log(`${icon} ${entry[1]} (${entry[2]})`)
      if (r.url) {
        entry[3] = r.url
        poolUpdated++
      } else {
        entry[3] = undefined
        poolMissing++
      }
    }
    if (j + BATCH_SIZE < pool.length) {
      await new Promise(r => setTimeout(r, 200))
    }
  }

  const cleaned = pool.map(e => (e[3] ? e : e.slice(0, 3)))
  writeFileSync(
    'dist/taxonomy/species-pool.json',
    JSON.stringify(cleaned),
  )

  console.log(
    `\nSpecies pool: ${poolUpdated} with images, ${poolMissing} missing`,
  )
}

console.log('\nDone.')
