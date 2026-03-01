/**
 * Development Preview Screen for GameSummaryScreen
 * This screen allows previewing the GameSummaryScreen in browser/dev tools
 * with a test gameId for development purposes
 * 
 * @module screens/game/GameSummaryPreview
 */

import React from 'react';
import { View, StyleSheet, Text, Platform } from 'react-native';

/**
 * Preview wrapper that provides a test gameId
 * In a real app, you'd navigate from another screen with an actual gameId
 */
const GameSummaryPreview: React.FC = () => {
  // Test gameId - replace with an actual gameId from your database for testing
  const TEST_GAME_ID = process.env.EXPO_PUBLIC_TEST_GAME_ID || 'test-game-id-123';

  return (
    <View style={styles.container}>
      {__DEV__ && (
        <View style={styles.header}>
          <Text style={styles.headerText}>
            Game Summary Preview (Development Mode)
          </Text>
          <Text style={styles.subText}>
            Using test gameId: {TEST_GAME_ID}
          </Text>
          <Text style={styles.note}>
            To preview with real data: Set EXPO_PUBLIC_TEST_GAME_ID in .env with an actual game ID from your Supabase database.
          </Text>
          {Platform.OS === 'web' && (
            <Text style={styles.webNote}>
              Running in web browser - Some native features may be limited.
            </Text>
          )}
        </View>
      )}
      <View style={styles.screenWrapper}>
        <Text style={styles.infoText}>
          GameSummaryScreen needs to be accessed through navigation.
          {'\n\n'}For preview, please use the navigation setup or modify GameSummaryScreen
          to accept route as optional prop for development.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    padding: 16,
    backgroundColor: '#1a1a1a',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subText: {
    color: '#999',
    fontSize: 14,
    marginBottom: 8,
  },
  note: {
    color: '#ffa500',
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 4,
  },
  webNote: {
    color: '#4CAF50',
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 4,
  },
  screenWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  infoText: {
    color: '#999',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default GameSummaryPreview;
