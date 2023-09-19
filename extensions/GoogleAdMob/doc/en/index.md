# Cocos Creator Google Mobile Advertisement Extension

This extension is designed for Cocos Creator to integrate the Google Mobile Ad SDK.

如果你需要中文文档，请移步 [CN](../zh/README.md)。

## Android

To integrate to the Android platform, please refer to [Android Platform Guide](./android/index.md)。

## iOS

To integrate to the iOS platform, please refer to [iOS Integrate Guide](./ios/index.md)。

## Supported Advertisement Types

- Banner
- Interstitial
- AppOpenAd
- Rewarded
- RewardedInterstitial
- Native

## Update Logs

- v1.0.0(released on 2023-08-28)
  - Integrate with the Android Platform
- v1.0.1(released on 2023-09-15)
  - Add
    - Integrate with the iOS platform
  - Fixed
    - Fix the error event sent in the onAdFailedToShowFullScreenContent method.
    - Add full screen callback to the rewardedInterstitial Ad
    - Fixed the missing event of NativeAdListenerNTF
- v1.0.2(release on 2023-9-19)
  - Updates to the newest SKAdNetworkItems.
  - Fixed the render bug of  banner ad.
