import React, { useEffect, useState } from 'react';
import { StyleSheet, Dimensions, Text, View, Button } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Carousel from 'react-native-reanimated-carousel';
import { request, BASE_URL } from '../util';
import VideoDiscover from '../components/VideoDiscover';
import ImageDiscover from '../components/ImageDiscover';
import Ionicons from '@expo/vector-icons/Ionicons';

function DiscoverScreen(props) {
    const [images, setImages] = useState([]);
    const [videos, setVideos] = useState([]);
    const [media, setMedia] = useState([]);

    async function updateMedia() {
        const data = await request('GET', 'info/all_media', null);
        // console.log(data);
        setVideos(
            data
                .filter(el => el.type === 'video')
                .filter(el => el.fileAvailable)
                .map(el => ({
                    id: el.id,
                    eventId: el.eventId,
                    type: el.type,
                    src: `${BASE_URL}/hls/${el.id}/index.m3u8`,
                }))
        );
        setImages(
            data
                .filter(el => el.type === 'image')
                .filter(el => el.fileAvailable)
                .map(el => ({
                    id: el.id,
                    eventId: el.eventId,
                    type: el.type,
                    src: `${BASE_URL}/hls/${el.id}/high.jpg`,
                }))
        );
        setMedia([...videos, ...images]);
    }

    const width = Dimensions.get('window').width;



    useEffect(() => {
        updateMedia();
        // Use `setOptions` to update the button that we previously specified
        // Now the button includes an `onPress` handler to update the discoverData
        props.navigation.setOptions({
            headerRight: () => (
                <Ionicons
                    name="refresh-outline"
                    size={32}
                    color="black"
                    onPress={() => updateMedia()}
                    style={{
                        marginRight: 10,
                    }}
                />

            ),
        });
    }, [props.navigation]);

    return (
        <View style={styles.container}>
            <GestureHandlerRootView>
                <Carousel
                    vertical={true}
                    width={width}
                    height={580}
                    autoPlay={false}
                    loop={false}
                    data={media}
                    scrollAnimationDuration={450}
                    renderItem={({ item, index }) => (
                        <>
                            {item.type === 'video' ?
                                < VideoDiscover
                                    discoverData={media[index]}
                                    navigation={props.navigation}
                                /> :
                                <ImageDiscover
                                    discoverData={media[index]}
                                    navigation={props.navigation}
                                />}
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
