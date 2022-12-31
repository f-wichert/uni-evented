import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import MediaCarousel from '../components/MediaCarousel';
import { Event, Media, MediaManager } from '../models';
import { TabNavProps } from '../nav/types';
import { getToken } from '../state/auth';
import { asyncHandler, request } from '../util';

function DiscoverScreen({ navigation }: TabNavProps<'Discover'>) {
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
        const responseData = await request('GET', 'discover/', getToken());
        const data = responseData.map((event: Event) => ({
            ...event,
            media: event.media?.map((el: Media) => ({ ...el, src: MediaManager.src(el, 'high') })),
        }));
        setEventData(data);
    }
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
                    origin: 'Discover',
                },
            });
        },
        [navigation]
    );

    return (
        <View style={styles.container}>
            {eventData.length == 0 ? (
                <View style={styles.sadContainer}>
                    <Ionicons name="sad-outline" size={50} color="black" style={styles.sadIcon} />
                    <Text style={styles.sadText}>Seems like there are no clips right now...</Text>
                </View>
            ) : (
                // wrap carousel in another safearea provider since the carousel
                // needs a pixel height and doesn't support `height: '100%'`
                <SafeAreaProvider>
                    <GestureHandlerRootView>
                        <MediaCarousel eventData={eventData} navigateDetail={navigateDetail} />
                    </GestureHandlerRootView>
                </SafeAreaProvider>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%',
    },
    sadContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    sadIcon: {
        marginBottom: 20,
    },
    sadText: {
        fontSize: 20,
    },
});

export default DiscoverScreen;
