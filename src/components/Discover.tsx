import React from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import { Video, AVPlaybackStatus } from 'expo-av';

function Discover(props) {
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
                onPlaybackStatusUpdate={status => setStatus(() => status)}
            />
            <View style={styles.buttons}>
                <Button
                title={status.isPlaying ? 'Pause' : 'Play'}
                onPress={() =>
                    status.isPlaying ? video.current.pauseAsync() : video.current.playAsync()
                }
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'red',
        borderWidth: 2,
        borderRadius: 8,
        margin: 5
    },
    backgroundVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
    video: {
        width: 350,
        height: 450
        // flex: 1
    }
});

export default Discover;