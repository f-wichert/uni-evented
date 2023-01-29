import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import CreateEventScreen from '../screens/CreateEventScreen';
import EventsOverviewListScreen from '../screens/EventsOverviewScreen';
import MapPickerScreen from '../screens/MapPickerScreen';
import createCommonScreens from './commonScreensMixin';
import { EventsOverviewStackNavParams } from './types';

const Stack = createNativeStackNavigator<EventsOverviewStackNavParams>();

function EventsOverviewStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="EventsOverview"
                component={EventsOverviewListScreen}
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

export default EventsOverviewStack;
