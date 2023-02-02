import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useCallback, useEffect } from 'react';
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import EventPreview from '../components/EventPreview';
import { EventsOverviewStackNavProps } from '../nav/types';
import { useRelevantEvents } from '../state/event';

export default function EventsOverviewScreen({
    navigation,
}: EventsOverviewStackNavProps<'EventsOverview'>) {
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

    if (loading || !events) {
        return <ActivityIndicator />;
    }

    return (
        <View style={[styles.container]}>
            <ScrollView
                refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} />}
            >
                <View style={[styles.headerContainer, { borderBottomColor: 'red' }]}>
                    <Text style={styles.headerTitle}>Active event</Text>
                </View>
                {events?.currentEvent ? (
                    <EventPreview
                        id={events.currentEvent}
                        navigateDetail={navigateDetail}
                        filter={['scheduled', 'active']}
                    />
                ) : null}
                <View style={[styles.headerContainer, { borderBottomColor: 'orange' }]}>
                    <Text style={styles.headerTitle}>Your Events</Text>
                </View>
                {events?.hostedEvents.map((id) => {
                    return (
                        <EventPreview
                            key={id}
                            id={id}
                            navigateDetail={navigateDetail}
                            filter={['scheduled', 'active']}
                        />
                    );
                })}
                <View style={[styles.headerContainer, { borderBottomColor: 'purple' }]}>
                    <Text style={styles.headerTitle}>Followed Events</Text>
                </View>
                {events?.interestedEvents.map((id) => {
                    return (
                        <EventPreview
                            key={id}
                            id={id}
                            navigateDetail={navigateDetail}
                            filter={['scheduled', 'active']}
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
    headerContainer: {
        borderBottomColor: 'black',
        borderBottomWidth: 2,
        width: '100%',
        alignSelf: 'center',
        marginTop: 5,
        marginBottom: 5,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
