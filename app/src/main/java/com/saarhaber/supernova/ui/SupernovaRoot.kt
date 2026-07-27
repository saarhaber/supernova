package com.saarhaber.supernova.ui

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.WorkspacePremium
import androidx.compose.material.icons.outlined.FavoriteBorder
import androidx.compose.material.icons.outlined.Person
import androidx.compose.material.icons.outlined.Search
import androidx.compose.material.icons.outlined.WorkspacePremium
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavDestination.Companion.hierarchy
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.saarhaber.supernova.ui.auth.AuthScreen
import com.saarhaber.supernova.ui.auth.AuthUiState
import com.saarhaber.supernova.ui.auth.AuthViewModel
import com.saarhaber.supernova.ui.favorites.FavoritesScreen
import com.saarhaber.supernova.ui.home.HomeScreen
import com.saarhaber.supernova.ui.profile.ProfileScreen
import com.saarhaber.supernova.ui.search.SearchScreen

private enum class MainDestination(
    val route: String,
    val label: String,
    val selectedIcon: ImageVector,
    val unselectedIcon: ImageVector,
) {
    Home("home", "Best Sellers", Icons.Filled.WorkspacePremium, Icons.Outlined.WorkspacePremium),
    Search("search", "Search", Icons.Filled.Search, Icons.Outlined.Search),
    Favorites("favorites", "Favorites", Icons.Filled.Favorite, Icons.Outlined.FavoriteBorder),
    Profile("profile", "Profile", Icons.Filled.Person, Icons.Outlined.Person),
}

/** Auth gate: shows the sign-in flow until Firebase reports a user, then the main app. */
@Composable
fun SupernovaRoot(authViewModel: AuthViewModel = viewModel(factory = AuthViewModel.Factory)) {
    val authState by authViewModel.uiState.collectAsStateWithLifecycle()

    when (authState) {
        is AuthUiState.Loading -> Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            CircularProgressIndicator()
        }
        is AuthUiState.SignedOut -> AuthScreen(viewModel = authViewModel)
        is AuthUiState.SignedIn -> MainScaffold()
    }
}

@Composable
private fun MainScaffold() {
    val navController = rememberNavController()
    val backStackEntry by navController.currentBackStackEntryAsState()
    val currentDestination = backStackEntry?.destination

    Scaffold(
        bottomBar = {
            NavigationBar {
                MainDestination.entries.forEach { destination ->
                    val selected = currentDestination?.hierarchy
                        ?.any { it.route == destination.route } == true
                    NavigationBarItem(
                        selected = selected,
                        onClick = {
                            navController.navigate(destination.route) {
                                popUpTo(navController.graph.findStartDestination().id) {
                                    saveState = true
                                }
                                launchSingleTop = true
                                restoreState = true
                            }
                        },
                        icon = {
                            Icon(
                                imageVector = if (selected) destination.selectedIcon else destination.unselectedIcon,
                                contentDescription = destination.label,
                            )
                        },
                        label = { Text(destination.label) },
                    )
                }
            }
        },
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = MainDestination.Home.route,
            modifier = Modifier.padding(innerPadding),
        ) {
            composable(MainDestination.Home.route) { HomeScreen() }
            composable(MainDestination.Search.route) { SearchScreen() }
            composable(MainDestination.Favorites.route) { FavoritesScreen() }
            composable(MainDestination.Profile.route) { ProfileScreen() }
        }
    }
}
