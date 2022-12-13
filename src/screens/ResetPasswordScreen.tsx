import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useContext, useState } from 'react';

import { UnauthRootNavigatorParams } from '../App';
import { AuthContext } from '../contexts/authContext';
import { asyncHandler } from '../util';
import BaseLoginScreen from './base/BaseLoginScreen';

type ComponentProps = NativeStackScreenProps<UnauthRootNavigatorParams, 'ResetPasswordScreen'>;

export default function ResetPasswordScreen({ navigation }: ComponentProps) {
    async function submitLogin() {
        // this automatically navigates to the main screen when the token gets set
        // TODO: require these to be non-empty in the UI
        if (!validatdeInputs()) {
            return;
        }
        await signin({ email: user || '', password: password || '' });
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

    const { signin } = useContext(AuthContext);
    const [email, setEmail] = useState<string | undefined>('');

    return (
        <BaseLoginScreen
            fields={[
                { icon: 'mail-outline', onChange: setEmail },
            ]}
            submitButton={{
                text: 'Reset',
                callback: asyncHandler(submitLogin, { prefix: 'Login failed' }),
            }}
            header={{ title: 'Reset Password', subTitle: 'Please enter your email address. You will recieve a futher instructions.' }}
            footer={[{
                text: "Don't have an account?",
                buttonText: 'Sign up',
                callback: () => navigation.navigate('RegisterScreen'),
            }]}
        />
    );
}
