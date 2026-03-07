import type { DiagramNode } from '../utils/taxonomy.ts'

interface TreeLine {
  prefix: string
  label: string
  arrow: boolean
  wikiLink?: string
}

function renderLines(
  node: DiagramNode,
  prefix: string,
  isLast: boolean,
  isRoot: boolean,
) {
  const lines: TreeLine[] = []
  const connector = isRoot ? '' : isLast ? '└── ' : '├── '
  const isLeaf = !node.children || node.children.length === 0
  const showArrow = isLeaf && !!node.highlight

  lines.push({
    prefix: `${prefix}${connector}`,
    label: node.label,
    arrow: showArrow,
    wikiLink: node.wikiLink,
  })

  if (node.children) {
    const childPrefix = isRoot ? '' : prefix + (isLast ? '    ' : '│   ')
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
        <span key={i}>
          {line.prefix}
          {line.wikiLink ? (
            <a
              href={line.wikiLink}
              target="_blank"
              rel="noopener noreferrer"
              className="diagram-link"
            >
              {line.label}
            </a>
          ) : (
            line.label
          )}
          {line.arrow && <span className="diagram-highlight">{' ←'}</span>}
          {'\n'}
        </span>
      ))}
    </pre>
  )
}
