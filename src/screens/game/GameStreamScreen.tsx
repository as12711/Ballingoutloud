import React, { useEffect, useState } from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../navigation/MainNavigator';
import { useGame } from '../../hooks/useGame';
import GameCard from '../../components/game/GameCard';
import SearchBar from '../../components/common/SearchBar';
import Loading from '@/components/ui/loading';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { GameWithTeams } from '../../types/game';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

type FilterTab = 'all' | 'live' | 'scheduled' | 'completed';

const GameStreamScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { games, isLoading, getGames } = useGame();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [filteredGames, setFilteredGames] = useState<GameWithTeams[]>([]);

  useEffect(() => {
    // Fetch ALL games on mount, not just 'live'
    getGames();
  }, []);

  useEffect(() => {
    let result = games;

    // Apply status filter
    if (activeFilter !== 'all') {
      result = result.filter((game) => game.status === activeFilter);
    }

    // Apply search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (game) =>
          game.homeTeam.name.toLowerCase().includes(q) ||
          game.awayTeam.name.toLowerCase().includes(q) ||
          game.venue.toLowerCase().includes(q) ||
          game.league.toLowerCase().includes(q)
      );
    }

    setFilteredGames(result);
  }, [searchQuery, games, activeFilter]);

  const handleRefresh = () => {
    getGames(activeFilter !== 'all' ? { status: activeFilter } : undefined);
  };

  if (isLoading && games.length === 0) {
    return (
      <View className="flex-1 bg-background">
        <Loading fullScreen />
      </View>
    );
  }

  const filterTabs: { key: FilterTab; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'live', label: 'Live' },
    { key: 'scheduled', label: 'Upcoming' },
    { key: 'completed', label: 'Final' },
  ];

  return (
    <View className="flex-1 bg-background">
      {/* Filter Tabs */}
      <View className="flex-row px-4 pb-1 pt-2">
        {filterTabs.map((tab) => (
          <Button
            key={tab.key}
            variant={activeFilter === tab.key ? 'default' : 'outline'}
            size="sm"
            className="mr-2"
            onPress={() => setActiveFilter(tab.key)}
          >
            <Text>{tab.label}</Text>
          </Button>
        ))}
      </View>

      {/* Search */}
      <View className="px-4">
        <SearchBar placeholder="Search teams, venues..." onSearch={setSearchQuery} />
      </View>

      {/* Game List */}
      <FlatList
        data={filteredGames}
        renderItem={({ item }) => <GameCard game={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 100,
          ...(filteredGames.length === 0 ? { flexGrow: 1 } : {}),
        }}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center px-6 py-24">
            <Text className="mb-4 text-6xl">🏀</Text>
            <Text className="mb-2 text-xl font-extrabold text-foreground">No Games Found</Text>
            <Text className="mb-6 text-center text-sm text-muted-foreground leading-5">
              {games.length === 0
                ? 'Create your first game to get started tracking stats.'
                : `No ${activeFilter !== 'all' ? activeFilter : ''} games match your search.`}
            </Text>
            {games.length === 0 && (
              <Button variant="default" onPress={handleRefresh}>
                <Text>Refresh</Text>
              </Button>
            )}
          </View>
        }
      />
    </View>
  );
};

export default GameStreamScreen;
