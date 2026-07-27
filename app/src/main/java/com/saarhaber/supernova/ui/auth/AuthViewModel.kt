package com.saarhaber.supernova.ui.auth

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import androidx.lifecycle.viewmodel.initializer
import androidx.lifecycle.viewmodel.viewModelFactory
import com.google.firebase.auth.FirebaseAuthException
import com.saarhaber.supernova.SupernovaApp
import com.saarhaber.supernova.data.AuthRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

sealed interface AuthUiState {
    data object Loading : AuthUiState
    data object SignedOut : AuthUiState
    data class SignedIn(val email: String?) : AuthUiState
}

/** Transient state of the sign-in/sign-up form itself. */
data class AuthFormState(
    val isSubmitting: Boolean = false,
    val error: String? = null,
    val infoMessage: String? = null,
)

class AuthViewModel(private val authRepository: AuthRepository) : ViewModel() {

    val uiState: StateFlow<AuthUiState> = authRepository.authState
        .map { user ->
            if (user != null) AuthUiState.SignedIn(user.email) else AuthUiState.SignedOut
        }
        .stateIn(viewModelScope, SharingStarted.Eagerly, AuthUiState.Loading)

    private val _formState = MutableStateFlow(AuthFormState())
    val formState: StateFlow<AuthFormState> = _formState.asStateFlow()

    fun signIn(email: String, password: String) = submit {
        authRepository.signIn(email.trim(), password)
    }

    fun signUp(email: String, password: String, confirmPassword: String) {
        if (password != confirmPassword) {
            _formState.value = AuthFormState(error = "Passwords do not match.")
            return
        }
        submit { authRepository.signUp(email.trim(), password) }
    }

    fun sendPasswordReset(email: String) {
        if (email.isBlank()) {
            _formState.value = AuthFormState(error = "Enter your email first, then tap “Forgot password”.")
            return
        }
        viewModelScope.launch {
            _formState.value = AuthFormState(isSubmitting = true)
            try {
                authRepository.sendPasswordReset(email.trim())
                _formState.value = AuthFormState(infoMessage = "Password reset email sent to ${email.trim()}.")
            } catch (e: Exception) {
                _formState.value = AuthFormState(error = e.toFriendlyMessage())
            }
        }
    }

    fun signOut() = authRepository.signOut()

    fun clearMessages() {
        _formState.value = AuthFormState()
    }

    private fun submit(block: suspend () -> Unit) {
        viewModelScope.launch {
            _formState.value = AuthFormState(isSubmitting = true)
            try {
                block()
                _formState.value = AuthFormState()
            } catch (e: Exception) {
                _formState.value = AuthFormState(error = e.toFriendlyMessage())
            }
        }
    }

    companion object {
        val Factory: ViewModelProvider.Factory = viewModelFactory {
            initializer {
                val app = this[ViewModelProvider.AndroidViewModelFactory.APPLICATION_KEY] as SupernovaApp
                AuthViewModel(app.container.authRepository)
            }
        }
    }
}

private fun Exception.toFriendlyMessage(): String = when (this) {
    is FirebaseAuthException -> when (errorCode) {
        "ERROR_INVALID_EMAIL" -> "That email address is not valid."
        "ERROR_USER_NOT_FOUND" -> "No account found for that email."
        "ERROR_WRONG_PASSWORD", "ERROR_INVALID_CREDENTIAL" -> "Incorrect email or password."
        "ERROR_EMAIL_ALREADY_IN_USE" -> "An account already exists for that email."
        "ERROR_WEAK_PASSWORD" -> "Password is too weak — use at least 6 characters."
        "ERROR_TOO_MANY_REQUESTS" -> "Too many attempts. Please try again later."
        else -> localizedMessage ?: "Authentication failed. Please try again."
    }
    else -> localizedMessage ?: "Something went wrong. Check your connection and try again."
}
