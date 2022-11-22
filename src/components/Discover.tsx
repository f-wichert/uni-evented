import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

import videojs from 'video.js';

function Discover(props) {
    return (
        <View style={styles.container}>
            <Text>This is a Discover component {props.discoverData.id}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'red'
    }
});

export default Discover;