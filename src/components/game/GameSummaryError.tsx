/**
 * Error display component for game summary screen
 * @module components/game/GameSummaryError
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
    <View style={styles.container} testID={testID}>
      <Ionicons name="alert-circle" size={48} color="#ff4444" />
      <Text style={styles.errorText}>{error}</Text>
      <TouchableOpacity 
        style={styles.retryButton} 
        onPress={onRetry}
        testID={`${testID}-retry-button`}
      >
        <Text style={styles.retryButtonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  errorText: {
    color: '#ff4444',
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default GameSummaryError;
