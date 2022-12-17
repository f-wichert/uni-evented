import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { LatLng } from 'react-native-maps';

import MapPicker from '../components/MapPicker';
import CreateEventScreen from '../screens/CreateEventScreen';

type NavigatorParams = {
    CreateEvent: undefined;
    // TODO: navigation params should be JSON-serializable
    MapPicker: { returnLocation: (loc: LatLng) => void };
};

const Stack = createNativeStackNavigator<NavigatorParams>();

function CreateEventScreenStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="CreateEvent"
                component={CreateEventScreen}
                options={{ headerShown: false, animation: 'fade' }}
            />
            <Stack.Screen name="MapPicker" component={MapPicker} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
}

export default CreateEventScreenStack;
