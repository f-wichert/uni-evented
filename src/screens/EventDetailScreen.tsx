import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useContext, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { max } from 'react-native-reanimated';
import VideoCamera from '../components/VideoCamera';
import {Props} from '../types'
import { Tag } from '../components/Tag';

import { asyncHandler } from '../util';

function EventDetailScreen() {
    // return (
    //     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    //       <Text>Details Screen</Text>
    //     </View>
    //   );
    const [cameraActive, setCameraActive] = useState(false);

    const eventID = 0 // TODO: Mock Value. Replace with real value once this part gets connected

    // Developement Values TODO: replace with request to real ones
    let event = {
        title:'Herrengarten Rave',
        tags: ['Beer', 'Rave', 'Techno'],
        numberOfAttendants: 5,
        startingTime: '19:00',
        endingTime: '23:30',
        address: 'Herrengarten and der Uni',
        musicStyle: 'Funk',
        rating: 4,
        description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.'
    }

    // TODO: But back in when event creatin is smooth
    // if (state.eventId == null) {  // If no event has been created, gibe error

    //     console.log('ERROR! - Opened Event Detail Screen, but Event-ID was null')
    //     return (
    //         <View>
    //             <Text style={{justifyContent: 'center', alignItems:'center'}}> No event ID given, please create an event</Text>
    //         </View>
    //     )
    // }

    
    return (
        <View style={[styles.container]}>
            <View style={styles.camera}>
                <Ionicons
                    name="camera"
                    size={64}
                    color="orange"
                    onPress={() => setCameraActive(true)}
                />
                <Text>Load Picture/Video of event here</Text>
            </View>
            <View style={styles.TagArea}>
                
                <Tag style={{}}>Helllol</Tag>
            </View>
            <View style={styles.RatingArea}>

            </View>
            <View style={styles.GeneralInformationArea}>

            </View>
            <View style={styles.ChatArea}>

            </View>
            <View style={styles.IMHereButtonArea}>
            <Button
                // TODO: Button does not accept 'style'
                // https://docs.expo.dev/ui-programming/react-native-styling-buttons/
                // style={[styles.flexEl, styles.button]}
                color="black"
                title="I'm here!"
                onPress={() => registerUserArrivalAtEvent()} />
            </View>
        </View>
    );
}

    function registerUserArrivalAtEvent() {
        console.log(`You are now checked in at the Event (Mock Message, did nothing)`)
    }

      const styles = StyleSheet.create({
        container: {
            
            alignItems: 'center',
        },
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
            minHeight:200,
        },
        TagArea: {
            backgroundColor: 'aqua',
            padding: 5,
        },
        RatingArea: {
            
        },
        GeneralInformationArea: {
            
        },
        
        ChatArea:{
            
        },
        IMHereButtonArea: {

        },
    });

export default EventDetailScreen;