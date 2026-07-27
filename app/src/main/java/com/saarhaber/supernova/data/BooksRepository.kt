package com.saarhaber.supernova.data

import com.saarhaber.supernova.BuildConfig
import com.saarhaber.supernova.data.model.Book
import com.saarhaber.supernova.data.model.CriticReview
import com.saarhaber.supernova.data.remote.GoogleBooksApi
import com.saarhaber.supernova.data.remote.IDreamBooksApi
import com.saarhaber.supernova.data.remote.NytApi

/** One of the NYT best-seller lists the Home screen can show. */
data class NytList(val slug: String, val displayName: String)

val NYT_LISTS = listOf(
    NytList("hardcover-fiction", "Fiction"),
    NytList("hardcover-nonfiction", "Nonfiction"),
    NytList("trade-fiction-paperback", "Paperback Fiction"),
    NytList("young-adult-hardcover", "Young Adult"),
    NytList("childrens-middle-grade-hardcover", "Middle Grade"),
)

class BooksRepository(
    private val nytApi: NytApi,
    private val googleBooksApi: GoogleBooksApi,
    private val iDreamBooksApi: IDreamBooksApi,
) {

    suspend fun bestSellers(list: NytList): List<Book> {
        val response = nytApi.bestSellers(list.slug, BuildConfig.NYT_API_KEY)
        return response.results?.books.orEmpty().map { nyt ->
            Book(
                id = nyt.primaryIsbn13 ?: "${list.slug}-${nyt.rank}",
                title = nyt.title.titlecase(),
                author = nyt.author,
                description = nyt.description?.takeIf { it.isNotBlank() },
                imageUrl = nyt.bookImage.forceHttps(),
                buyLink = nyt.amazonProductUrl,
                isbn13 = nyt.primaryIsbn13,
                rank = nyt.rank,
            )
        }
    }

    /**
     * Free-text search via Google Books. A bare ISBN is turned into an
     * `isbn:` query so barcode scans resolve to exactly one volume.
     */
    suspend fun search(rawQuery: String): List<Book> {
        val query = rawQuery.trim()
        val effectiveQuery = if (query.looksLikeIsbn()) "isbn:${query.normalizeIsbn()}" else query
        val response = googleBooksApi.search(effectiveQuery)
        return response.items.map { volume ->
            val info = volume.volumeInfo
            val isbn13 = info.industryIdentifiers.firstOrNull { it.type == "ISBN_13" }?.identifier
            Book(
                id = isbn13 ?: volume.id,
                title = info.title,
                author = info.authors.joinToString(", ").ifBlank { "Unknown author" },
                description = info.description?.takeIf { it.isNotBlank() },
                imageUrl = (info.imageLinks?.thumbnail ?: info.imageLinks?.smallThumbnail).forceHttps(),
                buyLink = volume.saleInfo.buyLink,
                isbn13 = isbn13,
                rating = info.averageRating,
            )
        }
    }

    /** Critic reviews for an ISBN; returns an empty list when iDreamBooks has none. */
    suspend fun criticReviews(isbn: String): List<CriticReview> {
        val response = iDreamBooksApi.reviews(isbn, BuildConfig.IDREAMBOOKS_API_KEY)
        return response.book?.criticReviews.orEmpty().mapNotNull { review ->
            val source = review.source?.takeIf { it.isNotBlank() } ?: return@mapNotNull null
            CriticReview(
                source = source,
                snippet = review.snippet,
                starRating = review.starRating,
                reviewLink = review.reviewLink,
            )
        }
    }
}

internal fun String.looksLikeIsbn(): Boolean {
    val significant = filter { it.isDigit() || it.uppercaseChar() == 'X' }
    return significant.length in 10..13 &&
        all { it.isDigit() || it == '-' || it == ' ' || it.uppercaseChar() == 'X' }
}

/** Strips separators, keeping digits and an ISBN-10 check digit of X. */
internal fun String.normalizeIsbn(): String =
    uppercase().filter { it.isDigit() || it == 'X' }

/** Google Books/NYT sometimes hand out http:// image links, which Android blocks by default. */
internal fun String?.forceHttps(): String? = this?.replaceFirst("http://", "https://")

/** NYT returns titles in ALL CAPS; make them presentable. */
internal fun String.titlecase(): String =
    lowercase().split(" ").joinToString(" ") { word ->
        word.replaceFirstChar { if (it.isLowerCase()) it.titlecase() else it.toString() }
    }
