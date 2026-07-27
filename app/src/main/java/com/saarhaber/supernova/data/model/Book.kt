package com.saarhaber.supernova.data.model

/**
 * Unified book model used by every screen, regardless of which API the book came from.
 */
data class Book(
    /** Stable identifier: ISBN-13 when known, otherwise a source-specific id. */
    val id: String,
    val title: String,
    val author: String,
    val description: String? = null,
    val imageUrl: String? = null,
    val buyLink: String? = null,
    val isbn13: String? = null,
    /** Position on the NYT best-sellers list; null for search results. */
    val rank: Int? = null,
    /** Average rating out of 5, when the source provides one. */
    val rating: Double? = null,
)

/** A single critic review from iDreamBooks. */
data class CriticReview(
    val source: String,
    val snippet: String?,
    val starRating: Double?,
    val reviewLink: String?,
)
