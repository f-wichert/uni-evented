import Ionicons from '@expo/vector-icons/Ionicons';
import * as Location from 'expo-location';
import { LocationObject } from 'expo-location';
import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import { useToken } from '../contexts/authContext';
import { TabPropsFor } from '../nav/TabNavigator';
import { asyncHandler, request } from '../util';

type ComponentProps = TabPropsFor<'Map'>;

function MapScreen({ navigation }: ComponentProps) {
    const [location, setLocation] = useState<LocationObject | null>({
        coords: {
            latitude: 49.877616,
            longitude: 8.652653
        },
    });
    const token = useToken();
    // todo: fix types
    const [events, setEvents] = useState<any>([]);

    const getCurrentPosition = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            throw new Error('Location access not granted');
        }

        const location = await Location.getCurrentPositionAsync();
        setLocation(location);
    };

    useEffect(
        asyncHandler(async () => {
            const eventList = await request('get', 'event/find', token);
            setEvents(eventList.events);
            await getCurrentPosition();
        }),
        []
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
            <TouchableOpacity
                style={[styles.create]}
                onPress={() => navigation.navigate('CreateEventScreen')}
            >
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
