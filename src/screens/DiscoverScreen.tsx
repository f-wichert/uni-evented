<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import { StyleSheet, Dimensions, Text, View, Button } from 'react-native';
import { BackendMediaRequest, VideoIdentifyer } from '../types';
=======
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
>>>>>>> main
import Carousel from 'react-native-reanimated-carousel';

import { request } from '../util';

import Discover from '../components/Discover';

// const BASE_URL = 'http://10.0.2.2:3001/api'
const BASE_URL = 'http:/192.168.0.10:3000/api';
const BASE_CLIP_NAME = 'output.m3u8'

function getDiscoverData() {
<<<<<<< HEAD
    return [];
}

function DiscoverScreen(props) {
    async function updateClips() {
        const data: {media:[BackendMediaRequest]} = await request('GET', 'info/all_media', null) as {media:[BackendMediaRequest]};
        console.log(`Fetched data: ${JSON.stringify(data)}`);


        var new_clips:VideoIdentifyer[] = []
        for (const clip of data.media) {
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

=======
    return [
        {
            id: 1,
            name: 'Hulahoop',
            score: 7,
            src: 'https://media1.giphy.com/media/26tPghhb310muUkEw/giphy.gif?cid=790b761196948897dfeab8f83d9f6f966f882d3aa2f52cad&rid=giphy.gif&ct=g',
            src_t: 'https://images.pexels.com/photos/799443/pexels-photo-799443.jpeg?auto=compress&cs=tinysrgb&w=1600',
        },
        {
            id: 2,
            score: 2,
            src: 'https://media0.giphy.com/media/mOZ7nolkGapzpDnvgW/giphy.gif?cid=ecf05e4712jtgto9d53xxd976gle9kjw0t0odr46blolq6bk&rid=giphy.gif&ct=g',
        },
        {
            id: 3,
            score: 14,
            src: 'https://images.pexels.com/photos/2486168/pexels-photo-2486168.jpeg?auto=compress&cs=tinysrgb&w=1600',
        },
    ];
}

function DiscoverScreen(props) {
    const width = Dimensions.get('window').width;
    var discoverData = getDiscoverData();

>>>>>>> main
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
                        <Discover
                            discoverData={discoverData[index]}
                            navigation={props.navigation}
                        />
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
