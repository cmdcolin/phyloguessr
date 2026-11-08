import type { Organism } from './organisms.ts'

export interface Source {
  url: string
  label: string
}

export interface SurprisingScenario {
  difficulty: 'easy' | 'tricky'
  organisms: [Organism, Organism, Organism]
  funFact: string
  sources: Source[]
  correctPair?: [string, string]
  activelyDebated?: boolean
}

let scenariosPromise: Promise<SurprisingScenario[]> | undefined

function isScenario(value: unknown): value is SurprisingScenario {
  return (
    typeof value === 'object' &&
    value !== null &&
    'funFact' in value &&
    typeof value.funFact === 'string' &&
    'organisms' in value &&
    Array.isArray(value.organisms) &&
    value.organisms.length === 3
  )
}

async function fetchScenarios() {
  const r = await fetch('/taxonomy/easy-scenarios.json')
  if (!r.ok) {
    throw new Error(`Failed to load easy scenarios: ${r.status}`)
  }
  const data: unknown = await r.json()
  return Array.isArray(data) ? data.filter(isScenario) : []
}

export function loadSurprisingScenarios() {
  scenariosPromise ??= fetchScenarios()
  return scenariosPromise
}
