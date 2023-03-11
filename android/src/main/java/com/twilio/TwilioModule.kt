package com.twilio

import kotlin.system.exitProcess
import android.util.Log
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.twilio.voice.*

class TwilioModule(reactContext: ReactApplicationContext): ReactContextBaseJavaModule(reactContext) {
  private val tag = "TwilioPhone"
  private var activeCall: Call? = null
  private var listenerCount = 0

  override fun getName(): String {
    return NAME
  }

  @ReactMethod
  fun addListener(eventName: String) {
    Log.e(tag, "Add listener: ${eventName}")
    if (listenerCount == 0) {
      // Set up any upstream listeners or background tasks as necessary
    }

    listenerCount += 1
  }

  @ReactMethod
  fun removeListeners(count: Int) {
    listenerCount -= count
    if (listenerCount == 0) {
      // Remove upstream listeners, stop unnecessary background tasks
    }
  }

  private fun sendEvent(reactContext: ReactContext, eventName: String, params: WritableMap?) {
    reactContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
      .emit(eventName, params)
  }

   private var callListener = callListener()
   private fun callListener(): Call.Listener {
     return object : Call.Listener {
      /*
       * This callback is emitted once before the Call.Listener.onConnected() callback when
       * the callee is being alerted of a Call. The behavior of this callback is determined by
       * the answerOnBridge flag provided in the Dial verb of your TwiML application
       * associated with this client. If the answerOnBridge flag is false, which is the
       * default, the Call.Listener.onConnected() callback will be emitted immediately after
       * Call.Listener.onRinging(). If the answerOnBridge flag is true, this will cause the
       * call to emit the onConnected callback only after the call is answered.
       * See answeronbridge for more details on how to use it with the Dial TwiML verb. If the
       * twiML response contains a Say verb, then the call will emit the
       * Call.Listener.onConnected callback immediately after Call.Listener.onRinging() is
       * raised, irrespective of the value of answerOnBridge being set to true or false
       */
      override fun onRinging(call: Call) {
        Log.d(tag, "Call did start ringing")
        /*
         * When [answerOnBridge](https://www.twilio.com/docs/voice/twiml/dial#answeronbridge)
         * is enabled in the <Dial> TwiML verb, the caller will not hear the ringback while
         * the call is ringing and awaiting to be accepted on the callee's side. The application
         * can use the `SoundPoolManager` to play custom audio files between the
         * `Call.Listener.onRinging()` and the `Call.Listener.onConnected()` callbacks.
         */

        // activeCall = call

        // val params = Arguments.createMap()
        // params.putString("callSid", call.sid)

        // sendEvent(reactApplicationContext, "CallRinging", params)
      }

      override fun onConnectFailure(call: Call, error: CallException) {
        Log.e(tag, "Call failed to connect: ${error.errorCode}, ${error.message}")

        val params = Arguments.createMap()
        params.putString("callSid", call.sid)
        params.putInt("errorCode", error.errorCode)
        params.putString("errorMessage", error.message)

        sendEvent(reactApplicationContext, "CallConnectFailure", params)
        activeCall = null
      }

      override fun onConnected(call: Call) {
        Log.d(tag, "Call did connect")

        val params = Arguments.createMap()
        params.putString("callSid", call.sid)

        sendEvent(reactApplicationContext, "CallConnected", params)
        activeCall = call
      }

      override fun onReconnecting(call: Call, error: CallException) {
        activeCall = null
        Log.e(tag, "Call is reconnecting with error: ${error.errorCode}, ${error.message}")

        val params = Arguments.createMap()
        params.putString("callSid", call.sid)
        params.putInt("errorCode", error.errorCode)
        params.putString("errorMessage", error.message)

        sendEvent(reactApplicationContext, "CallReconnecting", params)
      }

      override fun onReconnected(call: Call) {
        activeCall = call
        Log.d(tag, "Call did reconnect")

        val params = Arguments.createMap()
        params.putString("callSid", call.sid)

        sendEvent(reactApplicationContext, "CallReconnected", params)
      }

      override fun onDisconnected(call: Call, error: CallException?) {
        activeCall = null

        val params = Arguments.createMap()
        params.putString("callSid", call.sid)

        if (error != null) {
          Log.e(tag, "Call disconnected with error: ${error.errorCode}, ${error.message}")

          params.putInt("errorCode", error.errorCode)
          params.putString("errorMessage", error.message)

          sendEvent(reactApplicationContext, "CallDisconnectedError", params)
        } else {
          Log.d(tag, "Call disconnected")

          sendEvent(reactApplicationContext, "CallDisconnected", params)
        }
      }
     }
   }

  @ReactMethod
  fun startCall(accessToken: String, params: ReadableMap) {
    Log.i(tag, "Starting call")

    val connectParams = mutableMapOf<String, String>()

    for (entry in params.entryIterator) {
      connectParams[entry.key] = entry.value as String
    }

    val connectOptions = ConnectOptions.Builder(accessToken)
      .params(connectParams)
      .build()

    Voice.connect(reactApplicationContext, connectOptions, callListener)
  }

  @ReactMethod
  fun endCall() {
    Log.i(tag, "Disconnecting call")

    if(activeCall === null) {
      return
    }

    activeCall!!.disconnect()
    activeCall = null
  }

  @ReactMethod
  fun exitApp() {
    Log.i(tag, "exitApp")
    exitProcess(0)
  }

  @ReactMethod
  fun isConnected(promise: Promise) {
    promise.resolve(activeCall !== null)
  }

  companion object {
    const val NAME = "Twilio"
  }
}
