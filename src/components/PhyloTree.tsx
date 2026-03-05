import type { Organism } from '../data/organisms.ts'

interface PhyloTreeProps {
  sister1: Organism
  sister2: Organism
  outgroup: Organism
  cladeLabel?: string
}

export default function PhyloTree({
  sister1,
  sister2,
  outgroup,
  cladeLabel,
}: PhyloTreeProps) {
  const w = 500
  const h = 260
  const leftMargin = 60
  const rightMargin = 180
  const topPad = 40
  const rowH = 70

  // y positions for the three leaves
  const y1 = topPad
  const y2 = topPad + rowH
  const y3 = topPad + rowH * 2

  // x positions
  const rootX = leftMargin
  const innerX = leftMargin + 100
  const leafX = w - rightMargin

  // inner node y = midpoint of sister pair
  const innerY = (y1 + y2) / 2

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="phylo-tree">
      {/* Root to inner node */}
      <line x1={rootX} y1={innerY + (y3 - innerY) / 2} x2={rootX} y2={innerY} stroke="#666" strokeWidth={2} />
      <line x1={rootX} y1={innerY} x2={innerX} y2={innerY} stroke="#4a9" strokeWidth={3} />

      {/* Inner node to sister1 */}
      <line x1={innerX} y1={innerY} x2={innerX} y2={y1} stroke="#4a9" strokeWidth={3} />
      <line x1={innerX} y1={y1} x2={leafX} y2={y1} stroke="#4a9" strokeWidth={3} />

      {/* Inner node to sister2 */}
      <line x1={innerX} y1={innerY} x2={innerX} y2={y2} stroke="#4a9" strokeWidth={3} />
      <line x1={innerX} y1={y2} x2={leafX} y2={y2} stroke="#4a9" strokeWidth={3} />

      {/* Root to outgroup */}
      <line x1={rootX} y1={innerY + (y3 - innerY) / 2} x2={rootX} y2={y3} stroke="#666" strokeWidth={2} />
      <line x1={rootX} y1={y3} x2={leafX} y2={y3} stroke="#666" strokeWidth={2} />

      {/* Root vertical line */}
      <line x1={rootX - 20} y1={innerY + (y3 - innerY) / 2} x2={rootX} y2={innerY + (y3 - innerY) / 2} stroke="#666" strokeWidth={2} />

      {/* Clade label */}
      {cladeLabel && (
        <text x={innerX + 4} y={innerY - 8} fontSize={11} fill="var(--accent-tree)" fontStyle="italic">
          {cladeLabel}
        </text>
      )}

      {/* Leaf labels */}
      <a href={`https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=${sister1.ncbiTaxId}`} target="_blank" rel="noopener noreferrer">
        <text x={leafX + 8} y={y1 + 4} fontSize={13} fontWeight="bold" fill="currentColor">
          {sister1.commonName}
        </text>
        <text x={leafX + 8} y={y1 + 18} fontSize={10} fill="GrayText" fontStyle="italic">
          {sister1.scientificName}
        </text>
      </a>

      <a href={`https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=${sister2.ncbiTaxId}`} target="_blank" rel="noopener noreferrer">
        <text x={leafX + 8} y={y2 + 4} fontSize={13} fontWeight="bold" fill="currentColor">
          {sister2.commonName}
        </text>
        <text x={leafX + 8} y={y2 + 18} fontSize={10} fill="GrayText" fontStyle="italic">
          {sister2.scientificName}
        </text>
      </a>

      <a href={`https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=${outgroup.ncbiTaxId}`} target="_blank" rel="noopener noreferrer">
        <text x={leafX + 8} y={y3 + 4} fontSize={13} fontWeight="bold" fill="currentColor">
          {outgroup.commonName}
        </text>
        <text x={leafX + 8} y={y3 + 18} fontSize={10} fill="GrayText" fontStyle="italic">
          {outgroup.scientificName}
        </text>
      </a>

      {/* Leaf dots */}
      <circle cx={leafX} cy={y1} r={4} fill="#4a9" />
      <circle cx={leafX} cy={y2} r={4} fill="#4a9" />
      <circle cx={leafX} cy={y3} r={4} fill="#666" />
    </svg>
  )
}
