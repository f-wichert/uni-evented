import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import yellowSplash from '../../assets/yellow_splash.png';
import ProfileHeader from '../components/ProfileHeader';
import { UserManager } from '../models';
import { CommonStackProps } from '../nav/types';
import { useCurrentUser } from '../state/user';

export default function UserProfileScreen({ route }: CommonStackProps<'UserProfile'>) {
    const userId = route.params.userId;
    console.log(userId); // TODO: remove
    const user = useCurrentUser();

    return (
        <ScrollView style={styles.container}>
            <View style={styles.profileHeader}>
                <ProfileHeader
                    imageUri={UserManager.getAvatarUrl(user)}
                    displayName={user.displayName}
                    username={user.username}
                    // TODO: better fallback image
                    fallbackImage={yellowSplash}
                    compact
                />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },

    profileHeader: {
        marginLeft: 30,
    },
});
