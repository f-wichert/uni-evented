import Ionicons from '@expo/vector-icons/Ionicons';
import { Camera, CameraType } from 'expo-camera';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { asyncHandler, request } from '../util';

declare type Props = {
    // TODO: this is always called with `false`?
    onFinish(arg0: boolean): void;
    eventID: string;
};

function VideoCamera({ onFinish, eventID }: Props) {
    const [hasPermission, setHasPermission] = useState(false);
    const [type, setType] = useState(CameraType.back);
    const [recording, setRecording] = useState(false);
    const cameraRef = useRef<Camera>(null);

    const createFormData = (uri: string, type: string) => {
        const form = new FormData();
        form.append('File', {
            name: uri.split('/').pop() || 'sample.dat',
            uri: uri,
            type: type,
        });
        form.append('eventID', eventID);
        return form;
    };

    const onPhotoButton = async () => {
        if (!cameraRef.current) return;

        // capture image
        const { uri } = await cameraRef.current.takePictureAsync();

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

        // upload media
        await request('POST', '/upload/clip', createFormData(uri, 'video/mp4'));

        onFinish(false);
    };

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
            <Camera style={[styles.camera]} type={type} ref={cameraRef}>
                <View style={[styles.column]}>
                    <View style={[styles.row]}>
                        <TouchableOpacity
                            style={[styles.flexEl]}
                            onPress={() => {
                                setType(
                                    type === CameraType.back ? CameraType.front : CameraType.back
                                );
                            }}
                        >
                            <Ionicons name="camera-reverse-outline" size={32} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.flexEl]}
                            onPress={asyncHandler(onPhotoButton, {
                                prefix: 'Failed to take picture',
                            })}
                        >
                            <View style={[styles.outerCirclePhoto]}>
                                <View style={[styles.innerCirclePhoto]}></View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.flexEl]}
                            onPress={asyncHandler(onVideoButton, {
                                prefix: 'Failed to record video',
                            })}
                        >
                            <View style={[styles.outerCircleVideo]}>
                                <View style={[styles.innerCircleVideo]}></View>
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
        height: 40,
        width: 40,
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
        borderRadius: 25,
        borderColor: 'red',
        height: 40,
        width: 40,
        backgroundColor: 'red',
    },
});

export default VideoCamera;
