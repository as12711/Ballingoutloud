import React from 'react';
import { View, Image, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../navigation/MainNavigator';
import { GameWithTeams } from '../../types/game';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Text } from '@/components/ui/text';
import { formatDateTime, formatScore } from '../../utils/formatters';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

interface GameCardProps {
  game: GameWithTeams;
}

function getStatusVariant(status: string) {
  switch (status) {
    case 'live':
      return 'destructive' as const;
    case 'completed':
      return 'secondary' as const;
    default:
      return 'default' as const;
  }
}

const GameCard: React.FC<GameCardProps> = ({ game }) => {
  const navigation = useNavigation<NavigationProp>();

  const handlePress = () => {
    navigation.navigate('GameDetail', { gameId: game.id });
  };

  return (
    <Pressable onPress={handlePress} className="mb-3">
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <Text className="text-sm font-semibold text-muted-foreground">{game.league}</Text>
          <Badge variant={getStatusVariant(game.status)}>
            <Text>{game.status.toUpperCase()}</Text>
          </Badge>
        </CardHeader>

        <CardContent className="flex-row items-center justify-between">
          <View className="flex-1 items-center">
            {game.homeTeam.logoUrl && (
              <Image
                source={{ uri: game.homeTeam.logoUrl }}
                className="mb-1 h-10 w-10 rounded-full"
              />
            )}
            <Text className="text-center text-sm text-muted-foreground">
              {game.homeTeam.name}
            </Text>
          </View>

          <View className="px-4">
            <Text className="text-2xl font-bold text-foreground">
              {formatScore(game.homeScore, game.awayScore)}
            </Text>
          </View>

          <View className="flex-1 items-center">
            {game.awayTeam.logoUrl && (
              <Image
                source={{ uri: game.awayTeam.logoUrl }}
                className="mb-1 h-10 w-10 rounded-full"
              />
            )}
            <Text className="text-center text-sm text-muted-foreground">
              {game.awayTeam.name}
            </Text>
          </View>
        </CardContent>

        <CardFooter className="flex-col items-start border-t border-border pt-3">
          <Text className="mb-1 text-sm text-muted-foreground">{game.venue}</Text>
          <Text className="text-xs text-muted-foreground">{formatDateTime(game.scheduledAt)}</Text>
        </CardFooter>
      </Card>
    </Pressable>
  );
};

export default GameCard;
