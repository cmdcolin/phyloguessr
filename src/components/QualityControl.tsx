import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import {
  getLineageFromParents,
  loadSpeciesPool,
  loadTaxonomyData,
} from '../utils/taxonomy.ts'
import type { SpeciesPoolEntry, TaxonomyData } from '../utils/taxonomy.ts'

const STORAGE_KEY = 'phylo-flagged-species'
const PAGE_SIZE = 60

type FilterMode = 'all' | 'flagged' | 'unflagged'

function loadFlagged() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      return new Set<number>(JSON.parse(raw))
    }
  } catch {
    // ignore
  }
  return new Set<number>()
}

function saveFlagged(flagged: Set<number>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...flagged]))
}

function getRankFromLineage(
  taxId: number,
  targetRank: string,
  data: TaxonomyData,
) {
  const lineage = getLineageFromParents(taxId, data.parents)
  for (const id of lineage) {
    if (data.ranks[String(id)] === targetRank) {
      return { taxId: id, name: data.names[String(id)] ?? `${id}` }
    }
  }
  return undefined
}

function SpeciesCard({
  entry,
  isFlagged,
  onToggle,
  taxonomy,
}: {
  entry: SpeciesPoolEntry
  isFlagged: boolean
  onToggle: () => void
  taxonomy: { kingdom: string; phylum: string; family: string }
}) {
  const [taxId, commonName, scientificName, imageUrl] = entry
  const [imgError, setImgError] = useState(false)

  return (
    <div
      class={`qc-card ${isFlagged ? 'qc-card-flagged' : ''}`}
      onClick={onToggle}
    >
      <div class="qc-card-img">
        {imageUrl && !imgError ? (
          <img
            src={imageUrl}
            alt={scientificName}
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div class="qc-card-noimg">No image</div>
        )}
      </div>
      <div class="qc-card-info">
        <div class="qc-card-common">{commonName || scientificName}</div>
        <div class="qc-card-sci">
          <em>{scientificName}</em>
        </div>
        <div class="qc-card-tax">
          {taxonomy.kingdom} &gt; {taxonomy.phylum} &gt; {taxonomy.family}
        </div>
        <div class="qc-card-id">NCBI: {taxId}</div>
      </div>
      {isFlagged && <div class="qc-card-flag-badge">FLAGGED</div>}
    </div>
  )
}

