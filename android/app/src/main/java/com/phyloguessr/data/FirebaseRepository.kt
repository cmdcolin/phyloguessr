package com.phyloguessr.data

import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.FirebaseUser
import com.google.firebase.auth.GoogleAuthProvider
import com.google.firebase.firestore.FieldValue
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.Query
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.callbackFlow
import kotlinx.coroutines.tasks.await

data class LeaderboardEntry(
    val uid: String = "",
    val displayName: String = "",
    val mode: String = "",
    val score: Int = 0,
    val correct: Int = 0,
    val total: Int = 0,
    val timestamp: Long = 0,
)

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

    suspend fun submitScore(mode: String, correct: Boolean, score: Int) {
        val user = auth.currentUser ?: return
        val statsRef = db.collection("leaderboard").document("${user.uid}_$mode")
        db.runTransaction { transaction ->
            val snap = transaction.get(statsRef)
            if (snap.exists()) {
                val prevCorrect = snap.getLong("correct") ?: 0
                val prevTotal = snap.getLong("total") ?: 0
                val prevBestScore = snap.getLong("bestScore") ?: 0
                transaction.update(statsRef, mapOf(
                    "correct" to prevCorrect + if (correct) 1 else 0,
                    "total" to prevTotal + 1,
                    "bestScore" to maxOf(prevBestScore, score.toLong()),
                    "displayName" to (user.displayName ?: "Anonymous"),
                    "timestamp" to FieldValue.serverTimestamp(),
                ))
            } else {
                transaction.set(statsRef, hashMapOf(
                    "uid" to user.uid,
                    "displayName" to (user.displayName ?: "Anonymous"),
                    "mode" to mode,
                    "correct" to if (correct) 1 else 0,
                    "total" to 1,
                    "bestScore" to score.toLong(),
                    "timestamp" to FieldValue.serverTimestamp(),
                ))
            }
        }.await()
    }

    fun observeLeaderboard(mode: String): Flow<List<LeaderboardEntry>> = callbackFlow {
        val listener = db.collection("leaderboard")
            .whereEqualTo("mode", mode)
            .orderBy("correct", Query.Direction.DESCENDING)
            .limit(50)
            .addSnapshotListener { snapshot, error ->
                if (error != null || snapshot == null) {
                    trySend(emptyList())
                    return@addSnapshotListener
                }
                val entries = snapshot.documents.mapNotNull { doc ->
                    val uid = doc.getString("uid") ?: return@mapNotNull null
                    val name = doc.getString("displayName") ?: "Anonymous"
                    val c = doc.getLong("correct")?.toInt() ?: 0
                    val t = doc.getLong("total")?.toInt() ?: 0
                    val best = doc.getLong("bestScore")?.toInt() ?: 0
                    LeaderboardEntry(
                        uid = uid,
                        displayName = name,
                        mode = mode,
                        score = best,
                        correct = c,
                        total = t,
                    )
                }
                trySend(entries)
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
