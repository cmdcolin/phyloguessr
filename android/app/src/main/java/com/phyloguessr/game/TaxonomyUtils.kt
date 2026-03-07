package com.phyloguessr.game

import com.phyloguessr.data.TaxonomyData

data class LcaResult(
    val taxId: Int,
    val name: String,
    val rank: String,
    val depth: Int,
)

data class ClosestPairResult(
    val sister1TaxId: Int,
    val sister2TaxId: Int,
    val outgroupTaxId: Int,
    val sisterLca: LcaResult,
    val overallLca: LcaResult,
    val isPolytomy: Boolean,
)

fun getLineageFromParents(taxId: Int, parents: Map<String, Int>): List<Int> {
    val lineage = mutableListOf<Int>()
    var current = taxId
    val seen = mutableSetOf<Int>()
    while (current != 1 && current !in seen) {
        seen.add(current)
        lineage.add(current)
        val parent = parents[current.toString()]
        if (parent == null || parent == current) {
            break
        }
        current = parent
    }
    lineage.add(1)
    return lineage
}

fun getLcaFromParents(a: Int, b: Int, data: TaxonomyData): LcaResult {
    val lineageA = getLineageFromParents(a, data.parents)
    val lineageB = getLineageFromParents(b, data.parents)
    val setB = lineageB.toSet()
    for (i in lineageA.indices) {
        if (lineageA[i] in setB) {
            val taxId = lineageA[i]
            return LcaResult(
                taxId = taxId,
                name = data.names[taxId.toString()] ?: taxId.toString(),
                rank = data.ranks[taxId.toString()] ?: "no rank",
                depth = lineageA.size - i,
            )
        }
    }
    return LcaResult(taxId = 1, name = "root", rank = "no rank", depth = 0)
}

fun findClosestPairFromData(
    taxIds: Triple<Int, Int, Int>,
    data: TaxonomyData,
): ClosestPairResult {
    val (a, b, c) = taxIds

    val lcaAB = getLcaFromParents(a, b, data)
    val lcaAC = getLcaFromParents(a, c, data)
    val lcaBC = getLcaFromParents(b, c, data)

    data class Pair(
        val lca: LcaResult,
        val s1: Int,
        val s2: Int,
        val out: Int,
        val otherLcas: List<LcaResult>,
    )

    val pairs = listOf(
        Pair(lcaAB, a, b, c, listOf(lcaAC, lcaBC)),
        Pair(lcaAC, a, c, b, listOf(lcaAB, lcaBC)),
        Pair(lcaBC, b, c, a, listOf(lcaAB, lcaAC)),
    )

    val isPolytomy = lcaAB.taxId == lcaAC.taxId && lcaAC.taxId == lcaBC.taxId

    var best = pairs[0]
    for (i in 1 until pairs.size) {
        if (pairs[i].lca.depth > best.lca.depth) {
            best = pairs[i]
        }
    }

    val overallLca = if (best.otherLcas[0].depth < best.otherLcas[1].depth) {
        best.otherLcas[0]
    } else {
        best.otherLcas[1]
    }

    return ClosestPairResult(
        sister1TaxId = best.s1,
        sister2TaxId = best.s2,
        outgroupTaxId = best.out,
        sisterLca = best.lca,
        overallLca = if (overallLca.depth < best.lca.depth) overallLca else best.lca,
        isPolytomy = isPolytomy,
    )
}

fun isDescendantOf(taxId: Int, ancestorId: Int, parents: Map<String, Int>): Boolean {
    var current = taxId
    val seen = mutableSetOf<Int>()
    while (current != 1 && current !in seen) {
        if (current == ancestorId) {
            return true
        }
        seen.add(current)
        val parent = parents[current.toString()]
        if (parent == null || parent == current) {
            break
        }
        current = parent
    }
    return current == ancestorId
}

fun findTaxIdByName(query: String, data: TaxonomyData): Int? {
    val lower = query.lowercase()
    for ((id, name) in data.names) {
        if (name.lowercase() == lower) {
            return id.toInt()
        }
    }
    return null
}

fun findTaxId(query: String, data: TaxonomyData): Int? {
    val trimmed = query.trim()
    if (trimmed.matches(Regex("^\\d+$"))) {
        val id = trimmed.toInt()
        if (data.parents.containsKey(trimmed) || data.names.containsKey(trimmed)) {
            return id
        }
    }
    return findTaxIdByName(trimmed, data)
}

data class PairRanking(
    val taxIdA: Int,
    val taxIdB: Int,
    val lca: LcaResult,
)

fun getAllPairLcas(taxIds: List<Int>, data: TaxonomyData): List<PairRanking> {
    val pairs = mutableListOf<PairRanking>()
    for (i in taxIds.indices) {
        for (j in i + 1 until taxIds.size) {
            val lca = getLcaFromParents(taxIds[i], taxIds[j], data)
            pairs.add(PairRanking(taxIdA = taxIds[i], taxIdB = taxIds[j], lca = lca))
        }
    }
    pairs.sortByDescending { it.lca.depth }
    return pairs
}

fun comboKey(organisms: List<Int>): String {
    return organisms.sorted().joinToString(",")
}

fun toggleSelect(prev: List<Int>, idx: Int): List<Int> {
    if (idx in prev) {
        return prev.filter { it != idx }
    }
    if (prev.size < 2) {
        return prev + idx
    }
    return listOf(prev[1], idx)
}
