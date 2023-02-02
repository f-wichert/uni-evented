import Ionicons from '@expo/vector-icons/Ionicons';
import dayjs from 'dayjs';
import * as Location from 'expo-location';
import { LocationObject } from 'expo-location';
import React, { useCallback, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import MapView, { LatLng } from 'react-native-maps';

import EventMarker from '../components/EventMarker';
import MapFilter from '../components/MapFilter';
import { Event } from '../models/event';
import { MapStackNavProps } from '../nav/types';
import { useFindEvents } from '../state/event';
import { useAsyncEffects } from '../util';
import EventDetailScreen from './EventDetailScreen';

function MapScreen({ navigation, route }: MapStackNavProps<'MapView'>) {
    const mapRef = React.useRef<MapView>(null);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [menuVisible, setMenuVisible] = useState<boolean>(false);
    const [location, setLocation] = useState<LatLng | null>({
        latitude: 48.877616,
        longitude: 8.652653,
    });
    const { events, refresh } = useFindEvents();

    // Filter options
    const [showPlannedEvents, setShowPlannedEvents] = useState(true);
    const [showCurrentEvents, setShowCurrentEvents] = useState(true);
    const [currentDayRange, setCurrentDayRange] = useState(2);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    // const [showFutureEvents, setShowFutureEvents] = useState(true);
    // const [futureDayRange, setFutureDayRange] = useState(2);

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

    useAsyncEffects(async () => {
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
        await Promise.all([getLastKnownPosition(), getCurrentPosition()]);
    }, [navigation, refresh]);

    const navigateDetail = useCallback(
        (id: string) => {
            navigation.navigate('EventDetail', { eventId: id });
        },
        [navigation]
    );

    function dateDiffInDays(a: Date, b: Date) {
        const aDay = dayjs(a).startOf('day');
        const bDay = dayjs(b).startOf('day');
        return aDay.diff(bDay, 'days');
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
                            const targetLat = e.nativeEvent.coordinate.latitude;
                            const targetLon = e.nativeEvent.coordinate.longitude;

                            const ev = events.find(
                                (item) => item.lat === targetLat && item.lon === targetLon
                            );
                            if (ev) setSelectedEvent(ev);
                        }}
                        onPress={() => {
                            setSelectedEvent(null);
                        }}
                    >
                        <>
                            {events.map((el) => {
                                // console.log('===');
                                // console.log(el);
                                // console.log(el.users?.length);
                                // console.log('===');

                                const diffDays = dateDiffInDays(el.startDate, new Date());

                                // Remove events that are not in our day range
                                if (diffDays > currentDayRange) {
                                    return;
                                }

                                // Remove events that are completed
                                if (el.status === 'completed') {
                                    return;
                                }

                                // Remove active events
                                if (el.status === 'active' && !showCurrentEvents) {
                                    return;
                                }

                                // Remove planned events
                                if (el.status === 'scheduled' && !showPlannedEvents) {
                                    return;
                                }

                                // Filter for tags - remove if the event has no tag from selectedTags
                                if (selectedTags.length >= 1) {
                                    const eventTags = el.tags.map((t) => t.id);
                                    let match = false;
                                    for (const tag of selectedTags) {
                                        if (eventTags.includes(tag)) {
                                            match = true;
                                        }
                                    }
                                    if (!match) {
                                        return;
                                    }
                                }

                                return (
                                    <EventMarker
                                        key={el.id}
                                        coordinate={{
                                            latitude: el.lat,
                                            longitude: el.lon,
                                        }}
                                        title={el.name}
                                        numPeople={el.users?.length || 0}
                                        livestream={!!el.livestream}
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
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        navigation={navigation}
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        route={route}
                        preview={true}
                        evId={selectedEvent.id}
                    />
                </View>
            ) : null}
            {menuVisible ? (
                <MapFilter
                    showPlannedEvents={showPlannedEvents}
                    setShowPlannedEvents={setShowPlannedEvents}
                    showCurrentEvents={showCurrentEvents}
                    setShowCurrentEvents={setShowCurrentEvents}
                    currentDayRange={currentDayRange}
                    setCurrentDayRange={setCurrentDayRange}
                    selectedTags={selectedTags}
                    setSelectedTags={setSelectedTags}
                />
            ) : null}
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
