import { Image, StyleSheet, Text, View } from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';

interface Props {
    imageUri: string;
    displayName: string | null;
    username: string;
    fallbackImage?: number;
    onAvatarPress?: () => void;
}

export default function ProfileHeader({
    imageUri,
    displayName,
    username,
    fallbackImage,
    onAvatarPress,
}: Props) {
    const usernameFmt = `@${username}`;
    return (
        <View style={styles.container}>
            {/* TODO: profile pictures */}
            <TouchableHighlight style={styles.profilePicture} onPress={onAvatarPress}>
                <Image
                    style={styles.profilePicture}
                    source={{ uri: imageUri }}
                    defaultSource={fallbackImage}
                />
            </TouchableHighlight>
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
