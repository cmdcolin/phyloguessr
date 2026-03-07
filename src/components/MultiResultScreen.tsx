import { cluster, hierarchy } from 'd3-hierarchy'

import Button from './Button.tsx'
import { LineageBreadcrumbs } from './Breadcrumbs.tsx'
import DiagramTree from './DiagramTree.tsx'
import { ShareButton } from './ShareButton.tsx'
import { MapToggle } from './MapToggle.tsx'
import { TaxLink } from './TaxLink.tsx'
import { capitalize, formatRank } from '../utils/format.ts'
import {
  buildTreeFromLineages,
  collapseSingleChildren,
  countLeaves,
  getMaxDepth,
  treeNodeToDiagramNode,
} from '../utils/taxonomy.ts'

import type { Organism } from '../data/organisms.ts'
import type { LcaResult, TaxonomyData, TreeNode } from '../utils/taxonomy.ts'

export interface PairRanking {
  i: number
  j: number
  taxIdA: number
  taxIdB: number
  lca: LcaResult
}

export interface MultiResultData {
  score: number
  rank: number
  totalPairs: number
  userPair: PairRanking
  bestPair: PairRanking
  allPairs: PairRanking[]
  organisms: Organism[]
}

interface MultiResultScreenProps {
  result: MultiResultData
  taxonomyData: TaxonomyData
  shareUrl: string
  onPlayAgain: () => void
}

