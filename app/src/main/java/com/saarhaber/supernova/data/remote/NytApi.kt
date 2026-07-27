package com.saarhaber.supernova.data.remote

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import retrofit2.http.GET
import retrofit2.http.Path
import retrofit2.http.Query

/** New York Times Books API — https://developer.nytimes.com/docs/books-product/1/overview */
interface NytApi {

    @GET("svc/books/v3/lists/current/{list}.json")
    suspend fun bestSellers(
        @Path("list") list: String,
        @Query("api-key") apiKey: String,
    ): NytBestSellersResponse
}

@Serializable
data class NytBestSellersResponse(
    val results: NytResults? = null,
)

@Serializable
data class NytResults(
    @SerialName("list_name") val listName: String? = null,
    val books: List<NytBook> = emptyList(),
)

@Serializable
data class NytBook(
    val rank: Int = 0,
    val title: String = "",
    val author: String = "",
    val description: String? = null,
    @SerialName("book_image") val bookImage: String? = null,
    @SerialName("amazon_product_url") val amazonProductUrl: String? = null,
    @SerialName("primary_isbn13") val primaryIsbn13: String? = null,
)
