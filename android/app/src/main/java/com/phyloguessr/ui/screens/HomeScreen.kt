package com.phyloguessr.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
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
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.phyloguessr.data.FirebaseRepository
import com.phyloguessr.ui.theme.RainbowSubtitle
import com.phyloguessr.ui.theme.RainbowTitle
import com.phyloguessr.ui.theme.TreeLogo

@Composable
fun HomeScreen(
    onModeSelected: (String) -> Unit,
    onLeaderboard: () -> Unit,
    onProfile: () -> Unit,
    onSignOut: () -> Unit,
) {
    val authState by FirebaseRepository.observeAuthState().collectAsState(FirebaseRepository.currentUser)
    val displayName = authState?.displayName

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
                onClick = { onModeSelected(key) },
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

        Spacer(modifier = Modifier.height(16.dp))

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp),
        ) {
            OutlinedButton(
                onClick = onLeaderboard,
                modifier = Modifier
                    .weight(1f)
                    .height(44.dp),
                shape = RoundedCornerShape(8.dp),
            ) {
                Text("Leaderboard", fontSize = 13.sp)
            }
            OutlinedButton(
                onClick = onProfile,
                modifier = Modifier
                    .weight(1f)
                    .height(44.dp),
                shape = RoundedCornerShape(8.dp),
            ) {
                Text("Profile", fontSize = 13.sp)
            }
            OutlinedButton(
                onClick = onSignOut,
                modifier = Modifier
                    .weight(1f)
                    .height(44.dp),
                shape = RoundedCornerShape(8.dp),
            ) {
                Text("Sign Out", fontSize = 13.sp)
            }
        }
    }
}
