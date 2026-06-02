#!/usr/bin/env node

// Verifies that each curated organism's NCBI tax ID matches
// its scientific name by checking the NCBI taxonomy API.

import { loadCuratedOrganisms } from './lib/organisms.mjs'

const entries = loadCuratedOrganisms().map(o => ({
  commonName: o.commonName,
  scientificName: o.scientificName,
  taxId: o.ncbiTaxId,
}))

const DELAY_MS = 400

async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url)
      if (res.ok) {
        return res
      }
    } catch {
      if (i < retries - 1) {
        await new Promise(r => setTimeout(r, 2000))
      }
    }
  }
  return null
}

async function checkTaxId(taxId, expectedName) {
  const url = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=taxonomy&id=${taxId}&retmode=xml`
  const res = await fetchWithRetry(url)
  if (!res) {
    return { status: 'ERROR', detail: 'fetch failed' }
  }
  const xml = await res.text()
  const nameMatch = xml.match(/<ScientificName>([^<]+)<\/ScientificName>/)
  if (!nameMatch) {
    return { status: 'NOT_FOUND', detail: 'no name in response' }
  }
  const actualName = nameMatch[1]
  if (actualName.toLowerCase() === expectedName.toLowerCase()) {
    return { status: 'OK', detail: actualName }
  }
  return {
    status: 'MISMATCH',
    detail: `expected "${expectedName}", got "${actualName}"`,
  }
}

async function main() {
  console.log(`Verifying ${entries.length} organisms...`)
  let ok = 0
  let bad = 0

  for (const { commonName, scientificName, taxId } of entries) {
    const result = await checkTaxId(taxId, scientificName)
    if (result.status === 'OK') {
      ok++
    } else {
      console.log(
        `  ${result.status}: ${commonName} (taxId ${taxId}) — ${result.detail}`,
      )
      bad++
    }
    await new Promise(r => setTimeout(r, DELAY_MS))
  }

  console.log(`\n${ok} OK, ${bad} problems`)
  if (bad > 0) {
    process.exit(1)
  }
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
