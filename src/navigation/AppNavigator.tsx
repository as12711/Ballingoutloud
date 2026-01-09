import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RootStackParamList, MainTabParamList } from '../types';

// Import screens as they are created
// import AuthScreen from '../screens/auth/AuthScreen';
// import GameStreamScreen from '../screens/game/GameStreamScreen';
// import TeamsScreen from '../screens/team/TeamsScreen';
// import PlayersScreen from '../screens/player/PlayersScreen';
// import ProfileScreen from '../screens/profile/ProfileScreen';
// import GameDetailScreen from '../screens/game/GameDetailScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
  return (
    <Tab.Navigator>
      {/* Add tab screens here as they are created */}
      {/* <Tab.Screen name="GameStream" component={GameStreamScreen} /> */}
      {/* <Tab.Screen name="Teams" component={TeamsScreen} /> */}
      {/* <Tab.Screen name="Players" component={PlayersScreen} /> */}
      {/* <Tab.Screen name="Profile" component={ProfileScreen} /> */}
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Add stack screens here as they are created */}
        {/* <Stack.Screen name="Auth" component={AuthScreen} /> */}
        {/* <Stack.Screen name="Main" component={MainTabs} /> */}
        {/* <Stack.Screen name="GameDetail" component={GameDetailScreen} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
