import Ionicons from '@expo/vector-icons/Ionicons';
import * as Location from 'expo-location';
import { LocationObject } from 'expo-location';
import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import { TabPropsFor } from '../nav/TabNavigator';
import { getToken } from '../state/auth';
import { asyncHandler, request } from '../util';

type ComponentProps = TabPropsFor<'Map'>;

function MapScreen({ navigation }: ComponentProps) {
    const mapRef = React.useRef<MapView>(null);
    const [location, setLocation] = useState<LocationObject | null>({
        coords: {
            latitude: 48.877616,
            longitude: 8.652653,
        },
    });
    // todo: fix types
    const [events, setEvents] = useState<any>([]);

    const getCurrentPosition = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            throw new Error('Location access not granted');
        }

        const location = await Location.getCurrentPositionAsync();
        setLocation(location);

        mapRef.current?.animateCamera({
            center: { latitude: location.coords.latitude, longitude: location.coords.longitude },
        });
    };

    const updateEventList = async () => {
        const eventList = await request('get', 'event/find', getToken());
        setEvents(eventList.events);
    };

    useEffect(
        asyncHandler(async () => {
            navigation.setOptions({
                headerRight: () => (
                    <Ionicons
                        name="refresh-outline"
                        size={32}
                        color="black"
                        onPress={asyncHandler(updateEventList, { prefix: 'Failed to update media' })}
                        style={{
                            marginRight: 10,
                        }}
                    />
                ),
            });
            updateEventList();
            await getCurrentPosition();
        }),
        [navigation]
    );

    return (
        <View style={styles.container}>
            {location ? (
                <MapView
                    initialRegion={{
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    }}
                    ref={mapRef}
                    showsUserLocation={true}
                    style={styles.map}
                >
                    <>
                        {events.map((el: any) => (
                            <Marker
                                key={el.id}
                                coordinate={{
                                    latitude: parseFloat(el.lat),
                                    longitude: parseFloat(el.lon),
                                }}
                                title={el.name}
                                pinColor="teal"
                            />
                        ))}
                    </>
                </MapView>
            ) : null}
            <TouchableOpacity style={[styles.create]} onPress={() => navigation.navigate('Create')}>
                <Ionicons name="add-circle-outline" size={64} color="black" />
            </TouchableOpacity>
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
