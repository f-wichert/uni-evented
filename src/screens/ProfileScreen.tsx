import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Cell, Section, TableView } from 'react-native-tableview-simple';

import Button from '../components/Button';
import ProfileHeader from '../components/ProfileHeader';
import Separator from '../components/Separator';
import { useAuthStore, useCurrentUser } from '../state/auth';
import { IoniconsName } from '../types';

export default function ProfileScreen() {
    const user = useCurrentUser();
    const signout = useAuthStore((state) => state.signout);

    const getCellIcon = (name: IoniconsName) => <Ionicons name={name} size={27} />;

    return (
        <SafeAreaView>
            <View style={styles.profileHeader}>
                <ProfileHeader
                    imageUri="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=745&q=80"
                    displayName={user.displayName}
                    username={user.username}
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
                    </Section>
                </TableView>

                <View style={styles.logoutContainer}>
                    <Button text="Logout" onPress={signout} />
                </View>
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
