// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// ignore import cycles for `src/state/*.ts` files, since those are generally fine
config.resolver.requireCycleIgnorePatterns.push(/(^|\/|\\)src[/\\]state[/\\][^/\\]+\.ts($|\/|\\)/);

module.exports = config;
