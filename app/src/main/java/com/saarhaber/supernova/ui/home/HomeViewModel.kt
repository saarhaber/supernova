package com.saarhaber.supernova.ui.home

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import androidx.lifecycle.viewmodel.initializer
import androidx.lifecycle.viewmodel.viewModelFactory
import com.saarhaber.supernova.SupernovaApp
import com.saarhaber.supernova.data.BooksRepository
import com.saarhaber.supernova.data.FavoritesRepository
import com.saarhaber.supernova.data.NYT_LISTS
import com.saarhaber.supernova.data.NytList
import com.saarhaber.supernova.data.model.Book
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.catch
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

sealed interface BestSellersUiState {
    data object Loading : BestSellersUiState
    data class Success(val books: List<Book>) : BestSellersUiState
    data class Error(val message: String) : BestSellersUiState
}

class HomeViewModel(
    private val booksRepository: BooksRepository,
    private val favoritesRepository: FavoritesRepository,
) : ViewModel() {

    private val _selectedList = MutableStateFlow(NYT_LISTS.first())
    val selectedList: StateFlow<NytList> = _selectedList.asStateFlow()

    private val _uiState = MutableStateFlow<BestSellersUiState>(BestSellersUiState.Loading)
    val uiState: StateFlow<BestSellersUiState> = _uiState.asStateFlow()

    /** Ids of favorited books, used to fill in the heart icons. */
    val favoriteIds: StateFlow<Set<String>> = favoritesRepository.favorites()
        .map { books -> books.map(Book::id).toSet() }
        .catch { emit(emptySet()) }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), emptySet())

    init {
        refresh()
    }

    fun selectList(list: NytList) {
        if (list == _selectedList.value) return
        _selectedList.value = list
        refresh()
    }

    fun refresh() {
        val list = _selectedList.value
        _uiState.value = BestSellersUiState.Loading
        viewModelScope.launch {
            _uiState.value = try {
                BestSellersUiState.Success(booksRepository.bestSellers(list))
            } catch (e: Exception) {
                BestSellersUiState.Error(
                    e.localizedMessage ?: "Couldn't load the best-sellers list. Check your connection."
                )
            }
        }
    }

    fun toggleFavorite(book: Book) {
        viewModelScope.launch {
            try {
                if (book.id in favoriteIds.value) favoritesRepository.remove(book.id)
                else favoritesRepository.add(book)
            } catch (_: Exception) {
                // Firestore queues writes offline; a hard failure here means auth expired,
                // which the auth gate will surface on its own.
            }
        }
    }

    companion object {
        val Factory: ViewModelProvider.Factory = viewModelFactory {
            initializer {
                val app = this[ViewModelProvider.AndroidViewModelFactory.APPLICATION_KEY] as SupernovaApp
                HomeViewModel(app.container.booksRepository, app.container.favoritesRepository)
            }
        }
    }
}
