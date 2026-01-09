/**
 * Statistics header row component for game summary table
 * @module components/game/StatsHeader
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StatsHeaderProps {
  testID?: string;
}

/**
 * Column headers for the statistics table
 * Displays: Player, PTS (Points), RBD (Rebounds), AST (Assists), PF/TF (Personal Fouls/Technical Fouls)
 */
export const StatsHeader: React.FC<StatsHeaderProps> = ({ testID }) => {
  return (
    <View style={styles.container} testID={testID}>
      <View style={styles.playerInfoHeader}>
        <Text style={styles.headerText}>Player</Text>
      </View>
      <View style={styles.statsRow}>
        <Text style={styles.headerText}>PTS</Text>
        <Text style={styles.headerText}>RBD</Text>
        <Text style={styles.headerText}>AST</Text>
        <Text style={styles.headerText}>PF/TF</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  playerInfoHeader: {
    flex: 1,
  },
  headerText: {
    color: '#999',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    width: 50,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default StatsHeader;
