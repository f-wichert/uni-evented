import Constants from 'expo-constants';
import loadConfig from '../configStruct';

const extraData = Constants.expoConfig?.extra || {};

// parse config values from expo configuration at runtime, see `app.config.ts`
// (process.env should only contain `NODE_ENV`, set by react-native)
const config = loadConfig({ ...extraData, ...process.env });
console.log(`Loaded config: ${JSON.stringify(config)}`);

export default config;
