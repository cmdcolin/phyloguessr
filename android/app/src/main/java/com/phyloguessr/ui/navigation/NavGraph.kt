package com.phyloguessr.ui.navigation

import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.phyloguessr.data.FirebaseRepository
import com.phyloguessr.ui.screens.GameScreen
import com.phyloguessr.ui.screens.HomeScreen
import com.phyloguessr.ui.screens.LeaderboardScreen
import com.phyloguessr.ui.screens.LoginScreen
import com.phyloguessr.ui.screens.ProfileScreen

@Composable
fun PhyloGuessrApp() {
    val authState by FirebaseRepository.observeAuthState().collectAsState(FirebaseRepository.currentUser)

    if (authState == null) {
        LoginScreen(onSignedIn = {})
    } else {
        val navController = rememberNavController()

        LaunchedEffect(Unit) {
            FirebaseRepository.updatePresence()
        }

        NavHost(navController = navController, startDestination = "home") {
            composable("home") {
                HomeScreen(
                    onModeSelected = { mode -> navController.navigate("game/$mode") },
                    onLeaderboard = { navController.navigate("leaderboard") },
                    onProfile = { navController.navigate("profile") },
                    onSignOut = { FirebaseRepository.signOut() },
                )
            }
            composable("game/{mode}") { backStackEntry ->
                val mode = backStackEntry.arguments?.getString("mode") ?: "random"
                GameScreen(
                    mode = mode,
                    onBack = { navController.popBackStack() },
                )
            }
            composable("leaderboard") {
                LeaderboardScreen(
                    onBack = { navController.popBackStack() },
                )
            }
            composable("profile") {
                ProfileScreen(
                    onBack = { navController.popBackStack() },
                )
            }
        }
    }
}
