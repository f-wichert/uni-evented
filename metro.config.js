// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// ignore import cycles for `src/state/*.ts` files, since those are generally fine
config.resolver.requireCycleIgnorePatterns.push(/(^|\/)src\/state\/[^\/]+\.ts($|\/)/);

// exclude `node_modules/*/android` modules from fs watcher
config.resolver.blockList = [/(^|\/)node_modules\/[^\/]+\/android\//];

module.exports = config;
