import Ionicons from '@expo/vector-icons/Ionicons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';

import CreateEventScreen from '../screens/CreateEventScreen';
import EventDetailScreen from '../screens/EventDetailScreen';
import EventsScreen from '../screens/EventsScreen';
import { asyncHandler } from '../util';
import { EventListStackNavParams, TabNavProps } from './types';

const Stack = createNativeStackNavigator<EventListStackNavParams>();

function EventsStackNavigator({ navigation }: TabNavProps<'Events'>) {
    useEffect(
        asyncHandler(async () => {
            navigation.setOptions({
                headerRight: () => (
                    <Ionicons
                        name="add-outline"
                        size={32}
                        color="black"
                        // TODO: use nested navigator? this works but it's technically wrong
                        onPress={() => navigation.navigate('CreateEvent')}
                        style={{
                            marginRight: 15,
                        }}
                    />
                ),
            });
        }),
        [navigation]
    );

    return (
        <Stack.Navigator>
            <Stack.Screen
                name="EventList"
                component={EventsScreen}
                options={{ headerShown: false, animation: 'fade' }}
            />
            <Stack.Screen
                name="CreateEvent"
                component={CreateEventScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="EventDetail"
                component={EventDetailScreen}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}

export default EventsStackNavigator;
