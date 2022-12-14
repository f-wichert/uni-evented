import React from 'react';
import { StyleSheet, Text } from 'react-native';

export function Tag(props: any) {
    return (
        <Text {...props} style={[styles.basicTagStyle, props.style]}>
            {props.children}
        </Text>
    );
}

const styles = StyleSheet.create({
    basicTagStyle: {
        fontSize: 20,
        backgroundColor: 'orange',
        fontWeight: 'bold',
        padding: 5,
        margin: 2,
        borderRadius: 3,
        paddingHorizontal: 20,
    },
});
