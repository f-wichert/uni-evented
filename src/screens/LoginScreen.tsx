import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';

import { UnauthRootNavigatorParams } from '../App';
import { useAuthStore } from '../state/auth';
import { asyncHandler } from '../util';
import BaseLoginScreen from './base/BaseLoginScreen';

type ComponentProps = NativeStackScreenProps<UnauthRootNavigatorParams, 'LoginScreen'>;

export default function LoginScreen({ navigation }: ComponentProps) {
    async function submitLogin() {
        // this automatically navigates to the main screen when the token gets set
        // TODO: require these to be non-empty in the UI
        if (!validatdeInputs()) {
            return;
        }
        await signin({ username: user || '', password: password || '' });
    }

    function validatdeInputs(): boolean {
        if (user === '') {
            toast.show('Please enter a user name.', { type: 'normal' });
            return false;
        } else if (password === '') {
            toast.show('Please enter an email address.', { type: 'normal' });
            return false;
        }

        return true;
    }

    const signin = useAuthStore((state) => state.signin);
    const [user, setUser] = useState<string | undefined>('');
    const [password, setPassword] = useState<string | undefined>('');

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
            footer={[
                {
                    text: "Don't have an account?",
                    buttonText: 'Sign up',
                    callback: () => navigation.navigate('RegisterScreen'),
                },
                {
                    text: 'Forgot password?',
                    buttonText: 'Reset',
                    callback: () => navigation.navigate('ResetPasswordScreen'),
                },
            ]}
        />
    );
}
