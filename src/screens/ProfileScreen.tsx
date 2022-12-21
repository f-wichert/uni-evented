import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useCallback } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Cell, Section, TableView } from 'react-native-tableview-simple';
import urlJoin from 'url-join';

import yellowSplash from '../../assets/yellow_splash.png';
import ProfileHeader from '../components/ProfileHeader';
import Separator from '../components/Separator';
import config from '../config';
import { getToken, useAuthStore, useCurrentUser } from '../state/auth';
import { IoniconsName } from '../types';
import { asyncHandler, request } from '../util';

export default function ProfileScreen() {
    const user = useCurrentUser();
    const signout = useAuthStore((state) => state.signout);

    const avatarUrl = urlJoin(config.BASE_URL, 'media', 'avatar', user.id, 'high.jpg');

    const confirmLogout = useCallback(() => {
        Alert.alert('Confirm Logout', 'Are you sure that you want to log out?', [
            {
                text: 'Cancel',
                style: 'cancel',
            },
            { text: 'Confirm', style: 'destructive', onPress: signout },
        ]);
    }, [signout]);

    const getCellIcon = (name: IoniconsName) => <Ionicons name={name} size={27} />;

    return (
        <SafeAreaView>
            <View style={styles.profileHeader}>
                <ProfileHeader
                    imageUri={avatarUrl}
                    displayName={user.displayName}
                    username={user.username}
                    // TODO: better fallback image
                    fallbackImage={yellowSplash}
                    onAvatarPress={asyncHandler(async () => {
                        const result = await ImagePicker.launchImageLibraryAsync({
                            allowsEditing: true,
                            aspect: [1, 1],
                        });

                        const asset = result.assets?.pop();
                        if (!asset) {
                            return;
                        }

                        const { uri, fileName } = asset;

                        const form = new FormData();
                        form.append('File', {
                            name: fileName ?? 'sample.dat',
                            uri: uri,
                        });

                        await request('POST', '/upload/avatar', getToken(), form);

                        // TODO: somehow force-update the avatar in the header
                    })}
                />
            </View>

            <Separator color="black" width="90%" />
            <ScrollView style={styles.tableContainer} alwaysBounceVertical={false}>
                <TableView style={styles.table}>
                    <Section>
                        <Cell
                            image={getCellIcon('person-circle-outline')}
                            title="Profile"
                            accessory="DisclosureIndicator"
                        />
                        <Cell
                            image={getCellIcon('earth-outline')}
                            title="My Events"
                            accessory="DisclosureIndicator"
                        />
                        <Cell
                            image={getCellIcon('time-outline')}
                            title="Visited Events"
                            accessory="DisclosureIndicator"
                        />
                    </Section>
                    <Section sectionPaddingTop={0}>
                        <Cell
                            image={getCellIcon('build-outline')}
                            title="Manage Account"
                            accessory="DisclosureIndicator"
                        />
                        <Cell
                            image={getCellIcon('exit-outline')}
                            title="Logout"
                            onPress={confirmLogout}
                        />
                    </Section>
                </TableView>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    tableContainer: {
        height: '100%',
    },
    table: {
        width: '100%',
    },
    profileHeader: {
        marginTop: 40,
        marginBottom: 20,
    },
    logoutContainer: {
        alignItems: 'center',
    },
});
