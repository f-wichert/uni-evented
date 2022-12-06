import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useContext, useState } from 'react';

import { RootNavigatorParams } from '../App';
import { AuthContext } from '../contexts/authContext';
import { asyncHandler } from '../util';
import BaseLoginScreen from './base/BaseLoginScreen';

type ComponentProps = NativeStackScreenProps<RootNavigatorParams, 'RegisterScreen'>;

export default function RegisterScreen({ navigation }: ComponentProps) {
    async function submitRegister() {
        // this automatically navigates to the main screen when the token gets set
        // TODO: require these to be non-empty in the UI
        await signup({ username: user || '', email: email || '', password: password || '' });
    }

    const { signup } = useContext(AuthContext);
    const [user, setUser] = useState<string | undefined>();
    const [email, setEmail] = useState<string | undefined>();
    // TODO: compare these two values before enabling submit button
    const [password, setPassword] = useState<string | undefined>();
    const [passwordCtrl, setPasswordCtrl] = useState<string | undefined>();

    return (
        <BaseLoginScreen
            fields={[
                { icon: 'person-outline', onChange: setUser },
                { icon: 'mail-outline', onChange: setEmail },
                {
                    icon: 'lock-closed-outline',
                    onChange: setPassword,
                    textInputProps: { secureTextEntry: true },
                },
                {
                    icon: 'lock-closed-sharp',
                    onChange: setPasswordCtrl,
                    textInputProps: { secureTextEntry: true },
                },
            ]}
            submitButton={{
                text: 'Register',
                callback: asyncHandler(submitRegister, { prefix: 'Registration failed' }),
            }}
            header={{ title: 'Register', subTitle: 'Please create an account to continue.' }}
            footer={{
                text: 'Already have an account?',
                buttonText: 'Login',
                callback: () => navigation.navigate('LoginScreen'),
            }}
        />
    );
}
