import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import MapPicker from '../components/MapPicker';
import CreateEventScreen from '../screens/CreateEventScreen';

const Stack = createNativeStackNavigator<RootNavigatorParams>();

function CreateEventScreenStack(props) {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="CreateEvent"
                component={CreateEventScreen}
                options={{ headerShown: false, animation: 'fade' }}
            />
            <Stack.Screen name="MapPicker" component={MapPicker} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
}

export default CreateEventScreenStack;
