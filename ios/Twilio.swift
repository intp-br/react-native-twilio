import TwilioVoice

@objc(Twilio)
class Twilio: RCTEventEmitter, CallDelegate {
    var hasListeners = false
    var audioDevice = DefaultAudioDevice()
    var activeCall: Call? = nil

    override func supportedEvents() -> [String]! {
        return [
            "CallConnected",
            "CallConnectFailure",
            "CallReconnecting",
            "CallReconnected",
            "CallDisconnected",
            "CallDisconnectedError"
        ]
    }

    override func startObserving() {
        hasListeners = true
    }

    override func stopObserving() {
        hasListeners = false
    }

    func callDidConnect(call: Call) {
        NSLog("[TwilioPhone] callDidConnect")

        if hasListeners {
            sendEvent(withName: "CallConnected", body: ["callSid": call.sid])
        }
    }

    func callDidFailToConnect(call: Call, error: Error) {
        NSLog("[TwilioPhone] Call failed to connect: \(error.localizedDescription)")

        if hasListeners {
            sendEvent(withName: "CallConnectFailure", body: [
                "callSid": call.sid,
                "errorMessage": error.localizedDescription
            ])
        }
    }

    func callIsReconnecting(call: Call, error: Error) {
        NSLog("[TwilioPhone] Call is reconnecting with error: \(error.localizedDescription)")

        if hasListeners {
            sendEvent(withName: "CallReconnecting", body: [
                "callSid": call.sid,
                "errorMessage": error.localizedDescription
            ])
        }
    }

    func callDidReconnect(call: Call) {
        NSLog("[TwilioPhone] Call did reconnect")

        if hasListeners {
            sendEvent(withName: "CallReconnected", body: ["callSid": call.sid])
        }
    }

    func callDidDisconnect(call: Call, error: Error?) {
        if let error = error {
            NSLog("[TwilioPhone] Call disconnected with error: \(error.localizedDescription)")

            if hasListeners {
                sendEvent(withName: "CallDisconnectedError", body: [
                    "callSid": call.sid,
                    "errorMessage": error.localizedDescription
                ])
            }
        } else {
            NSLog("[TwilioPhone] Call disconnected")

            if hasListeners {
                sendEvent(withName: "CallDisconnected", body: ["callSid": call.sid])
            }
        }

        activeCall = nil
    }

    @objc(startCall:withParams:)
    func startCall(accessToken: String, params: [String: String]) -> Void {
        NSLog("[TwilioPhone] Starting call")
        let connectOptions = ConnectOptions(accessToken: accessToken) { builder in
            builder.params = params
        }

        let call = TwilioVoiceSDK.connect(options: connectOptions, delegate: self)
        activeCall = call
    }

    @objc(endCall)
    func endCall() -> Void {
        NSLog("[TwilioPhone] endCall")

        if (activeCall === nil) {
            return
        }

        activeCall?.disconnect()
        activeCall = nil
    }

    @objc(isConnected:withRejecter:)
    func isConnected(resolve: RCTPromiseResolveBlock, reject:RCTPromiseRejectBlock) -> Void {
        NSLog("[TwilioPhone] callIsConnected")

        if (activeCall === nil) {
            resolve(false)
            return
        }

        resolve(true)
    }

    @objc(exitAppIosOnly)
    func exitAppIosOnly() -> Void {
        NSLog("[TwilioPhone] exitAppIosOnly")

        exit(0)
    }

}

// TVOStatsReport JSON serialization
extension StatsReport {
    public func toJSON() -> NSDictionary {
        return [
            "localAudioTrackStats": localAudioTrackStats.map({ trackStats in
                return [
                    "audioLevel": trackStats.audioLevel,
                    "jitter": trackStats.jitter,
                    "roundTripTime": trackStats.roundTripTime,
                ]
            }),
            "remoteAudioTrackStats": remoteAudioTrackStats.map({ trackStats in
                return [
                    "audioLevel": trackStats.audioLevel,
                    "jitter": trackStats.jitter,
                    "mos": trackStats.mos
                ]
            }),
        ]
    }
}
