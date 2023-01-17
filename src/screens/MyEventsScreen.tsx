import React, { useCallback } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import EventPreview from '../components/EventPreview';
import { ProfileStackNavProps } from '../nav/types';
import { useRelevantEvents } from '../state/event';

export default function MyEventsScreen({ navigation }: ProfileStackNavProps<'MyEvents'>) {
    const { loading, value: events, refresh } = useRelevantEvents();

    const navigateDetail = useCallback(
        (id: string) => {
            // TODO: pretty sure this error can be fixed using this? https://javascript.plainenglish.io/react-navigation-v6-with-typescript-nested-navigation-part-2-87844f643e37
            // this shit is confusing af, send help
            // same error in EventDetailScreen

            // need to transition to another navigator here
            navigation.navigate('Events', {
                // captain, we're going deep
                screen: 'EventDetail',
                params: {
                    eventId: id,
                    origin: 'MyEvents',
                },
            });
        },
        [navigation]
    );

    return (
        <View style={[styles.container]}>
            <ScrollView
                refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} />}
            >
                {events?.myEvents.map((id) => {
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
