import Constants from 'expo-constants';

import loadConfig from '../configStruct';

// extract `extra` field from config
export const extra = Constants.expoConfig?.extra as
    | { config?: Record<string, string>; eas?: { projectId?: string } }
    | undefined;

// compute full name like `@evented/Evented`
const { owner, slug } = Constants.expoConfig || {};
if (!owner || !slug) throw new Error(`expo config is missing 'owner' and 'slug' fields`);
export const fullName = `@${owner}/${slug}`;

// load config variables
const configData = extra?.config || {};

// parse config values from expo configuration at runtime, see `app.config.ts`
// (process.env should only contain `NODE_ENV`, set by react-native)
const config = loadConfig({ ...configData, ...process.env });
console.log('Loaded config:', config);

export default config;