export default function QualityControl() {
  const [pool, setPool] = useState<SpeciesPoolEntry[]>([])
  const [data, setData] = useState<TaxonomyData | null>(null)
  const [flagged, setFlagged] = useState<Set<number>>(loadFlagged)
  const [search, setSearch] = useState('')
  const [kingdomFilter, setKingdomFilter] = useState('all')
  const [phylumFilter, setPhylumFilter] = useState('all')
  const [filterMode, setFilterMode] = useState<FilterMode>('all')
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<'name' | 'kingdom' | 'phylum'>('name')
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    Promise.all([loadSpeciesPool(), loadTaxonomyData()]).then(([p, d]) => {
      setPool(p)
      setData(d)
      setLoading(false)
    })
  }, [])

  const taxonomyLookup = useMemo(() => {
    if (!data || pool.length === 0) {
      return new Map<number, { kingdom: string; phylum: string; family: string }>()
    }
    const lookup = new Map<number, { kingdom: string; phylum: string; family: string }>()
    for (const entry of pool) {
      const taxId = entry[0]
      const kingdom = getRankFromLineage(taxId, 'kingdom', data)
      const phylum = getRankFromLineage(taxId, 'phylum', data)
      const family = getRankFromLineage(taxId, 'family', data)
      lookup.set(taxId, {
        kingdom: kingdom?.name ?? 'Unknown',
        phylum: phylum?.name ?? 'Unknown',
        family: family?.name ?? 'Unknown',
      })
    }
    return lookup
  }, [data, pool])

  const kingdoms = useMemo(() => {
    const s = new Set<string>()
    for (const v of taxonomyLookup.values()) {
      s.add(v.kingdom)
    }
    return [...s].sort()
  }, [taxonomyLookup])

  const phyla = useMemo(() => {
    const s = new Set<string>()
    for (const v of taxonomyLookup.values()) {
      if (kingdomFilter === 'all' || v.kingdom === kingdomFilter) {
        s.add(v.phylum)
      }
    }
    return [...s].sort()
  }, [taxonomyLookup, kingdomFilter])

  const filtered = useMemo(() => {
    const lowerSearch = search.toLowerCase()
    return pool.filter(entry => {
      const [taxId, commonName, scientificName] = entry
      const tax = taxonomyLookup.get(taxId)

      if (filterMode === 'flagged' && !flagged.has(taxId)) {
        return false
      }
      if (filterMode === 'unflagged' && flagged.has(taxId)) {
        return false
      }

      if (kingdomFilter !== 'all' && tax?.kingdom !== kingdomFilter) {
        return false
      }
      if (phylumFilter !== 'all' && tax?.phylum !== phylumFilter) {
        return false
      }

      if (lowerSearch) {
        const matchesSearch =
          commonName.toLowerCase().includes(lowerSearch) ||
          scientificName.toLowerCase().includes(lowerSearch) ||
          String(taxId).includes(lowerSearch)
        if (!matchesSearch) {
          return false
        }
      }

      return true
    })
  }, [pool, search, kingdomFilter, phylumFilter, filterMode, flagged, taxonomyLookup])

  const sorted = useMemo(() => {
    const arr = [...filtered]
    if (sortBy === 'kingdom') {
      arr.sort((a, b) => {
        const ta = taxonomyLookup.get(a[0])
        const tb = taxonomyLookup.get(b[0])
        return (ta?.kingdom ?? '').localeCompare(tb?.kingdom ?? '')
      })
    } else if (sortBy === 'phylum') {
      arr.sort((a, b) => {
        const ta = taxonomyLookup.get(a[0])
        const tb = taxonomyLookup.get(b[0])
        return (ta?.phylum ?? '').localeCompare(tb?.phylum ?? '')
      })
    } else {
      arr.sort((a, b) => (a[1] || a[2]).localeCompare(b[1] || b[2]))
    }
    return arr
  }, [filtered, sortBy, taxonomyLookup])

  const paged = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
  const totalPages = Math.ceil(sorted.length / PAGE_SIZE)

  const toggleFlag = useCallback(
    (taxId: number) => {
      setFlagged(prev => {
        const next = new Set(prev)
        if (next.has(taxId)) {
          next.delete(taxId)
        } else {
          next.add(taxId)
        }
        saveFlagged(next)
        return next
      })
    },
    [],
  )

  const exportFlagged = useCallback(() => {
    const entries = pool
      .filter(e => flagged.has(e[0]))
      .map(e => ({ taxId: e[0], commonName: e[1], scientificName: e[2] }))
    const blob = new Blob([JSON.stringify(entries, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'flagged-species.json'
    a.click()
    URL.revokeObjectURL(url)
  }, [pool, flagged])

  const importFlagged = useCallback(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = () => {
      const file = input.files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = () => {
          try {
            const parsed = JSON.parse(reader.result as string)
            const ids: number[] = Array.isArray(parsed)
              ? parsed.map((e: { taxId: number } | number) =>
                  typeof e === 'number' ? e : e.taxId,
                )
              : []
            const next = new Set<number>([...flagged, ...ids])
            setFlagged(next)
            saveFlagged(next)
          } catch {
            alert('Invalid JSON file')
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }, [flagged])

  const clearFlagged = useCallback(() => {
    if (confirm(`Clear all ${flagged.size} flagged species?`)) {
      const next = new Set<number>()
      setFlagged(next)
      saveFlagged(next)
    }
  }, [flagged])

  useEffect(() => {
    setPage(0)
  }, [search, kingdomFilter, phylumFilter, filterMode, sortBy])

  if (loading) {
    return (
      <div class="qc-container">
        <h2>Loading species data...</h2>
      </div>
    )
  }

  return (
    <div class="qc-container" ref={containerRef}>
      <div class="qc-header">
        <h2>Species Quality Control</h2>
        <div class="qc-stats">
          {pool.length} total | {flagged.size} flagged | {sorted.length} shown
        </div>
      </div>

      <div class="qc-toolbar">
        <input
          type="text"
          placeholder="Search by name or taxId..."
          value={search}
          onInput={e => setSearch((e.target as HTMLInputElement).value)}
          class="qc-search"
        />

        <select
          value={kingdomFilter}
          onChange={e => {
            setKingdomFilter((e.target as HTMLSelectElement).value)
            setPhylumFilter('all')
          }}
          class="qc-select"
        >
          <option value="all">All kingdoms</option>
          {kingdoms.map(k => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </select>

        <select
          value={phylumFilter}
          onChange={e =>
            setPhylumFilter((e.target as HTMLSelectElement).value)
          }
          class="qc-select"
        >
          <option value="all">All phyla</option>
          {phyla.map(p => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={e =>
            setSortBy((e.target as HTMLSelectElement).value as 'name' | 'kingdom' | 'phylum')
          }
          class="qc-select"
        >
          <option value="name">Sort: Name</option>
          <option value="kingdom">Sort: Kingdom</option>
          <option value="phylum">Sort: Phylum</option>
        </select>

        <div class="qc-filter-btns">
          {(['all', 'flagged', 'unflagged'] as FilterMode[]).map(mode => (
            <button
              key={mode}
              class={`qc-filter-btn ${filterMode === mode ? 'active' : ''}`}
              onClick={() => setFilterMode(mode)}
            >
              {mode === 'all' ? 'All' : mode === 'flagged' ? 'Flagged' : 'Unflagged'}
            </button>
          ))}
        </div>
      </div>

      <div class="qc-actions">
        <button onClick={exportFlagged} class="qc-btn">
          Export flagged ({flagged.size})
        </button>
        <button onClick={importFlagged} class="qc-btn">
          Import flagged
        </button>
        <button onClick={clearFlagged} class="qc-btn qc-btn-danger">
          Clear all flags
        </button>
      </div>

      <div class="qc-grid">
        {paged.map(entry => (
          <SpeciesCard
            key={entry[0]}
            entry={entry}
            isFlagged={flagged.has(entry[0])}
            onToggle={() => toggleFlag(entry[0])}
            taxonomy={
              taxonomyLookup.get(entry[0]) ?? {
                kingdom: 'Unknown',
                phylum: 'Unknown',
                family: 'Unknown',
              }
            }
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div class="qc-pagination">
          <button
            disabled={page === 0}
            onClick={() => {
              setPage(p => p - 1)
              containerRef.current?.scrollTo(0, 0)
            }}
          >
            Prev
          </button>
          <span>
            Page {page + 1} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages - 1}
            onClick={() => {
              setPage(p => p + 1)
              containerRef.current?.scrollTo(0, 0)
            }}
          >
            Next
          </button>
        </div>
      )}

      <style>{`
        .qc-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 16px;
          height: 100vh;
          overflow-y: auto;
        }
        .qc-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        .qc-header h2 { margin: 0; }
        .qc-stats {
          font-size: 0.9rem;
          color: #888;
        }
        .qc-toolbar {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 8px;
        }
        .qc-search {
          flex: 1;
          min-width: 200px;
          padding: 8px 12px;
          border-radius: 6px;
          border: 1px solid #555;
          background: #222;
          color: #eee;
          font-size: 0.95rem;
        }
        .qc-select {
          padding: 8px;
          border-radius: 6px;
          border: 1px solid #555;
          background: #222;
          color: #eee;
        }
        .qc-filter-btns {
          display: flex;
          gap: 4px;
        }
        .qc-filter-btn {
          padding: 6px 14px;
          border-radius: 16px;
          border: 1px solid #555;
          background: transparent;
          color: #ccc;
          cursor: pointer;
        }
        .qc-filter-btn.active {
          background: #2e7d32;
          color: white;
          border-color: #2e7d32;
        }
        .qc-actions {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
        }
        .qc-btn {
          padding: 6px 14px;
          border-radius: 6px;
          border: 1px solid #555;
          background: #333;
          color: #eee;
          cursor: pointer;
          font-size: 0.85rem;
        }
        .qc-btn:hover { background: #444; }
        .qc-btn-danger { border-color: #c62828; color: #ef5350; }
        .qc-btn-danger:hover { background: #c62828; color: white; }
        .qc-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 10px;
        }
        .qc-card {
          border: 2px solid #444;
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          transition: border-color 0.15s, opacity 0.15s;
          position: relative;
          background: #1a1a1a;
        }
        .qc-card:hover { border-color: #888; }
        .qc-card-flagged {
          border-color: #c62828;
          opacity: 0.6;
        }
        .qc-card-flagged:hover { opacity: 0.8; }
        .qc-card-img {
          width: 100%;
          height: 180px;
          overflow: hidden;
          background: #111;
        }
        .qc-card-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .qc-card-noimg {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #666;
        }
        .qc-card-info {
          padding: 8px 10px;
        }
        .qc-card-common {
          font-weight: 600;
          font-size: 0.95rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .qc-card-sci {
          font-size: 0.8rem;
          color: #aaa;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .qc-card-tax {
          font-size: 0.75rem;
          color: #777;
          margin-top: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .qc-card-id {
          font-size: 0.7rem;
          color: #555;
        }
        .qc-card-flag-badge {
          position: absolute;
          top: 8px;
          right: 8px;
          background: #c62828;
          color: white;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 4px;
        }
        .qc-pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 16px;
          padding: 16px 0;
        }
        .qc-pagination button {
          padding: 6px 16px;
          border-radius: 6px;
          border: 1px solid #555;
          background: #333;
          color: #eee;
          cursor: pointer;
        }
        .qc-pagination button:disabled {
          opacity: 0.4;
          cursor: default;
        }
      `}</style>
    </div>
  )
}
