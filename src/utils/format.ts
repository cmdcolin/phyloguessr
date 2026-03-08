export function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(' ')
}

export function capitalize(s: string) {
  return s[0].toUpperCase() + s.slice(1)
}

export function formatRank(rank: string) {
  if (rank === 'no rank' || rank === 'no rank - terminal') {
    return 'group'
  }
  return rank
}

// Convert full-size Wikimedia Commons URLs to thumbnail URLs to reduce bandwidth.
// Cards display at max 200px wide (400px for 2x retina).
// Full-size URLs look like: .../commons/a/ab/File.jpg
// Thumb URLs look like:     .../commons/thumb/a/ab/File.jpg/400px-File.jpg
const COMMONS_FULL_RE =
  /^(https:\/\/upload\.wikimedia\.org\/wikipedia\/commons)\/(\w\/\w\w)\/([^/?#]+)$/
const THUMB_WIDTH = 400

export function toWikimediaThumbnail(url: string) {
  const m = url.match(COMMONS_FULL_RE)
  if (m) {
    const [, base, hashPath, filename] = m
    return `${base}/thumb/${hashPath}/${filename}/${THUMB_WIDTH}px-${filename}`
  }
  return url
}

export interface MrcaInfo {
  taxId: number
  name: string
  rank: string
}
