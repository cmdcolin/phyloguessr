package com.phyloguessr.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
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
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import coil.compose.AsyncImage
import com.phyloguessr.data.Organism
import com.phyloguessr.game.GameState
import com.phyloguessr.game.GameViewModel

@Composable
fun GameScreen(
    mode: String,
    onBack: () -> Unit,
    viewModel: GameViewModel = viewModel(),
) {
    val uiState by viewModel.uiState.collectAsState()

    LaunchedEffect(mode) {
        if (uiState.state == GameState.LOADING && uiState.organisms.isEmpty()) {
            viewModel.startGame(mode)
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically,
        ) {
            TextButton(onClick = onBack) {
                Text("Back")
            }
            Text(
                text = "PhyloGuessr",
                style = MaterialTheme.typography.titleMedium,
            )
            Spacer(modifier = Modifier.width(48.dp))
        }

        Spacer(modifier = Modifier.height(8.dp))

        when (uiState.state) {
            GameState.LOADING -> {
                Column(
                    modifier = Modifier.fillMaxSize(),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center,
                ) {
                    CircularProgressIndicator()
                    Spacer(modifier = Modifier.height(16.dp))
                    Text(uiState.loadingMessage)
                }
            }

            GameState.SELECTING -> {
                SelectingScreen(
                    organisms = uiState.organisms,
                    selected = uiState.selected,
                    cladeName = uiState.cladeInfo?.let { "${it.name} (${it.rank})" },
                    onToggleSelect = { viewModel.toggleSelect(it) },
                    onSubmit = { viewModel.submit() },
                    onSkip = { viewModel.nextRound(mode) },
                )
            }

            GameState.EASY_COMPLETED -> {
                Column(
                    modifier = Modifier.fillMaxSize(),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center,
                ) {
                    Text(
                        text = "You've completed all ${uiState.easyTotal} curated scenarios!",
                        style = MaterialTheme.typography.titleMedium,
                        textAlign = TextAlign.Center,
                    )
                    Spacer(modifier = Modifier.height(24.dp))
                    Button(onClick = { viewModel.restartEasy() }) {
                        Text("Restart Easy Mode")
                    }
                    Spacer(modifier = Modifier.height(8.dp))
                    TextButton(onClick = onBack) {
                        Text("Back")
                    }
                }
            }

            GameState.RESULT -> {
                uiState.result?.let { result ->
                    ResultScreen(
                        result = result,
                        organisms = uiState.organisms,
                        onPlayAgain = { viewModel.nextRound(mode) },
                    )
                }
            }
        }
    }
}

@Composable
fun SelectingScreen(
    organisms: List<Organism>,
    selected: List<Int>,
    cladeName: String?,
    onToggleSelect: (Int) -> Unit,
    onSubmit: () -> Unit,
    onSkip: () -> Unit,
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState()),
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        if (cladeName != null) {
            Text(
                text = "Group: $cladeName",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
            Spacer(modifier = Modifier.height(4.dp))
        }

        Text(
            text = "Choose the two organisms you think are most closely related",
            style = MaterialTheme.typography.bodyLarge,
        )

        Spacer(modifier = Modifier.height(16.dp))

        for ((i, org) in organisms.withIndex()) {
            OrganismCard(
                organism = org,
                selected = i in selected,
                onClick = { onToggleSelect(i) },
            )
        }

        Spacer(modifier = Modifier.height(24.dp))

        Row(
            horizontalArrangement = Arrangement.spacedBy(16.dp),
        ) {
            TextButton(onClick = onSkip) {
                Text("Skip")
            }
            Button(
                onClick = onSubmit,
                enabled = selected.size == 2,
            ) {
                Text("Submit")
            }
        }
    }
}

@Composable
fun OrganismCard(
    organism: Organism,
    selected: Boolean,
    onClick: () -> Unit,
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp)
            .clickable(onClick = onClick),
        border = if (selected) {
            BorderStroke(3.dp, MaterialTheme.colorScheme.primary)
        } else {
            null
        },
        colors = CardDefaults.cardColors(
            containerColor = if (selected) {
                MaterialTheme.colorScheme.primaryContainer
            } else {
                MaterialTheme.colorScheme.surface
            },
        ),
    ) {
        Row(
            modifier = Modifier.padding(12.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            if (organism.imageUrl != null) {
                AsyncImage(
                    model = organism.imageUrl,
                    contentDescription = organism.commonName,
                    modifier = Modifier
                        .size(80.dp)
                        .clip(RoundedCornerShape(8.dp)),
                    contentScale = ContentScale.Crop,
                )
            }
            Column(modifier = Modifier.padding(start = 12.dp)) {
                Text(
                    text = organism.commonName,
                    style = MaterialTheme.typography.titleMedium,
                )
                Text(
                    text = organism.scientificName,
                    style = MaterialTheme.typography.bodySmall,
                    fontStyle = FontStyle.Italic,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
        }
    }
}
