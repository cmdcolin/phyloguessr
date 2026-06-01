// Shared helpers for fetching Wikipedia thumbnail images and rate-limited
// batched processing. Used by embed-organism-images, fix-scenario-images,
// and (for the URL check) validate-pool-images.

export function isWikipediaUrl(url) {
  return typeof url === 'string' && url.includes('upload.wikimedia.org')
}

export async function fetchWikipediaThumbnail(wikiTitle) {
  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wikiTitle)}`,
    )
    if (!res.ok) {
      return null
    }
    const data = await res.json()
    return data.thumbnail?.source ?? null
  } catch {
    return null
  }
}

// Runs `fn` over `items` in batches of `concurrency`, waiting `delayMs`
// between batches. Returns a Map keyed by `keyOf(item)`.
export async function mapWithConcurrency(
  items,
  fn,
  { concurrency, delayMs, keyOf },
) {
  const results = new Map()
  for (let i = 0; i < items.length; i += concurrency) {
    const batch = items.slice(i, i + concurrency)
    const values = await Promise.all(batch.map(item => fn(item)))
    batch.forEach((item, j) => results.set(keyOf(item), values[j]))
    if (i + concurrency < items.length) {
      await new Promise(r => setTimeout(r, delayMs))
    }
  }
  return results
}
