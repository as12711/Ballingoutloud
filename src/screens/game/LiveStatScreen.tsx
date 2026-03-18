import React, { useEffect, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { MainStackParamList } from '../../navigation/MainNavigator';
import { useGame } from '../../hooks/useGame';
import { useStats } from '../../hooks/useStats';
import ScoreBoard from '../../components/game/ScoreBoard';
import StatButton from '../../components/stats/StatButton';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import Loading from '@/components/ui/loading';
import { formatQuarter } from '../../utils/formatters';

type LiveStatScreenRouteProp = RouteProp<MainStackParamList, 'LiveStat'>;
type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

const LiveStatScreen: React.FC = () => {
  const route = useRoute<LiveStatScreenRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { gameId } = route.params;
  const { currentGame, getGame, updateGame } = useGame();
  const { getGameStats, recordStatEvent, undo } = useStats();
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

  useEffect(() => {
    getGame(gameId);
    getGameStats(gameId);
  }, [gameId]);

  if (!currentGame) {
    return <Loading fullScreen />;
  }

  const handleStatPress = (eventType: string) => {
    if (!selectedPlayer || !selectedTeam) {
      // Show player selection modal
      return;
    }
    // Record stat event
    recordStatEvent(
      gameId,
      selectedPlayer,
      selectedTeam,
      eventType as any,
      currentGame.currentQuarter,
      'current-user-id' // Replace with actual user ID
    );
  };

  return (
    <ScrollView className="flex-1 bg-background">
      <ScoreBoard game={currentGame} />

      <View className="p-4 border-b border-border bg-card">
        <Text className="text-lg font-semibold text-foreground">
          Current Quarter: {formatQuarter(currentGame.currentQuarter)}
        </Text>
      </View>

      <View className="p-4">
        <Text className="text-lg font-semibold text-foreground mb-4">Shooting</Text>
        <View className="flex-row flex-wrap gap-2">
          <StatButton
            label="2PT FGA"
            onPress={() => handleStatPress('2pt_fga')}
            variant="missed"
          />
          <StatButton
            label="2PT FGM"
            onPress={() => handleStatPress('2pt_fgm')}
            variant="made"
          />
          <StatButton
            label="3PT FGA"
            onPress={() => handleStatPress('3pt_fga')}
            variant="missed"
          />
          <StatButton
            label="3PT FGM"
            onPress={() => handleStatPress('3pt_fgm')}
            variant="made"
          />
        </View>
      </View>

      <View className="p-4">
        <Text className="text-lg font-semibold text-foreground mb-4">Actions</Text>
        <View className="flex-row flex-wrap gap-2">
          <StatButton
            label="Rebound"
            onPress={() => handleStatPress('rebound')}
            variant="action"
          />
          <StatButton
            label="Assist"
            onPress={() => handleStatPress('assist')}
            variant="action"
          />
          <StatButton
            label="Steal"
            onPress={() => handleStatPress('steal')}
            variant="action"
          />
          <StatButton
            label="Block"
            onPress={() => handleStatPress('block')}
            variant="action"
          />
        </View>
      </View>

      <View className="p-4">
        <Text className="text-lg font-semibold text-foreground mb-4">Other</Text>
        <View className="flex-row flex-wrap gap-2">
          <StatButton
            label="Foul"
            onPress={() => handleStatPress('foul')}
            variant="negative"
          />
          <StatButton
            label="Turnover"
            onPress={() => handleStatPress('turnover')}
            variant="negative"
          />
        </View>
      </View>

      <View className="p-4">
        <Button
          variant="outline"
          onPress={undo}
          className="w-full mb-3"
        >
          <Text>Undo Last Action</Text>
        </Button>
        <Button
          onPress={() => navigation.navigate('GameSummary', { gameId })}
          className="w-full"
        >
          <Text>View Game Summary</Text>
        </Button>
      </View>
    </ScrollView>
  );
};

export default LiveStatScreen;
