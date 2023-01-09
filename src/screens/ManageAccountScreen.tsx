import React, { useEffect, useState } from 'react';
import { Button, ScrollView, StyleSheet, Text } from 'react-native';

import FancyTextInput from '../components/FancyTextInput';
import { DISPLAYNAME_VALIDATION, USERNAME_VALIDATION } from '../constants';
import { ProfileStackNavProps } from '../nav/types';
import { useCurrentUser } from '../state/user';
import { validateString } from '../validate';

export default function ManageAccountScreen({ navigation }: ProfileStackNavProps<'ManageAccount'>) {
    const currentUser = useCurrentUser();

    const [username, setUsername] = useState<string>(currentUser.username);
    const usernameError =
        username !== currentUser.username && validateString(username, USERNAME_VALIDATION);

    const [displayName, setDisplayName] = useState<string>(currentUser.displayName);
    const displayNameError =
        displayName !== currentUser.displayName &&
        validateString(displayName, DISPLAYNAME_VALIDATION);

    const [email, setEmail] = useState<string>(currentUser.email);
    const emailError = email !== currentUser.email && validateString(email, { email: true });

    // TODO: surely this can be optimized :^)
    const hasChanged =
        username !== currentUser.username ||
        displayName !== currentUser.displayName ||
        email !== currentUser.email;
    const isValid = !usernameError && !displayNameError && !emailError;

    // set up save button
    useEffect(() => {
        navigation.setOptions({
            headerRight: () => {
                return <Button title="Save" color="green" disabled={!hasChanged || !isValid} />;
            },
        });
    }, [navigation, hasChanged, isValid]);

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Public Information</Text>
            <FancyTextInput
                title="Username"
                originalValue={currentUser.username}
                value={username}
                onChangeText={setUsername}
                validationError={usernameError}
                maxLength={USERNAME_VALIDATION.maxLength}
                textInputProps={{ autoCorrect: false }}
                style={styles.input}
            />
            <FancyTextInput
                title="Display name"
                originalValue={currentUser.displayName}
                value={displayName}
                onChangeText={setDisplayName}
                validationError={displayNameError}
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
                validationError={emailError}
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
