import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import MapScreen from '../screens/MapScreen';
import createCommonScreens from './commonScreensMixin';
import { MapStackNavParams } from './types';

const Stack = createNativeStackNavigator<MapStackNavParams>();

export default function MapStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="MapView" component={MapScreen} options={{ title: 'Map' }} />
            {createCommonScreens(Stack.Screen)}
        </Stack.Navigator>
    );
}
