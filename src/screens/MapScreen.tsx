import Ionicons from '@expo/vector-icons/Ionicons';
import * as Location from 'expo-location';
import React, { useCallback, useEffect, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import MapView, { LatLng } from 'react-native-maps';
import MapFilter from '../components/MapFilter';

import { LocationObject } from 'expo-location';
import EventMarker from '../components/EventMarker';
import { MapStackNavProps } from '../nav/types';
import { useFindEvents } from '../state/event';
import { asyncHandler } from '../util';
import EventDetailScreen from './EventDetailScreen';

function MapScreen({ navigation, route }: MapStackNavProps<'MapView'>) {
    const mapRef = React.useRef<MapView>(null);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    // console.log(`Selected Event: ${JSON.stringify(selectedEvent)}`);
    const [menuVisible, setMenuVisible] = useState<Boolean>(false);
    const [location, setLocation] = useState<LatLng | null>({
        latitude: 48.877616,
        longitude: 8.652653,
    });
    const { events, refresh } = useFindEvents();

    // Filter options
    const [showCurrentEvents, setShowCurrentEvents] = useState(true);
    const [currentDayRange, setCurrentDayRange] = useState(0);
    const [showFutureEvents, setShowFutureEvents] = useState(true);
    const [futureDayRange, setFutureDayRange] = useState(2);

    const updateCurrentRange = (up) => {
        setCurrentDayRange(up);
    };

    const updateFutureRange = (up) => {
        setFutureDayRange(up);
        setCurrentDayRange(up[0]);
    };

    const getLastKnownPosition = async () => {
        const { coords } =
            (await Location.getLastKnownPositionAsync()) as unknown as LocationObject;
        const lastLocation = { latitude: coords.latitude, longitude: coords.longitude };

        setLocation(lastLocation);

        mapRef.current?.animateCamera({
            center: lastLocation,
        });
    };

    const getCurrentPosition = async () => {
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
                                console.log('Value toggled.');
                                setMenuVisible((val) => !val);
                            }}
                            style={{
                                marginRight: 10,
                            }}
                        />
                    </View>
                ),
            });
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                throw new Error('Location access not granted');
            }
            getLastKnownPosition();
            await getCurrentPosition();
        }),
        [navigation]
    );

    const navigateDetail = useCallback(
        (id: string) => {
            navigation.navigate('EventDetail', { eventId: id });
        },
        [navigation]
    );

    // Credit to https://stackoverflow.com/questions/3224834/get-difference-between-2-dates-in-javascript
    function dateDiffInDays(a, b) {
        const _MS_PER_DAY = 1000 * 60 * 60 * 24;
        // Discard the time and time-zone information.
        const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
        const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

        return Math.floor(Math.abs(utc2 - utc1) / _MS_PER_DAY);
    }

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
                            {events.map((el) => {
                                let status = 'current';
                                // console.log(el.startDate);
                                const today = new Date(Date.now());
                                const date = new Date(el.startDate);
                                const diff = dateDiffInDays(date, today);

                                // Remove events that are not in our day range
                                if (diff <= currentDayRange) {
                                } else {
                                    return;
                                }

                                // Remove events that are completed
                                if (el.status == 'completed') {
                                    return;
                                }

                                // console.log(`Date: ${date} - Diff: ${diff} - Curr: ${currentDayRange} - Fut[1]: ${futureDayRange} => ${status}`);
                                // console.log(el.status);

                                return (
                                    <EventMarker
                                        key={el.id}
                                        coordinate={{
                                            latitude: el.lat,
                                            longitude: el.lon,
                                        }}
                                        title={el.name}
                                        // TODO: this might re-render every time since the
                                        // callback isn't memoized, not sure
                                        onCalloutPress={() => {
                                            navigateDetail(el.id);
                                        }}
                                        state={el.status}
                                    />
                                );
                            })}
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
                // <View style={styles.menuOverlay}>
                //     <Text>This might a menu someday!</Text>
                // </View>
                <MapFilter
                    showCurrentEvents={showCurrentEvents}
                    setShowCurrentEvents={setShowCurrentEvents}
                    currentDayRange={currentDayRange}
                    setCurrentDayRange={updateCurrentRange}
                    showFutureEvents={showFutureEvents}
                    setShowFutureEvents={updateFutureRange}
                    futureDayRange={futureDayRange}
                    setFutureDayRange={setFutureDayRange}
                    refresh={refresh}
                />
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
