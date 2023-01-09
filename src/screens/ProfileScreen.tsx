import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useCallback } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Cell, Section, TableView } from 'react-native-tableview-simple';

import yellowSplash from '../../assets/yellow_splash.png';
import ProfileHeader from '../components/ProfileHeader';
import Separator from '../components/Separator';
import { UserManager } from '../models';
import { ProfileStackNavProps } from '../nav/types';
import { useAuthStore } from '../state/auth';
import { useCurrentUser } from '../state/user';
import { IoniconsName } from '../types';
import { asyncHandler } from '../util';

export default function ProfileScreen({ navigation }: ProfileStackNavProps<'ProfileView'>) {
    const user = useCurrentUser();
    const signout = useAuthStore((state) => state.signout);

    const confirmLogout = useCallback(() => {
        Alert.alert('Confirm Logout', 'Are you sure that you want to log out?', [
            {
                text: 'Cancel',
                style: 'cancel',
            },
            { text: 'Confirm', style: 'destructive', onPress: signout },
        ]);
    }, [signout]);

    const getCellIcon = (name: IoniconsName, color?: string) => (
        <Ionicons name={name} size={27} color={color} />
    );

    return (
        <SafeAreaView>
            <View style={styles.profileHeader}>
                <ProfileHeader
                    imageUri={UserManager.getAvatarUrl(user)}
                    displayName={user.displayName}
                    username={user.username}
                    // TODO: better fallback image
                    fallbackImage={yellowSplash}
                    onAvatarPress={asyncHandler(async () => {
                        const result = await ImagePicker.launchImageLibraryAsync({
                            allowsEditing: true,
                            aspect: [1, 1],
                            base64: true,
                        });

                        const asset = result.assets?.pop();
                        if (!asset || !asset.base64) {
                            return;
                        }

                        await UserManager.editSelf({ avatar: asset.base64 });
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
                            onPress={useCallback(() => {
                                navigation.navigate('MyEvents');
                            }, [navigation])}
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
                            onPress={useCallback(() => {
                                navigation.navigate('ManageAccount');
                            }, [navigation])}
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
