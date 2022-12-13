import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import CreateEventScreen from '../screens/CreateEventScreen';
import MapPickerScreen from '../screens/MapPickerScreen';

const Stack = createNativeStackNavigator<RootNavigatorParams>();

export default function CreateEventStackScreen() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="CreateEvent"
                component={CreateEventScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="MapPicker"
                component={MapPickerScreen}
                options={{ headerShown: true }}
            />
        </Stack.Navigator>
    );
}
