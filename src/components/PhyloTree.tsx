import type { Organism } from '../data/organisms.ts'

interface PhyloTreeProps {
  sister1: Organism
  sister2: Organism
  outgroup: Organism
  cladeLabel?: string
  images: Record<number, string | null>
}

export default function PhyloTree({
  sister1,
  sister2,
  outgroup,
  cladeLabel,
  images,
}: PhyloTreeProps) {
  const imgSize = 40
  const w = 560
  const h = 280
  const leftMargin = 60
  const rightMargin = 230
  const topPad = 50
  const rowH = 80

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
      <defs>
        {[sister1, sister2, outgroup].map(org => (
          <clipPath key={org.ncbiTaxId} id={`clip-${org.ncbiTaxId}`}>
            <circle cx={0} cy={0} r={imgSize / 2} />
          </clipPath>
        ))}
      </defs>

      {/* Root to inner node */}
      <line
        x1={rootX}
        y1={innerY + (y3 - innerY) / 2}
        x2={rootX}
        y2={innerY}
        stroke="#666"
        strokeWidth={2}
      />
      <line
        x1={rootX}
        y1={innerY}
        x2={innerX}
        y2={innerY}
        stroke="#4a9"
        strokeWidth={3}
      />

      {/* Inner node to sister1 */}
      <line
        x1={innerX}
        y1={innerY}
        x2={innerX}
        y2={y1}
        stroke="#4a9"
        strokeWidth={3}
      />
      <line
        x1={innerX}
        y1={y1}
        x2={leafX}
        y2={y1}
        stroke="#4a9"
        strokeWidth={3}
      />

      {/* Inner node to sister2 */}
      <line
        x1={innerX}
        y1={innerY}
        x2={innerX}
        y2={y2}
        stroke="#4a9"
        strokeWidth={3}
      />
      <line
        x1={innerX}
        y1={y2}
        x2={leafX}
        y2={y2}
        stroke="#4a9"
        strokeWidth={3}
      />

      {/* Root to outgroup */}
      <line
        x1={rootX}
        y1={innerY + (y3 - innerY) / 2}
        x2={rootX}
        y2={y3}
        stroke="#666"
        strokeWidth={2}
      />
      <line
        x1={rootX}
        y1={y3}
        x2={leafX}
        y2={y3}
        stroke="#666"
        strokeWidth={2}
      />

      {/* Root vertical line */}
      <line
        x1={rootX - 20}
        y1={innerY + (y3 - innerY) / 2}
        x2={rootX}
        y2={innerY + (y3 - innerY) / 2}
        stroke="#666"
        strokeWidth={2}
      />

      {/* Clade label */}
      {cladeLabel && (
        <text
          x={innerX + 4}
          y={innerY - 8}
          fontSize={11}
          fill="var(--accent-tree)"
          fontStyle="italic"
        >
          {cladeLabel}
        </text>
      )}

      {/* Leaf images and labels */}
      {[
        { org: sister1, y: y1 },
        { org: sister2, y: y2 },
        { org: outgroup, y: y3 },
      ].map(({ org, y }) => {
        const imgUrl = images[org.ncbiTaxId]
        const textX = leafX + 8 + (imgUrl ? imgSize + 6 : 0)
        return (
          <a
            key={org.ncbiTaxId}
            href={`https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=${org.ncbiTaxId}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {imgUrl && (
              <g transform={`translate(${leafX + 8 + imgSize / 2}, ${y})`}>
                <image
                  href={imgUrl}
                  x={-imgSize / 2}
                  y={-imgSize / 2}
                  width={imgSize}
                  height={imgSize}
                  clipPath={`url(#clip-${org.ncbiTaxId})`}
                  preserveAspectRatio="xMidYMid slice"
                />
              </g>
            )}
            <text
              x={textX}
              y={y + 4}
              fontSize={13}
              fontWeight="bold"
              fill="currentColor"
            >
              {org.commonName}
            </text>
            <text
              x={textX}
              y={y + 18}
              fontSize={10}
              fill="GrayText"
              fontStyle="italic"
            >
              {org.scientificName}
            </text>
          </a>
        )
      })}

      {/* Leaf dots */}
      <circle cx={leafX} cy={y1} r={4} fill="#4a9" />
      <circle cx={leafX} cy={y2} r={4} fill="#4a9" />
      <circle cx={leafX} cy={y3} r={4} fill="#666" />
    </svg>
  )
}
