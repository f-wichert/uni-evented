import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useCallback, useEffect } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';

import EventPreview from '../components/EventPreview';
import { EventListStackNavProps } from '../nav/types';
import { useRelevantEvents } from '../state/event';

export default function EventListScreen({ navigation }: EventListStackNavProps<'EventList'>) {
    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Ionicons
                    name="add-circle-outline"
                    size={40}
                    color="black"
                    onPress={() => navigation.navigate('CreateEvent')}
                />
            ),
        });
    }, [navigation]);

    const { loading, value: events, refresh } = useRelevantEvents();

    const navigateDetail = useCallback(
        (id: string) => navigation.navigate('EventDetail', { eventId: id }),
        [navigation]
    );

    return (
        <View style={[styles.container]}>
            <ScrollView
                refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} />}
            >
                <Text style={[styles.headerTitle]}>Active event</Text>
                {events?.activeEvent.map((id) => {
                    return <EventPreview key={id} id={id} navigateDetail={navigateDetail} />;
                })}
                <Text style={[styles.headerTitle]}>Your Events</Text>
                {events?.myEvents.map((id) => {
                    return <EventPreview key={id} id={id} navigateDetail={navigateDetail} />;
                })}
                <Text style={[styles.headerTitle]}>Followed Events</Text>
                {events?.followedEvents.map((id) => {
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
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        alignSelf: 'center',
        borderBottomColor: 'black',
        borderBottomWidth: 2,
    },
});
