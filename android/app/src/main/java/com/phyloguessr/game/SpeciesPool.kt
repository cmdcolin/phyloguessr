package com.phyloguessr.game

import com.phyloguessr.data.Organism
import com.phyloguessr.data.TaxonomyData

data class SpeciesPoolEntry(
    val taxId: Int,
    val commonName: String,
    val scientificName: String,
    val imageUrl: String? = null,
)

fun SpeciesPoolEntry.toOrganism(group: String = "random") = Organism(
    commonName = commonName,
    scientificName = scientificName,
    ncbiTaxId = taxId,
    wikiTitle = scientificName.replace(' ', '_'),
    group = group,
    imageUrl = imageUrl,
)

fun pickThreeFromClade(
    ancestorTaxId: Int,
    pool: List<SpeciesPoolEntry>,
    data: TaxonomyData,
): List<SpeciesPoolEntry>? {
    val matches = pool.filter { isDescendantOf(it.taxId, ancestorTaxId, data.parents) }
    if (matches.size < 3) {
        return null
    }

    val ancestorRank = data.ranks[ancestorTaxId.toString()]
    val skipDiversityCheck = ancestorRank == "genus"
        || ancestorRank == "subgenus"
        || ancestorRank == "species group"

    for (attempt in 0 until 50) {
        val picks = matches.shuffled().take(3)

        if (skipDiversityCheck) {
            return picks
        }

        val genusOrFamily = { lin: List<Int> ->
            lin.firstOrNull { id ->
                val rank = data.ranks[id.toString()]
                rank == "genus" || rank == "family"
            } ?: -1
        }

        val g0 = genusOrFamily(getLineageFromParents(picks[0].taxId, data.parents))
        val g1 = genusOrFamily(getLineageFromParents(picks[1].taxId, data.parents))
        val g2 = genusOrFamily(getLineageFromParents(picks[2].taxId, data.parents))

        if (g0 != g1 && g0 != g2 && g1 != g2) {
            return picks
        }
    }

    return matches.shuffled().take(3)
}

private val TARGET_RANKS = listOf("family", "order", "class", "phylum")

fun pickThreeHardModeDistance(
    pool: List<SpeciesPoolEntry>,
    data: TaxonomyData,
): Pair<List<SpeciesPoolEntry>, CladeInfo?> {
    val cladeCounts = mutableMapOf<Int, Int>()
    val targetRanks = TARGET_RANKS.toSet()

    for (entry in pool) {
        val lineage = getLineageFromParents(entry.taxId, data.parents)
        for (id in lineage) {
            val rank = data.ranks[id.toString()]
            if (rank != null && rank in targetRanks) {
                cladeCounts[id] = (cladeCounts[id] ?: 0) + 1
            }
        }
    }

    val byRank = mutableMapOf<String, MutableList<CladeInfo>>()
    for (r in TARGET_RANKS) {
        byRank[r] = mutableListOf()
    }

    for ((taxId, count) in cladeCounts) {
        if (count >= 3) {
            val rank = data.ranks[taxId.toString()] ?: continue
            val bucket = byRank[rank] ?: continue
            bucket.add(
                CladeInfo(
                    taxId = taxId,
                    name = data.names[taxId.toString()] ?: "Taxon $taxId",
                    rank = rank,
                )
            )
        }
    }

    val nonEmptyRanks = TARGET_RANKS.filter { byRank[it]?.isNotEmpty() == true }

    for (attempt in 0 until 20) {
        val rank = nonEmptyRanks.random()
        val bucket = byRank[rank]!!
        val clade = bucket.random()
        val result = pickThreeFromClade(clade.taxId, pool, data)
        if (result != null) {
            return result to clade
        }
    }

    return pickThreeHardMode(pool, data) to null
}

data class CladeInfo(
    val taxId: Int,
    val name: String,
    val rank: String,
)

fun pickThreeHardMode(
    pool: List<SpeciesPoolEntry>,
    data: TaxonomyData,
): List<SpeciesPoolEntry> {
    for (attempt in 0 until 100) {
        val picks = pool.shuffled().take(3)

        val genusOrFamily = { lin: List<Int> ->
            lin.firstOrNull { id ->
                val rank = data.ranks[id.toString()]
                rank == "genus" || rank == "family"
            } ?: -1
        }

        val g0 = genusOrFamily(getLineageFromParents(picks[0].taxId, data.parents))
        val g1 = genusOrFamily(getLineageFromParents(picks[1].taxId, data.parents))
        val g2 = genusOrFamily(getLineageFromParents(picks[2].taxId, data.parents))

        if (g0 != g1 && g0 != g2 && g1 != g2) {
            return picks
        }
    }
    return pool.shuffled().take(3)
}
