package com.saarhaber.supernova.ui.search

import android.content.Intent
import android.widget.Toast
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.QrCodeScanner
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.core.net.toUri
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import com.google.mlkit.vision.barcode.common.Barcode
import com.google.mlkit.vision.codescanner.GmsBarcodeScannerOptions
import com.google.mlkit.vision.codescanner.GmsBarcodeScanning
import com.saarhaber.supernova.data.model.Book
import com.saarhaber.supernova.data.model.CriticReview
import com.saarhaber.supernova.ui.components.BookCard

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SearchScreen(viewModel: SearchViewModel = viewModel(factory = SearchViewModel.Factory)) {
    val context = LocalContext.current
    val query by viewModel.query.collectAsStateWithLifecycle()
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()
    val reviews by viewModel.reviews.collectAsStateWithLifecycle()
    val favoriteIds by viewModel.favoriteIds.collectAsStateWithLifecycle()

    var expandedBookId by rememberSaveable { mutableStateOf<String?>(null) }

    fun startScan() {
        val options = GmsBarcodeScannerOptions.Builder()
            .setBarcodeFormats(Barcode.FORMAT_EAN_13, Barcode.FORMAT_EAN_8, Barcode.FORMAT_UPC_A)
            .build()
        GmsBarcodeScanning.getClient(context, options)
            .startScan()
            .addOnSuccessListener { barcode ->
                barcode.rawValue?.let(viewModel::onBarcodeScanned)
            }
            .addOnFailureListener {
                Toast.makeText(
                    context,
                    "Couldn't start the scanner. Make sure Google Play services is up to date.",
                    Toast.LENGTH_LONG,
                ).show()
            }
    }

    Scaffold(
        topBar = { TopAppBar(title = { Text("Find a Book") }) },
    ) { innerPadding ->
        Column(
            Modifier
                .padding(innerPadding)
                .padding(horizontal = 16.dp),
        ) {
            OutlinedTextField(
                value = query,
                onValueChange = viewModel::onQueryChange,
                label = { Text("Title, author, or ISBN") },
                singleLine = true,
                keyboardOptions = KeyboardOptions(imeAction = ImeAction.Search),
                keyboardActions = KeyboardActions(onSearch = { viewModel.search() }),
                leadingIcon = {
                    IconButton(onClick = viewModel::search) {
                        Icon(Icons.Filled.Search, contentDescription = "Search")
                    }
                },
                trailingIcon = {
                    IconButton(onClick = ::startScan) {
                        Icon(Icons.Filled.QrCodeScanner, contentDescription = "Scan a book barcode")
                    }
                },
                modifier = Modifier.fillMaxWidth(),
            )
            Spacer(Modifier.height(8.dp))

            when (val state = uiState) {
                is SearchUiState.Idle -> Column(
                    Modifier
                        .fillMaxSize()
                        .padding(32.dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center,
                ) {
                    Icon(
                        Icons.Filled.QrCodeScanner,
                        contentDescription = null,
                        tint = MaterialTheme.colorScheme.onSurfaceVariant,
                        modifier = Modifier.size(56.dp),
                    )
                    Spacer(Modifier.height(12.dp))
                    Text(
                        "Search by title or author, or tap the scanner icon to scan a book's barcode.",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        textAlign = TextAlign.Center,
                    )
                }

                is SearchUiState.Loading -> Box(
                    Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center,
                ) {
                    CircularProgressIndicator()
                }

                is SearchUiState.Error -> Box(
                    Modifier
                        .fillMaxSize()
                        .padding(32.dp),
                    contentAlignment = Alignment.Center,
                ) {
                    Text(
                        state.message,
                        style = MaterialTheme.typography.bodyMedium,
                        textAlign = TextAlign.Center,
                    )
                }

                is SearchUiState.Success -> LazyColumn(
                    contentPadding = PaddingValues(vertical = 8.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp),
                ) {
                    items(state.books, key = { it.id }) { book ->
                        BookCard(
                            book = book,
                            isFavorite = book.id in favoriteIds,
                            onToggleFavorite = viewModel::toggleFavorite,
                            expandedContent = {
                                ReviewsSection(
                                    book = book,
                                    expanded = expandedBookId == book.id,
                                    reviewsState = reviews[book.id],
                                    onToggle = {
                                        expandedBookId = if (expandedBookId == book.id) null else book.id
                                        if (expandedBookId == book.id) viewModel.loadReviews(book)
                                    },
                                )
                            },
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun ReviewsSection(
    book: Book,
    expanded: Boolean,
    reviewsState: ReviewsUiState?,
    onToggle: () -> Unit,
) {
    Column {
        TextButton(onClick = onToggle) {
            Text(if (expanded) "Hide critic reviews" else "Show critic reviews")
        }
        if (!expanded) return

        when (reviewsState) {
            null, is ReviewsUiState.Loading -> Row(
                Modifier
                    .fillMaxWidth()
                    .padding(8.dp),
                horizontalArrangement = Arrangement.Center,
            ) {
                CircularProgressIndicator(Modifier.size(24.dp), strokeWidth = 2.dp)
            }

            is ReviewsUiState.Unavailable -> Text(
                "No critic reviews found for this book.",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
            )

            is ReviewsUiState.Loaded -> Column {
                reviewsState.reviews.forEach { review ->
                    ReviewItem(review)
                }
            }
        }
    }
}

@Composable
private fun ReviewItem(review: CriticReview) {
    val context = LocalContext.current
    Column(Modifier.padding(horizontal = 8.dp, vertical = 6.dp)) {
        HorizontalDivider(Modifier.padding(bottom = 6.dp))
        Row(verticalAlignment = Alignment.CenterVertically) {
            Text(review.source, style = MaterialTheme.typography.titleMedium)
            review.starRating?.let { stars ->
                Spacer(Modifier.size(8.dp))
                Icon(
                    Icons.Filled.Star,
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.secondary,
                    modifier = Modifier.size(16.dp),
                )
                Text("$stars/5", style = MaterialTheme.typography.bodyMedium)
            }
        }
        review.snippet?.let { snippet ->
            Text(snippet, style = MaterialTheme.typography.bodyMedium)
        }
        review.reviewLink?.let { link ->
            TextButton(
                onClick = { context.startActivity(Intent(Intent.ACTION_VIEW, link.toUri())) },
                contentPadding = PaddingValues(0.dp),
            ) {
                Text("Read full review")
            }
        }
    }
}
