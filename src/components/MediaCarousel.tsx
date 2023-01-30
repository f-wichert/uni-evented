import Ionicons from '@expo/vector-icons/Ionicons';
import { useIsFocused } from '@react-navigation/native';
import { useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { useSafeAreaFrame } from 'react-native-safe-area-context';

import { Event } from '../models';
import { useMediaFetch } from '../state/event';
import ImageDiscover from './ImageDiscover';
import LiveDiscover from './LiveDiscover';
import VideoDiscover from './VideoDiscover';

interface Props {
    item: Event;
    isPlay: boolean;
    isMute: boolean;
    isOpenQuality: boolean;
    setIsPlay: (val: boolean) => void;
    setIsMute: (val: boolean) => void;
    quality: 'auto' | '720' | '480' | '360';
    setQuality: (val: 'auto' | '720' | '480' | '360') => void;
    setIsOpenQuality: (val: boolean) => void;
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
    isOpenQuality,
    setIsPlay,
    setIsMute,
    setIsOpenQuality,
    quality,
    setQuality,
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

    // TODO: force refresh on screen focus to get newest media?
    const { media } = useMediaFetch(item.id);

    if (!media) {
        // TODO: improve this, inline styles are bad I guess
        return (
            <View
                style={{
                    width: frame.width,
                    height: frame.height,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <ActivityIndicator size="large" />
            </View>
        );
    }

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
        return carousel.current.getCurrentIndex() === media.length - 1;
    };

    const nextInnerItem = () => {
        carousel.current.next();
        setActiveInnerIndex(carousel.current.getCurrentIndex());
    };

    const prevInnerItem = () => {
        carousel.current.prev();
        setActiveInnerIndex(carousel.current.getCurrentIndex());
    };

    return (
        <>
            {media.length !== 0 ? (
                <>
                    <Carousel
                        vertical={false}
                        width={frame.width}
                        height={frame.height}
                        autoPlay={false}
                        loop={false}
                        data={media}
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
                                    {item.type === 'video' && (
                                        <>
                                            <VideoDiscover
                                                item={item}
                                                navigateDetail={navigateDetail}
                                                isPlay={shouldThisSpecificVideoPlay}
                                                isMute={isMute}
                                                // setDuration={setDuration}
                                                // setPosition={setPosition}
                                                finishedVideo={onFinishedVideo}
                                                quality={quality}
                                            />
                                            <Ionicons
                                                name={'videocam-outline'}
                                                size={25}
                                                style={styles.typeIcon}
                                                color={'white'}
                                            />
                                        </>
                                    )}
                                    {item.type === 'image' && (
                                        <>
                                            <ImageDiscover
                                                item={item}
                                                navigateDetail={navigateDetail}
                                                quality={quality}
                                            />
                                            <Ionicons
                                                name={'image-outline'}
                                                size={25}
                                                style={styles.typeIcon}
                                                color={'white'}
                                            />
                                        </>
                                    )}
                                    {item.type === 'livestream' && (
                                        <>
                                            <LiveDiscover
                                                item={item}
                                                isMute={isMute}
                                                isPlay={shouldThisSpecificVideoPlay}
                                                navigateDetail={navigateDetail}
                                            />
                                            <Ionicons
                                                name={'pulse-outline'}
                                                size={25}
                                                style={styles.typeIcon}
                                                color={'white'}
                                            />
                                        </>
                                    )}
                                </>
                            );
                        }}
                    />
                    {new Array(media.length).fill(0).map((el, index) => (
                        <View
                            style={{
                                ...styles.indicator,
                                width: frame.width / media.length,
                                left: (index * frame.width) / media.length,
                                opacity: index === activeInnerIndex ? 1 : 0.5,
                            }}
                            key={index}
                        />
                    ))}
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
                    <TouchableOpacity onPress={() => setIsMute(!isMute)} style={styles.mute}>
                        <Ionicons
                            name={isMute ? 'volume-mute' : 'volume-high'}
                            size={36}
                            color="white"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setIsOpenQuality(!isOpenQuality)}
                        style={styles.qualityButton}
                    >
                        <Ionicons
                            name={isOpenQuality ? 'settings' : 'settings-outline'}
                            size={36}
                            color="white"
                        />
                    </TouchableOpacity>
                    {isOpenQuality ? (
                        <View style={styles.qualityView}>
                            <TouchableOpacity
                                style={styles.qualityOption}
                                onPress={() => setQuality('auto')}
                            >
                                <Text
                                    style={{
                                        ...styles.qualityText,
                                        opacity: quality === 'auto' ? 1 : 0.25,
                                    }}
                                >
                                    Auto
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.qualityOption}
                                onPress={() => setQuality('720')}
                            >
                                <Text
                                    style={{
                                        ...styles.qualityText,
                                        opacity: quality === '720' ? 1 : 0.25,
                                    }}
                                >
                                    720p
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.qualityOption}
                                onPress={() => setQuality('480')}
                            >
                                <Text
                                    style={{
                                        ...styles.qualityText,
                                        opacity: quality === '480' ? 1 : 0.25,
                                    }}
                                >
                                    480p
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.qualityOption}
                                onPress={() => setQuality('360')}
                            >
                                <Text
                                    style={{
                                        ...styles.qualityText,
                                        opacity: quality === '360' ? 1 : 0.25,
                                    }}
                                >
                                    360p
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ) : null}
                </>
            ) : (
                <>
                    <View
                        style={{ ...styles.sadContainer, height: frame.height, width: frame.width }}
                    >
                        <Ionicons
                            name="sad-outline"
                            size={50}
                            color="black"
                            style={styles.sadIcon}
                        />
                        <Text style={styles.sadText}>
                            Seems like there are no clips for this event right now...
                        </Text>
                    </View>
                </>
            )}
            <TouchableOpacity
                style={styles.headerContainer}
                onPress={() => navigateDetail(item.id)}
            >
                <Text style={styles.eventHeader}>
                    {item.name.length >= 25 ? item.name.slice(0, 22) + '...' : item.name}
                </Text>
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
        right: 20,
        bottom: 15,
    },
    qualityButton: {
        position: 'absolute',
        color: 'white',
        left: 20,
        bottom: 15,
    },
    qualityView: {
        position: 'absolute',
        color: 'white',
        left: 12.5,
        bottom: 60,
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 10,
        backgroundColor: 'black',
    },
    qualityOption: {
        padding: 10,
    },
    qualityText: {
        color: 'white',
        textAlign: 'center',
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
    sadContainer: {
        backgroundColor: 'lightgrey',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sadIcon: {
        marginBottom: 20,
    },
    sadText: {
        fontSize: 20,
    },
    typeIcon: {
        position: 'absolute',
        top: 25,
        right: 10,
    },
});
