import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import DiscoverScreen from '../screens/DiscoverScreen';
import createCommonScreens from './commonScreensMixin';
import { DiscoverStackNavParams } from './types';

const Stack = createNativeStackNavigator<DiscoverStackNavParams>();

export default function DiscoverStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="DiscoverView"
                component={DiscoverScreen}
                options={{ title: 'Discover' }}
            />
            {createCommonScreens(Stack.Screen)}
        </Stack.Navigator>
    );
}
