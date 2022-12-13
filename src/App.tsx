import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import ToastRoot from './components/ToastRoot';
import TabNavigator from './nav/TabNavigator';
import CreateEventScreen from './screens/CreateEventScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ResetPasswordScreen from './screens/ResetPasswordScreen';
import { useAuthStore } from './state/auth';

// https://reactnavigation.org/docs/typescript/
// instead of `undefined`, props passed to these screens would be defined here if applicable

// screens in stack, with token
export type RootNavigatorParams = {
    TabScreen: undefined;
    CreateEventScreen: undefined;
};

// screens in stack, without token
export type UnauthRootNavigatorParams = {
    LoginScreen: undefined;
    RegisterScreen: undefined;
    ResetPasswordScreen: undefined;
};

const Stack = createNativeStackNavigator<RootNavigatorParams & UnauthRootNavigatorParams>();

function App() {
    const token = useAuthStore((state) => state.token);

    // https://reactnavigation.org/docs/auth-flow
    let screens;
    if (token) {
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
                <Stack.Screen
                    name="ResetPasswordScreen"
                    component={ResetPasswordScreen}
                    options={{ headerShown: false }}
                />
            </>
        );
    }

    return <Stack.Navigator>{screens}</Stack.Navigator>;
}

export default function Root() {
    return (
        <SafeAreaProvider>
            <NavigationContainer>
                <App />
            </NavigationContainer>

            <ToastRoot />

            <StatusBar style="dark" />
        </SafeAreaProvider>
    );
}
