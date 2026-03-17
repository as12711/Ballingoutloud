import React from 'react';
import { View } from 'react-native';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { Separator } from '@/components/ui/separator';
import { BoxScore } from '../../types/stat';

interface TeamTotalsProps {
  boxScore: BoxScore;
}

const TeamTotals: React.FC<TeamTotalsProps> = ({ boxScore }) => {
  const homeFouls = boxScore.home_team.players.reduce((sum, p) => sum + p.fouls, 0);
  const awayFouls = boxScore.away_team.players.reduce((sum, p) => sum + p.fouls, 0);

  return (
    <Card className="my-2">
      <CardHeader>
        <CardTitle>Team Totals</CardTitle>
      </CardHeader>
      <CardContent>
        <View className="flex-row justify-around">
          <View className="flex-1 items-center">
            <Text className="text-lg font-semibold text-foreground mb-2">
              {boxScore.home_team.team_name}
            </Text>
            <Text className="text-3xl font-bold text-primary tabular-nums mb-1">
              {boxScore.home_team.total_points}
            </Text>
            <Text className="text-sm text-muted-foreground">Fouls: {homeFouls}</Text>
          </View>
          <Separator orientation="vertical" className="mx-4" />
          <View className="flex-1 items-center">
            <Text className="text-lg font-semibold text-foreground mb-2">
              {boxScore.away_team.team_name}
            </Text>
            <Text className="text-3xl font-bold text-primary tabular-nums mb-1">
              {boxScore.away_team.total_points}
            </Text>
            <Text className="text-sm text-muted-foreground">Fouls: {awayFouls}</Text>
          </View>
        </View>
      </CardContent>
    </Card>
  );
};

export default TeamTotals;
