import * as e from 'envsafe';

export default (env: e.Environment, isBuild = false) => {
    if (isBuild) {
        // set a placeholder at build time, since react-native sets it later at runtime;
        // we don't need to set this ourselves, we just want to parse the value later on
        env = { ...env, NODE_ENV: 'development' };
    }

    // https://github.com/KATT/envsafe#basic-usage
    const obj = e.envsafe(
        {
            NODE_ENV: e.str({
                choices: ['development', 'production'],
            }) as e.ValidatorSpec<'development' | 'production'>,
            BASE_URL: e.url({
                desc: 'The base API url',
                example: 'http://10.0.2.2:3001/api (Android Emulator)',
            }),
        },
        { env }
    );
    return obj;
};
