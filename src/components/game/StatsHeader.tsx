/**
 * Statistics header row component for game summary table
 * @module components/game/StatsHeader
 */

import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';

interface StatsHeaderProps {
  testID?: string;
}

/**
 * Column headers for the statistics table
 * Displays: Player, PTS (Points), RBD (Rebounds), AST (Assists), PF/TF (Personal Fouls/Technical Fouls)
 */
export const StatsHeader: React.FC<StatsHeaderProps> = ({ testID }) => {
  return (
    <View className="bg-muted flex-row py-2 px-3" testID={testID}>
      <View className="flex-1">
        <Text className="text-xs font-semibold text-muted-foreground">Player</Text>
      </View>
      <View className="flex-row items-center">
        <Text className="text-xs font-semibold text-muted-foreground text-center w-[50px]">PTS</Text>
        <Text className="text-xs font-semibold text-muted-foreground text-center w-[50px]">RBD</Text>
        <Text className="text-xs font-semibold text-muted-foreground text-center w-[50px]">AST</Text>
        <Text className="text-xs font-semibold text-muted-foreground text-center w-[50px]">PF/TF</Text>
      </View>
    </View>
  );
};

export default StatsHeader;
