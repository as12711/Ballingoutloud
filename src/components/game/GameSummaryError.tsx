/**
 * Error display component for game summary screen
 * @module components/game/GameSummaryError
 */

import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

interface GameSummaryErrorProps {
  error: string;
  onRetry: () => void;
  testID?: string;
}

/**
 * Error state display with retry functionality
 * Shows when game summary data fails to load
 */
export const GameSummaryError: React.FC<GameSummaryErrorProps> = ({
  error,
  onRetry,
  testID
}) => {
  return (
    <View className="flex-1 justify-center items-center px-6" testID={testID}>
      <Card className="border-destructive w-full">
        <CardContent className="items-center py-8">
          <Ionicons name="alert-circle" size={48} className="text-destructive" />
          <Text className="text-destructive mt-4 text-base text-center">{error}</Text>
          <Button
            variant="destructive"
            onPress={onRetry}
            className="mt-6"
            testID={`${testID}-retry-button`}
          >
            <Text>Retry</Text>
          </Button>
        </CardContent>
      </Card>
    </View>
  );
};

export default GameSummaryError;
