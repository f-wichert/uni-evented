import React, { useEffect, useState } from 'react';
import { StyleSheet, Dimensions, Text, View, Button } from 'react-native';

import Carousel from 'react-native-reanimated-carousel';
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import { request } from '../util';

import Discover from '../components/Discover';

const BASE_URL = 'http://10.0.2.2:3001/api'
const BASE_CLIP_NAME = 'output.m3u8'

function getDiscoverData() {
  return [{
      id: 1,
      name: 'Hulahoop',
      score: 7,
      src: `${BASE_URL}/hls/test_clip/${BASE_CLIP_NAME}`,
      src_tt: 'https://media1.giphy.com/media/26tPghhb310muUkEw/giphy.gif?cid=790b761196948897dfeab8f83d9f6f966f882d3aa2f52cad&rid=giphy.gif&ct=g',
      src_t: 'https://images.pexels.com/photos/799443/pexels-photo-799443.jpeg?auto=compress&cs=tinysrgb&w=1600'
  },
  {
      id: 2,
      score: 2,
      src: `${BASE_URL}/hls/test_clip/${BASE_CLIP_NAME}`,
      src_t: 'https://media0.giphy.com/media/mOZ7nolkGapzpDnvgW/giphy.gif?cid=ecf05e4712jtgto9d53xxd976gle9kjw0t0odr46blolq6bk&rid=giphy.gif&ct=g'
  },]
}

function DiscoverScreen(props) {
  async function updateClips() {
    const data = await request('GET', '/info/all_clips', null, {});
    
    var new_clips = []
    for (const clip in data) {
      new_clips.push({
        id: clip.id,
        src: `${BASE_URL}/hls/${clip.id}/${BASE_CLIP_NAME}`
      })
    }

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
          onPress={() => setDiscoverData([...discoverData, { id: 4 }])} 
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
