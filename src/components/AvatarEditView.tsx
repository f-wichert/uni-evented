import { useActionSheet } from '@expo/react-native-action-sheet';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useCallback, useEffect } from 'react';
import { Image, StyleProp, StyleSheet, TouchableHighlight, View, ViewStyle } from 'react-native';

import CustomButton from '../components/Button';
import { UserManager } from '../models';
import { useCurrentUser } from '../state/user';
import { useAsyncCallback } from '../util';

// px, width and height
const AVATAR_SIZE = 100;

interface Props {
    avatarUrl: string | null;
    setAvatarUrl: (value: string | null) => void;
    setAvatarData: (value: string | null) => void;
    style?: StyleProp<ViewStyle>;
}

/**
 * Container for avatar view + edit button, including all image picker handling.
 * Used in Profile Edit screen.
 */
export default function AvatarEditView({ avatarUrl, setAvatarUrl, setAvatarData, style }: Props) {
    const { showActionSheetWithOptions } = useActionSheet();

    const currentUser = useCurrentUser();
    const currentAvatarUrl = UserManager.getAvatarUrl(currentUser);

    // update url in state once user's avatar changes
    useEffect(() => setAvatarUrl(currentAvatarUrl), [setAvatarUrl, currentAvatarUrl]);

    const pickAvatar = useAsyncCallback(
        async (useCamera: boolean) => {
            const pickerOptions: ImagePicker.ImagePickerOptions = {
                allowsEditing: true,
                aspect: [1, 1],
                base64: true,
            };

            let result: ImagePicker.ImagePickerResult;
            if (useCamera) {
                await ImagePicker.requestCameraPermissionsAsync();
                result = await ImagePicker.launchCameraAsync(pickerOptions);
            } else {
                await ImagePicker.requestMediaLibraryPermissionsAsync();
                result = await ImagePicker.launchImageLibraryAsync(pickerOptions);
            }

            const asset = result.assets?.pop();
            if (!asset || !asset.base64) {
                return;
            }

            setAvatarUrl(asset.uri);
            setAvatarData(asset.base64);
        },
        [setAvatarUrl, setAvatarData]
    );

    const editAvatar = useCallback(() => {
        const options = ['Take Photo', 'Choose Photo', 'Delete', 'Cancel'] as const;
        const takePhotoIndex = 0;
        const choosePhotoIndex = 1;
        const destructiveButtonIndex = 2;
        const cancelButtonIndex = 3;

        showActionSheetWithOptions(
            {
                options: [...options],
                cancelButtonIndex,
                destructiveButtonIndex,
                disabledButtonIndices: avatarUrl ? [] : [destructiveButtonIndex],
            },
            (index) => {
                switch (index) {
                    case takePhotoIndex:
                        pickAvatar(true);
                        break;
                    case choosePhotoIndex:
                        pickAvatar(false);
                        break;
                    case destructiveButtonIndex:
                        setAvatarUrl(null);
                        setAvatarData(null);
                        break;
                    case cancelButtonIndex:
                        break;
                }
            }
        );
    }, [showActionSheetWithOptions, pickAvatar, avatarUrl, setAvatarUrl, setAvatarData]);

    return (
        <View style={style}>
            <View style={styles.container}>
                <TouchableHighlight style={styles.avatar} onPress={editAvatar}>
                    {avatarUrl ? (
                        <Image
                            source={{ uri: avatarUrl, width: AVATAR_SIZE, height: AVATAR_SIZE }}
                        />
                    ) : (
                        <View style={styles.avatarEmpty}>
                            <Ionicons name="images" size={AVATAR_SIZE / 4} />
                        </View>
                    )}
                </TouchableHighlight>
                <CustomButton text="Edit" icon="create-outline" onPress={editAvatar} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatar: {
        marginRight: 16,
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
        borderRadius: AVATAR_SIZE / 2,
        overflow: 'hidden',
    },
    avatarEmpty: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'lightgrey',
    },
});
