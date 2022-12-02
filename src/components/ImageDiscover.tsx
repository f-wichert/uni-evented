import React from 'react';
import { StyleSheet, View, Image } from 'react-native';

function ImageDiscover(props) {
    return (
        <View style={styles.container}>
            <Image source={{ uri: props.discoverData.src, }} style={styles.image} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderRadius: 8,
        margin: 5
    },
    image: {
        width: 350,
        height: 450
        // flex: 1
    },
});

export default ImageDiscover;
