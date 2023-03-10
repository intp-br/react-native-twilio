export enum EventType {
  CallConnected = 'CallConnected',
  CallConnectFailure = 'CallConnectFailure',
  CallReconnecting = 'CallReconnecting',
  CallReconnected = 'CallReconnected',
  CallDisconnected = 'CallDisconnected',
  CallDisconnectedError = 'CallDisconnectedError',
}

export type CallStats = {
  localAudioTrackStats: Array<{
    audioLevel: number;
    jitter: number;
    roundTripTime: number;
  }>;
  remoteAudioTrackStats: Array<{
    audioLevel: number;
    jitter: number;
    mos: number;
  }>;
};
