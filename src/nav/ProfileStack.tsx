import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import EditProfileScreen from '../screens/EditProfileScreen';
import ManageAccountScreen from '../screens/ManageAccountScreen';
import MyEventsScreen from '../screens/MyEventsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import createCommonScreens from './commonScreensMixin';
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
            {createCommonScreens(Stack.Screen)}
        </Stack.Navigator>
    );
}

export default ProfileStack;
