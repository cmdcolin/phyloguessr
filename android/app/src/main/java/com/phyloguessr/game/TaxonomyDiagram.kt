package com.phyloguessr.game

import com.phyloguessr.data.Organism
import com.phyloguessr.data.TaxonomyData

data class DiagramNode(
    val label: String,
    val highlight: Boolean = false,
    val children: List<DiagramNode> = emptyList(),
)

private val contextRanks = setOf(
    "kingdom", "phylum", "subphylum", "superclass", "class", "subclass",
    "infraclass", "superorder", "order", "suborder", "infraorder",
    "superfamily", "family",
)

private data class CladePair(
    val branch: Pair<Int, String>?,
    val leaf: Pair<Int, String>?,
)

private fun findClades(lineage: List<Int>, aboveTaxId: Int, data: TaxonomyData): CladePair {
    val idx = lineage.indexOf(aboveTaxId)
    if (idx <= 0) return CladePair(null, null)
    val clades = mutableListOf<Pair<Int, String>>()
    for (i in idx - 1 downTo 0) {
        val rank = data.ranks[lineage[i].toString()]
        if (rank != null && rank in contextRanks) {
            val name = data.names[lineage[i].toString()] ?: lineage[i].toString()
            clades.add(lineage[i] to name)
        }
    }
    if (clades.isEmpty()) {
        val taxId = lineage[idx - 1]
        val name = data.names[taxId.toString()] ?: taxId.toString()
        return CladePair(null, taxId to name)
    }
    if (clades.size == 1) {
        return CladePair(null, clades[0])
    }
    return CladePair(clades[0], clades.last())
}

private fun makeLeafLabel(organism: Organism, clade: Pair<Int, String>?): String {
    if (clade != null) return "${clade.second} (${organism.commonName})"
    return organism.commonName
}

private fun makeBranchNode(organism: Organism, clades: CladePair, highlight: Boolean = false): DiagramNode {
    val leafClade = clades.leaf ?: clades.branch
    val leafLabel = makeLeafLabel(organism, leafClade)
    val leaf = DiagramNode(label = leafLabel, highlight = highlight)
    if (clades.branch != null && clades.leaf != null && clades.branch.first != clades.leaf.first) {
        return DiagramNode(
            label = clades.branch.second,
            highlight = highlight,
            children = listOf(leaf),
        )
    }
    return leaf
}

fun buildContextDiagram(
    sister1: Organism,
    sister2: Organism,
    outgroup: Organism,
    sisterLcaTaxId: Int,
    overallLcaTaxId: Int,
    data: TaxonomyData,
): DiagramNode? {
    if (sisterLcaTaxId == overallLcaTaxId) return null

    val lin1 = getLineageFromParents(sister1.ncbiTaxId, data.parents)
    val lin2 = getLineageFromParents(sister2.ncbiTaxId, data.parents)
    val linOut = getLineageFromParents(outgroup.ncbiTaxId, data.parents)

    val outIdx = linOut.indexOf(overallLcaTaxId)
    if (outIdx <= 0) return null

    val outClades = findClades(linOut, overallLcaTaxId, data)
    val s1Clades = findClades(lin1, sisterLcaTaxId, data)
    val s2Clades = findClades(lin2, sisterLcaTaxId, data)

    val outNode = makeBranchNode(outgroup, outClades)

    val sisterName = data.names[sisterLcaTaxId.toString()] ?: sisterLcaTaxId.toString()
    val sisterNode = DiagramNode(
        label = sisterName,
        highlight = true,
        children = listOf(
            makeBranchNode(sister1, s1Clades, true),
            makeBranchNode(sister2, s2Clades, true),
        ),
    )

    val overallName = data.names[overallLcaTaxId.toString()] ?: overallLcaTaxId.toString()
    return DiagramNode(
        label = overallName,
        children = listOf(outNode, sisterNode),
    )
}

fun renderDiagramLines(
    node: DiagramNode,
    prefix: String = "",
    isLast: Boolean = true,
    isRoot: Boolean = true,
): List<Pair<String, Boolean>> {
    val lines = mutableListOf<Pair<String, Boolean>>()
    val connector = when {
        isRoot -> ""
        isLast -> "└── "
        else -> "├── "
    }
    val isLeaf = node.children.isEmpty()
    lines.add("${prefix}${connector}${node.label}" to (isLeaf && node.highlight))
    if (node.children.isNotEmpty()) {
        val childPrefix = if (isRoot) "" else prefix + if (isLast) "    " else "│   "
        for (i in node.children.indices) {
            val child = node.children[i]
            val childIsLast = i == node.children.size - 1
            for (line in renderDiagramLines(child, childPrefix, childIsLast, false)) {
                lines.add(line)
            }
        }
    }
    return lines
}
