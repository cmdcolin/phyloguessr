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
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.FilterChip
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.phyloguessr.data.FirebaseRepository
import com.phyloguessr.data.LeaderboardEntry
import com.phyloguessr.data.OnlineUser
import com.phyloguessr.ui.theme.RainbowColors
import com.phyloguessr.ui.theme.TitanOne
import com.phyloguessr.ui.theme.TreeLogo

@Composable
fun LeaderboardScreen(onBack: () -> Unit) {
    var selectedMode by remember { mutableStateOf("easy") }
    val leaderboard by FirebaseRepository.observeLeaderboard(selectedMode).collectAsState(emptyList())
    val onlineUsers by FirebaseRepository.observeOnlineUsers().collectAsState(emptyList())
    val currentUid = FirebaseRepository.currentUser?.uid

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically,
        ) {
            TextButton(onClick = onBack) {
                Text("Back")
            }
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(6.dp),
            ) {
                TreeLogo(size = 24.dp)
                Text(
                    text = "PhyloGuessr",
                    style = MaterialTheme.typography.titleMedium.copy(
                        fontFamily = TitanOne,
                        brush = androidx.compose.ui.graphics.Brush.linearGradient(RainbowColors),
                    ),
                )
            }
            Spacer(modifier = Modifier.width(48.dp))
        }

        Spacer(modifier = Modifier.height(16.dp))

        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState()),
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            OnlineUsersSection(onlineUsers)

            Spacer(modifier = Modifier.height(24.dp))

            Text(
                text = "Leaderboard",
                style = MaterialTheme.typography.headlineSmall.copy(fontFamily = TitanOne),
            )

            Spacer(modifier = Modifier.height(12.dp))

            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                for (mode in listOf("easy", "random", "custom", "multi")) {
                    FilterChip(
                        selected = selectedMode == mode,
                        onClick = { selectedMode = mode },
                        label = { Text(mode.replaceFirstChar { it.uppercase() }) },
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            if (leaderboard.isEmpty()) {
                Text(
                    text = "No scores yet for this mode",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            } else {
                LeaderboardTable(
                    entries = leaderboard,
                    currentUid = currentUid,
                    mode = selectedMode,
                )
            }

            Spacer(modifier = Modifier.height(16.dp))
        }
    }
}

@Composable
fun OnlineUsersSection(users: List<OnlineUser>) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.secondaryContainer,
        ),
    ) {
        Column(modifier = Modifier.padding(12.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Spacer(
                    modifier = Modifier
                        .size(8.dp)
                        .clip(CircleShape)
                        .background(Color(0xFF4CAF50)),
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "${users.size} online now",
                    style = MaterialTheme.typography.titleSmall,
                    fontWeight = FontWeight.Bold,
                )
            }
            if (users.isNotEmpty()) {
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = users.joinToString(", ") { it.displayName },
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSecondaryContainer,
                )
            }
        }
    }
}

@Composable
fun LeaderboardTable(
    entries: List<LeaderboardEntry>,
    currentUid: String?,
    mode: String,
) {
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
                    modifier = Modifier.weight(0.1f),
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
                Text(
                    text = "Player",
                    modifier = Modifier.weight(0.35f),
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
                Text(
                    text = "Correct",
                    modifier = Modifier.weight(0.25f),
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
                Text(
                    text = if (mode == "multi") "Best" else "Rate",
                    modifier = Modifier.weight(0.3f),
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }

            for ((idx, entry) in entries.withIndex()) {
                val isCurrentUser = entry.uid == currentUid
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .then(
                            if (isCurrentUser) {
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
                        modifier = Modifier.weight(0.1f),
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                    Text(
                        text = entry.displayName,
                        modifier = Modifier.weight(0.35f),
                        style = MaterialTheme.typography.bodySmall,
                        fontWeight = if (isCurrentUser) FontWeight.Bold else FontWeight.Normal,
                    )
                    Text(
                        text = "${entry.correct}/${entry.total}",
                        modifier = Modifier.weight(0.25f),
                        style = MaterialTheme.typography.bodySmall,
                    )
                    Text(
                        text = if (mode == "multi") {
                            "${entry.score}"
                        } else {
                            if (entry.total > 0) {
                                "${(entry.correct * 100 / entry.total)}%"
                            } else {
                                "0%"
                            }
                        },
                        modifier = Modifier.weight(0.3f),
                        style = MaterialTheme.typography.bodySmall,
                    )
                }
            }
        }
    }
}
