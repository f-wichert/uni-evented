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
        padding: 5,
        margin: 2,
        borderRadius: 3.1,
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});
