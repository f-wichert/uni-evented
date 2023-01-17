import React from 'react';
import { Marker } from 'react-native-maps';

function EventMarker(props) {
    return (
        <Marker
            key={props.id}
            coordinate={props.coordinate}
            title={props.name}
            pinColor="orange"
            // TODO: this might re-render every time since the
            // callback isn't memoized, not sure
            onCalloutPress={props.onCalloutPress}
        />
    );
}

export default EventMarker;
