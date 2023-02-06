import * as Location from 'expo-location';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { LatLng, Marker } from 'react-native-maps';
import { GOOGLE_MAPS_STYLE } from '../constants';

import { EventsOverviewStackNavProps } from '../nav/types';
import { useAsyncEffects } from '../util';

export default function MapPickerScreen({
    route,
    navigation,
}: EventsOverviewStackNavProps<'MapPicker'>) {
    const mapRef = React.useRef<MapView>(null);
    // TODO: remove placeholder values
    const [location, setLocation] = useState<LatLng>({
        latitude: 48.877616,
        longitude: 8.652653,
    });
    const [pickedLocation, setPickedLocation] = useState<LatLng>({
        latitude: 48.877616,
        longitude: 8.652653,
    });

    useAsyncEffects(async () => {
        await getCurrentPosition();
        // TODO: add repeating location checks and updates. This might also be implemented in MapScreen
        // Location.watchPositionAsync({
        //     accuracy: Location.Accuracy.Balanced,
        //     timeInterval: 2000
        // }, (loc) => {setLocation(loc);})
    }, []);

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

    const pickLocation = () => {
        if (route.params && route.params!.parent) {
            navigation.navigate('EventDetailEdit', {
                location: pickedLocation,
                eventId: route.params.eventId,
            });
        } else {
            navigation.navigate('CreateEvent', { location: pickedLocation });
        }
    };

    return (
        <View style={styles.container}>
            <MapView
                customMapStyle={GOOGLE_MAPS_STYLE}
                style={styles.map}
                // ref={(ref) => mapRef.current = current}
                ref={mapRef}
                showsUserLocation={true}
                initialRegion={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
            >
                <Marker
                    key={1}
                    coordinate={{
                        latitude: location.latitude,
                        longitude: location.longitude,
                    }}
                    title="Your party location"
                    pinColor="orange"
                    draggable
                    onDragEnd={(e) => {
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
