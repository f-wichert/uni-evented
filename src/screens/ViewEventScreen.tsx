import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

import VideoCamera from '../components/VideoCamera';
import { useEventStore } from '../state/event';

function ViewEventScreen() {
    const closeEvent = useEventStore((state) => state.closeEvent);
    const [cameraActive, setCameraActive] = useState(false);

    return (
        <>
            {cameraActive ? (
                <VideoCamera onFinish={setCameraActive} />
            ) : (
                <View style={[styles.container]}>
                    <View style={[styles.flexEl, styles.camera]}>
                        <Ionicons
                            name="camera"
                            size={32}
                            color="orange"
                            onPress={() => setCameraActive(true)}
                        />
                    </View>
                    <Text style={[styles.flexEl]}>Sample Event Name</Text>
                    <Button
                        // TODO: Button does not accept 'style'
                        // https://docs.expo.dev/ui-programming/react-native-styling-buttons/
                        // style={[styles.flexEl, styles.button]}
                        color="orange"
                        title="Close Event"
                        onPress={() => closeEvent()}
                    />
                </View>
            )}
        </>
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

export default ViewEventScreen;
