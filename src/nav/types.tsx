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
import { Media, User } from '../models';
import { EventExtra } from '../models/event';

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
// discover tab
// ==========

export type DiscoverStackNavParams = {
    DiscoverView: undefined;
} & EventDetailParams;

export type DiscoverStackNavProps<
    T extends keyof DiscoverStackNavParams = keyof DiscoverStackNavParams
> = CompositeScreenProps<NativeStackScreenProps<DiscoverStackNavParams, T>, TabNavProps>;

// ==========
// map tab
// ==========

export type MapStackNavParams = {
    MapView: undefined;
} & EventDetailParams;

export type MapStackNavProps<T extends keyof MapStackNavParams = keyof MapStackNavParams> =
    CompositeScreenProps<NativeStackScreenProps<MapStackNavParams, T>, TabNavProps>;

// ==========
// event list tab
// ==========

export type EventListStackNavParams = {
    EventList: undefined;
    CreateEvent: { location?: LatLng } | undefined;
    MapPicker: undefined;
} & EventDetailParams;

export type EventListStackNavProps<
    T extends keyof EventListStackNavParams = keyof EventListStackNavParams
> = CompositeScreenProps<NativeStackScreenProps<EventListStackNavParams, T>, TabNavProps>;

// ==========
// profile tab
// ==========

export type ProfileStackNavParams = {
    ProfileView: undefined;
    EditProfile: undefined;
    MyEvents: undefined;
    ManageAccount: undefined;
    AdminMainScreen: undefined;
    AdminUsersScreen: undefined;
    AdminUserScreen: { user: User };
    AdminEventsScreen: undefined;
    AdminEventScreen: { event: EventExtra };
    AdminEventMediasScreen: { eventId: string };
    AdminMediaScreen: { media: Media };
} & EventDetailParams;

export type ProfileStackNavProps<
    T extends keyof ProfileStackNavParams = keyof ProfileStackNavParams
> = CompositeScreenProps<NativeStackScreenProps<ProfileStackNavParams, T>, TabNavProps>;

// ==========
// event detail substack
// ==========

export type EventDetailParams = {
    EventDetail: { eventId: string };
    MediaCapture: { eventId: string };
    Chat: { eventId: string };
    EventAttendees: { eventId: string };
};

export type EventDetailProps<T extends keyof EventDetailParams = keyof EventDetailParams> =
    CompositeScreenProps<NativeStackScreenProps<EventDetailParams, T>, TabNavProps>;
