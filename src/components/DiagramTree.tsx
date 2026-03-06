import type { DiagramNode } from '../data/surprisingFacts.ts'

interface LayoutNode {
  label: string
  highlight: boolean
  x: number
  y: number
  isLeaf: boolean
  children: LayoutNode[]
}

function countLeaves(node: DiagramNode): number {
  if (!node.children || node.children.length === 0) {
    return 1
  }
  let count = 0
  for (const child of node.children) {
    count += countLeaves(child)
  }
  return count
}

function getMaxDepth(node: DiagramNode): number {
  if (!node.children || node.children.length === 0) {
    return 0
  }
  let max = 0
  for (const child of node.children) {
    const d = getMaxDepth(child)
    if (d > max) {
      max = d
    }
  }
  return max + 1
}

function layoutTree(
  node: DiagramNode,
  depth: number,
  startRow: number,
  depthStep: number,
  rowHeight: number,
) {
  const x = depth * depthStep
  const isLeaf = !node.children || node.children.length === 0

  if (isLeaf) {
    return {
      label: node.label,
      highlight: node.highlight ?? false,
      x,
      y: startRow * rowHeight,
      isLeaf: true,
      children: [],
    } satisfies LayoutNode
  }

  const children: LayoutNode[] = []
  let currentRow = startRow
  for (const child of node.children!) {
    const leaves = countLeaves(child)
    children.push(
      layoutTree(child, depth + 1, currentRow, depthStep, rowHeight),
    )
    currentRow += leaves
  }

  const firstChild = children[0]
  const lastChild = children[children.length - 1]
  const y = (firstChild.y + lastChild.y) / 2

  return {
    label: node.label,
    highlight: node.highlight ?? false,
    x,
    y,
    isLeaf: false,
    children,
  } satisfies LayoutNode
}

function renderNode(
  node: LayoutNode,
  elements: preact.JSX.Element[],
  leafX: number,
  isRoot: boolean,
) {
  const lineColor = node.highlight ? 'var(--accent-tree)' : 'GrayText'

  if (node.children.length > 0) {
    const firstChild = node.children[0]
    const lastChild = node.children[node.children.length - 1]

    // vertical span line at this node's x
    elements.push(
      <line
        key={`v-${node.x}-${node.y}`}
        x1={node.x}
        y1={firstChild.y}
        x2={node.x}
        y2={lastChild.y}
        stroke={lineColor}
        strokeWidth={2.5}
      />,
    )

    // label on the vertical line (above the top child)
    if (!isRoot) {
      elements.push(
        <text
          key={`t-${node.x}-${node.y}`}
          x={node.x + 5}
          y={firstChild.y - 10}
          fontSize={11}
          fill={node.highlight ? 'var(--accent-tree)' : 'GrayText'}
          fontStyle="italic"
        >
          {node.label}
        </text>,
      )
    } else {
      // root label goes to the left of the vertical line
      elements.push(
        <text
          key={`t-${node.x}-${node.y}`}
          x={node.x - 6}
          y={node.y + 4}
          fontSize={11}
          fill={node.highlight ? 'var(--accent-tree)' : 'GrayText'}
          fontStyle="italic"
          textAnchor="end"
        >
          {node.label}
        </text>,
      )
    }

    for (const child of node.children) {
      const childColor = child.highlight ? 'var(--accent-tree)' : 'GrayText'

      // horizontal line from this node's x to child's x
      elements.push(
        <line
          key={`h-${node.x}-${child.y}`}
          x1={node.x}
          y1={child.y}
          x2={child.x}
          y2={child.y}
          stroke={childColor}
          strokeWidth={2.5}
        />,
      )

      renderNode(child, elements, leafX, false)
    }
  } else {
    // leaf: extend horizontal line to common leafX, add dot and label
    elements.push(
      <line
        key={`lh-${node.x}-${node.y}`}
        x1={node.x}
        y1={node.y}
        x2={leafX}
        y2={node.y}
        stroke={node.highlight ? 'var(--accent-tree)' : 'GrayText'}
        strokeWidth={2.5}
      />,
    )
    elements.push(
      <circle
        key={`c-${node.x}-${node.y}`}
        cx={leafX}
        cy={node.y}
        r={3.5}
        fill={node.highlight ? 'var(--accent-tree)' : 'GrayText'}
      />,
    )
    elements.push(
      <text
        key={`t-${node.x}-${node.y}`}
        x={leafX + 10}
        y={node.y + 4}
        fontSize={12}
        fill="currentColor"
        fontWeight={node.highlight ? 'bold' : 'normal'}
      >
        {node.label}
      </text>,
    )
  }
}

export default function DiagramTree({ root }: { root: DiagramNode }) {
  const rowHeight = 55
  const depthStep = 100
  const totalLeaves = countLeaves(root)
  const maxDepth = getMaxDepth(root)
  const layout = layoutTree(root, 0, 0, depthStep, rowHeight)

  const leafX = maxDepth * depthStep
  const elements: preact.JSX.Element[] = []
  renderNode(layout, elements, leafX, true)

  const w = leafX + 240
  const h = totalLeaves * rowHeight

  return (
    <svg
      viewBox={`-10 -22 ${w} ${h + 12}`}
      className="phylo-tree diagram-tree-svg"
    >
      {elements}
    </svg>
  )
}
