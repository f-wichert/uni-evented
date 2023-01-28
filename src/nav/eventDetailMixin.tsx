import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import VideoCamera from '../components/VideoCamera';
import ChatScreen from '../screens/ChatScreen';
import EventDetailEditScreen from '../screens/EventDetailEditScreen';
import EventDetailScreen from '../screens/EventDetailScreen';
import { EventDetailParams } from './types';

type ScreenType = ReturnType<typeof createNativeStackNavigator<EventDetailParams>>['Screen'];

export default function createEventScreens(Screen: ScreenType) {
    return (
        <>
            <Screen
                name="EventDetail"
                component={EventDetailScreen}
                // TODO: consider showing event title here (see https://reactnavigation.org/docs/headers/#using-params-in-the-title)
                options={{ title: 'Detail' }}
            />
            <Screen
                name="EventDetailEdit"
                component={EventDetailEditScreen}
                options={{ title: 'Edit your Event' }}
            />
            <Screen
                name="MediaCapture"
                component={VideoCamera}
                options={{ title: 'Upload your Content' }}
            />
            <Screen name="Chat" component={ChatScreen} options={{ title: 'Chat' }} />
        </>
    );
}
