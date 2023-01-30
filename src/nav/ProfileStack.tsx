import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import EditProfileScreen from '../screens/EditProfileScreen';
import ManageAccountScreen from '../screens/ManageAccountScreen';
import MyProfileScreen from '../screens/MyProfileScreen';
import UserEventListScreen from '../screens/UserEventListScreen';
import createCommonScreens from './commonScreensMixin';
import { ProfileStackNavParams } from './types';

const Stack = createNativeStackNavigator<ProfileStackNavParams>();

function ProfileStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="MyProfileView"
                component={MyProfileScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="EditProfile"
                component={EditProfileScreen}
                options={{ title: 'Edit Profile' }}
            />
            <Stack.Screen
                name="UserEventList"
                component={UserEventListScreen}
                options={({ route }) => ({
                    title: {
                        hostedEvents: 'Hosted Events',
                        interestedEvents: 'Interested Events',
                        pastEvents: 'Visited Events',
                    }[route.params.type],
                })}
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
