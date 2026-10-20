#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(AzanScheduler, NSObject)

RCT_EXTERN_METHOD(scheduleAzan:(NSString *)prayerName timeFull:(NSString *)timeFull)
RCT_EXTERN_METHOD(requestNotificationPermission:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(playAzanManually:(NSString *)prayerName)
RCT_EXTERN_METHOD(stopAzan)
RCT_EXTERN_METHOD(clearAllNotifications)
RCT_EXTERN_METHOD(simulateAzanTest)
RCT_EXTERN_METHOD(playAzanTest:(NSString *)prayerName)

@end
