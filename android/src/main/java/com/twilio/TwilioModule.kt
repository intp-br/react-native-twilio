package com.twilio

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import android.util.Log
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise

class TwilioModule(reactContext: ReactApplicationContext): ReactContextBaseJavaModule(reactContext) {
  private val tag = "TwilioPhone"

  override fun getName(): String {
    return NAME
  }

  @ReactMethod
  fun exitApp() {
    Log.i(tag, "exitApp")
    System.exit(0)
  }

  companion object {
    const val NAME = "Twilio"
  }
}
