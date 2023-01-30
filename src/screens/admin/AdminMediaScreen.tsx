import { ResizeMode } from 'expo-av';
import VideoPlayer from 'expo-video-player';
import React, { useEffect, useState } from 'react';
import { AppState, Image, ScrollView, StyleSheet, View } from 'react-native';
import { NodePlayerView } from 'react-native-nodemediaclient';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Cell, Section, TableView } from 'react-native-tableview-simple';
import { useCallbackRef } from 'use-callback-ref';

import Separator from '../../components/Separator';
import { MediaManager } from '../../models';
import { ProfileStackNavProps } from '../../nav/types';
import { asyncHandler, baseHeaders, request } from '../../util';
import { confirmationAlert, getCellIcon } from './util';

export default function AdminMediaScreen({
    navigation,
    route,
}: ProfileStackNavProps<'AdminMediaScreen'>) {
    const [media, setMedia] = useState(route.params.media);

    const nodePlayerViewRef = useCallbackRef<NodePlayerView>(null, (_, oldValue) => {
        oldValue && oldValue.stop();
    });

    useEffect(() => {
        const subscription = AppState.addEventListener('change', (nextState) => {
            if (nextState === 'background' && nodePlayerViewRef.current) {
                nodePlayerViewRef.current.stop();
            }
        });

        return () => {
            subscription.remove();
        };
    }, []);

    const deleteMedia = () => {
        confirmationAlert(
            'Confirm Media Deletion',
            `Are you sure that you want to permanently delete this ${media.type}?`,
            asyncHandler(async () => {
                await request('POST', '/admin/media/delete', { mediaId: media.id });
                navigation.goBack();
            })
        );
    };

    return (
        <SafeAreaProvider>
            <ScrollView alwaysBounceVertical={false}>
                <View style={styles.container}>
                    {media.type === 'image' && (
                        <Image
                            source={{
                                uri: MediaManager.src(media),
                                headers: baseHeaders,
                            }}
                            style={styles.image}
                        />
                    )}
                    {media.type === 'video' && (
                        <VideoPlayer
                            videoProps={{
                                source: {
                                    uri: MediaManager.src(media),
                                    headers: baseHeaders,
                                },
                                resizeMode: ResizeMode.CONTAIN,
                                isLooping: true,
                            }}
                        />
                    )}
                    {media.type === 'livestream' && (
                        <NodePlayerView
                            ref={nodePlayerViewRef}
                            style={{ flex: 1 }}
                            inputUrl={MediaManager.src(media)}
                            scaleMode="ScaleAspectFill"
                            bufferTime={300}
                            maxBufferTime={1000}
                            autoplay={true}
                        />
                    )}
                </View>
                <Separator style={styles.separator} />
                <TableView style={styles.table}>
                    <Section>
                        <Cell
                            image={getCellIcon('trash-bin-outline', 'red')}
                            title="Delete Media"
                            accessory="DisclosureIndicator"
                            onPress={deleteMedia}
                        />
                    </Section>
                </TableView>
            </ScrollView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    video: {
        flex: 1,
    },
    image: {
        flex: 1,
        width: 350,
        height: 450,
    },
    tableContainer: {
        // height: '100%',
    },
    table: {
        width: '100%',
    },
    separator: {
        backgroundColor: 'black',
    },
});
