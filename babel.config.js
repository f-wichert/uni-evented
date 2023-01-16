module.exports = function (api) {
    api.cache(true);
    const presets = ['babel-preset-expo'];
    const plugins = [
        'react-native-reanimated/plugin',
        // emulator needs this for some reason, otherwise it throws around random syntax errors
        '@babel/plugin-proposal-logical-assignment-operators',
    ];
    return {
        presets,
        plugins,
    };
};
