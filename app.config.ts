import { ExpoConfig } from 'expo/config';

import * as dotenv from 'dotenv';
dotenv.config();

// This is a bit funky, but generally expo supports app.config.ts with *basic* typescript features.
// It uses `sucrase` to transpile ts to js, essentially just stripping types and
// other ts features to create valid js, and runs that.
// Therefore, at this point here at runtime we wouldn't normally be able to import typescript modules.
// To support ts imports here, we use `sucrase` as well to register import hooks;
// `ts-node` would work too (and would be safer), however it's ~2x slower.
//
// tl;dr: this is required to load typescript files (namely `./configStruct`) here.
require('sucrase/register');

import loadConfig from './configStruct';
const extraConfig = loadConfig(process.env, true);

const config: ExpoConfig = {
    name: 'Evented',
    slug: 'Evented',
    owner: 'evented',
    version: '1.0.0',

    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    splash: {
        image: './assets/splash.png',
        resizeMode: 'contain',
        backgroundColor: '#ffffff',
    },
    updates: {
        fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ['**/*'],
    ios: {
        supportsTablet: true,
    },
    android: {
        adaptiveIcon: {
            foregroundImage: './assets/adaptive-icon.png',
            backgroundColor: '#FFFFFF',
        },
        package: 'com.evented.Evented',
    },
    web: {
        favicon: './assets/favicon.png',
    },
    extra: {
        config: extraConfig,
        eas: {
            projectId: '46fceaba-71dc-42a1-9cdc-93095b670ddc',
        },
    },
};

export default config;
