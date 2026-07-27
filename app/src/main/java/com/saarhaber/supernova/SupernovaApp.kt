package com.saarhaber.supernova

import android.app.Application
import com.saarhaber.supernova.data.AppContainer

class SupernovaApp : Application() {

    lateinit var container: AppContainer
        private set

    override fun onCreate() {
        super.onCreate()
        container = AppContainer()
    }
}
