//
//  KarmiesBridge.h
//  KarmiesSDK
//
//  Created by Dustin Mallory on 4/11/17.
//  Copyright © 2017 Karmies. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <CoreLocation/CoreLocation.h>

NS_ASSUME_NONNULL_BEGIN

/**
 Used for internal bridging to Karmies Objective-C classes. Do not use this class directly, use the Karmies class and its members instead.
*/
@interface KarmiesBridge : NSObject

+ (void)updateLocation:(CLLocation *)location always:(BOOL)always;

+ (NSObject * __nullable)unarchiveObjectSafely:(NSString * __nonnull)path;

+ (NSArray * __nullable)deviceInfo;

+ (void)configureEventsWithParams:(NSArray *)params;
+ (void)flushEvents;
+ (void)recordEventWithParams:(NSArray *)params;

+ (BOOL)connectWithParams:(NSArray *)params callback:(void (^)(NSInteger status))callback;
+ (void)disconnect;
+ (void)publishWithParams:(NSArray *)params;

@end

NS_ASSUME_NONNULL_END
