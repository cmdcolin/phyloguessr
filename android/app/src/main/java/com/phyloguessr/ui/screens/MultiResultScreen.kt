package com.phyloguessr.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.phyloguessr.data.Organism
import com.phyloguessr.game.MultiResultData
import com.phyloguessr.game.PairRanking
import com.phyloguessr.ui.theme.AnimatedResultText

@Composable
fun MultiResultScreen(
    result: MultiResultData,
    onPlayAgain: () -> Unit,
) {
    val userPair = result.userPair
    val bestPair = result.bestPair
    val organisms = result.organisms

    fun orgByTaxId(taxId: Int) = organisms.find { it.ncbiTaxId == taxId }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState()),
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        if (result.rank == 1) {
            AnimatedResultText(text = "Perfect!", correct = true)
        } else {
            AnimatedResultText(
                text = "${result.score} points",
                correct = result.score >= 50,
            )
        }

        Spacer(modifier = Modifier.height(16.dp))

        val userOrgA = orgByTaxId(userPair.taxIdA)
        val userOrgB = orgByTaxId(userPair.taxIdB)

        if (result.rank == 1) {
            Text(
                text = "You picked ${userOrgA?.commonName} & ${userOrgB?.commonName} — the closest pair!",
                textAlign = TextAlign.Center,
                style = MaterialTheme.typography.bodyMedium,
            )
            Text(
                text = "Common ancestor: ${bestPair.lca.name} (${bestPair.lca.rank})",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
        } else {
            val bestOrgA = orgByTaxId(bestPair.taxIdA)
            val bestOrgB = orgByTaxId(bestPair.taxIdB)
            Text(
                text = "You picked ${userOrgA?.commonName} & ${userOrgB?.commonName} (ranked #${result.rank} of ${result.totalPairs} pairs).",
                textAlign = TextAlign.Center,
                style = MaterialTheme.typography.bodyMedium,
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = "Their ancestor: ${userPair.lca.name} (${userPair.lca.rank})",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = "The closest pair was ${bestOrgA?.commonName} & ${bestOrgB?.commonName}",
                textAlign = TextAlign.Center,
                style = MaterialTheme.typography.bodyMedium,
                fontWeight = FontWeight.SemiBold,
            )
            Text(
                text = "Common ancestor: ${bestPair.lca.name} (${bestPair.lca.rank})",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
        }

        Spacer(modifier = Modifier.height(24.dp))

        Button(onClick = onPlayAgain) {
            Text("Next")
        }

        Spacer(modifier = Modifier.height(24.dp))

        Text(
            text = "All ${result.totalPairs} pair rankings",
            style = MaterialTheme.typography.titleSmall,
        )
        Spacer(modifier = Modifier.height(8.dp))

        PairRankingTable(
            allPairs = result.allPairs,
            organisms = organisms,
            userPair = userPair,
        )

        Spacer(modifier = Modifier.height(16.dp))
    }
}

@Composable
fun PairRankingTable(
    allPairs: List<PairRanking>,
    organisms: List<Organism>,
    userPair: PairRanking,
) {
    fun orgName(taxId: Int) = organisms.find { it.ncbiTaxId == taxId }?.commonName ?: "?"

    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(8.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surfaceVariant,
        ),
    ) {
        Column(modifier = Modifier.padding(12.dp)) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 4.dp),
            ) {
                Text(
                    text = "#",
                    modifier = Modifier.weight(0.12f),
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
                Text(
                    text = "Pair",
                    modifier = Modifier.weight(0.48f),
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
                Text(
                    text = "Ancestor",
                    modifier = Modifier.weight(0.4f),
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }

            for ((idx, pair) in allPairs.withIndex()) {
                val isUser = pair.taxIdA == userPair.taxIdA && pair.taxIdB == userPair.taxIdB
                    || pair.taxIdA == userPair.taxIdB && pair.taxIdB == userPair.taxIdA
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .then(
                            if (isUser) {
                                Modifier.background(
                                    MaterialTheme.colorScheme.primaryContainer,
                                    RoundedCornerShape(4.dp),
                                )
                            } else {
                                Modifier
                            }
                        )
                        .padding(vertical = 3.dp),
                ) {
                    Text(
                        text = "${idx + 1}",
                        modifier = Modifier.weight(0.12f),
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                    Text(
                        text = "${orgName(pair.taxIdA)} & ${orgName(pair.taxIdB)}",
                        modifier = Modifier.weight(0.48f),
                        style = MaterialTheme.typography.bodySmall,
                        fontWeight = if (isUser) FontWeight.Bold else FontWeight.Normal,
                    )
                    Text(
                        text = "${pair.lca.name} (${pair.lca.rank})",
                        modifier = Modifier.weight(0.4f),
                        style = MaterialTheme.typography.bodySmall,
                        fontStyle = FontStyle.Italic,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
            }
        }
    }
}
