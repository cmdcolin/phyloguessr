import type { DiagramNode } from '../data/surprisingFacts.ts'

function renderLines(node: DiagramNode, prefix: string, isLast: boolean, isRoot: boolean) {
  const lines: { text: string; highlight: boolean }[] = []
  const connector = isRoot ? '' : isLast ? '\u2514\u2500\u2500 ' : '\u251C\u2500\u2500 '
  const label = node.highlight ? `${node.label}  \u2190` : node.label

  lines.push({
    text: `${prefix}${connector}${label}`,
    highlight: node.highlight ?? false,
  })

  if (node.children) {
    const childPrefix = isRoot ? '' : prefix + (isLast ? '    ' : '\u2502   ')
    for (let i = 0; i < node.children.length; i++) {
      const child = node.children[i]
      const childIsLast = i === node.children.length - 1
      for (const line of renderLines(child, childPrefix, childIsLast, false)) {
        lines.push(line)
      }
    }
  }

  return lines
}

export default function DiagramTree({ root }: { root: DiagramNode }) {
  const lines = renderLines(root, '', true, true)

  return (
    <pre className="diagram-text-tree">
      {lines.map((line, i) => (
        <span key={i} className={line.highlight ? 'diagram-highlight' : ''}>
          {line.text}
          {'\n'}
        </span>
      ))}
    </pre>
  )
}
