import type { Organism } from './organisms.ts'
import { organisms } from './organisms.ts'

export interface SurprisingScenario {
  organisms: [Organism, Organism, Organism]
  funFact: string
  sourceUrl: string
  sourceLabel: string
}

function org(name: string) {
  const found = organisms.find(o => o.commonName === name)
  if (!found) {
    throw new Error(`Organism not found: ${name}`)
  }
  return found
}

export const surprisingScenarios: SurprisingScenario[] = [
  {
    organisms: [org('Human'), org('Fly agaric'), org('Thale cress')],
    funFact:
      'Humans are more closely related to mushrooms than to plants! Animals and fungi are both Opisthokonts, sharing a more recent common ancestor than either does with plants.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Opisthokonta',
    sourceLabel: 'Opisthokonta - Wikipedia',
  },
  {
    organisms: [org('Human'), org('Sea urchin'), org('Fruit fly')],
    funFact:
      'Humans and sea urchins are both deuterostomes — their embryos develop the anus before the mouth. Insects are protostomes, a fundamentally different body plan.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Deuterostome',
    sourceLabel: 'Deuterostome - Wikipedia',
  },
  {
    organisms: [org('Horse'), org('White rhinoceros'), org('Impala')],
    funFact:
      'Horses and rhinos are both odd-toed ungulates (Perissodactyla), despite looking very different. Antelopes are even-toed ungulates, a separate lineage.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Odd-toed_ungulate',
    sourceLabel: 'Odd-toed ungulate - Wikipedia',
  },
  {
    organisms: [org('Rock hyrax'), org('African elephant'), org('House mouse')],
    funFact:
      'The tiny hyrax is more closely related to the elephant than to any rodent! Both belong to Afrotheria, a superorder of mammals that originated in Africa.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Afrotheria',
    sourceLabel: 'Afrotheria - Wikipedia',
  },
  {
    organisms: [org('English oak'), org('Pumpkin'), org('Scots pine')],
    funFact:
      'Oak trees are closer to pumpkins than to pines. Oaks and pumpkins are both flowering plants (angiosperms), while pines are gymnosperms — a much older lineage.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Flowering_plant',
    sourceLabel: 'Flowering plant - Wikipedia',
  },
  {
    organisms: [org('Common bat'), org('Cow'), org('Flying squirrel')],
    funFact:
      'Bats are more closely related to cows than to flying squirrels! Bats and cows are both Laurasiatheria, while squirrels are Euarchontoglires — convergent evolution gave both bats and flying squirrels the ability to take to the air.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Laurasiatheria',
    sourceLabel: 'Laurasiatheria - Wikipedia',
  },
  {
    organisms: [org('Aardvark'), org('West Indian manatee'), org('Nine-banded armadillo')],
    funFact:
      'Aardvarks and manatees are both Afrotheria, not related to armadillos despite superficial similarities. Armadillos belong to Xenarthra, a completely separate mammalian superorder.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Afrotheria',
    sourceLabel: 'Afrotheria - Wikipedia',
  },
  {
    organisms: [org('Harbor seal'), org('Brown bear'), org('Domestic cat')],
    funFact:
      'Seals are more closely related to bears than to cats! Seals and bears are both Caniformia (dog-like carnivorans), while cats are Feliformia.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Caniformia',
    sourceLabel: 'Caniformia - Wikipedia',
  },
  {
    organisms: [org('Common shrew'), org('Domestic cat'), org('House mouse')],
    funFact:
      'Despite looking like tiny mice, shrews are closer to cats than to mice! Shrews and cats are both Laurasiatheria, while mice are Euarchontoglires.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Eulipotyphla',
    sourceLabel: 'Eulipotyphla - Wikipedia',
  },
  {
    organisms: [org('Mango'), org('Poison ivy'), org('Tomato')],
    funFact:
      'Mangoes and poison ivy are in the same family (Anacardiaceae)! The same urushiol compound that makes poison ivy irritating is found in mango skin.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Anacardiaceae',
    sourceLabel: 'Anacardiaceae - Wikipedia',
  },
  {
    organisms: [org('Plasmodium'), org('Paramecium'), org("Baker's yeast")],
    funFact:
      'The malaria parasite and paramecium are both Alveolata — single-celled organisms with distinctive membrane-bound sacs. Yeast is a fungus, far more distant.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Alveolata',
    sourceLabel: 'Alveolata - Wikipedia',
  },
  {
    organisms: [org('Coelacanth'), org('Human'), org('Atlantic salmon')],
    funFact:
      'Coelacanths are more closely related to humans than to salmon! As lobe-finned fish, coelacanths share a common ancestor with all land vertebrates (tetrapods).',
    sourceUrl: 'https://en.wikipedia.org/wiki/Coelacanth',
    sourceLabel: 'Coelacanth - Wikipedia',
  },
  {
    organisms: [org('Chicken'), org('American alligator'), org('Komodo dragon')],
    funFact:
      'Birds are actually living dinosaurs! Chickens and alligators are both archosaurs, while lizards like the Komodo dragon diverged much earlier.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Archosaur',
    sourceLabel: 'Archosaur - Wikipedia',
  },
  {
    organisms: [org('Blue whale'), org('Cow'), org('Horse')],
    funFact:
      'Whales evolved from even-toed ungulates — they are essentially aquatic cows! Both belong to Cetartiodactyla, while horses are odd-toed ungulates.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Cetartiodactyla',
    sourceLabel: 'Cetartiodactyla - Wikipedia',
  },
  {
    organisms: [org('Horseshoe crab'), org('Scorpion'), org('Honeybee')],
    funFact:
      'Despite being called crabs, horseshoe crabs are more closely related to scorpions and spiders (chelicerates) than to any true crustacean or insect.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Chelicerata',
    sourceLabel: 'Chelicerata - Wikipedia',
  },
]
