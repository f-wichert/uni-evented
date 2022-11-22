import React, { useState, useContext, useEffect, useRef } from 'react';
import { Alert, Button, Dimensions, StyleSheet, TextInput, View, Text, Platform, TouchableOpacity } from 'react-native';
import { Context as AuthContext } from '../contexts/authContext';
import { AutoFocus, Camera, CameraType } from 'expo-camera';
import Ionicons from '@expo/vector-icons/Ionicons';
import VideoCamera from '../components/VideoCamera';


function ViewEventScreen() {
    const { state, closeEvent } = useContext(AuthContext);
    const [cameraActive, setCameraActive] = useState(false);

    return (
        <>
            {cameraActive ?
                <VideoCamera onFinish={setCameraActive} /> :
                <View style={[styles.container,]}>
                    < View style={[styles.flexEl, styles.camera,]} >
                        <Ionicons name="camera" size={32} color="orange" onPress={() => setCameraActive(true)} />
                    </View >
                    <Text style={[styles.flexEl,]}>Sample Event Name</Text>
                    <Button style={[styles.flexEl, styles.button,]} color="orange" title="Close Event" onPress={() => closeEvent()} />
                </View >
            }

        </>
    )


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
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-evenly",
    },
    flexEl: {
        flex: 0.5,
        padding: 20,
    },
    button: {
    },
    camera: {
        display: 'flex',
        backgroundColor: 'grey',
        alignSelf: 'stretch',
        alignItems: 'center',
        justifyContent: 'center',
    }
});

export default ViewEventScreen;
