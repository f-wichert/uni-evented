import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import EventCarousel from '../components/EventCarousel';
import { Event, EventManager } from '../models';
import { DiscoverStackNavProps } from '../nav/types';
import { asyncHandler } from '../util';

function DiscoverScreen({ navigation }: DiscoverStackNavProps<'DiscoverView'>) {
    useEffect(() => {
        // Use `setOptions` to update the button that we previously specified
        // Now the button includes an `onPress` handler to update the discoverData
        navigation.setOptions({
            headerRight: () => (
                <Ionicons
                    name="refresh-outline"
                    size={32}
                    color="black"
                    onPress={asyncHandler(updateMedia, { prefix: 'Failed to update media' })}
                    style={{
                        marginRight: 10,
                    }}
                />
            ),
        });
    }, [navigation]);

    useEffect(asyncHandler(updateMedia), []);

    // TODO: change this to use ExtendedMedia[] instead of Media[]
    const [eventData, setEventData] = useState<Event[]>([]);

    async function updateMedia() {
        // TODO: use `EventStore.eventMedia`
        setEventData(await EventManager.fetchDiscoverData());
    }
    const navigateDetail = useCallback(
        (id: string) => {
            navigation.navigate('EventDetail', { eventId: id });
        },
        [navigation]
    );

    return (
        <View style={styles.container}>
            {/* // wrap carousel in another safearea provider since the carousel
            // needs a pixel height and doesn't support `height: '100%'` */}
            <SafeAreaProvider>
                <GestureHandlerRootView>
                    <EventCarousel eventData={eventData} navigateDetail={navigateDetail} />
                </GestureHandlerRootView>
            </SafeAreaProvider>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default DiscoverScreen;
