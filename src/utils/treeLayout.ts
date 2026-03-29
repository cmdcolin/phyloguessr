import type { TreeNode } from './taxonomy.ts'

export interface LayoutNode {
  data: TreeNode
  children?: LayoutNode[]
  x: number
  y: number
}

export function buildClusterLayout(
  tree: TreeNode,
  sizeX: number,
  sizeY: number,
) {
  function wrap(node: TreeNode): LayoutNode {
    const wrapped: LayoutNode = { data: node, x: 0, y: 0 }
    if (node.children.length > 0) {
      wrapped.children = node.children.map(wrap)
    }
    return wrapped
  }
  const root = wrap(tree)

  const heights = new Map<LayoutNode, number>()
  function computeHeight(node: LayoutNode): number {
    if (!node.children) {
      heights.set(node, 0)
      return 0
    }
    const h = Math.max(...node.children.map(computeHeight)) + 1
    heights.set(node, h)
    return h
  }
  const rootHeight = computeHeight(root)

  function assignY(node: LayoutNode) {
    const h = heights.get(node) ?? 0
    node.y = rootHeight === 0 ? sizeY : ((rootHeight - h) / rootHeight) * sizeY
    if (node.children) {
      for (const c of node.children) {
        assignY(c)
      }
    }
  }
  assignY(root)

  const leaves: LayoutNode[] = []
  function collectLeaves(node: LayoutNode) {
    if (!node.children) {
      leaves.push(node)
      return
    }
    for (const c of node.children) {
      collectLeaves(c)
    }
  }
  collectLeaves(root)
  leaves.forEach((leaf, i) => {
    leaf.x =
      leaves.length <= 1 ? sizeX / 2 : (i / (leaves.length - 1)) * sizeX
  })

  function assignX(node: LayoutNode) {
    if (!node.children) return
    for (const c of node.children) {
      assignX(c)
    }
    node.x =
      node.children.reduce((sum, c) => sum + c.x, 0) / node.children.length
  }
  assignX(root)

  function getAllNodes(node: LayoutNode): LayoutNode[] {
    const result: LayoutNode[] = [node]
    if (node.children) {
      for (const c of node.children) {
        for (const n of getAllNodes(c)) {
          result.push(n)
        }
      }
    }
    return result
  }
  return getAllNodes(root)
}
