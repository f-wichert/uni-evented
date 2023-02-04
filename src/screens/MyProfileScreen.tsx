import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useState } from 'react';
import { Alert, Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Cell, Section, TableView } from 'react-native-tableview-simple';

import yellowSplash from '../../assets/yellow_splash.png';
import ProfileHeader from '../components/ProfileHeader';
import Separator from '../components/Separator';
import TagDropdown from '../components/TagDropdown';
import { UserManager } from '../models';
import { ProfileStackNavProps } from '../nav/types';
import { useAuthStore } from '../state/auth';
import { useCurrentUser } from '../state/user';
import { EmptyObject, IoniconsName } from '../types';
import { request, useAsyncCallback } from '../util';

const width = Dimensions.get('window').width;

export default function MyProfileScreen({ navigation }: ProfileStackNavProps<'MyProfileView'>) {
    const user = useCurrentUser();
    const signout = useAuthStore((state) => state.signout);

    const currentFavouriteTags = user.favouriteTags.map((tag) => tag.id);
    const recommendationSettings = user.recommendationSettings;
    const [selectedTags, setSelectedTags] = useState<string[]>(currentFavouriteTags);

    const confirmLogout = useCallback(() => {
        Alert.alert('Confirm Logout', 'Are you sure that you want to log out?', [
            {
                text: 'Cancel',
                style: 'cancel',
            },
            { text: 'Confirm', style: 'destructive', onPress: signout },
        ]);
    }, [signout]);

    const onDropdownClose = useAsyncCallback(async () => {
        await request<EmptyObject>('POST', '/user/setFavouriteTags', {
            favouriteTags: selectedTags,
        });
    }, [selectedTags]);

    const getCellIcon = (name: IoniconsName, color?: string) => (
        <Ionicons name={name} size={27} color={color} />
    );

    return (
        <SafeAreaProvider style={styles.container}>
            <View style={styles.profileHeader}>
                <ProfileHeader
                    imageUri={UserManager.getAvatarUrl(user)}
                    displayName={user.displayName}
                    username={user.username}
                    // TODO: better fallback image
                    fallbackImage={yellowSplash}
                />
            </View>

            <Separator style={styles.separator} />
            <ScrollView style={styles.tableContainer} alwaysBounceVertical={false}>
                <TableView>
                    <Section>
                        <Cell
                            image={getCellIcon('person-circle-outline')}
                            title="My Profile"
                            accessory="DisclosureIndicator"
                            onPress={useCallback(() => {
                                navigation.navigate('UserProfile', {
                                    userId: user.id,
                                    showEdit: true,
                                });
                            }, [navigation, user.id])}
                        />
                        <Cell
                            image={getCellIcon('earth-outline')}
                            title="My Hosted Events"
                            accessory="DisclosureIndicator"
                            onPress={useCallback(() => {
                                navigation.navigate('UserEventList', { type: 'hostedEvents' });
                            }, [navigation])}
                        />
                        <Cell
                            image={getCellIcon('calendar-outline')}
                            // TODO: rename this? can't think of a better name
                            title="Interested Events"
                            accessory="DisclosureIndicator"
                            onPress={useCallback(() => {
                                navigation.navigate('UserEventList', { type: 'interestedEvents' });
                            }, [navigation])}
                        />
                        <Cell
                            image={getCellIcon('time-outline')}
                            title="Visited Events"
                            accessory="DisclosureIndicator"
                            onPress={useCallback(() => {
                                navigation.navigate('UserEventList', { type: 'pastEvents' });
                            }, [navigation])}
                        />
                    </Section>
                    {user.isAdmin && (
                        <Section sectionPaddingTop={0}>
                            <Cell
                                image={getCellIcon('construct-outline')}
                                title="Moderation"
                                accessory="DisclosureIndicator"
                                onPress={useCallback(() => {
                                    navigation.navigate('AdminMainScreen');
                                }, [navigation])}
                            />
                        </Section>
                    )}
                    <View style={styles.dropdownContainer}>
                        <TagDropdown
                            style={styles.dropdown}
                            selectedTags={selectedTags}
                            setSelectedTags={setSelectedTags}
                            onClose={onDropdownClose}
                            showBackground={true}
                            listMode="SCROLLVIEW"
                        />
                    </View>
                    <Section sectionPaddingTop={0}>
                        <Cell
                            image={getCellIcon('build-outline')}
                            title="Manage Account"
                            accessory="DisclosureIndicator"
                            onPress={useCallback(() => {
                                navigation.navigate('ManageAccount');
                            }, [navigation])}
                        />
                        <Cell
                            image={getCellIcon('calculator-outline')}
                            title="Manage Discover Feed"
                            accessory="DisclosureIndicator"
                            onPress={() => {
                                navigation.navigate('ManageDiscoverFeed', {
                                    currentRecommendationSettings: recommendationSettings,
                                });
                            }}
                        />
                        <Cell
                            image={getCellIcon('exit-outline', 'red')}
                            title="Logout"
                            onPress={confirmLogout}
                            titleTextColor="red"
                        />
                    </Section>
                </TableView>
            </ScrollView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    tableContainer: {
        width: '100%',
        height: '100%',
    },
    profileHeader: {
        marginTop: 40,
        marginBottom: 20,
        marginHorizontal: 20,
    },
    separator: {
        backgroundColor: 'black',
    },
    dropdown: {
        marginTop: 10,
        marginBottom: 10,
        width: 0.9 * width,
    },
    dropdownContainer: {
        paddingLeft: 15,
    },
});
