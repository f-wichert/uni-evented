import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useCallback, useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Carousel from 'react-native-reanimated-carousel';

import ImageDiscover from '../components/ImageDiscover';
import VideoDiscover from '../components/VideoDiscover';
import { MediaManager } from '../models';
import { TabNavProps } from '../nav/TabNavigator';
import { getToken } from '../state/auth';
import { ExtendedMedia, Media } from '../types';
import { asyncHandler, request } from '../util';

type Props = TabNavProps<'Discover'>;

function DiscoverScreen({ navigation }: Props) {
    const [media, setMedia] = useState<ExtendedMedia[]>([]);

    async function updateMedia() {
        const responseData = await request('GET', 'info/all_media', getToken());
        const data = responseData.media as Media[];
        const media: ExtendedMedia[] = data
            .filter((el) => el.fileAvailable)
            .map((el) => ({ ...el, src: MediaManager.src(el, 'high') }));
        setMedia(media);
    }

    const width = Dimensions.get('window').width;
    // var height = Dimensions.get('window').height;
    var height = 700;

    useEffect(() => {
        // Use `setOptions` to update the button that we previously specified
        // Now the button includes an `onPress` handler to update the discoverData
        navigation.setOptions({
            headerRight: () => (
                <Ionicons
                    name="refresh-outline"
                    size={32}
                    color="black"
                    onPress={asyncHandler(updateMedia, { prefix: 'Failed to update media' })}
                    style={{
                        marginRight: 10,
                    }}
                />
            ),
        });

        // Get appropriate height for carousel
        height = Dimensions.get('window').height;
    }, [navigation, height]);

    const navigateDetail = useCallback(
        (id: string) => {
            // TODO
            console.warn('TODO: navigating to detail view from here does not work yet');
            // navigation.navigate('EventDetail', { eventId: id })
        },
        [navigation]
    );

    return (
        <View style={styles.container}>
            {media.length == 0 ? (
                <View style={styles.sadContainer}>
                    <Ionicons name="sad-outline" size={50} color="black" style={styles.sadIcon} />
                    <Text style={styles.sadText}>Seems like there are no clips right now...</Text>
                </View>
            ) : (
                <GestureHandlerRootView>
                    <Carousel
                        vertical={true}
                        width={width}
                        height={400}
                        autoPlay={false}
                        loop={false}
                        data={media}
                        scrollAnimationDuration={450}
                        renderItem={({ item, index }) => (
                            <>
                                {item.type === 'video' ? (
                                    <VideoDiscover
                                        discoverData={media[index]}
                                        navigateDetail={navigateDetail}
                                    />
                                ) : (
                                    <ImageDiscover
                                        discoverData={media[index]}
                                        navigateDetail={navigateDetail}
                                    />
                                )}
                            </>
                        )}
                    />
                </GestureHandlerRootView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    sadContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    sadIcon: {
        marginBottom: 20,
    },
    sadText: {
        fontSize: 20,
    },
});

export default DiscoverScreen;
