import { Image, StyleSheet, Text, View } from 'react-native';
import yellowSplash from '../../assets/yellow_splash.png';

interface Props {
    imageUri: string;
    displayName: string | null;
    username: string;
}

export default function ProfileHeader({ imageUri, displayName, username }: Props) {
    const usernameFmt = `@${username}`;
    return (
        <View style={styles.container}>
            {/* TODO: profile pictures */}
            <Image
                style={styles.profilePicture}
                source={{ uri: imageUri }}
                // TODO: better placeholder
                defaultSource={yellowSplash}
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
