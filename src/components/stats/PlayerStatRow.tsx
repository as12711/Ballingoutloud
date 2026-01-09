import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PlayerStatRow as PlayerStatRowType } from '../../types/stat';
import { formatStatPercentage } from '../../utils/formatters';
import { theme, spacing } from '../../config/theme';

interface PlayerStatRowProps {
  stat: PlayerStatRowType;
  showDetails?: boolean;
}

const PlayerStatRow: React.FC<PlayerStatRowProps> = ({ stat, showDetails = false }) => {
  return (
    <View style={styles.container}>
      <View style={styles.playerInfo}>
        <Text style={styles.jerseyNumber}>#{stat.jersey_number}</Text>
        <Text style={styles.playerName}>{stat.player_name}</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statColumn}>
          <Text style={styles.statValue}>{stat.points}</Text>
          <Text style={styles.statLabel}>PTS</Text>
        </View>
        <View style={styles.statColumn}>
          <Text style={styles.statValue}>{stat.rebounds}</Text>
          <Text style={styles.statLabel}>RBD</Text>
        </View>
        <View style={styles.statColumn}>
          <Text style={styles.statValue}>{stat.assists}</Text>
          <Text style={styles.statLabel}>AST</Text>
        </View>
        <View style={styles.statColumn}>
          <Text style={styles.statValue}>{stat.fouls}</Text>
          <Text style={styles.statLabel}>PF</Text>
        </View>
      </View>

      {showDetails && (
        <View style={styles.detailsRow}>
          <Text style={styles.detailText}>
            FG: {stat.fg_made}/{stat.fg_attempts} ({formatStatPercentage(stat.fg_made, stat.fg_attempts)})
          </Text>
          <Text style={styles.detailText}>
            3PT: {stat.three_pt_made}/{stat.three_pt_attempts} (
            {formatStatPercentage(stat.three_pt_made, stat.three_pt_attempts)})
          </Text>
          <Text style={styles.detailText}>
            FT: {stat.free_throw_made}/{stat.free_throw_attempts} (
            {formatStatPercentage(stat.free_throw_made, stat.free_throw_attempts)})
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  jerseyNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginRight: spacing.sm,
    minWidth: 40,
  },
  playerName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    flex: 1,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: spacing.xs,
  },
  statColumn: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: spacing.xs / 2,
  },
  detailsRow: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  detailText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: spacing.xs / 2,
  },
});

export default PlayerStatRow;
