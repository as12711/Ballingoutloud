/**
 * Player statistics row component for game summary
 * @module components/game/PlayerRow
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PlayerStats } from '../../types/gameSummary';

interface PlayerRowProps {
  player: PlayerStats;
  testID?: string;
}

/**
 * Displays a single player's statistics in a table row format
 * Shows player name, jersey number, points, rebounds, assists, and fouls
 */
export const PlayerRow: React.FC<PlayerRowProps> = ({ player, testID }) => {
  return (
    <View style={styles.container} testID={testID}>
      <View style={styles.playerInfo}>
        <Text style={styles.playerName}>{player.playerName}</Text>
        <Text style={styles.jerseyNumber}>{player.jerseyNumber}</Text>
      </View>
      <View style={styles.statsRow}>
        <Text style={styles.statCell}>{player.points}</Text>
        <Text style={styles.statCell}>{player.rebounds}</Text>
        <Text style={styles.statCell}>{player.assists}</Text>
        <Text style={styles.statCell}>{player.pfTf}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 2,
  },
  jerseyNumber: {
    color: '#999',
    fontSize: 12,
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

export default PlayerRow;
