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
import { View, StyleSheet, ScrollView, ActivityIndicator, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';

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
      <SafeAreaView style={styles.container} testID="game-summary-screen">
        <GameSummaryHeader 
          onBack={handleBack} 
          showRefresh={false}
          testID="game-summary-header"
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Loading game summary...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error state (only show if no data available)
  if (error && !homeTeam && !awayTeam) {
    return (
      <SafeAreaView style={styles.container} testID="game-summary-screen">
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
    <SafeAreaView style={styles.container} testID="game-summary-screen">
      <GameSummaryHeader 
        onBack={handleBack} 
        onRefresh={handleRefresh}
        testID="game-summary-header"
      />
      
      <ScrollView 
        style={styles.content}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 12,
    fontSize: 16,
  },
});

export default GameSummaryScreen;
