import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { ResizeMode, Video } from 'expo-av';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { baseHeaders } from '../util';

declare type Props = {
    discoverData: { src: string };
    navigation: NavigationProp<ParamListBase>;
};

function VideoDiscover({ discoverData, navigation }: Props) {
    const video = React.useRef(null);
    const [status, setStatus] = React.useState({});

    return (
        <View style={styles.container}>
            <Video
                ref={video}
                style={styles.video}
                source={{
                    uri: discoverData.src,
                    headers: {
                        ...baseHeaders,
                    },
                }}
                useNativeControls
                resizeMode={ResizeMode.CONTAIN}
                isLooping
                onPlaybackStatusUpdate={(status) => setStatus(() => status)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderRadius: 8,
        margin: 5,
    },
    video: {
        width: 300,
        height: 450,
        // flex: 1
    },
});

export default VideoDiscover;
