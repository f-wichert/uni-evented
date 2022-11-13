import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import { NavigationContainer, TypedNavigator } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './screens/LoginScreen';
import ViewEventScreen from './screens/ViewEventScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// function TabScreen(params: type) {}

export default function App() {
    return (
        // <Provider store={store}>
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name="LoginScreen"
                    component={LoginScreen}
                    // options={{ headerShown: false }}
                />
                <Stack.Screen name="EventScreen" component={ViewEventScreen} />
            </Stack.Navigator>
        </NavigationContainer>
        // {/* </Provider> */}
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
