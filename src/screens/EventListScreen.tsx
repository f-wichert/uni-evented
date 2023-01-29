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

    if (loading || !events) {
        return <ActivityIndicator />;
    }

    return (
        <View style={[styles.container]}>
            <ScrollView
                refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} />}
            >
                <Text style={{ ...styles.headerTitle, borderBottomColor: 'red' }}>
                    Active event
                </Text>
                {events?.activeEvent.map((id) => {
                    return (
                        <EventPreview
                            key={id}
                            id={id}
                            navigateDetail={navigateDetail}
                            filter={['scheduled', 'active']}
                        />
                    );
                })}
                <Text style={{ ...styles.headerTitle, borderBottomColor: 'orange' }}>
                    Your Events
                </Text>
                {events?.myEvents.map((id) => {
                    return (
                        <EventPreview
                            key={id}
                            id={id}
                            navigateDetail={navigateDetail}
                            filter={['scheduled', 'active']}
                        />
                    );
                })}
                <Text style={{ ...styles.headerTitle, borderBottomColor: 'purple' }}>
                    Followed Events
                </Text>
                {events?.followedEvents.map((id) => {
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
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        alignSelf: 'center',
        borderBottomColor: 'black',
        borderBottomWidth: 2,
        width: '100%',
        textAlign: 'center',
        marginTop: 5,
        marginBottom: 5,
    },
});
