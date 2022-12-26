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

    return (
        <Carousel
            vertical={true}
            width={frame.width}
            height={frame.height}
            autoPlay={false}
            loop={false}
            data={media}
            scrollAnimationDuration={450}
            renderItem={({ item }) => (
                <>
                    {item.type === 'video' ? (
                        <VideoDiscover discoverData={item} navigateDetail={navigateDetail} />
                    ) : (
                        <ImageDiscover discoverData={item} navigateDetail={navigateDetail} />
                    )}
                </>
            )}
        />
    );
}
