import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useContext } from 'react';

import ToastRoot from './components/ToastRoot';
import { AuthContext, AuthProvider } from './contexts/authContext';
import { EventProvider } from './contexts/eventContext';
import TabNavigator from './nav/TabNavigator';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import CreateEventScreen from './screens/CreateEventScreen';

// https://reactnavigation.org/docs/typescript/
// instead of `undefined`, props passed to these screens would be defined here if applicable

export type RootNavigatorParams = {
    LoginScreen: undefined;
    RegisterScreen: undefined;
    TabScreen: undefined;
    CreateEventScreen: undefined;
};

const Stack = createNativeStackNavigator<RootNavigatorParams>();

function App() {
    const { state: authState } = useContext(AuthContext);

    // https://reactnavigation.org/docs/auth-flow
    let screens;
    if (authState.token) {
        screens = (
            <>
                <Stack.Screen
                    name="TabScreen"
                    component={TabNavigator}
                    options={{ headerShown: false, animation: 'fade' }}
                />
                <Stack.Screen
                    name="CreateEventScreen"
                    component={CreateEventScreen}
                    options={{ headerShown: false }}
                />
            </>
        );
    } else {
        // TODO: fix signout animation using `animationTypeForReplace`
        screens = (
            <>
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
            </>
        );
    }

    return <Stack.Navigator>{screens}</Stack.Navigator>;
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
