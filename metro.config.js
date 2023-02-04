// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// ignore import cycles
config.resolver.requireCycleIgnorePatterns.push(/.*/);

// exclude `node_modules/*/android` modules from fs watcher
config.resolver.blockList = [/(^|\/)node_modules\/[^\/]+\/android\//];

module.exports = config;
