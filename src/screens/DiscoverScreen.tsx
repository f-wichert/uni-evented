import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import MediaCarousel from '../components/MediaCarousel';
import { MediaManager } from '../models';
import { TabNavProps } from '../nav/types';
import { ExtendedMedia, Media } from '../types';
import { asyncHandler, request } from '../util';

function DiscoverScreen({ navigation }: TabNavProps<'Discover'>) {
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
    }, [navigation]);

    const [media, setMedia] = useState<ExtendedMedia[]>([]);

    async function updateMedia() {
        const responseData = await request('GET', 'info/all_media');
        const data = responseData.media as Media[];
        const media: ExtendedMedia[] = data
            .filter((el) => el.fileAvailable)
            .map((el) => ({ ...el, src: MediaManager.src(el, 'high') }));
        setMedia(media);
    }

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
                // wrap carousel in another safearea provider since the carousel
                // needs a pixel height and doesn't support `height: '100%'`
                <SafeAreaProvider>
                    <GestureHandlerRootView>
                        <MediaCarousel media={media} navigateDetail={navigateDetail} />
                    </GestureHandlerRootView>
                </SafeAreaProvider>
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
        height: '100%',
        width: '100%',
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
