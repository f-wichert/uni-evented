import * as e from 'envsafe';

export default (env: e.Environment, isBuild = false) => {
    // https://github.com/KATT/envsafe#basic-usage
    const spec = {
        NODE_ENV: e.str({
            choices: ['development', 'production'],
            // Set a placeholder at build time, since react-native sets it later at runtime;
            // we don't need to set this ourselves, we just want to parse the value later on
            default: 'production',
        }) as e.ValidatorSpec<'development' | 'production'>,
        BASE_URL: e.url({
            desc: 'The base API url',
            example: 'http://10.0.2.2:3000/api (Android Emulator)',
        }),
        NMS_HTTP_URL: e.url({
            desc: 'The NodeMediaServer http url',
            example: 'http://10.0.2.2:3001/',
        }),
        NMS_RTMP_URL: e.url({
            desc: 'The NodeMediaServer rtmp url',
            example: 'rtmp://10.0.2.2:3003/',
        }),
        ENABLE_STATE_DEBUG: e.bool({
            default: false,
            desc: 'Logs all state updates to console',
        }),
    };

    // At runtime, we expect these to be provided and don't want to set defaults
    if (!isBuild) {
        Object.values(spec).forEach((s) => {
            delete s.default;
            delete s.devDefault;
        });
    }

    return e.envsafe(spec, { env });
};
