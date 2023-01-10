import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { Media, MediaManager } from '../models';
import { baseHeaders } from '../util';

declare type Props = {
    item: Media;
    navigateDetail: (id: string) => void;
};

function ImageDiscover({ item, navigateDetail }: Props) {
    return (
        <View style={styles.container}>
            <Image
                source={{
                    uri: MediaManager.src(item),
                    headers: {
                        ...baseHeaders,
                    },
                }}
                style={styles.image}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 350,
        height: 450,
        flex: 1,
    },
});

export default ImageDiscover;
