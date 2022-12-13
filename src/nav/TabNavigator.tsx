import Ionicons from '@expo/vector-icons/Ionicons';
import { BottomTabScreenProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';

import { RootNavigatorParams } from '../App';

import DiscoverScreen from '../screens/DiscoverScreen';
import EventsScreen from '../screens/EventsScreen';
import MapScreen from '../screens/MapScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ViewEventScreen from '../screens/ViewEventScreen';
import { useEventStore } from '../state/event';
import { IoniconsName } from '../types';
import CreateEventScreenStack from './CreateEventScreenStack';

// https://reactnavigation.org/docs/typescript/
export type TabNavigatorParams = {
    Discover: undefined;
    Map: undefined;
    Events: undefined;
    Profile: undefined;
    Event: undefined;
    Create: undefined;
};

// https://reactnavigation.org/docs/typescript/#combining-navigation-props
export type TabPropsFor<T extends keyof TabNavigatorParams> = CompositeScreenProps<
    BottomTabScreenProps<TabNavigatorParams, T>,
    NativeStackScreenProps<RootNavigatorParams>
>;

export const Tab = createBottomTabNavigator<TabNavigatorParams>();

export default function TabNavigator() {
    const eventId = useEventStore((state) => state.eventId);

    return (
        <Tab.Navigator
            // tabBar={props => <BottomTabBar {...props} state={{...props.state, routes: props.state.routes.slice(0,4)}}></BottomTabBar>}
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: IoniconsName;

                    if (route.name === 'Discover') {
                        iconName = focused ? 'play' : 'play-outline';
                    } else if (route.name === 'Map') {
                        iconName = focused ? 'map' : 'map-outline';
                    } else if (route.name === 'Profile') {
                        iconName = focused ? 'person' : 'person-outline';
                    } else if (route.name === 'Create') {
                        iconName = focused ? 'add' : 'add-outline';
                    } else if (route.name === 'Events') {
                        iconName = focused ? 'rocket' : 'rocket-outline';
                    } else if (route.name === 'Event') {
                        iconName = focused ? 'rocket' : 'rocket-outline';
                    } else {
                        throw new Error(`Unknown route '${route.name}'`);
                    }

                    // You can return any component that you like here!
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: 'tomato',
                tabBarInactiveTintColor: 'gray',
            })}
            initialRouteName={eventId ? 'Events' : 'Discover'}
        >
            <Tab.Screen name="Discover" component={DiscoverScreen} />
            <Tab.Screen name="Map" component={MapScreen} />
            <Tab.Screen name="Events" component={EventsScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />

            {eventId ? (
                <Tab.Screen name="Event" component={ViewEventScreen} />
            ) : (
                <Tab.Screen name="Create" component={CreateEventScreenStack} />
            )}
        </Tab.Navigator>
    );
}
