import React from 'react';
import { StyleSheet, Dimensions, Text, View } from 'react-native';

import Carousel from 'react-native-reanimated-carousel';
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import Discover from '../components/Discover';

function getDiscoverData() {
  return [{
      id: 1,
      name: 'Hulahoop',
      score: 7,
      src: 'https://media1.giphy.com/media/26tPghhb310muUkEw/giphy.gif?cid=790b761196948897dfeab8f83d9f6f966f882d3aa2f52cad&rid=giphy.gif&ct=g',
      src_t: 'https://images.pexels.com/photos/799443/pexels-photo-799443.jpeg?auto=compress&cs=tinysrgb&w=1600'
  },
  {
      id: 2,
      score: 2,
      src: 'https://media0.giphy.com/media/mOZ7nolkGapzpDnvgW/giphy.gif?cid=ecf05e4712jtgto9d53xxd976gle9kjw0t0odr46blolq6bk&rid=giphy.gif&ct=g'
  },
  {
      id: 3,
      score: 14,
      src: 'https://images.pexels.com/photos/2486168/pexels-photo-2486168.jpeg?auto=compress&cs=tinysrgb&w=1600'
  }]
}

function DiscoverScreen(props) {

  const width = Dimensions.get('window').width;
  var discoverData = getDiscoverData();

  return (
    <View style={styles.container}>
      <GestureHandlerRootView>
                <Carousel
                    vertical={true}
                    // loop
                    width={width}
                    height={580}
                    autoPlay={false}
                    // data={[...new Array(6).keys()]}
                    data={discoverData}
                    scrollAnimationDuration={500}
                    onSnapToItem={(index) => console.log('current index:', index)}
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
