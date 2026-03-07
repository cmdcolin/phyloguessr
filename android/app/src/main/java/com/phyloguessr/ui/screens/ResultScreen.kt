package com.phyloguessr.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
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
import androidx.compose.ui.draw.clip
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import coil.compose.AsyncImage
import com.phyloguessr.data.Organism
import com.phyloguessr.game.ResultData

@Composable
fun ResultScreen(
    result: ResultData,
    organisms: List<Organism>,
    onPlayAgain: () -> Unit,
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState()),
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        Text(
            text = if (result.isPolytomy) {
                "Polytomy!"
            } else if (result.correct) {
                "Correct!"
            } else {
                "Not quite!"
            },
            style = MaterialTheme.typography.headlineMedium,
            fontWeight = FontWeight.Bold,
            color = if (result.correct || result.isPolytomy) {
                MaterialTheme.colorScheme.primary
            } else {
                MaterialTheme.colorScheme.error
            },
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

        Spacer(modifier = Modifier.height(32.dp))

        Button(onClick = onPlayAgain) {
            Text("Play Again")
        }

        Spacer(modifier = Modifier.height(16.dp))
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
            AsyncImage(
                model = organism.imageUrl,
                contentDescription = organism.commonName,
                modifier = Modifier
                    .size(64.dp)
                    .clip(RoundedCornerShape(8.dp)),
                contentScale = ContentScale.Crop,
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
            AsyncImage(
                model = organism.imageUrl,
                contentDescription = organism.commonName,
                modifier = Modifier
                    .size(40.dp)
                    .clip(RoundedCornerShape(4.dp)),
                contentScale = ContentScale.Crop,
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
