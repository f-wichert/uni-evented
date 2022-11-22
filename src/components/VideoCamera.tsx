import React, { useState, useContext, useEffect, useRef } from 'react';
import { Alert, Button, Dimensions, StyleSheet, TextInput, View, Text, Platform, TouchableOpacity } from 'react-native';
import { Context as AuthContext } from '../contexts/authContext';
import { Camera, CameraType } from 'expo-camera';
import Ionicons from '@expo/vector-icons/Ionicons';

function VideoCamera(props) {
    const [hasPermission, setHasPermission] = useState(null);
    const [type, setType] = useState(CameraType.back);
    const [recording, setRecording] = useState(false);
    const cameraRef = useRef(null);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestMicrophonePermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    return (
        <View style={[styles.container,]}>
            <Camera style={[styles.camera,]}
                type={type}
                ref={cameraRef}
            >
                <View style={[styles.column,]}>
                    <View style={[styles.row,]}>
                        <TouchableOpacity
                            style={[styles.flexEl,]}
                            onPress={() => {
                                setType(type === CameraType.back ? CameraType.front : CameraType.back);
                            }}
                        >
                            <Ionicons name='camera-reverse-outline' size={32} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.flexEl,]}
                            onPress={async () => {
                                if (cameraRef.current) {
                                    let photo = await cameraRef.current.takePictureAsync();
                                    console.log("photo", photo);
                                    props.onFinish(false);
                                }
                            }}
                        >
                            <View style={[styles.outerCirclePhoto]}>
                                <View style={[styles.innerCirclePhoto,]}></View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.flexEl,]}
                            onPress={async () => {
                                if (!recording) {
                                    setRecording(true);
                                    cameraRef.current.recordAsync()
                                        .then((obj) => {
                                            console.log(obj.uri);
                                            props.onFinish(false);
                                        })
                                } else {
                                    setRecording(false);
                                    cameraRef.current.stopRecording();
                                }
                            }}
                        >
                            <View style={[styles.outerCircleVideo]}>
                                <View style={[styles.innerCircleVideo,]}></View>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </Camera>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    camera: {
        flex: 1,
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
        alignSelf: 'center',
    },
    outerCirclePhoto: {
        borderWidth: 2,
        borderRadius: 25,
        borderColor: "white",
        height: 50,
        width: 50,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",

    },
    innerCirclePhoto: {
        borderWidth: 2,
        borderRadius: 25,
        borderColor: "white",
        height: 40,
        width: 40,
        backgroundColor: "white",
    },
    outerCircleVideo: {
        borderWidth: 2,
        borderRadius: 25,
        borderColor: "red",
        height: 50,
        width: 50,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",

    },
    innerCircleVideo: {
        borderWidth: 2,
        borderRadius: 25,
        borderColor: "red",
        height: 40,
        width: 40,
        backgroundColor: "red",
    }
});

export default VideoCamera;