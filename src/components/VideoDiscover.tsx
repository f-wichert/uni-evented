import { AVPlaybackStatus, ResizeMode, Video } from 'expo-av';
import VideoPlayer from 'expo-video-player';
import { MutableRefObject, useCallback, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaFrame } from 'react-native-safe-area-context';

import { Media, MediaManager } from '../models';
import { baseHeaders, useAsyncEffects } from '../util';

declare type Props = {
    item: Media;
    isPlay: boolean;
    isMute: boolean;
    // setDuration: (dur: number) => void;
    // setPosition: (pos: number) => void;
    finishedVideo: () => void;
    quality?: 'auto' | '720' | '480' | '360';
};

function VideoDiscover({
    item,
    isPlay,
    isMute,
    quality,
    // setDuration,
    // setPosition,
    finishedVideo,
}: Props) {
    const video = useRef<Video | null>(null);
    // const [status, setStatus] = useState<AVPlaybackStatus | null>(null);

    const frame = useSafeAreaFrame();

    useAsyncEffects(async () => {
        // set play status for video
        await video.current?.setStatusAsync({
            shouldPlay: isPlay,
        });
        // // give duration and position to parent component
        // if (!status || !status.positionMillis || !status.durationMillis) return;
        // setPosition(status.positionMillis);
        // setDuration(status.durationMillis);
    }, [isPlay]);

    const updateStatus = useCallback(
        (playState: AVPlaybackStatus) => {
            // setStatus(playState);
            if (playState.isLoaded && playState.didJustFinish) finishedVideo();
        },
        [finishedVideo]
    );

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
                    ref: video as MutableRefObject<Video>,
                    useNativeControls: false,
                    progressUpdateIntervalMillis: 1000,
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
                playbackCallback={updateStatus}
            />
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
});

export default VideoDiscover;
