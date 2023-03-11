import {
  endCall,
  EventType,
  isConnected,
  startCall,
  twilioEmitter,
} from '@intp-br/react-native-twilio';
import * as React from 'react';
import {
  Alert,
  Button,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function App() {
  const [callInProgress, setCallInProgress] = React.useState(false);

  const placeCall = async () => {
    if (Platform.OS === 'android') {
      const granted = await askRecordAudioPermission();
      if (!granted) {
        Alert.alert('Permission denied', 'You need to grant permission');
        return;
      }
    }
    console.log('Place call');
    startCall('access_token', { foo: 'bar' });
  };

  const askRecordAudioPermission = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO!,
      {
        title: 'Record Audio Permission',
        message: 'App needs access to your microphone ',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the microphone');
      return true;
    } else {
      console.log('Microphone permission denied');
      return false;
    }
  };

  const hangUp = async () => {
    endCall();
  };

  React.useEffect(() => {
    const subscriptions = [
      twilioEmitter.addListener(EventType.CallConnected, () => {
        console.log(`CallConnected`);
        setCallInProgress(true);
      }),
      twilioEmitter.addListener(EventType.CallDisconnected, () => {
        console.log(`CallDisconnected`);
        setCallInProgress(false);
      }),
      twilioEmitter.addListener(EventType.CallConnectFailure, (data) => {
        console.log(`CallConnectFailure:`, data);
        setCallInProgress(false);
      }),
      twilioEmitter.addListener(EventType.CallDisconnectedError, (data) => {
        console.log(`CallDisconnectedError:`, data);
        setCallInProgress(false);
      }),
    ];
    return () => {
      subscriptions.map((subscription) => {
        subscription.remove();
      });
    };
  }, []);

  const checkIfIsConnected = async () => {
    const _isConnected = await isConnected();
    console.log('isConnected: ', _isConnected);
  };

  return (
    <View style={styles.container}>
      <Text>Call in progress: {callInProgress ? 'Yes' : 'No'}</Text>
      <Button
        title={callInProgress ? 'Hang up call' : 'Place call'}
        onPress={() => (callInProgress ? hangUp() : placeCall())}
      />
      <Button title="Check if is connected" onPress={checkIfIsConnected} />
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
