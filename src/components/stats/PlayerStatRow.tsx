import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { PlayerStatRow as PlayerStatRowType } from '../../types/stat';
import { formatStatPercentage } from '../../utils/formatters';

interface PlayerStatRowProps {
  stat: PlayerStatRowType;
  showDetails?: boolean;
}

const PlayerStatRow: React.FC<PlayerStatRowProps> = ({ stat, showDetails = false }) => {
  return (
    <View className="py-3 px-4 border-b border-border">
      <View className="flex-row items-center mb-1">
        <Text className="text-base font-bold text-primary mr-3 min-w-[40px]">
          #{stat.jersey_number}
        </Text>
        <Text className="text-base font-medium text-foreground flex-1">
          {stat.player_name}
        </Text>
      </View>

      <View className="flex-row justify-around mt-1">
        <View className="items-center">
          <Text className="text-lg font-bold text-foreground tabular-nums">{stat.points}</Text>
          <Text className="text-xs text-muted-foreground mt-0.5">PTS</Text>
        </View>
        <View className="items-center">
          <Text className="text-lg font-bold text-foreground tabular-nums">{stat.rebounds}</Text>
          <Text className="text-xs text-muted-foreground mt-0.5">RBD</Text>
        </View>
        <View className="items-center">
          <Text className="text-lg font-bold text-foreground tabular-nums">{stat.assists}</Text>
          <Text className="text-xs text-muted-foreground mt-0.5">AST</Text>
        </View>
        <View className="items-center">
          <Text className="text-lg font-bold text-foreground tabular-nums">{stat.fouls}</Text>
          <Text className="text-xs text-muted-foreground mt-0.5">PF</Text>
        </View>
      </View>

      {showDetails && (
        <View className="mt-3 pt-3 border-t border-border">
          <Text className="text-sm text-muted-foreground tabular-nums mb-0.5">
            FG: {stat.fg_made}/{stat.fg_attempts} ({formatStatPercentage(stat.fg_made, stat.fg_attempts)})
          </Text>
          <Text className="text-sm text-muted-foreground tabular-nums mb-0.5">
            3PT: {stat.three_pt_made}/{stat.three_pt_attempts} (
            {formatStatPercentage(stat.three_pt_made, stat.three_pt_attempts)})
          </Text>
          <Text className="text-sm text-muted-foreground tabular-nums mb-0.5">
            FT: {stat.free_throw_made}/{stat.free_throw_attempts} (
            {formatStatPercentage(stat.free_throw_made, stat.free_throw_attempts)})
          </Text>
        </View>
      )}
    </View>
  );
};

export default PlayerStatRow;
