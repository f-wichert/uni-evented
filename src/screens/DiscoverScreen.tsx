import Ionicons from '@expo/vector-icons/Ionicons';
import * as Location from 'expo-location';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LatLng } from 'react-native-maps';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import EventCarousel from '../components/EventCarousel';
import { Event, EventManager } from '../models';
import { DiscoverStackNavProps } from '../nav/types';
import { useAsyncCallback, useAsyncEffects } from '../util';

function DiscoverScreen({ navigation }: DiscoverStackNavProps<'DiscoverView'>) {
    // TODO: change this to use ExtendedMedia[] instead of Media[]
    const [eventData, setEventData] = useState<Event[]>([]);
    const [location, setLocation] = useState<LatLng | null>(null);

    useAsyncEffects(
        async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                throw new Error('Location access not granted');
            }
            await Promise.all([getLastKnownPosition(), getCurrentPosition()]);
        },
        [],
        { prefix: 'Failed to fetch location' }
    );

    const getLastKnownPosition = async () => {
        const location = await Location.getLastKnownPositionAsync();
        if (!location) return;
        const lastLocation = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
        };

        setLocation(lastLocation);
    };

    const getCurrentPosition = async () => {
        const location = await Location.getCurrentPositionAsync();
        const latlng = { latitude: location.coords.latitude, longitude: location.coords.longitude };
        setLocation(latlng);
    };

    const updateMedia = useAsyncCallback(
        async () => {
            // TODO: use `EventStore.eventMedia`
            if (!location) {
                // toast.show('Could not grab location');
                setEventData(await EventManager.fetchDiscoverData());
            } else {
                setEventData(await EventManager.fetchDiscoverData(location));
            }
        },
        [],
        { prefix: 'Failed to update media' }
    );

    const refreshLocation = async () => {
        toast.show('Refreshing location...', {
            duration: 1000,
            type: 'normal',
            placement: 'top',
        });
        await Promise.all([getLastKnownPosition(), getCurrentPosition()]);
    };

    // update once on load
    useEffect(updateMedia, [updateMedia]);

    useEffect(() => {
        // Use `setOptions` to update the button that we previously specified
        // Now the button includes an `onPress` handler to update the discoverData
        navigation.setOptions({
            headerRight: () => (
                <View
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignSelf: 'flex-end',
                        alignItems: 'center',
                    }}
                >
                    {location ? (
                        <Ionicons
                            name="location"
                            size={32}
                            color="orange"
                            onPress={refreshLocation}
                            style={{
                                marginRight: 10,
                            }}
                        />
                    ) : (
                        <Ionicons
                            name="location-outline"
                            size={32}
                            color="orange"
                            onPress={refreshLocation}
                            style={{
                                marginRight: 10,
                            }}
                        />
                    )}
                    {/* <Text style={location ? styles.locationAvailable : styles.locationNotAvailable}>
                        Location Available
                    </Text> */}
                    <Ionicons
                        name="refresh-outline"
                        size={32}
                        color="black"
                        onPress={updateMedia}
                        style={{
                            marginRight: 10,
                        }}
                    />
                </View>
            ),
        });
    }, [navigation, updateMedia]);

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
    locationNotAvailable: {
        backgroundColor: 'lightskyblue',
        padding: 5,
        marginRight: 11,
        borderRadius: 3,
        fontSize: 15,
    },
    locationAvailable: {
        backgroundColor: 'dodgerblue',
        padding: 5,
        marginRight: 11,
        borderRadius: 3,
        fontSize: 15,
    },
});

export default DiscoverScreen;
