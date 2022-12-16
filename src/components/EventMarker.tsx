import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import WebView from 'react-native-webview';

// TODO: kann mir jemand zeigen wie mann hier ein interface oder so für die props definiert? habe da schon unterschiedliche sachen gesehen - Fred

function EventMarker({ coordinate, title, pinColor, onCalloutPress }) {
    return (
        <Marker
            coordinate={coordinate}
            title={title}
            pinColor={pinColor}
            onCalloutPress={onCalloutPress}
        >
            <Callout 
                style={{ height: 200 }}>
                <View> 
                    <WebView 
                        style={{ height: 200, width: 200, }} 
                        source={{ uri: 'https://reactnative.dev/' }} 
                        /> 
                    {/* <View style={styles.viewOrEnterDispensaryButtonContainer}> 
                        <Text style={styles.viewOrEnterDispensaryButtonText}> {strings.dispensariesList.enterDispensary}</Text> 
                    </View> */}
                </View>
            </Callout>
        </Marker>
    );
};

const styles = StyleSheet.create({
    calloutContainer: {
        // width: 200,
        // height: 200,
        backgroundColor: 'red',

        flexDirection: 'column',
        // alignSelf: 'flex-start',
        borderRadius: 6,
    },
    calloutTitle: {

    },
    calloutAttandees: {

    },
    calloutTagArea: {

    },
    calloutTag: {
        
    },
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
        marginTop: -0.5
    }
});

export default EventMarker;