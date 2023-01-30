import { useCallback, useRef, useState } from 'react';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
import { useSafeAreaFrame } from 'react-native-safe-area-context';

import { Event } from '../models';
import MediaCarousel from './MediaCarousel';

interface Props {
    eventData: Event[];
    navigateDetail: (id: string) => void;
}

export default function EventCarousel({ eventData, navigateDetail }: Props) {
    const frame = useSafeAreaFrame();

    const outerCarousel = useRef<ICarouselInstance | null>(null);
    const [activeOuterIndex, setActiveOuterIndex] = useState<number>(0);

    const isLastItem = useCallback(() => {
        return outerCarousel.current?.getCurrentIndex() === eventData.length - 1;
    }, [eventData.length]);

    const showNextOuterItem = useCallback(() => {
        if (!outerCarousel.current) return;
        if (isLastItem()) return;
        outerCarousel.current.next();
        // set active outer index
        setActiveOuterIndex(outerCarousel.current.getCurrentIndex());
    }, [isLastItem]);

    const onOuterCarouselSwipe = useCallback(() => {
        if (!outerCarousel.current) return;
        // update outer index state on swipe
        // on swipe the index is already updated by the library before we can check if the previous element was the last one
        setActiveOuterIndex(outerCarousel.current.getCurrentIndex());
    }, []);

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
                        navigateDetail={navigateDetail}
                        isActiveOuterItem={outerIndex === activeOuterIndex}
                        showNextOuterItem={showNextOuterItem}
                    />
                );
            }}
        />
    );
}
