export async function fetchWikipediaAbstract(title: string) {
  const response = await fetch(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
  )
  if (!response.ok) {
    return null
  }
  const data: unknown = await response.json()
  return data && typeof data === 'object' && 'extract' in data && typeof data.extract === 'string'
    ? data.extract
    : null
}
