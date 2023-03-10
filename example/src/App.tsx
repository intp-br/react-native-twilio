import {
  endCall,
  EventType,
  multiply,
  startCall,
  twilioEmitter,
} from '@intp-br/react-native-twilio';
import * as React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function App() {
  const [callInProgress, setCallInProgress] = React.useState(false);

  const placeCall = async () => {
    startCall('your_token_here  ', { foo: 'bar' });
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

  const androidTest = async () => {
    console.log(`androidTest`);
    const result = await multiply(3, 3);
    console.log(`androidTest LOG:  result:`, result);
  };

  return (
    <View style={styles.container}>
      <Text>Call in progress: {callInProgress ? 'Yes' : 'No'}</Text>
      <Button
        title={callInProgress ? 'Hang up call' : 'Place call'}
        onPress={() => (callInProgress ? hangUp() : placeCall())}
      />
      <Button title="Android test" onPress={() => androidTest()} />
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
