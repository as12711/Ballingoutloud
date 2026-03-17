/**
 * Player statistics row component for game summary
 * @module components/game/PlayerRow
 */

import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { PlayerStats } from '../../types/gameSummary';

interface PlayerRowProps {
  player: PlayerStats;
  index?: number;
  testID?: string;
}

/**
 * Displays a single player's statistics in a table row format
 * Shows player name, jersey number, points, rebounds, assists, and fouls
 */
export const PlayerRow: React.FC<PlayerRowProps> = ({ player, index = 0, testID }) => {
  const rowBg = index % 2 === 0 ? 'bg-background' : 'bg-muted/50';

  return (
    <View className={`flex-row py-3 px-4 border-b border-border ${rowBg}`} testID={testID}>
      <View className="flex-1">
        <Text className="text-sm text-foreground">{player.playerName}</Text>
        <Text className="text-xs text-muted-foreground">#{player.jerseyNumber}</Text>
      </View>
      <View className="flex-row items-center">
        <Text className="text-sm text-foreground text-center w-[50px]">{player.points}</Text>
        <Text className="text-sm text-foreground text-center w-[50px]">{player.rebounds}</Text>
        <Text className="text-sm text-foreground text-center w-[50px]">{player.assists}</Text>
        <Text className="text-sm text-foreground text-center w-[50px]">{player.pfTf}</Text>
      </View>
    </View>
  );
};

export default PlayerRow;
