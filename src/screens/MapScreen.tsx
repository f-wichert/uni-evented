import Ionicons from '@expo/vector-icons/Ionicons';
import * as Location from 'expo-location';
import React, { useCallback, useEffect, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import MapView, { LatLng, Marker } from 'react-native-maps';

import { Event } from '../models';
import { TabNavProps } from '../nav/types';
import { asyncHandler, request } from '../util';

function MapScreen({ navigation }: TabNavProps<'Map'>) {
    const mapRef = React.useRef<MapView>(null);
    const [location, setLocation] = useState<LatLng | null>({
        latitude: 48.877616,
        longitude: 8.652653,
    });
    const [events, setEvents] = useState<Event[]>([]);

    const getCurrentPosition = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            throw new Error('Location access not granted');
        }

        const location = await Location.getCurrentPositionAsync();
        const latlng = { latitude: location.coords.latitude, longitude: location.coords.longitude };
        setLocation(latlng);

        mapRef.current?.animateCamera({
            center: latlng,
        });
    };

    const updateEventList = async () => {
        const eventList = await request('get', 'event/find');
        setEvents(eventList.events as unknown as Event[]);
    };

    useEffect(
        asyncHandler(async () => {
            navigation.setOptions({
                headerRight: () => (
                    <Ionicons
                        name="refresh-outline"
                        size={32}
                        color="black"
                        onPress={asyncHandler(updateEventList, {
                            prefix: 'Failed to update events',
                        })}
                        style={{
                            marginRight: 10,
                        }}
                    />
                ),
            });
            await Promise.all([updateEventList(), getCurrentPosition()]);
        }),
        [navigation]
    );

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
                    origin: 'Map',
                },
            });
        },
        [navigation]
    );

    return (
        <View style={styles.container}>
            {location ? (
                <MapView
                    initialRegion={{
                        latitude: location.latitude,
                        longitude: location.longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    }}
                    ref={mapRef}
                    showsUserLocation={true}
                    style={styles.map}
                >
                    <>
                        {events.map((el) => (
                            <Marker
                                key={el.id}
                                coordinate={{
                                    latitude: el.lat,
                                    longitude: el.lon,
                                }}
                                title={el.name}
                                pinColor="teal"
                                // TODO: this might re-render every time since the
                                // callback isn't memoized, not sure
                                onCalloutPress={() => {
                                    navigateDetail(el.id);
                                }}
                            />
                        ))}
                        {/* {events.map((el: any) => (
                            <EventMarker
                                key={el.id}
                                coordinate={{
                                    latitude: parseFloat(el.lat),
                                    longitude: parseFloat(el.lon),
                                }}
                                title={el.name}
                                pinColor="orange"
                                onCalloutPress={() => {console.log('Callout pressed')}}
                            />
                        ))} */}
                    </>
                </MapView>
            ) : null}
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
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    create: {
        position: 'absolute',
        bottom: 5,
        opacity: 0.75,
    },
    createEvent: {
        position: 'absolute',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        zIndex: 99,
    },
});

export default MapScreen;
