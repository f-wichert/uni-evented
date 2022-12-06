import React, { useEffect, useState } from 'react';
import { StyleSheet, Dimensions, Text, View, Button } from 'react-native';

import Carousel from 'react-native-reanimated-carousel';
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import { request } from '../util';

import Discover from '../components/Discover';

// const BASE_URL = 'http://10.0.2.2:3001/api'
const BASE_URL = 'http:/192.168.0.10:3000/api';
const BASE_CLIP_NAME = 'output.m3u8'

function getDiscoverData() {
    return [];
}

function DiscoverScreen(props) {
    async function updateClips() {
        const data = await request('GET', '/info/all_clips', null);
        console.log(`Fetched data: ${JSON.stringify(data)}`);


        var new_clips = []
        for (const clip of data) {
            new_clips.push({
                id: clip.id,
                src: `${BASE_URL}/hls/${clip.id}/index.m3u8`
            })
        }

        setDiscoverData(new_clips)

    }

    const width = Dimensions.get('window').width;
    // var discoverData = getDiscoverData();

    const [discoverData, setDiscoverData] = React.useState(getDiscoverData);

    React.useEffect(() => {
        // Use `setOptions` to update the button that we previously specified
        // Now the button includes an `onPress` handler to update the discoverData
        props.navigation.setOptions({
            headerRight: () => (
                <Button
                    // onPress={() => setDiscoverData([...discoverData, { id: 4 }])} 
                    onPress={() => updateClips()}
                    title="Reload" />
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
                    // data={[...new Array(6).keys()]}
                    data={discoverData}
                    scrollAnimationDuration={450}
                    onSnapToItem={(index) => console.log('current index:', discoverData[index].id)}
                    // onScrollBegin={(e) => {console.log('Started to scroll!');}}
                    // onScrollEnd={() => console.log('Stopped Scrolling')}
                    renderItem={({ index }) => (
                        <Discover discoverData={discoverData[index]} navigation={props.navigation} />
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
