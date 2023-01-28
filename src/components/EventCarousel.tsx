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
    const [isOpenQuality, setIsOpenQuality] = useState<boolean>(false);
    const [quality, setQuality] = useState<'auto' | '720' | '480' | '360'>('auto');

    const nextOuterItem = () => {
        if (checkIfLastEvent()) return;
        outerCarousel.current.next();
        // set active outer index
        setActiveOuterIndex(outerCarousel.current?.getCurrentIndex());
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
                        isOpenQuality={isOpenQuality}
                        setIsOpenQuality={setIsOpenQuality}
                        quality={quality}
                        setQuality={setQuality}
                    />
                );
            }}
        />
    );
}

const styles = StyleSheet.create({});
