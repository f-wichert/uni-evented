import Ionicons from '@expo/vector-icons/Ionicons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import MapPicker from '../components/MapPicker';
import { TabPropsFor } from '../nav/TabNavigator';
import CreateEventScreen from '../screens/CreateEventScreen';
import EventDetailScreen from '../screens/EventDetailScreen';
import EventsScreen from '../screens/EventsScreen';
import { asyncHandler } from '../util';

export type RootNavigatorParams = {
    EventsScreen: undefined;
    CreateEventScreen: undefined;
    MapPicker: undefined;
    EventDetailScreen: undefined;
};

type ComponentProps = TabPropsFor<'EventStack'>;

const Stack = createNativeStackNavigator<RootNavigatorParams>();

function EventScreenNavigator({ navigation }: ComponentProps) {
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
                name="EventsScreen"
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
                name="EventDetailScreen"
                component={EventDetailScreen}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}

export default EventScreenNavigator;
