import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Callout, LatLng, Marker } from 'react-native-maps';
import WebView from 'react-native-webview';

interface Props {
    coordinate: LatLng;
    title: string;
    pinColor: string;
    onCalloutPress: () => void;
}

function EventMarker({ coordinate, title, pinColor, onCalloutPress }: Props) {
    return (
        <Marker
            coordinate={coordinate}
            title={title}
            pinColor={pinColor}
            onCalloutPress={onCalloutPress}
        >
            <Callout style={{ height: 200 }}>
                <View>
                    <WebView
                        style={{ height: 200, width: 200 }}
                        source={{ uri: 'https://reactnative.dev/' }}
                    />
                    {/* <View style={styles.viewOrEnterDispensaryButtonContainer}>
                        <Text style={styles.viewOrEnterDispensaryButtonText}> {strings.dispensariesList.enterDispensary}</Text>
                    </View> */}
                </View>
            </Callout>
        </Marker>
    );
}

const styles = StyleSheet.create({
    calloutContainer: {
        // width: 200,
        // height: 200,
        backgroundColor: 'red',

        flexDirection: 'column',
        // alignSelf: 'flex-start',
        borderRadius: 6,
    },
    calloutTitle: {},
    calloutAttandees: {},
    calloutTagArea: {},
    calloutTag: {},
    arrow: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        borderTopColor: '#fff',
        borderWidth: 16,
        alignSelf: 'center',
        marginTop: -32,
    },
    arrowBorder: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        borderTopColor: '#007a87',
        borderWidth: 16,
        alignSelf: 'center',
        marginTop: -0.5,
    },
});

export default EventMarker;
