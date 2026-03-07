package com.phyloguessr.ui.screens

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

data class CladePreset(
    val taxId: Int,
    val label: String,
    val scientificName: String,
)

val CLADE_PRESETS = listOf(
    CladePreset(40674, "mammals", "Mammalia"),
    CladePreset(8782, "birds", "Aves"),
    CladePreset(8504, "lizards & snakes", "Lepidosauria"),
    CladePreset(8292, "frogs & salamanders", "Amphibia"),
    CladePreset(50557, "insects", "Insecta"),
    CladePreset(6854, "spiders & scorpions", "Arachnida"),
    CladePreset(7898, "ray-finned fish", "Actinopterygii"),
    CladePreset(7777, "sharks & rays", "Chondrichthyes"),
    CladePreset(32523, "bony vertebrates", "Tetrapoda"),
    CladePreset(6656, "crustaceans", "Arthropoda"),
    CladePreset(6447, "snails & octopuses", "Mollusca"),
    CladePreset(3398, "flowering plants", "Magnoliopsida"),
    CladePreset(58019, "conifers", "Pinopsida"),
    CladePreset(4751, "mushrooms & yeasts", "Fungi"),
    CladePreset(7742, "vertebrates", "Vertebrata"),
    CladePreset(33208, "animals", "Metazoa"),
    CladePreset(9443, "primates", "Primates"),
    CladePreset(33554, "songbirds", "Passeriformes"),
    CladePreset(7088, "butterflies & moths", "Lepidoptera"),
    CladePreset(4890, "yeasts & sac fungi", "Ascomycota"),
)

@Composable
fun CustomScreen(
    selectedTaxId: Int?,
    error: String?,
    onSelectClade: (Int) -> Unit,
    onStart: () -> Unit,
    onBack: () -> Unit,
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
            .verticalScroll(rememberScrollState()),
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        Text(
            text = "Choose a group",
            style = MaterialTheme.typography.titleLarge,
        )
        Spacer(modifier = Modifier.height(16.dp))

        for (preset in CLADE_PRESETS) {
            val isSelected = selectedTaxId == preset.taxId
            Text(
                text = "${preset.label}  ",
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable { onSelectClade(preset.taxId) }
                    .padding(vertical = 6.dp, horizontal = 8.dp),
                color = if (isSelected) {
                    MaterialTheme.colorScheme.primary
                } else {
                    MaterialTheme.colorScheme.onSurface
                },
                fontStyle = FontStyle.Normal,
                fontSize = 16.sp,
            )
        }

        if (error != null) {
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = error,
                color = MaterialTheme.colorScheme.error,
                style = MaterialTheme.typography.bodySmall,
            )
        }

        Spacer(modifier = Modifier.height(24.dp))

        Button(
            onClick = onStart,
            enabled = selectedTaxId != null,
            modifier = Modifier.fillMaxWidth().height(48.dp),
            shape = RoundedCornerShape(8.dp),
            colors = ButtonDefaults.buttonColors(
                containerColor = Color(0xFFAA3333),
                contentColor = Color.White,
            ),
        ) {
            Text("Start", fontSize = 16.sp)
        }

        Spacer(modifier = Modifier.height(8.dp))

        Button(
            onClick = onBack,
            modifier = Modifier.fillMaxWidth(),
            colors = ButtonDefaults.textButtonColors(),
        ) {
            Text("Back")
        }
    }
}
