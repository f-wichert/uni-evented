import Ionicons from '@expo/vector-icons/Ionicons';
import { useIsFocused } from '@react-navigation/native';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { useSafeAreaFrame } from 'react-native-safe-area-context';

import { Event } from '../models';
import ImageDiscover from './ImageDiscover';
import VideoDiscover from './VideoDiscover';

interface Props {
    eventData: Event[];
    navigateDetail: (id: string) => void;
}

export default function MediaCarousel({ eventData, navigateDetail }: Props) {
    const frame = useSafeAreaFrame();

    const outerCarousel = useRef<any>(null);
    const innerCarousel = useRef<any[]>([]);
    const [isMute, setIsMute] = useState<boolean>(true);
    const [isPlay, setIsPlay] = useState<boolean>(true);
    const [activeInnerIndex, setActiveInnerIndex] = useState<number>(0);
    const [activeOuterIndex, setActiveOuterIndex] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);
    const [position, setPosition] = useState<number>(0);
    const isFocused = useIsFocused();

    useEffect(() => {
        // determine how many inner carousels exist depending on amount of events
        innerCarousel.current = innerCarousel.current.slice(0, eventData.length);
    }, [eventData]);

    const nextInnerItem = () => {
        // console.log(`go to next inner item: old indizes: ${innerCarousel.current[activeOuterIndex].getCurrentIndex()} | ${outerCarousel.current?.getCurrentIndex()}`);
        // if it's last media of event go to next outer item -> this allows the next tap to also change the event
        // if (checkIfLastMedia()) {
        //     nextOuterItem();
        //     return;
        // }
        // console.log(`index before next: ${innerCarousel.current[activeOuterIndex].getCurrentIndex()}`);
        innerCarousel.current[activeOuterIndex].next();
        // console.log(`index after next: ${innerCarousel.current[activeOuterIndex].getCurrentIndex()}`);
        setActiveInnerIndex(innerCarousel.current[activeOuterIndex].getCurrentIndex());
        // console.log(`go to next inner item: new indizes: ${innerCarousel.current[activeOuterIndex].getCurrentIndex()} | ${outerCarousel.current?.getCurrentIndex()}`);
    };

    const prevInnerItem = () => {
        innerCarousel.current[activeOuterIndex].prev();
        setActiveInnerIndex(innerCarousel.current[activeOuterIndex].getCurrentIndex());
    };

    const nextOuterItem = () => {
        // console.log(`go to next outer item: old indizes: ${innerCarousel.current[activeOuterIndex].getCurrentIndex()} | ${outerCarousel.current?.getCurrentIndex()}`);
        if (!checkIfLastEvent()) {
            outerCarousel.current.next();
            // set active outer index
            setActiveOuterIndex(outerCarousel.current?.getCurrentIndex());
            // if current event is not last event, then reset inner carousel
            resetInnerCarousel();
        } else {
            outerCarousel.current.next();
            // set active outer index
            setActiveOuterIndex(outerCarousel.current?.getCurrentIndex());
        }

        // console.log(`go to next outer item: new indizes: ${innerCarousel.current[activeOuterIndex].getCurrentIndex()} | ${outerCarousel.current?.getCurrentIndex()}`);
    };

    const onOuterCarouselSwipe = () => {
        // update outer index state on swipe
        // on swipe the index is already updated by the library before we can check if the previous element was the last one
        setActiveOuterIndex(outerCarousel.current?.getCurrentIndex());
        // if current event is not last event, then reset inner carousel
        resetInnerCarousel();
    };

    const onFinishedVideo = () => {
        // if current video is not last media of event, then go to next inner item
        if (!checkIfLastMedia()) {
            // console.log('video is finished -> next inner item');
            nextInnerItem();
            return;
        }
        // console.log('video is finished -> next outer item');
        // current media is last media of event, so we go to the next outer item (event)
        nextOuterItem();
    };

    const checkIfLastMedia = () => {
        return (
            innerCarousel.current[activeOuterIndex].getCurrentIndex() ===
            eventData[activeOuterIndex].media?.length! - 1
        );
    };

    const checkIfLastEvent = () => {
        return outerCarousel.current.getCurrentIndex() === eventData.length - 1;
    };

    const resetInnerCarousel = () => {
        // console.log(`call reset inner carousel -> reset index of ${outerCarousel.current?.getCurrentIndex()}`);
        // set the inner carousel index to 0
        innerCarousel.current[activeOuterIndex].scrollTo({ index: 0 });
        // reset saved inner index in state
        setActiveInnerIndex(0);
    };

    return (
        <Carousel
            vertical={false}
            width={frame.width}
            height={frame.height}
            autoPlay={false}
            loop={false}
            data={eventData}
            scrollAnimationDuration={200}
            ref={outerCarousel}
            enabled={true}
            onSnapToItem={onOuterCarouselSwipe}
            renderItem={({ item, index: outerIndex }) => {
                let mediaAmount = item.media!.length;
                return (
                    <>
                        {/* inner Carousel */}
                        <Carousel
                            vertical={false}
                            width={frame.width}
                            height={frame.height}
                            autoPlay={false}
                            loop={false}
                            data={item.media!}
                            scrollAnimationDuration={200}
                            enabled={false}
                            ref={(el) => (innerCarousel.current[outerIndex] = el)}
                            renderItem={({ item, index: innerIndex }) => {
                                // provide logic if a specific video should play
                                // only play video when the current index in the carousel is correct and the screen is focused
                                // outerCarousel.getCurrentIndex();
                                const shouldThisSpecificVideoPlay =
                                    isPlay &&
                                    innerIndex === activeInnerIndex &&
                                    outerIndex === activeOuterIndex &&
                                    isFocused;
                                return (
                                    <>
                                        {item.type === 'video' ? (
                                            <VideoDiscover
                                                discoverData={item}
                                                navigateDetail={navigateDetail}
                                                isPlay={shouldThisSpecificVideoPlay}
                                                isMute={isMute}
                                                setDuration={setDuration}
                                                setPosition={setPosition}
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
                                    width: frame.width / mediaAmount,
                                    left: (index * frame.width) / mediaAmount,
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
                            onPress={() => setIsPlay(!isPlay)}
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
                            <Ionicons
                                style={styles.eventIcon}
                                name="person"
                                size={20}
                                color="white"
                            />
                            <Text style={styles.eventHeader}>{item.name}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setIsMute(!isMute)} style={styles.mute}>
                            <Ionicons
                                name={isMute ? 'volume-mute' : 'volume-high'}
                                size={36}
                                color="white"
                            />
                        </TouchableOpacity>
                    </>
                );
            }}
        />
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
        right: 0,
        bottom: 0,
        marginRight: 15,
        marginBottom: 15,
    },
    indicator: {
        position: 'absolute',
        height: 5,
        top: 0,
        backgroundColor: 'white',
        borderRadius: 15,
        marginTop: 10,
    },
    headerContainer: {
        position: 'absolute',
        top: 0,
        marginTop: 25,
        marginLeft: 10,
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
