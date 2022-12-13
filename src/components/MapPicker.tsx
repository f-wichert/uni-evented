import * as Location from 'expo-location';
import { LocationObject } from 'expo-location';
import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { LatLng, Marker } from 'react-native-maps';
import { AuthContext } from '../contexts/authContext';
import { asyncHandler } from '../util';

MapPicker.propTypes = {};

export default function MapPicker({ route, navigation }) {
    const { returnLocation } = route.params;
    const mapRef = React.useRef<MapView>(null);
    const { state: authState } = useContext(AuthContext);
    const [location, setLocation] = useState<LocationObject | null>({
        coords: {
            latitude: 48.877616,
            longitude: 8.652653,
        },
    });
    const [pickedLocation, setPickedLocation] = useState<LatLng | null>({
        latitude: 48.877616,
        longitude: 8.652653,
    });

    useEffect(
        asyncHandler(async () => {
            // const eventList = await request('get', 'event/find', authState.token);
            // setEvents(eventList.events);
            await getCurrentPosition();
            // TODO: add repeating location checks and updates. This might also be implemented in MapScreen
            // Location.watchPositionAsync({
            //     accuracy: Location.Accuracy.Balanced,
            //     timeInterval: 2000
            // }, (loc) => {setLocation(loc);})
        }),
        []
    );

    const getCurrentPosition = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            throw new Error('Location access not granted');
        }
        const location = await Location.getCurrentPositionAsync();

        setLocation(location);
        mapRef.current.animateCamera({
            center: { latitude: location.coords.latitude, longitude: location.coords.longitude },
        });
    };

    const pickLocation = () => {
        returnLocation(pickedLocation);
        navigation.navigate('CreateEvent');
    };

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                // ref={(ref) => mapRef.current = current}
                ref={mapRef}
                showsUserLocation={true}
                initialRegion={{
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
            >
                <Marker
                    key={1}
                    coordinate={{
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                    }}
                    title="Your party location"
                    pinColor="orange"
                    draggable
                    onDragEnd={(e) => {
                        console.log('dragEnd', e.nativeEvent.coordinate);
                        setPickedLocation(e.nativeEvent.coordinate);
                    }}
                />
            </MapView>

            <TouchableOpacity style={styles.pickLocation} onPress={pickLocation}>
                <Text style={styles.pickLocationText}>Pick Location</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    map: {
        width: '100%',
        height: '100%',
        // width: Dimensions.get('window').width,
        // height: Dimensions.get('window').height,
    },
    pickLocation: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: '3%',
        // opacity: 0.75,
        zIndex: 99,
        backgroundColor: 'orange',
        width: '80%',
        height: '8.5d%',
        borderRadius: 10,
    },
    pickLocationText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});
