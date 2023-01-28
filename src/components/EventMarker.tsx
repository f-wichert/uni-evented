import React, { useEffect, useRef } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { MapMarker } from 'react-native-maps';

import { EventStatus } from '../models';

type Props = MapMarker['props'] & {
    state: EventStatus;
};

function EventMarker(props: Props) {
    const markerRef = useRef<MapMarker | null>(null);
    const state = props.state;

    let pinColor = 'blue';
    // const [pinColor, setPinColor] = useState('black');
    switch (state) {
        case 'active':
            // setPinColor('orange')
            pinColor = 'orange';
            break;
        case 'scheduled':
            // setPinColor('#f0f0f0');
            pinColor = 'teal';
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
        />
    );
}

const styles = StyleSheet.create({});

export default EventMarker;
