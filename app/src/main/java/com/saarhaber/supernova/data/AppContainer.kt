package com.saarhaber.supernova.data

import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore
import com.saarhaber.supernova.BuildConfig
import com.saarhaber.supernova.data.remote.GoogleBooksApi
import com.saarhaber.supernova.data.remote.IDreamBooksApi
import com.saarhaber.supernova.data.remote.NytApi
import kotlinx.serialization.json.Json
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.kotlinx.serialization.asConverterFactory
import java.util.concurrent.TimeUnit

/**
 * Hand-rolled dependency container, created once in [com.saarhaber.supernova.SupernovaApp].
 * The app is small enough that a DI framework would be more ceremony than value.
 */
class AppContainer {

    private val json = Json {
        ignoreUnknownKeys = true
        coerceInputValues = true
    }

    private val okHttpClient: OkHttpClient by lazy {
        OkHttpClient.Builder()
            .connectTimeout(20, TimeUnit.SECONDS)
            .readTimeout(20, TimeUnit.SECONDS)
            .apply {
                if (BuildConfig.DEBUG) {
                    addInterceptor(
                        HttpLoggingInterceptor().apply {
                            level = HttpLoggingInterceptor.Level.BASIC
                        }
                    )
                }
            }
            .build()
    }

    private fun retrofit(baseUrl: String): Retrofit =
        Retrofit.Builder()
            .baseUrl(baseUrl)
            .client(okHttpClient)
            .addConverterFactory(json.asConverterFactory("application/json".toMediaType()))
            .build()

    private val nytApi: NytApi by lazy {
        retrofit("https://api.nytimes.com/").create(NytApi::class.java)
    }

    private val googleBooksApi: GoogleBooksApi by lazy {
        retrofit("https://www.googleapis.com/").create(GoogleBooksApi::class.java)
    }

    private val iDreamBooksApi: IDreamBooksApi by lazy {
        retrofit("https://idreambooks.com/").create(IDreamBooksApi::class.java)
    }

    val booksRepository: BooksRepository by lazy {
        BooksRepository(nytApi, googleBooksApi, iDreamBooksApi)
    }

    val authRepository: AuthRepository by lazy {
        AuthRepository(FirebaseAuth.getInstance())
    }

    val favoritesRepository: FavoritesRepository by lazy {
        FavoritesRepository(FirebaseAuth.getInstance(), FirebaseFirestore.getInstance())
    }
}
