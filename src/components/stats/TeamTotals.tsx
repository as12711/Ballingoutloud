import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BoxScore } from '../../types/stat';
import { theme, spacing } from '../../config/theme';

interface TeamTotalsProps {
  boxScore: BoxScore;
}

const TeamTotals: React.FC<TeamTotalsProps> = ({ boxScore }) => {
  const homeFouls = boxScore.home_team.players.reduce((sum, p) => sum + p.fouls, 0);
  const awayFouls = boxScore.away_team.players.reduce((sum, p) => sum + p.fouls, 0);

  return (
    <View style={styles.container}>
      <View style={styles.teamRow}>
        <View style={styles.teamColumn}>
          <Text style={styles.teamName}>{boxScore.home_team.team_name}</Text>
          <Text style={styles.totalPoints}>{boxScore.home_team.total_points}</Text>
          <Text style={styles.totalFouls}>Fouls: {homeFouls}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.teamColumn}>
          <Text style={styles.teamName}>{boxScore.away_team.team_name}</Text>
          <Text style={styles.totalPoints}>{boxScore.away_team.total_points}</Text>
          <Text style={styles.totalFouls}>Fouls: {awayFouls}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginVertical: spacing.sm,
  },
  teamRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  teamColumn: {
    flex: 1,
    alignItems: 'center',
  },
  teamName: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: spacing.sm,
  },
  totalPoints: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: spacing.xs,
  },
  totalFouls: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  divider: {
    width: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: spacing.md,
  },
});

export default TeamTotals;
