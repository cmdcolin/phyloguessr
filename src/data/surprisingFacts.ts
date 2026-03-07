import { organisms } from './organisms.ts'

import type { Organism } from './organisms.ts'

export interface DiagramNode {
  label: string
  highlight?: boolean
  children?: DiagramNode[]
}

export interface Source {
  url: string
  label: string
}

export interface SurprisingScenario {
  organisms: [Organism, Organism, Organism]
  funFact: string
  diagram?: DiagramNode
  sources: Source[]
  correctPair?: [string, string]
  activelyDebated?: boolean
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
      'Humans are more closely related to mushrooms than to plants! Animals and fungi share a more recent common ancestor than either does with plants — we split from fungi long after plants went their own way.',
    sources: [
      { url: 'https://en.wikipedia.org/wiki/Opisthokonta', label: 'Opisthokonta - Wikipedia' },
      { url: 'https://gizmodo.com/why-are-mushrooms-more-like-humans-than-they-are-like-p-5940434', label: 'Gizmodo - Why mushrooms are more like humans than plants' },
    ],
  },
  {
    organisms: [org('Human'), org('Sea urchin'), org('Fruit fly')],
    funFact:
      'Humans and sea urchins are both deuterostomes — a group of animals whose embryos develop the same way, forming the anus before the mouth. Insects develop the other way around, putting them on a completely different branch of the animal tree.',
    diagram: {
      label: 'Bilateria',
      children: [
        {
          label: 'Protostomia ("mouth first")',
          children: [{ label: 'Insects (fruit fly)', highlight: true }],
        },
        {
          label: 'Deuterostomia ("anus first")',
          highlight: true,
          children: [
            { label: 'Echinoderms (sea urchin)', highlight: true },
            { label: 'Chordates (human)', highlight: true },
          ],
        },
      ],
    },
    sources: [
      { url: 'https://en.wikipedia.org/wiki/Deuterostome', label: 'Deuterostome - Wikipedia' },
      { url: 'https://www.abc.net.au/science/articles/2006/11/10/1785449.htm', label: 'ABC Science - Sea urchins are our cousins' },
    ],
  },
  {
    organisms: [org('Horse'), org('White rhinoceros'), org('Impala')],
    funFact:
      'Horses and rhinos are both odd-toed ungulates (Perissodactyla), despite looking very different. Antelopes are even-toed ungulates, a separate lineage.',
    sources: [
      { url: 'https://en.wikipedia.org/wiki/Odd-toed_ungulate', label: 'Odd-toed ungulate - Wikipedia' },
      { url: 'https://positivepeerpressure.blog/quirky-evolution-5-unlikely-animal-relatives-hiding-in-plain-sight-6e08cfd299a7', label: 'Quirky Evolution - Unlikely animal relatives' },
      { url: 'https://www.sci.news/paleontology/modern-horse-toes-12022.html', label: 'Sci.News - Modern horse toes' },
      { url: 'https://en.wikipedia.org/wiki/Evolution_of_the_horse', label: 'Evolution of the horse - Wikipedia' },
    ],
  },
  {
    organisms: [org('Rock hyrax'), org('African elephant'), org('House mouse')],
    funFact:
      'The tiny hyrax is more closely related to the elephant than to any rodent! Both belong to Afrotheria, a superorder of mammals that originated in Africa.',
    diagram: {
      label: 'Placentalia',
      children: [
        {
          label: 'Afrotheria (African origin)',
          highlight: true,
          children: [
            { label: 'Hyraxes (rock hyrax)', highlight: true },
            { label: 'Elephants', highlight: true },
            { label: 'Manatees, aardvarks...' },
          ],
        },
        {
          label: 'Boreoeutheria',
          children: [
            { label: 'Rodents (mouse)', highlight: true },
            { label: 'Primates, carnivores...' },
          ],
        },
      ],
    },
    sources: [
      { url: 'https://en.wikipedia.org/wiki/Afrotheria', label: 'Afrotheria - Wikipedia' },
      { url: 'https://en.wikipedia.org/wiki/Hyrax', label: 'Hyrax - Wikipedia' },
    ],
  },
  {
    organisms: [org('English oak'), org('Pumpkin'), org('Scots pine')],
    funFact:
      'Oak trees are closer to pumpkins than to pines. Oaks and pumpkins are both flowering plants (angiosperms), while pines are gymnosperms — a much older lineage.',
    sources: [
      { url: 'https://en.wikipedia.org/wiki/Flowering_plant', label: 'Flowering plant - Wikipedia' },
      { url: 'https://www.youtube.com/watch?v=ONVpFtiD-fo', label: 'YouTube - The Surprising Map of Plants' },
    ],
  },
  {
    organisms: [org('Common bat'), org('Cow'), org('Human')],
    funFact:
      'Bats are more closely related to cows than to humans. Bats and cows are both Laurasiatheria — the same major branch of the mammal family tree that also includes dogs, cats, horses, and whales. Humans are on a completely separate branch (Euarchontoglires), with primates, rodents, and rabbits.',
    diagram: {
      label: 'Boreoeutheria',
      children: [
        {
          label: 'Euarchontoglires',
          children: [
            { label: 'Primates (human)', highlight: true },
            { label: 'Rodents, rabbits...' },
          ],
        },
        {
          label: 'Laurasiatheria',
          highlight: true,
          children: [
            { label: 'Bats (common bat)', highlight: true },
            { label: 'Ungulates (cow)', highlight: true },
            { label: 'Carnivores, whales...' },
          ],
        },
      ],
    },
    sources: [
      { url: 'https://en.wikipedia.org/wiki/Laurasiatheria', label: 'Laurasiatheria - Wikipedia' },
      { url: 'https://www.batcon.org/surprising-bat-relatives/', label: 'Bat Conservation International - Surprising bat relatives' },
    ],
  },
  {
    organisms: [
      org('Aardvark'),
      org('West Indian manatee'),
      org('Nine-banded armadillo'),
    ],
    funFact:
      'An aardvark digging up termite mounds in Africa shares more recent common ancestry with a manatee drifting through Caribbean seagrass than either does with a nine-banded armadillo — which has a nearly identical lifestyle to the aardvark. Aardvarks and manatees both descend from an ancient group of African mammals; armadillos evolved separately in South America.',
    sources: [
      { url: 'https://en.wikipedia.org/wiki/Afrotheria', label: 'Afrotheria - Wikipedia' },
      { url: 'https://www.livescience.com/55241-aardvark-facts.html', label: 'Live Science - Aardvark facts' },
    ],
  },
  {
    organisms: [org('Harbor seal'), org('Brown bear'), org('Domestic cat')],
    funFact:
      'Seals are more closely related to bears than to cats! Seals and bears are both on the "dog side" of the carnivore family tree, while cats are on the other side. Seals actually evolved from bear-like ancestors.',
    diagram: {
      label: 'Carnivora',
      children: [
        {
          label: 'Feliformia ("cat side")',
          children: [{ label: 'Cats (domestic cat)', highlight: true }],
        },
        {
          label: 'Caniformia ("dog side")',
          highlight: true,
          children: [
            { label: 'Bears (brown bear)', highlight: true },
            { label: 'Pinnipeds (harbor seal)', highlight: true },
            { label: 'Dogs, weasels...' },
          ],
        },
      ],
    },
    sources: [
      { url: 'https://en.wikipedia.org/wiki/Caniformia', label: 'Caniformia - Wikipedia' },
      { url: 'https://www.youtube.com/watch?v=aAOsf004FqQ', label: 'YouTube - Seals are related to dogs and bears' },
    ],
  },
  {
    organisms: [org('Common shrew'), org('Domestic cat'), org('House mouse')],
    funFact:
      'Despite looking like tiny mice, shrews are closer to cats than to mice! Shrews and cats share an ancestor from the same ancient group of mammals, while mice and rodents are on a completely different branch — the same branch as primates.',
    sources: [
      { url: 'https://en.wikipedia.org/wiki/Eulipotyphla', label: 'Eulipotyphla - Wikipedia' },
      { url: 'https://www.youtube.com/shorts/jRPiiXKmZIA', label: 'YouTube - Shrews are closer to cats than mice' },
    ],
  },
  {
    organisms: [org('Mango'), org('Poison ivy'), org('English ivy')],
    funFact:
      'Despite the name, poison ivy is not related to English ivy — but it is related to mangoes! Mango and poison ivy are both Anacardiaceae, and the same urushiol that causes the poison ivy rash is found in mango skin.',
    sources: [
      { url: 'https://en.wikipedia.org/wiki/Anacardiaceae', label: 'Anacardiaceae - Wikipedia' },
      { url: 'https://www.scientificamerican.com/article/what-do-cashews-mangoes-and-poison-ivy-have-in-common/', label: 'Scientific American - Cashews, mangoes, and poison ivy' },
    ],
  },
  {
    organisms: [org('Plasmodium'), org('Paramecium'), org("Baker's yeast")],
    funFact:
      'The malaria parasite and paramecium are both single-celled organisms that share a deep common ancestor, despite one being a deadly parasite and the other a free-living pond dweller. Yeast is a fungus — actually more closely related to animals than to either of them.',
    sources: [
      { url: 'https://en.wikipedia.org/wiki/Alveolata', label: 'Alveolata - Wikipedia' },
      { url: 'https://www.youtube.com/watch?v=4ejoVBcLP4U', label: 'PBS Eons - How Our Deadliest Parasite Turned To The Dark Side' },
    ],
  },
  {
    organisms: [org('Coelacanth'), org('Human'), org('Atlantic salmon')],
    funFact:
      'Coelacanths are more closely related to humans than to salmon! As lobe-finned fish, coelacanths share a common ancestor with all land vertebrates (tetrapods).',
    diagram: {
      label: 'Osteichthyes (bony fish)',
      children: [
        {
          label: 'Actinopterygii (ray-finned)',
          children: [{ label: 'Salmon', highlight: true }],
        },
        {
          label: 'Sarcopterygii (lobe-finned)',
          highlight: true,
          children: [
            { label: 'Coelacanth', highlight: true },
            { label: 'Lungfish' },
            { label: 'Tetrapods (human)', highlight: true },
          ],
        },
      ],
    },
    sources: [{ url: 'https://en.wikipedia.org/wiki/Coelacanth', label: 'Coelacanth - Wikipedia' },
      { url: 'https://ocean.si.edu/ocean-life/fish/coelacanth', label: 'Smithsonian Ocean - Coelacanth' }],
  },
  {
    organisms: [
      org('Chicken'),
      org('American alligator'),
      org('Komodo dragon'),
    ],
    funFact:
      'A chicken and an alligator are closer relatives than either is to a Komodo dragon. Despite "dinosaur" meaning "terrible lizard," dinosaurs have nothing to do with lizards. The reptile family tree splits into two branches: lizards and snakes on one side, and turtles, crocodilians, dinosaurs, and birds on the other. A chicken is a living dinosaur; a Komodo dragon is not.',
    diagram: {
      label: 'Amniota',
      children: [
        { label: 'Mammals' },
        {
          label: 'Sauropsida (reptiles + birds)',
          children: [
            {
              label: 'Lepidosauria',
              children: [
                {
                  label: 'Lizards, snakes (Komodo dragon)',
                  highlight: true,
                },
              ],
            },
            {
              label: 'Archelosauria',
              highlight: true,
              children: [
                { label: 'Turtles' },
                {
                  label: 'Archosauria',
                  highlight: true,
                  children: [
                    {
                      label: 'Crocodilians (alligator)',
                      highlight: true,
                    },
                    {
                      label: 'Dinosauria',
                      children: [{ label: 'Birds (chicken)', highlight: true }],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    sources: [{ url: 'https://en.wikipedia.org/wiki/Archosaur', label: 'Archosaur - Wikipedia' },
      { url: 'https://www.earth.com/news/crocodiles-birds-archosaurs/', label: 'Earth.com - Crocodiles and birds are archosaurs' }],
  },
  {
    organisms: [
      org('Peregrine falcon'),
      org('African grey parrot'),
      org('Bald eagle'),
    ],
    funFact:
      "Falcons are not hawks — they are closer to parrots! DNA studies place Falconiformes as the sister group to Psittacopasserae (parrots and songbirds), while eagles and hawks are Accipitriformes, a completely separate bird order. The peregrine falcon's kinship with the parrot is one of the most counterintuitive findings in modern bird phylogenetics.",
    sources: [{ url: 'https://en.wikipedia.org/wiki/Falconidae', label: 'Falconidae - Wikipedia' },
      { url: 'https://www.birdnote.org/explore/field-notes/2015/02/parrots-and-falcons-long-lost-cousins', label: 'BirdNote - Parrots and falcons: long-lost cousins' }],
  },
  {
    organisms: [
      org('Barn owl'),
      org('Common nighthawk'),
      org('Red-tailed hawk'),
    ],
    funFact:
      'Owls are not hawks — molecular phylogenetics places owls (Strigiformes) as close relatives of nightjars and nighthawks (Caprimulgiformes), not of hawks and eagles (Accipitriformes). The barn owl and the common nighthawk are on the same branch; the red-tailed hawk is on a completely different one.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Strigiformes', label: 'Strigiformes - Wikipedia' },
      { url: 'https://www.britannica.com/animal/caprimulgiform/Evolution-and-paleontology', label: 'Britannica - Caprimulgiform evolution and paleontology' }],
  },
  {
    organisms: [
      org('Ocean sunfish'),
      org('Pufferfish'),
      org('Atlantic bluefin tuna'),
    ],
    funFact:
      "The ocean sunfish — the world's heaviest bony fish, with no tail and a bizarre flattened body — is a pufferfish relative! Both are Tetraodontiformes. Tuna are perciform fish, a completely separate lineage. Everything about the sunfish looks alien, but inside it is just a massively modified puffer.",
    sources: [{ url: 'https://en.wikipedia.org/wiki/Tetraodontiformes', label: 'Tetraodontiformes - Wikipedia' },
      { url: 'https://ocean.si.edu/ocean-life/fish/pufferfishes-and-their-relatives', label: 'Smithsonian Ocean - Pufferfishes and their relatives' }],
  },
  {
    organisms: [
      org('Atlantic mudskipper'),
      org('Atlantic bluefin tuna'),
      org('Common frog'),
    ],
    funFact:
      'Mudskippers walk on land, breathe air, and climb trees — but they are ray-finned fish (gobies), more closely related to a tuna than to any frog. Their land-living lifestyle evolved completely independently from the tetrapod lineage that produced all amphibians, reptiles, birds, and mammals.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Mudskipper', label: 'Mudskipper - Wikipedia' },
      { url: 'https://www.discovermagazine.com/meet-the-mudskipper-the-fish-that-walks-on-land-44915', label: 'Discover Magazine - Meet the mudskipper' }],
  },
  {
    organisms: [org('Red panda'), org('Raccoon'), org('Giant panda')],
    funFact:
      'Red pandas are musteloids — the same superfamily as weasels, badgers, and raccoons. Giant pandas are true bears (Ursidae), on a completely separate branch. Despite both being called pandas and both eating bamboo, the two species are not closely related — the bamboo diet evolved independently.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Red_panda', label: 'Red panda - Wikipedia' },
      { url: 'https://nationalzoo.si.edu/animals/news/red-panda-bear-and-more-red-panda-facts', label: 'Smithsonian Zoo - Red panda facts' }],
  },
  {
    organisms: [org('Wolverine'), org('Sea otter'), org('Brown bear')],
    funFact:
      'The sea otter and the wolverine are both mustelids — the weasel family. Despite the sea otter living its entire life at sea, cracking clams on its chest, it shares more recent common ancestry with the land-dwelling wolverine than with any bear. Bears are a separate carnivoran family (Ursidae).',
    sources: [
      { url: 'https://en.wikipedia.org/wiki/Mustelidae', label: 'Mustelidae - Wikipedia' },
      { url: 'https://www.britannica.com/animal/wolverine', label: 'Britannica - Wolverine' },
    ],
  },
  {
    organisms: [org('Tuatara'), org('Komodo dragon'), org('King cobra')],
    funFact:
      'The tuatara looks like a large lizard, but it is the sole survivor of Rhynchocephalia — a reptile order that diverged from squamates over 240 million years ago. The Komodo dragon and king cobra are both squamates, more closely related to each other than either is to the tuatara.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Rhynchocephalia', label: 'Rhynchocephalia - Wikipedia' },
      { url: 'https://theconversation.com/not-a-lizard-nor-a-dinosaur-tuatara-is-the-sole-survivor-of-a-once-widespread-reptile-group-75921', label: 'The Conversation - Tuatara is the sole survivor of a once-widespread reptile group' }],
  },
  {
    organisms: [org('Axolotl'), org('Tiger salamander'), org('Common frog')],
    funFact:
      'The axolotl is a tiger salamander — it is a neotenic form of Ambystoma, retaining juvenile features (external gills, aquatic lifestyle) into adulthood. Frogs are a completely separate amphibian order (Anura). The axolotl looks nothing like a tiger salamander, yet they are essentially the same animal.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Axolotl', label: 'Axolotl - Wikipedia' }],
  },
  {
    organisms: [org('Blue whale'), org('Cow'), org('Horse')],
    funFact:
      'Whales evolved from the same group of hoofed mammals as cows, hippos, and pigs — they are essentially aquatic even-toed ungulates! Horses split off much earlier as odd-toed ungulates.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Cetartiodactyla', label: 'Cetartiodactyla - Wikipedia' },
      { url: 'https://evolution.berkeley.edu/what-are-evograms/the-evolution-of-whales/', label: 'UC Berkeley - The evolution of whales' }],
  },
  {
    organisms: [
      org('Bottlenose dolphin'),
      org('Blue whale'),
      org('Great white shark'),
    ],
    funFact:
      'A dolphin and a whale are both mammals — they breathe air, nurse their young, and have vestigial leg bones buried inside their bodies. Their ancestors walked on land on four hoofed legs. Sharks have been in the ocean for over 400 million years; whales and dolphins returned to the sea only about 50 million years ago and independently evolved the same streamlined shape.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Evolution_of_cetaceans', label: 'Evolution of cetaceans - Wikipedia' },
      { url: 'https://us.whales.org/whales-dolphins/how-did-whales-evolve/', label: 'Whale & Dolphin Conservation - How did whales evolve?' }],
  },
  {
    organisms: [
      org('West Indian manatee'),
      org('Bottlenose dolphin'),
      org('African elephant'),
    ],
    funFact:
      'A manatee is more closely related to an elephant than to a dolphin. Manatees and elephants share ancestors that lived in Africa — manatees still have toenails on their flippers from their land-dwelling past. Dolphins descended from a completely different group of land mammals related to hippos. Two separate lineages of land mammals independently returned to the sea.',
    diagram: {
      label: 'Placentalia',
      children: [
        {
          label: 'Afrotheria',
          highlight: true,
          children: [
            { label: 'Sirenia (manatee)', highlight: true },
            { label: 'Elephants', highlight: true },
          ],
        },
        {
          label: 'Laurasiatheria',
          children: [
            { label: 'Cetacea (dolphin)', highlight: true },
            { label: 'Carnivores, bats...' },
          ],
        },
      ],
    },
    sources: [{ url: 'https://en.wikipedia.org/wiki/Sirenia#Evolution', label: 'Sirenia evolution - Wikipedia' },
      { url: 'https://www.livescience.com/weird-relatives-of-elephants.html', label: 'Live Science - Weird relatives of elephants' }],
  },
  {
    organisms: [org('Walrus'), org('Sea otter'), org('Blue whale')],
    funFact:
      'A walrus is more closely related to a sea otter than to a whale — despite the walrus and whale both being fully aquatic. Walruses and sea otters are both carnivores that returned to the sea from land-dwelling ancestors related to bears and weasels. Whales returned to the sea separately, from hoofed mammals related to hippos. Three ocean mammals, but only two share a carnivore ancestor.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Marine_mammal#Evolution', label: 'Marine mammal evolution - Wikipedia' },
      { url: 'https://www.britannica.com/animal/pinniped', label: 'Britannica - Pinnipeds' }],
  },
  {
    organisms: [org('Horseshoe crab'), org('Scorpion'), org('Honeybee')],
    funFact:
      'Despite being called crabs, horseshoe crabs are chelicerates — more closely related to scorpions and spiders than to any true crustacean. They have blue copper-based blood and have barely changed in over 450 million years of fossil record.',
    diagram: {
      label: 'Arthropoda',
      children: [
        {
          label: 'Chelicerata',
          highlight: true,
          children: [
            { label: 'Horseshoe crabs', highlight: true },
            { label: 'Arachnids (scorpion)', highlight: true },
          ],
        },
        {
          label: 'Mandibulata',
          children: [
            { label: 'Crustaceans' },
            { label: 'Insects (honeybee)', highlight: true },
          ],
        },
      ],
    },
    sources: [{ url: 'https://en.wikipedia.org/wiki/Chelicerata', label: 'Chelicerata - Wikipedia' },
      { url: 'https://oceanservice.noaa.gov/facts/horseshoe-crab.html', label: 'NOAA - Are horseshoe crabs really crabs?' }],
  },
  {
    organisms: [
      org('Common octopus'),
      org('Garden snail'),
      org('Sea cucumber'),
    ],
    funFact:
      'Octopuses and snails are both molluscs! Despite octopuses having complex brains and no shell, they share a common ancestor with humble snails. Sea cucumbers may be soft and squishy, but they are echinoderms — more closely related to starfish and sea urchins than to any mollusc.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Mollusca', label: 'Mollusca - Wikipedia' },
      { url: 'https://www.dgs.udel.edu/node/449', label: 'Delaware Geological Survey - Clams, snails, and squid: Phylum Mollusca' }],
  },
  {
    organisms: [
      org('Staghorn coral'),
      org('Moon jellyfish'),
      org('Garden snail'),
    ],
    funFact:
      'Corals look like colorful rocks, but each coral head is a colony of thousands of tiny animals — each with a mouth ringed by stinging tentacles, just like a jellyfish in miniature. Corals and jellyfish are both cnidarians, while snails are molluscs on a completely different branch of the animal tree.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Cnidaria', label: 'Cnidaria - Wikipedia' }],
  },
  {
    organisms: [org('Seahorse'), org('Clownfish'), org('Great white shark')],
    funFact:
      'A seahorse barely looks like a fish — upright posture, prehensile tail, no scales, and the males get pregnant. But it is a bony fish (a pipefish relative), closer to a clownfish than to any shark. Sharks have cartilaginous skeletons and diverged from bony fish over 400 million years ago.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Osteichthyes', label: 'Osteichthyes - Wikipedia' }],
  },
  {
    organisms: [org('Nautilus'), org('Giant clam'), org('Horseshoe crab')],
    funFact:
      'The nautilus — a jet-propelled predator with 90 tentacles and a 500-million-year-old lineage — is a mollusc, just like the sedentary giant clam cemented to a reef. Horseshoe crabs may have a similar ancient look, but they are chelicerates, closer to spiders than to any shelled sea creature.',
    sources: [
      { url: 'https://en.wikipedia.org/wiki/Mollusca', label: 'Mollusca - Wikipedia' },
      { url: 'https://www.dgs.udel.edu/node/449', label: 'Delaware Geological Survey - Clams, snails, and squid: Phylum Mollusca' },
    ],
  },
  {
    organisms: [org('Starfish'), org('Sea urchin'), org('Common octopus')],
    funFact:
      'A spiny ball and a five-armed star seem like completely different animals, but starfish and sea urchins are both echinoderms — they share five-fold radial symmetry, a unique water vascular system, and are actually on the vertebrate side of the animal tree, more closely related to humans than to octopuses. Octopuses are molluscs, a completely separate phylum.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Echinoderm', label: 'Echinoderm - Wikipedia' },
      { url: 'https://ucmp.berkeley.edu/phyla/deuterostomia.html', label: 'UC Berkeley - Introduction to the Deuterostomia' }],
  },
  {
    organisms: [org('Hippopotamus'), org('Blue whale'), org('Cow')],
    funFact:
      'Hippos are the closest living relatives of whales! Their shared ancestor was a small, pig-like animal that lived about 55 million years ago — one lineage returned fully to the sea, the other stayed semi-aquatic. Cows diverged from this lineage much earlier.',
    diagram: {
      label: 'Cetartiodactyla (even-toed ungulates + whales)',
      children: [
        { label: 'Ruminants (cow)', highlight: true },
        { label: 'Pigs' },
        {
          label: 'Whippomorpha',
          highlight: true,
          children: [
            { label: 'Hippopotamus', highlight: true },
            { label: 'Cetacea (blue whale)', highlight: true },
          ],
        },
      ],
    },
    sources: [{ url: 'https://en.wikipedia.org/wiki/Hippopotamus#Evolution', label: 'Hippopotamus evolution - Wikipedia' },
      { url: 'https://evolution.berkeley.edu/what-are-evograms/the-evolution-of-whales/', label: 'UC Berkeley - The evolution of whales' }],
  },
  {
    organisms: [
      org('Elephant shrew'),
      org('African elephant'),
      org('Common shrew'),
    ],
    funFact:
      'Despite being named "shrews" and looking like mice, elephant shrews are more closely related to actual elephants than to true shrews! Both descend from an ancient group of African mammals that also includes manatees, aardvarks, and tenrecs.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Elephant_shrew', label: 'Elephant shrew - Wikipedia' },
      { url: 'https://www.awf.org/wildlife-conservation/elephant-shrew', label: 'African Wildlife Foundation - Elephant shrew' }],
  },
  {
    organisms: [org('Tenrec'), org('African elephant'), org('Hedgehog')],
    funFact:
      'Tenrecs look almost identical to hedgehogs — spiny, round, and they even curl into a ball the same way — but they are closer to elephants than to any hedgehog! Tenrecs evolved in Africa alongside elephants and aardvarks; hedgehogs evolved separately in Europe and Asia. One of the most striking examples of convergent evolution in mammals.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Tenrecidae', label: 'Tenrecidae - Wikipedia' }],
  },
  {
    organisms: [
      org('Australian lungfish'),
      org('Common frog'),
      org('Atlantic salmon'),
    ],
    funFact:
      'The Australian lungfish breathes air and can survive in stagnant, oxygen-poor water. It is a lobe-finned fish — more closely related to a frog than to a salmon. The lineage that became all land vertebrates passed through something that looked like this.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Lungfish', label: 'Lungfish - Wikipedia' },
      { url: 'https://www.nature.com/articles/s41586-021-03198-8', label: 'Nature - Giant lungfish genome elucidates the conquest of land' }],
  },
  {
    organisms: [
      org('Bottlenose dolphin'),
      org('Hippopotamus'),
      org('Harbor seal'),
    ],
    funFact:
      'Dolphins and hippos share an ancestor — whales actually evolved from the same group of hoofed mammals as hippos. Seals may look aquatic too, but they evolved from a completely different lineage (carnivores, like bears and dogs).',
    sources: [
      { url: 'https://en.wikipedia.org/wiki/Cetartiodactyla', label: 'Cetartiodactyla - Wikipedia' },
      { url: 'https://www.pnas.org/doi/10.1073/pnas.96.18.10261', label: 'PNAS - Hippopotamuses are the closest extant relatives of whales' },
    ],
  },
  {
    organisms: [org('Gray wolf'), org('Raccoon'), org('Domestic cat')],
    funFact:
      'Raccoons are on the "dog side" of the carnivore family tree (Caniformia), more closely related to wolves than to cats. Cats are on the other side (Feliformia) with hyenas and mongooses.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Caniformia', label: 'Caniformia - Wikipedia' },
      { url: 'https://www.acsh.org/news/2018/12/12/are-raccoons-more-dogs-or-cats-13660', label: 'ACSH - Are raccoons more like dogs or cats?' }],
  },
  {
    organisms: [org('Spotted hyena'), org('Domestic cat'), org('Gray wolf')],
    funFact:
      'Despite looking and acting like dogs, hyenas are on the "cat side" of the carnivore family tree — they are more closely related to cats than to wolves! Their dog-like appearance is a classic case of convergent evolution.',
    diagram: {
      label: 'Carnivora',
      children: [
        {
          label: 'Caniformia ("dog side")',
          children: [
            { label: 'Dogs, wolves (gray wolf)', highlight: true },
            { label: 'Bears, seals, weasels...' },
          ],
        },
        {
          label: 'Feliformia ("cat side")',
          highlight: true,
          children: [
            { label: 'Cats (domestic cat)', highlight: true },
            { label: 'Hyenas (spotted hyena)', highlight: true },
            { label: 'Mongooses, civets...' },
          ],
        },
      ],
    },
    sources: [
      { url: 'https://en.wikipedia.org/wiki/Hyena#Evolution', label: 'Hyena evolution - Wikipedia' },
      { url: 'https://a-z-animals.com/animals/hyena/understanding-hyenas-are-they-canines-felines-or-unique-creatures/', label: 'A-Z Animals - Are hyenas canines, felines, or unique creatures?' },
    ],
  },
  {
    organisms: [org('Common genet'), org('Lion'), org('Egyptian mongoose')],
    correctPair: ['Common genet', 'Egyptian mongoose'],
    funFact:
      'The common genet looks uncannily like a small spotted wild cat — slim body, spotted coat, retractile claws, solitary hunter. But genets are in the civet family (Viverridae), which molecular studies place closer to mongooses (Herpestidae) than to true cats (Felidae) within Feliformia. (NCBI taxonomy leaves Feliformia families unresolved, but molecular phylogenetics consistently supports this grouping.)',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Feliformia', label: 'Feliformia - Wikipedia' }],
  },
  {
    organisms: [org('Binturong'), org('Lion'), org('Brown bear')],
    funFact:
      "The binturong is nicknamed the 'bearcat' — and it looks the part, with a stocky bear-like body and a cat-like face. Yet it belongs to the civet family, on the 'cat side' of the carnivore family tree alongside lions and domestic cats. Bears are on the 'dog side,' making the binturong more closely related to a lion than to a bear.",
    sources: [{ url: 'https://en.wikipedia.org/wiki/Binturong', label: 'Binturong - Wikipedia' }],
  },
  {
    organisms: [org('Fossa'), org('Lion'), org('Egyptian mongoose')],
    correctPair: ['Fossa', 'Egyptian mongoose'],
    funFact:
      "The fossa of Madagascar looks like a small wild cat — sleek build, retractile claws, solitary ambush predator. But a 2003 Nature paper by Yoder et al. showed that all Malagasy carnivorans (including the fossa) descend from a single mongoose-like ancestor that rafted from Africa ~20 million years ago. The fossa belongs to Eupleridae, sister family to mongooses (Herpestidae), not cats. Its cat-like traits evolved convergently to fill the apex predator niche on an island with no true cats. (NCBI taxonomy leaves Feliformia families unresolved, but the molecular evidence is strong.)",
    sources: [
      { url: 'https://en.wikipedia.org/wiki/Eupleridae', label: 'Eupleridae - Wikipedia' },
      { url: 'https://animals.sandiegozoo.org/animals/fossa', label: 'San Diego Zoo - Fossa' },
      { url: 'https://yoderlab.org/cms/wp-content/uploads/2014/05/2003YoderBurnsNature.pdf', label: 'Yoder et al. 2003 - Single origin of Malagasy Carnivora (Nature)' },
    ],
  },
  {
    organisms: [org('Walrus'), org('Brown bear'), org('Harbor seal')],
    funFact:
      'Walruses, seals, and sea lions all evolved from bear-like ancestors that returned to the sea about 25 million years ago. Despite living in the same ocean as whales and dolphins, pinnipeds are carnivores — on the same branch as bears and dogs, not cetaceans.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Pinniped#Evolution', label: 'Pinniped evolution - Wikipedia' },
      { url: 'https://ocean.si.edu/ocean-life/marine-mammals/seals-sea-lions-and-walruses', label: 'Smithsonian Ocean - Pinnipeds' }],
  },
  {
    organisms: [org('Human'), org('House mouse'), org('Domestic cat')],
    funFact:
      'You are more closely related to a mouse than to your cat. Humans and mice are on the same major branch of the mammal family tree — the one with all primates, rodents, and rabbits. Cats are on a completely different branch, the one that also includes dogs, horses, bats, and whales.',
    diagram: {
      label: 'Boreoeutheria',
      children: [
        {
          label: 'Euarchontoglires',
          highlight: true,
          children: [
            { label: 'Primates (human)', highlight: true },
            { label: 'Rodents (mouse)', highlight: true },
            { label: 'Rabbits...' },
          ],
        },
        {
          label: 'Laurasiatheria',
          children: [
            { label: 'Carnivores (cat)', highlight: true },
            { label: 'Bats, ungulates, whales...' },
          ],
        },
      ],
    },
    sources: [{ url: 'https://en.wikipedia.org/wiki/Euarchontoglires', label: 'Euarchontoglires - Wikipedia' },
      { url: 'https://journals.plos.org/ploscompbiol/article?id=10.1371/journal.pcbi.0030002', label: 'PLOS Computational Biology - Phylogenomic study of human, dog, and mouse' }],
  },
  {
    organisms: [
      org('Human'),
      org('Philippine tarsier'),
      org('Ring-tailed lemur'),
    ],
    funFact:
      'Tarsiers are "dry-nosed" primates like us — despite their huge eyes and tiny size, they are closer to humans than lemurs are. Lemurs are "wet-nosed" primates, an older branch that split off earlier.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Haplorhini', label: 'Haplorhini - Wikipedia' }],
  },
  {
    organisms: [org('Gorilla'), org('Human'), org('Orangutan')],
    funFact:
      'Gorillas are our second-closest living relative after chimps. The gorilla lineage split from ours ~8 million years ago; orangutans split ~14 million years ago — making gorillas about twice as recently related to us as orangutans.',
    sources: [
      { url: 'https://en.wikipedia.org/wiki/Hominidae', label: 'Hominidae - Wikipedia' },
      { url: 'https://humanorigins.si.edu/evidence/genetics', label: 'Smithsonian Human Origins - Genetics of great ape family tree' },
    ],
  },
  {
    organisms: [org('Human'), org('European rabbit'), org('Brown bear')],
    funFact:
      'Rabbits are closer to primates than to bears! Rabbits and rodents are on the same major branch of the mammal family tree as primates, while bears are on a completely separate branch.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Glires', label: 'Glires - Wikipedia' }],
  },
  {
    organisms: [org('Brown rat'), org('House mouse'), org('European rabbit')],
    funFact:
      'Rats and mice are in the same family (Muridae)! Despite rabbits looking like large, fluffy mice, rabbits are not rodents at all — they are lagomorphs, in their own separate order. You can tell by the teeth: rodents have one pair of upper incisors, while rabbits have a second tiny pair hidden behind the first.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Muridae', label: 'Muridae - Wikipedia' }],
  },
  {
    organisms: [org('American pika'), org('European rabbit'), org('Brown rat')],
    funFact:
      "The pika looks like a tiny round-eared mouse, but it is a lagomorph — the same order as rabbits and hares! Rats are rodents, a completely separate order. Despite the pika's mousey appearance, it is more closely related to a rabbit than to any rat.",
    sources: [{ url: 'https://en.wikipedia.org/wiki/Lagomorpha', label: 'Lagomorpha - Wikipedia' }],
  },
  // Surprising plant relationships
  {
    organisms: [org('Ocotillo'), org('Blueberry'), org('Jumping cholla')],
    funFact:
      'The spiny desert ocotillo and the bog-loving blueberry are both in the order Ericales! This remarkably diverse order also includes tea, kiwi, and Brazil nuts.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Ericales', label: 'Ericales - Wikipedia' }],
  },
  {
    organisms: [org('Cotton'), org('Cacao'), org('Tomato')],
    funFact:
      'Cotton and chocolate (cacao) are in the same family — Malvaceae! This family also includes okra, durian, and hibiscus. They were only united after DNA studies.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Malvaceae', label: 'Malvaceae - Wikipedia' }],
  },
  {
    organisms: [
      org('Venus flytrap'),
      org('Saguaro cactus'),
      org('English oak'),
    ],
    funFact:
      'Venus flytraps and cacti are both in the order Caryophyllales! This bizarrely diverse group also includes spinach, bougainvillea, carnations, and buckwheat.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Caryophyllales', label: 'Caryophyllales - Wikipedia' },
      { url: 'https://www.britannica.com/plant/Caryophyllales/Characteristic-morphological-features', label: 'Britannica - Caryophyllales' }],
  },
  {
    organisms: [org('Sacred lotus'), org('English oak'), org('Water lily')],
    funFact:
      'Despite looking nearly identical to water lilies, the sacred lotus is actually closer to oak trees! Molecular studies moved lotus out of the water lily order into Proteales. One of the biggest surprises of plant phylogenetics.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Nelumbo', label: 'Nelumbo - Wikipedia' },
      { url: 'https://laidbackgardener.blog/2018/10/23/water-lily-pond-lily-or-lotus/', label: 'Laidback Gardener - Lotus is not a water lily' }],
  },
  {
    organisms: [org('Rose'), org('Strawberry'), org('Black locust')],
    funFact:
      "Don't let the thorns fool you! The black locust is actually a giant pea plant (a legume), not related to the rose at all. The tiny ground-creeping strawberry and the woody thorny rose bush are the real cousins — both in the family Rosaceae, which also includes almonds, apples, cherries, and peaches.",
    sources: [{ url: 'https://en.wikipedia.org/wiki/Rosaceae', label: 'Rosaceae - Wikipedia' }],
  },
  {
    organisms: [org('Almond'), org('Strawberry'), org('Mango')],
    funFact:
      'Almonds and strawberries are both Rosaceae — the rose family. Despite one being a stone fruit from a tree and the other a ground-level accessory fruit, they share a common ancestor.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Rosaceae', label: 'Rosaceae - Wikipedia' }],
  },
  // "Your Inner Fish" — deep chordate ancestry
  {
    organisms: [org('Sea squirt'), org('Human'), org('Common octopus')],
    funFact:
      'Sea squirts are our relatives! As larvae, they have a notochord (primitive backbone) and swim freely, making them chordates like us. As adults they attach to rocks and reabsorb their larval nervous system, developing a simpler adult ganglion suited to a sedentary life. Despite looking like blobs, they are closer to humans than to any mollusc.',
    diagram: {
      label: 'Bilateria',
      children: [
        {
          label: 'Protostomia',
          children: [{ label: 'Molluscs (octopus)', highlight: true }],
        },
        {
          label: 'Deuterostomia',
          children: [
            {
              label: 'Chordata',
              highlight: true,
              children: [
                { label: 'Tunicates (sea squirt)', highlight: true },
                { label: 'Vertebrates (human)', highlight: true },
              ],
            },
          ],
        },
      ],
    },
    sources: [{ url: 'https://en.wikipedia.org/wiki/Tunicate', label: 'Tunicate - Wikipedia' },
      { url: 'https://www.adfg.alaska.gov/index.cfm?adfg=wildlifenews.view_article&articles_id=455', label: 'Alaska Fish & Game - Your cousin the sea squirt' }],
  },
  {
    organisms: [org('Sea squirt'), org('Atlantic salmon'), org('Lancelet')],
    correctPair: ['Sea squirt', 'Atlantic salmon'],
    funFact:
      'A blob stuck to a rock is closer to a salmon than a lancelet is! Sea squirts (tunicates) are the closest invertebrate relatives of all vertebrates. Lancelets — small, translucent, fish-shaped animals that live in sand — look far more vertebrate-like, but DNA evidence shows tunicates are actually our nearest invertebrate cousins. (NCBI taxonomy leaves this unresolved within Chordata, but molecular phylogenetics strongly supports the tunicate–vertebrate grouping called Olfactores.)',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Olfactores', label: 'Olfactores - Wikipedia' }],
  },
  {
    organisms: [org('Lancelet'), org('Atlantic salmon'), org('Sea urchin')],
    funFact:
      'Lancelets (also called amphioxus) are tiny, translucent, blade-shaped animals that live half-buried in sand on the seafloor. They have a notochord — a flexible rod that is the precursor to a spine — but no true backbone, skull, or brain. They are the closest living picture of what our ancestors looked like before evolving bones.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Lancelet', label: 'Lancelet - Wikipedia' }],
  },
  {
    organisms: [org('Great white shark'), org('Human'), org('Lancelet')],
    funFact:
      'Sharks and humans are both jawed vertebrates — your jaw, teeth, and inner ear all trace back to a common ancestor with sharks over 450 million years ago. Lancelets — small, translucent animals that live buried in sand — are chordates but split off before jaws or even a true backbone evolved.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Gnathostomata', label: 'Gnathostomata - Wikipedia' }],
  },
  {
    organisms: [org('Axolotl'), org('Human'), org('Atlantic salmon')],
    funFact:
      'As Neil Shubin describes in "Your Inner Fish," the limb bones in your arm (humerus, radius, ulna) are homologous to the same bones in an axolotl\'s leg — inherited from a common ancestor that crawled out of water ~375 million years ago.',
    sources: [
      { url: 'https://en.wikipedia.org/wiki/Your_Inner_Fish', label: 'Your Inner Fish - Wikipedia' },
      { url: 'https://www.pbs.org/your-inner-fish/about/overview/', label: 'PBS - Your Inner Fish series overview' },
    ],
  },
  // Weird insect ones
  {
    organisms: [org('Honeybee'), org('Ant'), org('Monarch butterfly')],
    funFact:
      'Ants are wingless wasps — and so are bees. Both are Hymenoptera. Butterflies are Lepidoptera, a completely separate insect order.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Hymenoptera', label: 'Hymenoptera - Wikipedia' },
      { url: 'https://www.si.edu/spotlight/buginfo/hymenoptera', label: 'Smithsonian - Wasps, ants, and bees (Hymenoptera)' }],
  },
  {
    organisms: [org('Dragonfly'), org('Monarch butterfly'), org('Honeybee')],
    funFact:
      'Butterflies and bees both undergo complete metamorphosis — transforming from larva to pupa to adult. Dragonflies are far more ancient and skip the pupa stage entirely, making them a more primitive branch of insects.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Holometabolism', label: 'Holometabolism - Wikipedia' },
      { url: 'https://www.scientificamerican.com/article/insect-metamorphosis-evolution/', label: 'Scientific American - How did insect metamorphosis evolve?' }],
  },
  {
    organisms: [org('Ladybug'), org('Fruit fly'), org('Dragonfly')],
    funFact:
      'Ladybugs (beetles) and fruit flies both undergo complete metamorphosis — egg, larva, pupa, adult. Dragonflies diverged over 300 million years ago, before insects evolved the pupal stage.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Endopterygota', label: 'Endopterygota - Wikipedia' }],
  },
  // Jellyfish, sponges, corals, and deep animal phylogeny
  {
    organisms: [org('Bath sponge'), org('Human'), org('Morel')],
    funFact:
      'Sponges are animals! Despite having no organs, muscles, or nervous system, sponges are on the animal branch of the tree of life. A sponge is more closely related to you than a mushroom is — even though fungi are our closest non-animal relatives.',
    diagram: {
      label: 'Opisthokonta',
      children: [
        { label: 'Fungi (morel)', highlight: true },
        {
          label: 'Animalia',
          highlight: true,
          children: [
            { label: 'Porifera (sponge)', highlight: true },
            { label: 'Cnidaria (jellyfish)' },
            { label: 'Bilateria (human)', highlight: true },
          ],
        },
      ],
    },
    sources: [
      { url: 'https://en.wikipedia.org/wiki/Porifera', label: 'Porifera - Wikipedia' },
      { url: 'https://www.science.org/doi/10.1126/science.abj2949', label: 'Science - Profiling cellular diversity in sponges informs animal cell type and nervous system evolution' },
    ],
  },
  {
    organisms: [org('Comb jelly'), org('Moon jellyfish'), org('Bath sponge')],
    funFact:
      'Comb jellies look like jellyfish but are NOT cnidarians — they are Ctenophora, a completely separate phylum. Which of these two — sponges or comb jellies — represents the earliest-diverging animal lineage is one of the most actively debated questions in biology.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Ctenophora', label: 'Ctenophora - Wikipedia' }],
  },
  {
    organisms: [org('Bath sponge'), org('Comb jelly'), org('Human')],
    activelyDebated: true,
    funFact:
      'Which animal lineage came first — sponges or comb jellies? This is one of the biggest open questions in animal evolution. For over a century, simple, brainless sponges were assumed to be first. Then in 2008, genomic studies pointed to comb jellies — animals with nerves and muscles. A 2023 chromosome-level study supported comb jellies, a 2025 study supported sponges but was retracted after errors were found, and the debate continues.',
    sources: [
      { url: 'https://github.com/caseywdunn/sk25', label: 'Dunn et al. - Reanalysis of sponge-sister evidence' },
      { url: 'https://www.nature.com/articles/s41586-023-05936-6', label: 'Ancient gene linkages support ctenophores as sister to other animals' },
      { url: 'https://www.mbari.org/news/genetic-research-offers-new-perspective-on-the-early-evolution-of-animals/', label: 'MBARI - New perspective on early animal evolution' },
    ],
  },
  {
    organisms: [org('Comb jelly'), org('Moon jellyfish'), org('Salp')],
    funFact:
      'Three transparent, drifting "jellies" — but from three completely different phyla. Moon jellyfish are cnidarians (stinging cells). Comb jellies are ctenophores (no stinging cells — they use sticky colloblasts instead). Salps are chordates, more closely related to humans than to either of the other two. "Jelly" is an ecological description, not a phylogenetic one.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Jellyfish#Phylogeny', label: 'Jellyfish phylogeny - Wikipedia' }],
  },
  {
    organisms: [org('Sea anemone'), org('Staghorn coral'), org('Comb jelly')],
    funFact:
      'Sea anemones and corals are both cnidarians — animals with stinging cells. Comb jellies may look similar but belong to a completely separate phylum (Ctenophora) that diverged over 600 million years ago.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Cnidaria', label: 'Cnidaria - Wikipedia' }],
  },
  {
    organisms: [org('Starfish'), org('Human'), org('Moon jellyfish')],
    funFact:
      'Starfish are on "our side" of the animal family tree! Despite looking alien, starfish share a more recent common ancestor with humans than with jellyfish. Their larvae are even bilaterally symmetric — like us — before transforming into their star shape.',
    diagram: {
      label: 'Animalia',
      children: [
        {
          label: 'Cnidaria',
          children: [{ label: 'Jellyfish, corals', highlight: true }],
        },
        {
          label: 'Bilateria',
          children: [
            {
              label: 'Deuterostomia',
              highlight: true,
              children: [
                { label: 'Echinoderms (starfish)', highlight: true },
                { label: 'Chordates (human)', highlight: true },
              ],
            },
          ],
        },
      ],
    },
    sources: [{ url: 'https://en.wikipedia.org/wiki/Deuterostome', label: 'Deuterostome - Wikipedia' }],
  },
  {
    organisms: [org('Moon jellyfish'), org('Sea anemone'), org('Bath sponge')],
    funFact:
      'Jellyfish and sea anemones are both cnidarians — animals with specialized stinging cells (nematocysts). Sponges lack true tissues entirely — no nerves, no muscles, no organs — and represent one of the deepest-diverging animal lineages.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Porifera', label: 'Porifera - Wikipedia' }],
  },
  {
    organisms: [org('Staghorn coral'), org('Sea anemone'), org('Starfish')],
    funFact:
      'Corals and sea anemones are both anthozoans — cnidarians that gave up the free-swimming jellyfish stage and settled down. They are essentially upside-down jellyfish cemented to the seafloor. Starfish may live on the same reef, but they are deuterostomes — more closely related to humans than to any coral or jellyfish.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Anthozoa', label: 'Anthozoa - Wikipedia' }],
  },
  // Convergent evolution and misleading names
  {
    organisms: [
      org('Pangolin'),
      org('Gray wolf'),
      org('Nine-banded armadillo'),
    ],
    funFact:
      'Pangolins look like armadillos with scales but are actually closest to carnivores like dogs and cats! Pangolins are the sister group to all carnivores. Armadillos evolved their armor independently in a completely separate branch of mammals.',
    diagram: {
      label: 'Placentalia',
      children: [
        {
          label: 'Xenarthra (South American)',
          children: [
            { label: 'Armadillos', highlight: true },
            { label: 'Sloths, anteaters' },
          ],
        },
        {
          label: 'Boreoeutheria',
          children: [
            {
              label: 'Ferae',
              highlight: true,
              children: [
                { label: 'Pholidota (pangolin)', highlight: true },
                { label: 'Carnivora (wolf)', highlight: true },
              ],
            },
          ],
        },
      ],
    },
    sources: [
      { url: 'https://en.wikipedia.org/wiki/Pangolin#Taxonomy', label: 'Pangolin taxonomy - Wikipedia' },
      { url: 'https://en.wikipedia.org/wiki/Ferae', label: 'Ferae - Wikipedia' },
    ],
  },
  {
    organisms: [org('Barnacle'), org('American lobster'), org('Garden snail')],
    funFact:
      'Barnacles are crustaceans, not molluscs! Despite their hard shells and sedentary lifestyle making them look like limpets, barnacles are related to lobsters, crabs, and shrimp. Charles Darwin spent 8 years studying them.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Barnacle', label: 'Barnacle - Wikipedia' },
      { url: 'https://oceanservice.noaa.gov/facts/barnacles.html', label: 'NOAA - What are barnacles?' }],
  },
  {
    organisms: [org('Common limpet'), org('Garden snail'), org('Barnacle')],
    funFact:
      'Limpets look exactly like barnacles — both are conical, both clamp onto rocks in the surf zone — but a limpet is a gastropod mollusc, essentially a snail with a flattened shell. Barnacles are crustaceans, related to crabs and shrimp. The similar shape evolved independently to handle the same wave-battered habitat.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Limpet', label: 'Limpet - Wikipedia' }],
  },
  {
    organisms: [org('Red king crab'), org('Hermit crab'), org('Blue crab')],
    funFact:
      'King crabs are NOT true crabs — they are actually hermit crabs that evolved a crab-like body shape! This is called "carcinization," and it has happened at least five times independently in crustacean evolution.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Carcinisation', label: 'Carcinisation - Wikipedia' },
      { url: 'https://www.nature.com/articles/355539a0', label: 'Nature - Evolution of king crabs from hermit crab ancestors' }],
  },
  {
    organisms: [org('Earthworm'), org('Common octopus'), org('Pork tapeworm')],
    activelyDebated: true,
    funFact:
      'All three are lophotrochozoans — but which pair is closest? The exact relationships between annelids (earthworms), molluscs (octopuses), and flatworms (tapeworms) remain one of the hardest problems in animal phylogenetics. These lineages may have diverged so rapidly that the branching order is nearly impossible to resolve. The word "worm" means nothing phylogenetically — any pair here could be correct!',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Lophotrochozoa', label: 'Lophotrochozoa - Wikipedia' },
      { url: 'https://courses.lumenlearning.com/suny-biology2xmaster/chapter/superphylum-lophotrochozoa/', label: 'Lumen Learning - Superphylum Lophotrochozoa' }],
  },
  {
    organisms: [org('Sea lamprey'), org('Great white shark'), org('Lancelet')],
    funFact:
      'Lampreys are jawless parasites with a circular, toothed mouth — but they are true vertebrates with a skull and spinal column. They represent what vertebrates looked like before jaws evolved over 450 million years ago. Lancelets — small, translucent sand-dwellers — lack a backbone entirely and split off even earlier.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Lamprey', label: 'Lamprey - Wikipedia' },
      { url: 'https://bio.libretexts.org/Bookshelves/Introductory_and_General_Biology/General_Biology_(Boundless)/29:_Vertebrates/29.02:_Fishes/29.2A:_Agnathans-_Jawless_Fishes', label: 'Biology LibreTexts - Jawless fishes' }],
  },
  {
    organisms: [org('Earthworm'), org('Garden snail'), org('Pork tapeworm')],
    activelyDebated: true,
    funFact:
      'All three are spiralians — animals whose embryos share a distinctive spiral pattern of cell division. But the exact branching order of annelids, molluscs, and flatworms within Spiralia is hotly debated. Recent phylogenomic studies suggest these phyla diverged in such a rapid burst that the true tree may be nearly impossible to resolve. Any pair here could be correct!',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Spiralia', label: 'Spiralia - Wikipedia' },
      { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC2614230/', label: 'PMC - Assembling the lophotrochozoan (spiralian) tree of life' }],
  },
  {
    organisms: [org('Shipworm'), org('Giant clam'), org('Earthworm')],
    funFact:
      'Shipworms bore through wooden ship hulls and dock pilings with a long, naked, worm-like body — but they are bivalve molluscs, a kind of clam. They even retain two tiny vestigial shells at the head end. A shipworm is more closely related to a giant clam than to any earthworm.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Shipworm', label: 'Shipworm - Wikipedia' }],
  },
  {
    organisms: [org('Priapulid'), org('Fruit fly'), org('Earthworm')],
    funFact:
      'Priapulids (penis worms) are marine burrowing worms that look superficially like earthworms, but they are in the same major group as insects and spiders — animals that grow by molting their outer skin. A priapulid is more closely related to a fruit fly than to an earthworm.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Priapulida', label: 'Priapulida - Wikipedia' }],
  },
  {
    organisms: [org('Peanut worm'), org('Earthworm'), org('Milky ribbon worm')],
    funFact:
      "Peanut worms (sipunculans) were classified as their own phylum for over a century, but modern genomics placed them firmly within Annelida — the same phylum as earthworms and lugworms. Despite both being soft marine 'worms', a peanut worm is closer to an earthworm than to a ribbon worm — ribbon worms (nemerteans) belong to an entirely different phylum.",
    sources: [{ url: 'https://en.wikipedia.org/wiki/Peanut_worm', label: 'Peanut worm - Wikipedia' }],
  },
  // Convergent evolution traps (from Wikipedia's convergent evolution list)
  {
    organisms: [
      org('Sugar glider'),
      org('Red kangaroo'),
      org('Flying squirrel'),
    ],
    funFact:
      'Sugar gliders look almost identical to flying squirrels — same size, same gliding membranes, same big eyes — but they are marsupials! Sugar gliders are closer to kangaroos than to any rodent. This is a textbook case of convergent evolution.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Sugar_glider', label: 'Sugar glider - Wikipedia' },
      { url: 'https://evolution.berkeley.edu/examples-of-analogies/squirrels-and-sugar-gliders/', label: 'UC Berkeley - Squirrels and sugar gliders convergent evolution' }],
  },
  {
    organisms: [org('Giant panda'), org('Brown bear'), org('Red panda')],
    funFact:
      'Giant pandas are bears, while red pandas are in the weasel and raccoon family — not closely related at all! Both independently evolved a "false thumb" for gripping bamboo, one of the most famous examples of convergent evolution.',
    sources: [
      { url: 'https://en.wikipedia.org/wiki/Giant_panda#Classification', label: 'Giant panda classification - Wikipedia' },
      { url: 'https://nationalzoo.si.edu/animals/news/red-panda-bear-and-more-red-panda-facts', label: 'Smithsonian Zoo - Red panda facts' },
    ],
  },
  {
    organisms: [
      org('Common woodlouse'),
      org('American lobster'),
      org('Ladybug'),
    ],
    funFact:
      'Woodlice (pill bugs) are crustaceans, not insects! They are isopods, more closely related to lobsters and crabs than to any beetle. They are the most successful group of crustaceans to colonize land.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Woodlouse', label: 'Woodlouse - Wikipedia' }],
  },
  {
    organisms: [org('Malayan tapir'), org('Horse'), org('Cow')],
    funFact:
      'Tapirs look like pigs but are odd-toed ungulates, closely related to horses and rhinos! Their pig-like snout evolved convergently. Cows are even-toed ungulates, a completely separate lineage.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Tapir', label: 'Tapir - Wikipedia' }],
  },
  {
    organisms: [org('Malayan tapir'), org('White rhinoceros'), org('Horse')],
    correctPair: ['Malayan tapir', 'White rhinoceros'],
    funFact:
      "All three are Perissodactyla — odd-toed ungulates — but the tapir and rhino are each other's closest relatives, forming Ceratomorpha. Horses are the odd one out (Equidae), despite horses and rhinos both seeming like the obvious pair: large, powerful, tough-skinned. The pig-snouted tapir turns out to be the rhino's nearest living kin. (NCBI taxonomy leaves Perissodactyla unresolved, but Ceratomorpha is well-established by molecular and morphological evidence.)",
    sources: [{ url: 'https://en.wikipedia.org/wiki/Ceratomorpha', label: 'Ceratomorpha - Wikipedia' }],
  },
  {
    organisms: [org('Common octopus'), org('Human'), org('Moon jellyfish')],
    funFact:
      'Octopuses and humans both evolved complex camera-type eyes independently — one of the most famous examples of convergent evolution. But phylogenetically, both are bilateria, far more related to each other than to jellyfish (cnidaria).',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Cephalopod_eye', label: 'Cephalopod eye - Wikipedia' }],
  },
  {
    organisms: [org('Giant squid'), org('Common octopus'), org('Giant clam')],
    funFact:
      'Squid and octopuses are both cephalopods — the most intelligent invertebrates, with complex brains, camera eyes, and chromatophores for camouflage. Giant clams are bivalves, a much simpler branch of the mollusc family tree.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Cephalopod', label: 'Cephalopod - Wikipedia' }],
  },
  {
    organisms: [org('Giant squid'), org('Garden snail'), org('Earthworm')],
    funFact:
      'The giant squid — with eyes the size of dinner plates and tentacles up to 13 meters long — is a mollusc, just like the humble garden snail! Both share the same body plan at a fundamental level. Earthworms are annelids, a separate phylum.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Giant_squid', label: 'Giant squid - Wikipedia' }],
  },
  {
    organisms: [org('Nautilus'), org('Giant squid'), org('Horseshoe crab')],
    funFact:
      'The nautilus is a living fossil cephalopod — the last surviving lineage with an external shell. It is more closely related to the giant squid than to horseshoe crabs, despite all three looking like armored sea creatures.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Nautilus', label: 'Nautilus - Wikipedia' }],
  },
  // Deep eukaryote / protist surprises
  {
    organisms: [org('Giant kelp'), org('Plasmodium'), org('Thale cress')],
    funFact:
      'Giant kelp is NOT a plant — it is technically a protist! Despite growing 60 meters tall with leaf-like blades, it is a brown alga that evolved photosynthesis independently by engulfing an ancient alga and keeping its chloroplasts (secondary endosymbiosis). Kelp shares a deep common ancestor with the malaria parasite in the SAR supergroup, both completely unrelated to plants.',
    diagram: {
      label: 'Eukaryotes',
      children: [
        {
          label: 'Archaeplastida',
          children: [{ label: 'Plants (thale cress)', highlight: true }],
        },
        { label: 'Opisthokonta (animals, fungi)' },
        {
          label: 'SAR supergroup',
          highlight: true,
          children: [
            {
              label: 'Stramenopiles (giant kelp)',
              highlight: true,
            },
            {
              label: 'Alveolata (Plasmodium)',
              highlight: true,
            },
          ],
        },
      ],
    },
    sources: [{ url: 'https://en.wikipedia.org/wiki/Brown_algae', label: 'Brown algae - Wikipedia' },
      { url: 'https://bio.libretexts.org/Bookshelves/Introductory_and_General_Biology/General_Biology_(Boundless)/23:_Protists/23.03:_Groups_of_Protists/23.3C:_Chromalveolata-_Stramenopiles', label: 'Biology LibreTexts - Stramenopiles' }],
  },
  {
    organisms: [org('Giant kelp'), org('Paramecium'), org('Candida auris')],
    funFact:
      'Giant kelp and paramecium are distant cousins in the same deep branch of life — brown algae and ciliates share an ancient common ancestor in the SAR supergroup. Candida auris may be single-celled like paramecium, but it is a fungus, far more distant from both of them.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/SAR_supergroup', label: 'SAR supergroup - Wikipedia' }],
  },
  // Fungi
  {
    organisms: [org("Baker's yeast"), org('Penicillium'), org('Fly agaric')],
    funFact:
      'Baker\'s yeast and Penicillium mold are both "sac fungi" — they produce spores in tiny sac-like structures. The fly agaric is a "club fungus" that produces spores on club-shaped cells instead. These two types of fungi diverged over 500 million years ago.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Ascomycota', label: 'Ascomycota - Wikipedia' }],
  },
  {
    organisms: [org('Candida auris'), org('Human'), org('Paramecium')],
    funFact:
      'A deadly drug-resistant fungal superbug is more closely related to you than to a paramecium. Fungi and animals are both Opisthokonta — they share a common ancestor that paramecium, on the other side of the eukaryotic tree, does not. The pathogen ravaging hospitals worldwide is, phylogenetically speaking, family.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Opisthokonta', label: 'Opisthokonta - Wikipedia' }],
  },
  {
    organisms: [org('Candida auris'), org('Microsporidian'), org('Plasmodium')],
    funFact:
      'Microsporidia are intracellular parasites so stripped-down they lack mitochondria and were long classified as ancient protists. But they are actually degenerate fungi — closer to Candida auris than to the malaria parasite. Two very different strategies for parasitism, one shared fungal ancestry.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Microsporidia', label: 'Microsporidia - Wikipedia' },
      { url: 'https://journals.asm.org/doi/10.1128/microbiolspec.funk-0018-2016', label: 'ASM Microbiology Spectrum - Microsporidia within the fungal kingdom' }],
  },
  // Plants
  {
    organisms: [org('Bamboo'), org('Rice'), org('Scots pine')],
    funFact:
      'Bamboo is a grass! Despite growing 30 meters tall with woody stems, bamboo is in the family Poaceae alongside rice, wheat, and your lawn. Pines are gymnosperms — a completely separate lineage that diverged over 300 million years ago.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Bamboo', label: 'Bamboo - Wikipedia' }],
  },
  // Echinoderms
  {
    organisms: [org('Sea cucumber'), org('Starfish'), org('Earthworm')],
    funFact:
      'Sea cucumbers are echinoderms — despite their worm-like body, they are closely related to starfish and sea urchins! They have the same five-fold radial symmetry hidden in their body plan and a water vascular system.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Sea_cucumber', label: 'Sea cucumber - Wikipedia' }],
  },
  {
    organisms: [org('Sea cucumber'), org('Sea urchin'), org('Garden snail')],
    funFact:
      'Sea cucumbers, sea urchins, and starfish are all echinoderms — and they are on the same side of the animal family tree as vertebrates. A soft squishy sea cucumber is more closely related to you than to a snail.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Echinoderm', label: 'Echinoderm - Wikipedia' }],
  },
  {
    organisms: [org('Baobab'), org('Cotton'), org('Scots pine')],
    funFact:
      'The massive baobab tree — with trunks up to 11 meters wide — is in the family Malvaceae alongside cotton and hibiscus! Despite one being a towering African icon and the other a fluffy crop, they share a recent common ancestor.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Adansonia', label: 'Adansonia - Wikipedia' }],
  },
  {
    organisms: [org('Coconut palm'), org('Duckweed'), org('English oak')],
    funFact:
      'A 30-meter coconut palm and a 1-centimeter duckweed are both monocots! They share a more recent common ancestor with each other than either does with an oak tree, which is a eudicot.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Monocotyledon', label: 'Monocotyledon - Wikipedia' }],
  },
  {
    organisms: [org('Duckweed'), org('Bamboo'), org('Tomato')],
    funFact:
      'Duckweed — the smallest flowering plant in the world at just a few millimeters — and bamboo — which can grow 30 meters tall — are both monocots! Size tells you nothing about evolutionary relationships.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Lemnoideae', label: 'Duckweed - Wikipedia' }],
  },
  {
    organisms: [org('Orchid'), org('Rice'), org('Snapdragon')],
    funFact:
      'An orchid is more closely related to a rice plant than to a snapdragon — despite orchids and snapdragons both having showy, bilaterally symmetric flowers. Orchids are monocots, on the same branch as grasses, palms, and lilies. Snapdragons are eudicots, on the other side of the flowering plant tree. The similar flower shapes evolved independently.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Orchidaceae', label: 'Orchidaceae - Wikipedia' }],
  },
  {
    organisms: [org('Sunflower'), org('Carrot'), org('Rose')],
    funFact:
      'A sunflower is more closely related to a carrot than to a rose, despite sunflowers and roses both being classic garden flowers. Sunflowers and carrots are both asterids — a huge branch of flowering plants that also includes coffee, mint, and tomatoes. Roses are rosids, a separate branch.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Asterids', label: 'Asterids - Wikipedia' }],
  },
  {
    organisms: [org('Common daisy'), org('Sunflower'), org('Lily')],
    funFact:
      "A daisy and a sunflower are in the same family — the largest family of eudicot plants. What looks like a single flower is actually hundreds of tiny flowers packed into a composite head. Lilies may look more like daisies as simple 'flowers,' but they are monocots — on the grass-and-palm side of the flowering plant tree.",
    sources: [{ url: 'https://en.wikipedia.org/wiki/Asteraceae', label: 'Asteraceae - Wikipedia' }],
  },
  {
    organisms: [org('Common fern'), org('Sunflower'), org('Sphagnum moss')],
    funFact:
      "A fern is more closely related to a sunflower than to a moss. Ferns and flowering plants are both vascular plants — they have internal plumbing to transport water and nutrients. Mosses never evolved this system and diverged from all other land plants over 400 million years ago. Ferns just look 'primitive' because they reproduce with spores instead of seeds.",
    diagram: {
      label: 'Land plants (Embryophyta)',
      children: [
        { label: 'Bryophytes (moss)', highlight: true },
        {
          label: 'Vascular plants (Tracheophyta)',
          highlight: true,
          children: [
            { label: 'Ferns', highlight: true },
            {
              label: 'Seed plants',
              children: [
                { label: 'Gymnosperms (pines)' },
                {
                  label: 'Angiosperms (sunflower)',
                  highlight: true,
                },
              ],
            },
          ],
        },
      ],
    },
    sources: [{ url: 'https://en.wikipedia.org/wiki/Fern', label: 'Fern - Wikipedia' }],
  },
  {
    organisms: [org('Welwitschia'), org('Redwood'), org('Banana')],
    funFact:
      'Welwitschia — a bizarre desert plant that grows only two leaves its entire life, which can last over 1,000 years — is a gymnosperm, on the same branch as redwoods and pines. Despite looking nothing like any conifer, it produces cones and has no flowers. Banana plants are flowering plants, a completely separate lineage.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Welwitschia', label: 'Welwitschia - Wikipedia' },
      { url: 'https://www.britannica.com/plant/tumboa', label: 'Britannica - Welwitschia' }],
  },
  {
    organisms: [org('Ginkgo'), org('Redwood'), org('Common fern')],
    funFact:
      'The ginkgo tree is the last surviving member of a plant group that was diverse during the age of dinosaurs. It is a gymnosperm like redwoods — both produce seeds without flowers — but ginkgos and conifers are on different branches of the gymnosperm tree. Ferns are even more distant, having diverged before seeds evolved at all.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Ginkgo_biloba', label: 'Ginkgo biloba - Wikipedia' },
      { url: 'https://www.nature.com/articles/s41467-019-12133-5', label: 'Nature Communications - Evolutionary history of ginkgo, the living fossil' }],
  },
  {
    organisms: [org('Banana'), org('Wheat'), org('Carrot')],
    funFact:
      'A banana plant and a wheat stalk are both monocots — plants that sprout with a single seed leaf. Despite one being a tropical tree-like herb and the other a temperate grass, they share a more recent ancestor with each other than either does with a carrot, which is a eudicot on the other side of the flowering plant tree.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Monocotyledon', label: 'Monocotyledon - Wikipedia' }],
  },
  {
    organisms: [org('Tomato'), org('Blueberry'), org('Strawberry')],
    funFact:
      "A tomato and a blueberry are more closely related than either is to a strawberry. Tomatoes (nightshade family) and blueberries (heath family) are both asterids — a huge branch of flowering plants. Strawberries are rosids, a completely separate branch. The two 'berries' are not even on the same side of the family tree.",
    sources: [{ url: 'https://en.wikipedia.org/wiki/Asterids', label: 'Asterids - Wikipedia' }],
  },
  {
    organisms: [org('Iris'), org('Orchid'), org('Common daisy')],
    funFact:
      'An iris and an orchid are both monocots — despite looking like typical garden flowers, they are on the grass-and-palm side of the flowering plant tree. A daisy is a eudicot, more closely related to oaks and roses than to either iris or orchid. The showy petals evolved independently in both groups.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Monocotyledon', label: 'Monocotyledon - Wikipedia' }],
  },
  {
    organisms: [org('Corpse lily'), org('Mistletoe'), org('Sphagnum moss')],
    funFact:
      "The corpse lily (Rafflesia) — which produces the world's largest flower at nearly a meter across and smells like rotting meat — is a flowering plant related to mistletoe and poinsettias. It has no leaves, stems, or roots and lives entirely as a parasite inside grapevines. Despite looking like a fungus growing on the forest floor, it is closer to the mistletoe on your doorframe than to any moss.",
    sources: [{ url: 'https://en.wikipedia.org/wiki/Rafflesia', label: 'Rafflesia - Wikipedia' },
      { url: 'https://www.pnas.org/doi/10.1073/pnas.0305562101', label: 'PNAS - Photosynthetic relatives of Rafflesia' }],
  },
  {
    organisms: [org('Dodder'), org('Potato'), org('Corpse lily')],
    funFact:
      'Dodder looks like parasitic orange spaghetti draped over other plants — no leaves, no chlorophyll, just a tangle of vampire vines. But it is a flowering plant in the morning glory family, more closely related to a potato than to the corpse lily. Both dodder and potatoes are asterids; the corpse lily is on a completely different branch. Plants have independently evolved parasitism many times.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Cuscuta', label: 'Cuscuta - Wikipedia' }],
  },
  {
    organisms: [org('Avocado'), org('Cinnamon'), org('Strawberry')],
    funFact:
      'An avocado is more closely related to cinnamon than to a strawberry. Avocados and cinnamon are both in the laurel family — an ancient lineage of flowering plants that split off before most modern flowers evolved. Strawberries are rosids, on a completely different branch. The creamy fruit in your guacamole and the bark in your spice rack are relatives.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Lauraceae', label: 'Lauraceae - Wikipedia' }],
  },
  {
    organisms: [org('Tomato'), org('Potato'), org('Hot pepper')],
    funFact:
      "A tomato is more closely related to a potato than to a hot pepper — despite tomatoes and peppers both being colorful fruits you'd find together in a salsa. Tomatoes and potatoes are both in the genus Solanum, practically siblings. Peppers are in a separate genus (Capsicum) within the same nightshade family. The spicy fruit is the distant cousin; the starchy tuber is the close one.",
    sources: [{ url: 'https://en.wikipedia.org/wiki/Solanum', label: 'Solanum - Wikipedia' }],
  },
  {
    organisms: [org('Indian pipe'), org('Blueberry'), org('Orchid')],
    funFact:
      'Indian pipe is a ghostly white plant with no chlorophyll — it looks like a fungus pushing through the leaf litter. But it is a flowering plant in the heath family, the same family as blueberries and rhododendrons! It gets its energy by parasitizing fungi that are connected to tree roots. Orchids are monocots, far more distant despite also being showy forest plants.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Monotropa_uniflora', label: 'Monotropa uniflora - Wikipedia' }],
  },
  {
    organisms: [org('Tardigrade'), org('Velvet worm'), org('Sea cucumber')],
    funFact:
      'Tardigrades and velvet worms are both panarthropods — relatives of insects and spiders! Velvet worms look like caterpillars and tardigrades look like microscopic gummy bears, but both have legs, molt their cuticle, and share a common ancestor with all arthropods. Sea cucumbers may look blobby and similar, but they are echinoderms — closer to humans than to any bug.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Panarthropoda', label: 'Panarthropoda - Wikipedia' }],
  },
  {
    organisms: [org('Tardigrade'), org('Fruit fly'), org('Sea cucumber')],
    funFact:
      'A microscopic tardigrade is more closely related to a fruit fly than to a sea cucumber! Tardigrades are panarthropods — despite being tiny and blobby, they share a common ancestor with insects, spiders, and crabs. Sea cucumbers are deuterostomes, on the vertebrate side of the animal tree.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Tardigrade', label: 'Tardigrade - Wikipedia' },
      { url: 'https://www.britannica.com/animal/tardigrade', label: 'Britannica - Tardigrade' }],
  },
  {
    organisms: [org('Colugo'), org('Human'), org('Flying squirrel')],
    correctPair: ['Colugo', 'Human'],
    funFact:
      'The closest non-primate relative of humans is a gliding rainforest mammal that looks like a large flying squirrel. Colugos are the closest living relatives of all primates — closer to every human, ape, and monkey than to any rodent, bat, or other mammal. Flying squirrels are rodents; they and colugos evolved near-identical gliding membranes completely independently. (Note: NCBI taxonomy leaves this unresolved, but phylogenetic studies confirm the colugo–primate grouping.)',
    sources: [
      { url: 'https://en.wikipedia.org/wiki/Colugo', label: 'Colugo - Wikipedia' },
      { url: 'https://www.sciencedaily.com/releases/2007/11/071101145003.htm', label: 'ScienceDaily - Flying lemurs are closest relatives of primates' },
    ],
  },
  {
    organisms: [org('Okapi'), org('Giraffe'), org('Horse')],
    funFact:
      "The okapi has striped legs like a zebra and a horse-like body, but it is the giraffe's only living relative! Both are in the family Giraffidae. Horses are odd-toed ungulates, a completely separate lineage of hoofed mammals.",
    sources: [
      { url: 'https://en.wikipedia.org/wiki/Okapi', label: 'Okapi - Wikipedia' },
      { url: 'https://giraffeconservation.org/facts-about-giraffe/what-are-the-closest-relatives-of-giraffe/', label: 'Giraffe Conservation Foundation - Okapi as closest giraffe relative' },
    ],
  },
  {
    organisms: [
      org('Patagonian mara'),
      org('House mouse'),
      org('White-tailed deer'),
    ],
    funFact:
      'The Patagonian mara runs on long slender legs across the Argentine pampas and looks convincingly like a small deer or antelope. It is a rodent, closely related to guinea pigs and capybaras — and therefore closer to a house mouse than to any deer. Everything about its body plan, from its hooves-like nails to its upright gait, is convergent with ungulates.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Patagonian_mara', label: 'Patagonian mara - Wikipedia' }],
  },
  {
    organisms: [org('Shoebill'), org('Brown pelican'), org('Ostrich')],
    funFact:
      'The shoebill was long classified as a stork, but DNA reveals it is closest to pelicans and herons! Both are Pelecaniformes within Neoaves. Ostriches are palaeognaths — among the most ancient living bird lineages.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Shoebill', label: 'Shoebill - Wikipedia' },
      { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC44917/', label: 'PMC - Molecules vs. morphology in pelecaniform birds' }],
  },
  {
    organisms: [org('Wolverine'), org('Raccoon'), org('Brown bear')],
    funFact:
      'Wolverines look like small bears but are mustelids — the weasel family. Raccoons are musteloids, the broader group that includes weasels and their relatives. Both are closer to each other than either is to a bear.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Wolverine', label: 'Wolverine - Wikipedia' },
      { url: 'https://www.britannica.com/animal/wolverine', label: 'Britannica - Wolverine' }],
  },
  {
    organisms: [
      org('Golden mole'),
      org('African elephant'),
      org('European mole'),
    ],
    funFact:
      'Golden moles look identical to European moles — same sleek body, same powerful digging claws, same tiny eyes — but they are more closely related to elephants than to any true mole! Golden moles evolved in Africa alongside elephants and aardvarks; European moles evolved separately alongside shrews and hedgehogs. They arrived at the same body plan independently on different continents.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Golden_mole', label: 'Golden mole - Wikipedia' },
      { url: 'https://www.afrotheria.net/golden-moles/', label: 'IUCN Afrotheria Specialist Group - Golden moles' }],
  },
  {
    organisms: [
      org('Naked mole rat'),
      org('House mouse'),
      org('European mole'),
    ],
    funFact:
      'Naked mole rats live underground like moles, but they are rodents — closer to mice than to any mole! True moles are on a completely different branch of the mammal tree, alongside shrews and hedgehogs. Naked mole rats are in the same order as mice, rats, and guinea pigs.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Naked_mole-rat', label: 'Naked mole-rat - Wikipedia' },
      { url: 'https://nationalzoo.si.edu/animals/naked-mole-rat', label: 'Smithsonian Zoo - Naked mole-rat' }],
  },
  {
    organisms: [org('Tree shrew'), org('Human'), org('Common shrew')],
    funFact:
      'Tree shrews look like shrews but are among the closest living relatives of primates! Despite the name, they are not shrews at all. True shrews are on a completely different branch of the mammal tree, alongside hedgehogs and moles, far from any primate.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Treeshrew', label: 'Treeshrew - Wikipedia' },
      { url: 'https://www.britannica.com/animal/tree-shrew', label: 'Britannica - Tree shrews' }],
  },
  {
    organisms: [org('Hedgehog'), org('Common shrew'), org('Tenrec')],
    funFact:
      "Hedgehogs and shrews are both true insectivores that evolved together in Europe and Asia. Tenrecs independently evolved spines nearly identical to a hedgehog's, but they are African mammals — closer to elephants and aardvarks than to any hedgehog.",
    sources: [{ url: 'https://en.wikipedia.org/wiki/Eulipotyphla', label: 'Eulipotyphla - Wikipedia' }],
  },
  {
    organisms: [
      org('Marsupial mole'),
      org('Red kangaroo'),
      org('European mole'),
    ],
    funFact:
      'The marsupial mole looks identical to a European mole — same tubular body, same shovel-like claws, same vestigial eyes — but it is a marsupial, closer to kangaroos than to any true mole! With golden moles (African relatives of elephants) and European moles (relatives of shrews), that makes three separate lineages on three continents that independently evolved the same burrowing body plan.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Marsupial_mole', label: 'Marsupial mole - Wikipedia' }],
  },
  {
    organisms: [org('Echidna'), org('Platypus'), org('Hedgehog')],
    funFact:
      'Echidnas look like hedgehogs — covered in spines, round, and snuffly — but they are monotremes, egg-laying mammals related to the platypus! Echidna spines and hedgehog spines evolved completely independently. One lays eggs, the other gives live birth.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Echidna', label: 'Echidna - Wikipedia' },
      { url: 'https://www.scientificamerican.com/article/extreme-monotremes/', label: 'Scientific American - Extreme monotremes' }],
  },
  {
    organisms: [org('Aye-aye'), org('Ring-tailed lemur'), org('Brown rat')],
    funFact:
      'The aye-aye looks like a demented rodent — huge ever-growing gnawing teeth, bony fingers, big ears — but it is a primate, a type of lemur! Its rodent-like incisors evolved convergently. Despite looking far more rat-like than any lemur, it shares a recent common ancestor with the ring-tailed lemur.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Aye-aye', label: 'Aye-aye - Wikipedia' },
      { url: 'https://lemur.duke.edu/discover/meet-the-lemurs/aye-aye/', label: 'Duke Lemur Center - Aye-aye' }],
  },
  {
    organisms: [
      org('Pink fairy armadillo'),
      org('Nine-banded armadillo'),
      org('Pangolin'),
    ],
    funFact:
      'The tiny pink fairy armadillo — just 13 cm long with a rosy shell — and the nine-banded armadillo are both part of the same ancient South American group that includes sloths and anteaters. Pangolins look armored too, but their scales evolved completely independently — pangolins are actually closest to carnivores like dogs and cats!',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Pink_fairy_armadillo', label: 'Pink fairy armadillo - Wikipedia' }],
  },
  {
    organisms: [org('Mantisfly'), org('Green lacewing'), org('Praying mantis')],
    funFact:
      'Mantisflies look exactly like praying mantises — same raptorial forelegs, same triangular head, same ambush hunting posture — but they are Neuroptera, closely related to delicate lacewings and antlions! Mantises are in their own order (Mantodea). The two lineages independently evolved the same predatory body plan, one of the most extreme convergences in all of insects.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Mantispidae', label: 'Mantispidae - Wikipedia' }],
  },
  {
    organisms: [org('Myxozoan'), org('Moon jellyfish'), org('Plasmodium')],
    funFact:
      'Myxozoans are microscopic parasites of fish that were classified as protozoans for over a century — but they are actually cnidarians, related to jellyfish! They even retain tiny stinging-cell-like structures (polar capsules) homologous to jellyfish nematocysts. They are the most extremely reduced animals known, having lost nearly every feature we associate with being an animal.',
    sources: [
      { url: 'https://en.wikipedia.org/wiki/Myxozoa', label: 'Myxozoa - Wikipedia' },
      { url: 'https://www.pnas.org/doi/10.1073/pnas.1511468112', label: 'PNAS - Genomic insights into the evolutionary origin of Myxozoa within Cnidaria' },
    ],
  },
  {
    organisms: [org('White shrimp'), org('Monarch butterfly'), org('Scorpion')],
    funFact:
      'A shrimp is more closely related to a butterfly than to a scorpion! Insects actually evolved from within crustaceans, making them "land shrimp" in a sense. Traditional "Crustacea" is not a real group without including insects. Scorpions are chelicerates — on a completely separate branch of arthropods.',
    diagram: {
      label: 'Arthropoda',
      children: [
        {
          label: 'Chelicerata',
          children: [{ label: 'Scorpions, spiders', highlight: true }],
        },
        {
          label: 'Mandibulata',
          children: [
            { label: 'Myriapoda (centipedes)' },
            {
              label: 'Pancrustacea',
              highlight: true,
              children: [
                { label: 'Crustaceans (shrimp)', highlight: true },
                { label: 'Insects (butterfly)', highlight: true },
              ],
            },
          ],
        },
      ],
    },
    sources: [{ url: 'https://en.wikipedia.org/wiki/Pancrustacea', label: 'Pancrustacea - Wikipedia' },
      { url: 'https://academic.oup.com/icb/article/55/5/765/604304', label: 'Integrative and Comparative Biology - Linking insects with Crustacea' }],
  },
  {
    organisms: [org('Coconut crab'), org('Hermit crab'), org('Blue crab')],
    funFact:
      'The coconut crab — the largest land arthropod on Earth, strong enough to crack coconuts — is NOT a true crab. It is a hermit crab that evolved to ditch its shell and grew enormous, convergently evolving a crab-like body. This is carcinization: the repeated, independent evolution of the crab form.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Coconut_crab', label: 'Coconut crab - Wikipedia' },
      { url: 'https://www.nhm.ac.uk/discover/coconut-crabs-bird-eating-giants-on-tropical-islands.html', label: 'Natural History Museum London - Coconut crabs' }],
  },
  {
    organisms: [org('Porcelain crab'), org('Hermit crab'), org('Blue crab')],
    funFact:
      'Porcelain crabs look like perfectly normal small crabs, but they are anomurans — closer to hermit crabs than to any true crab! They independently evolved the crab body plan yet again. Carcinization has happened at least five times: everything, it seems, eventually evolves into a crab.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Porcelain_crab', label: 'Porcelain crab - Wikipedia' }],
  },
  {
    organisms: [org('Foraminiferan'), org('Paramecium'), org('Staghorn coral')],
    funFact:
      'Foraminifera build intricate calcium carbonate shells and can form reef-like structures that look like coral — but they are single-celled protists in the SAR supergroup, closer to paramecium than to any animal! The pyramids of Giza are built from limestone made almost entirely of foram shells.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Foraminifera', label: 'Foraminifera - Wikipedia' }],
  },
  {
    organisms: [org('Foraminiferan'), org('Polycystine'), org('Giant kelp')],
    funFact:
      'Foraminifera (calcium carbonate shells) and polycystines (intricate silica skeletons) are both Rhizaria — single-celled organisms on the same branch of the eukaryotic tree. Giant kelp is also in the SAR supergroup but on a different branch (Stramenopiles). Ernst Haeckel\'s famous "Art Forms in Nature" drawings were largely of polycystine skeletons.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Rhizaria', label: 'Rhizaria - Wikipedia' }],
  },
  {
    organisms: [org('Sea urchin'), org('Foraminiferan'), org('Garden snail')],
    funFact:
      'Sea urchins and foraminifera both have "tests" — hard calcium carbonate shells — but one is a complex animal and the other is a single-celled protist. The word "test" unites them terminologically, but phylogenetically they could not be more different. A snail shell is called something else entirely, despite being made of the same material.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Test_(biology)', label: 'Test (biology) - Wikipedia' }],
  },
  {
    organisms: [org('Copepod'), org('White shrimp'), org('Foraminiferan')],
    funFact:
      'Copepods and foraminifera are both "plankton" drifting in the same drop of seawater, but a copepod is a crustacean — related to shrimp and lobsters — while a foram is a single-celled protist. "Plankton" is an ecological term, not a phylogenetic one. It spans the entire tree of life, from bacteria to baby fish.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Plankton', label: 'Plankton - Wikipedia' }],
  },
  {
    organisms: [org('Diatom'), org('Giant kelp'), org('Polycystine')],
    funFact:
      "A microscopic diatom and a 60-meter giant kelp are both Stramenopiles — the same branch of the eukaryotic tree! Polycystines also have silica shells like diatoms, but are Rhizaria, a completely separate lineage. Diatoms produce about 20% of Earth's oxygen — more than all the world's rainforests.",
    sources: [{ url: 'https://en.wikipedia.org/wiki/Diatom', label: 'Diatom - Wikipedia' }],
  },
  {
    organisms: [org('Xenophyophore'), org('Foraminiferan'), org('Bath sponge')],
    funFact:
      'Xenophyophores are giant blobs up to 20 cm across that carpet the deep seafloor — they look like sponges or corals, but they are single cells! Molecular data revealed they are foraminifera, the same group as the microscopic shelled protists. One of the largest single-celled organisms ever found, and they are not even animals.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Xenophyophorea', label: 'Xenophyophorea - Wikipedia' }],
  },
  {
    organisms: [org('Slime mold'), org('Amoeba'), org('Fly agaric')],
    funFact:
      'Slime molds grow on rotting logs, produce spores, and were classified as fungi for over a century — but they are not fungi at all! They are Amoebozoa, closer to amoebae than to any mushroom. Physarum polycephalum can even solve mazes and optimize networks, despite being a single giant cell with no brain.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Slime_mold', label: 'Slime mold - Wikipedia' },
      { url: 'https://www.nps.gov/articles/000/slime-molds.htm', label: 'National Park Service - Slime molds are not fungi' }],
  },
  {
    organisms: [org('Crinoid'), org('Starfish'), org('Xenophyophore')],
    funFact:
      'Crinoids look like underwater ferns swaying on the seafloor, but they are echinoderms — animals related to starfish and sea urchins! Xenophyophores can look similar from a distance, but they are single-celled foraminifera. On the deep seafloor, nothing is what it seems.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Crinoid', label: 'Crinoid - Wikipedia' }],
  },
  {
    organisms: [org('Sand dollar'), org('Sea urchin'), org('Starfish')],
    funFact:
      'A sand dollar is not just a fellow echinoderm — it is literally a sea urchin. Sand dollars are irregular echinoids (class Echinoidea), the same class as spiny sea urchins, and evolved from a spherical urchin ancestor that flattened out to burrow through sand. Starfish are a separate echinoderm class (Asteroidea), making them more distantly related to sand dollars than sea urchins are.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Sand_dollar', label: 'Sand dollar - Wikipedia' }],
  },
  {
    organisms: [org('Brittle star'), org('Sea urchin'), org('Starfish')],
    funFact:
      'Brittle stars look like skinny starfish, but they are closer to sea urchins! Molecular studies place brittle stars (Ophiuroidea) and sea urchins (Echinoidea) as sister groups, with starfish (Asteroidea) on a more distant branch of the echinoderm tree.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Brittle_star', label: 'Brittle star - Wikipedia' }],
  },
  {
    organisms: [
      org('Greater flamingo'),
      org('Great crested grebe'),
      org('Common loon'),
    ],
    funFact:
      'Grebes and loons are nearly indistinguishable — same diving body, same habitat, same behavior — and were long classified together. But grebes are actually closest relatives of flamingos, not loons! Flamingos and grebes form Mirandornithes ("wonderful birds"), one of the biggest surprises of modern bird phylogenetics.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Mirandornithes', label: 'Mirandornithes - Wikipedia' },
      { url: 'https://www.10000birds.com/exploring-the-relationship-between-flamingos-and-grebes-the-wonderful-birds.htm', label: '10,000 Birds - Flamingos and grebes relationship' }],
  },
  {
    organisms: [org('Microsporidian'), org("Baker's yeast"), org('Paramecium')],
    funFact:
      'Microsporidia are intracellular parasites so reduced they were classified as ancient protists for decades — they lack mitochondria and were thought to be among the most primitive eukaryotes. Molecular data revealed they are actually fungi, extremely reduced relatives of yeast and mushrooms. One of the biggest reclassifications in microbiology.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Microsporidia', label: 'Microsporidia - Wikipedia' }],
  },
  {
    organisms: [org('Hoatzin'), org('Chicken'), org('Common crow')],
    funFact:
      'The hoatzin — a bizarre South American bird whose chicks have clawed wings for climbing — was an evolutionary enigma for over a century. Its phylogenetic position bounced between gamebirds, cuckoos, and turacos. Recent genomic studies finally placed it as one of the earliest-diverging lineages of Neoaves, on its own branch with no close living relatives.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Hoatzin', label: 'Hoatzin - Wikipedia' },
      { url: 'https://www.pnas.org/doi/10.1073/pnas.92.25.11662', label: 'PNAS - Phylogenetic relationships of the hoatzin' }],
  },
  {
    organisms: [org('Caecilian'), org('Human'), org('Earthworm')],
    funFact:
      'Caecilians look identical to earthworms — limbless, burrowing, segmented-looking — but they are vertebrates with a skull, spine, teeth, and eyes (sometimes hidden under bone). A caecilian is closer to a human than to any worm. Most people have never even heard of them, yet there are over 200 species.',
    sources: [
      { url: 'https://en.wikipedia.org/wiki/Caecilian', label: 'Caecilian - Wikipedia' },
      { url: 'https://www.nationalgeographic.com/animals/amphibians/facts/caecilians', label: 'National Geographic - Caecilians: limbless amphibians' },
    ],
  },
  {
    organisms: [org('African lungfish'), org('Human'), org('European eel')],
    funFact:
      'The African lungfish looks almost identical to an eel — long, sinuous, with tiny filamentous fins — but it is a lobe-finned fish more closely related to humans than to any eel. In fact, lungfish are even closer to tetrapods than coelacanths are, sitting right at the base of the lineage that crawled onto land. The eel is a ray-finned fish, separated from us by over 400 million years of evolution.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Protopterus', label: 'Protopterus - Wikipedia' }],
  },
  {
    organisms: [
      org('Three-toed sloth'),
      org('Pink fairy armadillo'),
      org('Koala'),
    ],
    funFact:
      'A slow, fuzzy tree-hugger and a tiny pink armored burrower share a common ancestor that evolved in South America — sloths, armadillos, and anteaters are all part of the same ancient group. Despite looking far more similar to a sloth, koalas are marsupials on a completely different branch of the mammal tree.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Koala', label: 'Koala - Wikipedia' }],
  },
  {
    organisms: [
      org('Aardvark'),
      org('African elephant'),
      org('Giant anteater'),
    ],
    funFact:
      'Aardvarks and giant anteaters do the same job — long snouts, long sticky tongues, powerful claws for ripping open termite mounds — but they are not related at all. Aardvarks are African mammals closer to elephants than to any anteater. Giant anteaters are South American mammals closer to sloths and armadillos. They independently evolved the same ant-eating toolkit on different continents.',
    sources: [
      { url: 'https://en.wikipedia.org/wiki/Aardvark', label: 'Aardvark - Wikipedia' },
      { url: 'https://www.livescience.com/55241-aardvark-facts.html', label: 'Live Science - Aardvark facts' },
    ],
  },
  {
    organisms: [org('Human'), org('Salp'), org('Starfish')],
    funFact:
      'A salp — a transparent, barrel-shaped blob drifting in open ocean — is more closely related to you than a starfish is. Salps are tunicates, which sit inside phylum Chordata as the sister group of all vertebrates. Starfish are Echinodermata, a more distant deuterostome branch. The gelatinous animal pulsing through the sea shares more recent common ancestry with every fish, frog, and human than with any echinoderm.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Olfactores', label: 'Olfactores - Wikipedia' }],
  },
  {
    organisms: [org('Salp'), org('Sea squirt'), org('Moon jellyfish')],
    funFact:
      'Salps look exactly like jellyfish — transparent, pulsing, drifting through the open ocean — but they are tunicates, chordates with a notochord! They are closer to humans than to any jellyfish. Their jet-propulsion swimming and gelatinous body evolved completely independently from cnidarians.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Salp', label: 'Salp - Wikipedia' }],
  },
  {
    organisms: [org('Numbat'), org('Red kangaroo'), org('Giant anteater')],
    funFact:
      'The numbat is a termite-eating Australian marsupial with a long sticky tongue — the same toolkit as aardvarks (from Africa) and anteaters (from South America). Three completely unrelated mammals on three different continents independently evolved the same termite-specialist body plan. The numbat is closer to a kangaroo than to either of them.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Numbat', label: 'Numbat - Wikipedia' }],
  },
  {
    organisms: [
      org("Portuguese man o' war"),
      org('Moon jellyfish'),
      org('Bath sponge'),
    ],
    funFact:
      "The Portuguese man o' war looks like a jellyfish but is not even a single animal — it is a siphonophore, a colony of specialized organisms (zooids) each performing a different function: floating, stinging, digesting, reproducing. It is still a cnidarian like jellyfish, but its colonial nature makes it one of the strangest organisms in the ocean.",
    sources: [
      { url: 'https://en.wikipedia.org/wiki/Portuguese_man_o%27_war', label: "Portuguese man o' war - Wikipedia" },
      { url: 'https://oceanservice.noaa.gov/facts/portuguese-man-o-war.html', label: "NOAA - What is a Portuguese man o' war?" },
    ],
  },
  {
    organisms: [
      org('Vampire squid'),
      org('Common octopus'),
      org('Giant squid'),
    ],
    funFact:
      'The vampire squid is neither a squid nor an octopus — it is the last surviving member of its own order, Vampyromorphida, which diverged before squid and octopus split apart. Its name means "vampire squid from hell," but it is a gentle deep-sea detritivore that eats marine snow.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Vampire_squid', label: 'Vampire squid - Wikipedia' },
      { url: 'https://www.marinebio.org/species/vampire-squid/vampyroteuthis-infernalis/', label: 'MarineBio - Vampire squid' }],
  },
  {
    organisms: [org('Cashew'), org('Mango'), org('Peanut')],
    funFact:
      'Cashews and mangoes are in the same family — Anacardiaceae — alongside poison ivy! Cashew shells even contain urushiol, the same compound that makes poison ivy itch. Most people would pair cashews with peanuts as "nuts," but peanuts are legumes (related to beans), while cashews are closer to the mango on your plate.',
    sources: [
      { url: 'https://en.wikipedia.org/wiki/Anacardiaceae', label: 'Anacardiaceae - Wikipedia' },
      { url: 'https://www.scientificamerican.com/article/what-do-cashews-mangoes-and-poison-ivy-have-in-common/', label: 'Scientific American - Cashews, mangoes, and poison ivy' },
    ],
  },
  {
    organisms: [org('Peanut'), org('Strawberry'), org('Almond')],
    funFact:
      'Peanuts are not nuts — they are legumes, related to beans, lentils, and clover. Almonds are not true nuts either — they are Rosaceae, in the same family as strawberries, roses, and peaches. A peanut is closer to a bean than to any tree nut, and an almond is closer to a strawberry than to a peanut.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Peanut', label: 'Peanut - Wikipedia' }],
  },
  {
    organisms: [org('Oomycete'), org('Diatom'), org('Penicillium')],
    funFact:
      'Oomycetes (water molds) look identical to fungi under a microscope — same filamentous hyphae, same growth pattern — and were classified as fungi for centuries. But they are stramenopiles, closer to photosynthetic diatoms than to any true fungus! Phytophthora infestans caused the Irish potato famine, and it is not even a fungus.',
    diagram: {
      label: 'Eukaryotes',
      children: [
        {
          label: 'Opisthokonta',
          children: [
            { label: 'Fungi (Penicillium)', highlight: true },
            { label: 'Animals' },
          ],
        },
        {
          label: 'SAR supergroup',
          children: [
            {
              label: 'Stramenopiles',
              highlight: true,
              children: [
                { label: 'Oomycetes', highlight: true },
                { label: 'Diatoms', highlight: true },
                { label: 'Brown algae (kelp)' },
              ],
            },
          ],
        },
      ],
    },
    sources: [{ url: 'https://en.wikipedia.org/wiki/Oomycete', label: 'Oomycete - Wikipedia' },
      { url: 'https://ucmp.berkeley.edu/chromista/oomycota.html', label: 'UC Berkeley - Oomycetes are not fungi' }],
  },
  {
    organisms: [
      org('Dromedary camel'),
      org('Blue whale'),
      org('White rhinoceros'),
    ],
    funFact:
      'A camel is more closely related to a whale than to a rhino! Camels are even-toed ungulates (Artiodactyla, with whales, cows, and pigs), while rhinos are odd-toed ungulates (Perissodactyla, with horses and tapirs). Despite camels and rhinos both being large, tough, desert-adapted land mammals, they are on completely different branches.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Camelidae', label: 'Camelidae - Wikipedia' }],
  },
  {
    organisms: [org('White-tailed deer'), org('Hippopotamus'), org('Horse')],
    funFact:
      'A graceful deer and a massive hippo are both even-toed ungulates — closer to each other than either is to a horse! Horses look more deer-like but are odd-toed ungulates, in the same group as rhinos and tapirs. Appearances are deeply misleading when it comes to hoofed mammals.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Artiodactyla', label: 'Artiodactyla - Wikipedia' }],
  },
  {
    organisms: [org('Musk ox'), org('Mountain goat'), org('American bison')],
    funFact:
      'Musk oxen look like massive shaggy bison, but they are Caprinae — closer to mountain goats and sheep than to any bison or cattle! Bison are Bovinae, a separate subfamily. The name "ox" and the bison-like appearance are both misleading.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Muskox', label: 'Muskox - Wikipedia' }],
  },
  {
    organisms: [org('Pronghorn'), org('Giraffe'), org('Impala')],
    correctPair: ['Pronghorn', 'Giraffe'],
    funFact:
      'The pronghorn is called the "American antelope" but is not an antelope at all — it is the sole surviving member of Antilocapridae, closer to giraffes than to any true antelope! Impala and other antelopes are Bovidae (with cattle and goats). The pronghorn\'s family was once diverse across North America, but only one species survives. (NCBI taxonomy leaves Pecora unresolved, but molecular studies consistently group Antilocapridae with Giraffidae.)',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Pronghorn', label: 'Pronghorn - Wikipedia' },
      { url: 'https://www.nps.gov/articles/000/pronghorn.htm', label: 'National Park Service - Pronghorn' }],
  },
  {
    organisms: [org('Green sea turtle'), org('Chicken'), org('Komodo dragon')],
    funFact:
      'Turtles are closer to birds and crocodilians than to lizards! The reptile family tree has two main branches: one leading to lizards and snakes, the other to turtles, dinosaurs, birds, and crocs. Despite looking like the most "primitive" reptile, turtles are on the same branch as a T. rex — not dinosaurs themselves, but the closest relatives of that whole lineage.',
    diagram: {
      label: 'Sauropsida',
      children: [
        {
          label: 'Lepidosauria',
          children: [
            {
              label: 'Lizards, snakes (Komodo dragon)',
              highlight: true,
            },
          ],
        },
        {
          label: 'Archelosauria',
          highlight: true,
          children: [
            { label: 'Turtles (green sea turtle)', highlight: true },
            {
              label: 'Archosauria',
              children: [
                { label: 'Crocodilians' },
                {
                  label: 'Dinosauria',
                  children: [{ label: 'Birds (chicken)', highlight: true }],
                },
              ],
            },
          ],
        },
      ],
    },
    sources: [{ url: 'https://en.wikipedia.org/wiki/Archelosauria', label: 'Archelosauria - Wikipedia' },
      { url: 'https://bmcbiol.biomedcentral.com/articles/10.1186/1741-7007-10-65', label: 'BMC Biology - Turtles are sister group of birds and crocodiles' }],
  },
  {
    organisms: [
      org('Galápagos tortoise'),
      org('Nile crocodile'),
      org('Tuatara'),
    ],
    funFact:
      'Tortoises and tuataras both look like primordial reptiles frozen in time — but they are on opposite sides of the reptile family tree. The tree splits into two main branches: one leading to lizards, snakes, and tuataras, the other to turtles, dinosaurs, birds, and crocs. Despite both looking equally ancient, a tortoise is on the dinosaur side and a tuatara is on the lizard side.',
    diagram: {
      label: 'Sauropsida',
      children: [
        {
          label: 'Lepidosauria',
          children: [
            { label: 'Tuatara', highlight: true },
            { label: 'Lizards, snakes' },
          ],
        },
        {
          label: 'Archelosauria',
          highlight: true,
          children: [
            {
              label: 'Turtles (Galápagos tortoise)',
              highlight: true,
            },
            {
              label: 'Archosauria',
              children: [
                {
                  label: 'Crocodilians (Nile crocodile)',
                  highlight: true,
                },
                { label: 'Dinosauria → Birds' },
              ],
            },
          ],
        },
      ],
    },
    sources: [
      { url: 'https://en.wikipedia.org/wiki/Archelosauria', label: 'Archelosauria - Wikipedia' },
      { url: 'https://bmcbiol.biomedcentral.com/articles/10.1186/1741-7007-10-65', label: 'BMC Biology - Turtles are sister group of birds and crocodiles' },
    ],
  },
  {
    organisms: [
      org('Emperor penguin'),
      org('Snapping turtle'),
      org('Corn snake'),
    ],
    funFact:
      'A penguin is more closely related to a snapping turtle than a snake is — because birds are reptiles. "Reptilia" is not a valid group unless you include birds. The reptile family tree splits into two main branches: lizards and snakes on one side, turtles, dinosaurs, birds, and crocs on the other. The snake is the odd one out.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Reptile#Phylogenetics', label: 'Reptile phylogenetics - Wikipedia' },
      { url: 'https://askabiologist.asu.edu/questions/birds-dinosaurs-reptiles', label: 'ASU Ask A Biologist - Are birds reptiles?' }],
  },
  {
    organisms: [org('Chicken'), org('Emperor penguin'), org('Ostrich')],
    funFact:
      'A chicken and a penguin are more closely related than either is to an ostrich! Both are Neognathae ("new jaws"), while ostriches are Palaeognathae ("old jaws") — among the most ancient living bird lineages. Despite ostriches and penguins both being large and flightless, they lost flight completely independently.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Neognathae', label: 'Neognathae - Wikipedia' }],
  },
  {
    organisms: [org('Olive baboon'), org('Gorilla'), org('Capuchin monkey')],
    funFact:
      'A baboon is closer to a gorilla than to a capuchin — despite baboons and capuchins both being "monkeys"! Baboons and apes both evolved in Africa and Asia, while capuchins are New World monkeys that split off over 40 million years ago. "Monkey" is not a valid evolutionary group unless you include apes.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Catarrhini', label: 'Catarrhini - Wikipedia' }],
  },
  {
    organisms: [org('Red kangaroo'), org('Human'), org('Platypus')],
    funFact:
      'A kangaroo is closer to a human than to a platypus! Despite both being iconic Australian animals, marsupials and placentals are both therians — sharing a common ancestor long after monotremes diverged ~170 million years ago. The platypus is the true outlier among living mammals.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Theria', label: 'Theria - Wikipedia' }],
  },
  {
    organisms: [
      org('Black-tailed prairie dog'),
      org('Flying squirrel'),
      org('American beaver'),
    ],
    funFact:
      'Prairie dogs and flying squirrels are both squirrels (Sciuridae)! A burrowing prairie mammal and a gliding tree mammal are in the same family. Beavers look like similarly chunky rodents but are Castoridae — a completely separate rodent family that diverged tens of millions of years ago.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Sciuridae', label: 'Sciuridae - Wikipedia' }],
  },
  {
    organisms: [
      org('Eastern gray squirrel'),
      org('Black-tailed prairie dog'),
      org('House mouse'),
    ],
    funFact:
      "The squirrel in your yard and a prairie dog are in the same family — Sciuridae! Despite prairie dogs being stocky, burrowing, and colonial, they are tree squirrels' close cousins. Mice look more squirrel-sized and rodent-like, but are in a completely different rodent family (Muridae) that diverged over 70 million years ago.",
    sources: [{ url: 'https://en.wikipedia.org/wiki/Sciuridae', label: 'Sciuridae - Wikipedia' }],
  },
  {
    organisms: [org('Axolotl'), org('Common frog'), org('Caecilian')],
    funFact:
      "Within amphibians, frogs and salamanders (like the axolotl) form a clade called Batrachia — they are each other's closest relatives. Caecilians — limbless, burrowing, worm-like amphibians — represent the earliest-diverging of the three amphibian orders, having split off before frogs and salamanders went their separate ways.",
    sources: [{ url: 'https://en.wikipedia.org/wiki/Batrachia', label: 'Batrachia - Wikipedia' }],
  },
  {
    organisms: [org('Human'), org('Olive baboon'), org('Capuchin monkey')],
    funFact:
      'You are more closely related to a baboon than a capuchin monkey is. Humans and baboons are both "Old World" primates — apes and the monkeys of Africa and Asia. Capuchins are "New World" monkeys that split off over 40 million years ago when South America was a separate continent. The word "monkey" is not a valid evolutionary group unless you include apes and humans in it.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Catarrhini', label: 'Catarrhini - Wikipedia' }],
  },
  {
    organisms: [
      org('Human'),
      org('Australian lungfish'),
      org('Atlantic salmon'),
    ],
    funFact:
      'You are more closely related to a lungfish than a salmon is. Both are called "fish," but "fish" is not a real evolutionary group. Lungfish have fleshy, limb-like fins and are on the same branch as all land animals — the lineage that crawled onto shore. Salmon are ray-finned fish, a completely separate branch. You are literally inside the fish family tree.',
    diagram: {
      label: 'Osteichthyes (bony "fish")',
      children: [
        {
          label: 'Actinopterygii (ray-finned)',
          children: [{ label: 'Salmon', highlight: true }],
        },
        {
          label: 'Sarcopterygii (lobe-finned)',
          highlight: true,
          children: [
            { label: 'Lungfish', highlight: true },
            { label: 'Coelacanths' },
            { label: 'Tetrapods (human)', highlight: true },
          ],
        },
      ],
    },
    sources: [
      { url: 'https://en.wikipedia.org/wiki/Sarcopterygii', label: 'Sarcopterygii - Wikipedia' },
      { url: 'https://www.businessinsider.com/fish-do-not-exist-2016-8', label: 'Business Insider - There is no such thing as a fish' },
    ],
  },
  {
    organisms: [org('Three-toed sloth'), org('Rock hyrax'), org('Gray wolf')],
    correctPair: ['Three-toed sloth', 'Rock hyrax'],
    funFact:
      'A sloth and a hyrax are more closely related to each other than either is to a wolf! Sloths (Xenarthra, from South America) and hyraxes (Afrotheria, from Africa) form a clade called Atlantogenata — named for the Atlantic Ocean that separated their ancestral continents. Wolves belong to Boreoeutheria, the other major branch of placental mammals. (NCBI taxonomy leaves the base of Eutheria unresolved, but large-scale genomic studies strongly support Atlantogenata.)',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Atlantogenata', label: 'Atlantogenata - Wikipedia' }],
  },
  {
    organisms: [
      org('Nile crocodile'),
      org('Ruby-throated hummingbird'),
      org('Komodo dragon'),
    ],
    funFact:
      'A crocodile is actually more closely related to a hummingbird than it is to a monitor lizard! Crocodilians and birds are both archosaurs, sharing a common ancestor that lived long after the split from lepidosaurs (the group containing lizards and snakes).',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Archosauria', label: 'Archosauria - Wikipedia' },
      { url: 'https://www.earth.com/news/crocodiles-birds-archosaurs/', label: 'Earth.com - Crocodiles and birds are archosaurs' }],
  },
  {
    organisms: [
      org('African milk tree'),
      org('Poinsettia'),
      org('Saguaro cactus'),
    ],
    funFact:
      'African milk trees look exactly like cacti — tall, ribbed, thorny, and succulent — but they are Euphorbias, more closely related to Poinsettias (the red Christmas plant) than to any cactus. Cacti and Euphorbias are separated by oceans and millions of years of evolution, yet independently arrived at the same ribbed, leafless, thorny design because it is the most efficient way to store water and defend against thirsty animals in a desert.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Euphorbia', label: 'Euphorbia - Wikipedia' },
      { url: 'https://plantconvergentevolution.weebly.com/convergent-evolution.html', label: 'Convergent evolution of cacti and euphorbias' }],
  },
  {
    organisms: [org('Papaya'), org('Cabbage'), org('Coconut palm')],
    funFact:
      "Despite both being tall tropical trees with massive fruit, the papaya and the coconut palm are total strangers. The papaya is actually just a mustard-flavored weed that grew into a tower — it shares 'mustard oil' DNA (glucosinolates) with cabbage, wasabi, and your coleslaw! They all belong to the order Brassicales.",
    sources: [{ url: 'https://en.wikipedia.org/wiki/Brassicales', label: 'Brassicales - Wikipedia' }],
  },
  {
    organisms: [
      org('American pitcher plant'),
      org('Tropical pitcher plant'),
      org('Blueberry'),
    ],
    funFact:
      'The American pitcher plant (Sarracenia) and the tropical pitcher plant (Nepenthes) both have deep tubes of digestive acid to eat bugs, but they are not related at all! The American ones are closer to blueberries and kiwis (order Ericales), while the Asian ones are closer to buckwheat and rhubarb (order Caryophyllales). Evolution invented the pitcher trap at least five separate times because eating bugs is a great way to get nitrogen in poor soil.',
    sources: [{ url: 'https://en.wikipedia.org/wiki/Pitcher_plant', label: 'Pitcher plant - Wikipedia' },
      { url: 'https://www.science.org/doi/10.1126/science.ade0529', label: 'Science - Convergence in carnivorous pitcher plants' }],
  },
  {
    organisms: [org('Dandelion'), org('Giant groundsel'), org('Scots pine')],
    funFact:
      "The giant groundsel is a 20-foot tall woody tree from Mount Kilimanjaro — and it is basically a dandelion that moved to a mountain and decided to become the boss. Both are in the daisy family (Asteraceae). The pine tree is a completely different branch of life (a gymnosperm) that doesn't even make flowers!",
    sources: [{ url: 'https://en.wikipedia.org/wiki/Dendrosenecio', label: 'Dendrosenecio - Wikipedia' }],
  },
  {
    organisms: [org('Weeping willow'), org('Garden violet'), org('Blueberry')],
    funFact:
      "The ultimate 'size doesn't matter' surprise: the massive drooping willow and the tiny purple violet are in the same order (Malpighiales). A willow is basically a violet that didn't know when to stop growing. The blueberry bush may look more like a willow's size-mate, but it belongs to a completely different order (Ericales).",
    sources: [{ url: 'https://en.wikipedia.org/wiki/Malpighiales', label: 'Malpighiales - Wikipedia' }],
  },
  {
    organisms: [org('Dragon blood tree'), org('Asparagus'), org('Sugar maple')],
    funFact:
      "The bizarre umbrella-shaped dragon blood tree from Yemen is secretly a giant asparagus relative! Both are monocots — plants that sprout with a single seed leaf. The dragon blood tree doesn't have true wood rings; it builds its thick trunk from fibrous tissue. The maple tree, despite looking more like a 'real tree,' is an unrelated eudicot.",
    sources: [{ url: 'https://en.wikipedia.org/wiki/Dracaena_(plant)', label: 'Dracaena - Wikipedia' }],
  },
  // Early animal tree of life — placozoans, acoels, and deep divergences
  {
    organisms: [org('Trichoplax'), org('Bath sponge'), org('Human')],
    funFact:
      'Trichoplax is a flat, transparent animal with no organs, no gut, and no nervous system — it glides over food and digests it externally. Despite this simplicity, most phylogenies place Placozoa as sister to Cnidaria+Bilateria, meaning Trichoplax is more closely related to humans than sponges are.',
    diagram: {
      label: 'Animalia',
      children: [
        { label: 'Porifera (sponge)', highlight: true },
        { label: 'Ctenophora (comb jelly)' },
        {
          label: 'ParaHoxozoa',
          highlight: true,
          children: [
            { label: 'Placozoa (Trichoplax)', highlight: true },
            { label: 'Cnidaria (jellyfish)' },
            { label: 'Bilateria (human)', highlight: true },
          ],
        },
      ],
    },
    sources: [
      { url: 'https://en.wikipedia.org/wiki/Placozoa', label: 'Placozoa - Wikipedia' },
      { url: 'https://www.nature.com/articles/nature07191', label: 'Nature - The Trichoplax genome and the nature of placozoans' },
    ],
  },
  {
    organisms: [org('Trichoplax'), org('Comb jelly'), org('Bath sponge')],
    activelyDebated: true,
    funFact:
      'Sponges have no tissues. Trichoplax has no organs. Comb jellies have nerves and muscles but may have evolved them independently. Which of these lineages branched first from the animal tree remains unresolved — and the answer determines whether the common ancestor of all animals had a nervous system.',
    sources: [
      { url: 'https://en.wikipedia.org/wiki/Placozoa#Phylogenetics', label: 'Placozoa phylogenetics - Wikipedia' },
      { url: 'https://onlinelibrary.wiley.com/doi/full/10.1002/bies.202100080', label: 'BioEssays - The enigmatic Placozoa: evolutionary controversies' },
    ],
  },
  {
    organisms: [org('Acoel flatworm'), org('Planarian'), org('Human')],
    activelyDebated: true,
    funFact:
      'Acoel flatworms and planarians look nearly identical — small, soft worms that glide on surfaces. But molecular data shows they are not closely related. Planarians are protostomes (with insects and molluscs). Acoels belong to Xenacoelomorpha, which may be the sister group to all other bilaterians, representing the deepest split in the bilaterian tree.',
    diagram: {
      label: 'Bilateria',
      children: [
        { label: 'Xenacoelomorpha (acoel)', highlight: true },
        {
          label: 'Nephrozoa',
          highlight: true,
          children: [
            {
              label: 'Protostomia',
              children: [
                { label: 'Platyhelminthes (planarian)', highlight: true },
                { label: 'Arthropods, molluscs...' },
              ],
            },
            {
              label: 'Deuterostomia',
              children: [{ label: 'Chordates (human)', highlight: true }],
            },
          ],
        },
      ],
    },
    sources: [
      { url: 'https://en.wikipedia.org/wiki/Xenacoelomorpha', label: 'Xenacoelomorpha - Wikipedia' },
      { url: 'https://www.nature.com/articles/nature16520', label: 'Nature - Xenacoelomorpha is the sister group to Nephrozoa' },
    ],
  },
  {
    organisms: [org('Hydra'), org('Staghorn coral'), org('Comb jelly')],
    funFact:
      'Hydra and corals are both cnidarians — animals with stinging cells (nematocysts). Hydra is a tiny freshwater polyp and corals build massive reef structures, but they share the same basic body plan. Comb jellies look similar but belong to a separate phylum (Ctenophora) and use sticky colloblast cells instead of stinging ones.',
    sources: [
      { url: 'https://en.wikipedia.org/wiki/Hydra_(genus)', label: 'Hydra - Wikipedia' },
      { url: 'https://biology.ucdavis.edu/news/hydra-and-quest-understand-immortality', label: 'UC Davis - Hydra and the quest to understand immortality' },
    ],
  },
  {
    organisms: [org('Trichoplax'), org('Moon jellyfish'), org('Comb jelly')],
    activelyDebated: true,
    funFact:
      'Trichoplax has no neurons, yet it is a eumetazoan like jellyfish and comb jellies. Did the ancestor of all animals have a nervous system, with Trichoplax and sponges losing it? Or did neurons evolve separately in comb jellies and in the cnidarian+bilaterian lineage? The answer depends on where Placozoa sits relative to Cnidaria and Ctenophora.',
    sources: [
      { url: 'https://en.wikipedia.org/wiki/Evolution_of_nervous_systems', label: 'Evolution of nervous systems - Wikipedia' },
      { url: 'https://www.cell.com/trends/neurosciences/fulltext/S0166-2236(22)00180-1', label: 'Trends in Neurosciences - Ctenophores and the evolutionary origin(s) of neurons' },
    ],
  },
  {
    organisms: [org('Acoel flatworm'), org('Starfish'), org('Fruit fly')],
    activelyDebated: true,
    funFact:
      'Where acoels sit on the animal tree has been debated for over 20 years. Some analyses place Xenacoelomorpha as sister to all other bilaterians (Nephrozoa hypothesis), making the acoel equally distant from starfish and flies. Others nest them inside deuterostomes, closer to starfish. The answer shapes our picture of what the last common ancestor of bilaterians looked like.',
    sources: [
      { url: 'https://en.wikipedia.org/wiki/Xenacoelomorpha#Phylogenetic_position', label: 'Xenacoelomorpha phylogenetic position - Wikipedia' },
      { url: 'https://link.springer.com/article/10.1007/s13127-015-0239-1', label: 'Organisms Diversity & Evolution - Acoelomorpha: earliest branching bilaterians or deuterostomes?' },
    ],
  },
  {
    organisms: [org('Planarian'), org('Pork tapeworm'), org('Acoel flatworm')],
    funFact:
      'Planarians and tapeworms are both flatworms (Platyhelminthes), despite looking and living very differently — one is a free-living predator, the other an internal parasite with no gut. The acoel resembles a planarian more than a tapeworm does, but it belongs to a separate phylum (Xenacoelomorpha) near the base of the bilaterian tree.',
    sources: [
      { url: 'https://en.wikipedia.org/wiki/Platyhelminthes', label: 'Platyhelminthes - Wikipedia' },
      { url: 'https://elifesciences.org/articles/05503', label: 'eLife - Nuclear genomic signals of platyhelminth evolutionary innovation' },
    ],
  },
  {
    organisms: [org('Myxozoan'), org('Comb jelly'), org('Bath sponge')],
    funFact:
      'The myxozoan and comb jelly are both eumetazoans (animals with true tissues), while sponges lack tissues entirely. Within eumetazoans, the myxozoan is a cnidarian — a jellyfish relative reduced to a few cells — while the comb jelly belongs to a separate phylum (Ctenophora).',
    sources: [
      { url: 'https://en.wikipedia.org/wiki/Myxozoa', label: 'Myxozoa - Wikipedia' },
      { url: 'https://www.smithsonianmag.com/smart-news/parasite-really-micro-jellyfish-180957326/', label: 'Smithsonian - This parasite is really a micro-jellyfish' },
    ],
  },
  // Termites and fleas — reclassified insects
  {
    organisms: [org('Termite'), org('American cockroach'), org('Honeybee')],
    funFact:
      'Termites are cockroaches. Molecular phylogenetics showed that termites are nested within Blattodea (the cockroach order), and they were reclassified in 2007. Their closest living relative is the wood-eating cockroach Cryptocercus, which shares the same gut bacteria. Termites are essentially social cockroaches that evolved a caste system.',
    diagram: {
      label: 'Neoptera',
      children: [
        {
          label: 'Polyneoptera',
          children: [
            {
              label: 'Blattodea (cockroaches)',
              highlight: true,
              children: [
                { label: 'Cockroaches', highlight: true },
                { label: 'Termitoidae (termites)', highlight: true },
              ],
            },
          ],
        },
        {
          label: 'Endopterygota',
          children: [
            { label: 'Hymenoptera (bees, ants)', highlight: true },
            { label: 'Beetles, flies...' },
          ],
        },
      ],
    },
    sources: [
      { url: 'https://en.wikipedia.org/wiki/Termite', label: 'Termite - Wikipedia' },
      { url: 'https://www.smithsonianmag.com/smart-news/termites-are-moving-cockroaches-taxonomically-180968332/', label: 'Smithsonian - Termites are moving in with cockroaches' },
      { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC2464702/', label: 'PMC - Termites are eusocial cockroaches' },
    ],
  },
  {
    organisms: [org('Cat flea'), org('Scorpionfly'), org('Dragonfly')],
    funFact:
      'Fleas and scorpionflies are both holometabolous insects (undergoing complete metamorphosis), while dragonflies are not — they develop through incomplete metamorphosis. Recent molecular studies go further, showing fleas are likely nested within Mecoptera (scorpionflies), making them highly modified, wingless, blood-sucking scorpionflies rather than a separate order.',
    sources: [
      { url: 'https://en.wikipedia.org/wiki/Flea', label: 'Flea - Wikipedia' },
      { url: 'https://www.mapress.com/pe/article/view/palaeoentomology.3.6.16', label: 'Palaeoentomology - Fleas are parasitic scorpionflies' },
    ],
  },
]
