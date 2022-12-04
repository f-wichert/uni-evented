import { NavigationProp, ParamListBase } from '@react-navigation/native';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

declare type Props = {
    discoverData: { src: string };
    navigation: NavigationProp<ParamListBase>;
};

function ImageDiscover({ discoverData, navigation }: Props) {
    return (
        <View style={styles.container}>
            <Image source={{ uri: discoverData.src }} style={styles.image} />
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
        margin: 5,
    },
    image: {
        width: 350,
        height: 450,
        // flex: 1
    },
});

export default ImageDiscover;
