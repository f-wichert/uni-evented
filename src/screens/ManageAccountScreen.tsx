import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, Keyboard, ScrollView, StyleSheet, Text } from 'react-native';

import FancyTextInput from '../components/FancyTextInput';
import { DISPLAYNAME_VALIDATION, USERNAME_VALIDATION } from '../constants';
import { UserManager } from '../models';
import { ProfileStackNavProps } from '../nav/types';
import { useCurrentUser } from '../state/user';
import { handleError } from '../util';
import { StringValidateOptions, validateString } from '../validate';

function validate(value: string, original: string, opts: StringValidateOptions) {
    const changed = value !== original;
    return {
        error: validateString(value, opts),
        changed: changed,
        submitValue: changed ? value : undefined,
    };
}

export default function ManageAccountScreen({ navigation }: ProfileStackNavProps<'ManageAccount'>) {
    const currentUser = useCurrentUser();

    const [submitting, setSubmitting] = useState(false);

    const [username, setUsername] = useState<string>(currentUser.username);
    const usernameResult = validate(username, currentUser.username, USERNAME_VALIDATION);

    const [displayName, setDisplayName] = useState<string>(currentUser.displayName);
    const displayNameResult = validate(
        displayName,
        currentUser.displayName,
        DISPLAYNAME_VALIDATION
    );

    const [email, setEmail] = useState<string>(currentUser.email);
    const emailResult = validate(email, currentUser.email, { email: true });

    const results = [usernameResult, displayNameResult, emailResult];
    const hasChanged = results.some((r) => r.changed);
    const isValid = results.every((r) => !r.error);

    // no point in using `useCallback` here, since this would probably change every render anyway.
    const submit = async () => {
        // FIXME: this doesn't call `onBlur` in the textinput, which results in the text not being greyed out on submit
        Keyboard.dismiss();
        try {
            setSubmitting(true);
            await UserManager.editSelf({
                username: usernameResult.submitValue,
                displayName: displayNameResult.submitValue,
                email: emailResult.submitValue,
            });
        } catch (e) {
            handleError(e, { prefix: 'Failed to update profile' });
        } finally {
            setSubmitting(false);
        }
    };

    // set up save button (see above as to why this doesn't specify dependencies)
    useEffect(() => {
        navigation.setOptions({
            headerRight: () => {
                if (submitting) return <ActivityIndicator />;
                return (
                    <Button
                        title="Save"
                        color="green"
                        disabled={!hasChanged || !isValid}
                        onPress={() => void submit()}
                    />
                );
            },
        });
    });

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Public Information</Text>
            <FancyTextInput
                title="Username"
                originalValue={currentUser.username}
                value={username}
                onChangeText={setUsername}
                validationError={usernameResult.error}
                maxLength={USERNAME_VALIDATION.maxLength}
                textInputProps={{ autoCorrect: false }}
                style={styles.input}
            />
            <FancyTextInput
                title="Display name"
                originalValue={currentUser.displayName}
                value={displayName}
                onChangeText={setDisplayName}
                validationError={displayNameResult.error}
                maxLength={DISPLAYNAME_VALIDATION.maxLength}
                textInputProps={{ autoCorrect: false }}
                style={styles.input}
            />

            <Text style={styles.header}>Account Data</Text>
            <FancyTextInput
                title="Email"
                originalValue={currentUser.email}
                value={email}
                onChangeText={setEmail}
                validationError={emailResult.error}
                textInputProps={{ autoCorrect: false, keyboardType: 'email-address' }}
                style={styles.input}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        gap: 20,
    },
    header: {
        textTransform: 'uppercase',
        marginTop: 16,
        marginBottom: 8,
    },
    input: {
        marginBottom: 16,
    },
});
