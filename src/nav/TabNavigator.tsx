import Ionicons from '@expo/vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';

import DiscoverScreen from '../screens/DiscoverScreen';
import MapScreen from '../screens/MapScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { useAuthStore } from '../state/auth';
import { IoniconsName } from '../types';
import EventsStackNavigator from './EventsStackNavigator';
import { TabNavParams } from './types';

export const Tab = createBottomTabNavigator<TabNavParams>();

export default function TabNavigator() {
    const eventId = useAuthStore((state) => state.user?.currentEventId);

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
                    } else if (route.name === 'Events') {
                        iconName = focused ? 'rocket' : 'rocket-outline';
                    } else {
                        throw new Error(`Unknown route '${route.name}'`);
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: 'tomato',
                tabBarInactiveTintColor: 'gray',
            })}
            initialRouteName={eventId ? 'Events' : 'Discover'}
        >
            <Tab.Screen name="Discover" component={DiscoverScreen} />
            <Tab.Screen name="Map" component={MapScreen} />
            <Tab.Screen name="Events" component={EventsStackNavigator} />
            <Tab.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
        </Tab.Navigator>
    );
}
