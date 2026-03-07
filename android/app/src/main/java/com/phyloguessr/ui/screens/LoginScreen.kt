package com.phyloguessr.ui.screens

import android.app.Activity
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.auth.api.signin.GoogleSignInOptions
import com.google.android.gms.common.api.ApiException
import com.phyloguessr.R
import com.phyloguessr.data.FirebaseRepository
import com.phyloguessr.ui.theme.RainbowSubtitle
import com.phyloguessr.ui.theme.RainbowTitle
import com.phyloguessr.ui.theme.TreeLogo
import kotlinx.coroutines.launch

@Composable
fun LoginScreen(onSignedIn: () -> Unit) {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    var error by remember { mutableStateOf<String?>(null) }
    var loading by remember { mutableStateOf(false) }

    val googleSignInClient = remember {
        val gso = GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
            .requestIdToken(context.getString(R.string.default_web_client_id))
            .requestEmail()
            .build()
        GoogleSignIn.getClient(context, gso)
    }

    val launcher = rememberLauncherForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) { result ->
        if (result.resultCode == Activity.RESULT_OK) {
            val task = GoogleSignIn.getSignedInAccountFromIntent(result.data)
            try {
                val account = task.getResult(ApiException::class.java)
                val idToken = account.idToken
                if (idToken != null) {
                    loading = true
                    scope.launch {
                        try {
                            FirebaseRepository.signInWithGoogle(idToken)
                            onSignedIn()
                        } catch (e: Exception) {
                            error = "Sign-in failed: ${e.message}"
                            loading = false
                        }
                    }
                } else {
                    error = "No ID token received"
                }
            } catch (e: ApiException) {
                error = "Google sign-in error: ${e.statusCode}"
            }
        }
    }

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
        Spacer(modifier = Modifier.height(64.dp))

        Button(
            onClick = {
                if (!loading) {
                    launcher.launch(googleSignInClient.signInIntent)
                }
            },
            modifier = Modifier
                .fillMaxWidth()
                .height(52.dp),
            shape = RoundedCornerShape(8.dp),
            enabled = !loading,
        ) {
            Text(
                text = if (loading) "Signing in..." else "Sign in with Google",
                fontSize = 18.sp,
            )
        }

        if (error != null) {
            Spacer(modifier = Modifier.height(16.dp))
            Text(
                text = error!!,
                color = MaterialTheme.colorScheme.error,
                style = MaterialTheme.typography.bodySmall,
            )
        }
    }
}
