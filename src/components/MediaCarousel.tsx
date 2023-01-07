import Ionicons from '@expo/vector-icons/Ionicons';
import { useIsFocused } from '@react-navigation/native';
import { useRef, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { useSafeAreaFrame } from 'react-native-safe-area-context';
import urlJoin from 'url-join';

import yellowSplash from '../../assets/yellow_splash.png';
import config from '../config';
import { Event } from '../models';
import ImageDiscover from './ImageDiscover';
import VideoDiscover from './VideoDiscover';

interface Props {
    item: Event;
    isPlay: boolean;
    isMute: boolean;
    setIsPlay: (val: boolean) => void;
    setIsMute: (val: boolean) => void;
    navigateDetail?: (id: string) => void;
    discover?: boolean;
    outerIndex?: number;
    activeOuterIndex?: number;
    nextOuterItem?: () => void;
}

export default function MediaCarousel({
    item,
    isPlay,
    isMute,
    setIsPlay,
    setIsMute,
    // default values if it's not implemented in discover screen
    navigateDetail = () => {},
    discover = false,
    activeOuterIndex = 0,
    outerIndex = 0,
    nextOuterItem = () => {},
}: Props) {
    const frame = useSafeAreaFrame();
    const carousel = useRef<any>(null);
    // const growAnim = useRef(new Animated.Value(0)).current;
    const [activeInnerIndex, setActiveInnerIndex] = useState<number>(0);
    // const [duration, setDuration] = useState<number>(0);
    // const [position, setPosition] = useState<number>(0);
    const isFocused = useIsFocused();

    const onFinishedVideo = () => {
        // if current video is not last media of event, then go to next inner item
        if (!checkIfLastMedia()) {
            nextInnerItem();
            return;
        }
        // current media is last media of event, so we go to the next outer item (event)
        // only call this if it's implemented in the discover screen
        discover && nextOuterItem();
    };

    const checkIfLastMedia = () => {
        return carousel.current.getCurrentIndex() === item.media?.length! - 1;
    };

    const nextInnerItem = () => {
        carousel.current.next();
        setActiveInnerIndex(carousel.current.getCurrentIndex());
    };

    const prevInnerItem = () => {
        carousel.current.prev();
        setActiveInnerIndex(carousel.current.getCurrentIndex());
    };

    // useEffect(
    //     () => startAnimation(),
    //     [growAnim, duration, position]);

    // const startAnimation = () => {
    //     Animated.timing(growAnim, {
    //         toValue: 1,
    //         duration: duration,
    //         useNativeDriver: true,
    //         easing: Easing.linear,
    //     }).reset();
    //     if (position && duration) {
    //         growAnim.setValue(position / duration);
    //     }
    //     Animated.timing(growAnim, {
    //         toValue: 1,
    //         duration: duration,
    //         useNativeDriver: true,
    //         easing: Easing.linear,
    //     }).start();
    // }

    // const stopAnimation = () => {
    //     Animated.timing(growAnim, {
    //         toValue: 1,
    //         duration: duration,
    //         useNativeDriver: true,
    //         easing: Easing.linear,
    //     }).stop();
    // }

    return (
        <>
            <Carousel
                vertical={false}
                width={frame.width}
                height={frame.height}
                autoPlay={false}
                loop={false}
                data={item.media!}
                scrollAnimationDuration={200}
                enabled={false}
                ref={carousel}
                renderItem={({ item, index: innerIndex }) => {
                    // provide logic if a specific video should play
                    // only play video when the current index in the carousel is correct and the screen is focused
                    const shouldThisSpecificVideoPlay =
                        isFocused &&
                        outerIndex === activeOuterIndex &&
                        innerIndex === activeInnerIndex &&
                        isPlay;
                    return (
                        <>
                            {item.type === 'video' ? (
                                <VideoDiscover
                                    discoverData={item}
                                    navigateDetail={navigateDetail}
                                    isPlay={shouldThisSpecificVideoPlay}
                                    isMute={isMute}
                                    // setDuration={setDuration}
                                    // setPosition={setPosition}
                                    finishedVideo={onFinishedVideo}
                                />
                            ) : (
                                <ImageDiscover
                                    discoverData={item}
                                    navigateDetail={navigateDetail}
                                />
                            )}
                        </>
                    );
                }}
            />
            {new Array(2).fill(0).map((el, index) => (
                <View
                    style={{
                        ...styles.indicator,
                        width: frame.width / item.media!.length,
                        left: (index * frame.width) / item.media!.length,
                        opacity: index === activeInnerIndex ? 1 : 0.5,
                    }}
                    key={index}
                />
            ))}
            {/* {new Array(2).fill(0).map((el, index) => (
                <View
                    style={{
                        ...styles.indicator,
                        width: frame.width / item.media!.length,
                        left: (index * frame.width) / item.media!.length,
                        opacity: 0.5,
                    }}
                    key={index}
                />

            ))}
            <Animated.View
                style={{
                    ...styles.indicator,
                    width: frame.width / item.media!.length,
                    left: ((activeInnerIndex - 0.5) * frame.width) / item.media!.length,
                    opacity: outerIndex === activeOuterIndex ? 1 : 0,
                    transform: [{
                        translateX: growAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, (frame.width / item.media!.length) / 2]
                        })
                    },
                    {
                        scaleX: growAnim,
                    },
                    ]
                }}
            /> */}
            <TouchableOpacity
                activeOpacity={1}
                style={{
                    ...styles.playPause,
                    width: frame.width / 2,
                    height: frame.height,
                    left: frame.width / 4,
                }}
                onPress={() => {
                    setIsPlay(!isPlay);
                    // !isPlay ? startAnimation() : stopAnimation();
                }}
            />
            <TouchableOpacity
                activeOpacity={1}
                style={{
                    ...styles.nextVideo,
                    width: frame.width / 4,
                    height: frame.height,
                }}
                onPress={() => nextInnerItem()}
            />
            <TouchableOpacity
                activeOpacity={1}
                style={{
                    ...styles.prevVideo,
                    width: frame.width / 4,
                    height: frame.height,
                }}
                onPress={() => prevInnerItem()}
            />
            <TouchableOpacity
                style={styles.headerContainer}
                onPress={() => navigateDetail(item.id)}
            >
                <Image
                    style={styles.eventIcon}
                    source={{
                        uri: urlJoin(config.BASE_URL, 'media', 'avatar', item.hostId, 'high.jpg'),
                    }}
                    defaultSource={yellowSplash}
                />
                <Text style={styles.eventHeader}>
                    {item.name.length >= 25 ? item.name.slice(0, 22) + '...' : item.name}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsMute(!isMute)} style={styles.mute}>
                <Ionicons name={isMute ? 'volume-mute' : 'volume-high'} size={36} color="white" />
            </TouchableOpacity>
        </>
    );
}

const styles = StyleSheet.create({
    playPause: {
        position: 'absolute',
        // backgroundColor: 'lightgreen',
    },
    nextVideo: {
        position: 'absolute',
        // backgroundColor: 'lightblue',
        right: 0,
    },
    prevVideo: {
        position: 'absolute',
        // backgroundColor: 'lightyellow',
        left: 0,
    },
    mute: {
        position: 'absolute',
        color: 'white',
        right: 15,
        bottom: 15,
    },
    indicator: {
        position: 'absolute',
        height: 5,
        top: 10,
        backgroundColor: 'white',
        borderRadius: 15,
    },
    headerContainer: {
        position: 'absolute',
        top: 25,
        left: 10,
        display: 'flex',
        justifyContent: 'flex-start',
        flexDirection: 'row',
    },
    eventIcon: {
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 50,
        padding: 2,
        textAlign: 'center',
    },
    eventHeader: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
        marginLeft: 10,
    },
});
