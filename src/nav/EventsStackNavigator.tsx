import Ionicons from '@expo/vector-icons/Ionicons';
import { CompositeScreenProps } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { LatLng } from 'react-native-maps';

import MapPicker from '../components/MapPicker';
import CreateEventScreen from '../screens/CreateEventScreen';
import EventDetailScreen from '../screens/EventDetailScreen';
import EventsScreen from '../screens/EventsScreen';
import { asyncHandler } from '../util';
import { TabNavProps } from './TabNavigator';

type NavigatorParams = {
    EventsList: undefined;
    CreateEvent: undefined;
    // TODO: navigation params should be JSON-serializable
    MapPicker: { returnLocation: (loc: LatLng) => void };
    EventDetail: { eventId?: string };
};

// https://reactnavigation.org/docs/typescript/#combining-navigation-props
export type EventStackNavProps<T extends keyof NavigatorParams = keyof NavigatorParams> =
    CompositeScreenProps<NativeStackScreenProps<NavigatorParams, T>, TabNavProps>;

const Stack = createNativeStackNavigator<NavigatorParams>();

function EventsStackNavigator({ navigation }: NativeStackScreenProps<NavigatorParams>) {
    useEffect(
        asyncHandler(async () => {
            navigation.setOptions({
                headerRight: () => (
                    <Ionicons
                        name="add-outline"
                        size={32}
                        color="black"
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
                name="EventsList"
                component={EventsScreen}
                options={{ headerShown: false, animation: 'fade' }}
            />
            <Stack.Screen
                name="CreateEvent"
                component={CreateEventScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen name="MapPicker" component={MapPicker} options={{ headerShown: false }} />
            <Stack.Screen
                name="EventDetail"
                component={EventDetailScreen}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}

export default EventsStackNavigator;
