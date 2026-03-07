package com.phyloguessr.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.SubcomposeAsyncImage
import com.phyloguessr.data.Organism
import com.phyloguessr.data.TaxonomyData
import com.phyloguessr.game.DiagramNode
import com.phyloguessr.game.ResultData
import com.phyloguessr.game.buildContextDiagram
import com.phyloguessr.game.getLineageFromParents
import com.phyloguessr.game.renderDiagramLines
import com.phyloguessr.ui.theme.AnimatedResultText

private data class BreadcrumbStep(
    val taxId: Int,
    val name: String,
    val rank: String,
)

private val majorRanks = setOf("domain", "kingdom", "phylum", "class", "order", "family", "genus", "species")
private val pinnedRanks = setOf("domain", "kingdom", "phylum")

private fun getFullLineage(taxId: Int, data: TaxonomyData): List<BreadcrumbStep> {
    val lin = getLineageFromParents(taxId, data.parents)
    val steps = mutableListOf<BreadcrumbStep>()
    for (id in lin) {
        val name = data.names[id.toString()]
        val rank = data.ranks[id.toString()] ?: "no rank"
        if (name != null) {
            steps.add(BreadcrumbStep(taxId = id, name = name, rank = rank))
        }
    }
    return steps
}

private fun getDivergenceStart(lineages: List<List<BreadcrumbStep>>): Int {
    if (lineages.isEmpty()) return 0
    val minLen = lineages.minOf { it.size }
    var commonLen = 0
    for (i in 0 until minLen) {
        val id = lineages[0][i].taxId
        if (lineages.all { it[i].taxId == id }) {
            commonLen = i + 1
        } else {
            break
        }
    }
    val ref = lineages[0]
    for (i in commonLen - 1 downTo 0) {
        if (ref[i].rank in majorRanks) {
            return i
        }
    }
    return 0
}

@Composable
fun ResultScreen(
    result: ResultData,
    organisms: List<Organism>,
    taxonomyData: TaxonomyData?,
    onPlayAgain: () -> Unit,
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState()),
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        AnimatedResultText(
            text = if (result.isPolytomy) {
                "Polytomy!"
            } else if (result.correct) {
                "Correct!"
            } else {
                "Not quite!"
            },
            correct = result.correct || result.isPolytomy,
        )

        Spacer(modifier = Modifier.height(16.dp))

        if (result.isPolytomy) {
            Text(
                text = "All three share the same most recent common ancestor — there's no single closest pair in the taxonomy.",
                textAlign = TextAlign.Center,
                style = MaterialTheme.typography.bodyMedium,
            )
        } else {
            Text(
                text = "The closest pair:",
                style = MaterialTheme.typography.bodyMedium,
            )

            Spacer(modifier = Modifier.height(8.dp))

            SisterPairCard(result.sister1, result.sister2)

            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = "Their most recent common ancestor:",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
            Text(
                text = "${result.sisterMrcaName} (${result.sisterMrcaRank})",
                style = MaterialTheme.typography.titleSmall,
            )

            Spacer(modifier = Modifier.height(16.dp))

            Text(
                text = "Outgroup:",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )

            SmallOrganismRow(result.outgroup)

            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = "Overall common ancestor:",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
            Text(
                text = "${result.overallMrcaName} (${result.overallMrcaRank})",
                style = MaterialTheme.typography.titleSmall,
            )
        }

        if (result.funFact != null) {
            Spacer(modifier = Modifier.height(16.dp))
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(
                    containerColor = MaterialTheme.colorScheme.tertiaryContainer,
                ),
            ) {
                Text(
                    text = result.funFact,
                    modifier = Modifier.padding(16.dp),
                    style = MaterialTheme.typography.bodyMedium,
                )
            }
        }

        if (!result.isPolytomy && !result.activelyDebated) {
            Spacer(modifier = Modifier.height(16.dp))
            PhyloTreeCanvas(result = result)
        }

        if (!result.isPolytomy && taxonomyData != null) {
            val diagram = remember(result) {
                buildContextDiagram(
                    sister1 = result.sister1,
                    sister2 = result.sister2,
                    outgroup = result.outgroup,
                    sisterLcaTaxId = result.sisterMrcaTaxId,
                    overallLcaTaxId = result.overallMrcaTaxId,
                    data = taxonomyData,
                )
            }
            if (diagram != null) {
                Spacer(modifier = Modifier.height(16.dp))
                DiagramTreeView(diagram = diagram)
            }
        }

        if (taxonomyData != null) {
            Spacer(modifier = Modifier.height(16.dp))
            LineageBreadcrumbsView(result = result, taxonomyData = taxonomyData)
        }

        Spacer(modifier = Modifier.height(32.dp))

        Button(onClick = onPlayAgain) {
            Text("Play Again")
        }

        Spacer(modifier = Modifier.height(16.dp))
    }
}

