import { NativeEventEmitter, NativeModules, Platform } from 'react-native';
export * from './types';

const LINKING_ERROR =
  `The package 'react-native-twilio-outbound-calls' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const Twilio = NativeModules.Twilio
  ? NativeModules.Twilio
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export const twilioEmitter = new NativeEventEmitter(Twilio);

export function isConnected(): Promise<boolean> {
  return Twilio.isConnected();
}

export function startCall(
  accessToken: string,
  params: Record<string, string>
): void {
  return Twilio.startCall(accessToken, params);
}

export function endCall(): void {
  return Twilio.endCall();
}

export function exitAppIosOnly() {
  if (Platform.OS !== 'ios') {
    throw new Error('exitAppIosOnly is only available on iOS');
  }
  return Twilio.exitAppIosOnly();
}

export function multiply(a: number, b: number): Promise<number> {
  if (Platform.OS !== 'android') {
    throw new Error('multiply is only available on Android');
  }
  return Twilio.multiply(a, b); // TODO: Sample code (remove this method)
}
