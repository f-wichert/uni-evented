import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import Image from 'react-native-image-progress';

interface Props {
    imageUri: string | null;
    username: string;
    displayName: string;
    fallbackImage?: number;
}

function BackgroundIndicator() {
    return (
        <View style={[styles.profilePicture, styles.profilePictureLoading]}>
            <ActivityIndicator size="large" />
        </View>
    );
}

export default function ProfileHeader({ imageUri, username, displayName, fallbackImage }: Props) {
    const usernameFmt = `@${username}`;
    return (
        <View style={styles.container}>
            <Image
                source={imageUri ? { uri: imageUri } : fallbackImage}
                style={styles.profilePicture}
                imageStyle={styles.profilePicture}
                indicator={BackgroundIndicator}
            />
            <View style={styles.nameContainer}>
                {/* Show display name first, if set */}
                <Text style={styles.titleText}>{displayName || usernameFmt}</Text>
                {/* Show smaller username below if there's a display name */}
                {displayName ? <Text style={styles.subTitleText}>{usernameFmt}</Text> : null}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    profilePicture: {
        width: 200,
        height: 200,
        borderRadius: 100,
    },
    profilePictureLoading: {
        backgroundColor: 'lightgrey',
        justifyContent: 'center',
        alignItems: 'center',
    },
    nameContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    titleText: {
        fontSize: 30,
        textAlign: 'center',
    },
    subTitleText: {
        fontSize: 18,
        color: '#888',
    },
});
