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

export function startCall(
  accessToken: string,
  params: Record<string, string>
): void {
  return Twilio.startCall(accessToken, params);
}

export function endCall(): void {
  return Twilio.endCall();
}

export function exitApp() {
  return Twilio.exitApp();
}

export function isConnected(): Promise<boolean> {
  return Twilio.isConnected();
}