@Composable
fun PhyloTreeCanvas(result: ResultData) {
    val sister1 = result.sister1
    val sister2 = result.sister2
    val outgroup = result.outgroup
    val accentColor = MaterialTheme.colorScheme.primary
    val grayColor = MaterialTheme.colorScheme.onSurfaceVariant
    val hasOverallLabel = result.overallMrcaName != result.sisterMrcaName

    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surfaceVariant,
        ),
    ) {
        Column(modifier = Modifier.padding(12.dp)) {
            Text(
                text = "Phylogenetic Tree",
                style = MaterialTheme.typography.labelMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
            Spacer(modifier = Modifier.height(8.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                // Each leaf row is 48dp: name (~20sp) + scientific name (~14sp) + spacing
                val rowHeight = 48.dp
                val canvasHeight = rowHeight * 3
                androidx.compose.foundation.Canvas(
                    modifier = Modifier
                        .width(80.dp)
                        .height(canvasHeight),
                ) {
                    val h = size.height
                    val rowH = h / 3f
                    val y1 = rowH * 0.5f
                    val y2 = rowH * 1.5f
                    val y3 = rowH * 2.5f
                    val innerY = (y1 + y2) / 2f
                    val rootY = (innerY + y3) / 2f
                    val rootX = 10.dp.toPx()
                    val innerX = 42.dp.toPx()
                    val leafX = size.width - 2.dp.toPx()

                    drawLine(grayColor, androidx.compose.ui.geometry.Offset(0f, rootY), androidx.compose.ui.geometry.Offset(rootX, rootY), 2f)
                    drawLine(grayColor, androidx.compose.ui.geometry.Offset(rootX, innerY), androidx.compose.ui.geometry.Offset(rootX, y3), 2f)
                    drawLine(accentColor, androidx.compose.ui.geometry.Offset(rootX, innerY), androidx.compose.ui.geometry.Offset(innerX, innerY), 3f)
                    drawLine(accentColor, androidx.compose.ui.geometry.Offset(innerX, y1), androidx.compose.ui.geometry.Offset(innerX, y2), 3f)
                    drawLine(accentColor, androidx.compose.ui.geometry.Offset(innerX, y1), androidx.compose.ui.geometry.Offset(leafX, y1), 3f)
                    drawLine(accentColor, androidx.compose.ui.geometry.Offset(innerX, y2), androidx.compose.ui.geometry.Offset(leafX, y2), 3f)
                    drawLine(grayColor, androidx.compose.ui.geometry.Offset(rootX, y3), androidx.compose.ui.geometry.Offset(leafX, y3), 2f)
                    drawCircle(accentColor, 5f, androidx.compose.ui.geometry.Offset(leafX, y1))
                    drawCircle(accentColor, 5f, androidx.compose.ui.geometry.Offset(leafX, y2))
                    drawCircle(grayColor, 5f, androidx.compose.ui.geometry.Offset(leafX, y3))
                }

                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(canvasHeight),
                ) {
                    for (org in listOf(sister1, sister2, outgroup)) {
                        Box(
                            modifier = Modifier
                                .weight(1f)
                                .fillMaxWidth(),
                            contentAlignment = Alignment.CenterStart,
                        ) {
                            Column {
                                Text(
                                    text = org.commonName,
                                    style = MaterialTheme.typography.bodyMedium,
                                    fontWeight = FontWeight.Bold,
                                )
                                Text(
                                    text = org.scientificName,
                                    style = MaterialTheme.typography.bodySmall,
                                    fontStyle = FontStyle.Italic,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                                )
                            }
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(8.dp))
            Row(horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                Column {
                    Text(
                        text = "Sister pair ancestor:",
                        style = MaterialTheme.typography.bodySmall,
                        color = accentColor,
                    )
                    Text(
                        text = "${result.sisterMrcaName} (${result.sisterMrcaRank})",
                        style = MaterialTheme.typography.bodySmall,
                        fontWeight = FontWeight.Medium,
                        color = accentColor,
                    )
                }
                if (hasOverallLabel) {
                    Column {
                        Text(
                            text = "Overall ancestor:",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                        )
                        Text(
                            text = "${result.overallMrcaName} (${result.overallMrcaRank})",
                            style = MaterialTheme.typography.bodySmall,
                            fontWeight = FontWeight.Medium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun DiagramTreeView(diagram: DiagramNode) {
    val lines = renderDiagramLines(diagram)
    val accentColor = MaterialTheme.colorScheme.primary

    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surfaceVariant,
        ),
    ) {
        Column(modifier = Modifier.padding(12.dp)) {
            Text(
                text = "Taxonomy Context",
                style = MaterialTheme.typography.labelMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
            Spacer(modifier = Modifier.height(8.dp))
            for ((text, highlight) in lines) {
                Text(
                    text = text,
                    style = MaterialTheme.typography.bodySmall.copy(
                        fontFamily = FontFamily.Monospace,
                        fontSize = 12.sp,
                        color = if (highlight) accentColor else MaterialTheme.colorScheme.onSurface,
                    ),
                )
            }
        }
    }
}

@Composable
fun LineageBreadcrumbsView(result: ResultData, taxonomyData: TaxonomyData) {
    val sister1 = result.sister1
    val sister2 = result.sister2
    val outgroup = result.outgroup
    val organisms = listOf(sister1, sister2, outgroup)
    val accentColor = MaterialTheme.colorScheme.primary
    val tertiaryColor = MaterialTheme.colorScheme.tertiary
    val grayColor = MaterialTheme.colorScheme.onSurfaceVariant

    val (lineages, startIndex) = remember(result) {
        val lins = organisms.map { org ->
            getFullLineage(org.ncbiTaxId, taxonomyData).reversed()
        }
        lins to getDivergenceStart(lins)
    }

    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surfaceVariant,
        ),
    ) {
        Column(modifier = Modifier.padding(12.dp)) {
            Text(
                text = "Lineage",
                style = MaterialTheme.typography.labelMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
            Spacer(modifier = Modifier.height(8.dp))
            for (i in organisms.indices) {
                val org = organisms[i]
                val allSteps = lineages[i]
                val dotColor = when (i) {
                    0 -> accentColor
                    1 -> tertiaryColor
                    else -> grayColor
                }

                if (i > 0) Spacer(modifier = Modifier.height(10.dp))

                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(8.dp)
                            .background(dotColor, CircleShape),
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = org.commonName,
                        style = MaterialTheme.typography.bodyMedium,
                        fontWeight = FontWeight.Bold,
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = org.scientificName,
                        style = MaterialTheme.typography.bodySmall,
                        fontStyle = FontStyle.Italic,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }

                val pinned = allSteps.filter { it.rank in pinnedRanks }
                val tail = if (startIndex < allSteps.size) allSteps.drop(startIndex) else emptyList()
                val tailIds = tail.map { it.taxId }.toSet()
                val pinnedOnly = pinned.filter { it.taxId !in tailIds }
                val hasGap = pinnedOnly.isNotEmpty() && tail.isNotEmpty()

                val pathText = buildString {
                    for (j in pinnedOnly.indices) {
                        if (j > 0) append(" › ")
                        append(pinnedOnly[j].name)
                        val rank = pinnedOnly[j].rank
                        if (rank != "no rank") append(" ($rank)")
                    }
                    if (hasGap) {
                        if (isNotEmpty()) append(" › … › ")
                    }
                    for (j in tail.indices) {
                        if (j > 0) append(" › ")
                        append(tail[j].name)
                    }
                }

                if (pathText.isNotEmpty()) {
                    Text(
                        text = pathText,
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        modifier = Modifier.padding(start = 14.dp, top = 2.dp),
                    )
                }
            }
        }
    }
}

@Composable
fun SisterPairCard(sister1: Organism, sister2: Organism) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.primaryContainer,
        ),
    ) {
        Column(
            modifier = Modifier.padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceEvenly,
                verticalAlignment = Alignment.CenterVertically,
            ) {
                OrganismMini(sister1)
                Text(
                    text = "&",
                    style = MaterialTheme.typography.titleLarge,
                    color = MaterialTheme.colorScheme.primary,
                )
                OrganismMini(sister2)
            }
        }
    }
}

@Composable
fun OrganismMini(organism: Organism) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        if (organism.imageUrl != null) {
            SubcomposeAsyncImage(
                model = organism.imageUrl,
                contentDescription = organism.commonName,
                modifier = Modifier
                    .size(64.dp)
                    .clip(RoundedCornerShape(8.dp)),
                contentScale = ContentScale.Crop,
                error = {
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .background(MaterialTheme.colorScheme.surfaceVariant),
                    )
                },
            )
            Spacer(modifier = Modifier.height(4.dp))
        }
        Text(
            text = organism.commonName,
            style = MaterialTheme.typography.bodyMedium,
            fontWeight = FontWeight.Bold,
        )
        Text(
            text = organism.scientificName,
            style = MaterialTheme.typography.bodySmall,
            fontStyle = FontStyle.Italic,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
        )
    }
}

@Composable
fun SmallOrganismRow(organism: Organism) {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        modifier = Modifier.padding(vertical = 4.dp),
    ) {
        if (organism.imageUrl != null) {
            SubcomposeAsyncImage(
                model = organism.imageUrl,
                contentDescription = organism.commonName,
                modifier = Modifier
                    .size(40.dp)
                    .clip(RoundedCornerShape(4.dp)),
                contentScale = ContentScale.Crop,
                error = {
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .background(MaterialTheme.colorScheme.surfaceVariant),
                    )
                },
            )
            Spacer(modifier = Modifier.padding(start = 8.dp))
        }
        Column {
            Text(
                text = organism.commonName,
                style = MaterialTheme.typography.bodyMedium,
            )
            Text(
                text = organism.scientificName,
                style = MaterialTheme.typography.bodySmall,
                fontStyle = FontStyle.Italic,
            )
        }
    }
}
