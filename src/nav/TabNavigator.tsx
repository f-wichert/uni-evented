import Ionicons from '@expo/vector-icons/Ionicons';
import { BottomTabScreenProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';

import { RootNavigatorParams } from '../App';

import DiscoverScreen from '../screens/DiscoverScreen';
import EventScreenNavigator from '../screens/EventScreenNavigator';
import MapScreen from '../screens/MapScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { useAuthStore } from '../state/auth';
import { IoniconsName } from '../types';

// https://reactnavigation.org/docs/typescript/
type TabNavigatorParams = {
    Discover: undefined;
    Map: undefined;
    Events: undefined;
    Profile: undefined;
};

// https://reactnavigation.org/docs/typescript/#combining-navigation-props
export type TabNavProps<T extends keyof TabNavigatorParams = keyof TabNavigatorParams> =
    CompositeScreenProps<
        BottomTabScreenProps<TabNavigatorParams, T>,
        NativeStackScreenProps<RootNavigatorParams>
    >;

export const Tab = createBottomTabNavigator<TabNavigatorParams>();

export default function TabNavigator() {
    const eventId = useAuthStore((state) => state.user?.currentEventId);

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
                    } else if (route.name === 'Events') {
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
            <Tab.Screen name="Events" component={EventScreenNavigator} />
            <Tab.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
        </Tab.Navigator>
    ); // Temporarily changed component of 'Events' to EventDetailScreen for easy acces during developement. Previous value: 'EventsScreen'
}
