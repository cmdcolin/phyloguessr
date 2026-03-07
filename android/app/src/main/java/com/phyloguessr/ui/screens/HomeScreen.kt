package com.phyloguessr.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun HomeScreen(onModeSelected: (String) -> Unit) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(32.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center,
    ) {
        Text(
            text = "PhyloGuessr",
            style = MaterialTheme.typography.headlineLarge,
        )
        Text(
            text = "The evolutionary guessing game",
            style = MaterialTheme.typography.bodyLarge,
        )
        Spacer(modifier = Modifier.height(48.dp))

        val modes = listOf(
            "easy" to "Easy",
            "random" to "Random",
        )
        for ((key, label) in modes) {
            Button(
                onClick = { onModeSelected(key) },
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 8.dp),
            ) {
                Text(label)
            }
        }
    }
}
