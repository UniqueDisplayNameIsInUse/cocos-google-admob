/****************************************************************************
 Copyright (c) 2023-2024 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You
shall not use Cocos Creator software for developing other software or tools
that's used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to
you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#import "Route.h"
#import "Codec.h"

@interface Route ()

@property (nonatomic, strong) NSMutableDictionary<NSString *, id<IScriptHandler>> *handlers;
@property (nonatomic, strong) AdServiceHub *adServiceHub;

@end

@implementation Route

- (instancetype)initWithAdServiceHub:(AdServiceHub *)adServiceHub codec:(Codec *)codec {
    self = [super init];
    if (self) {
        _adServiceHub = adServiceHub;
        _codec = codec;
        _handlers = [NSMutableDictionary dictionary];
    }
    return self;
}

- (void)destroy {
    [self.handlers removeAllObjects];
}

- (void)on:(NSString *)method type:(Class)type handler:(id<IScriptHandler>)handler {
    [self.codec registerMethod:method type:type];
    [self.handlers setObject:handler forKey:method];
}

- (void)off:(NSString *)method {
    [self.handlers removeObjectForKey:method];
}

- (void)dispatch:(NSString *)arg0 arg1:(NSString *)arg1 {
    [self.adServiceHub sendToUIThread:^{
        id<IScriptHandler> handler = [self.handlers objectForKey:arg0];
        if (!handler) {
            NSLog(@"missing handler: %@", arg0);
            return;
        }
        [handler onMessage:[self.codec decode:arg0 data:arg1]];
    }];
}

@end
