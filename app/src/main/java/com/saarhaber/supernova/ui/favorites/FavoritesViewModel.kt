package com.saarhaber.supernova.ui.favorites

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import androidx.lifecycle.viewmodel.initializer
import androidx.lifecycle.viewmodel.viewModelFactory
import com.saarhaber.supernova.SupernovaApp
import com.saarhaber.supernova.data.FavoritesRepository
import com.saarhaber.supernova.data.model.Book
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.catch
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

sealed interface FavoritesUiState {
    data object Loading : FavoritesUiState
    data class Loaded(val books: List<Book>) : FavoritesUiState
    data class Error(val message: String) : FavoritesUiState
}

class FavoritesViewModel(
    private val favoritesRepository: FavoritesRepository,
) : ViewModel() {

    val uiState: StateFlow<FavoritesUiState> = favoritesRepository.favorites()
        .map<List<Book>, FavoritesUiState> { books -> FavoritesUiState.Loaded(books) }
        .catch { emit(FavoritesUiState.Error("Couldn't load your favorites. Check your connection.")) }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), FavoritesUiState.Loading)

    fun remove(book: Book) {
        viewModelScope.launch {
            try {
                favoritesRepository.remove(book.id)
            } catch (_: Exception) {
                // Firestore retries offline deletes automatically.
            }
        }
    }

    companion object {
        val Factory: ViewModelProvider.Factory = viewModelFactory {
            initializer {
                val app = this[ViewModelProvider.AndroidViewModelFactory.APPLICATION_KEY] as SupernovaApp
                FavoritesViewModel(app.container.favoritesRepository)
            }
        }
    }
}
