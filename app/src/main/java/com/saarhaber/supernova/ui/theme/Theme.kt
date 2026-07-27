package com.saarhaber.supernova.ui.theme

import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.dynamicDarkColorScheme
import androidx.compose.material3.dynamicLightColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext

// "Supernova" palette: deep night-sky purples with a hot orange accent.
private val NightPurple = Color(0xFF4F378B)
private val NightPurpleLight = Color(0xFFEADDFF)
private val SupernovaOrange = Color(0xFFB4551D)
private val SupernovaOrangeLight = Color(0xFFFFDBC9)

private val LightColors = lightColorScheme(
    primary = NightPurple,
    onPrimary = Color.White,
    primaryContainer = NightPurpleLight,
    onPrimaryContainer = Color(0xFF21005D),
    secondary = SupernovaOrange,
    onSecondary = Color.White,
    secondaryContainer = SupernovaOrangeLight,
    onSecondaryContainer = Color(0xFF380D00),
)

private val DarkColors = darkColorScheme(
    primary = Color(0xFFCFBCFF),
    onPrimary = Color(0xFF381E72),
    primaryContainer = NightPurple,
    onPrimaryContainer = NightPurpleLight,
    secondary = Color(0xFFFFB68F),
    onSecondary = Color(0xFF5B2400),
    secondaryContainer = Color(0xFF8A3D06),
    onSecondaryContainer = SupernovaOrangeLight,
)

@Composable
fun SupernovaTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    // Wallpaper-based dynamic color on Android 12+, brand palette below that.
    dynamicColor: Boolean = true,
    content: @Composable () -> Unit,
) {
    val colorScheme = when {
        dynamicColor && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {
            val context = LocalContext.current
            if (darkTheme) dynamicDarkColorScheme(context) else dynamicLightColorScheme(context)
        }
        darkTheme -> DarkColors
        else -> LightColors
    }
    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content,
    )
}
