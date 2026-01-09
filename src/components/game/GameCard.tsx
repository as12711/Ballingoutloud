import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../navigation/MainNavigator';
import { GameWithTeams } from '../../types/game';
import Card from '../common/Card';
import { formatDateTime, formatScore } from '../../utils/formatters';
import { theme, spacing } from '../../config/theme';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

interface GameCardProps {
  game: GameWithTeams;
}

const GameCard: React.FC<GameCardProps> = ({ game }) => {
  const navigation = useNavigation<NavigationProp>();

  const handlePress = () => {
    navigation.navigate('GameDetail', { gameId: game.id });
  };

  return (
    <Card onPress={handlePress}>
      <View style={styles.header}>
        <Text style={styles.league}>{game.league}</Text>
        <Text style={styles.status}>{game.status.toUpperCase()}</Text>
      </View>

      <View style={styles.teamsContainer}>
        <View style={styles.team}>
          {game.home_team.logo_url && (
            <Image source={{ uri: game.home_team.logo_url }} style={styles.logo} />
          )}
          <Text style={styles.teamName}>{game.home_team.name}</Text>
        </View>

        <View style={styles.scoreContainer}>
          <Text style={styles.score}>{formatScore(game.home_score, game.away_score)}</Text>
        </View>

        <View style={styles.team}>
          {game.away_team.logo_url && (
            <Image source={{ uri: game.away_team.logo_url }} style={styles.logo} />
          )}
          <Text style={styles.teamName}>{game.away_team.name}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.venue}>{game.venue}</Text>
        <Text style={styles.date}>{formatDateTime(game.scheduled_at)}</Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  league: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  status: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  teamsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: spacing.md,
  },
  team: {
    flex: 1,
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: spacing.xs,
  },
  teamName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    textAlign: 'center',
  },
  scoreContainer: {
    paddingHorizontal: spacing.md,
  },
  score: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  footer: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  venue: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: spacing.xs,
  },
  date: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
});

export default GameCard;
