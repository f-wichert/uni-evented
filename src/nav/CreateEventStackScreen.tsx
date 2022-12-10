import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useContext } from 'react';

import ToastRoot from './components/ToastRoot';
import { AuthContext, AuthProvider } from './contexts/authContext';
import { EventProvider } from './contexts/eventContext';
import TabNavigator from './nav/TabNavigator';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import CreateEventScreen from '../screens/CreateEventScreen';
import MapPickerScreen from '../screens/MapPickerScreen';

const Stack = createNativeStackNavigator<RootNavigatorParams>();

export default function CreateEventStackScreen() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="CreateEvent"
                component={CreateEventScreen}
                options={{ headerShown: true }}
            />
            <Stack.Screen
                name="MapPicker"
                component={MapPickerScreen}
                options={{ headerShown: true }}
            />
        </Stack.Navigator>
    )
}