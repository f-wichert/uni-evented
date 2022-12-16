import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import EventPreview from '../components/EventPreview';
import { TabPropsFor } from '../nav/TabNavigator';
import { getToken } from '../state/auth';
import { asyncHandler, request } from '../util';

type ComponentProps = TabPropsFor<'Events'>;

type EventArray = {
    activeEvent: Event[];
    myEvents: Event[];
    followedEvents: Event[];
    followerEvents: Event[];
};

function EventsScreen({ navigation }: ComponentProps) {
    const [events, setEvents] = useState<EventArray>([]);
    const [eventsFetched, setEventsFetched] = useState(false);

    useEffect(
        asyncHandler(async () => {
            await fetchData();
        }),
        []
    );

    const fetchData = async () => {
        await request('get', 'event/relevantEvents', getToken()).then((data) => {
            setEvents(data);
            setEventsFetched(true);
        });
    };

    return (
        <View style={[styles.container]}>
            <Text style={[styles.headerTitle]}>Active event</Text>
            {eventsFetched &&
                events.activeEvent.map((el: Event) => {
                    return (
                        <EventPreview
                            key={el.id}
                            name={el.name}
                            id={el.id}
                            navigation={navigation}
                        />
                    );
                })}
            <Text style={[styles.headerTitle]}>Your Events</Text>
            {eventsFetched &&
                events.myEvents.map((el: Event) => {
                    return (
                        <EventPreview
                            key={el.id}
                            name={el.name}
                            id={el.id}
                            navigation={navigation}
                        />
                    );
                })}
            <Text style={[styles.headerTitle]}>Followed Events</Text>
            {eventsFetched &&
                events.followedEvents.map((el: Event) => {
                    return (
                        <EventPreview
                            key={el.id}
                            name={el.name}
                            id={el.id}
                            navigation={navigation}
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
