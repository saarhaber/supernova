package com.saarhaber.supernova

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import com.saarhaber.supernova.ui.SupernovaRoot
import com.saarhaber.supernova.ui.theme.SupernovaTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            SupernovaTheme {
                SupernovaRoot()
            }
        }
    }
}
