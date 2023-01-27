import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import React, { ReactNode, useCallback, useEffect } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';

import yellowSplash from '../../assets/yellow_splash.png';
import ProfileHeader from '../components/ProfileHeader';
import ValueDisplay from '../components/ValueDisplay';
import { UserManager } from '../models';
import { CommonStackProps, ProfileStackNavProps } from '../nav/types';
import { useUserFetch } from '../state/user';

export default function UserProfileScreen({ navigation, route }: CommonStackProps<'UserProfile'>) {
    const showEdit = route.params.showEdit ?? false;
    const userId = route.params.userId;
    const { user, loading, refresh } = useUserFetch(userId);

    useFocusEffect(useCallback(() => void refresh(), [refresh]));

    // show edit header button if needed
    useEffect(() => {
        navigation.setOptions({
            headerRight: () =>
                showEdit ? (
                    <Ionicons
                        name="create-outline"
                        size={32}
                        color="black"
                        onPress={() =>
                            (navigation as ProfileStackNavProps['navigation']).navigate(
                                'EditProfile'
                            )
                        }
                    />
                ) : null,
        });
    }, [navigation, showEdit]);

    // show username in title
    const username = user?.username;
    useEffect(() => {
        navigation.setOptions({
            title: username ? `${username}'s Profile` : 'User Profile',
        });
    }, [navigation, username]);

    let mainView: ReactNode | null = null;
    if (user) {
        mainView = (
            <View>
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

                {user.bio ? (
                    <View style={styles.bio}>
                        <Text>{user.bio}</Text>
                    </View>
                ) : null}

                <View style={styles.values}>
                    <ValueDisplay value={12345} name="Following" />
                    <ValueDisplay value={9999999} name="Followers" />
                    <ValueDisplay value={3} name="Events" />
                </View>
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} />}
        >
            {mainView}
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

    bio: {
        marginHorizontal: '5%',
        marginTop: 10,
    },

    values: {
        borderRadius: 16,
        paddingVertical: 12,
        paddingHorizontal: 24,
        marginTop: 20,
        marginHorizontal: '15%',
        backgroundColor: '#f0f0f0',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});
