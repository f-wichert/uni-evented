import React, { useState, useContext, useEffect, useRef } from 'react';
import { Alert, Button, Dimensions, StyleSheet, TextInput, View, Text, Platform, TouchableOpacity } from 'react-native';
import { Context as AuthContext } from '../contexts/authContext';
import MapView, { Marker } from 'react-native-maps';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Location from 'expo-location';

function MapScreen() {

    // Location State
    const [location, setLocation] = useState(null);
    const [locationReady, setLocationReady] = useState(false);

    useEffect(() => {
        (async () => {

            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            console.log(location);
            setLocation(location);
            setLocationReady(true);
        })();
    }, []);

    return (
        <View style={styles.container}>
            {locationReady ?
                <MapView
                    initialRegion={{ latitude: location.coords.latitude, longitude: location.coords.longitude, latitudeDelta: 0.01, longitudeDelta: 0.01 }}
                    style={styles.map}
                >
                    <Marker
                        key={1}
                        coordinate={{
                            latitude: location.coords.latitude,
                            longitude: location.coords.longitude,
                        }}
                        title='Your position'
                        description="That's where you currently are!"
                    />
                </MapView >
                : null
            }

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
});

export default MapScreen;
