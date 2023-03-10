# react-native-twilio

Native modules built with Kotlin and Swift that integrates Twilio official SDK's.

Only to start/stop calls. Don't need FCM configuration because this package don't receive calls.

## Installation

```sh
yarn add @intp-br/react-native-twilio
```

## Usage

```js
import * as React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import {
  endCall,
  EventType,
  reactNativeTwilioOutboundCallsEmitter,
  startCall,
} from '@intp-br/react-native-twilio';

export default function App() {
  const [callInProgress, setCallInProgress] = React.useState(false);

  const placeCall = async () => {
    try {
      startCall('your_token_here  ', { foo: 'bar' });
    } catch (error) {
      console.log(`placeCall LOG:  error:`, error);
    }
  };

  const hangUp = async () => {
    try {
      endCall();
    } catch (error) {
      console.log(`hangUp LOG:  error:`, error);
    }
  };

  React.useEffect(() => {
    const subscriptions = [
      reactNativeTwilioOutboundCallsEmitter.addListener(
        EventType.CallConnected,
        () => {
          console.log(`CallConnected`);
          setCallInProgress(true);
        }
      ),
      reactNativeTwilioOutboundCallsEmitter.addListener(
        EventType.CallDisconnected,
        () => {
          console.log(`CallDisconnected`);
          setCallInProgress(false);
        }
      ),
      reactNativeTwilioOutboundCallsEmitter.addListener(
        EventType.CallConnectFailure,
        (data) => {
          console.log(`CallConnectFailure:`, data);
          setCallInProgress(false);
        }
      ),
      reactNativeTwilioOutboundCallsEmitter.addListener(
        EventType.CallDisconnectedError,
        (data) => {
          console.log(`CallDisconnectedError:`, data);
          setCallInProgress(false);
        }
      ),
    ];
    return () => {
      subscriptions.map((subscription) => {
        subscription.remove();
      });
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text>Call in progress: {callInProgress ? 'Yes' : 'No'}</Text>
      <Button
        title={callInProgress ? 'Hang up call' : 'Place call'}
        onPress={() => (callInProgress ? hangUp() : placeCall())}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
```

## Version of Twilio SDK

- [v6.1.2 (Android)](https://www.twilio.com/docs/voice/sdks/android/3x-changelog#612)
- [v6.5.0 (iOS)](https://www.twilio.com/docs/voice/sdks/ios/changelog#650)

## Twilio official SDK's

- iOS [ios-twilio](https://www.twilio.com/pt-br/docs/voice/sdks/ios)
- Android [android-twilio](https://www.twilio.com/pt-br/docs/voice/sdks/android)


## Android permissions needed

Put RECORD_AUDIO permission at your manifest file.

```
<uses-permission android:name="android.permission.RECORD_AUDIO"/>
```
## License

MIT

---
