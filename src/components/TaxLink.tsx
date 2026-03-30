export function TaxLink({ name, taxId }: { name: string; taxId: number }) {
  return (
    <span className="breadcrumb-link">
      <a
        href={`https://en.wikipedia.org/wiki/${encodeURIComponent(name)}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {name}
      </a>
      {taxId > 0 && (
        <>
          {' '}
          <a
            className="breadcrumb-secondary-link"
            href={`https://www.ncbi.nlm.nih.gov/datasets/taxonomy/${taxId}`}
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
