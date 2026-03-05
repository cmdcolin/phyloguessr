import { useState } from 'react'
import { hierarchy, cluster } from 'd3-hierarchy'
import { linkRadial } from 'd3-shape'
import type { HierarchyPointNode } from 'd3-hierarchy'
import type { Organism } from '../data/organisms.ts'
import { buildTreeFromLineages } from '../utils/taxonomy.ts'
import type { TreeNode, TaxonomyData } from '../utils/taxonomy.ts'

interface FullTreeProps {
  organisms: Organism[]
  taxonomyData?: TaxonomyData | null
  onClose: () => void
}

type LayoutMode = 'linear' | 'radial'

function getLeafData(node: TreeNode, orgMap: Map<number, Organism>) {
  const org = orgMap.get(node.taxId)
  if (org) {
    return { commonName: org.commonName, scientificName: org.scientificName }
  }
  return { commonName: node.label }
}

function projectRadial(x: number, y: number) {
  return [y * Math.sin(x), -y * Math.cos(x)] as const
}

function renderLinear(root: HierarchyPointNode<TreeNode>, orgMap: Map<number, Organism>) {
  const edges: React.ReactNode[] = []
  const nodes: React.ReactNode[] = []

  root.each((node, i) => {
    if (node.children) {
      for (let ci = 0; ci < node.children.length; ci++) {
        const child = node.children[ci]
        edges.push(
          <g key={`e-${i}-${ci}`}>
            <line x1={node.y} y1={node.x} x2={node.y} y2={child.x} stroke="#999" strokeWidth={1.5} />
            <line x1={node.y} y1={child.x} x2={child.y} y2={child.x} stroke="#999" strokeWidth={1.5} />
          </g>,
        )
      }
    }
    if (!node.children || node.children.length === 0) {
      const leaf = getLeafData(node.data, orgMap)
      nodes.push(
        <g key={`n-${i}`}>
          <circle cx={node.y} cy={node.x} r={3} fill="#2a7a2a" />
          <text x={node.y + 8} y={node.x + 4} fontSize={12} fontWeight="600" fill="currentColor">
            {leaf.commonName}
          </text>
          {leaf.scientificName && (
            <text x={node.y + 8} y={node.x + 16} fontSize={9} fill="GrayText" fontStyle="italic">
              {leaf.scientificName}
            </text>
          )}
        </g>,
      )
    }
  })

  return (
    <>
      {edges}
      {nodes}
    </>
  )
}

function renderRadial(root: HierarchyPointNode<TreeNode>, orgMap: Map<number, Organism>) {
  const edges: React.ReactNode[] = []
  const nodes: React.ReactNode[] = []

  const radialLink = linkRadial<
    { source: HierarchyPointNode<TreeNode>; target: HierarchyPointNode<TreeNode> },
    HierarchyPointNode<TreeNode>
  >()
    .angle(d => d.x)
    .radius(d => d.y)

  root.each((node, i) => {
    if (node.children) {
      for (let ci = 0; ci < node.children.length; ci++) {
        const child = node.children[ci]
        const d = radialLink({ source: node, target: child })
        if (d) {
          edges.push(<path key={`e-${i}-${ci}`} d={d} fill="none" stroke="#999" strokeWidth={1.5} />)
        }
      }
    }
    if (!node.children || node.children.length === 0) {
      const [cx, cy] = projectRadial(node.x, node.y)
      const leaf = getLeafData(node.data, orgMap)
      const angle = (node.x * 180) / Math.PI
      const flip = node.x > Math.PI
      const textAnchor = flip ? 'end' : 'start'
      const rotation = flip ? angle - 180 : angle

      nodes.push(
        <g key={`n-${i}`} transform={`translate(${cx},${cy})`}>
          <circle r={3} fill="#2a7a2a" />
          <g transform={`rotate(${rotation})`}>
            <text
              x={flip ? -8 : 8}
              y={4}
              fontSize={12}
              fontWeight="600"
              fill="currentColor"
              textAnchor={textAnchor}
            >
              {leaf.commonName}
            </text>
            {leaf.scientificName && (
              <text
                x={flip ? -8 : 8}
                y={16}
                fontSize={9}
                fill="GrayText"
                fontStyle="italic"
                textAnchor={textAnchor}
              >
                {leaf.scientificName}
              </text>
            )}
          </g>
        </g>,
      )
    }
  })

  return (
    <>
      {edges}
      {nodes}
    </>
  )
}

export default function FullTree({ organisms, taxonomyData, onClose }: FullTreeProps) {
  const [mode, setMode] = useState<LayoutMode>('linear')
  const orgMap = new Map(organisms.map(o => [o.ncbiTaxId, o]))
  const tree = buildTreeFromLineages(organisms, {}, undefined, taxonomyData ?? undefined)

  const root = hierarchy(tree, n => (n.children.length > 0 ? n.children : undefined))
  const leafCount = root.leaves().length
  const padding = 30
  const labelSpace = 200

  let svgW: number
  let svgH: number
  let translateX: number
  let translateY: number
  let content: React.ReactNode

  if (mode === 'linear') {
    const rowH = 40
    svgH = leafCount * rowH + padding * 2
    const depth = root.height
    const depthStep = 60
    const treeWidth = (depth + 1) * depthStep
    svgW = padding + treeWidth + labelSpace

    const laid = cluster<TreeNode>().size([svgH - padding * 2, treeWidth])(root)
    translateX = padding
    translateY = padding
    content = renderLinear(laid, orgMap)
  } else {
    const radius = Math.max(leafCount * 20, 200)
    const svgSize = (radius + labelSpace) * 2
    svgW = svgSize
    svgH = svgSize
    translateX = svgSize / 2
    translateY = svgSize / 2

    const laid = cluster<TreeNode>().size([2 * Math.PI, radius])(root)
    content = renderRadial(laid, orgMap)
  }

  return (
    <div className="full-tree-overlay">
      <div className="full-tree-panel">
        <div className="full-tree-header">
          <h2>Your species tree ({organisms.length} species)</h2>
          <div className="tree-header-controls">
            <div className="tree-layout-toggle">
              <button
                className={`mode-btn ${mode === 'linear' ? 'active' : ''}`}
                onClick={() => setMode('linear')}
              >
                Linear
              </button>
              <button
                className={`mode-btn ${mode === 'radial' ? 'active' : ''}`}
                onClick={() => setMode('radial')}
              >
                Radial
              </button>
            </div>
            <button className="close-btn" onClick={onClose}>Close</button>
          </div>
        </div>
        <div className="full-tree-scroll">
          <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`}>
            <g transform={`translate(${translateX},${translateY})`}>
              {content}
            </g>
          </svg>
        </div>
      </div>
    </div>
  )
}
