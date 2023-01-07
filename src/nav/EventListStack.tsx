import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import VideoCamera from '../components/VideoCamera';

import CreateEventScreen from '../screens/CreateEventScreen';
import EventDetailScreen from '../screens/EventDetailScreen';
import EventListScreen from '../screens/EventListScreen';
import MapPickerScreen from '../screens/MapPickerScreen';
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
                name="EventDetail"
                component={EventDetailScreen}
                // TODO: consider showing event title here (see https://reactnavigation.org/docs/headers/#using-params-in-the-title)
                options={{ title: 'Detail' }}
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
            <Stack.Screen
                name="MediaCapture"
                component={VideoCamera}
                options={{ title: 'Upload your Content' }}
            />
        </Stack.Navigator>
    );
}

export default EventListStack;
