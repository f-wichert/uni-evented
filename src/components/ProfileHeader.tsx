import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import Image from 'react-native-image-progress';

import { mergeStyleSheets } from '../util';

// px, width and height
const AVATAR_SIZE = 200;
const AVATAR_COMPACT_FACTOR = 0.6;

interface Props {
    imageUri: string | null;
    username: string;
    displayName: string;
    fallbackImage?: number;
    compact?: boolean;
}

function BackgroundIndicator() {
    return (
        <View style={[styles.profilePicture, styles.profilePictureLoading]}>
            <ActivityIndicator size="large" />
        </View>
    );
}

export default function ProfileHeader({
    imageUri,
    username,
    displayName,
    fallbackImage,
    compact,
}: Props) {
    const _styles = compact ? compactStyles : styles;

    const usernameFmt = `@${username}`;

    return (
        <View style={_styles.container}>
            <Image
                source={imageUri ? { uri: imageUri } : fallbackImage}
                style={_styles.profilePicture}
                imageStyle={_styles.profilePicture}
                indicator={BackgroundIndicator}
            />
            <View style={_styles.nameContainer}>
                {/* Show display name first, if set */}
                <Text style={_styles.titleText}>{displayName || usernameFmt}</Text>
                {/* Show smaller username below if there's a display name */}
                {displayName ? <Text style={_styles.subTitleText}>{usernameFmt}</Text> : null}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    profilePicture: {
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
        borderRadius: AVATAR_SIZE / 2,
    },
    profilePictureLoading: {
        backgroundColor: 'lightgrey',
        justifyContent: 'center',
        alignItems: 'center',
    },
    nameContainer: {
        marginTop: 20,
        alignItems: 'center',
        flexShrink: 1,
    },
    titleText: {
        fontSize: 30,
        fontWeight: '600',
        textAlign: 'center',
    },
    subTitleText: {
        fontSize: 18,
        color: '#888',
    },
});

const compactStyles = mergeStyleSheets(styles, {
    container: {
        flexDirection: 'row',
    },
    profilePicture: {
        width: AVATAR_SIZE * AVATAR_COMPACT_FACTOR,
        height: AVATAR_SIZE * AVATAR_COMPACT_FACTOR,
        borderRadius: (AVATAR_SIZE / 2) * AVATAR_COMPACT_FACTOR,
    },
    nameContainer: {
        marginTop: 0,
        marginLeft: 20,
        alignItems: 'flex-start',
    },
    titleText: {
        fontSize: 24,
        textAlign: 'left',
    },
    subTitleText: {
        fontSize: 15,
    },
});
