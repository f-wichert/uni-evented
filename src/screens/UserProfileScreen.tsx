import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import yellowSplash from '../../assets/yellow_splash.png';
import ProfileHeader from '../components/ProfileHeader';
import ValueDisplay from '../components/ValueDisplay';
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

            <View style={styles.values}>
                <ValueDisplay value={12345} name="Following" />
                <ValueDisplay value={9999999} name="Followers" />
                <ValueDisplay value={3} name="Events" />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 8,
        backgroundColor: 'white',
    },

    profileHeader: {
        marginHorizontal: '5%',
    },

    values: {
        borderRadius: 16,
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginTop: 20,
        marginHorizontal: '15%',
        backgroundColor: '#f0f0f0',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});
