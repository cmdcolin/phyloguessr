package com.phyloguessr.data

data class Organism(
    val commonName: String,
    val scientificName: String,
    val ncbiTaxId: Int,
    val wikiTitle: String,
    val group: String,
    val imageUrl: String? = null,
)