function PairTable({
  allPairs,
  organisms,
  userPair,
}: {
  allPairs: PairRanking[]
  organisms: Organism[]
  userPair: PairRanking
}) {
  const byOrg = (taxId: number) => organisms.find(o => o.ncbiTaxId === taxId)

  return (
    <div className="multi-pair-table-wrapper">
      <table className="multi-pair-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Pair</th>
            <th>Common ancestor</th>
          </tr>
        </thead>
        <tbody>
          {allPairs.map((pair, idx) => {
            const isUser =
              pair.taxIdA === userPair.taxIdA && pair.taxIdB === userPair.taxIdB
            const orgA = byOrg(pair.taxIdA)
            const orgB = byOrg(pair.taxIdB)
            return (
              <tr
                key={`${pair.taxIdA}-${pair.taxIdB}`}
                className={isUser ? 'multi-pair-user' : ''}
              >
                <td className="multi-pair-rank">{idx + 1}</td>
                <td>
                  {capitalize(orgA?.commonName ?? '?')} &amp;{' '}
                  {capitalize(orgB?.commonName ?? '?')}
                </td>
                <td className="multi-pair-lca">
                  <TaxLink name={pair.lca.name} taxId={pair.lca.taxId} /> (
                  {formatRank(pair.lca.rank)})
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function MultiDiagramTree({
  organisms,
  taxonomyData,
  userSelectedTaxIds,
}: {
  organisms: Organism[]
  taxonomyData: TaxonomyData
  userSelectedTaxIds: Set<number>
}) {
  const rawTree = buildTreeFromLineages(organisms, {}, undefined, taxonomyData)
  const orgTaxIds = new Set(organisms.map(o => o.ncbiTaxId))
  const tree = collapseSingleChildren(rawTree, orgTaxIds)
  const orgNames = new Map(organisms.map(o => [o.ncbiTaxId, o.commonName]))
  const diagramRoot = treeNodeToDiagramNode(tree, orgNames, userSelectedTaxIds)
  return <DiagramTree root={diagramRoot} />
}

function MultiTree({
  organisms,
  taxonomyData,
  userSelectedTaxIds,
}: {
  organisms: Organism[]
  taxonomyData: TaxonomyData
  userSelectedTaxIds: Set<number>
}) {
  const rawTree = buildTreeFromLineages(organisms, {}, undefined, taxonomyData)
  const orgTaxIds = new Set(organisms.map(o => o.ncbiTaxId))
  const tree = collapseSingleChildren(rawTree, orgTaxIds)
  const orgNames = new Map(organisms.map(o => [o.ncbiTaxId, o.commonName]))

  const numLeaves = countLeaves(tree)
  const rowHeight = 50
  const leftMargin = 60
  const rightMargin = 200
  const topPad = 20
  const h = numLeaves * rowHeight + topPad * 2
  const maxDepth = getMaxDepth(tree)
  const depthStep = Math.min(100, (400 - leftMargin) / Math.max(maxDepth, 1))
  const leafX = leftMargin + maxDepth * depthStep
  const w = leafX + rightMargin

  const root = hierarchy(tree, (n: TreeNode) =>
    n.children.length > 0 ? n.children : undefined,
  )
  const clusterLayout = cluster<TreeNode>()
    .size([h - topPad * 2, leafX - leftMargin])
    .separation(() => 1)
  clusterLayout(root)

  const elements = []
  const nodes = root.descendants()

  for (const node of nodes) {
    const x = (node.y ?? 0) + leftMargin
    const y = (node.x ?? 0) + topPad
    const isLeaf = !node.children
    const isOrganism = orgTaxIds.has(node.data.taxId)

    if (node.children) {
      const childYs = node.children.map(c => (c.x ?? 0) + topPad)
      const minChildY = Math.min(...childYs)
      const maxChildY = Math.max(...childYs)

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

      for (const child of node.children) {
        const cx = (child.y ?? 0) + leftMargin
        const cy = (child.x ?? 0) + topPad

        elements.push(
          <line
            key={`h-${node.data.taxId}-${child.data.taxId}`}
            x1={x}
            y1={cy}
            x2={cx}
            y2={cy}
            stroke="var(--accent-tree)"
            strokeWidth={2.5}
          />,
        )
      }

      if (node.children.length >= 2) {
        const nodeRank =
          node.data.rank === 'no rank' ||
          node.data.rank === 'no rank - terminal'
            ? ''
            : node.data.rank
        const parts = []
        if (node.data.label !== 'root') {
          parts.push(node.data.label)
        }
        if (nodeRank) {
          parts.push(`(${nodeRank})`)
        }
        if (parts.length > 0) {
          elements.push(
            <text
              key={`t-${node.data.taxId}`}
              x={x + 4}
              y={minChildY - 6}
              fontSize={10}
              fill="var(--accent-tree)"
              fontStyle="italic"
            >
              {parts.join(' ')}
            </text>,
          )
        }
      }
    }

    if (isLeaf) {
      const isUserPick = userSelectedTaxIds.has(node.data.taxId)
      const leafColor = isUserPick ? 'white' : 'var(--accent-tree)'
      elements.push(
        <line
          key={`ext-${node.data.taxId}`}
          x1={x}
          y1={y}
          x2={leafX}
          y2={y}
          stroke={leafColor}
          strokeWidth={2.5}
        />,
      )
      elements.push(
        <circle
          key={`c-${node.data.taxId}`}
          cx={leafX}
          cy={y}
          r={3.5}
          fill={leafColor}
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
          {capitalize(displayName)}
        </text>,
      )
      if (isUserPick) {
        const arrowY = y + 16
        const arrowBase = leafX - 16
        const arrowTip = leafX - 6
        elements.push(
          <text
            key={`arrow-label-${node.data.taxId}`}
            x={arrowBase - 3}
            y={arrowY + 3.5}
            fontSize={9}
            fill="white"
            fontWeight="bold"
            textAnchor="end"
          >
            your pick
          </text>,
        )
        elements.push(
          <polygon
            key={`arrow-${node.data.taxId}`}
            points={`${arrowBase},${arrowY - 5} ${arrowBase},${arrowY + 5} ${arrowTip},${arrowY}`}
            fill="white"
            opacity={0.85}
          />,
        )
      }
    }
  }

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="phylo-tree diagram-tree-svg">
      {elements}
    </svg>
  )
}

export default function MultiResultScreen({
  result,
  taxonomyData,
  shareUrl,
  onPlayAgain,
}: MultiResultScreenProps) {
  const { score, rank, totalPairs, userPair, bestPair, organisms } = result
  const userOrgA = organisms.find(o => o.ncbiTaxId === userPair.taxIdA)!
  const userOrgB = organisms.find(o => o.ncbiTaxId === userPair.taxIdB)!
  const bestOrgA = organisms.find(o => o.ncbiTaxId === bestPair.taxIdA)!
  const bestOrgB = organisms.find(o => o.ncbiTaxId === bestPair.taxIdB)!

  return (
    <div className="result-screen">
      <div
        className={`result-banner ${rank === 1 ? 'correct' : score >= 50 ? 'debated' : 'wrong'}`}
      >
        {rank === 1 ? 'Perfect!' : `${score} points`}
        <ShareButton url={shareUrl} />
      </div>

      <div className="result-explanation">
        {rank === 1 ? (
          <p>
            You picked <strong>{capitalize(userOrgA.commonName)}</strong> &amp;{' '}
            <strong>{capitalize(userOrgB.commonName)}</strong> — the closest
            pair! They share a most recent common ancestor in{' '}
            <strong>
              <TaxLink name={bestPair.lca.name} taxId={bestPair.lca.taxId} />
            </strong>{' '}
            ({formatRank(bestPair.lca.rank)}).
          </p>
        ) : (
          <>
            <p>
              You picked <strong>{capitalize(userOrgA.commonName)}</strong>{' '}
              &amp; <strong>{capitalize(userOrgB.commonName)}</strong> (ranked #
              {rank} of {totalPairs} pairs). Their common ancestor is{' '}
              <strong>
                <TaxLink name={userPair.lca.name} taxId={userPair.lca.taxId} />
              </strong>{' '}
              ({formatRank(userPair.lca.rank)}). The closest pair was{' '}
              <strong>{capitalize(bestOrgA.commonName)}</strong> &amp;{' '}
              <strong>{capitalize(bestOrgB.commonName)}</strong>, sharing a
              common ancestor in{' '}
              <strong>
                <TaxLink name={bestPair.lca.name} taxId={bestPair.lca.taxId} />
              </strong>{' '}
              ({formatRank(bestPair.lca.rank)}).
            </p>
          </>
        )}
      </div>

      <div className="result-actions">
        <Button onClick={onPlayAgain}>Next</Button>
      </div>

      <MultiTree
        organisms={organisms}
        taxonomyData={taxonomyData}
        userSelectedTaxIds={new Set([userPair.taxIdA, userPair.taxIdB])}
      />

      <MultiDiagramTree
        organisms={organisms}
        taxonomyData={taxonomyData}
        userSelectedTaxIds={new Set([userPair.taxIdA, userPair.taxIdB])}
      />

      <details className="multi-pair-details">
        <summary>All {totalPairs} pair rankings</summary>
        <PairTable
          allPairs={result.allPairs}
          organisms={organisms}
          userPair={userPair}
        />
      </details>

      <MapToggle organisms={organisms} />

      <LineageBreadcrumbs
        organisms={organisms}
        taxonomyData={taxonomyData}
        userSelectedTaxIds={new Set([userPair.taxIdA, userPair.taxIdB])}
      />

      <div className="result-actions">
        <Button onClick={onPlayAgain}>Next</Button>
      </div>
      <a
        className="report-issue-link"
        href={`https://github.com/cmdcolin/phyloguessr/issues/new?title=${encodeURIComponent(`Issue with multi: ${organisms.map(o => o.commonName).join(', ')}`)}&body=${encodeURIComponent(`Organisms: ${organisms.map(o => `${o.commonName} (${o.scientificName})`).join(', ')}\n\nDescribe the issue:\n`)}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Report issue with this answer
      </a>
    </div>
  )
}
