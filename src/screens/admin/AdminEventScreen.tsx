import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Cell, Section, TableView } from 'react-native-tableview-simple';

import { ProfileStackNavProps } from '../../nav/types';
import { asyncHandler, request } from '../../util';
import { confirmationAlert, getCellIcon } from './util';

export default function AdminEventScreen({
    navigation,
    route,
}: ProfileStackNavProps<'AdminEventScreen'>) {
    const [event, setEvent] = useState(route.params.event);

    const deleteEvent = () => {
        confirmationAlert(
            'Confirm Event Deletion',
            'Are you sure that you want to permanently delete this event?',
            asyncHandler(async () => {
                await request('POST', '/admin/event/delete', { eventId: event.id });
                navigation.goBack();
            })
        );
    };

    return (
        <SafeAreaProvider>
            <ScrollView style={styles.tableContainer} alwaysBounceVertical={false}>
                <TableView style={styles.table}>
                    <Section>
                        <Cell
                            image={getCellIcon('image-outline')}
                            title="Media"
                            accessory="DisclosureIndicator"
                            onPress={useCallback(() => {
                                navigation.push('AdminEventMediasScreen', {
                                    eventId: event.id,
                                });
                            }, [])}
                        />
                    </Section>
                    <Section>
                        <Cell
                            image={getCellIcon('trash-bin-outline', 'red')}
                            title="Delete Event"
                            accessory="DisclosureIndicator"
                            onPress={deleteEvent}
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
