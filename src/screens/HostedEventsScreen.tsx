import React, { useCallback } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import EventPreview from '../components/EventPreview';
import { ProfileStackNavProps } from '../nav/types';
import { useRelevantEvents } from '../state/event';

export default function HostedEventsScreen({ navigation }: ProfileStackNavProps<'HostedEvents'>) {
    const { loading, value: events, refresh } = useRelevantEvents();

    const navigateDetail = useCallback(
        (id: string) => {
            navigation.navigate('EventDetail', { eventId: id });
        },
        [navigation]
    );

    return (
        <View style={[styles.container]}>
            <ScrollView
                refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} />}
            >
                {events?.hostedEvents.map((id) => {
                    return <EventPreview key={id} id={id} navigateDetail={navigateDetail} />;
                })}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
    },
});
