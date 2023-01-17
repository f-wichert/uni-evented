import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import DiscoverScreen from '../screens/DiscoverScreen';
import createEventScreens from './eventDetailMixin';
import { DiscoverStackNavParams } from './types';

const Stack = createNativeStackNavigator<DiscoverStackNavParams>();

export default function DiscoverStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="DiscoverView" component={DiscoverScreen} />
            {createEventScreens(Stack.Screen)}
        </Stack.Navigator>
    );
}
