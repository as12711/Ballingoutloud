import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { MainStackParamList } from '../../navigation/MainNavigator';
import { useGame } from '../../hooks/useGame';
import { useStats } from '../../hooks/useStats';
import ScoreBoard from '../../components/game/ScoreBoard';
import StatButton from '../../components/stats/StatButton';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import { theme, spacing } from '../../config/theme';
import { formatQuarter } from '../../utils/formatters';

type LiveStatScreenRouteProp = RouteProp<MainStackParamList, 'LiveStat'>;
type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

const LiveStatScreen: React.FC = () => {
  const route = useRoute<LiveStatScreenRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { gameId } = route.params;
  const { currentGame, getGame, updateGame } = useGame();
  const { getGameStats, recordStatEvent, undo } = useStats();
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

  useEffect(() => {
    getGame(gameId);
    getGameStats(gameId);
  }, [gameId]);

  if (!currentGame) {
    return <Loading fullScreen />;
  }

  const handleStatPress = (eventType: string) => {
    if (!selectedPlayer || !selectedTeam) {
      // Show player selection modal
      return;
    }
    // Record stat event
    recordStatEvent(
      gameId,
      selectedPlayer,
      selectedTeam,
      eventType as any,
      currentGame.current_quarter,
      'current-user-id' // Replace with actual user ID
    );
  };

  return (
    <ScrollView style={styles.container}>
      <ScoreBoard game={currentGame} />

      <View style={styles.quarterSection}>
        <Text style={styles.sectionTitle}>Current Quarter: {formatQuarter(currentGame.current_quarter)}</Text>
      </View>

      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Shooting</Text>
        <View style={styles.buttonRow}>
          <StatButton
            label="2PT FGA"
            onPress={() => handleStatPress('2pt_fga')}
            size="medium"
          />
          <StatButton
            label="2PT FGM"
            onPress={() => handleStatPress('2pt_fgm')}
            size="medium"
          />
          <StatButton
            label="3PT FGA"
            onPress={() => handleStatPress('3pt_fga')}
            size="medium"
          />
          <StatButton
            label="3PT FGM"
            onPress={() => handleStatPress('3pt_fgm')}
            size="medium"
          />
        </View>
      </View>

      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Actions</Text>
        <View style={styles.buttonRow}>
          <StatButton
            label="Rebound"
            onPress={() => handleStatPress('rebound')}
            size="medium"
          />
          <StatButton
            label="Assist"
            onPress={() => handleStatPress('assist')}
            size="medium"
          />
          <StatButton
            label="Steal"
            onPress={() => handleStatPress('steal')}
            size="medium"
          />
          <StatButton
            label="Block"
            onPress={() => handleStatPress('block')}
            size="medium"
          />
        </View>
      </View>

      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Other</Text>
        <View style={styles.buttonRow}>
          <StatButton
            label="Foul"
            onPress={() => handleStatPress('foul')}
            variant="secondary"
            size="medium"
          />
          <StatButton
            label="Turnover"
            onPress={() => handleStatPress('turnover')}
            variant="secondary"
            size="medium"
          />
        </View>
      </View>

      <View style={styles.actionsSection}>
        <Button
          title="Undo Last Action"
          onPress={undo}
          variant="outline"
          fullWidth
          style={styles.actionButton}
        />
        <Button
          title="View Game Summary"
          onPress={() => navigation.navigate('GameSummary', { gameId })}
          fullWidth
          style={styles.actionButton}
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
  quarterSection: {
    padding: spacing.md,
    backgroundColor: theme.colors.surface,
    marginVertical: spacing.sm,
  },
  statsSection: {
    padding: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: spacing.md,
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  actionsSection: {
    padding: spacing.md,
  },
  actionButton: {
    marginBottom: spacing.sm,
  },
});

export default LiveStatScreen;
