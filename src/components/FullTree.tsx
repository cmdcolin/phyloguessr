import { cluster, hierarchy } from 'd3-hierarchy'

import {
  buildTreeFromLineages,
  collapseSingleChildren,
  countLeaves,
  getMaxDepth,
} from '../utils/taxonomy.ts'

import type { Organism } from '../data/organisms.ts'
import type { TaxonomyData, TreeNode } from '../utils/taxonomy.ts'

interface FullTreeProps {
  organisms: [Organism, Organism, Organism]
  taxonomyData: TaxonomyData
  organismColors: Record<number, string>
}

function formatRank(rank: string) {
  if (rank === 'no rank' || rank === 'no rank - terminal') {
    return ''
  }
  return rank
}

export default function FullTree({
  organisms,
  taxonomyData,
  organismColors,
}: FullTreeProps) {
  const rawTree = buildTreeFromLineages(organisms, {}, undefined, taxonomyData)

  const orgTaxIds = new Set(organisms.map(o => o.ncbiTaxId))
  const tree = collapseSingleChildren(rawTree, orgTaxIds)
  const orgNames = new Map(organisms.map(o => [o.ncbiTaxId, o.commonName]))

  const numLeaves = countLeaves(tree)
  const rowHeight = 55
  const leftMargin = 60
  const rightMargin = 200
  const topPad = 20

  const h = numLeaves * rowHeight + topPad * 2
  const maxDepth = getMaxDepth(tree)
  const depthStep = Math.min(100, (400 - leftMargin) / Math.max(maxDepth, 1))
  const leafX = leftMargin + maxDepth * depthStep
  const w = leafX + rightMargin

  const root = hierarchy(tree, n =>
    n.children.length > 0 ? n.children : undefined,
  )

  const clusterLayout = cluster<TreeNode>()
    .size([h - topPad * 2, leafX - leftMargin])
    .separation(() => 1)

  clusterLayout(root)

  const elements: preact.JSX.Element[] = []

  root.each(node => {
    const x = (node.y ?? 0) + leftMargin
    const y = (node.x ?? 0) + topPad
    const isLeaf = !node.children
    const isOrganism = orgTaxIds.has(node.data.taxId)
    const color = isOrganism
      ? (organismColors[node.data.taxId] ?? 'var(--accent-tree)')
      : 'var(--accent-tree)'

    // draw links to children
    if (node.children) {
      const childYs = node.children.map(c => (c.x ?? 0) + topPad)
      const minChildY = Math.min(...childYs)
      const maxChildY = Math.max(...childYs)

      // vertical span
      elements.push(
        <line
          key={`v-${node.data.taxId}`}
          x1={x}
          y1={minChildY}
          x2={x}
          y2={maxChildY}
          stroke="var(--accent-tree)"
          strokeWidth={2.5}
        />,
      )

      // horizontal to each child
      for (const child of node.children) {
        const cx = (child.y ?? 0) + leftMargin
        const cy = (child.x ?? 0) + topPad
        const childIsOrg = orgTaxIds.has(child.data.taxId)
        const childColor = childIsOrg
          ? (organismColors[child.data.taxId] ?? 'var(--accent-tree)')
          : 'var(--accent-tree)'

        elements.push(
          <line
            key={`h-${node.data.taxId}-${child.data.taxId}`}
            x1={x}
            y1={cy}
            x2={cx}
            y2={cy}
            stroke={child.children ? 'var(--accent-tree)' : childColor}
            strokeWidth={2.5}
          />,
        )
      }

      // only label actual branching points (2+ children)
      if (node.children.length >= 2) {
        const rank = formatRank(node.data.rank)
        const labelParts = []
        if (node.data.label !== 'root') {
          labelParts.push(node.data.label)
        }
        if (rank) {
          labelParts.push(`(${rank})`)
        }
        const labelText = labelParts.join(' ')
        if (labelText) {
          elements.push(
            <text
              key={`t-${node.data.taxId}`}
              x={x + 4}
              y={minChildY - 6}
              fontSize={10}
              fill="var(--accent-tree)"
              fontStyle="italic"
            >
              {labelText}
            </text>,
          )
        }
      }
    }

    // leaf rendering
    if (isLeaf) {
      // extend to common leaf X
      elements.push(
        <line
          key={`ext-${node.data.taxId}`}
          x1={x}
          y1={y}
          x2={leafX}
          y2={y}
          stroke={color}
          strokeWidth={2.5}
        />,
      )

      elements.push(
        <circle
          key={`c-${node.data.taxId}`}
          cx={leafX}
          cy={y}
          r={3.5}
          fill={color}
        />,
      )

      const displayName = isOrganism
        ? (orgNames.get(node.data.taxId) ?? node.data.label)
        : node.data.label

      elements.push(
        <text
          key={`lt-${node.data.taxId}`}
          x={leafX + 10}
          y={y + 4}
          fontSize={12}
          fill="currentColor"
          fontWeight={isOrganism ? 'bold' : 'normal'}
        >
          {displayName}
        </text>,
      )
    }
  })

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="phylo-tree diagram-tree-svg">
      {elements}
    </svg>
  )
}

