package com.saarhaber.supernova.data

import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.FirebaseUser
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.callbackFlow
import kotlinx.coroutines.tasks.await

/** Email/password authentication backed by Firebase Auth. */
class AuthRepository(private val firebaseAuth: FirebaseAuth) {

    /** Emits the current user immediately and again on every sign-in/sign-out. */
    val authState: Flow<FirebaseUser?> = callbackFlow {
        val listener = FirebaseAuth.AuthStateListener { auth ->
            trySend(auth.currentUser)
        }
        firebaseAuth.addAuthStateListener(listener)
        awaitClose { firebaseAuth.removeAuthStateListener(listener) }
    }

    val currentUser: FirebaseUser?
        get() = firebaseAuth.currentUser

    suspend fun signIn(email: String, password: String) {
        firebaseAuth.signInWithEmailAndPassword(email, password).await()
    }

    suspend fun signUp(email: String, password: String) {
        firebaseAuth.createUserWithEmailAndPassword(email, password).await()
    }

    suspend fun sendPasswordReset(email: String) {
        firebaseAuth.sendPasswordResetEmail(email).await()
    }

    fun signOut() {
        firebaseAuth.signOut()
    }
}
