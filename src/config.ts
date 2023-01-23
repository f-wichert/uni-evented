import Constants from 'expo-constants';

import loadConfig from '../configStruct';

export const extra = Constants.expoConfig?.extra as
    | { config?: Record<string, string>; eas?: { projectId?: string } }
    | undefined;

const configData = extra?.config || {};

// parse config values from expo configuration at runtime, see `app.config.ts`
// (process.env should only contain `NODE_ENV`, set by react-native)
const config = loadConfig({ ...configData, ...process.env });
console.log('Loaded config:', config);

export default config;
