export async function fetchWikipediaAbstract(title: string) {
  const response = await fetch(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
  )
  if (!response.ok) {
    return null
  }
  const data = await response.json()
  return (data.extract as string) ?? null
}
