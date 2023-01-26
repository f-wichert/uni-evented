import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import VideoCamera from '../components/VideoCamera';
import ChatScreen from '../screens/ChatScreen';
import EventDetailScreen from '../screens/EventDetailScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import { CommonStackParams } from './types';

type ScreenType = ReturnType<typeof createNativeStackNavigator<CommonStackParams>>['Screen'];

export default function createCommonScreens(Screen: ScreenType) {
    return (
        <>
            <Screen
                name="EventDetail"
                component={EventDetailScreen}
                // TODO: consider showing event title here (see https://reactnavigation.org/docs/headers/#using-params-in-the-title)
                options={{ title: 'Detail' }}
            />
            <Screen
                name="MediaCapture"
                component={VideoCamera}
                options={{ title: 'Upload your Content' }}
            />
            <Screen name="Chat" component={ChatScreen} options={{ title: 'Chat' }} />
            <Screen
                name="UserProfile"
                component={UserProfileScreen}
                options={{ title: 'User Profile' }}
            />
        </>
    );
}
