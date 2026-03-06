import { capitalize } from "../utils/format.ts";

import type { Organism } from "../data/organisms.ts";

interface PhyloTreeProps {
  sister1: Organism;
  sister2: Organism;
  outgroup: Organism;
  cladeLabel?: string;
  images: Record<number, string | null>;
  userSelectedTaxIds: Set<number>;
  organismColors?: Record<number, string>;
}

export default function PhyloTree({
  sister1,
  sister2,
  outgroup,
  cladeLabel,
  images,
  userSelectedTaxIds,
  organismColors,
}: PhyloTreeProps) {
  const imgSize = 40;
  const w = 560;
  const h = 220;
  const leftMargin = 60;
  const rightMargin = 230;
  const topPad = 35;
  const rowH = 65;

  // y positions for the three leaves
  const y1 = topPad;
  const y2 = topPad + rowH;
  const y3 = topPad + rowH * 2;

  // x positions
  const rootX = leftMargin;
  const innerX = leftMargin + 100;
  const leafX = w - rightMargin;

  // inner node y = midpoint of sister pair
  const innerY = (y1 + y2) / 2;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="phylo-tree">
      <defs>
        {[sister1, sister2, outgroup].map((org) => (
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
        stroke="GrayText"
        strokeWidth={2}
      />
      <line
        x1={rootX}
        y1={innerY}
        x2={innerX}
        y2={innerY}
        stroke="var(--accent-tree)"
        strokeWidth={3}
      />

      {/* Inner node to sister1 */}
      <line
        x1={innerX}
        y1={innerY}
        x2={innerX}
        y2={y1}
        stroke="var(--accent-tree)"
        strokeWidth={3}
      />
      <line
        x1={innerX}
        y1={y1}
        x2={leafX}
        y2={y1}
        stroke="var(--accent-tree)"
        strokeWidth={3}
      />

      {/* Inner node to sister2 */}
      <line
        x1={innerX}
        y1={innerY}
        x2={innerX}
        y2={y2}
        stroke="var(--accent-tree)"
        strokeWidth={3}
      />
      <line
        x1={innerX}
        y1={y2}
        x2={leafX}
        y2={y2}
        stroke="var(--accent-tree)"
        strokeWidth={3}
      />

      {/* Root to outgroup */}
      <line
        x1={rootX}
        y1={innerY + (y3 - innerY) / 2}
        x2={rootX}
        y2={y3}
        stroke="GrayText"
        strokeWidth={2}
      />
      <line
        x1={rootX}
        y1={y3}
        x2={leafX}
        y2={y3}
        stroke="GrayText"
        strokeWidth={2}
      />

      {/* Root vertical line */}
      <line
        x1={rootX - 20}
        y1={innerY + (y3 - innerY) / 2}
        x2={rootX}
        y2={innerY + (y3 - innerY) / 2}
        stroke="GrayText"
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
        const imgUrl = images[org.ncbiTaxId];
        const textX = leafX + 8 + (imgUrl ? imgSize + 6 : 0);
        return (
          <g key={org.ncbiTaxId}>
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
              {capitalize(org.commonName)}
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
            <text x={textX} y={y + 31} fontSize={11} fill="GrayText">
              {"("}
              <a
                href={`https://en.wikipedia.org/wiki/${org.scientificName}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <tspan fill="var(--accent-tree)">wiki</tspan>
              </a>
              {", "}
              <a
                href={`https://www.ncbi.nlm.nih.gov/datasets/taxonomy/${org.ncbiTaxId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <tspan fill="var(--accent-tree)">ncbi</tspan>
              </a>
              {")"}
            </text>
          </g>
        );
      })}

      {/* Leaf dots */}
      <circle cx={leafX} cy={y1} r={4} fill={organismColors?.[sister1.ncbiTaxId] ?? "var(--accent-tree)"} />
      <circle cx={leafX} cy={y2} r={4} fill={organismColors?.[sister2.ncbiTaxId] ?? "var(--accent-tree)"} />
      <circle cx={leafX} cy={y3} r={4} fill={organismColors?.[outgroup.ncbiTaxId] ?? "GrayText"} />

      {/* User selection arrows */}
      {[
        { org: sister1, y: y1 },
        { org: sister2, y: y2 },
        { org: outgroup, y: y3 },
      ].map(({ org, y }) => {
        if (!userSelectedTaxIds.has(org.ncbiTaxId)) {
          return null;
        }
        const arrowY = y + 16;
        const arrowBase = leafX - 16;
        const arrowTip = leafX - 6;
        const color = organismColors?.[org.ncbiTaxId] ?? "white";
        return (
          <g key={`arrow-${org.ncbiTaxId}`}>
            <text
              x={arrowBase - 3}
              y={arrowY + 3.5}
              fontSize={9}
              fill={color}
              fontWeight="bold"
              textAnchor="end"
            >
              you
            </text>
            <polygon
              points={`${arrowBase},${arrowY - 5} ${arrowBase},${arrowY + 5} ${arrowTip},${arrowY}`}
              fill={color}
              opacity={0.85}
            />
          </g>
        );
      })}
    </svg>
  );
}
