import Ionicons from '@expo/vector-icons/Ionicons';
import * as Location from 'expo-location';
import React, { useCallback, useEffect, useState } from 'react';
import { Image, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MapView, { LatLng, Marker } from 'react-native-maps';
import { Rating } from 'react-native-ratings';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useFocusEffect } from '@react-navigation/native';
import MediaCarousel from '../components/MediaCarousel';
import { Tag } from '../components/Tag';
import { EventManager } from '../models';
import { EventDetailProps } from '../nav/types';
import { useEventFetch, useEventStore } from '../state/event';
import { useCurrentUser } from '../state/user';
import { asyncHandler } from '../util';

interface Props extends EventDetailProps<'EventDetail'> {
    preview?: boolean;
    evId?: string;
}

function EventDetailScreen({ route, navigation, preview, evId }: Props) {
    const eventId = evId ? evId : route.params.eventId;
    const { event: eventData, loading, refresh } = useEventFetch(eventId);
    const user = useCurrentUser();
    const userCurrentEventId = useEventStore((state) => state.currentEventId); // Get event ID of current event of currently logged in user

    // MediaCarousel
    const [isPlay, setIsPlay] = useState<boolean>(true);
    const [isMute, setIsMute] = useState<boolean>(true);
    const [isOpenQuality, setIsOpenQuality] = useState<boolean>(false);
    const [quality, setQuality] = useState<'auto' | '1080' | '720' | '480' | '360'>('auto');

    const [location, setLocation] = useState<LatLng | null>(null);

    const isPreview = preview ? preview : false;

    useEffect(
        asyncHandler(async () => {
            // TODO: await
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                throw new Error('Location access not granted');
            }
            getLastKnownPosition();
            getCurrentPosition();
        }),
        []
    );

    useFocusEffect(useCallback(() => void refresh(), [refresh]));

    if (!eventData) {
        return (
            <View
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'stretch',
                    flex: 1,
                }}
            >
                <Text style={{ fontSize: 30 }}>Please select an Event</Text>
            </View>
        );
    }

    const getEventRelationship = () => {
        // return if loading or the event has no users
        const eventUser = eventData.users?.find((el) => el.id === user.id);
        return eventUser?.eventAttendee?.status;
    };

    const getLastKnownPosition = async () => {
        const location = await Location.getLastKnownPositionAsync();
        if (!location) return;
        const lastLocation = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
        };

        setLocation(lastLocation);
    };

    const getCurrentPosition = async () => {
        const location = await Location.getCurrentPositionAsync();
        const latlng = { latitude: location.coords.latitude, longitude: location.coords.longitude };
        setLocation(latlng);
    };

    function getProfilePicture() {
        return {
            profilePicture:
                'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=745&q=80',
        };
    }

    const formatTime = (date: Date) => {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const formatDate = (date: Date) => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    };

    const numberOfAttendants = (eventData.users ?? []).length;

    const mainButton = () => {
        let button = <Text style={styles.joinButtonText}>I'm here!</Text>;
        let disabled = false;

        const mainJsx = (
            <View style={styles.joinButtonContainer}>
                <Pressable
                    style={{ ...styles.joinButton, opacity: disabled ? 0.5 : 1 }}
                    onPress={asyncHandler(
                        async () => {
                            await EventManager.join(eventId, 0, 0);
                        },
                        { prefix: 'Failed to join event' }
                    )}
                    disabled={disabled}
                >
                    {button}
                </Pressable>
            </View>
        );

        // // User is Host and Event is active
        // if (eventData.hostId === user.id && eventData.status === 'active') {
        //     button = <Text style={styles.joinButtonText}>Stop event!</Text>;
        // }
        // // User is Host and Event is scheduled
        // if (eventData.hostId === user.id && eventData.status === 'scheduled') {
        //     button = <Text style={styles.joinButtonText}>Start event!</Text>;
        // }
        // if (getEventRelationship() === 'attending') {
        //     button = <Text style={styles.joinButtonText}>Leave event!</Text>;
        // }
        return mainJsx;
    };
    const navigationBar = (
        <>
            <View style={styles.chatButtonContainer}>
                <Pressable
                    style={styles.chatButton}
                    onPress={() => navigation.navigate('Chat', { eventId: eventId })}
                >
                    <Ionicons name={'chatbox-ellipses-outline'} size={37} color={'white'} />
                </Pressable>
            </View>
            {mainButton()}
            <View style={styles.JoinCameraButtonContainer}>
                {isPreview ? (
                    <Pressable
                        style={styles.chatButton}
                        onPress={() => navigation.navigate('EventDetail', { eventId: eventId })}
                    >
                        <Ionicons name={'arrow-redo-outline'} size={37} color={'white'} />
                    </Pressable>
                ) : (
                    <Pressable
                        style={styles.chatButton}
                        onPress={() => navigation.navigate('MediaCapture', { eventId: eventId })}
                    >
                        <Ionicons name="camera" size={37} color="white" />
                    </Pressable>
                )}
            </View>
        </>
    );
    const tagArea = eventData.tags ? (
        <View style={styles.tagArea}>
            {eventData.tags.map((tag) => (
                <Tag style={{ ...styles.tag, backgroundColor: tag.color }} key={tag.label}>
                    {tag.label}
                </Tag>
            ))}
        </View>
    ) : (
        <View style={{ height: 10 }}></View>
    );

    const ratingArea = (
        <View style={styles.RatingArea}>
            <Rating imageSize={28} />
        </View>
    );

    const titleLine = (
        <View style={styles.TitleLine}>
            <Text style={{ fontSize: 25, fontWeight: 'bold', maxWidth: '70%' }}>
                {eventData.name}
            </Text>
            <View
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                }}
            >
                <Ionicons name="people" size={28} />
                <Text style={{ fontSize: 25, fontWeight: 'bold', marginLeft: 2 }}>
                    {numberOfAttendants}
                </Text>
            </View>
            <Image
                style={styles.ProfilePicture}
                source={{ uri: getProfilePicture().profilePicture }}
            />
        </View>
    );

    // Replace blank with "{eventData.address}" as soon as it is properly availabe
    const generalInformationArea = (
        <View style={styles.GeneralInformationArea}>
            <View style={{ maxWidth: '60%' }}>
                <Text style={{ color: 'grey', fontSize: 16 }}>
                    {`Start: ${formatDate(eventData.startDate)} - ${formatTime(
                        eventData.startDate
                    )}`}
                </Text>
                {eventData.endDate ? (
                    <Text style={{ color: 'grey', fontSize: 16 }}>
                        {`End:  ${formatDate(eventData.startDate)} - ${formatTime(
                            eventData.startDate
                        )}`}
                    </Text>
                ) : (
                    <></>
                )}
                {/* <Text style={{ fontSize: 18, fontWeight: 'bold' }}> </Text> */}
            </View>

            {/* {eventData.musicStyle ? (
                <View
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginRight: 13,
                    }}
                >
                    <Ionicons name="musical-notes-sharp" size={25}></Ionicons>
                    <Text style={{ fontSize: 23, fontWeight: '900' }}>{eventData.musicStyle}</Text>
                </View>
            ) : (
                <></>
            )} */}
        </View>
    );

    const descriptionArea = (
        <View style={styles.DescriptionArea}>
            <Text>{eventData.description}</Text>
        </View>
    );

    const mediaCarousel = (
        <View style={styles.camera}>
            <GestureHandlerRootView>
                <MediaCarousel
                    item={eventData}
                    isPlay={isPlay}
                    isMute={isMute}
                    setIsPlay={setIsPlay}
                    setIsMute={setIsMute}
                    isOpenQuality={isOpenQuality}
                    setIsOpenQuality={setIsOpenQuality}
                    quality={quality}
                    setQuality={setQuality}
                />
            </GestureHandlerRootView>
        </View>
    );

    const mapView = (
        <MapView
            style={styles.locationPreviewMap}
            // TODO: do something on press, or disable touch event instead?
            zoomEnabled={true}
            scrollEnabled={true}
            pitchEnabled={true}
            rotateEnabled={true}
            showsUserLocation={true}
            region={{
                latitude: eventData.lat,
                longitude: eventData.lon,
                latitudeDelta: 0.001,
                longitudeDelta: 0.001,
            }}
        >
            <Marker
                key={1}
                coordinate={{
                    latitude: eventData.lat,
                    longitude: eventData.lon,
                }}
                title={eventData.name}
            />
            {location ? (
                <Marker
                    key={2}
                    coordinate={{
                        latitude: location.latitude,
                        longitude: location.longitude,
                    }}
                    title={'You'}
                    pinColor={'orange'}
                />
            ) : (
                <></>
            )}
        </MapView>
    );

    return (
        <>
            <SafeAreaProvider>
                <ScrollView
                    refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} />}
                >
                    <View style={styles.section}>
                        {/* @Jonas - please build in the media thing here. this logic is used for the map screen */}
                        {isPreview == true ? (
                            <>
                                <View style={styles.InformationArea}>
                                    {titleLine}
                                    {generalInformationArea}
                                </View>
                            </>
                        ) : (
                            <>
                                {mediaCarousel}
                                {tagArea}
                                {ratingArea}
                                <View style={styles.InformationArea}>
                                    {titleLine}
                                    {generalInformationArea}
                                    {descriptionArea}
                                    {mapView}
                                </View>
                            </>
                        )}
                        <View style={styles.navigationBarPlaceholder}>
                            {isPreview ? navigationBar : <></>}
                        </View>
                    </View>
                </ScrollView>
                <View style={styles.overlay}>{!isPreview ? navigationBar : <></>}</View>
            </SafeAreaProvider>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    section: {},
    sectionBody: {},
    camera: {
        flex: 1,
        display: 'flex',
        alignSelf: 'stretch',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 400,
        height: '70%',
    },
    tagArea: {
        display: 'flex',
        flexDirection: 'row',
        alignSelf: 'stretch', // Float elements to the left
        flexWrap: 'wrap',
        backgroundColor: 'white',
        padding: 5,
    },
    tag: {
        height: 25,
        minWidth: 40,
        // paddingHorizontal: 5
    },
    RatingArea: {
        display: 'flex',
        flexDirection: 'row',
        alignSelf: 'stretch', // Float elements to the left
        flexWrap: 'wrap',
        backgroundColor: 'white',
        padding: 5,
        paddingLeft: 7,
    },
    InformationArea: {
        display: 'flex',
        alignSelf: 'stretch', // Float elements to the left
        backgroundColor: 'white',
    },
    TitleLine: {
        display: 'flex',
        flexDirection: 'row',
        alignSelf: 'stretch', // Float elements to the left
        justifyContent: 'space-between',
        alignItems: 'center',
        marginLeft: 7,
    },
    ProfilePicture: {
        width: 35,
        height: 35,
        borderRadius: 100,
        marginRight: 7,
    },
    GeneralInformationArea: {
        display: 'flex',
        flexDirection: 'row',
        alignSelf: 'stretch',
        justifyContent: 'space-between',
        marginLeft: 7,
    },
    DescriptionArea: {
        padding: 10,
    },
    ChatArea: {},
    IMHereButtonContainer: {
        // display: 'flex',
        // flexDirection: 'row',
        // alignSelf: 'stretch',
        // justifyContent: 'center',
        // padding: 6,
        backgroundColor: '#eaeaea',
        flex: 1,
    },
    IMHereButtonArea: {
        // display: 'flex',
        // flexDirection: 'row',
        // alignSelf: 'stretch',
        // flex: 1,
        justifyContent: 'center',
        // marginHorizontal: 3,
        borderRadius: 9,
        backgroundColor: 'black',
        padding: 7,
        height: 55,
    },
    IMHereButton: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 30,
    },
    overlay: {
        position: 'absolute',
        bottom: 0,
        // backgroundColor: 'red',
        width: '100%',
        height: 70,
        paddingVertical: 10,
        flex: 1,
        flexDirection: 'row',
        display: 'flex',
    },
    joinButtonContainer: {
        flex: 3,
        // backgroundColor: 'yellow',
        marginLeft: 10,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    joinButton: {
        backgroundColor: 'black',
        borderRadius: 7,
        flex: 1,
        // width: 300,
        alignSelf: 'stretch',
        justifyContent: 'center',
        alignItems: 'center',
    },
    joinButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 30,
    },
    chatButtonContainer: {
        flex: 1,
        // backgroundColor: 'blue',
        marginLeft: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    JoinCameraButtonContainer: {
        flex: 1,
        // backgroundColor: 'blue',
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    chatButton: {
        backgroundColor: 'black',
        borderRadius: 7,
        flex: 1,
        width: 60,
        alignSelf: 'stretch',
        justifyContent: 'center',
        alignItems: 'center',
    },
    navigationBarPlaceholder: {
        bottom: 0,
        // backgroundColor: 'red',
        width: '100%',
        height: 70,
        paddingVertical: 10,
        flex: 1,
        flexDirection: 'row',
        display: 'flex',
    },
    locationPreviewMap: {
        width: '100%',
        height: 300,
        borderRadius: 5,
    },
});

export default EventDetailScreen;
