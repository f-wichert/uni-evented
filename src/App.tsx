import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import ToastRoot from './components/ToastRoot';
import { AuthProvider } from './contexts/authContext';
import { EventProvider } from './contexts/eventContext';
import TabNavigator from './nav/TabNavigator';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';

// https://reactnavigation.org/docs/typescript/
// instead of `undefined`, props passed to these screens would be defined here if applicable

export type RootNavigatorParams = {
    LoginScreen: undefined;
    RegisterScreen: undefined;
    TabScreen: undefined;
};

const Stack = createNativeStackNavigator<RootNavigatorParams>();

function App() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="LoginScreen"
                component={LoginScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="RegisterScreen"
                component={RegisterScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="TabScreen"
                component={TabNavigator}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}

export default function Root() {
    return (
        <AuthProvider>
            <EventProvider>
                <NavigationContainer>
                    <App />
                </NavigationContainer>

                <ToastRoot />
            </EventProvider>
        </AuthProvider>
    );
}
