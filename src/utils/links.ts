export function wikipediaUrl(name: string) {
  return `https://en.wikipedia.org/wiki/${encodeURIComponent(name)}`
}

export function ncbiTaxonomyUrl(taxId: number) {
  return `https://www.ncbi.nlm.nih.gov/datasets/taxonomy/${taxId}`
}
