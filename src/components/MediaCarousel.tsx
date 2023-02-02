import Ionicons from '@expo/vector-icons/Ionicons';
import { useIsFocused } from '@react-navigation/native';
import { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
import { useSafeAreaFrame } from 'react-native-safe-area-context';

import yellowSplash from '../../assets/yellow_splash.png';
import { Event, UserManager } from '../models';
import { useMediaFetch } from '../state/event';
import ImageDiscover from './ImageDiscover';
import LiveDiscover from './LiveDiscover';
import VideoDiscover from './VideoDiscover';

interface Props {
    item: Event;
    // only used by/implemented for discover screen, not needed for detailview
    navigateDetail?: (id: string) => void;
    isActiveOuterItem?: boolean;
    showNextOuterItem?: () => void;
}

export default function MediaCarousel({
    item,
    // default values if it's not implemented in discover screen
    navigateDetail,
    isActiveOuterItem = true,
    showNextOuterItem,
}: Props) {
    const frame = useSafeAreaFrame();

    const carousel = useRef<ICarouselInstance | null>(null);
    const [activeInnerIndex, setActiveInnerIndex] = useState<number>(0);
    const isFocused = useIsFocused();

    const [isPlay, setIsPlay] = useState<boolean>(true);
    const [isMute, setIsMute] = useState<boolean>(true);
    const [isOpenQuality, setIsOpenQuality] = useState<boolean>(false);
    const [quality, setQuality] = useState<'auto' | '720' | '480' | '360'>('auto');

    const { media } = useMediaFetch(item.id);
    const hostAvatarUrl = UserManager.getAvatarUrl(item.host);

    const isLastItem = useCallback(() => {
        if (media?.length === undefined) return false;
        return carousel.current?.getCurrentIndex() === media.length - 1;
    }, [media?.length]);

    const nextInnerItem = useCallback(() => {
        if (!carousel.current) return;
        carousel.current.next();
        setActiveInnerIndex(carousel.current.getCurrentIndex());
    }, []);

    const prevInnerItem = useCallback(() => {
        if (!carousel.current) return;
        carousel.current?.prev();
        setActiveInnerIndex(carousel.current.getCurrentIndex());
    }, []);

    const onFinishedVideo = useCallback(() => {
        // if current video is not last media of event, then go to next inner item
        if (!isLastItem()) {
            nextInnerItem();
            return;
        }
        // current media is last media of event, so we go to the next outer item (event)
        // only call this if it's implemented in the discover screen
        showNextOuterItem?.();
    }, [isLastItem, nextInnerItem, showNextOuterItem]);

    const maybeNavigateDetail = useCallback(() => {
        navigateDetail?.(item.id);
    }, [navigateDetail, item.id]);

    if (!media) {
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
                                isActiveOuterItem &&
                                innerIndex === activeInnerIndex &&
                                isPlay;
                            return (
                                <>
                                    {item.type === 'video' && (
                                        <>
                                            <VideoDiscover
                                                item={item}
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
                                            <ImageDiscover item={item} quality={quality} />
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
            <TouchableOpacity style={styles.headerContainer} onPress={maybeNavigateDetail}>
                <Image
                    style={styles.eventIcon}
                    source={hostAvatarUrl ? { uri: hostAvatarUrl } : yellowSplash}
                />
                <Text style={styles.eventHeader} numberOfLines={1} ellipsizeMode="tail">
                    {item.name}
                </Text>
            </TouchableOpacity>
        </>
    );
}

const styles = StyleSheet.create({
    playPause: {
        position: 'absolute',
        // backgroundColor: 'green',
        // opacity: 0.35,
    },
    nextVideo: {
        position: 'absolute',
        // backgroundColor: 'blue',
        // opacity: 0.35,
        right: 0,
    },
    prevVideo: {
        position: 'absolute',
        // backgroundColor: 'red',
        // opacity: 0.35,
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
        left: 0,
        marginHorizontal: 20,
        display: 'flex',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
    },
    eventIcon: {
        width: 35,
        height: 35,
        borderRadius: 100,
        borderWidth: 1,
        borderColor: 'white',
    },
    eventHeader: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
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
