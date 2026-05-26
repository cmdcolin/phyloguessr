import amphibian from './organisms/amphibian.json'
import arthropod from './organisms/arthropod.json'
import bird from './organisms/bird.json'
import fish from './organisms/fish.json'
import invertebrate from './organisms/invertebrate.json'
import mammal from './organisms/mammal.json'
import microbe from './organisms/microbe.json'
import plant from './organisms/plant.json'
import reptile from './organisms/reptile.json'

export interface Organism {
  commonName: string
  scientificName: string
  ncbiTaxId: number
  wikiTitle: string
  group: string
  imageUrl?: string
}

export const organisms: Organism[] = [
  ...mammal,
  ...bird,
  ...reptile,
  ...amphibian,
  ...fish,
  ...arthropod,
  ...invertebrate,
  ...plant,
  ...microbe,
]
