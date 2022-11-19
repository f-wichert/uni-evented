import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Ionicons from '@expo/vector-icons/Ionicons';

import { Provider as AuthProvider } from './contexts/authContext';
import CreateEventScreen from './screens/CreateEventScreen';
import DiscoverScreen from './screens/DiscoverScreen';
import LoginScreen from './screens/LoginScreen';
import MapScreen from './screens/MapScreen';
import ViewEventScreen from './screens/ViewEventScreen';
import { IoniconsName } from './types';

// https://reactnavigation.org/docs/typescript/

export type RootNavigatorParams = {
  LoginScreen: undefined;
  TabScreen: undefined;
  EventScreen: undefined;
};

const Stack = createNativeStackNavigator<RootNavigatorParams>();

export type TabNavigatorParams = {
  Discover: undefined;
  Create: undefined;
  Map: undefined;
};

const Tab = createBottomTabNavigator<TabNavigatorParams>();

function TabScreen() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: IoniconsName;

          if (route.name === 'Discover') {
            iconName = focused ? 'play' : 'play-outline';
            // } else if (route.name === 'Settings') {
            //   iconName = focused ? 'settings' : 'settings-outline';
          } else if (route.name === 'Map') {
            iconName = focused ? 'map' : 'map-outline';
            // } else if (route.name === 'Profile') {
            //   iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Create') {
            iconName = focused ? 'add' : 'add-outline';
          } else {
            throw new Error(`Unknown route '${route.name}'`);
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Discover" component={DiscoverScreen} />
      <Tab.Screen name="Create" component={CreateEventScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="LoginScreen"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="TabScreen" component={TabScreen} options={{ headerShown: false }} />
          <Stack.Screen name="EventScreen" component={ViewEventScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
