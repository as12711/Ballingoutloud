/**
 * Team totals row component displaying aggregated team statistics
 * @module components/game/TeamTotalsRow
 */

import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';

interface TeamTotalsRowProps {
  totals: {
    points: number;
    rebounds: number;
    assists: number;
    pfTf: string;
  };
  testID?: string;
}

/**
 * Displays team totals row showing aggregated statistics
 * Used below team header and above player statistics
 */
export const TeamTotalsRow: React.FC<TeamTotalsRowProps> = ({ totals, testID }) => {
  return (
    <View className="flex-row items-center py-2 px-4 font-bold border-t border-border bg-muted" testID={testID}>
      <View className="flex-1">
        <Text className="text-xs font-semibold text-muted-foreground uppercase">Team Totals</Text>
      </View>
      <View className="flex-row items-center">
        <Text className="text-sm font-bold text-foreground text-center w-[50px]">{totals.points}</Text>
        <Text className="text-sm font-bold text-foreground text-center w-[50px]">{totals.rebounds}</Text>
        <Text className="text-sm font-bold text-foreground text-center w-[50px]">{totals.assists}</Text>
        <Text className="text-sm font-bold text-foreground text-center w-[50px]">{totals.pfTf}</Text>
      </View>
    </View>
  );
};

export default TeamTotalsRow;
