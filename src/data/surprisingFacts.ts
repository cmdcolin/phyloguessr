import { organisms } from './organisms.ts'

import type { Organism } from './organisms.ts'

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
      'Humans are more closely related to mushrooms than to plants! Animals and fungi share a more recent common ancestor than either does with plants — we split from fungi long after plants went their own way.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Opisthokonta',
    sourceLabel: 'Opisthokonta - Wikipedia',
  },
  {
    organisms: [org('Human'), org('Sea urchin'), org('Fruit fly')],
    funFact:
      'Humans and sea urchins are both deuterostomes — a group of animals whose embryos develop the same way, forming the anus before the mouth. Insects develop the other way around, putting them on a completely different branch of the animal tree.',
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
    organisms: [org('Common bat'), org('Cow'), org('Human')],
    funFact:
      'A bat is more closely related to a cow than to a human. Bats and cows are both Laurasiatheria — the superorder that also includes dogs, cats, horses, and whales. Humans are Euarchontoglires, a completely separate placental mammal branch. The flapping, echolocating creature shares more recent ancestry with your steak than with you.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Laurasiatheria',
    sourceLabel: 'Laurasiatheria - Wikipedia',
  },
  {
    organisms: [
      org('Aardvark'),
      org('West Indian manatee'),
      org('Nine-banded armadillo'),
    ],
    funFact:
      'An aardvark digging up termite mounds in Africa shares more recent common ancestry with a manatee drifting through Caribbean seagrass than either does with a nine-banded armadillo — which has a nearly identical lifestyle to the aardvark. Aardvarks and manatees are both Afrotheria; armadillos are Xenarthra, one of the most ancient and separate placental mammal lineages.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Afrotheria',
    sourceLabel: 'Afrotheria - Wikipedia',
  },
  {
    organisms: [org('Harbor seal'), org('Brown bear'), org('Domestic cat')],
    funFact:
      'Seals are more closely related to bears than to cats! Seals and bears are both on the "dog side" of the carnivore family tree, while cats are on the other side. Seals actually evolved from bear-like ancestors.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Caniformia',
    sourceLabel: 'Caniformia - Wikipedia',
  },
  {
    organisms: [org('Common shrew'), org('Domestic cat'), org('House mouse')],
    funFact:
      'Despite looking like tiny mice, shrews are closer to cats than to mice! Shrews and cats share an ancestor from the same ancient group of mammals, while mice and rodents are on a completely different branch — the same branch as primates.',
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
    organisms: [
      org('Chicken'),
      org('American alligator'),
      org('Komodo dragon'),
    ],
    funFact:
      'A chicken and an alligator are closer relatives than either is to a Komodo dragon. Birds and crocodilians are both archosaurs; lizards and snakes are squamates, a completely separate reptile lineage.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Archosaur',
    sourceLabel: 'Archosaur - Wikipedia',
  },
  {
    organisms: [org('Blue whale'), org('Cow'), org('Horse')],
    funFact:
      'Whales evolved from the same group of hoofed mammals as cows, hippos, and pigs — they are essentially aquatic even-toed ungulates! Horses split off much earlier as odd-toed ungulates.',
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
  {
    organisms: [org('Common octopus'), org('Garden snail'), org('Starfish')],
    funFact:
      'Octopuses and snails are both molluscs! Despite octopuses having complex brains and no shell, they share a common ancestor with humble snails. Starfish are echinoderms, far more distant.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Mollusca',
    sourceLabel: 'Mollusca - Wikipedia',
  },
  {
    organisms: [
      org('Staghorn coral'),
      org('Moon jellyfish'),
      org('Garden snail'),
    ],
    funFact:
      'Corals and jellyfish are both cnidarians — animals with stinging cells. Despite corals looking like rocks, they are closer to jellyfish than to any shelled creature.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Cnidaria',
    sourceLabel: 'Cnidaria - Wikipedia',
  },
  {
    organisms: [org('Seahorse'), org('Clownfish'), org('Great white shark')],
    funFact:
      'Seahorses and clownfish are both bony fish (Osteichthyes). Sharks have cartilaginous skeletons and diverged from bony fish over 400 million years ago.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Osteichthyes',
    sourceLabel: 'Osteichthyes - Wikipedia',
  },
  {
    organisms: [org('Platypus'), org('Human'), org('Common frog')],
    funFact:
      'Despite laying eggs and having a bill, the platypus is a mammal — it produces milk and has fur. It diverged from other mammals about 170 million years ago, but is still far closer to us than to any amphibian.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Monotreme',
    sourceLabel: 'Monotreme - Wikipedia',
  },
  {
    organisms: [org('Gray wolf'), org('Harbor seal'), org('Domestic cat')],
    funFact:
      'Wolves and seals are both on the "dog side" of the carnivore family tree! Seals evolved from bear-like ancestors, making them closer to wolves than to cats.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Caniformia',
    sourceLabel: 'Caniformia - Wikipedia',
  },
  {
    organisms: [org('Nautilus'), org('Giant clam'), org('Horseshoe crab')],
    funFact:
      'The nautilus and the giant clam are both molluscs, despite one being a shelled swimmer and the other a sedentary filter feeder. Horseshoe crabs are chelicerates — closer to spiders.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Mollusca',
    sourceLabel: 'Mollusca - Wikipedia',
  },
  {
    organisms: [org('Starfish'), org('Sea urchin'), org('Common octopus')],
    funFact:
      'Starfish and sea urchins are both echinoderms — they share five-fold radial symmetry and a water vascular system. Octopuses are molluscs, a completely separate phylum.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Echinoderm',
    sourceLabel: 'Echinoderm - Wikipedia',
  },
  {
    organisms: [org('Hippopotamus'), org('Blue whale'), org('Cow')],
    funFact:
      'Hippos are the closest living relatives of whales! They share an ancestor that lived about 55 million years ago. Cows diverged from this lineage much earlier.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Hippopotamus#Evolution',
    sourceLabel: 'Hippopotamus evolution - Wikipedia',
  },
  {
    organisms: [
      org('Elephant shrew'),
      org('African elephant'),
      org('Common shrew'),
    ],
    funFact:
      'Despite being named "shrews" and looking like mice, elephant shrews are Afrotheria — more closely related to actual elephants than to true shrews!',
    sourceUrl: 'https://en.wikipedia.org/wiki/Elephant_shrew',
    sourceLabel: 'Elephant shrew - Wikipedia',
  },
  {
    organisms: [org('Tenrec'), org('African elephant'), org('Hedgehog')],
    funFact:
      'Tenrecs look almost identical to hedgehogs but are Afrotheria, closer to elephants! This is one of the most striking examples of convergent evolution in mammals.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Tenrecidae',
    sourceLabel: 'Tenrecidae - Wikipedia',
  },
  {
    organisms: [
      org('Australian lungfish'),
      org('Common frog'),
      org('Atlantic salmon'),
    ],
    funFact:
      'The Australian lungfish breathes air and can survive in stagnant, oxygen-poor water. It is a lobe-finned fish — more closely related to a frog than to a salmon. The lineage that became all land vertebrates passed through something that looked like this.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Lungfish',
    sourceLabel: 'Lungfish - Wikipedia',
  },
  {
    organisms: [org('Greater flamingo'), org('Rock pigeon'), org('Bald eagle')],
    funFact:
      'Flamingos and pigeons are surprisingly close relatives — DNA studies show they share a recent common ancestor. Eagles are in a separate branch of birds, despite seeming more "interesting" than a pigeon.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Columbaves',
    sourceLabel: 'Columbaves - Wikipedia',
  },
  {
    organisms: [
      org('Bottlenose dolphin'),
      org('Hippopotamus'),
      org('Harbor seal'),
    ],
    funFact:
      'Dolphins and hippos share an ancestor — whales actually evolved from the same group of hoofed mammals as hippos. Seals may look aquatic too, but they evolved from a completely different lineage (carnivores, like bears and dogs).',
    sourceUrl: 'https://en.wikipedia.org/wiki/Cetartiodactyla',
    sourceLabel: 'Cetartiodactyla - Wikipedia',
  },
  {
    organisms: [org('Maned wolf'), org('Gray wolf'), org('Red fox')],
    funFact:
      "The maned wolf looks like a fox on stilts and is named after a wolf, but it is neither. It belongs to its own genus Chrysocyon and is the sole surviving member of a South American canid lineage. Despite appearances, it is not closely related to gray wolves (Canis) or red foxes (Vulpes) — those two are more closely related to each other than either is to the maned wolf.",
    sourceUrl: 'https://en.wikipedia.org/wiki/Maned_wolf',
    sourceLabel: 'Maned wolf - Wikipedia',
  },
  {
    organisms: [org('Gray wolf'), org('Raccoon'), org('Domestic cat')],
    funFact:
      'Wolves and raccoons are both on the "dog side" of the carnivore family tree. Despite raccoons seeming like a unique oddball, they share a more recent ancestor with wolves than cats do.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Caniformia',
    sourceLabel: 'Caniformia - Wikipedia',
  },
  {
    organisms: [org('Spotted hyena'), org('Domestic cat'), org('Gray wolf')],
    funFact:
      'Despite looking and acting like dogs, hyenas are on the "cat side" of the carnivore family tree — they are more closely related to cats than to wolves! Their dog-like appearance is a classic case of convergent evolution.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Hyena#Evolution',
    sourceLabel: 'Hyena evolution - Wikipedia',
  },
  {
    organisms: [org('Red panda'), org('Raccoon'), org('Lion')],
    funFact:
      'Red pandas and raccoons are both on the "dog side" of the carnivore family tree, in the same group as weasels. Despite "panda" in the name, red pandas are not related to giant pandas (which are bears).',
    sourceUrl: 'https://en.wikipedia.org/wiki/Red_panda#Taxonomy',
    sourceLabel: 'Red panda taxonomy - Wikipedia',
  },
  {
    organisms: [org('Common genet'), org('Lion'), org('Egyptian mongoose')],
    funFact:
      'The common genet looks uncannily like a small spotted wild cat — slim body, spotted coat, retractile claws, solitary hunter. But genets are Viverridae, the civet family, which branched off from the lineage leading to true cats very early in Feliformia. A genet is closer to a mongoose than to a lion.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Common_genet',
    sourceLabel: 'Common genet - Wikipedia',
  },
  {
    organisms: [org('Binturong'), org('Lion'), org('Brown bear')],
    funFact:
      "The binturong is nicknamed the 'bearcat' — and it looks the part, with a stocky bear-like body and a cat-like face. Yet it belongs to Viverridae (the civet family) and is Feliformia, the same suborder as lions and domestic cats. Brown bears are Caniformia — the bear is actually on the 'dog side' of Carnivora, making the binturong more closely related to a lion than to a bear.",
    sourceUrl: 'https://en.wikipedia.org/wiki/Binturong',
    sourceLabel: 'Binturong - Wikipedia',
  },
  {
    organisms: [org('Fossa'), org('Lion'), org('Egyptian mongoose')],
    funFact:
      "The fossa of Madagascar looks exactly like a small wild cat — sleek build, retractile claws, solitary ambush hunting. But it belongs to Eupleridae, a family far more closely related to the Egyptian mongoose than to any true cat. It's a striking case of convergent evolution: a mongoose relative that evolved cat-like traits to fill the apex predator role on an island with no true cats.",
    sourceUrl: 'https://en.wikipedia.org/wiki/Fossa_(animal)',
    sourceLabel: 'Fossa - Wikipedia',
  },
  {
    organisms: [org('Walrus'), org('Brown bear'), org('Harbor seal')],
    funFact:
      'Walruses and harbor seals are both pinnipeds, but pinnipeds are Caniformia — the bear-and-dog suborder of Carnivora. All pinnipeds evolved from a terrestrial ancestor they share with bears and dogs, making a walrus more closely related to a brown bear than to any dolphin or whale.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Pinniped#Evolution',
    sourceLabel: 'Pinniped evolution - Wikipedia',
  },
  {
    organisms: [org('Human'), org('House mouse'), org('Domestic cat')],
    funFact:
      'You are more closely related to a mouse than to your cat. Humans and mice are both Euarchontoglires — the same superorder as all primates, rodents, and rabbits. Cats are Laurasiatheria, a completely different placental branch that also includes dogs, horses, bats, and whales.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Euarchontoglires',
    sourceLabel: 'Euarchontoglires - Wikipedia',
  },
  {
    organisms: [
      org('Human'),
      org('Philippine tarsier'),
      org('Ring-tailed lemur'),
    ],
    funFact:
      'Tarsiers are "dry-nosed" primates like us — despite their huge eyes and tiny size, they are closer to humans than lemurs are. Lemurs are "wet-nosed" primates, an older branch that split off earlier.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Haplorhini',
    sourceLabel: 'Haplorhini - Wikipedia',
  },
  {
    organisms: [org('Gorilla'), org('Human'), org('Orangutan')],
    funFact:
      'Gorillas are our second-closest living relative after chimps. The gorilla lineage split from ours ~8 million years ago; orangutans split ~14 million years ago — making gorillas about twice as recently related to us as orangutans.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Hominidae',
    sourceLabel: 'Hominidae - Wikipedia',
  },
  {
    organisms: [org('Human'), org('European rabbit'), org('Brown bear')],
    funFact:
      'Rabbits are closer to primates than to bears! Rabbits and rodents are on the same major branch of the mammal family tree as primates, while bears are on a completely separate branch.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Glires',
    sourceLabel: 'Glires - Wikipedia',
  },
  {
    organisms: [org('Brown rat'), org('House mouse'), org('European rabbit')],
    funFact:
      'Rats and mice are in the same family! Despite rabbits looking more like large mice, rabbits are not rodents at all — they are in their own separate order with hares and pikas.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Muridae',
    sourceLabel: 'Muridae - Wikipedia',
  },
  // Surprising plant relationships
  {
    organisms: [org('Ocotillo'), org('Blueberry'), org('Tomato')],
    funFact:
      'The spiny desert ocotillo and the bog-loving blueberry are both in the order Ericales! This remarkably diverse order also includes tea, kiwi, and Brazil nuts.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Ericales',
    sourceLabel: 'Ericales - Wikipedia',
  },
  {
    organisms: [org('Cotton'), org('Cacao'), org('Tomato')],
    funFact:
      'Cotton and chocolate (cacao) are in the same family — Malvaceae! This family also includes okra, durian, and hibiscus. They were only united after DNA studies.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Malvaceae',
    sourceLabel: 'Malvaceae - Wikipedia',
  },
  {
    organisms: [
      org('Venus flytrap'),
      org('Saguaro cactus'),
      org('English oak'),
    ],
    funFact:
      'Venus flytraps and cacti are both in the order Caryophyllales! This bizarrely diverse group also includes spinach, bougainvillea, carnations, and buckwheat.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Caryophyllales',
    sourceLabel: 'Caryophyllales - Wikipedia',
  },
  {
    organisms: [org('Spinach'), org('Saguaro cactus'), org('Pumpkin')],
    funFact:
      'Spinach and cacti are both Caryophyllales — a salad green and a desert succulent in the same order! Their common ancestor likely had adaptations to drought and salt stress.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Caryophyllales',
    sourceLabel: 'Caryophyllales - Wikipedia',
  },
  {
    organisms: [org('Sacred lotus'), org('English oak'), org('Water lily')],
    funFact:
      'Despite looking nearly identical to water lilies, the sacred lotus is actually closer to oak trees! Molecular studies moved lotus out of the water lily order into Proteales. One of the biggest surprises of plant phylogenetics.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Nelumbo',
    sourceLabel: 'Nelumbo - Wikipedia',
  },
  {
    organisms: [org('Strawberry'), org('Rose'), org('Pumpkin')],
    funFact:
      'Strawberries and roses are in the same family — Rosaceae! This family also includes almonds, apples, cherries, peaches, and raspberries.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Rosaceae',
    sourceLabel: 'Rosaceae - Wikipedia',
  },
  {
    organisms: [org('Almond'), org('Strawberry'), org('Mango')],
    funFact:
      'Almonds and strawberries are both Rosaceae — the rose family. Despite one being a stone fruit from a tree and the other a ground-level accessory fruit, they share a common ancestor.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Rosaceae',
    sourceLabel: 'Rosaceae - Wikipedia',
  },
  // "Your Inner Fish" — deep chordate ancestry
  {
    organisms: [org('Sea squirt'), org('Human'), org('Common octopus')],
    funFact:
      'Sea squirts are our relatives! As larvae, they have a notochord (primitive backbone), making them chordates like us. As adults they attach to rocks and digest their own brains — but they are still closer to humans than to any mollusc.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Tunicate',
    sourceLabel: 'Tunicate - Wikipedia',
  },
  {
    organisms: [org('Sea squirt'), org('Atlantic salmon'), org('Lancelet')],
    funFact:
      'A blob stuck to a rock is closer to a salmon than a lancelet is! Sea squirts (tunicates) are the closest invertebrate relatives of all vertebrates, including jawed fish. Despite lancelets looking far more fish-like, DNA evidence shows tunicates are our nearest invertebrate cousins.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Olfactores',
    sourceLabel: 'Olfactores - Wikipedia',
  },
  {
    organisms: [org('Lancelet'), org('Atlantic salmon'), org('Sea urchin')],
    funFact:
      'The tiny, translucent lancelet is the closest living invertebrate relative of all vertebrates. It has a notochord but no true spine — a living snapshot of what our ancestors looked like before evolving bones.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Lancelet',
    sourceLabel: 'Lancelet - Wikipedia',
  },
  {
    organisms: [org('Acorn worm'), org('Starfish'), org('Common octopus')],
    funFact:
      'Acorn worms and starfish are both on "our side" of the animal family tree — their embryos develop mouth-second, just like ours do. Acorn worms even have gill slits similar to those in fish and human embryos.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Hemichordata',
    sourceLabel: 'Hemichordata - Wikipedia',
  },
  {
    organisms: [org('Great white shark'), org('Human'), org('Lancelet')],
    funFact:
      'You share more with a shark than you might think. Sharks and humans are both jawed vertebrates — your jaw, teeth, and inner ear all trace back to a common ancestor with sharks over 450 million years ago. Lancelets split off even earlier, before jaws evolved.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Gnathostomata',
    sourceLabel: 'Gnathostomata - Wikipedia',
  },
  {
    organisms: [org('Axolotl'), org('Human'), org('Atlantic salmon')],
    funFact:
      'As Neil Shubin describes in "Your Inner Fish," the limb bones in your arm (humerus, radius, ulna) are homologous to the same bones in an axolotl\'s leg — inherited from a common ancestor that crawled out of water ~375 million years ago.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Your_Inner_Fish',
    sourceLabel: 'Your Inner Fish - Wikipedia',
  },
  // Weird insect ones
  {
    organisms: [org('Honeybee'), org('Ant'), org('Monarch butterfly')],
    funFact:
      'Ants are wingless wasps — and so are bees. Both are Hymenoptera. Butterflies are Lepidoptera, a completely separate insect order.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Hymenoptera',
    sourceLabel: 'Hymenoptera - Wikipedia',
  },
  {
    organisms: [org('Dragonfly'), org('Monarch butterfly'), org('Honeybee')],
    funFact:
      'Butterflies and bees both undergo complete metamorphosis — transforming from larva to pupa to adult. Dragonflies are far more ancient and skip the pupa stage entirely, making them a more primitive branch of insects.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Holometabolism',
    sourceLabel: 'Holometabolism - Wikipedia',
  },
  {
    organisms: [org('Ladybug'), org('Fruit fly'), org('Dragonfly')],
    funFact:
      'Ladybugs (beetles) and fruit flies both undergo complete metamorphosis — egg, larva, pupa, adult. Dragonflies diverged over 300 million years ago, before insects evolved the pupal stage.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Endopterygota',
    sourceLabel: 'Endopterygota - Wikipedia',
  },
  // Jellyfish, sponges, corals, and deep animal phylogeny
  {
    organisms: [org('Bath sponge'), org('Human'), org('Thale cress')],
    funFact:
      'Sponges are animals! Despite having no organs, muscles, or nervous system, sponges are on the animal branch of the tree of life. They are more closely related to you than to any plant.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Porifera',
    sourceLabel: 'Porifera - Wikipedia',
  },
  {
    organisms: [org('Comb jelly'), org('Moon jellyfish'), org('Bath sponge')],
    funFact:
      'Comb jellies look like jellyfish but are NOT cnidarians — they are Ctenophora, a completely separate phylum. Some studies suggest ctenophores, not sponges, are the most ancient animal lineage.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Ctenophora',
    sourceLabel: 'Ctenophora - Wikipedia',
  },
  {
    organisms: [org('Sea anemone'), org('Staghorn coral'), org('Comb jelly')],
    funFact:
      'Sea anemones and corals are both cnidarians — animals with stinging cells. Comb jellies may look similar but belong to a completely separate phylum (Ctenophora) that diverged over 600 million years ago.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Cnidaria',
    sourceLabel: 'Cnidaria - Wikipedia',
  },
  {
    organisms: [org('Starfish'), org('Human'), org('Moon jellyfish')],
    funFact:
      'Starfish are on "our side" of the animal family tree! Despite looking alien, starfish share a more recent common ancestor with humans than with jellyfish. Their larvae are even bilaterally symmetric — like us — before transforming into their star shape.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Deuterostome',
    sourceLabel: 'Deuterostome - Wikipedia',
  },
  {
    organisms: [org('Sea urchin'), org('Acorn worm'), org('Moon jellyfish')],
    funFact:
      'Sea urchins and acorn worms both develop the same way as humans in the embryo — forming the mouth second. This shared embryonic blueprint connects them despite looking nothing alike.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Ambulacraria',
    sourceLabel: 'Ambulacraria - Wikipedia',
  },
  {
    organisms: [org('Moon jellyfish'), org('Sea anemone'), org('Bath sponge')],
    funFact:
      'Jellyfish and sea anemones are both cnidarians with stinging nematocysts. Sponges lack true tissues entirely — they are the most structurally simple animals, representing a lineage that diverged before nerves and muscles evolved.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Porifera',
    sourceLabel: 'Porifera - Wikipedia',
  },
  {
    organisms: [org('Staghorn coral'), org('Sea anemone'), org('Starfish')],
    funFact:
      'Corals and sea anemones are close relatives — both are stinging animals that stay anchored in place. Starfish may live on reefs too, but they are on the vertebrate side of the animal tree, far more related to us than to any coral.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Anthozoa',
    sourceLabel: 'Anthozoa - Wikipedia',
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
    sourceUrl: 'https://en.wikipedia.org/wiki/Pangolin#Taxonomy',
    sourceLabel: 'Pangolin taxonomy - Wikipedia',
  },
  {
    organisms: [org('Barnacle'), org('American lobster'), org('Garden snail')],
    funFact:
      'Barnacles are crustaceans, not molluscs! Despite their hard shells and sedentary lifestyle making them look like limpets, barnacles are related to lobsters, crabs, and shrimp. Charles Darwin spent 8 years studying them.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Barnacle',
    sourceLabel: 'Barnacle - Wikipedia',
  },
  {
    organisms: [org('Common limpet'), org('Garden snail'), org('Barnacle')],
    funFact:
      'Limpets look exactly like barnacles — both are conical, both clamp onto rocks in the surf zone — but a limpet is a gastropod mollusc, essentially a snail with a flattened shell. Barnacles are crustaceans, related to crabs and shrimp. The similar shape evolved independently to handle the same wave-battered habitat.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Limpet',
    sourceLabel: 'Limpet - Wikipedia',
  },
  {
    organisms: [org('Red king crab'), org('Hermit crab'), org('Blue crab')],
    funFact:
      'King crabs are NOT true crabs — they are actually hermit crabs that evolved a crab-like body shape! This is called "carcinization," and it has happened at least five times independently in crustacean evolution.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Carcinisation',
    sourceLabel: 'Carcinisation - Wikipedia',
  },
  {
    organisms: [org('Earthworm'), org('Common octopus'), org('Pork tapeworm')],
    funFact:
      'Earthworms and octopuses share a more recent common ancestor than either does with tapeworms. Despite all being soft-bodied invertebrates, tapeworms are flatworms — a completely separate lineage. The word "worm" means nothing phylogenetically!',
    sourceUrl: 'https://en.wikipedia.org/wiki/Lophotrochozoa',
    sourceLabel: 'Lophotrochozoa - Wikipedia',
  },
  {
    organisms: [org('Sea lamprey'), org('Great white shark'), org('Lancelet')],
    funFact:
      'Lampreys are jawless but they are true vertebrates — they have a skull and spinal column. Lampreys and sharks are both vertebrates, while lancelets lack a backbone entirely. Your inner fish goes very deep.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Lamprey',
    sourceLabel: 'Lamprey - Wikipedia',
  },
  {
    organisms: [org('Earthworm'), org('Garden snail'), org('Pork tapeworm')],
    funFact:
      'Earthworms and snails are more closely related than you might think — their embryos share a distinctive spiral pattern of cell division. Tapeworms may look more worm-like, but they are flatworms, a much more distant lineage.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Spiralia',
    sourceLabel: 'Spiralia - Wikipedia',
  },
  {
    organisms: [org('Shipworm'), org('Giant clam'), org('Earthworm')],
    funFact:
      "Shipworms bore through wooden ship hulls and dock pilings with a long, naked, worm-like body — but they are bivalve molluscs, a kind of clam. They even retain two tiny vestigial shells at the head end. A shipworm is more closely related to a giant clam than to any earthworm.",
    sourceUrl: 'https://en.wikipedia.org/wiki/Shipworm',
    sourceLabel: 'Shipworm - Wikipedia',
  },
  {
    organisms: [org('Priapulid'), org('Fruit fly'), org('Earthworm')],
    funFact:
      'Priapulids (penis worms) are marine burrowing worms that look superficially like earthworms, but they are Ecdysozoa — the same major group as insects, nematodes, and arthropods. A priapulid is more closely related to a fruit fly than to an earthworm, which is Lophotrochozoa.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Priapulida',
    sourceLabel: 'Priapulida - Wikipedia',
  },
  {
    organisms: [org('Peanut worm'), org('Earthworm'), org('Garden snail')],
    funFact:
      'Peanut worms (sipunculans) were classified as their own phylum for over a century, but modern genomics placed them firmly within Annelida — the same phylum as earthworms and lugworms. They are closer to an earthworm than to a garden snail, despite looking like a featureless tube that retracts into a peanut shape when threatened.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Peanut_worm',
    sourceLabel: 'Peanut worm - Wikipedia',
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
    sourceUrl: 'https://en.wikipedia.org/wiki/Sugar_glider',
    sourceLabel: 'Sugar glider - Wikipedia',
  },
  {
    organisms: [org('Giant panda'), org('Brown bear'), org('Red panda')],
    funFact:
      'Giant pandas are bears, while red pandas are in the weasel and raccoon family — not closely related at all! Both independently evolved a "false thumb" for gripping bamboo, one of the most famous examples of convergent evolution.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Giant_panda#Classification',
    sourceLabel: 'Giant panda classification - Wikipedia',
  },
  {
    organisms: [
      org('Common woodlouse'),
      org('American lobster'),
      org('Ladybug'),
    ],
    funFact:
      'Woodlice (pill bugs) are crustaceans, not insects! They are isopods, more closely related to lobsters and crabs than to any beetle. They are the most successful group of crustaceans to colonize land.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Woodlouse',
    sourceLabel: 'Woodlouse - Wikipedia',
  },
  {
    organisms: [org('Malayan tapir'), org('Horse'), org('Cow')],
    funFact:
      'Tapirs look like pigs but are odd-toed ungulates, closely related to horses and rhinos! Their pig-like snout evolved convergently. Cows are even-toed ungulates, a completely separate lineage.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Tapir',
    sourceLabel: 'Tapir - Wikipedia',
  },
  {
    organisms: [org('Malayan tapir'), org('White rhinoceros'), org('Horse')],
    funFact:
      'All three are Perissodactyla — odd-toed ungulates — but the tapir and rhino are each other\'s closest relatives, forming Ceratomorpha. Horses are the odd one out (Equidae), despite horses and rhinos both seeming like the obvious pair: large, powerful, tough-skinned. The pig-snouted tapir turns out to be the rhino\'s nearest living kin.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Ceratomorpha',
    sourceLabel: 'Ceratomorpha - Wikipedia',
  },
  {
    organisms: [org('Common octopus'), org('Human'), org('Moon jellyfish')],
    funFact:
      'Octopuses and humans both evolved complex camera-type eyes independently — one of the most famous examples of convergent evolution. But phylogenetically, both are bilateria, far more related to each other than to jellyfish (cnidaria).',
    sourceUrl: 'https://en.wikipedia.org/wiki/Cephalopod_eye',
    sourceLabel: 'Cephalopod eye - Wikipedia',
  },
  {
    organisms: [org('Giant squid'), org('Common octopus'), org('Giant clam')],
    funFact:
      'Squid and octopuses are both cephalopods — the most intelligent invertebrates, with complex brains, camera eyes, and chromatophores for camouflage. Giant clams are bivalves, a much simpler branch of the mollusc family tree.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Cephalopod',
    sourceLabel: 'Cephalopod - Wikipedia',
  },
  {
    organisms: [org('Giant squid'), org('Garden snail'), org('Earthworm')],
    funFact:
      'The giant squid — with eyes the size of dinner plates and tentacles up to 13 meters long — is a mollusc, just like the humble garden snail! Both share the same body plan at a fundamental level. Earthworms are annelids, a separate phylum.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Giant_squid',
    sourceLabel: 'Giant squid - Wikipedia',
  },
  {
    organisms: [org('Nautilus'), org('Giant squid'), org('Horseshoe crab')],
    funFact:
      'The nautilus is a living fossil cephalopod — the last surviving lineage with an external shell. It is more closely related to the giant squid than to horseshoe crabs, despite all three looking like armored sea creatures.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Nautilus',
    sourceLabel: 'Nautilus - Wikipedia',
  },
  // Deep eukaryote / protist surprises
  {
    organisms: [org('Giant kelp'), org('Plasmodium'), org('Thale cress')],
    funFact:
      'Giant kelp is NOT a plant! It is a brown alga — despite growing 60 meters tall with leaf-like blades, it is in a completely different kingdom from plants. Incredibly, kelp shares a deep common ancestor with the malaria parasite, both belonging to a vast group of organisms unrelated to plants.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Brown_algae',
    sourceLabel: 'Brown algae - Wikipedia',
  },
  {
    organisms: [org('Giant kelp'), org('Paramecium'), org('Fly agaric')],
    funFact:
      'Giant kelp and paramecium are distant cousins in the same deep branch of life — brown algae and ciliates share an ancient common ancestor. Despite kelp looking like an ocean plant, it is more closely related to a single-celled paramecium than to any fungus.',
    sourceUrl: 'https://en.wikipedia.org/wiki/SAR_supergroup',
    sourceLabel: 'SAR supergroup - Wikipedia',
  },
  // Fungi
  {
    organisms: [org("Baker's yeast"), org('Penicillium'), org('Fly agaric')],
    funFact:
      'Baker\'s yeast and Penicillium mold are both "sac fungi" — they produce spores in tiny sac-like structures. The fly agaric is a "club fungus" that produces spores on club-shaped cells instead. These two types of fungi diverged over 500 million years ago.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Ascomycota',
    sourceLabel: 'Ascomycota - Wikipedia',
  },
  // Plants
  {
    organisms: [org('Bamboo'), org('Rice'), org('Scots pine')],
    funFact:
      'Bamboo is a grass! Despite growing 30 meters tall with woody stems, bamboo is in the family Poaceae alongside rice, wheat, and your lawn. Pines are gymnosperms — a completely separate lineage that diverged over 300 million years ago.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Bamboo',
    sourceLabel: 'Bamboo - Wikipedia',
  },
  // Echinoderms
  {
    organisms: [org('Sea cucumber'), org('Starfish'), org('Earthworm')],
    funFact:
      'Sea cucumbers are echinoderms — despite their worm-like body, they are closely related to starfish and sea urchins! They have the same five-fold radial symmetry hidden in their body plan and a water vascular system.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Sea_cucumber',
    sourceLabel: 'Sea cucumber - Wikipedia',
  },
  {
    organisms: [org('Sea cucumber'), org('Sea urchin'), org('Garden snail')],
    funFact:
      'Sea cucumbers, sea urchins, and starfish are all echinoderms — and they are on the same side of the animal family tree as vertebrates. A soft squishy sea cucumber is more closely related to you than to a snail.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Echinoderm',
    sourceLabel: 'Echinoderm - Wikipedia',
  },
  {
    organisms: [org('Baobab'), org('Cotton'), org('Scots pine')],
    funFact:
      'The massive baobab tree — with trunks up to 11 meters wide — is in the family Malvaceae alongside cotton and hibiscus! Despite one being a towering African icon and the other a fluffy crop, they share a recent common ancestor.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Adansonia',
    sourceLabel: 'Adansonia - Wikipedia',
  },
  {
    organisms: [org('Coconut palm'), org('Duckweed'), org('English oak')],
    funFact:
      'A 30-meter coconut palm and a 1-centimeter duckweed are both monocots! They share a more recent common ancestor with each other than either does with an oak tree, which is a eudicot.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Monocotyledon',
    sourceLabel: 'Monocotyledon - Wikipedia',
  },
  {
    organisms: [org('Coconut palm'), org('Rice'), org('English oak')],
    funFact:
      'Coconut palms and rice are both monocots — plants with a single seed leaf, parallel-veined leaves, and scattered vascular bundles. Oaks are eudicots, a fundamentally different branch of flowering plants.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Monocotyledon',
    sourceLabel: 'Monocotyledon - Wikipedia',
  },
  {
    organisms: [org('Duckweed'), org('Bamboo'), org('Tomato')],
    funFact:
      'Duckweed — the smallest flowering plant in the world at just a few millimeters — and bamboo — which can grow 30 meters tall — are both monocots! Size tells you nothing about evolutionary relationships.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Lemnoideae',
    sourceLabel: 'Duckweed - Wikipedia',
  },
  {
    organisms: [org('Tardigrade'), org('Velvet worm'), org('Sea cucumber')],
    funFact:
      'Tardigrades and velvet worms are both panarthropods — relatives of insects and spiders! Velvet worms look like caterpillars and tardigrades look like microscopic gummy bears, but both have legs, molt their cuticle, and share a common ancestor with all arthropods. Sea cucumbers may look blobby and similar, but they are echinoderms — closer to humans than to any bug.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Panarthropoda',
    sourceLabel: 'Panarthropoda - Wikipedia',
  },
  {
    organisms: [org('Tardigrade'), org('Fruit fly'), org('Sea cucumber')],
    funFact:
      'A microscopic tardigrade is more closely related to a fruit fly than to a sea cucumber! Tardigrades are panarthropods — despite being tiny and blobby, they share a common ancestor with insects, spiders, and crabs. Sea cucumbers are deuterostomes, on the vertebrate side of the animal tree.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Tardigrade',
    sourceLabel: 'Tardigrade - Wikipedia',
  },
  {
    organisms: [org('Colugo'), org('Human'), org('Flying squirrel')],
    funFact:
      "The closest non-primate relative of humans is a gliding rainforest mammal that looks like a large flying squirrel. Colugos (Dermoptera) are the sister group to all primates — closer to every human, ape, and monkey than to any rodent, bat, or other mammal. Flying squirrels are rodents; they and colugos evolved near-identical gliding membranes completely independently.",
    sourceUrl: 'https://en.wikipedia.org/wiki/Colugo',
    sourceLabel: 'Colugo - Wikipedia',
  },
  {
    organisms: [org('Okapi'), org('Giraffe'), org('Horse')],
    funFact:
      "The okapi has striped legs like a zebra and a horse-like body, but it is the giraffe's only living relative! Both are in the family Giraffidae. Horses are odd-toed ungulates, a completely separate lineage of hoofed mammals.",
    sourceUrl: 'https://en.wikipedia.org/wiki/Okapi',
    sourceLabel: 'Okapi - Wikipedia',
  },
  {
    organisms: [org('Patagonian mara'), org('House mouse'), org('White-tailed deer')],
    funFact:
      'The Patagonian mara runs on long slender legs across the Argentine pampas and looks convincingly like a small deer or antelope. It is a rodent, closely related to guinea pigs and capybaras — and therefore closer to a house mouse than to any deer. Everything about its body plan, from its hooves-like nails to its upright gait, is convergent with ungulates.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Patagonian_mara',
    sourceLabel: 'Patagonian mara - Wikipedia',
  },
  {
    organisms: [org('Shoebill'), org('Brown pelican'), org('Ostrich')],
    funFact:
      'The shoebill was long classified as a stork, but DNA reveals it is closest to pelicans and herons! Both are Pelecaniformes within Neoaves. Ostriches are palaeognaths — among the most ancient living bird lineages.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Shoebill',
    sourceLabel: 'Shoebill - Wikipedia',
  },
  {
    organisms: [org('Wolverine'), org('Raccoon'), org('Brown bear')],
    funFact:
      'Wolverines look like small bears but are mustelids — the weasel family. Raccoons are musteloids, the broader group that includes weasels and their relatives. Both are closer to each other than either is to a bear.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Wolverine',
    sourceLabel: 'Wolverine - Wikipedia',
  },
  {
    organisms: [
      org('Golden mole'),
      org('African elephant'),
      org('European mole'),
    ],
    funFact:
      'Golden moles look identical to European moles — same sleek body, same powerful digging claws, same tiny eyes — but they are Afrotheria, more closely related to elephants than to any true mole! European moles are Eulipotyphla, on a completely different branch of the mammal tree. They evolved the same body plan independently on different continents.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Golden_mole',
    sourceLabel: 'Golden mole - Wikipedia',
  },
  {
    organisms: [
      org('Naked mole rat'),
      org('House mouse'),
      org('European mole'),
    ],
    funFact:
      'Naked mole rats live underground like moles, but they are rodents — closer to mice than to any mole! True moles are Eulipotyphla (with shrews and hedgehogs), while naked mole rats are in the same order as mice, rats, and guinea pigs.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Naked_mole-rat',
    sourceLabel: 'Naked mole-rat - Wikipedia',
  },
  {
    organisms: [org('Tree shrew'), org('Human'), org('Common shrew')],
    funFact:
      'Tree shrews look like shrews but are Euarchonta — among the closest living relatives of primates! Despite the name, they are not shrews at all. True shrews are Eulipotyphla, on the same branch as hedgehogs and moles, far from any primate.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Treeshrew',
    sourceLabel: 'Treeshrew - Wikipedia',
  },
  {
    organisms: [org('Hedgehog'), org('Common shrew'), org('Tenrec')],
    funFact:
      "Hedgehogs and shrews are both Eulipotyphla — true insectivores that evolved together in Laurasia. Tenrecs independently evolved spines nearly identical to a hedgehog's, but they are Afrotheria — closer to elephants and aardvarks than to any hedgehog.",
    sourceUrl: 'https://en.wikipedia.org/wiki/Eulipotyphla',
    sourceLabel: 'Eulipotyphla - Wikipedia',
  },
  {
    organisms: [
      org('Marsupial mole'),
      org('Red kangaroo'),
      org('European mole'),
    ],
    funFact:
      'The marsupial mole looks identical to a European mole — same tubular body, same shovel-like claws, same vestigial eyes — but it is a marsupial, closer to kangaroos than to any true mole! With golden moles (Afrotheria) and European moles (Eulipotyphla), that makes three separate lineages on three continents that independently evolved the same burrowing body plan.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Marsupial_mole',
    sourceLabel: 'Marsupial mole - Wikipedia',
  },
  {
    organisms: [org('Echidna'), org('Platypus'), org('Hedgehog')],
    funFact:
      'Echidnas look like hedgehogs — covered in spines, round, and snuffly — but they are monotremes, egg-laying mammals related to the platypus! Echidna spines and hedgehog spines evolved completely independently. One lays eggs, the other gives live birth.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Echidna',
    sourceLabel: 'Echidna - Wikipedia',
  },
  {
    organisms: [org('Aye-aye'), org('Ring-tailed lemur'), org('Brown rat')],
    funFact:
      'The aye-aye looks like a demented rodent — huge ever-growing gnawing teeth, bony fingers, big ears — but it is a primate, a type of lemur! Its rodent-like incisors evolved convergently. Despite looking far more rat-like than any lemur, it shares a recent common ancestor with the ring-tailed lemur.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Aye-aye',
    sourceLabel: 'Aye-aye - Wikipedia',
  },
  {
    organisms: [
      org('Pink fairy armadillo'),
      org('Nine-banded armadillo'),
      org('Pangolin'),
    ],
    funFact:
      'The tiny pink fairy armadillo — just 13 cm long with a rosy shell — and the nine-banded armadillo are both Xenarthra, an ancient group that includes sloths and anteaters. Pangolins look armored too, but their scales evolved completely independently — pangolins are actually the sister group to all carnivores!',
    sourceUrl: 'https://en.wikipedia.org/wiki/Pink_fairy_armadillo',
    sourceLabel: 'Pink fairy armadillo - Wikipedia',
  },
  {
    organisms: [org('Mantisfly'), org('Green lacewing'), org('Praying mantis')],
    funFact:
      'Mantisflies look exactly like praying mantises — same raptorial forelegs, same triangular head, same ambush hunting posture — but they are Neuroptera, closely related to delicate lacewings and antlions! Mantises are in their own order (Mantodea). The two lineages independently evolved the same predatory body plan, one of the most extreme convergences in all of insects.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Mantispidae',
    sourceLabel: 'Mantispidae - Wikipedia',
  },
  {
    organisms: [org('Strepsipteran'), org('Fruit fly'), org('Ladybug')],
    funFact:
      'Strepsiptera (twisted-wing parasites) are so bizarre they were misclassified for decades — they have fan-shaped hind wings, no front wings, and females live permanently inside other insects. Molecular data finally revealed they are closest relatives of flies (Diptera), shocking entomologists who had placed them near beetles.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Strepsiptera',
    sourceLabel: 'Strepsiptera - Wikipedia',
  },
  {
    organisms: [org('Myxozoan'), org('Moon jellyfish'), org('Plasmodium')],
    funFact:
      'Myxozoans are microscopic parasites of fish that were classified as protozoans for over a century — but they are actually cnidarians, related to jellyfish! They even retain tiny stinging-cell-like structures (polar capsules) homologous to jellyfish nematocysts. They are the most extremely reduced animals known, having lost nearly every feature we associate with being an animal.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Myxozoa',
    sourceLabel: 'Myxozoa - Wikipedia',
  },
  {
    organisms: [org('White shrimp'), org('Monarch butterfly'), org('Scorpion')],
    funFact:
      'A shrimp is more closely related to a butterfly than to a scorpion! Insects actually evolved from within crustaceans, making them "land shrimp" in a sense. Traditional "Crustacea" is not a real group without including insects. Scorpions are chelicerates — on a completely separate branch of arthropods.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Pancrustacea',
    sourceLabel: 'Pancrustacea - Wikipedia',
  },
  {
    organisms: [org('Coconut crab'), org('Hermit crab'), org('Blue crab')],
    funFact:
      'The coconut crab — the largest land arthropod on Earth, strong enough to crack coconuts — is NOT a true crab. It is a hermit crab that evolved to ditch its shell and grew enormous, convergently evolving a crab-like body. This is carcinization: the repeated, independent evolution of the crab form.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Coconut_crab',
    sourceLabel: 'Coconut crab - Wikipedia',
  },
  {
    organisms: [org('Porcelain crab'), org('Hermit crab'), org('Blue crab')],
    funFact:
      'Porcelain crabs look like perfectly normal small crabs, but they are anomurans — closer to hermit crabs than to any true crab! They independently evolved the crab body plan yet again. Carcinization has happened at least five times: everything, it seems, eventually evolves into a crab.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Porcelain_crab',
    sourceLabel: 'Porcelain crab - Wikipedia',
  },
  {
    organisms: [org('Foraminiferan'), org('Paramecium'), org('Staghorn coral')],
    funFact:
      'Foraminifera build intricate calcium carbonate shells and can form reef-like structures that look like coral — but they are single-celled protists in the SAR supergroup, closer to paramecium than to any animal! The pyramids of Giza are built from limestone made almost entirely of foram shells.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Foraminifera',
    sourceLabel: 'Foraminifera - Wikipedia',
  },
  {
    organisms: [org('Foraminiferan'), org('Radiolarian'), org('Giant kelp')],
    funFact:
      'Foraminifera (calcium carbonate shells) and radiolarians (intricate silica skeletons) are both Rhizaria — single-celled organisms on the same branch of the eukaryotic tree. Giant kelp is also in the SAR supergroup but on a different branch (Stramenopiles). Ernst Haeckel\'s famous "Art Forms in Nature" drawings were largely of radiolarian skeletons.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Rhizaria',
    sourceLabel: 'Rhizaria - Wikipedia',
  },
  {
    organisms: [org('Sea urchin'), org('Foraminiferan'), org('Garden snail')],
    funFact:
      'Sea urchins and foraminifera both have "tests" — hard calcium carbonate shells — but one is a complex animal and the other is a single-celled protist. The word "test" unites them terminologically, but phylogenetically they could not be more different. A snail shell is called something else entirely, despite being made of the same material.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Test_(biology)',
    sourceLabel: 'Test (biology) - Wikipedia',
  },
  {
    organisms: [org('Copepod'), org('White shrimp'), org('Foraminiferan')],
    funFact:
      'Copepods and foraminifera are both "plankton" drifting in the same drop of seawater, but a copepod is a crustacean — related to shrimp and lobsters — while a foram is a single-celled protist. "Plankton" is an ecological term, not a phylogenetic one. It spans the entire tree of life, from bacteria to baby fish.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Plankton',
    sourceLabel: 'Plankton - Wikipedia',
  },
  {
    organisms: [org('Diatom'), org('Giant kelp'), org('Radiolarian')],
    funFact:
      "A microscopic diatom and a 60-meter giant kelp are both Stramenopiles — the same branch of the eukaryotic tree! Radiolarians also have silica shells like diatoms, but are Rhizaria, a completely separate lineage. Diatoms produce about 20% of Earth's oxygen — more than all the world's rainforests.",
    sourceUrl: 'https://en.wikipedia.org/wiki/Diatom',
    sourceLabel: 'Diatom - Wikipedia',
  },
  {
    organisms: [org('Xenophyophore'), org('Foraminiferan'), org('Bath sponge')],
    funFact:
      'Xenophyophores are giant blobs up to 20 cm across that carpet the deep seafloor — they look like sponges or corals, but they are single cells! Molecular data revealed they are foraminifera, the same group as the microscopic shelled protists. One of the largest single-celled organisms ever found, and they are not even animals.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Xenophyophorea',
    sourceLabel: 'Xenophyophorea - Wikipedia',
  },
  {
    organisms: [org('Slime mold'), org('Amoeba'), org('Fly agaric')],
    funFact:
      'Slime molds grow on rotting logs, produce spores, and were classified as fungi for over a century — but they are not fungi at all! They are Amoebozoa, closer to amoebae than to any mushroom. Physarum polycephalum can even solve mazes and optimize networks, despite being a single giant cell with no brain.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Slime_mold',
    sourceLabel: 'Slime mold - Wikipedia',
  },
  {
    organisms: [org('Crinoid'), org('Starfish'), org('Xenophyophore')],
    funFact:
      'Crinoids look like underwater ferns swaying on the seafloor, but they are echinoderms — animals related to starfish and sea urchins! Xenophyophores can look similar from a distance, but they are single-celled foraminifera. On the deep seafloor, nothing is what it seems.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Crinoid',
    sourceLabel: 'Crinoid - Wikipedia',
  },
  {
    organisms: [org('Sand dollar'), org('Sea urchin'), org('Starfish')],
    funFact:
      'A sand dollar is not just a fellow echinoderm — it is literally a sea urchin. Sand dollars are irregular echinoids (class Echinoidea), the same class as spiny sea urchins, and evolved from a spherical urchin ancestor that flattened out to burrow through sand. Starfish are a separate echinoderm class (Asteroidea), making them more distantly related to sand dollars than sea urchins are.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Sand_dollar',
    sourceLabel: 'Sand dollar - Wikipedia',
  },
  {
    organisms: [org('Brittle star'), org('Sea urchin'), org('Starfish')],
    funFact:
      'Brittle stars look like skinny starfish, but they are closer to sea urchins! Molecular studies place brittle stars (Ophiuroidea) and sea urchins (Echinoidea) as sister groups, with starfish (Asteroidea) on a more distant branch of the echinoderm tree.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Brittle_star',
    sourceLabel: 'Brittle star - Wikipedia',
  },
  {
    organisms: [org('Komodo dragon'), org('King cobra'), org('Tuatara')],
    funFact:
      'The tuatara looks exactly like a lizard but is the sole survivor of Rhynchocephalia — a reptile order that diverged from lizards and snakes ~250 million years ago. Komodo dragons and king cobras are both squamates; the tuatara just looks like one.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Tuatara',
    sourceLabel: 'Tuatara - Wikipedia',
  },
  {
    organisms: [
      org('Greater flamingo'),
      org('Great crested grebe'),
      org('Common loon'),
    ],
    funFact:
      'Grebes and loons are nearly indistinguishable — same diving body, same habitat, same behavior — and were long classified together. But grebes are actually closest relatives of flamingos, not loons! Flamingos and grebes form Mirandornithes ("wonderful birds"), one of the biggest surprises of modern bird phylogenetics.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Mirandornithes',
    sourceLabel: 'Mirandornithes - Wikipedia',
  },
  {
    organisms: [org('Microsporidian'), org("Baker's yeast"), org('Paramecium')],
    funFact:
      'Microsporidia are intracellular parasites so reduced they were classified as ancient protists for decades — they lack mitochondria and were thought to be among the most primitive eukaryotes. Molecular data revealed they are actually fungi, extremely reduced relatives of yeast and mushrooms. One of the biggest reclassifications in microbiology.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Microsporidia',
    sourceLabel: 'Microsporidia - Wikipedia',
  },
  {
    organisms: [org('Hoatzin'), org('Chicken'), org('Common crow')],
    funFact:
      'The hoatzin — a bizarre South American bird whose chicks have clawed wings for climbing — was an evolutionary enigma for over a century. Its phylogenetic position bounced between gamebirds, cuckoos, and turacos. Recent genomic studies finally placed it as one of the earliest-diverging lineages of Neoaves, on its own branch with no close living relatives.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Hoatzin',
    sourceLabel: 'Hoatzin - Wikipedia',
  },
  {
    organisms: [org('Caecilian'), org('Human'), org('Earthworm')],
    funFact:
      'Caecilians look identical to earthworms — limbless, burrowing, segmented-looking — but they are vertebrates with a skull, spine, teeth, and eyes (sometimes hidden under bone). A caecilian is closer to a human than to any worm. Most people have never even heard of them, yet there are over 200 species.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Caecilian',
    sourceLabel: 'Caecilian - Wikipedia',
  },
  {
    organisms: [org('African lungfish'), org('Human'), org('European eel')],
    funFact:
      'The African lungfish looks almost identical to an eel — long, sinuous, with tiny filamentous fins — but it is a lobe-finned fish more closely related to humans than to any eel. In fact, lungfish are even closer to tetrapods than coelacanths are, sitting right at the base of the lineage that crawled onto land. The eel is a ray-finned fish, separated from us by over 400 million years of evolution.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Protopterus',
    sourceLabel: 'Protopterus - Wikipedia',
  },
  {
    organisms: [
      org('Three-toed sloth'),
      org('Pink fairy armadillo'),
      org('Koala'),
    ],
    funFact:
      'A slow, fuzzy tree-hugger and a tiny pink armored burrower are in the same superorder — Xenarthra! Sloths, armadillos, and anteaters all share a common ancestor that evolved in South America. Despite looking far more similar to a sloth, koalas are marsupials on a completely different branch of the mammal tree.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Koala',
    sourceLabel: 'Koala - Wikipedia',
  },
  {
    organisms: [
      org('Aardvark'),
      org('African elephant'),
      org('Giant anteater'),
    ],
    funFact:
      'Aardvarks and giant anteaters do the same job — long snouts, long sticky tongues, powerful claws for ripping open termite mounds — but they are not related at all. Aardvarks are Afrotheria, closer to elephants than to any anteater. Giant anteaters are Xenarthra, closer to sloths and armadillos. They independently evolved the same ant-eating toolkit on different continents.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Aardvark',
    sourceLabel: 'Aardvark - Wikipedia',
  },
  {
    organisms: [org('Human'), org('Salp'), org('Starfish')],
    funFact:
      'A salp — a transparent, barrel-shaped blob drifting in open ocean — is more closely related to you than a starfish is. Salps are tunicates, which sit inside phylum Chordata as the sister group of all vertebrates. Starfish are Echinodermata, a more distant deuterostome branch. The gelatinous animal pulsing through the sea shares more recent common ancestry with every fish, frog, and human than with any echinoderm.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Olfactores',
    sourceLabel: 'Olfactores - Wikipedia',
  },
  {
    organisms: [org('Salp'), org('Sea squirt'), org('Moon jellyfish')],
    funFact:
      'Salps look exactly like jellyfish — transparent, pulsing, drifting through the open ocean — but they are tunicates, chordates with a notochord! They are closer to humans than to any jellyfish. Their jet-propulsion swimming and gelatinous body evolved completely independently from cnidarians.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Salp',
    sourceLabel: 'Salp - Wikipedia',
  },
  {
    organisms: [org('Numbat'), org('Red kangaroo'), org('Giant anteater')],
    funFact:
      'The numbat is a termite-eating Australian marsupial with a long sticky tongue — the same toolkit as aardvarks (Afrotheria) and anteaters (Xenarthra). Three completely unrelated mammals on three different continents independently evolved the same termite-specialist body plan. The numbat is closer to a kangaroo than to either of them.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Numbat',
    sourceLabel: 'Numbat - Wikipedia',
  },
  {
    organisms: [
      org("Portuguese man o' war"),
      org('Moon jellyfish'),
      org('Bath sponge'),
    ],
    funFact:
      "The Portuguese man o' war looks like a jellyfish but is not even a single animal — it is a siphonophore, a colony of specialized organisms (zooids) each performing a different function: floating, stinging, digesting, reproducing. It is still a cnidarian like jellyfish, but its colonial nature makes it one of the strangest organisms in the ocean.",
    sourceUrl: 'https://en.wikipedia.org/wiki/Portuguese_man_o%27_war',
    sourceLabel: "Portuguese man o' war - Wikipedia",
  },
  {
    organisms: [
      org('Vampire squid'),
      org('Common octopus'),
      org('Giant squid'),
    ],
    funFact:
      'The vampire squid is neither a squid nor an octopus — it is the last surviving member of its own order, Vampyromorphida, which diverged before squid and octopus split apart. Its name means "vampire squid from hell," but it is a gentle deep-sea detritivore that eats marine snow.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Vampire_squid',
    sourceLabel: 'Vampire squid - Wikipedia',
  },
  {
    organisms: [org('Cashew'), org('Mango'), org('Peanut')],
    funFact:
      'Cashews and mangoes are in the same family — Anacardiaceae — alongside poison ivy! Cashew shells even contain urushiol, the same compound that makes poison ivy itch. Most people would pair cashews with peanuts as "nuts," but peanuts are legumes (related to beans), while cashews are closer to the mango on your plate.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Anacardiaceae',
    sourceLabel: 'Anacardiaceae - Wikipedia',
  },
  {
    organisms: [org('Peanut'), org('Strawberry'), org('Almond')],
    funFact:
      'Peanuts are not nuts — they are legumes, related to beans, lentils, and clover. Almonds are not true nuts either — they are Rosaceae, in the same family as strawberries, roses, and peaches. A peanut is closer to a bean than to any tree nut, and an almond is closer to a strawberry than to a peanut.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Peanut',
    sourceLabel: 'Peanut - Wikipedia',
  },
  {
    organisms: [org('Oomycete'), org('Diatom'), org('Penicillium')],
    funFact:
      'Oomycetes (water molds) look identical to fungi under a microscope — same filamentous hyphae, same growth pattern — and were classified as fungi for centuries. But they are stramenopiles, closer to photosynthetic diatoms than to any true fungus! Phytophthora infestans caused the Irish potato famine, and it is not even a fungus.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Oomycete',
    sourceLabel: 'Oomycete - Wikipedia',
  },
  {
    organisms: [
      org('Dromedary camel'),
      org('Blue whale'),
      org('White rhinoceros'),
    ],
    funFact:
      'A camel is more closely related to a whale than to a rhino! Camels are even-toed ungulates (Artiodactyla, with whales, cows, and pigs), while rhinos are odd-toed ungulates (Perissodactyla, with horses and tapirs). Despite camels and rhinos both being large, tough, desert-adapted land mammals, they are on completely different branches.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Camelidae',
    sourceLabel: 'Camelidae - Wikipedia',
  },
  {
    organisms: [org('White-tailed deer'), org('Hippopotamus'), org('Horse')],
    funFact:
      'A graceful deer and a massive hippo are both even-toed ungulates — closer to each other than either is to a horse! Horses look more deer-like but are odd-toed ungulates, in the same group as rhinos and tapirs. Appearances are deeply misleading when it comes to hoofed mammals.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Artiodactyla',
    sourceLabel: 'Artiodactyla - Wikipedia',
  },
  {
    organisms: [org('Musk ox'), org('Mountain goat'), org('American bison')],
    funFact:
      'Musk oxen look like massive shaggy bison, but they are Caprinae — closer to mountain goats and sheep than to any bison or cattle! Bison are Bovinae, a separate subfamily. The name "ox" and the bison-like appearance are both misleading.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Muskox',
    sourceLabel: 'Muskox - Wikipedia',
  },
  {
    organisms: [org('Pronghorn'), org('Giraffe'), org('Impala')],
    funFact:
      'The pronghorn is called the "American antelope" but is not an antelope at all — it is the sole surviving member of Antilocapridae, closer to giraffes than to any true antelope! Impala and other antelopes are Bovidae (with cattle and goats). The pronghorn\'s family was once diverse across North America, but only one species survives.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Pronghorn',
    sourceLabel: 'Pronghorn - Wikipedia',
  },
  {
    organisms: [org('Amoeba'), org('Human'), org('Paramecium')],
    funFact:
      'An amoeba is closer to you than to a paramecium! Amoebozoa is the sister group to Opisthokonta (animals + fungi), while Paramecium is in the SAR supergroup on the other side of the eukaryotic tree. Despite both being "single-celled organisms," they are deeply separated by over a billion years of evolution.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Amorphea',
    sourceLabel: 'Amorphea - Wikipedia',
  },
  {
    organisms: [org('Green sea turtle'), org('Chicken'), org('Komodo dragon')],
    funFact:
      'Turtles are closer to birds than to lizards! Molecular evidence places turtles within Archelosauria, alongside birds and crocodilians. Lizards and snakes are Lepidosauria, a completely separate branch. Despite turtles looking like the quintessential "reptile," they are on the bird side of the reptile tree.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Archelosauria',
    sourceLabel: 'Archelosauria - Wikipedia',
  },
  {
    organisms: [org('Chicken'), org('Emperor penguin'), org('Ostrich')],
    funFact:
      'A chicken and a penguin are more closely related than either is to an ostrich! Both are Neognathae ("new jaws"), while ostriches are Palaeognathae ("old jaws") — among the most ancient living bird lineages. Despite ostriches and penguins both being large and flightless, they lost flight completely independently.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Neognathae',
    sourceLabel: 'Neognathae - Wikipedia',
  },
  {
    organisms: [org('Olive baboon'), org('Gorilla'), org('Capuchin monkey')],
    funFact:
      'A baboon is closer to a gorilla than to a capuchin — despite baboons and capuchins both being "monkeys"! Old World monkeys and apes are both Catarrhini, while New World monkeys (Platyrrhini) split off over 40 million years ago. "Monkey" is not a valid phylogenetic group unless you include apes.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Catarrhini',
    sourceLabel: 'Catarrhini - Wikipedia',
  },
  {
    organisms: [org('Red kangaroo'), org('Human'), org('Platypus')],
    funFact:
      'A kangaroo is closer to a human than to a platypus! Despite both being iconic Australian animals, marsupials and placentals are both therians — sharing a common ancestor long after monotremes diverged ~170 million years ago. The platypus is the true outlier among living mammals.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Theria',
    sourceLabel: 'Theria - Wikipedia',
  },
  {
    organisms: [
      org('Black-tailed prairie dog'),
      org('Flying squirrel'),
      org('American beaver'),
    ],
    funFact:
      'Prairie dogs and flying squirrels are both squirrels (Sciuridae)! A burrowing prairie mammal and a gliding tree mammal are in the same family. Beavers look like similarly chunky rodents but are Castoridae — a completely separate rodent family that diverged tens of millions of years ago.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Sciuridae',
    sourceLabel: 'Sciuridae - Wikipedia',
  },
  {
    organisms: [
      org('Yellow-bellied marmot'),
      org('Black-tailed prairie dog'),
      org('American beaver'),
    ],
    funFact:
      'Marmots and prairie dogs are both ground squirrels — yes, squirrels! Despite looking nothing like the tree squirrels in your yard, they are Sciuridae through and through. Beavers may seem like close relatives (chunky, social, burrowing rodents) but are in a different family entirely.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Marmot',
    sourceLabel: 'Marmot - Wikipedia',
  },
  {
    organisms: [
      org('Eastern gray squirrel'),
      org('Black-tailed prairie dog'),
      org('House mouse'),
    ],
    funFact:
      "The squirrel in your yard and a prairie dog are in the same family — Sciuridae! Despite prairie dogs being stocky, burrowing, and colonial, they are tree squirrels' close cousins. Mice look more squirrel-sized and rodent-like, but are in a completely different rodent family (Muridae) that diverged over 70 million years ago.",
    sourceUrl: 'https://en.wikipedia.org/wiki/Sciuridae',
    sourceLabel: 'Sciuridae - Wikipedia',
  },
]
