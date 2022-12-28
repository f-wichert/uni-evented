import Ionicons from '@expo/vector-icons/Ionicons';
import { AVPlaybackStatusToSet, ResizeMode } from 'expo-av';
import VideoPlayer from 'expo-video-player';
import { useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaFrame } from 'react-native-safe-area-context';

import { baseHeaders } from '../util';

declare type Props = {
    discoverData: { src: string; id: string };
    navigateDetail: (id: string) => void;
    nextItem: () => void;
    prevItem: () => void;
};

function VideoDiscover({ discoverData, navigateDetail, nextItem, prevItem }: Props) {
    const video = useRef(null);
    const [status, setStatus] = useState<AVPlaybackStatusToSet | null>(null);
    const [isMute, setIsMute] = useState<boolean>(true);
    // const [score, setScore] = React.useState(Math.floor(Math.random() * 25));

    const frame = useSafeAreaFrame();

    const playPauseVideo = async () => {
        const status = await video.current.getStatusAsync();
        video.current.setStatusAsync({
            shouldPlay: !status.shouldPlay,
        });
    };

    const prevVideo = () => {
        console.log('prev Video clicked');
    };

    // const upvote = () => {
    //     setScore(score + 1);
    //     updateScore('+');
    // };

    // const downvote = () => {
    //     setScore(score - 1);
    //     updateScore('-');
    // };

    // const updateScore = (vote: '+' | '-') => {
    //     // TODO: update score and send it to server on vote
    //     return;
    //     asyncHandler(async () => {
    //         await request('POST', 'event/vote', getToken(), { id: discoverData.id, vote: vote });
    //     });
    // };

    return (
        <View style={styles.container}>
            <VideoPlayer
                videoProps={{
                    source: {
                        uri: discoverData.src,
                        headers: baseHeaders,
                    },
                    resizeMode: ResizeMode.CONTAIN,
                    shouldPlay: true,
                    isMuted: isMute,
                    isLooping: false,
                    ref: video,
                    // useNativeControls: true,
                    // onPlaybackStatusUpdate: (status: AVPlaybackStatusToSet) => setStatus(() => status),
                }}
                header={<Text style={{ color: '#FFF' }}>Custom title</Text>}
                style={{ ...styles.video, width: frame.width }}
                icon={{
                    play: <></>,
                    pause: <></>,
                    replay: <></>,
                }}
            />
            <TouchableOpacity
                activeOpacity={1}
                style={{ ...styles.playPause, width: frame.width / 2, height: frame.height }}
                onPress={playPauseVideo}
            />
            <TouchableOpacity
                activeOpacity={1}
                style={{ ...styles.nextVideo, width: frame.width / 4, height: frame.height }}
                onPress={nextItem}
            />
            <TouchableOpacity
                activeOpacity={1}
                style={{ ...styles.prevVideo, width: frame.width / 4, height: frame.height }}
                onPress={prevItem}
            />
            <TouchableOpacity onPress={() => setIsMute(!isMute)} style={styles.mute}>
                <Ionicons name={isMute ? 'volume-mute' : 'volume-high'} size={36} color="white" />
            </TouchableOpacity>

            {/* <View style={{ ...styles.votingArea }}>
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
            </View> */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // borderWidth: 2,
        // borderRadius: 8,
        // margin: 5,
        // backgroundColor: 'green',
    },
    video: {
        flex: 1,
        borderRadius: 8,
        controlsBackgroundColor: 'transparent',
    },
    // votingArea: {
    //     width: 50,
    //     height: '100%',
    //     position: 'absolute',
    //     right: 0,
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     // backgroundColor: 'red'
    // },
    // voteIcon: {
    //     color: '#7d7d7d',
    // },
    playPause: {
        position: 'absolute',
    },
    nextVideo: {
        position: 'absolute',
        right: 0,
    },
    prevVideo: {
        position: 'absolute',
        left: 0,
    },
    mute: {
        position: 'absolute',
        color: 'white',
        right: 0,
        bottom: 0,
        marginRight: 15,
        marginBottom: 15,
    },
});

export default VideoDiscover;
