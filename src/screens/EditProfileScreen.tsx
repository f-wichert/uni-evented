import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, Keyboard, ScrollView, StyleSheet } from 'react-native';

import AvatarEditView from '../components/AvatarEditView';
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

export default function EditProfileScreen({ navigation }: ProfileStackNavProps<'EditProfile'>) {
    const currentUser = useCurrentUser();

    const [submitting, setSubmitting] = useState(false);

    const currentAvatarUrl = UserManager.getAvatarUrl(currentUser);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(currentAvatarUrl);
    // base64 representation for upload
    const [avatarData, setAvatarData] = useState<string | null>(null);
    // similar structure to `validate()` result
    const avatarResult = {
        error: false,
        changed: avatarUrl !== currentAvatarUrl,
        submitValue: avatarUrl !== currentAvatarUrl ? avatarData : undefined,
    };

    const [username, setUsername] = useState<string>(currentUser.username);
    const usernameResult = validate(username, currentUser.username, USERNAME_VALIDATION);

    const [displayName, setDisplayName] = useState<string>(currentUser.displayName);
    const displayNameResult = validate(
        displayName,
        currentUser.displayName,
        DISPLAYNAME_VALIDATION
    );

    const results = [avatarResult, usernameResult, displayNameResult];
    const hasChanged = results.some((r) => r.changed);
    const isValid = results.every((r) => !r.error);

    // no point in using `useCallback` here, since this would probably change every render anyway.
    const submit = async () => {
        // FIXME: this doesn't call `onBlur` in the textinput, which results in the text not being greyed out on submit
        Keyboard.dismiss();
        try {
            setSubmitting(true);
            await UserManager.editSelf({
                avatar: avatarResult.submitValue,
                username: usernameResult.submitValue,
                displayName: displayNameResult.submitValue,
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
            {/* avatar view */}
            <AvatarEditView
                avatarUrl={avatarUrl}
                setAvatarUrl={setAvatarUrl}
                setAvatarData={setAvatarData}
                style={styles.avatarContainer}
            />

            {/* inputs for other profile fields */}
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
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        paddingHorizontal: 16,
    },

    avatarContainer: {
        marginTop: 8,
        marginBottom: 16,
        marginHorizontal: '15%',
    },

    input: {
        marginBottom: 16,
    },
});
