package com.phyloguessr.ui.navigation

import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.phyloguessr.data.FirebaseRepository
import com.phyloguessr.game.Difficulty
import com.phyloguessr.ui.screens.GameScreen
import com.phyloguessr.ui.screens.HomeScreen
import com.phyloguessr.ui.screens.LeaderboardScreen
import com.phyloguessr.ui.screens.LoginScreen

@Composable
fun PhyloGuessrApp() {
    val authFlow = remember { FirebaseRepository.observeAuthState() }
    val authState by authFlow.collectAsState(FirebaseRepository.currentUser)
    val navController = rememberNavController()

    LaunchedEffect(authState) {
        if (authState != null) {
            FirebaseRepository.updatePresence()
        }
    }

    NavHost(navController = navController, startDestination = "home") {
        composable("home") {
            HomeScreen(
                onModeSelected = { mode, difficulty ->
                    navController.navigate("game/$mode/${difficulty.name.lowercase()}")
                },
                onLeaderboard = { navController.navigate("leaderboard") },
                onSignIn = { navController.navigate("login") },
                onSignOut = { FirebaseRepository.signOut() },
            )
        }
        composable("game/{mode}/{difficulty}") { backStackEntry ->
            val mode = backStackEntry.arguments?.getString("mode") ?: "random"
            val diffStr = backStackEntry.arguments?.getString("difficulty") ?: "normal"
            val difficulty = runCatching { Difficulty.valueOf(diffStr.uppercase()) }
                .getOrDefault(Difficulty.SHOW_LABELS)
            GameScreen(
                mode = mode,
                difficulty = difficulty,
                onBack = { navController.popBackStack() },
            )
        }
        composable("leaderboard") {
            LeaderboardScreen(
                onBack = { navController.popBackStack() },
            )
        }
        composable("login") {
            LoginScreen(
                onSignedIn = { navController.popBackStack() },
                onSkip = { navController.popBackStack() },
            )
        }
    }
}
