/**
 * Team totals row component displaying aggregated team statistics
 * @module components/game/TeamTotalsRow
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TeamBoxScoreData } from '../../types/gameSummary';

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
    <View style={styles.container} testID={testID}>
      <View style={styles.labelContainer}>
        <Text style={styles.labelText}>TEAM TOTALS</Text>
      </View>
      <View style={styles.statsRow}>
        <Text style={styles.statCell}>{totals.points}</Text>
        <Text style={styles.statCell}>{totals.rebounds}</Text>
        <Text style={styles.statCell}>{totals.assists}</Text>
        <Text style={styles.statCell}>{totals.pfTf}</Text>
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
    alignItems: 'center',
  },
  labelContainer: {
    flex: 1,
  },
  labelText: {
    color: '#999',
    fontSize: 12,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statCell: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    width: 50,
  },
});

export default TeamTotalsRow;
