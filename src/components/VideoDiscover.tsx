import Ionicons from '@expo/vector-icons/Ionicons';
import { ResizeMode, Video } from 'expo-av';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { getToken } from '../state/auth';
import { asyncHandler, baseHeaders, request } from '../util';

declare type Props = {
    discoverData: { src: string; id: string };
    navigateDetail: (id: string) => void;
};

function VideoDiscover({ discoverData, navigateDetail }: Props) {
    const video = React.useRef(null);
    const [status, setStatus] = React.useState({});
    const [score, setScore] = React.useState(Math.floor(Math.random() * 25));
    const [dimensions, setDimensions] = useState({ height: 200, width: 350 });

    const upvote = () => {
        setScore(score + 1);
        updateScore('+');
    };

    const downvote = () => {
        setScore(score - 1);
        updateScore('-');
    };

    const upddateDimensions = (height: number, width: number) => {
        setDimensions({
            height: height,
            width: width,
        });
    };

    const updateScore = (vote: '+' | '-') => {
        // TODO: update score and send it to server on vote
        return;
        asyncHandler(async () => {
            await request('POST', 'event/vote', getToken(), { id: discoverData.id, vote: vote });
        });
    };

    return (
        <View
            style={styles.container}
            onLayout={(e) => {
                upddateDimensions(e.nativeEvent.layout.height, e.nativeEvent.layout.width);
            }}
        >
            <Video
                ref={video}
                style={{ ...styles.video, width: dimensions.width, height: dimensions.height }}
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
            <View style={{ ...styles.votingArea }}>
                <Ionicons style={styles.voteIcon} name="chevron-up" size={36} onPress={upvote} />
                <View>
                    <Text
                        style={{
                            fontWeight: 'bold',
                            color: '#c2c2c2',
                        }}
                    >
                        {score}
                    </Text>
                </View>
                <Ionicons
                    style={styles.voteIcon}
                    name="chevron-down"
                    size={36}
                    onPress={downvote}
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
        backgroundColor: 'green',
    },
    video: {
        flex: 1,
    },
    votingArea: {
        width: 50,
        height: '100%',
        position: 'absolute',
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    voteIcon: {
        color: '#7d7d7d',
    },
});

export default VideoDiscover;
