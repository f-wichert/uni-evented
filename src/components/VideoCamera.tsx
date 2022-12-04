import Ionicons from '@expo/vector-icons/Ionicons';
import { Camera, CameraType } from 'expo-camera';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { AuthContext } from '../contexts/authContext';
import { requestData } from '../util';

declare type Props = {
    onFinish(arg0: boolean): void;
};

function VideoCamera({ onFinish }: Props) {
    const [hasPermission, setHasPermission] = useState(false);
    const [type, setType] = useState(CameraType.back);
    const [recording, setRecording] = useState(false);
    const cameraRef = useRef<Camera>(null);
    const { state } = useContext(AuthContext);

    const createFormData = (uri: string, type: string) => {
        // Here uri means the url of the video you captured
        const form = new FormData();
        form.append('File', {
            name: 'Sample',
            uri: uri,
            type: type,
        });
        return form;
    };

    const uploadVideo = async (uri: string) => {
        await requestData(
            'POST',
            '/upload/clip',
            state.token,
            createFormData(uri, 'video/mp4')
        ).catch(() => {
            console.error('video upload failed');
        });
    };

    const uploadPhoto = async (uri: string) => {
        const filename = uri.split('/').pop();

        if (!filename) {
            console.error(`couldn't find filename in ${uri}`);
            return;
        }

        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image`;

        await requestData('POST', '/upload/image', state.token, createFormData(uri, type));
    };

    useEffect(() => {
        Camera.requestCameraPermissionsAsync()
            .then(({ status }) => setHasPermission(status === 'granted'))
            .catch((err) => console.error(`requestCameraPermissionAsync failed:`, err));
    }, []);

    useEffect(() => {
        Camera.requestMicrophonePermissionsAsync()
            .then(({ status }) => setHasPermission(status === 'granted'))
            .catch((err) => console.error(`requestMicrophonePermissionAsync failed:`, err));
    }, []);

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
                            onPress={() => {
                                if (cameraRef.current) {
                                    cameraRef.current
                                        .takePictureAsync()
                                        .then(async (photo) => {
                                            await uploadPhoto(photo.uri);
                                            onFinish(false);
                                        })
                                        .catch((err) =>
                                            console.error(`takePictureAsync failed:`, err)
                                        );
                                }
                            }}
                        >
                            <View style={[styles.outerCirclePhoto]}>
                                <View style={[styles.innerCirclePhoto]}></View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.flexEl]}
                            onPress={() => {
                                if (!cameraRef.current) {
                                    return;
                                }

                                if (!recording) {
                                    setRecording(true);
                                    cameraRef.current
                                        .recordAsync()
                                        .then(async ({ uri }) => {
                                            await uploadVideo(uri);
                                            onFinish(false);
                                        })
                                        .catch((err) =>
                                            console.error('camera recording failed', err)
                                        );
                                } else {
                                    setRecording(false);
                                    cameraRef.current.stopRecording();
                                }
                            }}
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
