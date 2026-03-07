import { Fragment, useState } from 'react'
import { cluster, hierarchy } from 'd3-hierarchy'

import Button from './Button.tsx'
import SpeciesMap from './SpeciesMap.tsx'
import { capitalize } from '../utils/format.ts'
import {
  buildTreeFromLineages,
  getLineageFromParents,
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

function formatRank(rank: string) {
  if (rank === 'no rank' || rank === 'no rank - terminal') {
    return 'group'
  }
  return rank
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
  const byOrg = (taxId: number) =>
    organisms.find(o => o.ncbiTaxId === taxId)

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
              <tr key={`${pair.taxIdA}-${pair.taxIdB}`} className={isUser ? 'multi-pair-user' : ''}>
                <td className="multi-pair-rank">{idx + 1}</td>
                <td>
                  {capitalize(orgA?.commonName ?? '?')} &amp;{' '}
                  {capitalize(orgB?.commonName ?? '?')}
                </td>
                <td className="multi-pair-lca">
                  {pair.lca.name} ({formatRank(pair.lca.rank)})
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
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

  const elements: preact.JSX.Element[] = []

  root.each(node => {
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
          x1={x} y1={minChildY} x2={x} y2={maxChildY}
          stroke="var(--accent-tree)" strokeWidth={2.5}
        />,
      )

      for (const child of node.children) {
        const cx = (child.y ?? 0) + leftMargin
        const cy = (child.x ?? 0) + topPad

        elements.push(
          <line
            key={`h-${node.data.taxId}-${child.data.taxId}`}
            x1={x} y1={cy} x2={cx} y2={cy}
            stroke="var(--accent-tree)"
            strokeWidth={2.5}
          />,
        )
      }

      if (node.children.length >= 2) {
        const nodeRank = node.data.rank === 'no rank' || node.data.rank === 'no rank - terminal'
          ? '' : node.data.rank
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
              x={x + 4} y={minChildY - 6}
              fontSize={10} fill="var(--accent-tree)" fontStyle="italic"
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
          x1={x} y1={y} x2={leafX} y2={y}
          stroke={leafColor} strokeWidth={2.5}
        />,
      )
      elements.push(
        <circle
          key={`c-${node.data.taxId}`}
          cx={leafX} cy={y} r={3.5} fill={leafColor}
        />,
      )
      const displayName = isOrganism
        ? (orgNames.get(node.data.taxId) ?? node.data.label)
        : node.data.label
      elements.push(
        <text
          key={`lt-${node.data.taxId}`}
          x={leafX + 10} y={y + 4}
          fontSize={12} fill="currentColor"
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
            x={arrowBase - 3} y={arrowY + 3.5}
            fontSize={9} fill="white" fontWeight="bold" textAnchor="end"
          >
            your pick
          </text>,
        )
        elements.push(
          <polygon
            key={`arrow-${node.data.taxId}`}
            points={`${arrowBase},${arrowY - 5} ${arrowBase},${arrowY + 5} ${arrowTip},${arrowY}`}
            fill="white" opacity={0.85}
          />,
        )
      }
    }
  })

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="phylo-tree diagram-tree-svg">
      {elements}
    </svg>
  )
}

function countLeaves(node: TreeNode): number {
  if (node.children.length === 0) {
    return 1
  }
  let n = 0
  for (const c of node.children) {
    n += countLeaves(c)
  }
  return n
}

