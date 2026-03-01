import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GameWithTeams } from '../../types/game';
import { formatQuarter } from '../../utils/formatters';
import { theme, spacing } from '../../config/theme';

interface ScoreBoardProps {
  game: GameWithTeams;
  onQuarterPress?: (quarter: number) => void;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ game, onQuarterPress }) => {
  return (
    <View style={styles.container}>
      <View style={styles.teamsRow}>
        <View style={styles.teamColumn}>
          <Text style={styles.teamName}>{game.homeTeam.name}</Text>
          <Text style={styles.score}>{game.homeScore}</Text>
        </View>
        <View style={styles.vsColumn}>
          <Text style={styles.vs}>VS</Text>
        </View>
        <View style={styles.teamColumn}>
          <Text style={styles.teamName}>{game.awayTeam.name}</Text>
          <Text style={styles.score}>{game.awayScore}</Text>
        </View>
      </View>

      <View style={styles.quarterRow}>
        <Text style={styles.quarterLabel}>Quarter:</Text>
        <Text style={styles.quarter}>{formatQuarter(game.currentQuarter)}</Text>
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
  teamsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  teamColumn: {
    flex: 1,
    alignItems: 'center',
  },
  teamName: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: spacing.xs,
  },
  score: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  vsColumn: {
    paddingHorizontal: spacing.md,
  },
  vs: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  quarterRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  quarterLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginRight: spacing.xs,
  },
  quarter: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
});

export default ScoreBoard;
