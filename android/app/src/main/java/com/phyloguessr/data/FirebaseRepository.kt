package com.phyloguessr.data

import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.FirebaseUser
import com.google.firebase.auth.GoogleAuthProvider
import com.google.firebase.firestore.FieldValue
import com.google.firebase.firestore.FirebaseFirestore
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.callbackFlow
import kotlinx.coroutines.tasks.await

data class OnlineUser(
    val uid: String = "",
    val displayName: String = "",
    val lastSeen: Long = 0,
)

object FirebaseRepository {
    private val auth = FirebaseAuth.getInstance()
    private val db = FirebaseFirestore.getInstance()

    val currentUser: FirebaseUser?
        get() = auth.currentUser

    suspend fun signInWithGoogle(idToken: String): FirebaseUser {
        val credential = GoogleAuthProvider.getCredential(idToken, null)
        val result = auth.signInWithCredential(credential).await()
        val user = result.user!!
        db.collection("users").document(user.uid).set(
            mapOf(
                "displayName" to (user.displayName ?: "Player"),
                "lastSeen" to FieldValue.serverTimestamp(),
            ),
            com.google.firebase.firestore.SetOptions.merge(),
        ).await()
        return user
    }

    fun signOut() {
        auth.signOut()
    }

    suspend fun updatePresence() {
        val user = auth.currentUser ?: return
        db.collection("users").document(user.uid).set(
            mapOf(
                "displayName" to (user.displayName ?: "Anonymous"),
                "lastSeen" to FieldValue.serverTimestamp(),
            ),
            com.google.firebase.firestore.SetOptions.merge(),
        ).await()
    }

    suspend fun goOffline() {
        val user = auth.currentUser ?: return
        db.collection("users").document(user.uid).set(
            mapOf("lastSeen" to FieldValue.serverTimestamp()),
            com.google.firebase.firestore.SetOptions.merge(),
        ).await()
    }

    fun observeOnlineUsers(): Flow<List<OnlineUser>> = callbackFlow {
        val fiveMinutesAgo = System.currentTimeMillis() - 5 * 60 * 1000
        val listener = db.collection("users")
            .whereGreaterThan("lastSeen", java.util.Date(fiveMinutesAgo))
            .addSnapshotListener { snapshot, error ->
                if (error != null || snapshot == null) {
                    trySend(emptyList())
                    return@addSnapshotListener
                }
                val users = snapshot.documents.mapNotNull { doc ->
                    val name = doc.getString("displayName") ?: return@mapNotNull null
                    val ts = doc.getTimestamp("lastSeen")?.toDate()?.time ?: 0
                    OnlineUser(
                        uid = doc.id,
                        displayName = name,
                        lastSeen = ts,
                    )
                }
                trySend(users)
            }
        awaitClose { listener.remove() }
    }

    fun observeAuthState(): Flow<FirebaseUser?> = callbackFlow {
        val listener = FirebaseAuth.AuthStateListener { firebaseAuth ->
            trySend(firebaseAuth.currentUser)
        }
        auth.addAuthStateListener(listener)
        awaitClose { auth.removeAuthStateListener(listener) }
    }
}
