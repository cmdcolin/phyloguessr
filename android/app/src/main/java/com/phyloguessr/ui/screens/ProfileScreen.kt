package com.phyloguessr.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.phyloguessr.data.FirebaseRepository
import com.phyloguessr.ui.theme.RainbowColors
import com.phyloguessr.ui.theme.TitanOne
import com.phyloguessr.ui.theme.TreeLogo
import kotlinx.coroutines.launch

@Composable
fun ProfileScreen(onBack: () -> Unit) {
    val scope = rememberCoroutineScope()
    val currentName = FirebaseRepository.currentUser?.displayName ?: ""
    var name by remember { mutableStateOf(currentName) }
    var saving by remember { mutableStateOf(false) }
    var saved by remember { mutableStateOf(false) }

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

        Column(
            modifier = Modifier.fillMaxSize(),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center,
        ) {
            Text(
                text = "Set Your Name",
                style = MaterialTheme.typography.headlineSmall.copy(fontFamily = TitanOne),
            )

            Spacer(modifier = Modifier.height(24.dp))

            OutlinedTextField(
                value = name,
                onValueChange = {
                    name = it
                    saved = false
                },
                label = { Text("Display Name") },
                singleLine = true,
                modifier = Modifier.fillMaxWidth(0.8f),
            )

            Spacer(modifier = Modifier.height(16.dp))

            Button(
                onClick = {
                    if (name.isNotBlank()) {
                        saving = true
                        scope.launch {
                            FirebaseRepository.setDisplayName(name.trim())
                            saving = false
                            saved = true
                        }
                    }
                },
                enabled = name.isNotBlank() && !saving,
            ) {
                Text(if (saving) "Saving..." else "Save")
            }

            if (saved) {
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = "Name saved!",
                    color = MaterialTheme.colorScheme.primary,
                    style = MaterialTheme.typography.bodyMedium,
                )
            }
        }
    }
}
