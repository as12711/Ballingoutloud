/**
 * Game Summary Screen
 *
 * Displays a complete box score for a finished game, including:
 * - Team names and scores
 * - Team totals (points, rebounds, assists, fouls)
 * - Individual player statistics
 *
 * @module screens/game/GameSummaryScreen
 */

import React from 'react';
import { View, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';

import { Text } from '@/components/ui/text';
import { useGameSummary } from '../../hooks/useGameSummary';
import { GameSummaryHeader } from '../../components/game/GameSummaryHeader';
import { TeamSection } from '../../components/game/TeamSection';
import { GameSummaryError } from '../../components/game/GameSummaryError';

/**
 * Game Summary Screen Component
 *
 * Fetches and displays complete game statistics including team and player performance.
 * Supports refresh functionality to reload data.
 *
 * @routeParams gameId - Unique identifier for the game to display
 *
 * @example
 * ```tsx
 * <Stack.Screen
 *   name="GameSummary"
 *   component={GameSummaryScreen}
 * />
 *
 * // Navigate to screen:
 * navigation.navigate('GameSummary', { gameId: '123-456-789' });
 * ```
 */
export const GameSummaryScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { gameId } = (route.params as { gameId: string }) || {};

  const { homeTeam, awayTeam, loading, error, refetch } = useGameSummary(gameId);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleRefresh = async () => {
    await refetch();
  };

  // Loading state
  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-background" testID="game-summary-screen">
        <GameSummaryHeader
          onBack={handleBack}
          showRefresh={false}
          testID="game-summary-header"
        />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" />
          <Text className="mt-3 text-base text-muted-foreground">Loading game summary...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error state (only show if no data available)
  if (error && !homeTeam && !awayTeam) {
    return (
      <SafeAreaView className="flex-1 bg-background" testID="game-summary-screen">
        <GameSummaryHeader
          onBack={handleBack}
          showRefresh={false}
          testID="game-summary-header"
        />
        <GameSummaryError
          error={error}
          onRetry={refetch}
          testID="game-summary-error"
        />
      </SafeAreaView>
    );
  }

  // Main content
  return (
    <SafeAreaView className="flex-1 bg-background" testID="game-summary-screen">
      <GameSummaryHeader
        onBack={handleBack}
        onRefresh={handleRefresh}
        testID="game-summary-header"
      />

      <ScrollView
        className="flex-1"
        contentContainerClassName="p-4 gap-4"
        testID="game-summary-content"
      >
        {/* Home Team Section */}
        {homeTeam && (
          <TeamSection
            team={homeTeam}
            isHome={true}
            testID="home-team-section"
          />
        )}

        {/* Away Team Section */}
        {awayTeam && (
          <TeamSection
            team={awayTeam}
            isHome={false}
            testID="away-team-section"
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default GameSummaryScreen;
