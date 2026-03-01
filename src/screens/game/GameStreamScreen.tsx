import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../navigation/MainNavigator';
import { useGame } from '../../hooks/useGame';
import GameCard from '../../components/game/GameCard';
import SearchBar from '../../components/common/SearchBar';
import Loading from '../../components/common/Loading';
import { spacing } from '../../config/theme';
import { GameWithTeams } from '../../types/game';

const { width } = Dimensions.get('window');

// Court Vision Design System (matches ProfileScreen)
const courtColors = {
  deepNavy: '#0A1929',
  midNavy: '#0D2137',
  cardBg: '#111B27',
  courtOrange: '#FF6B35',
  courtOrangeLight: '#FF8A5B',
  white: '#FFFFFF',
  textMuted: '#6B7280',
  success: '#10B981',
  courtLine: 'rgba(255, 107, 53, 0.1)',
  cardBorder: 'rgba(255, 255, 255, 0.06)',
};

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
      <View style={styles.container}>
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
    <View style={styles.container}>
      {/* Background court lines */}
      <View style={styles.backgroundContainer}>
        <View style={[styles.courtLine, styles.courtLine1]} />
        <View style={[styles.courtLine, styles.courtLine2]} />
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        {filterTabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.filterTab,
              activeFilter === tab.key && styles.filterTabActive,
            ]}
            onPress={() => setActiveFilter(tab.key)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.filterTabText,
                activeFilter === tab.key && styles.filterTabTextActive,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <SearchBar placeholder="Search teams, venues..." onSearch={setSearchQuery} />
      </View>

      {/* Game List */}
      <FlatList
        data={filteredGames}
        renderItem={({ item }) => <GameCard game={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.list,
          filteredGames.length === 0 && styles.listEmpty,
        ]}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleRefresh}
            tintColor={courtColors.courtOrange}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🏀</Text>
            <Text style={styles.emptyTitle}>No Games Found</Text>
            <Text style={styles.emptySubtitle}>
              {games.length === 0
                ? 'Create your first game to get started tracking stats.'
                : `No ${activeFilter !== 'all' ? activeFilter : ''} games match your search.`}
            </Text>
            {games.length === 0 && (
              <TouchableOpacity
                style={styles.createButton}
                onPress={handleRefresh}
                activeOpacity={0.7}
              >
                <Text style={styles.createButtonText}>Refresh</Text>
              </TouchableOpacity>
            )}
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: courtColors.deepNavy,
  },
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  courtLine: {
    position: 'absolute',
    height: 1,
    backgroundColor: courtColors.courtLine,
    transform: [{ rotate: '-20deg' }],
    width: width * 2,
  },
  courtLine1: {
    top: '30%',
    left: -width * 0.5,
  },
  courtLine2: {
    top: '70%',
    left: -width * 0.3,
    opacity: 0.5,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: spacing.sm,
    backgroundColor: courtColors.cardBg,
    borderWidth: 1,
    borderColor: courtColors.cardBorder,
  },
  filterTabActive: {
    backgroundColor: courtColors.courtOrange,
    borderColor: courtColors.courtOrange,
  },
  filterTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: courtColors.textMuted,
  },
  filterTabTextActive: {
    color: courtColors.white,
  },
  searchContainer: {
    paddingHorizontal: spacing.md,
  },
  list: {
    padding: spacing.md,
    paddingBottom: 100,
  },
  listEmpty: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl * 3,
    paddingHorizontal: spacing.lg,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: courtColors.white,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    fontSize: 14,
    color: courtColors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  createButton: {
    backgroundColor: courtColors.courtOrange,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  createButtonText: {
    color: courtColors.white,
    fontSize: 15,
    fontWeight: '700',
  },
});

export default GameStreamScreen;
