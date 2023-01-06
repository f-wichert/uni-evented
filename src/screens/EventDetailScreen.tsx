import Ionicons from '@expo/vector-icons/Ionicons';
import { HeaderBackButton } from '@react-navigation/elements';
import { StackActions, useFocusEffect } from '@react-navigation/native';
import React, { useEffect } from 'react';
import {
    BackHandler,
    Dimensions,
    Image,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Rating } from 'react-native-ratings';
import Carousel from 'react-native-reanimated-carousel';

import { Tag } from '../components/Tag';
import { EventManager } from '../models';
import { EventListStackNavProps } from '../nav/types';
import { useEventFetch } from '../state/event';
import { asyncHandler } from '../util';

let media_data = [
    {
        name: 'One',
        type: 'video',
    },
    {
        name: 'Two',
        type: 'video',
    },
    {
        type: 'upload',
    },
];

function EventDetailScreen({ route, navigation }: EventListStackNavProps<'EventDetail'>) {
    const eventId = route.params.eventId;
    const origin = route.params.origin;

    const { event: eventData } = useEventFetch(eventId);

    useEffect(() => {
        // overwrite back button functionality on this component to depend on where it came from (nested screens)
        navigation.setOptions({
            headerLeft: () => (
                <HeaderBackButton
                    onPress={() => {
                        navigateToOrigin();
                    }}
                />
            ),
        });
    }, [navigation]);

    useFocusEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', navigateToOrigin);
    });

    // const eventID = useEventStore((state) => state.currentEventId) // Get event ID of current event of currently logged in user

    // console.log('eventData:', eventData);
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

    const getJsx = (item) => {
        if (item.type == 'video') {
            return <Text>{item.name}</Text>;
            // return (<VideoDiscover discoverData={item} navigateDetail={navigateDetail} />);
        } else if (item.type == 'image') {
        } else if (item.type == 'upload') {
            return (
                <>
                    <Ionicons
                        name="camera"
                        size={64}
                        color="orange"
                        onPress={() => {
                            navigation.navigate('MediaCapture', { eventID: eventId });
                        }}
                    />
                    <Text>Load Picture/Video of event here</Text>
                </>
            );
        }

        return <Text>hi</Text>;
    };

    console.log(`Data: ${JSON.stringify(eventData)}`);
    //     return  (async () => {
    //     eventData = EventManager.fromId(eventID!) as Event
    //     console.log('Event:', eventData);
    //     loaded = true;
    //     return eventData
    // }).then(run(eventData))
    async function registerUserArrivalAtEvent() {
        if (!eventId) return;
        // console.log(`You are now checked in at the Event (Mock Message, did nothing)`);
        await joinEvent({ eventId });
    }

    function getProfilePicture() {
        return {
            profilePicture:
                'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=745&q=80',
        };
    }

    function navigateToOrigin() {
        // probably same TS error as in MapScreen (link there)
        switch (origin) {
            case 'EventDetail':
                navigation.navigate('EventList');
                break;
            case 'Map':
                // this is needed here to also remove the EventDetailsScreen from the stack
                // otherwise the following happens:
                // 1. Open Event from Map Screen & go back to Map Screen using Back functionality
                // 2. if you click 'Events' it will still show the Event from before and not the list
                navigation.dispatch(StackActions.replace('TabScreen', { screen: 'Map' }));
                break;
            case 'Discover':
                navigation.dispatch(StackActions.replace('TabScreen', { screen: 'Discover' }));
                break;
            default:
                navigation.navigate('EventList');
        }
        return true;
    }

    // Developement Values TODO: replace with request to real ones
    const event = {
        title: eventData.name,
        tags: [
            { name: 'Beer', color: 'orange' },
            { name: 'Rave', color: 'green' },
            { name: 'Techno', color: 'red' },
        ],
        numberOfAttendants: (eventData.users ?? []).length,
        startingTime: '19:00',
        endingTime: '23:30',
        address: 'Schloßgartenstraße, 64289 Darmstadt',
        musicStyle: 'Techno',
        rating: 4,
        description:
            'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.',
    };

    return (
        <>
            <SafeAreaView style={{ display: 'flex' }}>
                <ScrollView>
                    <View style={styles.section}>
                        <View style={styles.camera}>
                            <GestureHandlerRootView>
                                <Carousel
                                    width={Dimensions.get('window').width}
                                    height={200}
                                    autoPlay={false}
                                    loop={false}
                                    data={media_data}
                                    scrollAnimationDuration={350}
                                    renderItem={({ item, index }) => getJsx(item)}
                                />
                            </GestureHandlerRootView>
                        </View>
                        <View style={styles.tagArea}>
                            {event.tags.map((tag) => (
                                <Tag
                                    style={{ ...styles.tag, backgroundColor: tag.color }}
                                    key={tag.name}
                                >
                                    {tag.name}
                                </Tag>
                            ))}
                        </View>
                        <View style={styles.RatingArea}>
                            <Rating imageSize={28} />
                        </View>
                        <View style={styles.InformationArea}>
                            <View style={styles.TitleLine}>
                                <Text style={{ fontSize: 25, fontWeight: 'bold', maxWidth: '70%' }}>
                                    {event.title}
                                </Text>
                                <View
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Ionicons name="people" size={28} />
                                    <Text
                                        style={{ fontSize: 25, fontWeight: 'bold', marginLeft: 2 }}
                                    >
                                        {event.numberOfAttendants}
                                    </Text>
                                </View>
                                <Image
                                    style={styles.ProfilePicture}
                                    source={{ uri: getProfilePicture().profilePicture }}
                                />
                            </View>
                            <View style={styles.GeneralInformationArea}>
                                <View style={{ maxWidth: '60%' }}>
                                    <Text style={{ color: 'grey', fontSize: 16 }}>
                                        {event.startingTime}-{event.endingTime}
                                    </Text>
                                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                                        {event.address}
                                    </Text>
                                </View>
                                <View
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        marginRight: 13,
                                    }}
                                >
                                    <Ionicons name="musical-notes-sharp" size={25}></Ionicons>
                                    <Text style={{ fontSize: 23, fontWeight: '900' }}>
                                        {event.musicStyle}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.DescriptionArea}>
                                <Text>{event.description}</Text>
                            </View>
                        </View>
                        <View style={styles.ChatArea}></View>
                        {/* <View style={styles.IMHereButtonContainer}> */}
                        <View style={{ height: 100, backgroundColor: 'white' }}>
                            {/* <Pressable
                                style={styles.IMHereButtonArea}
                                onPress={asyncHandler(registerUserArrivalAtEvent)}
                            >
                                <Text style={styles.IMHereButton}> I'm Here!</Text>
                            </Pressable> */}
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
            <View style={styles.overlay}>
                <View style={styles.joinButtonContainer}>
                    <Pressable
                        style={styles.joinButton}
                        onPress={asyncHandler(
                            async () => {
                                await EventManager.join(eventId, 0, 0);
                            },
                            { prefix: 'Failed to join event' }
                        )}
                    >
                        <Text style={styles.joinButtonText}>{"I'm Here!"}</Text>
                    </Pressable>
                </View>
                <View style={styles.chatButtonContainer}>
                    <Pressable
                        style={styles.chatButton}
                        onPress={() => navigation.navigate('ChatScreen', { eventId: eventId })}
                    >
                        <Ionicons name={'chatbox-ellipses-outline'} size={37} color={'white'} />
                    </Pressable>
                </View>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    section: {},
    sectionBody: {},
    column: {
        flex: 1,
        backgroundColor: 'transparent',
        justifyContent: 'flex-end',
        marginBottom: 10,
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    flexEl: {
        flex: 0.5,
        padding: 20,
    },
    camera: {
        display: 'flex',
        backgroundColor: 'grey',
        alignSelf: 'stretch',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 200,
        borderRadius: 10,
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
        flex: 25,
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
        width: 300,
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
        flex: 6,
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
});

export default EventDetailScreen;
