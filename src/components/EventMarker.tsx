import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useEffect, useRef } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { MapMarker } from 'react-native-maps';

import { EventStatus } from '../models';

type Props = MapMarker['props'] & {
    state: EventStatus;
    numPeople: Number;
    livestream: Boolean;
};

function EventMarker(props: Props) {
    const markerRef = useRef<MapMarker | null>(null);
    const state = props.state;
    const numPeople = props.numPeople;
    const livestream = props.livestream;

    let pinColor = 'blue';
    // const [pinColor, setPinColor] = useState('black');
    switch (state) {
        case 'active':
            // setPinColor('orange')
            pinColor = 'orange';
            break;
        case 'scheduled':
            // setPinColor('#f0f0f0');
            pinColor = '#b0b0b0';
            break;
        default:
            console.log('Default');
    }

    // force redraw when color changes
    useEffect(() => {
        if (Platform.OS === 'android') markerRef.current?.redraw();
    }, [pinColor]);

    return (
        <MapMarker
            {...props}
            ref={markerRef}
            pinColor={pinColor}
            // tracksViewChanges={true}
        >
            <View style={styles.container}>
                <View style={styles.badgeAreaPadding}>
                    <View style={styles.badgeArea}>
                        <View style={styles.peopleBadgeArea}>
                            <Ionicons name="people-circle" size={16} color={'black'} />
                            {/* TODO: The way this css is done, this only displayes people correctly under three digits */}
                            <Text>{numPeople}</Text>
                        </View>
                        <View style={styles.centerBadgeArea}></View>
                        <View style={styles.leftBadgeArea}>
                            {livestream ? (
                                <View style={styles.leftBadgeArea}>
                                    <Ionicons
                                        // style={{paddingLeft: 9}}
                                        name="play-circle"
                                        size={16}
                                        color={'red'}
                                    />
                                </View>
                            ) : (
                                <></>
                            )}
                        </View>
                        {/* <View style={styles.peopleBadgeArea}>
                            <Ionicons
                                name="people-circle"
                                size={15}
                                color={'black'}
                            />
                            <Text>{numPeople}</Text>
                        </View>
                        <View style={styles.centerBadgeArea}></View>
                        {livestream ? (<View style={styles.leftBadgeArea}>
                            <Ionicons
                                // style={{paddingLeft: 9}}
                                name="play-circle"
                                size={15}
                                color={'red'}
                            />
                        </View>) : (<></>)} */}
                    </View>
                </View>
                <Ionicons name="location" size={40} color={pinColor} />
            </View>
        </MapMarker>
        // <MapMarker
        //     {...props}
        //     ref={markerRef}
        //     pinColor={pinColor}
        //     // tracksViewChanges={true}
        // />
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        width: 80,
        // backgroundColor: 'green',
        // height: 90
    },
    badgeAreaPadding: {
        flex: 1,
        height: 20,
        width: '100%',
        // backgroundColor: 'blue'
    },
    badgeArea: {
        flex: 1,
        // justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row-reverse',
        // position: 'absolute',
        // backgroundColor: 'red',
        top: 10,
        // paddingTop: 20
    },
    leftBadgeArea: {
        flex: 10,
        flexDirection: 'row',
        // backgroundColor: 'yellow',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    centerBadgeArea: {
        flex: 5,
        backgroundColor: 'green',
    },
    peopleBadgeArea: {
        flex: 10,
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
        // backgroundColor: 'blue'
    },
});

export default EventMarker;
