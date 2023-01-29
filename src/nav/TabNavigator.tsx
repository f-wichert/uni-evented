import Ionicons from '@expo/vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';

import { useEventStore } from '../state/event';
import { IoniconsName } from '../types';
import DiscoverStack from './DiscoverStack';
import EventsOverviewStack from './EventsOverviewStack';
import MapStack from './MapStack';
import ProfileStack from './ProfileStack';
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
                headerShown: false,
            })}
            initialRouteName={currentEventId ? 'Events' : 'Discover'}
        >
            <Tab.Screen name="Discover" component={DiscoverStack} />
            <Tab.Screen name="Map" component={MapStack} />
            <Tab.Screen name="Events" component={EventsOverviewStack} />
            <Tab.Screen name="Profile" component={ProfileStack} />
        </Tab.Navigator>
    );
}
