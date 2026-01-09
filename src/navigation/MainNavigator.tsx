import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GameStreamScreen from '../screens/game/GameStreamScreen';
import GameDetailScreen from '../screens/game/GameDetailScreen';
import LiveStatScreen from '../screens/game/LiveStatScreen';
import GameSummaryScreen from '../screens/game/GameSummaryScreen';
import TeamListScreen from '../screens/team/TeamListScreen';
import TeamDetailScreen from '../screens/team/TeamDetailScreen';
import CreateTeamScreen from '../screens/team/CreateTeamScreen';
import PlayerListScreen from '../screens/player/PlayerListScreen';
import PlayerDetailScreen from '../screens/player/PlayerDetailScreen';
import CreatePlayerScreen from '../screens/player/CreatePlayerScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import SettingsScreen from '../screens/profile/SettingsScreen';

export type MainStackParamList = {
  GameStream: undefined;
  GameDetail: { gameId: string };
  LiveStat: { gameId: string };
  GameSummary: { gameId: string };
  TeamList: undefined;
  TeamDetail: { teamId: string };
  CreateTeam: undefined;
  PlayerList: { teamId?: string };
  PlayerDetail: { playerId: string };
  CreatePlayer: { teamId: string };
  Profile: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<MainStackParamList>();

const MainNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#FF6B35',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="GameStream"
        component={GameStreamScreen}
        options={{ title: 'Game Stream' }}
      />
      <Stack.Screen
        name="GameDetail"
        component={GameDetailScreen}
        options={{ title: 'Game Details' }}
      />
      <Stack.Screen
        name="LiveStat"
        component={LiveStatScreen}
        options={{ title: 'Live Stats' }}
      />
      <Stack.Screen
        name="GameSummary"
        component={GameSummaryScreen}
        options={{ title: 'Box Score' }}
      />
      <Stack.Screen
        name="TeamList"
        component={TeamListScreen}
        options={{ title: 'Teams' }}
      />
      <Stack.Screen
        name="TeamDetail"
        component={TeamDetailScreen}
        options={{ title: 'Team Details' }}
      />
      <Stack.Screen
        name="CreateTeam"
        component={CreateTeamScreen}
        options={{ title: 'Create Team' }}
      />
      <Stack.Screen
        name="PlayerList"
        component={PlayerListScreen}
        options={{ title: 'Players' }}
      />
      <Stack.Screen
        name="PlayerDetail"
        component={PlayerDetailScreen}
        options={{ title: 'Player Details' }}
      />
      <Stack.Screen
        name="CreatePlayer"
        component={CreatePlayerScreen}
        options={{ title: 'Add Player' }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
    </Stack.Navigator>
  );
};

export default MainNavigator;
