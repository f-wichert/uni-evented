import Ionicons from '@expo/vector-icons/Ionicons';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Carousel from 'react-native-reanimated-carousel';

import ImageDiscover from '../components/ImageDiscover';
import VideoDiscover from '../components/VideoDiscover';
import config from '../config';
import { AuthContext } from '../contexts/authContext';
import { ExtendedMedia, Media } from '../types';
import { asyncHandler, request } from '../util';

declare type Props = {
    navigation: NavigationProp<ParamListBase>;
};

function DiscoverScreen({ navigation }: Props) {
    const [media, setMedia] = useState<ExtendedMedia[]>([]);
    const { state: authState } = useContext(AuthContext);

    async function updateMedia() {
        const responseData = await request('GET', 'info/all_media', authState.token);
        const data = responseData.media as Media[];
        const media: ExtendedMedia[] = data
            .filter((el) => el.fileAvailable)
            .map((el) => {
                const file = el.type == 'image' ? 'high.jpg' : 'index.m3u8';
                return {
                    ...el,
                    src: `${config.BASE_URL}/media/${el.type}/${el.id}/${file}`,
                };
            });
        setMedia(media);
    }

    const width = Dimensions.get('window').width;

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

    return (
        <View style={styles.container}>
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
                                    navigation={navigation}
                                />
                            ) : (
                                <ImageDiscover
                                    discoverData={media[index]}
                                    navigation={navigation}
                                />
                            )}
                        </>
                    )}
                />
            </GestureHandlerRootView>
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
});

export default DiscoverScreen;
