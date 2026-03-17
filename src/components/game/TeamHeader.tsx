/**
 * Team header component displaying team name and total score
 * @module components/game/TeamHeader
 */

import React from 'react';
import { View } from 'react-native';
import { CardHeader } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { Badge } from '@/components/ui/badge';

interface TeamHeaderProps {
  teamName: string;
  score: number;
  isHome?: boolean;
  testID?: string;
}

/**
 * Team header displaying team name and total points
 * Used at the top of each team's section in the game summary
 */
export const TeamHeader: React.FC<TeamHeaderProps> = ({
  teamName,
  score,
  isHome = false,
  testID
}) => {
  return (
    <CardHeader className="flex-row justify-between items-center" testID={testID}>
      <Text className="text-xl font-bold text-foreground">{teamName}</Text>
      <Badge variant={isHome ? 'default' : 'secondary'}>
        <Text className="text-lg font-bold">{score}</Text>
      </Badge>
    </CardHeader>
  );
};

export default TeamHeader;
