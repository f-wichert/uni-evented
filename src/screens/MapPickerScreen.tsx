import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

function MapPickerScreen(props) {
    return (
        <View style={styles.container}>
            <MapView style={styles.map}>
                <Marker
                    key={1}
                    coordinate={{
                        latitude: 49.871611,
                        longitude: 8.648212,
                    }}
                    title="Your position"
                    description="That's where you currently are!"
                />
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: '100%',
        height: '100%',
    },
});

export default MapPickerScreen;
