import Ionicons from '@expo/vector-icons/Ionicons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import MapPicker from '../components/MapPicker';
import CreateEventScreen from '../screens/CreateEventScreen';
import EventDetailScreen from '../screens/EventDetailScreen';
import EventsScreen from '../screens/EventsScreen';

export type RootNavigatorParams = {
    EventsScreen: undefined;
    CreateEventScreen: undefined;
    MapPicker: undefined;
    EventDetailScreen: undefined;
};

const Stack = createNativeStackNavigator<RootNavigatorParams>();

function EventScreenNavigator({ navigation }) {
    useEffect(() => {
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
    }, [navigation]);

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
