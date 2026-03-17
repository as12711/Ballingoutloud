import React from 'react';
import { View } from 'react-native';
import { GameWithTeams } from '../../types/game';
import { formatQuarter } from '../../utils/formatters';
import { Card, CardContent } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface ScoreBoardProps {
  game: GameWithTeams;
  onQuarterPress?: (quarter: number) => void;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ game, onQuarterPress }) => {
  return (
    <Card className="my-2">
      <CardContent>
        <View className="flex-row items-center justify-around mb-4">
          <View className="flex-1 items-center">
            <Text className="text-lg font-semibold text-foreground mb-1">
              {game.homeTeam.name}
            </Text>
            <Text className="text-4xl font-bold text-foreground">
              {game.homeScore}
            </Text>
          </View>

          <Separator orientation="vertical" className="h-16 mx-2" />

          <View className="flex-1 items-center">
            <Text className="text-lg font-semibold text-foreground mb-1">
              {game.awayTeam.name}
            </Text>
            <Text className="text-4xl font-bold text-foreground">
              {game.awayScore}
            </Text>
          </View>
        </View>

        <Separator className="mb-3" />

        <View className="flex-row items-center justify-center">
          <Badge variant="secondary">
            <Text>{formatQuarter(game.currentQuarter)}</Text>
          </Badge>
        </View>
      </CardContent>
    </Card>
  );
};

export default ScoreBoard;
