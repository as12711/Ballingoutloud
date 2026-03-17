import React, { useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { MainStackParamList } from '../../navigation/MainNavigator';
import { useGame } from '../../hooks/useGame';
import ScoreBoard from '../../components/game/ScoreBoard';
import Loading from '../../components/common/Loading';
import { formatDateTime } from '../../utils/formatters';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

type GameDetailScreenRouteProp = RouteProp<MainStackParamList, 'GameDetail'>;
type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

const GameDetailScreen: React.FC = () => {
  const route = useRoute<GameDetailScreenRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { gameId } = route.params;
  const { currentGame, getGame, isLoading } = useGame();

  useEffect(() => {
    getGame(gameId);
  }, [gameId]);

  if (isLoading || !currentGame) {
    return <Loading fullScreen />;
  }

  return (
    <ScrollView className="flex-1 bg-background p-4">
      <ScoreBoard game={currentGame} />

      <Card className="my-2">
        <CardContent className="gap-3">
          <View className="flex-row justify-between">
            <Text className="text-base font-semibold text-muted-foreground">Venue:</Text>
            <Text className="text-base text-foreground">{currentGame.venue}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-base font-semibold text-muted-foreground">League:</Text>
            <Text className="text-base text-foreground">{currentGame.league}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-base font-semibold text-muted-foreground">Date & Time:</Text>
            <Text className="text-base text-foreground">{formatDateTime(currentGame.scheduledAt)}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-base font-semibold text-muted-foreground">Status:</Text>
            <Text className="text-base text-foreground">{currentGame.status.toUpperCase()}</Text>
          </View>
        </CardContent>
      </Card>

      <View className="p-4 gap-3">
        {currentGame.status === 'live' && (
          <Button
            variant="default"
            className="w-full"
            onPress={() => navigation.navigate('LiveStat', { gameId: currentGame.id })}
          >
            <Text>Track Live Stats</Text>
          </Button>
        )}
        <Button
          variant="outline"
          className="w-full"
          onPress={() => navigation.navigate('GameSummary', { gameId: currentGame.id })}
        >
          <Text>View Box Score</Text>
        </Button>
      </View>
    </ScrollView>
  );
};

export default GameDetailScreen;
