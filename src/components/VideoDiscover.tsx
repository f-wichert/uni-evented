import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { ResizeMode, Video } from 'expo-av';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import LoginScreen from '../screens/LoginScreen'

declare type Props = {
    discoverData: { src: string };
    navigation: NavigationProp<ParamListBase>;
};

function VideoDiscover({ discoverData, navigation }: Props) {
    const video = React.useRef(null);
    const [status, setStatus] = React.useState({});

    const onPress = () => {navigation.navigate('')}

    return (
        <View style={styles.container}>
            <TouchableHighlight onPress={onPress}>
                <Video
                    ref={video}
                    style={styles.video}
                    source={{
                        uri: discoverData.src,
                    }}
                    useNativeControls
                    resizeMode={ResizeMode.CONTAIN}
                    isLooping
                    onPlaybackStatusUpdate={(status) => setStatus(() => status)}
                />
            </TouchableHighlight>
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
        backgroundColor: 'green',
    },
    video: {
        width: 300,
        height: 450,
        // flex: 1
    },
});

export default VideoDiscover;
