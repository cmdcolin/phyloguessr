package com.phyloguessr.data

data class TaxonomyData(
    val parents: Map<String, Int>,
    val names: Map<String, String>,
    val ranks: Map<String, String>,
)

data class CompactTaxonomyData(
    val R: List<String>,
    val D: Map<String, List<Any>>,
)

fun unpackTaxonomyData(compact: CompactTaxonomyData): TaxonomyData {
    val parents = mutableMapOf<String, Int>()
    val names = mutableMapOf<String, String>()
    val ranks = mutableMapOf<String, String>()
    for ((id, entry) in compact.D) {
        val parent = (entry[0] as Number).toInt()
        val name = entry[1] as String
        val rankIdx = (entry[2] as Number).toInt()
        parents[id] = parent
        if (name.isNotEmpty()) {
            names[id] = name
        }
        if (rankIdx >= 0) {
            ranks[id] = compact.R[rankIdx]
        }
    }
    return TaxonomyData(parents, names, ranks)
}
