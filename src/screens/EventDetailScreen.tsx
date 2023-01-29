import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import dayjs from 'dayjs';
import * as Location from 'expo-location';
import { getDistance } from 'geolib';
import React, { useCallback, useEffect, useState } from 'react';
import {
    Image,
    Pressable,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MapView, { LatLng, Marker } from 'react-native-maps';
import { Rating } from 'react-native-ratings';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import yellowSplash from '../../assets/yellow_splash.png';
import DetailActionButton, { EventActionState } from '../components/DetailActionButton';
import MediaCarousel from '../components/MediaCarousel';
import { Tag } from '../components/Tag';
import { EventManager, UserManager } from '../models';
import { CommonStackProps } from '../nav/types';
import { useEventFetch } from '../state/event';
import { useCurrentUser } from '../state/user';
import { UnreachableCaseError, useAsyncCallback, useAsyncEffects } from '../util';

const MAX_JOIN_RADIUS_METERS = 50;

interface Props extends CommonStackProps<'EventDetail'> {
    preview?: boolean;
    evId?: string;
}

function EventDetailScreen({ route, navigation, preview, evId }: Props) {
    const eventId = evId ? evId : route.params.eventId;
    const { event: eventData, loading, refresh } = useEventFetch(eventId);

    const user = useCurrentUser();

    // MediaCarousel
    const [isPlay, setIsPlay] = useState<boolean>(true);
    const [isMute, setIsMute] = useState<boolean>(true);
    const [isOpenQuality, setIsOpenQuality] = useState<boolean>(false);
    const [quality, setQuality] = useState<'auto' | '720' | '480' | '360'>('auto');

    const [location, setLocation] = useState<LatLng | null>(null);

    const [inRange, setInRange] = useState(false);

    const isPreview = preview ? preview : false;

    useAsyncEffects(
        async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                throw new Error('Location access not granted');
            }
            await Promise.all([getLastKnownPosition(), getCurrentPosition()]);
        },
        [],
        { prefix: 'Failed to fetch location' }
    );

    useEffect(() => {
        if (!location || !eventData) return;

        const eventLocation = { latitude: eventData.lat, longitude: eventData.lon };
        const distance = getDistance(location, eventLocation);
        setInRange(distance < MAX_JOIN_RADIUS_METERS);
    }, [location, eventData]);

    useFocusEffect(useCallback(() => void refresh(), [refresh]));

    const onButtonAction = useAsyncCallback(
        async (state: EventActionState) => {
            switch (state) {
                case EventActionState.AttendeeJoin:
                    await EventManager.join(eventId);
                    break;
                case EventActionState.AttendeeLeave:
                    await EventManager.leave(eventId);
                    break;
                case EventActionState.AttendeeInterested:
                    await EventManager.follow(eventId);
                    break;
                case EventActionState.AttendeeNotInterested:
                    await EventManager.unfollow(eventId);
                    break;
                case EventActionState.HostStart:
                    await EventManager.start(eventId);
                    break;
                case EventActionState.HostEnd:
                    await EventManager.stop(eventId);
                    break;
                case EventActionState.Completed:
                case EventActionState.AttendeeBanned:
                    // no action, button is disabled
                    break;
                default:
                    throw new UnreachableCaseError(state, 'Unknown event action');
            }
            refresh();
        },
        [eventId, refresh]
    );

    const showProfile = useCallback(() => {
        if (!eventData?.hostId) return;
        navigation.navigate('UserProfile', { userId: eventData.hostId });
    }, [navigation, eventData?.hostId]);

    const sendRating = useAsyncCallback(
        async (rating: number) => {
            await EventManager.rate(eventId, rating);
        },
        [eventId],
        { prefix: 'Failed to rate event' }
    );

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

    const formatDateTime = (date: Date) => {
        const d = dayjs(date);
        return d.format('ddd, DD.MM - HH:mm');
    };

    const numberOfAttendants = (eventData.users ?? []).length;

    const navigationBar = (
        <>
            <View style={styles.chatButtonContainer}>
                <Pressable
                    style={{
                        ...styles.chatButton,
                        opacity: getEventRelationship() === 'banned' ? 0.5 : 1,
                    }}
                    onPress={() => navigation.navigate('Chat', { eventId: eventId })}
                    disabled={getEventRelationship() === 'banned'}
                >
                    <Ionicons name={'chatbox-ellipses-outline'} size={37} color={'white'} />
                </Pressable>
            </View>
            <DetailActionButton
                loading={loading}
                inRange={inRange}
                isHost={eventData.hostId === user.id}
                eventStatus={eventData.status}
                userStatus={getEventRelationship()}
                onAction={onButtonAction}
            />
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
                        style={{
                            ...styles.chatButton,
                            opacity:
                                eventData.hostId !== user.id &&
                                getEventRelationship() !== 'attending'
                                    ? 0.5
                                    : 1,
                        }}
                        onPress={() => navigation.navigate('MediaCapture', { eventId: eventId })}
                        disabled={
                            eventData.hostId !== user.id && getEventRelationship() !== 'attending'
                        }
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
            <Rating
                readonly={!eventData.ratable}
                imageSize={28}
                onFinishRating={sendRating}
                startingValue={eventData.rating ?? 0}
            />
            <Text
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: 3,
                    fontSize: 25,
                }}
            >
                {eventData.rating ? eventData.rating : 0}/5
            </Text>
            {eventData.status === 'active' ? (
                <View style={styles.activeIndicator}>
                    <Text style={styles.activeIndicatorText}>Active</Text>
                </View>
            ) : null}
        </View>
    );

    const hostAvatarUrl = UserManager.getAvatarUrl(eventData.host);

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
                <Pressable
                    onPress={() => navigation.navigate('EventAttendees', { eventId: eventId })}
                    style={{ flexDirection: 'row', alignItems: 'center' }}
                >
                    <Ionicons name="people" size={28} />
                    <Text style={{ fontSize: 25, fontWeight: 'bold', marginLeft: 2 }}>
                        {numberOfAttendants}
                    </Text>
                </Pressable>
            </View>
            <TouchableOpacity onPress={showProfile}>
                <Image
                    style={styles.ProfilePicture}
                    source={hostAvatarUrl ? { uri: hostAvatarUrl } : yellowSplash}
                />
            </TouchableOpacity>
        </View>
    );

    // Replace blank with "{eventData.address}" as soon as it is properly availabe
    const generalInformationArea = (
        <View style={styles.GeneralInformationArea}>
            <View style={{ maxWidth: '60%' }}>
                <Text style={{ color: 'grey', fontSize: 16 }}>
                    {`Start: ${formatDateTime(eventData.startDate)}`}
                </Text>
                {eventData.endDate ? (
                    <Text style={{ color: 'grey', fontSize: 16 }}>
                        {`End: ${formatDateTime(eventData.endDate)}`}
                    </Text>
                ) : null}
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
                latitudeDelta: 0.002,
                longitudeDelta: 0.002,
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
    activeIndicator: {
        marginLeft: 'auto',
        marginRight: 5,
        backgroundColor: '#e66c6a',
        borderColor: 'black',
        borderRadius: 5,
        borderWidth: 2,
    },
    activeIndicatorText: {
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: 20,
        flex: 1,
        paddingLeft: 10,
        paddingRight: 10,
    },
});

export default EventDetailScreen;
