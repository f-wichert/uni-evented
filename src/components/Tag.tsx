import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export function Tag(props: any) {
    return (
        <View {...props} style={[styles.basicTagStyle, props.style]}>
            <Text style={styles.text}>{props.children}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    basicTagStyle: {
        backgroundColor: 'orange',
        padding: 3,
        margin: 1,
        borderRadius: 3.1,
        paddingHorizontal: 15,
        marginHorizontal: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 14,
        fontWeight: 'bold',
    },
});
