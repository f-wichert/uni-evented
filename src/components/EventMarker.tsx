import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';

// TODO: kann mir jemand zeigen wie mann hier ein interface oder so für die props definiert? habe da schon unterschiedliche sachen gesehen - Fred

function EventMarker(props) {
    return (
        <Marker>
            <Callout>
                <View>

                </View>
            </Callout>
        </Marker>
    );
};

const styles = StyleSheet.create({
    container: {

    },
    calloutTitle: {

    },
    calloutAttandees: {

    },
    calloutTagArea: {

    },
    calloutTag: {
        
    }
});

export default EventMarker;