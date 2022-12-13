import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useContext, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { max } from 'react-native-reanimated';
import VideoCamera from '../components/VideoCamera';
import { EventContext } from '../contexts/eventContext';
import {Props} from '../types'

import { asyncHandler } from '../util';

function EventDetailScreen() {
    // return (
    //     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    //       <Text>Details Screen</Text>
    //     </View>
    //   );
    const { closeEvent } = useContext(EventContext);
    const [cameraActive, setCameraActive] = useState(false);

    const { state } = useContext(EventContext); // Use this as a way to get event ID untill it can properly be parsed via props param

    console.log(state.eventId);

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
            <View style={[styles.flexEl, styles.camera]}>
                <Ionicons
                    name="camera"
                    size={32}
                    color="orange"
                    onPress={() => setCameraActive(true)}
                />
            </View>
            <Text style={[styles.flexEl]}>Event Detail Screen</Text>
            <Button
                // TODO: Button does not accept 'style'
                // https://docs.expo.dev/ui-programming/react-native-styling-buttons/
                // style={[styles.flexEl, styles.button]}
                color="orange"
                title="Close Event"
                onPress={() => closeEvent()}
            />
        </View>
    );
}

      const styles = StyleSheet.create({
        container: {
            display: 'flex',
            flex: 1,
            justifyContent: 'space-between',
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
        button: {},
        camera: {
            display: 'flex',
            backgroundColor: 'grey',
            alignSelf: 'stretch',
            alignItems: 'center',
            justifyContent: 'center',
        },
    });

export default EventDetailScreen;