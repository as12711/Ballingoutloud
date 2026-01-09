/**
 * Header component for game summary screen
 * @module components/game/GameSummaryHeader
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
    <View style={styles.container} testID={testID}>
      <TouchableOpacity 
        onPress={onBack}
        testID={`${testID}-back-button`}
      >
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>
      
      <Text style={styles.title}>Game Summary</Text>
      
      {showRefresh && onRefresh ? (
        <TouchableOpacity 
          onPress={onRefresh}
          testID={`${testID}-refresh-button`}
        >
          <Ionicons name="refresh" size={24} color="#fff" />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 24 }} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#000',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
});

export default GameSummaryHeader;
