import React, { useRef } from 'react';
import { StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';

function EventMarker(props) {
    const markerRef = useRef();
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

    // console.log(pinColor);
    markerRef?.current?.redraw();

    return (
        <Marker
            ref={markerRef}
            key={props.id}
            coordinate={props.coordinate}
            name={props.name}
            pinColor={pinColor}
            // TODO: this might re-render every time since the
            // callback isn't memoized, not sure
            onCalloutPress={props.onCalloutPress}
            // tracksViewChanges={true}
        />
    );
}

const styles = StyleSheet.create({});

export default EventMarker;
