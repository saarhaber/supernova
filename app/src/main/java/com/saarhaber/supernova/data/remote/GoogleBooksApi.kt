package com.saarhaber.supernova.data.remote

import kotlinx.serialization.Serializable
import retrofit2.http.GET
import retrofit2.http.Query

/** Google Books API — https://developers.google.com/books/docs/v1/using */
interface GoogleBooksApi {

    @GET("books/v1/volumes")
    suspend fun search(
        @Query("q") query: String,
        @Query("maxResults") maxResults: Int = 20,
    ): VolumesResponse
}

@Serializable
data class VolumesResponse(
    val totalItems: Int = 0,
    val items: List<Volume> = emptyList(),
)

@Serializable
data class Volume(
    val id: String = "",
    val volumeInfo: VolumeInfo = VolumeInfo(),
    val saleInfo: SaleInfo = SaleInfo(),
)

@Serializable
data class VolumeInfo(
    val title: String = "",
    val authors: List<String> = emptyList(),
    val description: String? = null,
    val averageRating: Double? = null,
    val imageLinks: ImageLinks? = null,
    val industryIdentifiers: List<IndustryIdentifier> = emptyList(),
)

@Serializable
data class ImageLinks(
    val smallThumbnail: String? = null,
    val thumbnail: String? = null,
)

@Serializable
data class IndustryIdentifier(
    val type: String = "",
    val identifier: String = "",
)

@Serializable
data class SaleInfo(
    val buyLink: String? = null,
)
