import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import { Camera, CameraType } from 'expo-camera';
import React, { useEffect, useRef, useState } from 'react';
import { AppState, BackHandler, StyleSheet, TouchableOpacity, View } from 'react-native';
import { NodeCameraView } from 'react-native-nodemediaclient';
import { useCallbackRef } from 'use-callback-ref';

import { EventListStackNavProps } from '../nav/types';
import { asyncHandler, request } from '../util';

function VideoCamera({ route, navigation }: EventListStackNavProps<'MediaCapture'>) {
    const eventId = route.params.eventId;

    const [hasPermission, setHasPermission] = useState(false);
    const [cameraType, setCameraType] = useState(CameraType.back);
    const [recording, setRecording] = useState(false);

    /**
     * switch between camera and live mode
     * necessary because we need a special camera component for the live stream
     */
    const [liveMode, setLiveMode] = useState(false);
    const [streamUrl, setStreamUrl] = useState<string>('');

    const cameraRef = useRef<Camera>(null);
    const liveCameraRef = useCallbackRef<NodeCameraView>(null, (_, oldValue) => {
        if (oldValue) {
            // make sure the stream stops when ref changes
            oldValue.stop();
            setLiveMode(false);
        }
    });

    const appState = useRef(AppState.currentState);

    // make sure the stream stops when app closes or goes inactive
    useEffect(() => {
        const subscription = AppState.addEventListener('change', (nextState) => {
            if (appState.current === 'active' && nextState === 'background') {
                if (liveCameraRef.current) {
                    liveCameraRef.current.stop();
                    setLiveMode(false);
                }
            }
        });

        return () => {
            subscription.remove();
        };
    }, []);

    useFocusEffect(() => {
        const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
            navigation.goBack();
            return true;
        });

        return () => {
            subscription.remove();
        };
    });

    const createFormData = (uri: string, type: string) => {
        const form = new FormData();
        form.append('File', {
            name: uri.split('/').pop() || 'sample.dat',
            uri: uri,
            type: type,
        });
        form.append('eventID', eventId);
        return form;
    };

    const onPhotoButton = async () => {
        if (!cameraRef.current) return;
        // capture image
        const { uri } = await cameraRef.current.takePictureAsync();

        // close camera
        navigation.goBack();
        toast.show('Picture was successfully uploaded.');

        // infer mime type based on extension
        const extensionMatch = /\.(\w+)$/.exec(uri);
        const type = extensionMatch ? `image/${extensionMatch[1]}` : `image`;

        // upload media
        await request('POST', '/upload/image', createFormData(uri, type));
    };

    const onVideoButton = async () => {
        if (!cameraRef.current) return;

        if (recording) {
            setRecording(false);
            cameraRef.current.stopRecording();
            return;
        }

        // start recording
        setRecording(true);
        const { uri } = await cameraRef.current.recordAsync();
        // close camera
        navigation.goBack();
        toast.show('Video was successfully uploaded.');

        // upload media
        await request('POST', '/upload/clip', createFormData(uri, 'video/mp4'));
    };

    const updateStreamUrl = async () => {
        const response = await request('POST', '/upload/livestream', { eventID: eventId });
        const { id, streamKey } = response as { id: string; streamKey: string };
        const url = `rtmp://192.168.2.119:3003/live/${id}?key=${streamKey}`;
        setStreamUrl(url);
    };

    const onLiveModeButton = async () => {
        if (!liveMode) {
            try {
                await updateStreamUrl();
            } catch {
                return;
            }
        }
        setLiveMode(!liveMode);
    };

    useEffect(() => {
        if (liveMode && liveCameraRef.current) {
            liveCameraRef.current.start();
        }
    }, [liveMode]);

    useEffect(
        asyncHandler(
            async () => {
                const { status } = await Camera.requestCameraPermissionsAsync();
                setHasPermission(status === 'granted');
            },
            { prefix: 'requestCameraPermissionsAsync failed' }
        ),
        []
    );

    useEffect(
        asyncHandler(
            async () => {
                const { status } = await Camera.requestMicrophonePermissionsAsync();
                setHasPermission(status === 'granted');
            },
            { prefix: 'requestMicrophonePermissionsAsync failed' }
        ),
        []
    );

    return (
        <View style={[styles.container]}>
            {liveMode ? (
                <View style={{ flex: 1, backgroundColor: 'black' }}>
                    <NodeCameraView
                        style={[styles.camera]}
                        ref={liveCameraRef}
                        outputUrl={streamUrl}
                        camera={{
                            cameraId: cameraType === CameraType.back ? 0 : 1,
                            cameraFrontMirror: true,
                        }}
                        audio={{ bitrate: 32000, profile: 1, samplerate: 44100 }}
                        video={{
                            preset: 1,
                            bitrate: 1024 * 1024,
                            profile: 1,
                            fps: 24,
                            videoFrontMirror: false,
                        }}
                        autopreview={true}
                        onStatus={(code: string, msg: string) => {
                            console.log(`onStatus code=${code} msg=${msg}`);
                        }}
                    />
                    <View style={{ ...styles.row, marginTop: 10, marginBottom: 10 }}>
                        <TouchableOpacity
                            style={[styles.flexEl]}
                            onPress={() => {
                                liveCameraRef.current?.switchCamera();
                            }}
                        >
                            <Ionicons name="camera-reverse-outline" size={32} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity disabled={true} style={[styles.flexEl]}>
                            <View style={[styles.outerCircleVideo]}>
                                <View
                                    style={{
                                        ...styles.innerCircleVideo,
                                        borderRadius: 25,
                                        opacity: 0.25,
                                    }}
                                ></View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            disabled={true}
                            style={{
                                ...styles.flexEl,
                                opacity: 0.25,
                            }}
                        >
                            <View style={[styles.outerCirclePhoto]}>
                                <View style={[styles.innerCirclePhoto]}></View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.flexEl]}
                            onPress={asyncHandler(onLiveModeButton, {
                                prefix: 'Failed to leave live mode',
                            })}
                        >
                            <Ionicons name="videocam" size={32} color="red" />
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                <Camera style={[styles.camera]} type={cameraType} ref={cameraRef}>
                    <View style={[styles.column]}>
                        <View style={[styles.row]}>
                            <TouchableOpacity
                                disabled={recording}
                                style={{
                                    ...styles.flexEl,
                                    opacity: recording ? 0.25 : 1,
                                }}
                                onPress={() => {
                                    setCameraType(
                                        cameraType === CameraType.back
                                            ? CameraType.front
                                            : CameraType.back
                                    );
                                }}
                            >
                                <Ionicons name="camera-reverse-outline" size={32} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.flexEl]}
                                onPress={asyncHandler(onVideoButton, {
                                    prefix: 'Failed to record video',
                                })}
                            >
                                <View style={[styles.outerCircleVideo]}>
                                    <View
                                        style={{
                                            ...styles.innerCircleVideo,
                                            borderRadius: recording ? 0 : 25,
                                        }}
                                    ></View>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                disabled={recording}
                                style={{
                                    ...styles.flexEl,
                                    opacity: recording ? 0.25 : 1,
                                }}
                                onPress={asyncHandler(onPhotoButton, {
                                    prefix: 'Failed to take picture',
                                })}
                            >
                                <View style={[styles.outerCirclePhoto]}>
                                    <View style={[styles.innerCirclePhoto]}></View>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.flexEl}
                                disabled={recording}
                                onPress={asyncHandler(onLiveModeButton, {
                                    prefix: 'Failed to enter live mode',
                                })}
                            >
                                <Ionicons name="videocam-outline" size={32} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </Camera>
            )}
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
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    flexEl: {
        alignSelf: 'center',
    },
    outerCirclePhoto: {
        borderWidth: 2,
        borderRadius: 25,
        borderColor: 'white',
        height: 50,
        width: 50,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    innerCirclePhoto: {
        borderWidth: 2,
        borderRadius: 25,
        borderColor: 'white',
        height: 20,
        width: 20,
        backgroundColor: 'white',
    },
    outerCircleVideo: {
        borderWidth: 2,
        borderRadius: 25,
        borderColor: 'red',
        height: 50,
        width: 50,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    innerCircleVideo: {
        borderWidth: 2,
        borderColor: 'red',
        height: 20,
        width: 20,
        backgroundColor: 'red',
    },
});

export default VideoCamera;
