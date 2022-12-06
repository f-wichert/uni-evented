import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useContext, useState } from 'react';

import { RootNavigatorParams } from '../App';
import { AuthContext } from '../contexts/authContext';
import { asyncHandler } from '../util';
import BaseLoginScreen from './base/BaseLoginScreen';

type ComponentProps = NativeStackScreenProps<RootNavigatorParams, 'LoginScreen'>;

export default function LoginScreen({ navigation }: ComponentProps) {
    async function submitLogin() {
        // this automatically navigates to the main screen when the token gets set
        // TODO: require these to be non-empty in the UI
        await signin({ email: user || '', password: password || '' });
    }

    const { signin } = useContext(AuthContext);
    const [user, setUser] = useState<string | undefined>();
    const [password, setPassword] = useState<string | undefined>();

    return (
        <BaseLoginScreen
            fields={[
                { icon: 'person-outline', onChange: setUser },
                {
                    icon: 'lock-closed-outline',
                    onChange: setPassword,
                    textInputProps: { secureTextEntry: true },
                },
            ]}
            submitButton={{
                text: 'Login',
                callback: asyncHandler(submitLogin, { prefix: 'Login failed' }),
            }}
            header={{ title: 'Login', subTitle: 'Please sign in to continue.' }}
            footer={{
                text: "Don't have an account?",
                buttonText: 'Sign up',
                callback: () => navigation.navigate('RegisterScreen'),
            }}
        />
    );
}
