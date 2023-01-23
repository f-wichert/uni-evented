import Ionicons from '@expo/vector-icons/Ionicons';
import { Camera, CameraType } from 'expo-camera';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, StyleSheet, TouchableOpacity, View } from 'react-native';
import { NodeCameraView } from 'react-native-nodemediaclient';
import { useCallbackRef } from 'use-callback-ref';
import config from '../config';

import { MediaManager } from '../models';
import { CommonStackProps } from '../nav/types';
import { useAsyncCallback, useAsyncEffects } from '../util';

function VideoCamera({ route, navigation }: CommonStackProps<'MediaCapture'>) {
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

    // make sure the stream stops when app closes or goes inactive
    useEffect(() => {
        const subscription = AppState.addEventListener('change', (nextState) => {
            if (nextState === 'background' && liveCameraRef.current) {
                liveCameraRef.current.stop();
                setLiveMode(false);
            }
        });

        return () => {
            subscription.remove();
        };
    }, []);

    const createFormData = useCallback(
        (uri: string, type: string) => {
            const form = new FormData();
            form.append('File', {
                name: uri.split('/').pop() || 'sample.dat',
                uri: uri,
                type: type,
            });
            form.append('eventID', eventId);
            return form;
        },
        [eventId]
    );

    const onPhotoButton = useAsyncCallback(
        async () => {
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
            await MediaManager.uploadImage(createFormData(uri, type));
        },
        [createFormData, navigation],
        {
            prefix: 'Failed to take picture',
        }
    );

    const onVideoButton = useAsyncCallback(
        async () => {
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
            await MediaManager.uploadClip(createFormData(uri, 'video/mp4'));
        },
        [createFormData, navigation, recording],
        {
            prefix: 'Failed to record video',
        }
    );

    const updateStreamUrl = useCallback(async () => {
        const { id, streamKey } = await MediaManager.uploadLivestream(eventId);
        if (!streamKey) throw new Error('No stream key received');

        const url = `${config.NMS_RTMP_URL}/livestream/${id}?key=${streamKey}`;
        setStreamUrl(url);
    }, [eventId]);

    const onLiveModeButton = useAsyncCallback(
        async () => {
            if (!liveMode) {
                try {
                    await updateStreamUrl();
                } catch {
                    return;
                }
            }
            setLiveMode(!liveMode);
        },
        [liveMode, updateStreamUrl],
        { prefix: 'Failed to change live mode' }
    );

    useEffect(() => {
        if (liveMode && liveCameraRef.current) {
            liveCameraRef.current.start();
        }
    }, [liveMode]);

    useAsyncEffects(
        async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        },
        [],
        { prefix: 'requestCameraPermissionsAsync failed' }
    );

    useAsyncEffects(
        async () => {
            const { status } = await Camera.requestMicrophonePermissionsAsync();
            setHasPermission(status === 'granted');
        },
        [],
        { prefix: 'requestMicrophonePermissionsAsync failed' }
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
                            cameraFrontMirror: false,
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
                        <TouchableOpacity style={[styles.flexEl]} onPress={onLiveModeButton}>
                            <Ionicons name="videocam" size={32} color="red" />
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                <Camera style={[styles.camera]} type={cameraType} ref={cameraRef} ratio={'16:9'}>
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
                            <TouchableOpacity style={[styles.flexEl]} onPress={onVideoButton}>
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
                                onPress={onPhotoButton}
                            >
                                <View style={[styles.outerCirclePhoto]}>
                                    <View style={[styles.innerCirclePhoto]}></View>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.flexEl}
                                disabled={recording}
                                onPress={onLiveModeButton}
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
