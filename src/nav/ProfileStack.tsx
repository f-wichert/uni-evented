import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import AdminEventScreen from '../screens/admin/AdminEventScreen';
import AdminEventsScreen from '../screens/admin/AdminEventsScreen';
import AdminMainScreen from '../screens/admin/AdminMainScreen';
import AdminUserScreen from '../screens/admin/AdminUserScreen';
import AdminUsersScreen from '../screens/admin/AdminUsersScreen';

import EditProfileScreen from '../screens/EditProfileScreen';
import ManageAccountScreen from '../screens/ManageAccountScreen';
import MyEventsScreen from '../screens/MyEventsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import createEventScreens from './eventDetailMixin';
import { ProfileStackNavParams } from './types';

const Stack = createNativeStackNavigator<ProfileStackNavParams>();

function ProfileStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="ProfileView"
                component={ProfileScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="EditProfile"
                component={EditProfileScreen}
                options={{ title: 'Edit Profile' }}
            />
            <Stack.Screen
                name="MyEvents"
                component={MyEventsScreen}
                options={{ title: 'My Events' }}
            />
            <Stack.Screen
                name="ManageAccount"
                component={ManageAccountScreen}
                options={{ title: 'Manage Account' }}
            />
            <Stack.Screen
                name="AdminMainScreen"
                component={AdminMainScreen}
                options={{ title: 'Content Moderation' }}
            />
            <Stack.Screen
                name="AdminUsersScreen"
                component={AdminUsersScreen}
                options={{ title: 'Users' }}
            />
            <Stack.Screen
                name="AdminUserScreen"
                component={AdminUserScreen}
                options={{ title: 'Edit User' }}
            />
            <Stack.Screen
                name="AdminEventsScreen"
                component={AdminEventsScreen}
                options={{ title: 'Edit User' }}
            />
            <Stack.Screen
                name="AdminEventScreen"
                component={AdminEventScreen}
                options={{ title: 'Edit User' }}
            />
            {createEventScreens(Stack.Screen)}
        </Stack.Navigator>
    );
}

export default ProfileStack;
