import { AVPlaybackStatusToSet, ResizeMode } from 'expo-av';
import VideoPlayer from 'expo-video-player';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaFrame } from 'react-native-safe-area-context';

import { Media, MediaManager } from '../models';
import { baseHeaders } from '../util';

declare type Props = {
    item: Media;
    navigateDetail: (id: string) => void;
    isPlay: boolean;
    isMute: boolean;
    // setDuration: (dur: number) => void;
    // setPosition: (pos: number) => void;
    finishedVideo: () => void;
    quality?: 'auto' | '1080' | '720' | '480' | '360';
};

function VideoDiscover({
    item,
    navigateDetail,
    isPlay,
    isMute,
    quality,
    // setDuration,
    // setPosition,
    finishedVideo,
}: Props) {
    // I really can't manage to find the correct type for this thing -> checked the package
    const video = useRef<any>(null);
    const [status, setStatus] = useState<AVPlaybackStatusToSet | null>(null);
    // const [score, setScore] = React.useState(Math.floor(Math.random() * 25));

    const frame = useSafeAreaFrame();

    useEffect(() => {
        // set play status for video
        video.current &&
            video.current.setStatusAsync({
                shouldPlay: isPlay,
            });
        // // give duration and position to parent component
        // if (!status || !status.positionMillis || !status.durationMillis) return;
        // setPosition(status.positionMillis);
        // // might need AVPlaybackStatusSuccess here for durationMillis
        // setDuration(status.durationMillis);
    }, [isPlay]);

    const updateStatus = (playState: AVPlaybackStatusToSet) => {
        // setStatus(playState);
        // might need AVPlaybackStatusSuccess here for durationMillis
        playState.didJustFinish && finishedVideo();
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
                        uri: MediaManager.src(item, quality),
                        headers: baseHeaders,
                    },
                    resizeMode: ResizeMode.CONTAIN,
                    shouldPlay: isPlay,
                    isMuted: isMute,
                    isLooping: true,
                    ref: video,
                    useNativeControls: false,
                    progressUpdateIntervalMillis: 1000,
                    // onPlaybackStatusUpdate: (status: AVPlaybackStatusToSet) => setStatus(() => status),
                }}
                style={{ ...styles.video, width: frame.width }}
                slider={{ visible: false }}
                icon={{
                    play: <></>,
                    pause: <></>,
                    replay: <></>,
                    fullscreen: <></>,
                    exitFullscreen: <></>,
                }}
                playbackCallback={(playState: AVPlaybackStatusToSet) => updateStatus(playState)}
            />

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
});

export default VideoDiscover;
