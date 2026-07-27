package com.saarhaber.supernova.ui.search

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import androidx.lifecycle.viewmodel.initializer
import androidx.lifecycle.viewmodel.viewModelFactory
import com.saarhaber.supernova.SupernovaApp
import com.saarhaber.supernova.data.BooksRepository
import com.saarhaber.supernova.data.FavoritesRepository
import com.saarhaber.supernova.data.model.Book
import com.saarhaber.supernova.data.model.CriticReview
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.catch
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

sealed interface SearchUiState {
    data object Idle : SearchUiState
    data object Loading : SearchUiState
    data class Success(val books: List<Book>) : SearchUiState
    data class Error(val message: String) : SearchUiState
}

sealed interface ReviewsUiState {
    data object Loading : ReviewsUiState
    data class Loaded(val reviews: List<CriticReview>) : ReviewsUiState
    data object Unavailable : ReviewsUiState
}

class SearchViewModel(
    private val booksRepository: BooksRepository,
    private val favoritesRepository: FavoritesRepository,
) : ViewModel() {

    private val _query = MutableStateFlow("")
    val query: StateFlow<String> = _query.asStateFlow()

    private val _uiState = MutableStateFlow<SearchUiState>(SearchUiState.Idle)
    val uiState: StateFlow<SearchUiState> = _uiState.asStateFlow()

    /** Critic reviews per book id, fetched lazily when a result is expanded. */
    private val _reviews = MutableStateFlow<Map<String, ReviewsUiState>>(emptyMap())
    val reviews: StateFlow<Map<String, ReviewsUiState>> = _reviews.asStateFlow()

    val favoriteIds: StateFlow<Set<String>> = favoritesRepository.favorites()
        .map { books -> books.map(Book::id).toSet() }
        .catch { emit(emptySet()) }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), emptySet())

    fun onQueryChange(newQuery: String) {
        _query.value = newQuery
    }

    /** Called with the raw barcode value after a successful scan. */
    fun onBarcodeScanned(isbn: String) {
        _query.value = isbn
        search()
    }

    fun search() {
        val query = _query.value.trim()
        if (query.isEmpty()) return
        _uiState.value = SearchUiState.Loading
        _reviews.value = emptyMap()
        viewModelScope.launch {
            _uiState.value = try {
                val books = booksRepository.search(query)
                if (books.isEmpty()) SearchUiState.Error("No books found for “$query”.")
                else SearchUiState.Success(books)
            } catch (e: Exception) {
                SearchUiState.Error(
                    e.localizedMessage ?: "Search failed. Check your connection and try again."
                )
            }
        }
    }

    /** Fetch critic reviews for a book once, when its card is expanded. */
    fun loadReviews(book: Book) {
        val isbn = book.isbn13
        if (isbn == null) {
            _reviews.value += (book.id to ReviewsUiState.Unavailable)
            return
        }
        if (book.id in _reviews.value) return
        _reviews.value += (book.id to ReviewsUiState.Loading)
        viewModelScope.launch {
            val result = try {
                val criticReviews = booksRepository.criticReviews(isbn)
                if (criticReviews.isEmpty()) ReviewsUiState.Unavailable
                else ReviewsUiState.Loaded(criticReviews)
            } catch (_: Exception) {
                ReviewsUiState.Unavailable
            }
            _reviews.value += (book.id to result)
        }
    }

    fun toggleFavorite(book: Book) {
        viewModelScope.launch {
            try {
                if (book.id in favoriteIds.value) favoritesRepository.remove(book.id)
                else favoritesRepository.add(book)
            } catch (_: Exception) {
                // Offline writes are queued by Firestore; nothing actionable to show here.
            }
        }
    }

    companion object {
        val Factory: ViewModelProvider.Factory = viewModelFactory {
            initializer {
                val app = this[ViewModelProvider.AndroidViewModelFactory.APPLICATION_KEY] as SupernovaApp
                SearchViewModel(app.container.booksRepository, app.container.favoritesRepository)
            }
        }
    }
}
