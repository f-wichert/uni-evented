import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import EventPreview from '../components/EventPreview';
import { Event } from '../models/event';
import { getToken } from '../state/auth';
import { asyncHandler, request } from '../util';
import { EventStackNavProps } from './EventScreenNavigator';

type EventsData = {
    activeEvent: Event[];
    myEvents: Event[];
    followedEvents: Event[];
    followerEvents: Event[];
};

function EventsScreen({ navigation }: EventStackNavProps<'EventsList'>) {
    const [events, setEvents] = useState<EventsData | null>(null);

    const fetchData = useCallback(async () => {
        const data = await request('get', 'event/relevantEvents', getToken());
        setEvents(data as unknown as EventsData);
    }, []);

    useEffect(asyncHandler(fetchData), []);

    const navigateDetail = useCallback(
        (id: string) => navigation.navigate('EventDetail', { eventId: id }),
        [navigation]
    );

    return (
        <View style={[styles.container]}>
            <Text style={[styles.headerTitle]}>Active event</Text>
            {events?.activeEvent.map((el: Event) => {
                return (
                    <EventPreview
                        key={el.id}
                        name={el.name}
                        id={el.id}
                        navigateDetail={navigateDetail}
                    />
                );
            })}
            <Text style={[styles.headerTitle]}>Your Events</Text>
            {events?.myEvents.map((el: Event) => {
                return (
                    <EventPreview
                        key={el.id}
                        name={el.name}
                        id={el.id}
                        navigateDetail={navigateDetail}
                    />
                );
            })}
            <Text style={[styles.headerTitle]}>Followed Events</Text>
            {events?.followedEvents.map((el: Event) => {
                return (
                    <EventPreview
                        key={el.id}
                        name={el.name}
                        id={el.id}
                        navigateDetail={navigateDetail}
                    />
                );
            })}
            <Ionicons
                name="refresh-outline"
                size={32}
                color="black"
                onPress={asyncHandler(fetchData, {
                    prefix: 'Failed to update events',
                })}
                style={{
                    marginTop: 'auto',
                    alignSelf: 'center',
                    marginBottom: 10,
                }}
            />
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

export default EventsScreen;
