import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { NodePlayerView } from 'react-native-nodemediaclient';
import { useCallbackRef } from 'use-callback-ref';
import { Media, MediaManager } from '../models';

declare type Props = {
    item: Media;
    navigateDetail: (id: string) => void;
    isPlay: boolean;
    isMute: boolean;
};

function VideoDiscover({ item, navigateDetail, isPlay, isMute }: Props) {
    const nodePlayerViewRef = useCallbackRef<NodePlayerView>(null, (_, oldValue) => {
        oldValue && oldValue.stop();
    });

    useEffect(() => {
        if (!nodePlayerViewRef) return;
        nodePlayerViewRef.current[isPlay ? 'start' : 'pause']();
    }, [isPlay]);

    return (
        <View style={[styles.container]}>
            <NodePlayerView
                ref={nodePlayerViewRef}
                style={{ flex: 1 }}
                inputUrl={MediaManager.src(item)}
                scaleMode="ScaleAspectFill"
                bufferTime={300}
                maxBufferTime={1000}
                autoplay={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
    },
});

export default VideoDiscover;
