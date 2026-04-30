export interface Organism {
  commonName: string
  scientificName: string
  ncbiTaxId: number
  wikiTitle: string
  group: string
  imageUrl?: string
}

export const organisms: Organism[] = [
  // Mammals
  {
    commonName: 'Lion',
    scientificName: 'Panthera leo',
    ncbiTaxId: 9689,
    wikiTitle: 'Lion',
    group: 'mammal',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/020_The_lion_king_Snyggve_in_the_Serengeti_National_Park_Photo_by_Giles_Laurent.jpg/330px-020_The_lion_king_Snyggve_in_the_Serengeti_National_Park_Photo_by_Giles_Laurent.jpg',
  },
  {
    commonName: 'Domestic cat',
    scientificName: 'Felis catus',
    ncbiTaxId: 9685,
    wikiTitle: 'Cat',
    group: 'mammal',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Cat_August_2010-4.jpg/330px-Cat_August_2010-4.jpg',
  },
  {
    commonName: 'Gray wolf',
    scientificName: 'Canis lupus',
    ncbiTaxId: 9612,
    wikiTitle: 'Wolf',
    group: 'mammal',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Huskiesatrest.jpg/500px-Huskiesatrest.jpg',
  },
  {
    commonName: 'Brown bear',
    scientificName: 'Ursus arctos',
    ncbiTaxId: 9644,
    wikiTitle: 'Brown_bear',
    group: 'mammal',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/2010-kodiak-bear-1.jpg/330px-2010-kodiak-bear-1.jpg',
  },
  {
    commonName: 'Horse',
    scientificName: 'Equus caballus',
    ncbiTaxId: 9796,
    wikiTitle: 'Horse',
    group: 'mammal',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Nokota_Horses_cropped.jpg/500px-Nokota_Horses_cropped.jpg',
  },
  {
    commonName: 'African elephant',
    scientificName: 'Loxodonta africana',
    ncbiTaxId: 9785,
    wikiTitle: 'African_elephant',
    group: 'mammal',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/178_Male_African_bush_elephant_in_Etosha_National_Park_Photo_by_Giles_Laurent.jpg/330px-178_Male_African_bush_elephant_in_Etosha_National_Park_Photo_by_Giles_Laurent.jpg',
  },
  {
    commonName: 'Blue whale',
    scientificName: 'Balaenoptera musculus',
    ncbiTaxId: 9771,
    wikiTitle: 'Blue_whale',
    group: 'mammal',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Anim1754_-_Flickr_-_NOAA_Photo_Library.jpg/330px-Anim1754_-_Flickr_-_NOAA_Photo_Library.jpg',
  },
  {
    commonName: 'Human',
    scientificName: 'Homo sapiens',
    ncbiTaxId: 9606,
    wikiTitle: 'Human',
    group: 'mammal',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/6/68/Akha_cropped_hires.JPG',
  },
  {
    commonName: 'Platypus',
    scientificName: 'Ornithorhynchus anatinus',
    ncbiTaxId: 9258,
    wikiTitle: 'Platypus',
    group: 'mammal',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Duck-billed_platypus_%28Ornithorhynchus_anatinus%29_Scottsdale.jpg/330px-Duck-billed_platypus_%28Ornithorhynchus_anatinus%29_Scottsdale.jpg',
  },
  {
    commonName: 'Red kangaroo',
    scientificName: 'Osphranter rufus',
    ncbiTaxId: 9321,
    wikiTitle: 'Red_kangaroo',
    group: 'mammal',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Red_kangaroo_-_melbourne_zoo.jpg/330px-Red_kangaroo_-_melbourne_zoo.jpg',
  },
  {
    commonName: 'Common bat',
    scientificName: 'Myotis lucifugus',
    ncbiTaxId: 59463,
    wikiTitle: 'Little_brown_bat',
    group: 'mammal',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Little_Brown_Myotis_%28cropped%29.JPG/330px-Little_Brown_Myotis_%28cropped%29.JPG',
  },
  {
    commonName: 'White rhinoceros',
    scientificName: 'Ceratotherium simum',
    ncbiTaxId: 9807,
    wikiTitle: 'White_rhinoceros',
    group: 'mammal',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/109_Male_White_rhinoceros_walking_in_the_Kalahari_Desert_of_Namibia_Photo_by_Giles_Laurent.jpg/330px-109_Male_White_rhinoceros_walking_in_the_Kalahari_Desert_of_Namibia_Photo_by_Giles_Laurent.jpg',
  },
  {
    commonName: 'Rock hyrax',
    scientificName: 'Procavia capensis',
    ncbiTaxId: 9813,
    wikiTitle: 'Rock_hyrax',
    group: 'mammal',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/188_Rock_hyrax_in_Damaraland_Photo_by_Giles_Laurent.jpg/330px-188_Rock_hyrax_in_Damaraland_Photo_by_Giles_Laurent.jpg',
  },
  {
    commonName: 'Cow',
    scientificName: 'Bos taurus',
    ncbiTaxId: 9913,
    wikiTitle: 'Cattle',
    group: 'mammal',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Cow_%28Fleckvieh_breed%29_Oeschinensee_Slaunger_2009-07-07.jpg/330px-Cow_%28Fleckvieh_breed%29_Oeschinensee_Slaunger_2009-07-07.jpg',
  },
  {
    commonName: 'Impala',
    scientificName: 'Aepyceros melampus',
    ncbiTaxId: 9897,
    wikiTitle: 'Impala',
    group: 'mammal',
    imageUrl:
      'https://inaturalist-open-data.s3.amazonaws.com/photos/64268875/medium.jpg',
  },
  {
    commonName: 'Flying squirrel',
    scientificName: 'Glaucomys volans',
    ncbiTaxId: 64683,
    wikiTitle: 'Southern_flying_squirrel',
    group: 'mammal',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Southern_Flying_Squirrel_-_Glaucomys_volans%2C_Arlington%2C_Virginia%2C_December_22%2C_2020_%2853406816432%29.jpg/330px-Southern_Flying_Squirrel_-_Glaucomys_volans%2C_Arlington%2C_Virginia%2C_December_22%2C_2020_%2853406816432%29.jpg',
  },
  {
    commonName: 'Aardvark',
    scientificName: 'Orycteropus afer',
    ncbiTaxId: 9818,
    wikiTitle: 'Aardvark',
    group: 'mammal',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Orycteropus_afer_175359469.jpg/330px-Orycteropus_afer_175359469.jpg',
  },
  {
    commonName: 'West Indian manatee',
    scientificName: 'Trichechus manatus',
    ncbiTaxId: 9778,
    wikiTitle: 'West_Indian_manatee',
    group: 'mammal',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Manatee_with_calf.PD_-_colour_corrected.jpg/330px-Manatee_with_calf.PD_-_colour_corrected.jpg',
  },
  {
    commonName: 'Nine-banded armadillo',
    scientificName: 'Dasypus novemcinctus',
    ncbiTaxId: 9361,
    wikiTitle: 'Nine-banded_armadillo',
    group: 'mammal',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Nine-banded_Armadillo_%28Dasypus_novemcinctus%29_%2837649606094%29.jpg/330px-Nine-banded_Armadillo_%28Dasypus_novemcinctus%29_%2837649606094%29.jpg',
  },
  {
    commonName: 'Harbor seal',
    scientificName: 'Phoca vitulina',
    ncbiTaxId: 9720,
    wikiTitle: 'Harbor_seal',
    group: 'mammal',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Common_seal_%28Phoca_vitulina%29_2.jpg/330px-Common_seal_%28Phoca_vitulina%29_2.jpg',
  },
  {
    commonName: 'Walrus',
    scientificName: 'Odobenus rosmarus',
    ncbiTaxId: 9707,
    wikiTitle: 'Walrus',
    group: 'mammal',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Walrus_in_the_Russian_Arctic_National_Park%2C_Novaya_Zemlya_2015-2.jpg/330px-Walrus_in_the_Russian_Arctic_National_Park%2C_Novaya_Zemlya_2015-2.jpg',
  },
  {
    commonName: 'Common shrew',
    scientificName: 'Sorex araneus',
    ncbiTaxId: 42254,
    wikiTitle: 'Eurasian_shrew',
    group: 'mammal',
    imageUrl:
      'https://inaturalist-open-data.s3.amazonaws.com/photos/19163863/medium.jpg',
  },
  {
    commonName: 'House mouse',
    scientificName: 'Mus musculus',
    ncbiTaxId: 10090,
    wikiTitle: 'House_mouse',
    group: 'mammal',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/%D0%9C%D1%8B%D1%88%D1%8C_2.jpg/500px-%D0%9C%D1%8B%D1%88%D1%8C_2.jpg',
  },
  {
    commonName: 'Hippopotamus',
    scientificName: 'Hippopotamus amphibius',
    ncbiTaxId: 9833,
    wikiTitle: 'Hippopotamus',
    group: 'mammal',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Portrait_Hippopotamus_in_the_water.jpg/330px-Portrait_Hippopotamus_in_the_water.jpg',
  },
  {
    commonName: 'Bottlenose dolphin',
    scientificName: 'Tursiops truncatus',
    ncbiTaxId: 9739,
    wikiTitle: 'Common_bottlenose_dolphin',
    group: 'mammal',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Tursiops_truncatus_01-cropped.jpg/330px-Tursiops_truncatus_01-cropped.jpg',
  },
  {
    commonName: 'Elephant shrew',
    scientificName: 'Elephantulus edwardii',
    ncbiTaxId: 28737,
    wikiTitle: 'Cape_elephant_shrew',
    group: 'mammal',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Macroscelides_edwardii_-_1700-1880_-_Print_-_Iconographia_Zoologica_-_Special_Collections_University_of_Amsterdam_-_UBA01_IZ20900065_2.jpg/330px-Macroscelides_edwardii_-_1700-1880_-_Print_-_Iconographia_Zoologica_-_Special_Collections_University_of_Amsterdam_-_UBA01_IZ20900065_2.jpg',
  },
  {
    commonName: 'Hedgehog',
    scientificName: 'Erinaceus europaeus',
    ncbiTaxId: 9365,
    wikiTitle: 'European_hedgehog',
    group: 'mammal',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Erinaceus_europaeus_LC0119.jpg/330px-Erinaceus_europaeus_LC0119.jpg',
  },
  {
    commonName: 'Tenrec',
    scientificName: 'Tenrec ecaudatus',
    ncbiTaxId: 94439,
    wikiTitle: 'Tailless_tenrec',
    group: 'mammal',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Tanrek.jpg/330px-Tanrek.jpg',
  },
  {
    commonName: 'Raccoon',
    scientificName: 'Procyon lotor',
    ncbiTaxId: 9654,
    wikiTitle: 'Raccoon',
    group: 'mammal',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Raccoon_in_Central_Park_%2835264%29.jpg/330px-Raccoon_in_Central_Park_%2835264%29.jpg',
  },
  {
    commonName: 'Red panda',
    scientificName: 'Ailurus fulgens',
    ncbiTaxId: 9649,
    wikiTitle: 'Red_panda',
    group: 'mammal',
    imageUrl:
      'https://inaturalist-open-data.s3.amazonaws.com/photos/26989188/medium.jpeg',
  },
  {
    commonName: 'Spotted hyena',
    scientificName: 'Crocuta crocuta',
    ncbiTaxId: 9678,
    wikiTitle: 'Spotted_hyena',
    group: 'mammal',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Spotted_hyena_%28Crocuta_crocuta%29.jpg/330px-Spotted_hyena_%28Crocuta_crocuta%29.jpg',
  },
  {
    commonName: 'Brown rat',
    scientificName: 'Rattus norvegicus',
    ncbiTaxId: 10116,
    wikiTitle: 'Brown_rat',
    group: 'mammal',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Rattus_norvegicus_-_Brown_rat_02.jpg/500px-Rattus_norvegicus_-_Brown_rat_02.jpg',
  },
  {
    commonName: 'European rabbit',
    scientificName: 'Oryctolagus cuniculus',
    ncbiTaxId: 9986,
    wikiTitle: 'European_rabbit',
    group: 'mammal',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Oryctolagus_cuniculus_Tasmania_2_%28cropped%29.jpg/330px-Oryctolagus_cuniculus_Tasmania_2_%28cropped%29.jpg',
  },
  {
    commonName: 'American pika',
    scientificName: 'Ochotona princeps',
    ncbiTaxId: 9978,
    wikiTitle: 'American_pika',
    group: 'mammal',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Ochotona_princeps_rockies.JPG/330px-Ochotona_princeps_rockies.JPG',
  },
  {
    commonName: 'American beaver',
    scientificName: 'Castor canadensis',
    ncbiTaxId: 51338,
    wikiTitle: 'North_American_beaver',
    group: 'mammal',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/American_Beaver.jpg/330px-American_Beaver.jpg',
  },
  {
    commonName: 'Eastern gray squirrel',
    scientificName: 'Sciurus carolinensis',
    ncbiTaxId: 30640,
    wikiTitle: 'Eastern_gray_squirrel',
    group: 'mammal',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/EasternGraySquirrel_GAm.jpg/330px-EasternGraySquirrel_GAm.jpg',
  },
  {
    commonName: 'Black-tailed prairie dog',
    scientificName: 'Cynomys ludovicianus',
    ncbiTaxId: 45480,
    wikiTitle: 'Black-tailed_prairie_dog',
    group: 'mammal',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Cynomys_ludovicianus_%2854906540630%29.jpg/330px-Cynomys_ludovicianus_%2854906540630%29.jpg',
  },
  {
    commonName: 'Philippine tarsier',
    scientificName: 'Carlito syrichta',
    ncbiTaxId: 1868482,
    wikiTitle: 'Philippine_tarsier',
    group: 'mammal',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Tarsier-GG.jpg/330px-Tarsier-GG.jpg',
  },
  {
    commonName: 'Ring-tailed lemur',
    scientificName: 'Lemur catta',
    ncbiTaxId: 9447,
    wikiTitle: 'Ring-tailed_lemur',
    group: 'mammal',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Ring-tailed_lemur_%28Lemur_catta%29.jpg/330px-Ring-tailed_lemur_%28Lemur_catta%29.jpg',
  },
  {
    commonName: 'Orangutan',
    scientificName: 'Pongo abelii',
    ncbiTaxId: 9601,
    wikiTitle: 'Sumatran_orangutan',
    group: 'mammal',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Sumatra-Orang-Utan_im_Pongoland.jpg/330px-Sumatra-Orang-Utan_im_Pongoland.jpg',
  },
  {
    commonName: 'Gorilla',
    scientificName: 'Gorilla gorilla',
    ncbiTaxId: 9593,
    wikiTitle: 'Western_gorilla',
    group: 'mammal',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Male_gorilla_in_SF_zoo.jpg/330px-Male_gorilla_in_SF_zoo.jpg',
  },
  {
    commonName: 'Olive baboon',
    scientificName: 'Papio anubis',
    ncbiTaxId: 9555,
    wikiTitle: 'Olive_baboon',
    group: 'mammal',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Olive_baboon_Ngorongoro.jpg/330px-Olive_baboon_Ngorongoro.jpg',
  },
  {
    commonName: 'Capuchin monkey',
    scientificName: 'Cebus capucinus',
    ncbiTaxId: 9516,
    wikiTitle: 'Colombian_white-faced_capuchin',
    group: 'mammal',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Cebus_capucinus_at_the_Bronx_Zoo_001.jpg/330px-Cebus_capucinus_at_the_Bronx_Zoo_001.jpg',
  },
  {
    commonName: 'Pangolin',
    scientificName: 'Manis javanica',
    ncbiTaxId: 9974,
    wikiTitle: 'Sunda_pangolin',
    group: 'mammal',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Pangolin_borneo.jpg/330px-Pangolin_borneo.jpg',
  },
  {
    commonName: 'Sugar glider',
    scientificName: 'Petaurus breviceps',
    ncbiTaxId: 34899,
    wikiTitle: 'Sugar_glider',
    group: 'mammal',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Petaurus_breviceps-Cayley.jpg/330px-Petaurus_breviceps-Cayley.jpg',
  },
  {
    commonName: 'Koala',
    scientificName: 'Phascolarctos cinereus',
    ncbiTaxId: 38626,
    wikiTitle: 'Koala',
    group: 'mammal',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Koala_climbing_tree.jpg/330px-Koala_climbing_tree.jpg',
  },
  {
    commonName: 'Three-toed sloth',
    scientificName: 'Bradypus variegatus',
    ncbiTaxId: 9355,
    wikiTitle: 'Brown-throated_sloth',
    group: 'mammal',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Bradypus.jpg/330px-Bradypus.jpg',
  },
  {
    commonName: 'Giant anteater',
    scientificName: 'Myrmecophaga tridactyla',
    ncbiTaxId: 71006,
    wikiTitle: 'Giant_anteater',
    group: 'mammal',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Myresluger2.jpg/330px-Myresluger2.jpg',
  },
  {
    commonName: 'Dromedary camel',
    scientificName: 'Camelus dromedarius',
    ncbiTaxId: 9838,
    wikiTitle: 'Dromedary',
    group: 'mammal',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Camelus_dromedarius_in_Nuweiba.jpg/330px-Camelus_dromedarius_in_Nuweiba.jpg',
  },
  {
    commonName: 'American bison',
    scientificName: 'Bison bison',
    ncbiTaxId: 9901,
    wikiTitle: 'American_bison',
    group: 'mammal',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/American_bison_k5680-1.jpg/330px-American_bison_k5680-1.jpg',
  },
  {
    commonName: 'Musk ox',
    scientificName: 'Ovibos moschatus',
    ncbiTaxId: 37176,
    wikiTitle: 'Muskox',
    group: 'mammal',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Muskox_%28Ovibos_moschatus%29_male_Dovrefjell_4.jpg/330px-Muskox_%28Ovibos_moschatus%29_male_Dovrefjell_4.jpg',
  },
  {
    commonName: 'Mountain goat',
    scientificName: 'Oreamnos americanus',
    ncbiTaxId: 34873,
    wikiTitle: 'Mountain_goat',
    group: 'mammal',
    imageUrl:
      'https://inaturalist-open-data.s3.amazonaws.com/photos/18929544/medium.jpeg',
  },
  {
    commonName: 'American pronghorn',
    scientificName: 'Antilocapra americana',
    ncbiTaxId: 9891,
    wikiTitle: 'Pronghorn',
    group: 'mammal',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Antilocapra_americana.jpg/330px-Antilocapra_americana.jpg',
  },
  {
    commonName: 'White-tailed deer',
    scientificName: 'Odocoileus virginianus',
    ncbiTaxId: 9874,
    wikiTitle: 'White-tailed_deer',
    group: 'mammal',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/White-tailed_deer.jpg/330px-White-tailed_deer.jpg',
  },
  {
    commonName: 'Numbat',
    scientificName: 'Myrmecobius fasciatus',
    ncbiTaxId: 55782,
    wikiTitle: 'Numbat',
    group: 'mammal',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Numbat%2C_Dryandra_Woodland%2C_Western_Australia.jpg/330px-Numbat%2C_Dryandra_Woodland%2C_Western_Australia.jpg',
  },
  {
    commonName: 'Giant panda',
    scientificName: 'Ailuropoda melanoleuca',
    ncbiTaxId: 9646,
    wikiTitle: 'Giant_panda',
    group: 'mammal',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Grosser_Panda.JPG/330px-Grosser_Panda.JPG',
  },
  {
    commonName: 'Malayan tapir',
    scientificName: 'Tapirus indicus',
    ncbiTaxId: 9802,
    wikiTitle: 'Malayan_tapir',
    group: 'mammal',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Schabrackentapir_Tapirus_indicus_Tiergarten-Nuernberg-1.jpg/330px-Schabrackentapir_Tapirus_indicus_Tiergarten-Nuernberg-1.jpg',
  },
  {
    commonName: 'Common genet',
    scientificName: 'Genetta genetta',
    ncbiTaxId: 94190,
    wikiTitle: 'Common_genet',
    group: 'mammal',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Genetta_genetta_felina_%28Wroclaw_zoo%29.JPG/330px-Genetta_genetta_felina_%28Wroclaw_zoo%29.JPG',
  },
  {
    commonName: 'Binturong',
    scientificName: 'Arctictis binturong',
    ncbiTaxId: 94180,
    wikiTitle: 'Binturong',
    group: 'mammal',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Binturong_in_Overloon.jpg/330px-Binturong_in_Overloon.jpg',
  },
  {
    commonName: 'Fossa',
    scientificName: 'Cryptoprocta ferox',
    ncbiTaxId: 94188,
    wikiTitle: 'Fossa_(animal)',
    group: 'mammal',
    imageUrl:
      'https://inaturalist-open-data.s3.amazonaws.com/photos/70367976/medium.jpeg',
  },
  {
    commonName: 'Egyptian mongoose',
    scientificName: 'Herpestes ichneumon',
    ncbiTaxId: 9700,
    wikiTitle: 'Egyptian_mongoose',
    group: 'mammal',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Herpestes_ichneumon_%D0%95%D0%B3%D0%B8%D0%BF%D0%B5%D1%82%D1%81%D0%BA%D0%B8%D0%B9_%D0%BC%D0%B0%D0%BD%D0%B3%D1%83%D1%81%D1%82%2C_%D0%B8%D0%BB%D0%B8_%D1%84%D0%B0%D1%80%D0%B0%D0%BE%D0%BD%D0%BE%D0%B2%D0%B0_%D0%BA%D1%80%D1%8B%D1%81%D0%B0%2C_%D0%B8%D0%BB%D0%B8_%D0%B8%D1%85%D0%BD%D0%B5%D0%B2%D0%BC%D0%BE%CC%81%D0%BD.jpg/330px-Herpestes_ichneumon_%D0%95%D0%B3%D0%B8%D0%BF%D0%B5%D1%82%D1%81%D0%BA%D0%B8%D0%B9_%D0%BC%D0%B0%D0%BD%D0%B3%D1%83%D1%81%D1%82%2C_%D0%B8%D0%BB%D0%B8_%D1%84%D0%B0%D1%80%D0%B0%D0%BE%D0%BD%D0%BE%D0%B2%D0%B0_%D0%BA%D1%80%D1%8B%D1%81%D0%B0%2C_%D0%B8%D0%BB%D0%B8_%D0%B8%D1%85%D0%BD%D0%B5%D0%B2%D0%BC%D0%BE%CC%81%D0%BD.jpg',
  },
  {
    commonName: 'Colugo',
    scientificName: 'Galeopterus variegatus',
    ncbiTaxId: 482537,
    wikiTitle: 'Colugo',
    group: 'mammal',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Colugo_%28Galeopterus_variegatus%2C_adult_female%29%2C_Central_Catchment_Area%2C_Singapore_-_20060618.jpg/330px-Colugo_%28Galeopterus_variegatus%2C_adult_female%29%2C_Central_Catchment_Area%2C_Singapore_-_20060618.jpg',
  },
  {
    commonName: 'Okapi',
    scientificName: 'Okapia johnstoni',
    ncbiTaxId: 86973,
    wikiTitle: 'Okapi',
    group: 'mammal',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Saint-Aignan_%28Loir-et-Cher%29._Okapi.jpg/330px-Saint-Aignan_%28Loir-et-Cher%29._Okapi.jpg',
  },
  {
    commonName: 'Giraffe',
    scientificName: 'Giraffa camelopardalis',
    ncbiTaxId: 9894,
    wikiTitle: 'Giraffe',
    group: 'mammal',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Rothschild%27s_giraffe_%28Giraffa_camelopardalis_rothschildi%29_-_Murchison_Falls_National_Park.jpg/330px-Rothschild%27s_giraffe_%28Giraffa_camelopardalis_rothschildi%29_-_Murchison_Falls_National_Park.jpg',
  },
  {
    commonName: 'Patagonian mara',
    scientificName: 'Dolichotis patagonum',
    ncbiTaxId: 29091,
    wikiTitle: 'Patagonian_mara',
    group: 'mammal',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Dolichotis_patagonum_99386074.jpg/330px-Dolichotis_patagonum_99386074.jpg',
  },
  {
    commonName: 'Wolverine',
    scientificName: 'Gulo gulo',
    ncbiTaxId: 48420,
    wikiTitle: 'Wolverine',
    group: 'mammal',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Gulo_gulo_2.jpg/330px-Gulo_gulo_2.jpg',
  },
  {
    commonName: 'Sea otter',
    scientificName: 'Enhydra lutris',
    ncbiTaxId: 34882,
    wikiTitle: 'Sea_otter',
    group: 'mammal',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Sea_Otter_%28Enhydra_lutris%29_%2825169790524%29_crop.jpg/330px-Sea_Otter_%28Enhydra_lutris%29_%2825169790524%29_crop.jpg',
  },
  {
    commonName: 'Golden mole',
    scientificName: 'Chrysochloris asiatica',
    ncbiTaxId: 185453,
    wikiTitle: 'Cape_golden_mole',
    group: 'mammal',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Chrysochloris_asiatica_270437025.jpg/330px-Chrysochloris_asiatica_270437025.jpg',
  },
  {
    commonName: 'European mole',
    scientificName: 'Talpa europaea',
    ncbiTaxId: 9375,
    wikiTitle: 'European_mole',
    group: 'mammal',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Talpa_europaea_MHNT.jpg/330px-Talpa_europaea_MHNT.jpg',
  },
  {
    commonName: 'Naked mole rat',
    scientificName: 'Heterocephalus glaber',
    ncbiTaxId: 10181,
    wikiTitle: 'Naked_mole-rat',
    group: 'mammal',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Nacktmull.jpg/330px-Nacktmull.jpg',
  },
  {
    commonName: 'Tree shrew',
    scientificName: 'Tupaia belangeri',
    ncbiTaxId: 37347,
    wikiTitle: 'Northern_treeshrew',
    group: 'mammal',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Tupaia_belangeri_99597342.jpg/330px-Tupaia_belangeri_99597342.jpg',
  },
  {
    commonName: 'Marsupial mole',
    scientificName: 'Notoryctes typhlops',
    ncbiTaxId: 37699,
    wikiTitle: 'Southern_marsupial_mole',
    group: 'mammal',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Notoryctes_typhlops.jpg/330px-Notoryctes_typhlops.jpg',
  },
  {
    commonName: 'Echidna',
    scientificName: 'Tachyglossus aculeatus',
    ncbiTaxId: 9261,
    wikiTitle: 'Short-beaked_echidna',
    group: 'mammal',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Wild_shortbeak_echidna.jpg/330px-Wild_shortbeak_echidna.jpg',
  },
  {
    commonName: 'Aye-aye',
    scientificName: 'Daubentonia madagascariensis',
    ncbiTaxId: 31869,
    wikiTitle: 'Aye-aye',
    group: 'mammal',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Wild_aye_aye.jpg/330px-Wild_aye_aye.jpg',
  },
  {
    commonName: 'Pink fairy armadillo',
    scientificName: 'Chlamyphorus truncatus',
    ncbiTaxId: 450267,
    wikiTitle: 'Pink_fairy_armadillo',
    group: 'mammal',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Pink_Fairy_Armadillo_%28Chlamyphorus_truncatus%29.jpg/330px-Pink_Fairy_Armadillo_%28Chlamyphorus_truncatus%29.jpg',
  },

  // Birds
  {
    commonName: 'Bald eagle',
    scientificName: 'Haliaeetus leucocephalus',
    ncbiTaxId: 52644,
    wikiTitle: 'Bald_eagle',
    group: 'bird',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Bald_eagle_about_to_fly_in_Alaska_%282016%29.jpg/330px-Bald_eagle_about_to_fly_in_Alaska_%282016%29.jpg',
  },
  {
    commonName: 'Chicken',
    scientificName: 'Gallus gallus',
    ncbiTaxId: 9031,
    wikiTitle: 'Chicken',
    group: 'bird',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Red_jungle_fowl.png/330px-Red_jungle_fowl.png',
  },
  {
    commonName: 'Emperor penguin',
    scientificName: 'Aptenodytes forsteri',
    ncbiTaxId: 9233,
    wikiTitle: 'Emperor_penguin',
    group: 'bird',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Aptenodytes_forsteri_-Snow_Hill_Island%2C_Antarctica_-adults_and_juvenile-8.jpg/330px-Aptenodytes_forsteri_-Snow_Hill_Island%2C_Antarctica_-adults_and_juvenile-8.jpg',
  },
  {
    commonName: 'Ostrich',
    scientificName: 'Struthio camelus',
    ncbiTaxId: 8801,
    wikiTitle: 'Common_ostrich',
    group: 'bird',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Struthio_camelus_-_Etosha_2014_%283%29.jpg/330px-Struthio_camelus_-_Etosha_2014_%283%29.jpg',
  },
  {
    commonName: 'Common crow',
    scientificName: 'Corvus brachyrhynchos',
    ncbiTaxId: 85066,
    wikiTitle: 'American_crow',
    group: 'bird',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Corvus-brachyrhynchos-001.jpg/330px-Corvus-brachyrhynchos-001.jpg',
  },
  {
    commonName: 'Greater flamingo',
    scientificName: 'Phoenicopterus roseus',
    ncbiTaxId: 435638,
    wikiTitle: 'Greater_flamingo',
    group: 'bird',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/010_Greater_flamingos_male_and_female_in_the_Camargue_during_mating_season_Photo_by_Giles_Laurent.jpg/330px-010_Greater_flamingos_male_and_female_in_the_Camargue_during_mating_season_Photo_by_Giles_Laurent.jpg',
  },
  {
    commonName: 'Great crested grebe',
    scientificName: 'Podiceps cristatus',
    ncbiTaxId: 345573,
    wikiTitle: 'Great_crested_grebe',
    group: 'bird',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Podiceps_cristatus_2_-_Lake_Dulverton.jpg/330px-Podiceps_cristatus_2_-_Lake_Dulverton.jpg',
  },
  {
    commonName: 'Hoatzin',
    scientificName: 'Opisthocomus hoazin',
    ncbiTaxId: 30419,
    wikiTitle: 'Hoatzin',
    group: 'bird',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Hoatzin_%28Opisthocomus_hoazin%29_Rio_Napo.jpg/330px-Hoatzin_%28Opisthocomus_hoazin%29_Rio_Napo.jpg',
  },
  {
    commonName: 'Common loon',
    scientificName: 'Gavia immer',
    ncbiTaxId: 37039,
    wikiTitle: 'Common_loon',
    group: 'bird',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Gavia_immer_-Minocqua%2C_Wisconsin%2C_USA_-swimming-8.jpg/330px-Gavia_immer_-Minocqua%2C_Wisconsin%2C_USA_-swimming-8.jpg',
  },
  {
    commonName: 'Shoebill',
    scientificName: 'Balaeniceps rex',
    ncbiTaxId: 33584,
    wikiTitle: 'Shoebill',
    group: 'bird',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Balaeniceps_rex_-Ueno_Zoo%2C_Tokyo%2C_Japan-8a.jpg/330px-Balaeniceps_rex_-Ueno_Zoo%2C_Tokyo%2C_Japan-8a.jpg',
  },
  {
    commonName: 'Brown pelican',
    scientificName: 'Pelecanus occidentalis',
    ncbiTaxId: 37043,
    wikiTitle: 'Brown_pelican',
    group: 'bird',
    imageUrl:
      'https://inaturalist-open-data.s3.amazonaws.com/photos/74013719/medium.jpg',
  },

  {
    commonName: 'Peregrine falcon',
    scientificName: 'Falco peregrinus',
    ncbiTaxId: 8954,
    wikiTitle: 'Peregrine_falcon',
    group: 'bird',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Falco_peregrinus_m_Humber_Bay_Park_Toronto.jpg/330px-Falco_peregrinus_m_Humber_Bay_Park_Toronto.jpg',
  },
  {
    commonName: 'African grey parrot',
    scientificName: 'Psittacus erithacus',
    ncbiTaxId: 57247,
    wikiTitle: 'African_grey_parrot',
    group: 'bird',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Psittacus_erithacus_-perching_on_tray-8d.jpg/330px-Psittacus_erithacus_-perching_on_tray-8d.jpg',
  },
  {
    commonName: 'Barn owl',
    scientificName: 'Tyto alba',
    ncbiTaxId: 56313,
    wikiTitle: 'Tyto_alba',
    group: 'bird',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Barn_Owl%2C_Lancashire.jpg/330px-Barn_Owl%2C_Lancashire.jpg',
  },
  {
    commonName: 'Common nighthawk',
    scientificName: 'Chordeiles minor',
    ncbiTaxId: 48398,
    wikiTitle: 'Common_nighthawk',
    group: 'bird',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Common_Nighthawk_%2814428313550%29.jpg/330px-Common_Nighthawk_%2814428313550%29.jpg',
  },
  {
    commonName: 'Red-tailed hawk',
    scientificName: 'Buteo jamaicensis',
    ncbiTaxId: 56263,
    wikiTitle: 'Red-tailed_hawk',
    group: 'bird',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Red-tailed_Hawk_%2845812546121%29.jpg/330px-Red-tailed_Hawk_%2845812546121%29.jpg',
  },
  {
    commonName: 'Ruby-throated hummingbird',
    scientificName: 'Archilochus colubris',
    ncbiTaxId: 190676,
    wikiTitle: 'Ruby-throated_hummingbird',
    group: 'bird',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Archilochus_colubris_-flying_-male-8.jpg/330px-Archilochus_colubris_-flying_-male-8.jpg',
  },

  // Reptiles
  {
    commonName: 'Komodo dragon',
    scientificName: 'Varanus komodoensis',
    ncbiTaxId: 61221,
    wikiTitle: 'Komodo_dragon',
    group: 'reptile',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/202306_Varanus_komodoensis.jpg/330px-202306_Varanus_komodoensis.jpg',
  },
  {
    commonName: 'American alligator',
    scientificName: 'Alligator mississippiensis',
    ncbiTaxId: 8496,
    wikiTitle: 'American_alligator',
    group: 'reptile',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/American_Alligator.jpg/330px-American_Alligator.jpg',
  },
  {
    commonName: 'Green sea turtle',
    scientificName: 'Chelonia mydas',
    ncbiTaxId: 8469,
    wikiTitle: 'Green_sea_turtle',
    group: 'reptile',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Green_sea_turtle_%28Chelonia_mydas%29_Moorea.jpg/330px-Green_sea_turtle_%28Chelonia_mydas%29_Moorea.jpg',
  },
  {
    commonName: 'King cobra',
    scientificName: 'Ophiophagus hannah',
    ncbiTaxId: 8665,
    wikiTitle: 'King_cobra',
    group: 'reptile',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/12_-_The_Mystical_King_Cobra_and_Coffee_Forests.jpg/330px-12_-_The_Mystical_King_Cobra_and_Coffee_Forests.jpg',
  },
  {
    commonName: 'Tuatara',
    scientificName: 'Sphenodon punctatus',
    ncbiTaxId: 8508,
    wikiTitle: 'Tuatara',
    group: 'reptile',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Tuatara_%285205719005%29.jpg/330px-Tuatara_%285205719005%29.jpg',
  },

  {
    commonName: 'Galápagos tortoise',
    scientificName: 'Chelonoidis niger',
    ncbiTaxId: 66189,
    wikiTitle: 'Galápagos_tortoise',
    group: 'reptile',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Galapagos_giant_tortoise_Geochelone_elephantopus.jpg/330px-Galapagos_giant_tortoise_Geochelone_elephantopus.jpg',
  },
  {
    commonName: 'Snapping turtle',
    scientificName: 'Chelydra serpentina',
    ncbiTaxId: 8475,
    wikiTitle: 'Common_snapping_turtle',
    group: 'reptile',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Snapping_Turtle_Heinz.png/330px-Snapping_Turtle_Heinz.png',
  },
  {
    commonName: 'Nile crocodile',
    scientificName: 'Crocodylus niloticus',
    ncbiTaxId: 8501,
    wikiTitle: 'Nile_crocodile',
    group: 'reptile',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/NileCrocodile.jpg/330px-NileCrocodile.jpg',
  },
  {
    commonName: 'Corn snake',
    scientificName: 'Pantherophis guttatus',
    ncbiTaxId: 94885,
    wikiTitle: 'Corn_snake',
    group: 'reptile',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/CornSnake.jpg/500px-CornSnake.jpg',
  },

  // Amphibians
  {
    commonName: 'Axolotl',
    scientificName: 'Ambystoma mexicanum',
    ncbiTaxId: 8296,
    wikiTitle: 'Axolotl',
    group: 'amphibian',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Axolotl_ganz.jpg/330px-Axolotl_ganz.jpg',
  },
  {
    commonName: 'Tiger salamander',
    scientificName: 'Ambystoma tigrinum',
    ncbiTaxId: 8305,
    wikiTitle: 'Tiger_salamander',
    group: 'amphibian',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Salamandra_Tigre.png/330px-Salamandra_Tigre.png',
  },
  {
    commonName: 'Common frog',
    scientificName: 'Rana temporaria',
    ncbiTaxId: 8407,
    wikiTitle: 'Common_frog',
    group: 'amphibian',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/European_Common_Frog_Rana_temporaria.jpg/330px-European_Common_Frog_Rana_temporaria.jpg',
  },
  {
    commonName: 'Caecilian',
    scientificName: 'Caecilia tentaculata',
    ncbiTaxId: 356198,
    wikiTitle: 'Caecilian',
    group: 'amphibian',
    imageUrl:
      'https://inaturalist-open-data.s3.amazonaws.com/photos/607737/medium.jpg',
  },
  {
    commonName: 'Olm',
    scientificName: 'Proteus anguinus',
    ncbiTaxId: 221568,
    wikiTitle: 'Olm',
    group: 'amphibian',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Proteus_anguinus_Postojnska_Jama_Slovenija.jpg/330px-Proteus_anguinus_Postojnska_Jama_Slovenija.jpg',
  },

  // Fish
  {
    commonName: 'Great white shark',
    scientificName: 'Carcharodon carcharias',
    ncbiTaxId: 13397,
    wikiTitle: 'Great_white_shark',
    group: 'fish',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/White_shark.jpg/330px-White_shark.jpg',
  },
  {
    commonName: 'Clownfish',
    scientificName: 'Amphiprion ocellaris',
    ncbiTaxId: 80972,
    wikiTitle: 'Ocellaris_clownfish',
    group: 'fish',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Clown_fish_in_the_Andaman_Coral_Reef.jpg/330px-Clown_fish_in_the_Andaman_Coral_Reef.jpg',
  },
  {
    commonName: 'Coelacanth',
    scientificName: 'Latimeria chalumnae',
    ncbiTaxId: 7897,
    wikiTitle: 'Coelacanth',
    group: 'fish',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Coelacanth_off_Pumula_on_the_KwaZulu-Natal_South_Coast%2C_South_Africa%2C_on_22_November_2019.png/330px-Coelacanth_off_Pumula_on_the_KwaZulu-Natal_South_Coast%2C_South_Africa%2C_on_22_November_2019.png',
  },
  {
    commonName: 'Seahorse',
    scientificName: 'Hippocampus kuda',
    ncbiTaxId: 103715,
    wikiTitle: 'Seahorse',
    group: 'fish',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Hippocampus_hippocampus_%28on_Ascophyllum_nodosum%29.jpg/330px-Hippocampus_hippocampus_%28on_Ascophyllum_nodosum%29.jpg',
  },
  {
    commonName: 'Atlantic salmon',
    scientificName: 'Salmo salar',
    ncbiTaxId: 8030,
    wikiTitle: 'Atlantic_salmon',
    group: 'fish',
    imageUrl:
      'https://api.ncbi.nlm.nih.gov/datasets/v2/taxonomy/taxon/8030/image',
  },
  {
    commonName: 'Australian lungfish',
    scientificName: 'Neoceratodus forsteri',
    ncbiTaxId: 7892,
    wikiTitle: 'Australian_lungfish',
    group: 'fish',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Neoceratodus_forsteri%2C_2014-09-19.JPG/330px-Neoceratodus_forsteri%2C_2014-09-19.JPG',
  },
  {
    commonName: 'Sea lamprey',
    scientificName: 'Petromyzon marinus',
    ncbiTaxId: 7757,
    wikiTitle: 'Sea_lamprey',
    group: 'fish',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Petromyzon_marinus.001_-_Aquarium_Finisterrae.jpg/500px-Petromyzon_marinus.001_-_Aquarium_Finisterrae.jpg',
  },
  {
    commonName: 'African lungfish',
    scientificName: 'Protopterus annectens',
    ncbiTaxId: 7888,
    wikiTitle: 'West_African_lungfish',
    group: 'fish',
    imageUrl:
      'https://api.ncbi.nlm.nih.gov/datasets/v2/taxonomy/taxon/7888/image',
  },
  {
    commonName: 'European eel',
    scientificName: 'Anguilla anguilla',
    ncbiTaxId: 7936,
    wikiTitle: 'European_eel',
    group: 'fish',
    imageUrl:
      'https://api.ncbi.nlm.nih.gov/datasets/v2/taxonomy/taxon/7936/image',
  },
  {
    commonName: 'Ocean sunfish',
    scientificName: 'Mola mola',
    ncbiTaxId: 94237,
    wikiTitle: 'Ocean_sunfish',
    group: 'fish',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Mola_mola.jpg/330px-Mola_mola.jpg',
  },
  {
    commonName: 'Pufferfish',
    scientificName: 'Takifugu rubripes',
    ncbiTaxId: 31033,
    wikiTitle: 'Takifugu_rubripes',
    group: 'fish',
    imageUrl:
      'https://inaturalist-open-data.s3.amazonaws.com/photos/60989907/medium.jpg',
  },
  {
    commonName: 'Atlantic bluefin tuna',
    scientificName: 'Thunnus thynnus',
    ncbiTaxId: 8237,
    wikiTitle: 'Atlantic_bluefin_tuna',
    group: 'fish',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Bluefin-big.jpg/330px-Bluefin-big.jpg',
  },
  {
    commonName: 'Atlantic mudskipper',
    scientificName: 'Periophthalmus barbarus',
    ncbiTaxId: 166755,
    wikiTitle: 'Atlantic_mudskipper',
    group: 'fish',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/GambianMudskippers.jpg/330px-GambianMudskippers.jpg',
  },

  // Arthropods (insects and others)
  {
    commonName: 'Honeybee',
    scientificName: 'Apis mellifera',
    ncbiTaxId: 7460,
    wikiTitle: 'Western_honey_bee',
    group: 'arthropod',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Apis_mellifera_Western_honey_bee.jpg/500px-Apis_mellifera_Western_honey_bee.jpg',
  },
  {
    commonName: 'Monarch butterfly',
    scientificName: 'Danaus plexippus',
    ncbiTaxId: 13037,
    wikiTitle: 'Monarch_butterfly',
    group: 'arthropod',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Monarch_Butterfly_Danaus_plexippus_Male_2664px.jpg/330px-Monarch_Butterfly_Danaus_plexippus_Male_2664px.jpg',
  },
  {
    commonName: 'Fruit fly',
    scientificName: 'Drosophila melanogaster',
    ncbiTaxId: 7227,
    wikiTitle: 'Drosophila_melanogaster',
    group: 'arthropod',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Drosophila_melanogaster_Proboscis.jpg/500px-Drosophila_melanogaster_Proboscis.jpg',
  },
  {
    commonName: 'Ant',
    scientificName: 'Formica rufa',
    ncbiTaxId: 258706,
    wikiTitle: 'Red_wood_ant',
    group: 'arthropod',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/A_Formica_rufa_sideview.jpg/330px-A_Formica_rufa_sideview.jpg',
  },
  {
    commonName: 'Ladybug',
    scientificName: 'Coccinella septempunctata',
    ncbiTaxId: 41139,
    wikiTitle: 'Coccinella_septempunctata',
    group: 'arthropod',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/7-Spotted-Ladybug-Coccinella-septempunctata-sq1.jpg/330px-7-Spotted-Ladybug-Coccinella-septempunctata-sq1.jpg',
  },
  {
    commonName: 'Earwig',
    scientificName: 'Forficula auricularia',
    ncbiTaxId: 13068,
    wikiTitle: 'Forficula_auricularia',
    group: 'arthropod',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/European_earwig_%2881241%29.jpg/330px-European_earwig_%2881241%29.jpg',
  },
  {
    commonName: 'Dragonfly',
    scientificName: 'Anax junius',
    ncbiTaxId: 214820,
    wikiTitle: 'Green_darner',
    group: 'arthropod',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Common_Green_Darner_Anax_junius_JG.jpg/330px-Common_Green_Darner_Anax_junius_JG.jpg',
  },
  {
    commonName: 'Horseshoe crab',
    scientificName: 'Limulus polyphemus',
    ncbiTaxId: 6850,
    wikiTitle: 'Atlantic_horseshoe_crab',
    group: 'arthropod',
    imageUrl:
      'https://api.ncbi.nlm.nih.gov/datasets/v2/taxonomy/taxon/6850/image',
  },
  {
    commonName: 'Tardigrade',
    scientificName: 'Hypsibius dujardini',
    ncbiTaxId: 232323,
    wikiTitle: 'Tardigrade',
    group: 'arthropod',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/0/08/Waterbear.jpg',
  },
  {
    commonName: 'Scorpion',
    scientificName: 'Pandinus imperator',
    ncbiTaxId: 55084,
    wikiTitle: 'Emperor_scorpion',
    group: 'arthropod',
    imageUrl: 'https://static.inaturalist.org/photos/169448714/medium.jpg',
  },
  {
    commonName: 'Garden spider',
    scientificName: 'Araneus diadematus',
    ncbiTaxId: 45920,
    wikiTitle: 'Araneus_diadematus',
    group: 'arthropod',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Araneus_diadematus_MHNT_Femelle_Fronton.jpg/330px-Araneus_diadematus_MHNT_Femelle_Fronton.jpg',
  },
  {
    commonName: 'Deer tick',
    scientificName: 'Ixodes scapularis',
    ncbiTaxId: 6945,
    wikiTitle: 'Ixodes_scapularis',
    group: 'arthropod',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Adult_deer_tick.jpg/330px-Adult_deer_tick.jpg',
  },
  {
    commonName: 'Dust mite',
    scientificName: 'Dermatophagoides pteronyssinus',
    ncbiTaxId: 6956,
    wikiTitle: 'Dermatophagoides_pteronyssinus',
    group: 'arthropod',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/House_Dust_Mite.jpg/330px-House_Dust_Mite.jpg',
  },
  {
    commonName: 'Barnacle',
    scientificName: 'Balanus balanus',
    ncbiTaxId: 172567,
    wikiTitle: 'Balanus_balanus',
    group: 'arthropod',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Rough_barnacle%2C_Ammoniakhavnen_imported_from_iNaturalist_photo_327952133.jpg/330px-Rough_barnacle%2C_Ammoniakhavnen_imported_from_iNaturalist_photo_327952133.jpg',
  },
  {
    commonName: 'American lobster',
    scientificName: 'Homarus americanus',
    ncbiTaxId: 6706,
    wikiTitle: 'American_lobster',
    group: 'arthropod',
    imageUrl:
      'https://api.ncbi.nlm.nih.gov/datasets/v2/taxonomy/taxon/6706/image',
  },
  {
    commonName: 'Red king crab',
    scientificName: 'Paralithodes camtschaticus',
    ncbiTaxId: 6741,
    wikiTitle: 'Red_king_crab',
    group: 'arthropod',
    imageUrl:
      'https://api.ncbi.nlm.nih.gov/datasets/v2/taxonomy/taxon/6741/image',
  },
  {
    commonName: 'Hermit crab',
    scientificName: 'Pagurus bernhardus',
    ncbiTaxId: 174397,
    wikiTitle: 'Pagurus_bernhardus',
    group: 'arthropod',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Pagurus_bernhardus.jpg/330px-Pagurus_bernhardus.jpg',
  },
  {
    commonName: 'Blue crab',
    scientificName: 'Callinectes sapidus',
    ncbiTaxId: 6763,
    wikiTitle: 'Callinectes_sapidus',
    group: 'arthropod',
    imageUrl:
      'https://api.ncbi.nlm.nih.gov/datasets/v2/taxonomy/taxon/6763/image',
  },
  {
    commonName: 'Common woodlouse',
    scientificName: 'Armadillidium vulgare',
    ncbiTaxId: 13347,
    wikiTitle: 'Armadillidium_vulgare',
    group: 'arthropod',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Armadillidium_vulgare_male.jpg/330px-Armadillidium_vulgare_male.jpg',
  },
  {
    commonName: 'Coconut crab',
    scientificName: 'Birgus latro',
    ncbiTaxId: 177283,
    wikiTitle: 'Coconut_crab',
    group: 'arthropod',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Coconut_Crab_Birgus_latro.jpg/330px-Coconut_Crab_Birgus_latro.jpg',
  },
  {
    commonName: 'Porcelain crab',
    scientificName: 'Petrolisthes cinctipes',
    ncbiTaxId: 88211,
    wikiTitle: 'Porcelain_crab',
    group: 'arthropod',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/South_eastern_Pacific_species_of_Petrolisthes%2C_Allopetrolisthes%2C_and_Liopetrolisthes_%28Porcellanidae%29.jpg/330px-South_eastern_Pacific_species_of_Petrolisthes%2C_Allopetrolisthes%2C_and_Liopetrolisthes_%28Porcellanidae%29.jpg',
  },
  {
    commonName: 'White shrimp',
    scientificName: 'Penaeus vannamei',
    ncbiTaxId: 6689,
    wikiTitle: 'Whiteleg_shrimp',
    group: 'arthropod',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Litopenaeus_vannamei_specimen.jpg/330px-Litopenaeus_vannamei_specimen.jpg',
  },
  {
    commonName: 'Mantisfly',
    scientificName: 'Mantispa styriaca',
    ncbiTaxId: 279447,
    wikiTitle: 'Mantispidae',
    group: 'arthropod',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Mantispa_styriaca_%289566952168%29.jpg/330px-Mantispa_styriaca_%289566952168%29.jpg',
  },
  {
    commonName: 'Praying mantis',
    scientificName: 'Mantis religiosa',
    ncbiTaxId: 7507,
    wikiTitle: 'Mantis_religiosa',
    group: 'arthropod',
    imageUrl:
      'https://api.ncbi.nlm.nih.gov/datasets/v2/taxonomy/taxon/7507/image',
  },
  {
    commonName: 'Green lacewing',
    scientificName: 'Chrysoperla carnea',
    ncbiTaxId: 189513,
    wikiTitle: 'Chrysoperla_carnea',
    group: 'arthropod',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/%28MHNT%29_Chrysoperla_carnea_-_dorsal_view.jpg/500px-%28MHNT%29_Chrysoperla_carnea_-_dorsal_view.jpg',
  },

  // Other invertebrates
  {
    commonName: 'Common octopus',
    scientificName: 'Octopus vulgaris',
    ncbiTaxId: 6645,
    wikiTitle: 'Common_octopus',
    group: 'invertebrate',
    imageUrl:
      'https://api.ncbi.nlm.nih.gov/datasets/v2/taxonomy/taxon/6645/image',
  },
  {
    commonName: 'Common limpet',
    scientificName: 'Patella vulgata',
    ncbiTaxId: 6465,
    wikiTitle: 'Common_limpet',
    group: 'invertebrate',
    imageUrl:
      'https://api.ncbi.nlm.nih.gov/datasets/v2/taxonomy/taxon/6465/image',
  },
  {
    commonName: 'Sand dollar',
    scientificName: 'Echinarachnius parma',
    ncbiTaxId: 869203,
    wikiTitle: 'Sand_dollar',
    group: 'invertebrate',
    imageUrl:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Echinarachnius_parma.jpg?width=330',
  },
  {
    commonName: 'Garden snail',
    scientificName: 'Cornu aspersum',
    ncbiTaxId: 6535,
    wikiTitle: 'Cornu_aspersum',
    group: 'invertebrate',
    imageUrl:
      'https://api.ncbi.nlm.nih.gov/datasets/v2/taxonomy/taxon/6535/image',
  },
  {
    commonName: 'Milky ribbon worm',
    scientificName: 'Cerebratulus lacteus',
    ncbiTaxId: 6221,
    wikiTitle: 'Cerebratulus_lacteus',
    group: 'invertebrate',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Cerebratulus_lacteus_%28YPM_IZ_103854%29.jpeg/330px-Cerebratulus_lacteus_%28YPM_IZ_103854%29.jpeg',
  },
  {
    commonName: 'Nautilus',
    scientificName: 'Nautilus pompilius',
    ncbiTaxId: 34573,
    wikiTitle: 'Chambered_nautilus',
    group: 'invertebrate',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Nautilus_pompilius_%28detail%29.jpg/500px-Nautilus_pompilius_%28detail%29.jpg',
  },
  {
    commonName: 'Giant clam',
    scientificName: 'Tridacna gigas',
    ncbiTaxId: 80829,
    wikiTitle: 'Giant_clam',
    group: 'invertebrate',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Giant_clam_%28Tridacna_gigas%29_Michaelmas_Cay.jpg/330px-Giant_clam_%28Tridacna_gigas%29_Michaelmas_Cay.jpg',
  },
  {
    commonName: 'Starfish',
    scientificName: 'Asterias rubens',
    ncbiTaxId: 7604,
    wikiTitle: 'Common_starfish',
    group: 'invertebrate',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Asterias_rubens.jpg/500px-Asterias_rubens.jpg',
  },
  {
    commonName: 'Sea urchin',
    scientificName: 'Strongylocentrotus purpuratus',
    ncbiTaxId: 7668,
    wikiTitle: 'Strongylocentrotus_purpuratus',
    group: 'invertebrate',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Urchin_%289398869414%29.jpg/500px-Urchin_%289398869414%29.jpg',
  },
  {
    commonName: 'Moon jellyfish',
    scientificName: 'Aurelia aurita',
    ncbiTaxId: 6145,
    wikiTitle: 'Moon_jellyfish',
    group: 'invertebrate',
    imageUrl:
      'https://api.ncbi.nlm.nih.gov/datasets/v2/taxonomy/taxon/6145/image',
  },
  {
    commonName: 'Staghorn coral',
    scientificName: 'Acropora cervicornis',
    ncbiTaxId: 6130,
    wikiTitle: 'Staghorn_coral',
    group: 'invertebrate',
    imageUrl:
      'https://api.ncbi.nlm.nih.gov/datasets/v2/taxonomy/taxon/6130/image',
  },
  {
    commonName: 'Giant squid',
    scientificName: 'Architeuthis dux',
    ncbiTaxId: 256136,
    wikiTitle: 'Giant_squid',
    group: 'invertebrate',
    imageUrl:
      'https://inaturalist-open-data.s3.amazonaws.com/photos/91402900/medium.jpeg',
  },
  {
    commonName: 'Earthworm',
    scientificName: 'Lumbricus terrestris',
    ncbiTaxId: 6398,
    wikiTitle: 'Lumbricus_terrestris',
    group: 'invertebrate',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Regenwurm1.jpg/330px-Regenwurm1.jpg',
  },
  {
    commonName: 'Shipworm',
    scientificName: 'Teredo navalis',
    ncbiTaxId: 263429,
    wikiTitle: 'Shipworm',
    group: 'invertebrate',
    imageUrl:
      'https://inaturalist-open-data.s3.amazonaws.com/photos/151633519/medium.jpeg',
  },
  {
    commonName: 'Priapulid',
    scientificName: 'Priapulus caudatus',
    ncbiTaxId: 37621,
    wikiTitle: 'Priapulida',
    group: 'invertebrate',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Priapulus_caudatus.jpg/500px-Priapulus_caudatus.jpg',
  },
  {
    commonName: 'Peanut worm',
    scientificName: 'Sipunculus nudus',
    ncbiTaxId: 6446,
    wikiTitle: 'Peanut_worm',
    group: 'invertebrate',
    imageUrl:
      'https://api.ncbi.nlm.nih.gov/datasets/v2/taxonomy/taxon/6446/image',
  },
  {
    commonName: 'Pork tapeworm',
    scientificName: 'Taenia solium',
    ncbiTaxId: 6204,
    wikiTitle: 'Taenia_solium',
    group: 'invertebrate',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Taenia_solium_scolex.JPG/330px-Taenia_solium_scolex.JPG',
  },
  {
    commonName: 'Bath sponge',
    scientificName: 'Spongia officinalis',
    ncbiTaxId: 252964,
    wikiTitle: 'Spongia_officinalis',
    group: 'invertebrate',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/c/c9/Spongia_officinalis.jpg',
  },
  {
    commonName: 'Sea anemone',
    scientificName: 'Nematostella vectensis',
    ncbiTaxId: 45351,
    wikiTitle: 'Nematostella_vectensis',
    group: 'invertebrate',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Nematostella_vectensis_%28I1419%29_999_%2830695685804%29.jpg/500px-Nematostella_vectensis_%28I1419%29_999_%2830695685804%29.jpg',
  },
  {
    commonName: 'Comb jelly',
    scientificName: 'Mnemiopsis leidyi',
    ncbiTaxId: 27923,
    wikiTitle: 'Mnemiopsis',
    group: 'invertebrate',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Sea_walnut%2C_Boston_Aquarium_%28cropped%29.jpg/500px-Sea_walnut%2C_Boston_Aquarium_%28cropped%29.jpg',
  },
  {
    commonName: 'Sea squirt',
    scientificName: 'Ciona intestinalis',
    ncbiTaxId: 7719,
    wikiTitle: 'Ciona_intestinalis',
    group: 'invertebrate',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Cionaintestinalis.jpg/500px-Cionaintestinalis.jpg',
  },
  {
    commonName: 'Lancelet',
    scientificName: 'Branchiostoma lanceolatum',
    ncbiTaxId: 7740,
    wikiTitle: 'Branchiostoma_lanceolatum',
    group: 'invertebrate',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Branchiostoma_lanceolatum.jpg/330px-Branchiostoma_lanceolatum.jpg',
  },
  {
    commonName: 'Sea cucumber',
    scientificName: 'Apostichopus japonicus',
    ncbiTaxId: 307972,
    wikiTitle: 'Apostichopus_japonicus',
    group: 'invertebrate',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Apostichopus_japonicus.jpg/330px-Apostichopus_japonicus.jpg',
  },
  {
    commonName: 'Salp',
    scientificName: 'Salpa thompsoni',
    ncbiTaxId: 569448,
    wikiTitle: 'Salp',
    group: 'invertebrate',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Salp.jpg/330px-Salp.jpg',
  },
  {
    commonName: "Portuguese man o' war",
    scientificName: 'Physalia physalis',
    ncbiTaxId: 168775,
    wikiTitle: "Portuguese_man_o'_war",
    group: 'invertebrate',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Portuguese_Man-O-War_%28Physalia_physalis%29.jpg/330px-Portuguese_Man-O-War_%28Physalia_physalis%29.jpg',
  },
  {
    commonName: 'Vampire squid',
    scientificName: 'Vampyroteuthis infernalis',
    ncbiTaxId: 55288,
    wikiTitle: 'Vampire_squid',
    group: 'invertebrate',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Vampyroteuthis_illustration.jpg/330px-Vampyroteuthis_illustration.jpg',
  },
  {
    commonName: 'Crinoid',
    scientificName: 'Antedon mediterranea',
    ncbiTaxId: 105859,
    wikiTitle: 'Crinoid',
    group: 'invertebrate',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/e/ea/Antedon_mediterranea.jpg',
  },
  {
    commonName: 'Brittle star',
    scientificName: 'Ophiothrix fragilis',
    ncbiTaxId: 70180,
    wikiTitle: 'Brittle_star',
    group: 'invertebrate',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Ophiura_ophiura.jpg/330px-Ophiura_ophiura.jpg',
  },
  {
    commonName: 'Velvet worm',
    scientificName: 'Euperipatoides rowelli',
    ncbiTaxId: 49087,
    wikiTitle: 'Velvet_worm',
    group: 'invertebrate',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Velvet_worm_rotated%2C_mirror.png/330px-Velvet_worm_rotated%2C_mirror.png',
  },
  {
    commonName: 'Chiton',
    scientificName: 'Chiton tuberculatus',
    ncbiTaxId: 1539881,
    wikiTitle: 'Chiton_tuberculatus',
    group: 'invertebrate',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Chiton_tuberculatus.jpg/330px-Chiton_tuberculatus.jpg',
  },
  {
    commonName: 'Sea angel',
    scientificName: 'Clione limacina',
    ncbiTaxId: 71516,
    wikiTitle: 'Clione_limacina',
    group: 'invertebrate',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Clione_limacina_by_NOAA.jpg/330px-Clione_limacina_by_NOAA.jpg',
  },
  {
    commonName: 'Phylliroe',
    scientificName: 'Phylliroe bucephala',
    ncbiTaxId: 1903125,
    wikiTitle: 'Phylliroe_bucephala',
    group: 'invertebrate',
    imageUrl:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Phylliroe_bucephalum.jpg?width=330',
  },
  {
    commonName: 'Phronima',
    scientificName: 'Phronima sedentaria',
    ncbiTaxId: 472282,
    wikiTitle: 'Phronima',
    group: 'invertebrate',
    imageUrl:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Phronima_sedentaria_(YPM_IZ_075000).jpeg?width=330',
  },

  // Plants
  {
    commonName: 'Thale cress',
    scientificName: 'Arabidopsis thaliana',
    ncbiTaxId: 3702,
    wikiTitle: 'Arabidopsis_thaliana',
    group: 'plant',
    imageUrl:
      'https://api.ncbi.nlm.nih.gov/datasets/v2/taxonomy/taxon/3702/image',
  },
  {
    commonName: 'English oak',
    scientificName: 'Quercus robur',
    ncbiTaxId: 38942,
    wikiTitle: 'Quercus_robur',
    group: 'plant',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Quercus_robur.jpg/330px-Quercus_robur.jpg',
  },
  {
    commonName: 'Pumpkin',
    scientificName: 'Cucurbita pepo',
    ncbiTaxId: 3663,
    wikiTitle: 'Cucurbita_pepo',
    group: 'plant',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Cucurbita_pepo_collage_1.png/500px-Cucurbita_pepo_collage_1.png',
  },
  {
    commonName: 'Scots pine',
    scientificName: 'Pinus sylvestris',
    ncbiTaxId: 3349,
    wikiTitle: 'Scots_pine',
    group: 'plant',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Skuleskogen_pine.jpg/330px-Skuleskogen_pine.jpg',
  },
  {
    commonName: 'Mango',
    scientificName: 'Mangifera indica',
    ncbiTaxId: 29780,
    wikiTitle: 'Mango',
    group: 'plant',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Mangoes_%28Magnifera_indica%29_from_India.jpg/330px-Mangoes_%28Magnifera_indica%29_from_India.jpg',
  },
  {
    commonName: 'Poison ivy',
    scientificName: 'Toxicodendron radicans',
    ncbiTaxId: 43853,
    wikiTitle: 'Toxicodendron_radicans',
    group: 'plant',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/2014-10-29_13_43_39_Poison_Ivy_foliage_during_autumn_leaf_coloration_in_Ewing%2C_New_Jersey.JPG/330px-2014-10-29_13_43_39_Poison_Ivy_foliage_during_autumn_leaf_coloration_in_Ewing%2C_New_Jersey.JPG',
  },
  {
    commonName: 'English ivy',
    scientificName: 'Hedera helix',
    ncbiTaxId: 4052,
    wikiTitle: 'Hedera_helix',
    group: 'plant',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Hedera_helix_Dover.jpg/330px-Hedera_helix_Dover.jpg',
  },
  {
    commonName: 'Tomato',
    scientificName: 'Solanum lycopersicum',
    ncbiTaxId: 4081,
    wikiTitle: 'Tomato',
    group: 'plant',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Tomato_je.jpg/330px-Tomato_je.jpg',
  },
  {
    commonName: 'Ocotillo',
    scientificName: 'Fouquieria splendens',
    ncbiTaxId: 13533,
    wikiTitle: 'Fouquieria_splendens',
    group: 'plant',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Ocotillo_GB.jpg/330px-Ocotillo_GB.jpg',
  },
  {
    commonName: 'Blueberry',
    scientificName: 'Vaccinium corymbosum',
    ncbiTaxId: 69266,
    wikiTitle: 'Vaccinium_corymbosum',
    group: 'plant',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Vaccinium_corymbosum%2801%29.jpg/330px-Vaccinium_corymbosum%2801%29.jpg',
  },
  {
    commonName: 'Cotton',
    scientificName: 'Gossypium hirsutum',
    ncbiTaxId: 3635,
    wikiTitle: 'Gossypium_hirsutum',
    group: 'plant',
    imageUrl:
      'https://api.ncbi.nlm.nih.gov/datasets/v2/taxonomy/taxon/3635/image',
  },
  {
    commonName: 'Cacao',
    scientificName: 'Theobroma cacao',
    ncbiTaxId: 3641,
    wikiTitle: 'Theobroma_cacao',
    group: 'plant',
    imageUrl:
      'https://api.ncbi.nlm.nih.gov/datasets/v2/taxonomy/taxon/3641/image',
  },
  {
    commonName: 'Venus flytrap',
    scientificName: 'Dionaea muscipula',
    ncbiTaxId: 4362,
    wikiTitle: 'Venus_flytrap',
    group: 'plant',
    imageUrl:
      'https://api.ncbi.nlm.nih.gov/datasets/v2/taxonomy/taxon/4362/image',
  },
  {
    commonName: 'Saguaro cactus',
    scientificName: 'Carnegiea gigantea',
    ncbiTaxId: 171969,
    wikiTitle: 'Saguaro',
    group: 'plant',
    imageUrl:
      'https://inaturalist-open-data.s3.amazonaws.com/photos/77029090/medium.jpg',
  },
  {
    commonName: 'Jumping cholla',
    scientificName: 'Cylindropuntia fulgida',
    ncbiTaxId: 701512,
    wikiTitle: 'Cylindropuntia_fulgida',
    group: 'plant',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Choya_brincadora_-_panoramio.jpg/330px-Choya_brincadora_-_panoramio.jpg',
  },
  {
    commonName: 'Sacred lotus',
    scientificName: 'Nelumbo nucifera',
    ncbiTaxId: 4432,
    wikiTitle: 'Nelumbo_nucifera',
    group: 'plant',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Sacred_lotus_Nelumbo_nucifera.jpg/500px-Sacred_lotus_Nelumbo_nucifera.jpg',
  },
  {
    commonName: 'Water lily',
    scientificName: 'Nymphaea alba',
    ncbiTaxId: 34301,
    wikiTitle: 'Nymphaea_alba',
    group: 'plant',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/2016_Kwiat_grzybieni_bia%C5%82ych_2.jpg/330px-2016_Kwiat_grzybieni_bia%C5%82ych_2.jpg',
  },
  {
    commonName: 'Strawberry',
    scientificName: 'Fragaria vesca',
    ncbiTaxId: 57918,
    wikiTitle: 'Fragaria_vesca',
    group: 'plant',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Illustration_Fragaria_vesca0.jpg/330px-Illustration_Fragaria_vesca0.jpg',
  },
  {
    commonName: 'Peanut',
    scientificName: 'Arachis hypogaea',
    ncbiTaxId: 3818,
    wikiTitle: 'Peanut',
    group: 'plant',
    imageUrl:
      'https://api.ncbi.nlm.nih.gov/datasets/v2/taxonomy/taxon/3818/image',
  },
  {
    commonName: 'Cashew',
    scientificName: 'Anacardium occidentale',
    ncbiTaxId: 171929,
    wikiTitle: 'Cashew',
    group: 'plant',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Cashew_apples.jpg/330px-Cashew_apples.jpg',
  },
  {
    commonName: 'Almond',
    scientificName: 'Prunus dulcis',
    ncbiTaxId: 3755,
    wikiTitle: 'Almond',
    group: 'plant',
    imageUrl:
      'https://api.ncbi.nlm.nih.gov/datasets/v2/taxonomy/taxon/3755/image',
  },
  {
    commonName: 'Rose',
    scientificName: 'Rosa gallica',
    ncbiTaxId: 74632,
    wikiTitle: 'Rosa_gallica',
    group: 'plant',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Wild_Rosa_gallica_Romania.jpg/330px-Wild_Rosa_gallica_Romania.jpg',
  },
  {
    commonName: 'Bamboo',
    scientificName: 'Phyllostachys edulis',
    ncbiTaxId: 38705,
    wikiTitle: 'Phyllostachys_edulis',
    group: 'plant',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Bamboo_forest.jpg/330px-Bamboo_forest.jpg',
  },
  {
    commonName: 'Rice',
    scientificName: 'Oryza sativa',
    ncbiTaxId: 4530,
    wikiTitle: 'Rice',
    group: 'plant',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Mature_Rice_%28India%29_by_Augustus_Binu.jpg/330px-Mature_Rice_%28India%29_by_Augustus_Binu.jpg',
  },
  {
    commonName: 'Baobab',
    scientificName: 'Adansonia digitata',
    ncbiTaxId: 69109,
    wikiTitle: 'Adansonia_digitata',
    group: 'plant',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Baobab_and_elephant%2C_Tanzania.jpg/330px-Baobab_and_elephant%2C_Tanzania.jpg',
  },
  {
    commonName: 'Duckweed',
    scientificName: 'Lemna minor',
    ncbiTaxId: 4472,
    wikiTitle: 'Lemna_minor',
    group: 'plant',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Eendekroos_dicht_bijeen.JPG/330px-Eendekroos_dicht_bijeen.JPG',
  },
  {
    commonName: 'Coconut palm',
    scientificName: 'Cocos nucifera',
    ncbiTaxId: 13894,
    wikiTitle: 'Coconut',
    group: 'plant',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Cocos_nucifera_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-187.jpg/330px-Cocos_nucifera_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-187.jpg',
  },

  {
    commonName: 'Orchid',
    scientificName: 'Phalaenopsis equestris',
    ncbiTaxId: 78828,
    wikiTitle: 'Orchidaceae',
    group: 'plant',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Phalaenopsis_equestris.jpg/500px-Phalaenopsis_equestris.jpg',
  },
  {
    commonName: 'Sunflower',
    scientificName: 'Helianthus annuus',
    ncbiTaxId: 4232,
    wikiTitle: 'Common_sunflower',
    group: 'plant',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Sunflower_sky_backdrop.jpg/330px-Sunflower_sky_backdrop.jpg',
  },
  {
    commonName: 'Fuchsia',
    scientificName: 'Fuchsia',
    ncbiTaxId: 13069,
    wikiTitle: 'Fuchsia',
    group: 'plant',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Brincos_De_Princesa.jpg/330px-Brincos_De_Princesa.jpg',
  },
  {
    commonName: 'Carrot',
    scientificName: 'Daucus carota',
    ncbiTaxId: 4039,
    wikiTitle: 'Carrot',
    group: 'plant',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Daucus_carota_May_2008-1_edit.jpg/330px-Daucus_carota_May_2008-1_edit.jpg',
  },
  {
    commonName: 'Sphagnum moss',
    scientificName: 'Sphagnum palustre',
    ncbiTaxId: 13805,
    wikiTitle: 'Sphagnum',
    group: 'plant',
    imageUrl:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Sphagnum.palustre.-.lindsey.jpg?width=330',
  },
  {
    commonName: 'Common fern',
    scientificName: 'Pteridium aquilinum',
    ncbiTaxId: 32101,
    wikiTitle: 'Pteridium_aquilinum',
    group: 'plant',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Adelaarsvaren_planten_Pteridium_aquilinum.jpg/330px-Adelaarsvaren_planten_Pteridium_aquilinum.jpg',
  },
  {
    commonName: 'Welwitschia',
    scientificName: 'Welwitschia mirabilis',
    ncbiTaxId: 3377,
    wikiTitle: 'Welwitschia',
    group: 'plant',
    imageUrl:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Welwitschia_mirablis_%5E_Ragnhild-4657_-_Flickr_-_Ragnhild_%26_Neil_Crawford.jpg?width=330',
  },
  {
    commonName: 'Ginkgo',
    scientificName: 'Ginkgo biloba',
    ncbiTaxId: 3311,
    wikiTitle: 'Ginkgo_biloba',
    group: 'plant',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/GINKGOBAUM-2.jpg/330px-GINKGOBAUM-2.jpg',
  },

  {
    commonName: 'Iris',
    scientificName: 'Iris germanica',
    ncbiTaxId: 34205,
    wikiTitle: 'Iris_(plant)',
    group: 'plant',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Iris_sanguinea_cultivar%2C_Wakehurst_Place%2C_UK_-_Diliff.jpg/330px-Iris_sanguinea_cultivar%2C_Wakehurst_Place%2C_UK_-_Diliff.jpg',
  },
  {
    commonName: 'Snapdragon',
    scientificName: 'Antirrhinum majus',
    ncbiTaxId: 4151,
    wikiTitle: 'Antirrhinum_majus',
    group: 'plant',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Antirrhinum_majus_BCBG_%2802%29.jpg/330px-Antirrhinum_majus_BCBG_%2802%29.jpg',
  },
  {
    commonName: 'Avocado',
    scientificName: 'Persea americana',
    ncbiTaxId: 3435,
    wikiTitle: 'Avocado',
    group: 'plant',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Persea_americana_fruit_2.JPG/330px-Persea_americana_fruit_2.JPG',
  },
  {
    commonName: 'Cinnamon',
    scientificName: 'Cinnamomum verum',
    ncbiTaxId: 128608,
    wikiTitle: 'Cinnamomum_verum',
    group: 'plant',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Cinnamomum_verum1.jpg/330px-Cinnamomum_verum1.jpg',
  },
  {
    commonName: 'Potato',
    scientificName: 'Solanum tuberosum',
    ncbiTaxId: 4113,
    wikiTitle: 'Potato',
    group: 'plant',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Patates.jpg/330px-Patates.jpg',
  },
  {
    commonName: 'Hot pepper',
    scientificName: 'Capsicum annuum',
    ncbiTaxId: 4072,
    wikiTitle: 'Capsicum_annuum',
    group: 'plant',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Capsicum_annuum_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-027.jpg/330px-Capsicum_annuum_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-027.jpg',
  },
  {
    commonName: 'Dodder',
    scientificName: 'Cuscuta campestris',
    ncbiTaxId: 132261,
    wikiTitle: 'Cuscuta',
    group: 'plant',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Cuscuta_europaea_bgiu.jpg/330px-Cuscuta_europaea_bgiu.jpg',
  },
  {
    commonName: 'Indian pipe',
    scientificName: 'Monotropa uniflora',
    ncbiTaxId: 50148,
    wikiTitle: 'Monotropa_uniflora',
    group: 'plant',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Monotropa_uniflora_in_Penwood_State_Park_3%2C_2009-07-03.jpg/330px-Monotropa_uniflora_in_Penwood_State_Park_3%2C_2009-07-03.jpg',
  },
  {
    commonName: 'Wheat',
    scientificName: 'Triticum aestivum',
    ncbiTaxId: 4565,
    wikiTitle: 'Common_wheat',
    group: 'plant',
    imageUrl:
      'https://api.ncbi.nlm.nih.gov/datasets/v2/taxonomy/taxon/4565/image',
  },
  {
    commonName: 'Corpse lily',
    scientificName: 'Rafflesia arnoldii',
    ncbiTaxId: 577516,
    wikiTitle: 'Rafflesia_arnoldii',
    group: 'plant',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Rafflesia_arnoldii%2C_Sumatra.jpg/330px-Rafflesia_arnoldii%2C_Sumatra.jpg',
  },
  {
    commonName: 'Mistletoe',
    scientificName: 'Viscum album',
    ncbiTaxId: 3972,
    wikiTitle: 'Viscum_album',
    group: 'plant',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Viscum_album_2026_G1.jpg/330px-Viscum_album_2026_G1.jpg',
  },
  {
    commonName: 'Redwood',
    scientificName: 'Sequoia sempervirens',
    ncbiTaxId: 28980,
    wikiTitle: 'Sequoia_sempervirens',
    group: 'plant',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/US_199_Redwood_Highway.jpg/330px-US_199_Redwood_Highway.jpg',
  },
  {
    commonName: 'Lily',
    scientificName: 'Lilium longiflorum',
    ncbiTaxId: 4690,
    wikiTitle: 'Lilium',
    group: 'plant',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Lilium_candidum_1.jpg/330px-Lilium_candidum_1.jpg',
  },
  {
    commonName: 'Banana',
    scientificName: 'Musa acuminata',
    ncbiTaxId: 4641,
    wikiTitle: 'Banana',
    group: 'plant',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Bananavarieties.jpg/330px-Bananavarieties.jpg',
  },
  {
    commonName: 'Black locust',
    scientificName: 'Robinia pseudoacacia',
    ncbiTaxId: 35938,
    wikiTitle: 'Robinia_pseudoacacia',
    group: 'plant',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/8/86/Robina9146.JPG',
  },
  {
    commonName: 'Dandelion',
    scientificName: 'Taraxacum officinale',
    ncbiTaxId: 50225,
    wikiTitle: 'Taraxacum_officinale',
    group: 'plant',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Taraxacum_officinale_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-135.jpg/330px-Taraxacum_officinale_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-135.jpg',
  },
  {
    commonName: 'Giant groundsel',
    scientificName: 'Dendrosenecio kilimanjari',
    ncbiTaxId: 109559,
    wikiTitle: 'Dendrosenecio_kilimanjari',
    group: 'plant',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Senecio_kilimanjari_Barranco.jpg/330px-Senecio_kilimanjari_Barranco.jpg',
  },
  {
    commonName: 'Weeping willow',
    scientificName: 'Salix babylonica',
    ncbiTaxId: 75706,
    wikiTitle: 'Salix_babylonica',
    group: 'plant',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Ch%C3%A2teau_de_Chenonceau_-_jardin_Russell-Page_%2801%29.jpg/330px-Ch%C3%A2teau_de_Chenonceau_-_jardin_Russell-Page_%2801%29.jpg',
  },
  {
    commonName: 'Garden violet',
    scientificName: 'Viola odorata',
    ncbiTaxId: 97441,
    wikiTitle: 'Viola_odorata',
    group: 'plant',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Viola_odorata_fg01.JPG/330px-Viola_odorata_fg01.JPG',
  },
  {
    commonName: 'Dragon blood tree',
    scientificName: 'Dracaena cinnabari',
    ncbiTaxId: 1142948,
    wikiTitle: 'Dracaena_cinnabari',
    group: 'plant',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Dragonblood_tree_in_Socotra_2.jpg/330px-Dragonblood_tree_in_Socotra_2.jpg',
  },
  {
    commonName: 'African milk tree',
    scientificName: 'Euphorbia trigona',
    ncbiTaxId: 1492770,
    wikiTitle: 'Euphorbia_trigona',
    group: 'plant',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/T%C3%ADas-Yaiza_-_LZ-2-LZ-706_-_Euphorbia_trigona_02_ies.jpg/330px-T%C3%ADas-Yaiza_-_LZ-2-LZ-706_-_Euphorbia_trigona_02_ies.jpg',
  },
  {
    commonName: 'Poinsettia',
    scientificName: 'Euphorbia pulcherrima',
    ncbiTaxId: 37495,
    wikiTitle: 'Poinsettia',
    group: 'plant',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Weihnachtsstern_-_gro%C3%9F.jpg/330px-Weihnachtsstern_-_gro%C3%9F.jpg',
  },
  {
    commonName: 'Papaya',
    scientificName: 'Carica papaya',
    ncbiTaxId: 3649,
    wikiTitle: 'Papaya',
    group: 'plant',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Carica_papaya_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-029.jpg/330px-Carica_papaya_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-029.jpg',
  },
  {
    commonName: 'Cabbage',
    scientificName: 'Brassica oleracea',
    ncbiTaxId: 3712,
    wikiTitle: 'Brassica_oleracea',
    group: 'plant',
    imageUrl:
      'https://api.ncbi.nlm.nih.gov/datasets/v2/taxonomy/taxon/3712/image',
  },
  {
    commonName: 'American pitcher plant',
    scientificName: 'Sarracenia purpurea',
    ncbiTaxId: 45176,
    wikiTitle: 'Sarracenia_purpurea',
    group: 'plant',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Sarracenia_purpurea_Flowers.JPG/330px-Sarracenia_purpurea_Flowers.JPG',
  },
  {
    commonName: 'Tropical pitcher plant',
    scientificName: 'Nepenthes rajah',
    ncbiTaxId: 150991,
    wikiTitle: 'Nepenthes_rajah',
    group: 'plant',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Nepenthes_rajah.png/330px-Nepenthes_rajah.png',
  },

  // Microorganisms (fungi + protists)
  {
    commonName: "Baker's yeast",
    scientificName: 'Saccharomyces cerevisiae',
    ncbiTaxId: 4932,
    wikiTitle: 'Saccharomyces_cerevisiae',
    group: 'microbe',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Saccharomyces_cerevisiae_SEM.jpg/330px-Saccharomyces_cerevisiae_SEM.jpg',
  },
  {
    commonName: 'Candida auris',
    scientificName: 'Candidozyma auris',
    ncbiTaxId: 498019,
    wikiTitle: 'Candida_auris',
    group: 'microbe',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Candida-auris_2016-250px.jpg/500px-Candida-auris_2016-250px.jpg',
  },
  {
    commonName: 'Fly agaric',
    scientificName: 'Amanita muscaria',
    ncbiTaxId: 41956,
    wikiTitle: 'Amanita_muscaria',
    group: 'microbe',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Amanita_muscaria_3_vliegenzwammen_op_rij.jpg/330px-Amanita_muscaria_3_vliegenzwammen_op_rij.jpg',
  },
  {
    commonName: 'Morel',
    scientificName: 'Morchella esculenta',
    ncbiTaxId: 39407,
    wikiTitle: 'Morchella_esculenta',
    group: 'microbe',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Morchella_esculenta_-_DE_-_TH_-_2013-05-01_-_01.JPG/330px-Morchella_esculenta_-_DE_-_TH_-_2013-05-01_-_01.JPG',
  },
  {
    commonName: 'Penicillium',
    scientificName: 'Penicillium chrysogenum',
    ncbiTaxId: 5076,
    wikiTitle: 'Penicillium_chrysogenum',
    group: 'microbe',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Penicillium_notatum.jpg/330px-Penicillium_notatum.jpg',
  },
  {
    commonName: 'Amoeba',
    scientificName: 'Amoeba proteus',
    ncbiTaxId: 5775,
    wikiTitle: 'Amoeba_proteus',
    group: 'microbe',
    imageUrl:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Amoeba_proteus_with_many_pseudopodia.jpg?width=330',
  },
  {
    commonName: 'Paramecium',
    scientificName: 'Paramecium caudatum',
    ncbiTaxId: 5885,
    wikiTitle: 'Paramecium',
    group: 'microbe',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Paramecium_caudatum_Ehrenberg%2C_1833.jpg/330px-Paramecium_caudatum_Ehrenberg%2C_1833.jpg',
  },
  {
    commonName: 'Plasmodium',
    scientificName: 'Plasmodium falciparum',
    ncbiTaxId: 5833,
    wikiTitle: 'Plasmodium_falciparum',
    group: 'microbe',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Plasmodium_falciparum_01.png/330px-Plasmodium_falciparum_01.png',
  },
  {
    commonName: 'Giant kelp',
    scientificName: 'Macrocystis pyrifera',
    ncbiTaxId: 35122,
    wikiTitle: 'Macrocystis_pyrifera',
    group: 'microbe',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Giantkelp2_300.jpg/330px-Giantkelp2_300.jpg',
  },
  {
    commonName: 'Slime mold',
    scientificName: 'Badhamia polycephala',
    ncbiTaxId: 5791,
    wikiTitle: 'Physarum_polycephalum',
    group: 'microbe',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Physarum_polycephalum_plasmodium.jpg/330px-Physarum_polycephalum_plasmodium.jpg',
  },
  {
    commonName: 'Oomycete',
    scientificName: 'Phytophthora infestans',
    ncbiTaxId: 4787,
    wikiTitle: 'Phytophthora_infestans',
    group: 'microbe',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Late_blight_on_potato_leaf_2.jpg/330px-Late_blight_on_potato_leaf_2.jpg',
  },
  {
    commonName: 'Microsporidian',
    scientificName: 'Fibrillanosema crangonycis',
    ncbiTaxId: 253633,
    wikiTitle: 'Fibrillanosema_crangonycis',
    group: 'microbe',
    imageUrl:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Fibrillanosema_spore.jpg?width=330',
  },
  {
    commonName: 'Diatom',
    scientificName: 'Thalassiosira pseudonana',
    ncbiTaxId: 35128,
    wikiTitle: 'Diatom',
    group: 'microbe',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Oogonium_--_3_%2834809275943%29.jpg/330px-Oogonium_--_3_%2834809275943%29.jpg',
  },
  {
    commonName: 'Polycystine',
    scientificName: 'Polycystinea',
    ncbiTaxId: 65582,
    wikiTitle: 'Polycystine',
    group: 'microbe',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/d/d3/Radiolarian.png',
  },
  {
    commonName: 'Myxozoan',
    scientificName: 'Myxobolus cerebralis',
    ncbiTaxId: 59783,
    wikiTitle: 'Myxobolus_cerebralis',
    group: 'invertebrate',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/3/3b/Fdl17-9-grey.jpg',
  },
  {
    commonName: 'Trichoplax',
    scientificName: 'Trichoplax adhaerens',
    ncbiTaxId: 10228,
    wikiTitle: 'Trichoplax_adhaerens',
    group: 'invertebrate',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Trichoplax_mic.jpg/500px-Trichoplax_mic.jpg',
  },
  {
    commonName: 'Hydra',
    scientificName: 'Hydra vulgaris',
    ncbiTaxId: 6087,
    wikiTitle: 'Hydra_(genus)',
    group: 'invertebrate',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Hydra_biology.jpg/500px-Hydra_biology.jpg',
  },
  {
    commonName: 'Planarian',
    scientificName: 'Schmidtea mediterranea',
    ncbiTaxId: 79327,
    wikiTitle: 'Schmidtea_mediterranea',
    group: 'invertebrate',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/df/Smed.jpg',
  },
  {
    commonName: 'Acoel flatworm',
    scientificName: 'Symsagittifera roscoffensis',
    ncbiTaxId: 84072,
    wikiTitle: 'Neochildia',
    group: 'invertebrate',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/60/Neochildia_fusca.jpg',
  },
  {
    commonName: 'Termite',
    scientificName: 'Reticulitermes flavipes',
    ncbiTaxId: 36989,
    wikiTitle: 'Eastern_subterranean_termite',
    group: 'invertebrate',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Reticulitermes_flavipes_K8085-6.jpg/330px-Reticulitermes_flavipes_K8085-6.jpg',
  },
  {
    commonName: 'American cockroach',
    scientificName: 'Periplaneta americana',
    ncbiTaxId: 6978,
    wikiTitle: 'American_cockroach',
    group: 'invertebrate',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/American-cockroach.jpg/330px-American-cockroach.jpg',
  },
  {
    commonName: 'Cat flea',
    scientificName: 'Ctenocephalides felis',
    ncbiTaxId: 7515,
    wikiTitle: 'Cat_flea',
    group: 'invertebrate',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/%D0%9A%D0%BE%D1%88%D0%B0%D1%87%D1%8C%D1%8F_%D0%B1%D0%BB%D0%BE%D1%85%D0%B0.jpg/330px-%D0%9A%D0%BE%D1%88%D0%B0%D1%87%D1%8C%D1%8F_%D0%B1%D0%BB%D0%BE%D1%85%D0%B0.jpg',
  },
  {
    commonName: 'Scorpionfly',
    scientificName: 'Panorpa communis',
    ncbiTaxId: 52816,
    wikiTitle: 'Panorpa_communis',
    group: 'invertebrate',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Panorpa_communis_with_prey_Diogma_glabrata_glabrata.jpg/330px-Panorpa_communis_with_prey_Diogma_glabrata_glabrata.jpg',
  },
]
