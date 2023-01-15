import { Image, StyleSheet, Text, View } from 'react-native';

interface Props {
    imageUri: string | null;
    username: string;
    displayName: string;
    fallbackImage?: number;
}

export default function ProfileHeader({ imageUri, username, displayName, fallbackImage }: Props) {
    const usernameFmt = `@${username}`;
    return (
        <View style={styles.container}>
            <Image
                style={styles.profilePicture}
                source={{ uri: imageUri ?? undefined }}
                defaultSource={fallbackImage}
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
