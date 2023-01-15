import Ionicons from '@expo/vector-icons/Ionicons';
import * as Location from 'expo-location';
import React, { useCallback, useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import MapView, { LatLng, Marker } from 'react-native-maps';

import { TabNavProps } from '../nav/types';
import { useFindEvents } from '../state/event';
import { asyncHandler } from '../util';
import EventDetailScreen from './EventDetailScreen';

function MapScreen({ navigation, route }: TabNavProps<'Map'>) {
    const mapRef = React.useRef<MapView>(null);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    // console.log(`Selected Event: ${JSON.stringify(selectedEvent)}`);
    const [menuVisible, setMenuVisible] = useState<Boolean>(false);
    const [location, setLocation] = useState<LatLng | null>({
        latitude: 48.877616,
        longitude: 8.652653,
    });
    const { events, refresh } = useFindEvents();

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

    useEffect(
        asyncHandler(async () => {
            setMenuVisible(false);
            navigation.setOptions({
                headerRight: () => (
                    <View style={{ flexDirection: 'row' }}>
                        <Ionicons
                            name="refresh-outline"
                            size={32}
                            color="black"
                            onPress={refresh}
                            style={{
                                marginRight: 10,
                            }}
                        />
                        <Ionicons
                            name="menu-outline"
                            size={32}
                            color="black"
                            onPress={() => {
                                // TODO: herausfinden warum das hier funktioniert?
                                setMenuVisible((val) => !val);
                            }}
                            style={{
                                marginRight: 10,
                            }}
                        />
                    </View>
                ),
            });
            await getCurrentPosition();
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
        <>
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
                        onMarkerPress={(e) => {
                            const ev = events.filter((item) => {
                                // TODO: this could be done better, e.g. in a single statement, but I didn't quiet got it working
                                if (
                                    e.nativeEvent.coordinate.latitude == item.lat &&
                                    e.nativeEvent.coordinate.longitude == item.lon
                                ) {
                                    return true;
                                } else {
                                    return false;
                                }
                            });
                            setSelectedEvent(ev[0]);
                        }}
                        onPress={() => {
                            setSelectedEvent(null);
                        }}
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
                        </>
                    </MapView>
                ) : null}
            </View>
            {selectedEvent ? (
                <View style={styles.bottomOverlay}>
                    <EventDetailScreen
                        navigation={navigation}
                        route={route}
                        preview={true}
                        evId={selectedEvent.id}
                        orig={'Map'}
                    />
                </View>
            ) : (
                <></>
            )}
            {menuVisible == true ? (
                <View style={styles.menuOverlay}>
                    <Text>This might a menu someday!</Text>
                </View>
            ) : (
                <></>
            )}
        </>
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
    bottomOverlay: {
        backgroundColor: 'white',
        height: 190,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        justifyContent: 'center',
        elevation: 15,
        shadowColor: '#71717',
    },
    menuOverlay: {
        backgroundColor: 'red',
        width: '100%',
        height: 70,
        position: 'absolute',
        top: 0,
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
        elevation: 5,
        shadowColor: '#71717',
    },
});

export default MapScreen;
