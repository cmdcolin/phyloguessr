import type { Organism } from './organisms.ts'

export interface Source {
  url: string
  label: string
}

export interface SurprisingScenario {
  organisms: [Organism, Organism, Organism]
  funFact: string
  sources: Source[]
  correctPair?: [string, string]
  activelyDebated?: boolean
}

let scenariosPromise: Promise<SurprisingScenario[]> | undefined

export function loadSurprisingScenarios() {
  if (!scenariosPromise) {
    scenariosPromise = fetch('/taxonomy/easy-scenarios.json')
      .then(r => {
        if (!r.ok) {
          throw new Error(`Failed to load easy scenarios: ${r.status}`)
        }
        return r.json() as Promise<SurprisingScenario[]>
      })
  }
  return scenariosPromise
}
