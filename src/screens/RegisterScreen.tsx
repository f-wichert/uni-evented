import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useContext, useState } from 'react';

import { UnauthRootNavigatorParams } from '../App';
import { AuthContext } from '../contexts/authContext';
import { asyncHandler } from '../util';
import BaseLoginScreen from './base/BaseLoginScreen';

type ComponentProps = NativeStackScreenProps<UnauthRootNavigatorParams, 'RegisterScreen'>;

export default function RegisterScreen({ navigation }: ComponentProps) {
    async function submitRegister() {
        // this automatically navigates to the main screen when the token gets set
        // TODO: require these to be non-empty in the UI
        if (!validatdeInputs()) {
            return;
        }
        await signup({ username: user || '', email: email || '', password: password || '' });
    }

    function validatdeInputs(): boolean {
        if (user === '') {
            toast.show('Please enter a user name.', { type: 'normal' });
            return false;
        } else if (email === '') {
            toast.show('Please enter an email address.', { type: 'normal' });
            return false;
        } else if (password === '') {
            toast.show('Please enter a password.', { type: 'normal' });
            return false;
        } else if (passwordCtrl === '') {
            toast.show('Please repeat your password', { type: 'normal' });
            return false;
        } else if (!(password === passwordCtrl)) {
            toast.show('The passwords do not match!', { type: 'normal' });
        }

        return true;
    }

    const { signup } = useContext(AuthContext);
    const [user, setUser] = useState<string | undefined>('');
    const [email, setEmail] = useState<string | undefined>('');
    // TODO: compare these two values before enabling submit button
    const [password, setPassword] = useState<string | undefined>('');
    const [passwordCtrl, setPasswordCtrl] = useState<string | undefined>('');

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
