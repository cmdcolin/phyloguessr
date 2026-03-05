export interface Organism {
  commonName: string
  scientificName: string
  ncbiTaxId: number
  wikiTitle: string
  group: string
}

export const organisms: Organism[] = [
  // Mammals
  { commonName: 'Lion', scientificName: 'Panthera leo', ncbiTaxId: 9689, wikiTitle: 'Lion', group: 'mammal' },
  { commonName: 'Domestic cat', scientificName: 'Felis catus', ncbiTaxId: 9685, wikiTitle: 'Cat', group: 'mammal' },
  { commonName: 'Gray wolf', scientificName: 'Canis lupus', ncbiTaxId: 9612, wikiTitle: 'Wolf', group: 'mammal' },
  { commonName: 'Brown bear', scientificName: 'Ursus arctos', ncbiTaxId: 9644, wikiTitle: 'Brown_bear', group: 'mammal' },
  { commonName: 'Horse', scientificName: 'Equus caballus', ncbiTaxId: 9796, wikiTitle: 'Horse', group: 'mammal' },
  { commonName: 'African elephant', scientificName: 'Loxodonta africana', ncbiTaxId: 9785, wikiTitle: 'African_elephant', group: 'mammal' },
  { commonName: 'Blue whale', scientificName: 'Balaenoptera musculus', ncbiTaxId: 9771, wikiTitle: 'Blue_whale', group: 'mammal' },
  { commonName: 'Human', scientificName: 'Homo sapiens', ncbiTaxId: 9606, wikiTitle: 'Human', group: 'mammal' },
  { commonName: 'Chimpanzee', scientificName: 'Pan troglodytes', ncbiTaxId: 9598, wikiTitle: 'Chimpanzee', group: 'mammal' },
  { commonName: 'Platypus', scientificName: 'Ornithorhynchus anatinus', ncbiTaxId: 9258, wikiTitle: 'Platypus', group: 'mammal' },
  { commonName: 'Red kangaroo', scientificName: 'Macropus rufus', ncbiTaxId: 9321, wikiTitle: 'Red_kangaroo', group: 'mammal' },
  { commonName: 'Common bat', scientificName: 'Myotis lucifugus', ncbiTaxId: 59463, wikiTitle: 'Little_brown_bat', group: 'mammal' },
  { commonName: 'White rhinoceros', scientificName: 'Ceratotherium simum', ncbiTaxId: 9807, wikiTitle: 'White_rhinoceros', group: 'mammal' },
  { commonName: 'Rock hyrax', scientificName: 'Procavia capensis', ncbiTaxId: 9813, wikiTitle: 'Rock_hyrax', group: 'mammal' },
  { commonName: 'Cow', scientificName: 'Bos taurus', ncbiTaxId: 9913, wikiTitle: 'Cattle', group: 'mammal' },
  { commonName: 'Impala', scientificName: 'Aepyceros melampus', ncbiTaxId: 69293, wikiTitle: 'Impala', group: 'mammal' },
  { commonName: 'Flying squirrel', scientificName: 'Glaucomys volans', ncbiTaxId: 46004, wikiTitle: 'Southern_flying_squirrel', group: 'mammal' },
  { commonName: 'Aardvark', scientificName: 'Orycteropus afer', ncbiTaxId: 9818, wikiTitle: 'Aardvark', group: 'mammal' },
  { commonName: 'West Indian manatee', scientificName: 'Trichechus manatus', ncbiTaxId: 9778, wikiTitle: 'West_Indian_manatee', group: 'mammal' },
  { commonName: 'Nine-banded armadillo', scientificName: 'Dasypus novemcinctus', ncbiTaxId: 9361, wikiTitle: 'Nine-banded_armadillo', group: 'mammal' },
  { commonName: 'Harbor seal', scientificName: 'Phoca vitulina', ncbiTaxId: 9720, wikiTitle: 'Harbor_seal', group: 'mammal' },
  { commonName: 'Common shrew', scientificName: 'Sorex araneus', ncbiTaxId: 42254, wikiTitle: 'Eurasian_shrew', group: 'mammal' },
  { commonName: 'House mouse', scientificName: 'Mus musculus', ncbiTaxId: 10090, wikiTitle: 'House_mouse', group: 'mammal' },
  { commonName: 'Hippopotamus', scientificName: 'Hippopotamus amphibius', ncbiTaxId: 9833, wikiTitle: 'Hippopotamus', group: 'mammal' },
  { commonName: 'Bottlenose dolphin', scientificName: 'Tursiops truncatus', ncbiTaxId: 9739, wikiTitle: 'Common_bottlenose_dolphin', group: 'mammal' },
  { commonName: 'Elephant shrew', scientificName: 'Elephantulus edwardii', ncbiTaxId: 28737, wikiTitle: 'Cape_elephant_shrew', group: 'mammal' },
  { commonName: 'Hedgehog', scientificName: 'Erinaceus europaeus', ncbiTaxId: 9365, wikiTitle: 'European_hedgehog', group: 'mammal' },
  { commonName: 'Tenrec', scientificName: 'Tenrec ecaudatus', ncbiTaxId: 9371, wikiTitle: 'Tailless_tenrec', group: 'mammal' },
  { commonName: 'Raccoon', scientificName: 'Procyon lotor', ncbiTaxId: 9654, wikiTitle: 'Raccoon', group: 'mammal' },
  { commonName: 'Red panda', scientificName: 'Ailurus fulgens', ncbiTaxId: 9649, wikiTitle: 'Red_panda', group: 'mammal' },
  { commonName: 'Spotted hyena', scientificName: 'Crocuta crocuta', ncbiTaxId: 9678, wikiTitle: 'Spotted_hyena', group: 'mammal' },
  { commonName: 'Brown rat', scientificName: 'Rattus norvegicus', ncbiTaxId: 10116, wikiTitle: 'Brown_rat', group: 'mammal' },
  { commonName: 'European rabbit', scientificName: 'Oryctolagus cuniculus', ncbiTaxId: 9986, wikiTitle: 'European_rabbit', group: 'mammal' },
  { commonName: 'Philippine tarsier', scientificName: 'Carlito syrichta', ncbiTaxId: 1868482, wikiTitle: 'Philippine_tarsier', group: 'mammal' },
  { commonName: 'Ring-tailed lemur', scientificName: 'Lemur catta', ncbiTaxId: 9447, wikiTitle: 'Ring-tailed_lemur', group: 'mammal' },
  { commonName: 'Orangutan', scientificName: 'Pongo abelii', ncbiTaxId: 9601, wikiTitle: 'Sumatran_orangutan', group: 'mammal' },
  { commonName: 'Gorilla', scientificName: 'Gorilla gorilla', ncbiTaxId: 9593, wikiTitle: 'Western_gorilla', group: 'mammal' },

  // Birds
  { commonName: 'Bald eagle', scientificName: 'Haliaeetus leucocephalus', ncbiTaxId: 52644, wikiTitle: 'Bald_eagle', group: 'bird' },
  { commonName: 'Chicken', scientificName: 'Gallus gallus', ncbiTaxId: 9031, wikiTitle: 'Chicken', group: 'bird' },
  { commonName: 'Emperor penguin', scientificName: 'Aptenodytes forsteri', ncbiTaxId: 9233, wikiTitle: 'Emperor_penguin', group: 'bird' },
  { commonName: 'Ostrich', scientificName: 'Struthio camelus', ncbiTaxId: 8801, wikiTitle: 'Common_ostrich', group: 'bird' },
  { commonName: 'Hummingbird', scientificName: 'Archilochus colubris', ncbiTaxId: 190676, wikiTitle: 'Ruby-throated_hummingbird', group: 'bird' },
  { commonName: 'Common crow', scientificName: 'Corvus brachyrhynchos', ncbiTaxId: 85066, wikiTitle: 'American_crow', group: 'bird' },
  { commonName: 'Rock pigeon', scientificName: 'Columba livia', ncbiTaxId: 8932, wikiTitle: 'Rock_dove', group: 'bird' },
  { commonName: 'Greater flamingo', scientificName: 'Phoenicopterus roseus', ncbiTaxId: 9214, wikiTitle: 'Greater_flamingo', group: 'bird' },

  // Reptiles
  { commonName: 'Komodo dragon', scientificName: 'Varanus komodoensis', ncbiTaxId: 61221, wikiTitle: 'Komodo_dragon', group: 'reptile' },
  { commonName: 'American alligator', scientificName: 'Alligator mississippiensis', ncbiTaxId: 8496, wikiTitle: 'American_alligator', group: 'reptile' },
  { commonName: 'Green sea turtle', scientificName: 'Chelonia mydas', ncbiTaxId: 8469, wikiTitle: 'Green_sea_turtle', group: 'reptile' },
  { commonName: 'King cobra', scientificName: 'Ophiophagus hannah', ncbiTaxId: 8665, wikiTitle: 'King_cobra', group: 'reptile' },

  // Amphibians
  { commonName: 'Axolotl', scientificName: 'Ambystoma mexicanum', ncbiTaxId: 8296, wikiTitle: 'Axolotl', group: 'amphibian' },
  { commonName: 'Common frog', scientificName: 'Rana temporaria', ncbiTaxId: 8407, wikiTitle: 'Common_frog', group: 'amphibian' },
  { commonName: 'Poison dart frog', scientificName: 'Dendrobates tinctorius', ncbiTaxId: 92724, wikiTitle: 'Dyeing_poison_dart_frog', group: 'amphibian' },

  // Fish
  { commonName: 'Great white shark', scientificName: 'Carcharodon carcharias', ncbiTaxId: 13397, wikiTitle: 'Great_white_shark', group: 'fish' },
  { commonName: 'Clownfish', scientificName: 'Amphiprion ocellaris', ncbiTaxId: 80972, wikiTitle: 'Ocellaris_clownfish', group: 'fish' },
  { commonName: 'Coelacanth', scientificName: 'Latimeria chalumnae', ncbiTaxId: 7897, wikiTitle: 'Coelacanth', group: 'fish' },
  { commonName: 'Seahorse', scientificName: 'Hippocampus kuda', ncbiTaxId: 109280, wikiTitle: 'Seahorse', group: 'fish' },
  { commonName: 'Atlantic salmon', scientificName: 'Salmo salar', ncbiTaxId: 8030, wikiTitle: 'Atlantic_salmon', group: 'fish' },
  { commonName: 'Australian lungfish', scientificName: 'Neoceratodus forsteri', ncbiTaxId: 7899, wikiTitle: 'Australian_lungfish', group: 'fish' },

  // Arthropods (insects and others)
  { commonName: 'Honeybee', scientificName: 'Apis mellifera', ncbiTaxId: 7460, wikiTitle: 'Western_honey_bee', group: 'arthropod' },
  { commonName: 'Monarch butterfly', scientificName: 'Danaus plexippus', ncbiTaxId: 13037, wikiTitle: 'Monarch_butterfly', group: 'arthropod' },
  { commonName: 'Fruit fly', scientificName: 'Drosophila melanogaster', ncbiTaxId: 7227, wikiTitle: 'Drosophila_melanogaster', group: 'arthropod' },
  { commonName: 'Ant', scientificName: 'Formica rufa', ncbiTaxId: 258706, wikiTitle: 'Red_wood_ant', group: 'arthropod' },
  { commonName: 'Ladybug', scientificName: 'Coccinella septempunctata', ncbiTaxId: 41139, wikiTitle: 'Coccinella_septempunctata', group: 'arthropod' },
  { commonName: 'Dragonfly', scientificName: 'Anax junius', ncbiTaxId: 214820, wikiTitle: 'Green_darner', group: 'arthropod' },
  { commonName: 'Horseshoe crab', scientificName: 'Limulus polyphemus', ncbiTaxId: 6850, wikiTitle: 'Atlantic_horseshoe_crab', group: 'arthropod' },
  { commonName: 'Tardigrade', scientificName: 'Hypsibius dujardini', ncbiTaxId: 232323, wikiTitle: 'Tardigrade', group: 'arthropod' },
  { commonName: 'Scorpion', scientificName: 'Pandinus imperator', ncbiTaxId: 55084, wikiTitle: 'Emperor_scorpion', group: 'arthropod' },

  // Other invertebrates
  { commonName: 'Common octopus', scientificName: 'Octopus vulgaris', ncbiTaxId: 6645, wikiTitle: 'Common_octopus', group: 'invertebrate' },
  { commonName: 'Garden snail', scientificName: 'Cornu aspersum', ncbiTaxId: 6535, wikiTitle: 'Cornu_aspersum', group: 'invertebrate' },
  { commonName: 'Nautilus', scientificName: 'Nautilus pompilius', ncbiTaxId: 34573, wikiTitle: 'Chambered_nautilus', group: 'invertebrate' },
  { commonName: 'Giant clam', scientificName: 'Tridacna gigas', ncbiTaxId: 80829, wikiTitle: 'Giant_clam', group: 'invertebrate' },
  { commonName: 'Starfish', scientificName: 'Asterias rubens', ncbiTaxId: 7604, wikiTitle: 'Common_starfish', group: 'invertebrate' },
  { commonName: 'Sea urchin', scientificName: 'Strongylocentrotus purpuratus', ncbiTaxId: 7668, wikiTitle: 'Purple_sea_urchin', group: 'invertebrate' },
  { commonName: 'Moon jellyfish', scientificName: 'Aurelia aurita', ncbiTaxId: 6145, wikiTitle: 'Moon_jellyfish', group: 'invertebrate' },
  { commonName: 'Staghorn coral', scientificName: 'Acropora cervicornis', ncbiTaxId: 6130, wikiTitle: 'Staghorn_coral', group: 'invertebrate' },
  { commonName: 'Bath sponge', scientificName: 'Spongia officinalis', ncbiTaxId: 6049, wikiTitle: 'Spongia_officinalis', group: 'invertebrate' },
  { commonName: 'Sea anemone', scientificName: 'Nematostella vectensis', ncbiTaxId: 45351, wikiTitle: 'Nematostella_vectensis', group: 'invertebrate' },
  { commonName: 'Comb jelly', scientificName: 'Mnemiopsis leidyi', ncbiTaxId: 27849, wikiTitle: 'Mnemiopsis', group: 'invertebrate' },
  { commonName: 'Sea squirt', scientificName: 'Ciona intestinalis', ncbiTaxId: 7719, wikiTitle: 'Ciona_intestinalis', group: 'invertebrate' },
  { commonName: 'Lancelet', scientificName: 'Branchiostoma floridae', ncbiTaxId: 7739, wikiTitle: 'Branchiostoma_floridae', group: 'invertebrate' },
  { commonName: 'Acorn worm', scientificName: 'Saccoglossus kowalevskii', ncbiTaxId: 10224, wikiTitle: 'Saccoglossus_kowalevskii', group: 'invertebrate' },

  // Plants
  { commonName: 'Thale cress', scientificName: 'Arabidopsis thaliana', ncbiTaxId: 3702, wikiTitle: 'Arabidopsis_thaliana', group: 'plant' },
  { commonName: 'English oak', scientificName: 'Quercus robur', ncbiTaxId: 38942, wikiTitle: 'Quercus_robur', group: 'plant' },
  { commonName: 'Pumpkin', scientificName: 'Cucurbita pepo', ncbiTaxId: 3663, wikiTitle: 'Cucurbita_pepo', group: 'plant' },
  { commonName: 'Scots pine', scientificName: 'Pinus sylvestris', ncbiTaxId: 3349, wikiTitle: 'Scots_pine', group: 'plant' },
  { commonName: 'Mango', scientificName: 'Mangifera indica', ncbiTaxId: 29780, wikiTitle: 'Mango', group: 'plant' },
  { commonName: 'Poison ivy', scientificName: 'Toxicodendron radicans', ncbiTaxId: 52860, wikiTitle: 'Toxicodendron_radicans', group: 'plant' },
  { commonName: 'Tomato', scientificName: 'Solanum lycopersicum', ncbiTaxId: 4081, wikiTitle: 'Tomato', group: 'plant' },
  { commonName: 'Ocotillo', scientificName: 'Fouquieria splendens', ncbiTaxId: 13533, wikiTitle: 'Fouquieria_splendens', group: 'plant' },
  { commonName: 'Blueberry', scientificName: 'Vaccinium corymbosum', ncbiTaxId: 69266, wikiTitle: 'Vaccinium_corymbosum', group: 'plant' },
  { commonName: 'Tea plant', scientificName: 'Camellia sinensis', ncbiTaxId: 4442, wikiTitle: 'Camellia_sinensis', group: 'plant' },
  { commonName: 'Cotton', scientificName: 'Gossypium hirsutum', ncbiTaxId: 3635, wikiTitle: 'Gossypium_hirsutum', group: 'plant' },
  { commonName: 'Cacao', scientificName: 'Theobroma cacao', ncbiTaxId: 3641, wikiTitle: 'Theobroma_cacao', group: 'plant' },
  { commonName: 'Venus flytrap', scientificName: 'Dionaea muscipula', ncbiTaxId: 4355, wikiTitle: 'Venus_flytrap', group: 'plant' },
  { commonName: 'Spinach', scientificName: 'Spinacia oleracea', ncbiTaxId: 3562, wikiTitle: 'Spinach', group: 'plant' },
  { commonName: 'Saguaro cactus', scientificName: 'Carnegiea gigantea', ncbiTaxId: 167676, wikiTitle: 'Saguaro', group: 'plant' },
  { commonName: 'Sacred lotus', scientificName: 'Nelumbo nucifera', ncbiTaxId: 4432, wikiTitle: 'Nelumbo_nucifera', group: 'plant' },
  { commonName: 'Water lily', scientificName: 'Nymphaea alba', ncbiTaxId: 4411, wikiTitle: 'Nymphaea_alba', group: 'plant' },
  { commonName: 'Strawberry', scientificName: 'Fragaria vesca', ncbiTaxId: 57918, wikiTitle: 'Fragaria_vesca', group: 'plant' },
  { commonName: 'Almond', scientificName: 'Prunus amygdalus', ncbiTaxId: 32247, wikiTitle: 'Almond', group: 'plant' },
  { commonName: 'Rose', scientificName: 'Rosa gallica', ncbiTaxId: 74632, wikiTitle: 'Rosa_gallica', group: 'plant' },

  // Microorganisms (fungi + protists)
  { commonName: "Baker's yeast", scientificName: 'Saccharomyces cerevisiae', ncbiTaxId: 4932, wikiTitle: 'Saccharomyces_cerevisiae', group: 'microbe' },
  { commonName: 'Fly agaric', scientificName: 'Amanita muscaria', ncbiTaxId: 41956, wikiTitle: 'Amanita_muscaria', group: 'microbe' },
  { commonName: 'Penicillium', scientificName: 'Penicillium chrysogenum', ncbiTaxId: 5076, wikiTitle: 'Penicillium_chrysogenum', group: 'microbe' },
  { commonName: 'Amoeba', scientificName: 'Amoeba proteus', ncbiTaxId: 5775, wikiTitle: 'Amoeba_proteus', group: 'microbe' },
  { commonName: 'Paramecium', scientificName: 'Paramecium caudatum', ncbiTaxId: 5885, wikiTitle: 'Paramecium', group: 'microbe' },
  { commonName: 'Plasmodium', scientificName: 'Plasmodium falciparum', ncbiTaxId: 5833, wikiTitle: 'Plasmodium_falciparum', group: 'microbe' },

]

export function pickThreeOrganisms() {
  const groups = [...new Set(organisms.map(o => o.group))]
  const shuffledGroups = groups.sort(() => Math.random() - 0.5).slice(0, 3)
  return shuffledGroups.map(group => {
    const inGroup = organisms.filter(o => o.group === group)
    return inGroup[Math.floor(Math.random() * inGroup.length)]
  })
}
