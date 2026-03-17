/**
 * Header component for game summary screen
 * @module components/game/GameSummaryHeader
 */

import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

interface GameSummaryHeaderProps {
  onBack: () => void;
  onRefresh?: () => void;
  showRefresh?: boolean;
  testID?: string;
}

/**
 * Screen header with back button, title, and optional refresh button
 */
export const GameSummaryHeader: React.FC<GameSummaryHeaderProps> = ({
  onBack,
  onRefresh,
  showRefresh = true,
  testID
}) => {
  return (
    <View className="flex-row justify-between items-center px-4 py-3 bg-background" testID={testID}>
      <Button
        variant="ghost"
        size="icon"
        onPress={onBack}
        testID={`${testID}-back-button`}
      >
        <Ionicons name="chevron-back" size={24} className="text-foreground" />
      </Button>

      <Text className="text-lg font-semibold">Game Summary</Text>

      {showRefresh && onRefresh ? (
        <Button
          variant="ghost"
          size="icon"
          onPress={onRefresh}
          testID={`${testID}-refresh-button`}
        >
          <Ionicons name="refresh" size={24} className="text-foreground" />
        </Button>
      ) : (
        <View className="w-10" />
      )}
    </View>
  );
};

export default GameSummaryHeader;