function getMaxDepth(node: TreeNode): number {
  if (node.children.length === 0) {
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

function collapseSingleChildren(
  node: TreeNode,
  orgTaxIds: Set<number>,
): TreeNode {
  const collapsed = node.children.map(c => collapseSingleChildren(c, orgTaxIds))
  if (collapsed.length === 1 && !orgTaxIds.has(node.taxId)) {
    return collapsed[0]
  }
  return { ...node, children: collapsed }
}

function MapToggle({ organisms }: { organisms: Organism[] }) {
  const [show, setShow] = useState(false)
  return (
    <div className="map-toggle">
      <button className="map-hint-link" onClick={() => setShow(s => !s)}>
        {show
          ? 'Hide species distribution map'
          : 'Show species distribution map (GBIF)'}
      </button>
      {show && <SpeciesMap organisms={organisms} />}
    </div>
  )
}

function MultiLineageBreadcrumbs({
  organisms,
  taxonomyData,
  userSelectedTaxIds,
}: {
  organisms: Organism[]
  taxonomyData: TaxonomyData
  userSelectedTaxIds: Set<number>
}) {
  const majorRanks = new Set([
    'domain', 'kingdom', 'phylum', 'class', 'order', 'family', 'genus', 'species',
  ])
  const lineages = organisms.map(o => {
    const lin = getLineageFromParents(o.ncbiTaxId, taxonomyData.parents)
    const steps: { taxId: number; name: string; rank: string }[] = []
    for (const id of lin) {
      const name = taxonomyData.names[String(id)]
      const rank = taxonomyData.ranks[String(id)]
      if (name) {
        steps.push({ taxId: id, name, rank: rank ?? 'no rank' })
      }
    }
    return steps.reverse()
  })

  const minLen = Math.min(...lineages.map(l => l.length))
  let commonLen = 0
  for (let i = 0; i < minLen; i++) {
    if (lineages.every(l => l[i].taxId === lineages[0][i].taxId)) {
      commonLen = i + 1
    } else {
      break
    }
  }

  let startIndex = 0
  for (let i = commonLen - 1; i >= 0; i--) {
    if (majorRanks.has(lineages[0][i].rank)) {
      startIndex = i
      break
    }
  }

  return (
    <div className="lineage-breadcrumbs">
      {organisms.map((org, idx) => {
        const allSteps = lineages[idx]
        const pinnedRanks = new Set(['domain', 'kingdom', 'phylum'])
        const pinned = allSteps.filter(s => pinnedRanks.has(s.rank))
        const tail = allSteps.slice(startIndex)
        const tailIds = new Set(tail.map(s => s.taxId))
        const pinnedOnly = pinned.filter(s => !tailIds.has(s.taxId))
        const hasGap = pinnedOnly.length > 0 && tail.length > 0

        const isUserPick = userSelectedTaxIds.has(org.ncbiTaxId)

        return (
          <Fragment key={org.ncbiTaxId}>
            <span className={`breadcrumb-label ${isUserPick ? 'breadcrumb-user-pick' : ''}`}>
              {capitalize(org.commonName)}
              {isUserPick && <span className="breadcrumb-pick-tag">your pick</span>}
            </span>
            <span className="breadcrumb-path">
              {pinnedOnly.map((step, i) => (
                <span key={step.taxId}>
                  {i > 0 && <span className="breadcrumb-sep">{' \u203a '}</span>}
                  {step.name}
                  <span className="breadcrumb-rank"> ({formatRank(step.rank)})</span>
                </span>
              ))}
              {hasGap && (
                <span className="breadcrumb-sep">{' \u203a \u2026 \u203a '}</span>
              )}
              {tail.map((step, i) => (
                <span key={step.taxId}>
                  {i > 0 && <span className="breadcrumb-sep">{' \u203a '}</span>}
                  {step.name}
                  <span className="breadcrumb-rank"> ({formatRank(step.rank)})</span>
                </span>
              ))}
            </span>
          </Fragment>
        )
      })}
    </div>
  )
}

function ShareButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      className="share-icon-btn"
      title={copied ? 'Copied!' : 'Share link'}
      onClick={() => {
        navigator.clipboard.writeText(url).then(() => {
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        })
      }}
    >
      {copied ? '✓' : '🔗'}
    </button>
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
      <div className={`result-banner ${rank === 1 ? 'correct' : score >= 50 ? 'debated' : 'wrong'}`}>
        {rank === 1 ? 'Perfect!' : `${score} points`}
        <ShareButton url={shareUrl} />
      </div>

      <div className="result-explanation">
        {rank === 1 ? (
          <p>
            You picked{' '}
            <strong>{capitalize(userOrgA.commonName)}</strong> &amp;{' '}
            <strong>{capitalize(userOrgB.commonName)}</strong> — the closest pair!
            They share a most recent common ancestor in{' '}
            <strong>{bestPair.lca.name}</strong> ({formatRank(bestPair.lca.rank)}).
          </p>
        ) : (
          <>
            <p>
              You picked{' '}
              <strong>{capitalize(userOrgA.commonName)}</strong> &amp;{' '}
              <strong>{capitalize(userOrgB.commonName)}</strong> (ranked #{rank} of{' '}
              {totalPairs} pairs). Their common ancestor is{' '}
              <strong>{userPair.lca.name}</strong> ({formatRank(userPair.lca.rank)}).
            </p>
            <p>
              The closest pair was{' '}
              <strong>{capitalize(bestOrgA.commonName)}</strong> &amp;{' '}
              <strong>{capitalize(bestOrgB.commonName)}</strong>, sharing a common
              ancestor in <strong>{bestPair.lca.name}</strong> (
              {formatRank(bestPair.lca.rank)}).
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

      <details className="multi-pair-details">
        <summary>All {totalPairs} pair rankings</summary>
        <PairTable
          allPairs={result.allPairs}
          organisms={organisms}
          userPair={userPair}
        />
      </details>

      <MapToggle organisms={organisms} />

      <MultiLineageBreadcrumbs
        organisms={organisms}
        taxonomyData={taxonomyData}
        userSelectedTaxIds={new Set([userPair.taxIdA, userPair.taxIdB])}
      />

      <div className="result-actions">
        <Button onClick={onPlayAgain}>Next</Button>
      </div>
    </div>
  )
}
