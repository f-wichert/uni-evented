import { useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { useSafeAreaFrame } from 'react-native-safe-area-context';

import { Event } from '../models';
import MediaCarousel from './MediaCarousel';

interface Props {
    eventData: Event[];
    navigateDetail: (id: string) => void;
}

export default function EventCarousel({ eventData, navigateDetail }: Props) {
    const frame = useSafeAreaFrame();

    const outerCarousel = useRef<any>(null);
    const [activeOuterIndex, setActiveOuterIndex] = useState<number>(0);

    const [isPlay, setIsPlay] = useState<boolean>(true);
    const [isMute, setIsMute] = useState<boolean>(true);

    const nextOuterItem = () => {
        if (checkIfLastEvent()) return;
        // console.log(`go to next outer item: old indizes: ${innerCarousel.current[activeOuterIndex].getCurrentIndex()} | ${outerCarousel.current?.getCurrentIndex()}`);
        outerCarousel.current.next();
        // set active outer index
        setActiveOuterIndex(outerCarousel.current?.getCurrentIndex());
        // console.log(`go to next outer item: new indizes: ${innerCarousel.current[activeOuterIndex].getCurrentIndex()} | ${outerCarousel.current?.getCurrentIndex()}`);
    };

    const onOuterCarouselSwipe = () => {
        // update outer index state on swipe
        // on swipe the index is already updated by the library before we can check if the previous element was the last one
        setActiveOuterIndex(outerCarousel.current?.getCurrentIndex());
    };

    const checkIfLastEvent = () => {
        return outerCarousel.current.getCurrentIndex() === eventData.length - 1;
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
                return (
                    <MediaCarousel
                        item={item}
                        isPlay={isPlay}
                        isMute={isMute}
                        setIsPlay={setIsPlay}
                        setIsMute={setIsMute}
                        navigateDetail={navigateDetail}
                        discover={true}
                        outerIndex={outerIndex}
                        activeOuterIndex={activeOuterIndex}
                        nextOuterItem={nextOuterItem}
                    />
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
