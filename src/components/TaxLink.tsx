import { ncbiTaxonomyUrl, wikipediaUrl } from '../utils/links.ts'

export function TaxLink({ name, taxId }: { name: string; taxId: number }) {
  return (
    <span className="breadcrumb-link">
      <a href={wikipediaUrl(name)} target="_blank" rel="noopener noreferrer">
        {name}
      </a>
      {taxId > 0 && (
        <>
          {' '}
          <a
            className="breadcrumb-secondary-link"
            href={ncbiTaxonomyUrl(taxId)}
            target="_blank"
            rel="noopener noreferrer"
          >
            ncbi
          </a>
        </>
      )}
    </span>
  )
}
