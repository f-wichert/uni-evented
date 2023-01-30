import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Cell, Section, TableView } from 'react-native-tableview-simple';

import yellowSplash from '../../../assets/yellow_splash.png';
import ProfileHeader from '../../components/ProfileHeader';
import Separator from '../../components/Separator';
import { UserManager } from '../../models';
import { ProfileStackNavProps } from '../../nav/types';
import { asyncHandler, request } from '../../util';
import { confirmationAlert, getCellIcon } from './util';

export default function AdminUserScreen({
    navigation,
    route,
}: ProfileStackNavProps<'AdminUserScreen'>) {
    const [user, setUser] = useState(route.params.user);

    const clearAvatar = () => {
        confirmationAlert(
            'Confirm Avatar Deletion',
            'Are you sure that you want to clear this users avatar?',
            asyncHandler(async () => {
                await request('POST', '/admin/user/clear-avatar', { userId: user.id });
                setUser({ ...user, avatarHash: null });
            })
        );
    };
    const deleteUser = () => {
        confirmationAlert(
            'Confirm User Deletion',
            'Are you sure that you want to permanently delete this user?',
            asyncHandler(async () => {
                await request('POST', '/admin/user/delete', { userId: user.id });
                navigation.goBack();
            })
        );
    };

    return (
        <SafeAreaProvider>
            <View style={styles.profileHeader}>
                <ProfileHeader
                    imageUri={UserManager.getAvatarUrl(user)}
                    displayName={user.displayName}
                    username={user.username}
                    fallbackImage={yellowSplash}
                />
            </View>

            <Separator style={styles.separator} />
            <ScrollView style={styles.tableContainer} alwaysBounceVertical={false}>
                <TableView style={styles.table}>
                    <Section>
                        <Cell
                            image={getCellIcon('person-circle-outline', 'red')}
                            title="Clear Avatar"
                            accessory="DisclosureIndicator"
                            onPress={clearAvatar}
                        />
                        <Cell
                            image={getCellIcon('trash-bin-outline', 'red')}
                            title="Delete User"
                            accessory="DisclosureIndicator"
                            onPress={deleteUser}
                        />
                    </Section>
                </TableView>
            </ScrollView>
        </SafeAreaProvider>
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
    separator: {
        backgroundColor: 'black',
    },
});
