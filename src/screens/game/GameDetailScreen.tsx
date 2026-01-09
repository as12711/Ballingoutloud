import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { MainStackParamList } from '../../navigation/MainNavigator';
import { useGame } from '../../hooks/useGame';
import ScoreBoard from '../../components/game/ScoreBoard';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import { theme, spacing } from '../../config/theme';
import { formatDateTime } from '../../utils/formatters';

type GameDetailScreenRouteProp = RouteProp<MainStackParamList, 'GameDetail'>;
type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

const GameDetailScreen: React.FC = () => {
  const route = useRoute<GameDetailScreenRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { gameId } = route.params;
  const { currentGame, getGame, isLoading } = useGame();

  useEffect(() => {
    getGame(gameId);
  }, [gameId]);

  if (isLoading || !currentGame) {
    return <Loading fullScreen />;
  }

  return (
    <ScrollView style={styles.container}>
      <ScoreBoard game={currentGame} />

      <View style={styles.detailsSection}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Venue:</Text>
          <Text style={styles.detailValue}>{currentGame.venue}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>League:</Text>
          <Text style={styles.detailValue}>{currentGame.league}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Date & Time:</Text>
          <Text style={styles.detailValue}>{formatDateTime(currentGame.scheduled_at)}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Status:</Text>
          <Text style={styles.detailValue}>{currentGame.status.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.actionsSection}>
        {currentGame.status === 'live' && (
          <Button
            title="Track Live Stats"
            onPress={() => navigation.navigate('LiveStat', { gameId: currentGame.id })}
            fullWidth
            style={styles.button}
          />
        )}
        <Button
          title="View Box Score"
          onPress={() => navigation.navigate('GameSummary', { gameId: currentGame.id })}
          variant="outline"
          fullWidth
          style={styles.button}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  detailsSection: {
    padding: spacing.md,
    backgroundColor: theme.colors.surface,
    marginVertical: spacing.sm,
    borderRadius: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  detailValue: {
    fontSize: 16,
    color: theme.colors.text,
  },
  actionsSection: {
    padding: spacing.md,
  },
  button: {
    marginBottom: spacing.sm,
  },
});

export default GameDetailScreen;
