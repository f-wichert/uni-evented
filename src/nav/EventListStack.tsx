import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import CreateEventScreen from '../screens/CreateEventScreen';
import EventListScreen from '../screens/EventListScreen';
import MapPickerScreen from '../screens/MapPickerScreen';
import createCommonScreens from './commonScreensMixin';
import { EventListStackNavParams } from './types';

const Stack = createNativeStackNavigator<EventListStackNavParams>();

function EventListStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="EventList"
                component={EventListScreen}
                options={{ title: 'Events' }}
            />
            <Stack.Screen
                name="CreateEvent"
                component={CreateEventScreen}
                options={{ title: 'Create Event' }}
            />
            <Stack.Screen
                name="MapPicker"
                component={MapPickerScreen}
                options={{ title: 'Pick a Location!' }}
            />
            {createCommonScreens(Stack.Screen)}
        </Stack.Navigator>
    );
}

export default EventListStack;
