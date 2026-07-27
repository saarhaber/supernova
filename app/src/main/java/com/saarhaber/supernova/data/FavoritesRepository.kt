package com.saarhaber.supernova.data

import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FieldValue
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.Query
import com.saarhaber.supernova.data.model.Book
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.callbackFlow
import kotlinx.coroutines.flow.flowOf
import kotlinx.coroutines.tasks.await

/**
 * Per-user favorites stored in Cloud Firestore under `users/{uid}/favorites/{bookId}`.
 * Replaces the old AWS Amplify/AppSync backend.
 */
class FavoritesRepository(
    private val firebaseAuth: FirebaseAuth,
    private val firestore: FirebaseFirestore,
) {

    private fun collection(uid: String) =
        firestore.collection("users").document(uid).collection("favorites")

    /** Realtime stream of the signed-in user's favorites, newest first. */
    fun favorites(): Flow<List<Book>> {
        val uid = firebaseAuth.currentUser?.uid ?: return flowOf(emptyList())
        return callbackFlow {
            val registration = collection(uid)
                .orderBy("addedAt", Query.Direction.DESCENDING)
                .addSnapshotListener { snapshot, error ->
                    if (error != null) {
                        close(error)
                        return@addSnapshotListener
                    }
                    val books = snapshot?.documents.orEmpty().map { doc ->
                        Book(
                            id = doc.id,
                            title = doc.getString("title") ?: "",
                            author = doc.getString("author") ?: "",
                            description = doc.getString("description"),
                            imageUrl = doc.getString("imageUrl"),
                            buyLink = doc.getString("buyLink"),
                            isbn13 = doc.getString("isbn13"),
                        )
                    }
                    trySend(books)
                }
            awaitClose { registration.remove() }
        }
    }

    suspend fun add(book: Book) {
        val uid = requireNotNull(firebaseAuth.currentUser?.uid) { "Not signed in" }
        val data = mapOf(
            "title" to book.title,
            "author" to book.author,
            "description" to book.description,
            "imageUrl" to book.imageUrl,
            "buyLink" to book.buyLink,
            "isbn13" to book.isbn13,
            "addedAt" to FieldValue.serverTimestamp(),
        )
        collection(uid).document(book.id).set(data).await()
    }

    suspend fun remove(bookId: String) {
        val uid = requireNotNull(firebaseAuth.currentUser?.uid) { "Not signed in" }
        collection(uid).document(bookId).delete().await()
    }
}
