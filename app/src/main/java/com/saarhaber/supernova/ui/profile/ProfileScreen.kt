package com.saarhaber.supernova.ui.profile

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.Logout
import androidx.compose.material.icons.filled.AccountCircle
import androidx.compose.material3.Card
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import com.saarhaber.supernova.BuildConfig
import com.saarhaber.supernova.ui.auth.AuthUiState
import com.saarhaber.supernova.ui.auth.AuthViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ProfileScreen(viewModel: AuthViewModel = viewModel(factory = AuthViewModel.Factory)) {
    val authState by viewModel.uiState.collectAsStateWithLifecycle()
    val email = (authState as? AuthUiState.SignedIn)?.email

    Scaffold(
        topBar = { TopAppBar(title = { Text("Profile") }) },
    ) { innerPadding ->
        Column(
            Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            Icon(
                Icons.Filled.AccountCircle,
                contentDescription = null,
                tint = MaterialTheme.colorScheme.primary,
                modifier = Modifier.size(88.dp),
            )
            email?.let {
                Text(it, style = MaterialTheme.typography.titleMedium)
            }
            Spacer(Modifier.height(24.dp))

            Card(Modifier.fillMaxWidth()) {
                Column(
                    Modifier.padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp),
                ) {
                    Text("About Supernova", style = MaterialTheme.typography.titleMedium)
                    Text(
                        "Supernova helps you decide what to read next: scan a book's " +
                            "barcode or search by title to see critic reviews, browse the " +
                            "New York Times Best Sellers lists, and keep a favorites shelf " +
                            "that syncs across your devices.",
                        style = MaterialTheme.typography.bodyMedium,
                    )
                }
            }

            Spacer(Modifier.height(24.dp))
            OutlinedButton(
                onClick = viewModel::signOut,
                modifier = Modifier.fillMaxWidth(),
            ) {
                Icon(
                    Icons.AutoMirrored.Filled.Logout,
                    contentDescription = null,
                    modifier = Modifier.size(18.dp),
                )
                Spacer(Modifier.size(8.dp))
                Text("Sign out")
            }

            Spacer(Modifier.weight(1f))
            Text(
                "Supernova ${BuildConfig.VERSION_NAME}",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                textAlign = TextAlign.Center,
            )
        }
    }
}
