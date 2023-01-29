import React, { useCallback } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import EventPreview from '../components/EventPreview';
import { ProfileStackNavProps } from '../nav/types';
import { useRelevantEvents } from '../state/event';

export default function UserEventListScreen({
    navigation,
    route,
}: ProfileStackNavProps<'UserEventList'>) {
    const listType = route.params.type;
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
                {events?.[listType].map((id) => {
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
