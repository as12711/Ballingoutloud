import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../navigation/MainNavigator';
import { useGame } from '../../hooks/useGame';
import GameCard from '../../components/game/GameCard';
import SearchBar from '../../components/common/SearchBar';
import Loading from '../../components/common/Loading';
import { theme, spacing } from '../../config/theme';
import { GameWithTeams } from '../../types/game';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

const GameStreamScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { games, isLoading, getGames } = useGame();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredGames, setFilteredGames] = useState<GameWithTeams[]>([]);

  useEffect(() => {
    getGames({ status: 'live' });
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = games.filter(
        (game) =>
          game.home_team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          game.away_team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          game.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
          game.league.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredGames(filtered);
    } else {
      setFilteredGames(games);
    }
  }, [searchQuery, games]);

  const handleRefresh = () => {
    getGames({ status: 'live' });
  };

  if (isLoading && games.length === 0) {
    return <Loading fullScreen />;
  }

  return (
    <View style={styles.container}>
      <SearchBar placeholder="Search games..." onSearch={setSearchQuery} />
      <FlatList
        data={filteredGames}
        renderItem={({ item }) => <GameCard game={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No games found</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  list: {
    padding: spacing.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
});

export default GameStreamScreen;
