import { useRef } from 'react';
import Carousel from 'react-native-reanimated-carousel';
import { useSafeAreaFrame } from 'react-native-safe-area-context';

import { ExtendedMedia } from '../types';
import ImageDiscover from './ImageDiscover';
import VideoDiscover from './VideoDiscover';

interface Props {
    media: ExtendedMedia[];
    navigateDetail: (id: string) => void;
}

export default function MediaCarousel({ media, navigateDetail }: Props) {
    const frame = useSafeAreaFrame();

    const carousel = useRef(null);

    const nextItem = () => {
        carousel.current.next({ animation: true });
    };

    const prevItem = () => {
        carousel.current.prev({ animation: true });
    };

    return (
        <Carousel
            vertical={false}
            width={frame.width}
            height={frame.height}
            autoPlay={false}
            loop={false}
            data={media}
            scrollAnimationDuration={200}
            ref={carousel}
            enabled={true}
            renderItem={({ item }) => (
                // carousel stack - bundle videos for each event
                <Carousel
                    vertical={false}
                    width={frame.width}
                    height={frame.height}
                    autoPlay={false}
                    loop={false}
                    data={media}
                    scrollAnimationDuration={200}
                    ref={carousel}
                    enabled={false}
                    renderItem={({ item }) => (
                        <>
                            {item.type === 'video' ? (
                                <VideoDiscover
                                    discoverData={item}
                                    navigateDetail={navigateDetail}
                                    nextItem={nextItem}
                                    prevItem={prevItem}
                                />
                            ) : (
                                <ImageDiscover
                                    discoverData={item}
                                    navigateDetail={navigateDetail}
                                />
                            )}
                        </>
                    )}
                />
            )}
        />
    );
}
