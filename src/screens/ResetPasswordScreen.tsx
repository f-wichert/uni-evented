import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useContext, useState } from 'react';

import { UnauthRootNavigatorParams } from '../App';
import { asyncHandler } from '../util';
import BaseLoginScreen from './base/BaseLoginScreen';
import { useAuthStore } from '../state/auth';

type ComponentProps = NativeStackScreenProps<UnauthRootNavigatorParams, 'ResetPasswordScreen'>;

export default function ResetPasswordScreen({ navigation }: ComponentProps) {
    async function submitReset() {
        // this automatically navigates to the main screen when the token gets set
        // TODO: require these to be non-empty in the UI
        if (!validatdeInputs()) {
            return;
        }
        await reset({ email: email || '' });
    }

    function validatdeInputs(): boolean {
        if (email === '') {
            toast.show('Please enter an email address.', { type: 'normal' });
            return false;
        } 

        return true;
    }

    const reset = useAuthStore((state) => state.reset);
    const [email, setEmail] = useState<string | undefined>('');

    return (
        <BaseLoginScreen
            fields={[
                { icon: 'mail-outline', onChange: setEmail },
            ]}
            submitButton={{
                text: 'Reset',
                callback: asyncHandler(submitReset, { prefix: 'Login failed' }),
            }}
            header={{ title: 'Reset Password', subTitle: 'Please enter your email address. You will recieve a futher instructions.' }}
            footer={[{
                text: "Remebered?",
                buttonText: 'Sign in',
                callback: () => navigation.navigate('LoginScreen'),
            }]}
        />
    );
}
