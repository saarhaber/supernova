package com.saarhaber.supernova.data.remote

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import retrofit2.http.GET
import retrofit2.http.Query

/** iDreamBooks critic-reviews API — https://idreambooks.com/api */
interface IDreamBooksApi {

    @GET("api/books/reviews.json")
    suspend fun reviews(
        @Query("q") isbn: String,
        @Query("key") apiKey: String,
    ): IDreamBooksResponse
}

@Serializable
data class IDreamBooksResponse(
    val book: IDreamBook? = null,
)

@Serializable
data class IDreamBook(
    val title: String? = null,
    val author: String? = null,
    val rating: Double? = null,
    @SerialName("review_count") val reviewCount: Int? = null,
    @SerialName("critic_reviews") val criticReviews: List<IDreamReview> = emptyList(),
)

@Serializable
data class IDreamReview(
    val source: String? = null,
    val snippet: String? = null,
    @SerialName("star_rating") val starRating: Double? = null,
    @SerialName("review_link") val reviewLink: String? = null,
)
