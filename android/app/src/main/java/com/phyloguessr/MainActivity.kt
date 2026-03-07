package com.phyloguessr

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import androidx.lifecycle.lifecycleScope
import com.phyloguessr.data.FirebaseRepository
import com.phyloguessr.ui.navigation.PhyloGuessrApp
import com.phyloguessr.ui.theme.PhyloGuessrTheme
import kotlinx.coroutines.launch

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            PhyloGuessrTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background,
                ) {
                    PhyloGuessrApp()
                }
            }
        }
    }

    override fun onResume() {
        super.onResume()
        lifecycleScope.launch {
            try {
                FirebaseRepository.updatePresence()
            } catch (_: Exception) {}
        }
    }

    override fun onPause() {
        super.onPause()
        lifecycleScope.launch {
            try {
                FirebaseRepository.goOffline()
            } catch (_: Exception) {}
        }
    }
}
