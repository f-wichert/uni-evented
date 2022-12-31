import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useCallback, useEffect } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';

import EventPreview from '../components/EventPreview';
import { useRelevantEvents } from '../models/event';
import { EventListStackNavProps } from '../nav/types';
import { asyncHandler } from '../util';

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

    const { loading, value: events, refresh } = useRelevantEvents();

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
