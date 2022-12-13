import { NavigationProp, ParamListBase } from '@react-navigation/native';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { ResizeMode, Video } from 'expo-av';

import { baseHeaders } from '../../util';

declare type Props = {
    discoverData: { src: string };
    navigation: NavigationProp<ParamListBase>;
    type: 'video' | 'image';
};

function DiscoverBase({ discoverData, navigation, type}: Props) {
    const video = React.useRef(null);
    const [status, setStatus] = React.useState({});

    return (
        <View style={styles.container}>
            { type == 'video' ?
                (
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
                ) : (
                    <Image
                        source={{
                            uri: discoverData.src,
                            headers: {
                                ...baseHeaders,
                            },
                        }}
                        style={styles.image}
                    />
                )

            }
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
    image: {
        width: 350,
        height: 450,
        // flex: 1
    },
    video: {
        width: 300,
        height: 450,
        // flex: 1
    },
});

export default DiscoverBase;
