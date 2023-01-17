import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import MapScreen from '../screens/MapScreen';
import { MapStackNavParams } from './types';

const Stack = createNativeStackNavigator<MapStackNavParams>();

export default function MapStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="MapView" component={MapScreen} />
        </Stack.Navigator>
    );
}
