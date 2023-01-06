import Ionicons from '@expo/vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';

import DiscoverScreen from '../screens/DiscoverScreen';
import MapScreen from '../screens/MapScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { useEventStore } from '../state/event';
import { IoniconsName } from '../types';
import EventListStack from './EventListStack';
import { TabNavParams } from './types';

export const Tab = createBottomTabNavigator<TabNavParams>();

export default function TabNavigator() {
    const currentEventId = useEventStore((state) => state.currentEventId);

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
            initialRouteName={currentEventId ? 'Events' : 'Discover'}
        >
            <Tab.Screen name="Discover" component={DiscoverScreen} />
            <Tab.Screen name="Map" component={MapScreen} />
            <Tab.Screen name="Events" component={EventListStack} options={{ headerShown: false }} />
            <Tab.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
        </Tab.Navigator>
    );
}
