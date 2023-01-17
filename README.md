# Evented - Frontend

## Description

Frontend for the Evented application using React Native and Expo.

## Usage

### Initial setup

1. Install node.js 18
2. Run `npm install`

### Expo Go

(generally easier to install, but does not support non-default native modules like livestreaming)

1. Run `npm run start`
2. Scan QR code

### Custom Build

(includes all required native modules, but isn't trivial)

1. Run `npm run native:install` to build and automatically install a debug build on a connected Android device/emulator
2. As long as native modules haven't changed, you may use `npm run native:start` for future runs, which is faster as it doesn't rebuild

## APK

To build a complete APK, use one of the following commands:

-   `npm run apk:development`: includes development client, see [Custom Build](#custom-build)
-   `npm run apk:production`: final non-debug build

The resulting APK will be output as `evented-dev.apk` or `evented.apk` respectively.  
([documentation](https://docs.expo.dev/build-reference/local-builds))
