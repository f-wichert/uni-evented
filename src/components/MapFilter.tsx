import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

function MapFilter(props) {
    return (
        <View style={styles.container}>
            <View style={styles.body}>
                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>Range for current events:</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'red',
        width: '100%',
        height: 70,
        position: 'absolute',
        top: 0,
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
        elevation: 5,
        shadowColor: '#71717',
    },
    body: {
        margin: 7,
    },
    section: {},
    sectionHeader: {},
});

export default MapFilter;
