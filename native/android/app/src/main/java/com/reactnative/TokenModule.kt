package com.reactnative

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

object TokenHolder {
    var token: String? = null
}

class TokenModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName(): String = "TokenModule"

    @ReactMethod
    fun setToken(token: String) {
        TokenHolder.token = token
    }
}