import Ionicons from '@expo/vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useContext } from 'react';

import { EventContext } from '../contexts/eventContext';
import CreateEventScreen from '../screens/CreateEventScreen';
import DiscoverScreen from '../screens/DiscoverScreen';
import EventsScreen from '../screens/EventsScreen';
import MapScreen from '../screens/MapScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ViewEventScreen from '../screens/ViewEventScreen';
import { IoniconsName } from '../types';

// https://reactnavigation.org/docs/typescript/

export type TabNavigatorParams = {
    Discover: undefined;
    Map: undefined;
    Events: undefined;
    Profile: undefined;
    Event: undefined;
    Create: undefined;
};

export const Tab = createBottomTabNavigator<TabNavigatorParams>();

export default function TabNavigator() {
    const { state } = useContext(EventContext);

    return (
        <Tab.Navigator
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
            initialRouteName={state.eventId ? 'Events' : 'Discover'}
        >
            <Tab.Screen name="Discover" component={DiscoverScreen} />
            <Tab.Screen name="Map" component={MapScreen} />
            <Tab.Screen name="Events" component={EventsScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />

            {state.eventId ? (
                <Tab.Screen name="Event" component={ViewEventScreen} />
            ) : (
                <Tab.Screen name="Create" component={CreateEventScreen} />
            )}
        </Tab.Navigator>
    );
}
