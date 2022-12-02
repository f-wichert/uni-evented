import { Video } from 'expo-av';
import React from 'react';
import { Button, StyleSheet, View } from 'react-native';


function VideoDiscover(props) {
    const video = React.useRef(null);
    const [status, setStatus] = React.useState({});

    return (
        <View style={styles.container}>
            <Video
                ref={video}
                style={styles.video}
                source={{
                    uri: props.discoverData.src,
                }}
                useNativeControls
                resizeMode="contain"
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
        margin: 5
    },
    video: {
        width: 300,
        height: 450
        // flex: 1
    },
});

export default VideoDiscover;
