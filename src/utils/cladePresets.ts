type TaxonHeader = { type: 'header'; label: string }
type TaxonItem = {
  type: 'item'
  id: string
  label: string
  name: string
  depth: number
  emoji?: string
}
export type DisplayEntry = TaxonHeader | (TaxonItem & { prefix: string })

const CLADE_TREE: (TaxonHeader | TaxonItem)[] = [
  { type: 'header', label: 'Animals' },
  { type: 'item', id: '33208', label: 'all animals', name: 'Metazoa', depth: -1, emoji: '🦁' },
  {
    type: 'item',
    id: '7742',
    label: 'vertebrates',
    name: 'Vertebrata',
    depth: 0,
    emoji: '🐸',
  },
  {
    type: 'item',
    id: '32523',
    label: 'tetrapods',
    name: 'Tetrapoda',
    depth: 2,
  },
  { type: 'item', id: '40674', label: 'mammals', name: 'Mammalia', depth: 3, emoji: '🐘' },
  { type: 'item', id: '9443', label: 'primates', name: 'Primates', depth: 4, emoji: '🐒' },
  { type: 'item', id: '8782', label: 'birds', name: 'Aves', depth: 3, emoji: '🦜' },
  {
    type: 'item',
    id: '9126',
    label: 'songbirds',
    name: 'Passeriformes',
    depth: 4,
  },
  {
    type: 'item',
    id: '8504',
    label: 'lizards & snakes',
    name: 'Lepidosauria',
    depth: 3,
    emoji: '🦎',
  },
  {
    type: 'item',
    id: '8292',
    label: 'frogs & salamanders',
    name: 'Amphibia',
    depth: 3,
  },
  {
    type: 'item',
    id: '7898',
    label: 'ray-finned fish',
    name: 'Actinopterygii',
    depth: 2,
    emoji: '🐟',
  },
  {
    type: 'item',
    id: '7777',
    label: 'sharks & rays',
    name: 'Chondrichthyes',
    depth: 2,
    emoji: '🦈',
  },
  {
    type: 'item',
    id: '6656',
    label: 'arthropods',
    name: 'Arthropoda',
    depth: 0,
  },
  { type: 'item', id: '50557', label: 'insects', name: 'Insecta', depth: 1, emoji: '🐛' },
  {
    type: 'item',
    id: '7088',
    label: 'butterflies & moths',
    name: 'Lepidoptera',
    depth: 2,
    emoji: '🦋',
  },
  {
    type: 'item',
    id: '6854',
    label: 'arachnids',
    name: 'Arachnida',
    depth: 1,
    emoji: '🕷️',
  },
  {
    type: 'item',
    id: '6657',
    label: 'crustaceans',
    name: 'Crustacea',
    depth: 1,
    emoji: '🦀',
  },
  {
    type: 'item',
    id: '6447',
    label: 'molluscs',
    name: 'Mollusca',
    depth: 0,
    emoji: '🐙',
  },
  { type: 'header', label: 'Plants' },
  {
    type: 'item',
    id: '3398',
    label: 'flowering plants',
    name: 'Magnoliopsida',
    depth: 0,
    emoji: '🌸',
  },
  {
    type: 'item',
    id: '4447',
    label: 'monocots',
    name: 'Liliopsida',
    depth: 1,
  },
  {
    type: 'item',
    id: '4209',
    label: 'daisies & asters',
    name: 'Asterales',
    depth: 1,
    emoji: '🌼',
  },
  {
    type: 'item',
    id: '72025',
    label: 'legumes',
    name: 'Fabales',
    depth: 1,
  },
  {
    type: 'item',
    id: '3744',
    label: 'roses',
    name: 'Rosales',
    depth: 1,
    emoji: '🌹',
  },
  {
    type: 'item',
    id: '4143',
    label: 'mints & snapdragons',
    name: 'Lamiales',
    depth: 1,
  },
  { type: 'item', id: '58019', label: 'conifers', name: 'Pinopsida', depth: 0, emoji: '🌲' },
  { type: 'header', label: 'Fungi' },
  {
    type: 'item',
    id: '4751',
    label: 'fungi',
    name: 'Fungi',
    depth: 0,
    emoji: '🍄',
  },
  {
    type: 'item',
    id: '4890',
    label: 'yeasts & sac fungi',
    name: 'Ascomycota',
    depth: 1,
  },
  { type: 'header', label: 'Microbes' },
  { type: 'item', id: '2', label: 'bacteria', name: 'Bacteria', depth: 0, emoji: '🦠' },
  { type: 'item', id: '10239', label: 'viruses', name: 'Viruses', depth: 0, emoji: '🧫' },
  {
    type: 'item',
    id: 'micro',
    label: 'microorganisms',
    name: 'cross-kingdom',
    depth: 0,
    emoji: '🔬',
  },
]

function addPrefixes(items: TaxonItem[]): (TaxonItem & { prefix: string })[] {
  const hasMore: boolean[] = []
  return items.map((item, j) => {
    const { depth } = item
    if (depth < 0) {
      return { ...item, prefix: '' }
    }
    let nextSiblingExists = false
    for (let k = j + 1; k < items.length; k++) {
      if (items[k].depth < depth) {
        break
      }
      if (items[k].depth === depth) {
        nextSiblingExists = true
        break
      }
    }
    hasMore[depth] = nextSiblingExists
    let prefix = ''
    for (let d = 0; d < depth; d++) {
      prefix += (hasMore[d] ?? false) ? '│  ' : '   '
    }
    prefix += nextSiblingExists ? '├─ ' : '└─ '
    return { ...item, prefix }
  })
}

export const DISPLAY_TREE: DisplayEntry[] = (() => {
  const result: DisplayEntry[] = []
  let segment: TaxonItem[] = []
  for (const entry of CLADE_TREE) {
    if (entry.type === 'header') {
      for (const item of addPrefixes(segment)) {
        result.push(item)
      }
      segment = []
      result.push(entry)
    } else {
      segment.push(entry)
    }
  }
  for (const item of addPrefixes(segment)) {
    result.push(item)
  }
  return result
})()

export const FEATURED_CLADES = CLADE_TREE.filter(
  (e): e is TaxonItem & { emoji: string } =>
    e.type === 'item' && e.emoji !== undefined,
)

const CLADE_PRESETS = CLADE_TREE.filter(
  (e): e is TaxonItem => e.type === 'item',
).map(e => [e.id, e.label, e.name] as const)

export function formatModeKey(key: string) {
  if (key === 'easy') {
    return 'Easy'
  }
  if (key === 'random') {
    return 'Random'
  }
  if (key.startsWith('random:')) {
    const id = key.slice(7)
    const preset = CLADE_PRESETS.find(([presetId]) => presetId === id)
    if (preset) {
      return preset[1].charAt(0).toUpperCase() + preset[1].slice(1)
    }
    return id
  }
  return key
}
