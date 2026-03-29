package com.phyloguessr.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.material3.FilterChip
import com.phyloguessr.data.FirebaseRepository
import com.phyloguessr.game.Difficulty
import com.phyloguessr.ui.theme.RainbowSubtitle
import com.phyloguessr.ui.theme.RainbowTitle
import com.phyloguessr.ui.theme.TreeLogo

@Composable
fun HomeScreen(
    onModeSelected: (String, Difficulty) -> Unit,
    onSignIn: () -> Unit,
    onSignOut: () -> Unit,
) {
    val authFlow = remember { FirebaseRepository.observeAuthState() }
    val authState by authFlow.collectAsState(FirebaseRepository.currentUser)
    val displayName = authState?.displayName
    var difficulty by remember { mutableStateOf(Difficulty.SHOW_LABELS) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(32.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center,
    ) {
        TreeLogo(size = 96.dp)
        Spacer(modifier = Modifier.height(16.dp))
        RainbowTitle(text = "PhyloGuessr")
        Spacer(modifier = Modifier.height(12.dp))
        RainbowSubtitle(text = "The evolutionary guessing game")

        Spacer(modifier = Modifier.height(12.dp))

        if (displayName != null) {
            Text(
                text = "Playing as $displayName",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
        }

        Spacer(modifier = Modifier.height(48.dp))

        val modes = listOf(
            Triple("easy", "Easy \uD83C\uDF7F", Color(0xFF2A7A2A)),
            Triple("random", "Random \uD83C\uDFB0", Color(0xFFC89000)),
            Triple("custom", "Custom \uD83D\uDCE0", Color(0xFFAA3333)),
            Triple("multi", "Multi \uD83C\uDFAF", Color(0xFF5A3D8F)),
        )
        for ((key, label, color) in modes) {
            Button(
                onClick = { onModeSelected(key, difficulty) },
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 8.dp)
                    .height(52.dp),
                shape = RoundedCornerShape(8.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = color,
                    contentColor = Color.White,
                ),
            ) {
                Text(label, fontSize = 18.sp)
            }
        }

        Spacer(modifier = Modifier.height(12.dp))

        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            for (d in Difficulty.entries) {
                FilterChip(
                    selected = difficulty == d,
                    onClick = { difficulty = d },
                    label = {
                        Text(
                            when (d) {
                                Difficulty.SHOW_LABELS -> "Show species labels"
                                Difficulty.HIDE_LABELS -> "Don't show species labels"
                            },
                            fontSize = 13.sp,
                        )
                    },
                )
            }
        }

        Spacer(modifier = Modifier.height(12.dp))

        if (authState == null) {
            OutlinedButton(
                onClick = onSignIn,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(44.dp),
                shape = RoundedCornerShape(8.dp),
            ) {
                Text("Sign In", fontSize = 13.sp)
            }
        } else {
            OutlinedButton(
                onClick = onSignOut,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(44.dp),
                shape = RoundedCornerShape(8.dp),
            ) {
                Text("Sign Out", fontSize = 13.sp)
            }
        }
    }
}
