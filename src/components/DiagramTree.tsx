import type { DiagramNode } from '../utils/taxonomy.ts'

interface TreeLine {
  prefix: string
  label: string
  arrow: boolean
  userChoice: boolean
  wikiLink?: string
  taxId?: number
}

function renderLines(
  node: DiagramNode,
  prefix: string,
  isLast: boolean,
  isRoot: boolean,
  userSelectedTaxIds?: Set<number>,
) {
  const lines: TreeLine[] = []
  const connector = isRoot ? '' : isLast ? '└── ' : '├── '
  const isLeaf = !node.children || node.children.length === 0
  const showArrow = isLeaf && !!node.highlight
  const isUserChoice =
    isLeaf &&
    !!node.taxId &&
    !!userSelectedTaxIds &&
    userSelectedTaxIds.has(node.taxId)

  lines.push({
    prefix: `${prefix}${connector}`,
    label: node.label,
    arrow: showArrow,
    userChoice: isUserChoice,
    wikiLink: node.wikiLink,
    taxId: isLeaf ? node.taxId : undefined,
  })

  if (node.children) {
    const childPrefix = isRoot ? '' : prefix + (isLast ? '    ' : '│   ')
    for (let i = 0; i < node.children.length; i++) {
      const child = node.children[i]
      const childIsLast = i === node.children.length - 1
      for (const line of renderLines(
        child,
        childPrefix,
        childIsLast,
        false,
        userSelectedTaxIds,
      )) {
        lines.push(line)
      }
    }
  }

  return lines
}

export default function DiagramTree({
  root,
  onZoomOut,
  correct,
  userSelectedTaxIds,
  organismColors,
}: {
  root: DiagramNode
  onZoomOut?: () => void
  correct?: boolean
  userSelectedTaxIds?: Set<number>
  organismColors?: Record<number, string>
}) {
  const lines = renderLines(root, '', true, true, userSelectedTaxIds)

  return (
    <pre className="diagram-text-tree">
      {onZoomOut && (
        <span>
          <a
            href="#"
            className="diagram-zoom-link"
            onClick={e => {
              e.preventDefault()
              onZoomOut()
            }}
          >
            {'▲ zoom out one level'}
          </a>
          {'\n'}
          {'└── '}
        </span>
      )}
      {lines.map((line, i) => (
        <span key={i}>
          {onZoomOut && i > 0 ? `    ${line.prefix}` : line.prefix}
          {line.userChoice && (
            <span
              className={
                correct === false
                  ? 'diagram-highlight-wrong'
                  : 'diagram-highlight-correct'
              }
            >
              {'→ '}
            </span>
          )}
          {line.taxId !== undefined && organismColors?.[line.taxId] && (
            <span
              className="map-color-dot"
              style={{ backgroundColor: organismColors[line.taxId] }}
            />
          )}
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
