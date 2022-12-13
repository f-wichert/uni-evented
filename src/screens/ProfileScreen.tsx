import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Cell, Section, TableView } from 'react-native-tableview-simple';
import Button from '../components/Button';

import ProfileHeader from '../components/ProfileHeader';
import Separator from '../components/Separator';

import { useAuthStore, useCurrentUser } from '../state/auth';

export default function ProfileScreen() {
    const user = useCurrentUser();
    const signout = useAuthStore((state) => state.signout);

    return (
        <SafeAreaView>
            <View style={styles.profileHeader}>
                <ProfileHeader
                    imageUri="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=745&q=80"
                    displayName={user.displayName}
                    username={user.username}
                />
            </View>

            <Separator color="black" />
            <ScrollView style={styles.tableContainer}>
                <TableView style={styles.table}>
                    <Section>
                        <Cell title="Option 1" />
                        <Cell title="Option 2" />
                        <Cell title="Option 3" />
                        <Cell title="Option 4" />
                        <Cell title="Option 5" />
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
