import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useCallback, useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';

import EventPreview from '../components/EventPreview';
import { Event } from '../models/event';
import { EventListStackNavProps } from '../nav/types';
import { asyncHandler, request } from '../util';

type EventsData = {
    activeEvent: Event[];
    myEvents: Event[];
    followedEvents: Event[];
    followerEvents: Event[];
};

export default function EventListScreen({ navigation }: EventListStackNavProps<'EventList'>) {
    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Ionicons
                    name="add-outline"
                    size={32}
                    color="black"
                    onPress={() => navigation.navigate('CreateEvent')}
                    style={{
                        marginRight: 15,
                    }}
                />
            ),
        });
    }, [navigation]);

    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [events, setEvents] = useState<EventsData | null>(null);

    const fetchData = useCallback(async () => {
        setRefreshing(true);
        const data = await request('get', 'event/relevantEvents');
        setEvents(data as unknown as EventsData);
        setRefreshing(false);
    }, [navigation]);

    useEffect(asyncHandler(fetchData), []);

    const navigateDetail = useCallback(
        (id: string) => navigation.navigate('EventDetail', { eventId: id }),
        [navigation]
    );

    return (
        <View style={[styles.container]}>
            {/* <FlatList
                data={events}
                renderItem={({ item }) =>
                    <EventPreview
                        key={item.id}
                        name={item.name}
                        id={item.id}
                        navigateDetail={navigateDetail}
                    />}
                keyExtractor={(item) => item.id}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={fetchData} />
                }
            /> */}
            <ScrollView
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchData} />}
            >
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
