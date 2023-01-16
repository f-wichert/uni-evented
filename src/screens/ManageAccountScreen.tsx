import React, { useCallback, useState } from 'react';
import { Keyboard, ScrollView, StyleSheet, Text, View } from 'react-native';

import CustomButton from '../components/Button';
import FancyTextInput from '../components/FancyTextInput';
import Separator from '../components/Separator';
import { PASSWORD_VALIDATION } from '../constants';
import { UserManager } from '../models';
import { useCurrentUser } from '../state/user';
import { handleError } from '../util';
import { StringValidateOptions, validateString } from '../validate';

interface ButtonProps {
    disabled: boolean;
    params: Parameters<typeof UserManager.editSelf>[0];
    onSubmit?: () => void;
}

function SaveButton({ disabled, params, onSubmit }: ButtonProps) {
    const [submitting, setSubmitting] = useState(false);

    const submit = async () => {
        Keyboard.dismiss();
        try {
            setSubmitting(true);
            await UserManager.editSelf(params);
            onSubmit?.();
        } catch (e) {
            handleError(e, { prefix: 'Failed to update data' });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <View style={styles.buttonContainer}>
            <CustomButton
                text="Save"
                onPress={() => void submit()}
                disabled={disabled}
                loading={submitting}
            />
        </View>
    );
}

function validate(value: string, original: string, opts: StringValidateOptions) {
    const error = validateString(value, opts);
    return {
        error: error,
        isSubmitValid: value !== original && !error,
    };
}

export default function ManageAccountScreen() {
    const currentUser = useCurrentUser();

    const [email, setEmail] = useState<string>(currentUser.email);
    const emailResult = validate(email, currentUser.email, { email: true });

    const [password, setPassword] = useState<string>('');
    const [passwordConfirm, setPasswordConfirm] = useState<string>('');
    const passwordResult = validate(password, '', PASSWORD_VALIDATION);
    const passwordConfirmResult = validate(passwordConfirm, '', { equals: password });

    return (
        <ScrollView style={styles.container}>
            {/* email */}
            <Text style={styles.header}>Email</Text>
            <FancyTextInput
                title="Email"
                originalValue={currentUser.email}
                value={email}
                onChangeText={setEmail}
                validationError={emailResult.error}
                textInputProps={{ autoCorrect: false, keyboardType: 'email-address' }}
                style={styles.input}
            />
            <SaveButton disabled={!emailResult.isSubmitValid} params={{ email: email }} />
            <Separator style={styles.separator} />

            {/* password */}
            <Text style={styles.header}>Change Password</Text>
            <FancyTextInput
                title="Password"
                value={password}
                originalValue=""
                onChangeText={setPassword}
                // only show error if not empty, to avoid showing minLength error right after opening screen
                validationError={password ? passwordResult.error : null}
                maxLength={PASSWORD_VALIDATION.maxLength}
                textInputProps={{ secureTextEntry: true }}
                style={styles.input}
            />
            <FancyTextInput
                title="Confirm Password"
                value={passwordConfirm}
                originalValue=""
                onChangeText={setPasswordConfirm}
                validationError={passwordConfirmResult.error}
                textInputProps={{ secureTextEntry: true }}
                style={styles.input}
            />
            <SaveButton
                disabled={!passwordResult.isSubmitValid || !passwordConfirmResult.isSubmitValid}
                params={{ password: password }}
                // clear password fields once submitted successfully
                onSubmit={useCallback(() => {
                    setPassword('');
                    setPasswordConfirm('');
                }, [])}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        paddingHorizontal: 16,
    },
    header: {
        textTransform: 'uppercase',
        marginVertical: 8,
    },

    input: {
        marginBottom: 8,
    },
    buttonContainer: {
        alignItems: 'flex-end',
    },
    separator: {
        marginVertical: 16,
    },
});
