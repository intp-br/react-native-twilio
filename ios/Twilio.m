#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(Twilio, NSObject)

RCT_EXTERN_METHOD(isConnected: (RCTPromiseResolveBlock)resolve)

RCT_EXTERN_METHOD(startCall:(NSString *)accessToken withParams:(NSDictionary *)params)

RCT_EXTERN_METHOD(endCall)
RCT_EXTERN_METHOD(exitApp)

+ (BOOL)requiresMainQueueSetup
{
  // https://stackoverflow.com/questions/50773748/difference-requiresmainqueuesetup-and-dispatch-get-main-queue
  return NO;
}

@end
