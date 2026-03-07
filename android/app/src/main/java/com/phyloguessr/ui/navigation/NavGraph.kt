package com.phyloguessr.ui.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.phyloguessr.ui.screens.HomeScreen
import com.phyloguessr.ui.screens.GameScreen

@Composable
fun PhyloGuessrApp() {
    val navController = rememberNavController()

    NavHost(navController = navController, startDestination = "home") {
        composable("home") {
            HomeScreen(
                onModeSelected = { mode -> navController.navigate("game/$mode") }
            )
        }
        composable("game/{mode}") { backStackEntry ->
            val mode = backStackEntry.arguments?.getString("mode") ?: "random"
            GameScreen(
                mode = mode,
                onBack = { navController.popBackStack() }
            )
        }
    }
}
