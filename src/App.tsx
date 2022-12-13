import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import ToastRoot from './components/ToastRoot';
import TabNavigator from './nav/TabNavigator';
import LoadingScreen from './screens/LoadingScreen';
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

export type LoadingRootNavigatorParams = {
    LoadingScreen: undefined;
};

// screens in stack, without token
export type UnauthRootNavigatorParams = {
    LoginScreen: undefined;
    RegisterScreen: undefined;
    ResetPasswordScreen: undefined;
};

const Stack = createNativeStackNavigator<
    RootNavigatorParams & LoadingRootNavigatorParams & UnauthRootNavigatorParams
>();

function App() {
    const token = useAuthStore((state) => state.token);
    const user = useAuthStore((state) => state.user);

    // https://reactnavigation.org/docs/auth-flow
    let screens;
    if (!token) {
        // not signed in
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
    } else if (!user) {
        // we have a token, wait for user to load
        screens = (
            <>
                <Stack.Screen
                    name="LoadingScreen"
                    component={LoadingScreen}
                    options={{ headerShown: false, animation: 'fade' }}
                />
            </>
        );
    } else {
        // got token and user, show main content
        screens = (
            <>
                <Stack.Screen
                    name="TabScreen"
                    component={TabNavigator}
                    options={{ headerShown: false, animation: 'fade' }}
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
