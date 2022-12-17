import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';

import { UnauthRootNavParams } from '../nav/types';
import { useAuthStore } from '../state/auth';
import { asyncHandler } from '../util';
import BaseLoginScreen from './base/BaseLoginScreen';

export default function ResetPasswordScreen({
    navigation,
}: NativeStackScreenProps<UnauthRootNavParams, 'ResetPasswordScreen'>) {
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
            fields={[{ icon: 'mail-outline', onChange: setEmail }]}
            submitButton={{
                text: 'Reset',
                callback: asyncHandler(submitReset, { prefix: 'Login failed' }),
            }}
            header={{
                title: 'Reset Password',
                subTitle: 'Please enter your email address to recieve further instructions.',
            }}
            footer={[
                {
                    text: 'Remebered?',
                    buttonText: 'Sign in',
                    callback: () => navigation.navigate('LoginScreen'),
                },
            ]}
        />
    );
}
