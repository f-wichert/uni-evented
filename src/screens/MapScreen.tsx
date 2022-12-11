import Ionicons from '@expo/vector-icons/Ionicons';
import * as Location from 'expo-location';
import { LocationObject } from 'expo-location';
import React, { useContext, useEffect, useState } from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import { AuthContext } from '../contexts/authContext';
import { asyncHandler, request } from '../util';

function MapScreen({ navigation }) {
    const [location, setLocation] = useState<LocationObject | null>(null);
    const { state: authState } = useContext(AuthContext);
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
            const eventList = await request('get', 'event/find', authState.token);
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
                    style={styles.map}
                >
                    <>
                        <Marker
                            key={1}
                            coordinate={{
                                latitude: location.coords.latitude,
                                longitude: location.coords.longitude,
                            }}
                            title="Your position"
                            pinColor="orange"
                        />
                        {events.map((el: any) => (
                            <Marker
                                key={el.id}
                                coordinate={{
                                    latitude: el.lat,
                                    longitude: el.lon,
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
