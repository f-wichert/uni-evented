/**
 * https://reactnavigation.org/docs/typescript/
 *
 * Params passed to these screens would be defined here, if applicable.
 * If a screen doesn't take any parameters, `undefined` is used.
 */

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LatLng } from 'react-native-maps';

// ==========
// root navigators, only one of these is active at a time
// ==========

// screens in stack, without token
export type UnauthRootNavParams = {
    LoginScreen: undefined;
    RegisterScreen: undefined;
    ResetPasswordScreen: undefined;
};

// screens in stack, with token but no user
export type LoadingRootNavParams = {
    LoadingScreen: undefined;
};

// screens in stack, with token and user
export type RootNavParams = {
    TabScreen: undefined;
};

export type RootNavProps<ScreenName extends keyof RootNavParams = keyof RootNavParams> =
    NativeStackScreenProps<RootNavParams, ScreenName>;

// intersection for all of the above
export type AnyRootNavParams = UnauthRootNavParams & LoadingRootNavParams & RootNavParams;

// ==========
// main tab navigator
// ==========

export type TabNavParams = {
    Discover: undefined;
    Map: undefined;
    Events: undefined;
    Profile: undefined;
};

// https://reactnavigation.org/docs/typescript/#combining-navigation-props
export type TabNavProps<ScreenName extends keyof TabNavParams = keyof TabNavParams> =
    CompositeScreenProps<BottomTabScreenProps<TabNavParams, ScreenName>, RootNavProps>;

// ==========
// event list tab
// ==========

export type EventListStackNavParams = {
    EventList: undefined;
    EventDetail: { eventId?: string; origin?: string };
    CreateEvent: { location?: LatLng } | undefined;
    MapPicker: undefined;
};

export type EventListStackNavProps<
    T extends keyof EventListStackNavParams = keyof EventListStackNavParams
> = CompositeScreenProps<NativeStackScreenProps<EventListStackNavParams, T>, TabNavProps>;