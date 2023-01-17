import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import DiscoverScreen from '../screens/DiscoverScreen';
import { DiscoverStackNavParams } from './types';

const Stack = createNativeStackNavigator<DiscoverStackNavParams>();

export default function DiscoverStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="DiscoverView" component={DiscoverScreen} />
        </Stack.Navigator>
    );
}
