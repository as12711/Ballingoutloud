import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Animated,
  Dimensions,
  Easing,
  Image,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../navigation/MainNavigator';
import { playersApi } from '../../api/players';
import { Player, PlayerSeasonStats } from '../../types/player';
import SearchBar from '../../components/common/SearchBar';
import Loading from '../../components/common/Loading';
import { spacing } from '../../config/theme';

const { width } = Dimensions.get('window');

// Court Vision Design System
const courtColors = {
  deepNavy: '#0A1929',
  midNavy: '#0D2137',
  cardBg: '#111B27',
  courtOrange: '#FF6B35',
  courtOrangeLight: '#FF8A5B',
  white: '#FFFFFF',
  textMuted: '#6B7280',
  success: '#10B981',
  warning: '#F59E0B',
  courtLine: 'rgba(255, 107, 53, 0.1)',
  cardBorder: 'rgba(255, 255, 255, 0.06)',
};

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;
type PlayerListRouteProp = RouteProp<MainStackParamList, 'PlayerList'>;

interface PlayerWithStats extends Player {
  stats: PlayerSeasonStats;
}

interface PlayerCardProps {
  player: PlayerWithStats;
  index: number;
  onPress: () => void;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player, index, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
        delay: index * 60,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        delay: index * 60,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start();
  }, [index]);

  const getPositionColor = (position: string) => {
    switch (position.toUpperCase()) {
      case 'PG': return '#FF6B35';
      case 'SG': return '#10B981';
      case 'SF': return '#F59E0B';
      case 'PF': return '#8B5CF6';
      case 'C': return '#3B82F6';
      default: return courtColors.textMuted;
    }
  };

  return (
    <Animated.View
      style={[
        styles.cardContainer,
        {
          opacity: scaleAnim,
          transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.playerCard}
        onPress={onPress}
        activeOpacity={0.85}
      >
        {/* Jersey Number Badge */}
        <View style={styles.jerseyContainer}>
          <View style={styles.jerseyBadge}>
            <Text style={styles.jerseyNumber}>#{player.jerseyNumber}</Text>
          </View>
          {/* Player Photo */}
          {player.photoUrl ? (
            <Image source={{ uri: player.photoUrl }} style={styles.playerPhoto} />
          ) : (
            <View style={styles.playerPhotoPlaceholder}>
              <Text style={styles.playerInitials}>
                {player.firstName[0]}{player.lastName[0]}
              </Text>
            </View>
          )}
        </View>

        {/* Player Info */}
        <View style={styles.playerInfo}>
          <Text style={styles.playerName}>
            {player.firstName} <Text style={styles.playerLastName}>{player.lastName}</Text>
          </Text>
          <View style={styles.playerMeta}>
            <View style={[styles.positionBadge, { backgroundColor: `${getPositionColor(player.position)}20` }]}>
              <Text style={[styles.positionText, { color: getPositionColor(player.position) }]}>
                {player.position}
              </Text>
            </View>
            <Text style={styles.gradeText}>Grade {player.grade}</Text>
            {player.height && <Text style={styles.heightText}>{player.height}</Text>}
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.mainStat}>
            <Text style={styles.mainStatValue}>{player.stats.avgPoints.toFixed(1)}</Text>
            <Text style={styles.mainStatLabel}>PPG</Text>
          </View>
          <View style={styles.secondaryStatsRow}>
            <View style={styles.secondaryStat}>
              <Text style={styles.secondaryStatValue}>{player.stats.avgRebounds.toFixed(1)}</Text>
              <Text style={styles.secondaryStatLabel}>REB</Text>
            </View>
            <View style={styles.secondaryStat}>
              <Text style={styles.secondaryStatValue}>{player.stats.avgAssists.toFixed(1)}</Text>
              <Text style={styles.secondaryStatLabel}>AST</Text>
            </View>
          </View>
        </View>

        {/* Arrow */}
        <View style={styles.arrowContainer}>
          <Text style={styles.arrowText}>›</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const PlayerListScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<PlayerListRouteProp>();
  const teamId = route.params?.teamId;

  const [players, setPlayers] = useState<PlayerWithStats[]>([]);
  const [filteredPlayers, setFilteredPlayers] = useState<PlayerWithStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);

  const headerAnim = useRef(new Animated.Value(0)).current;

  const positions = ['PG', 'SG', 'SF', 'PF', 'C'];

  useEffect(() => {
    fetchPlayers();
    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
      easing: Easing.out(Easing.cubic),
    }).start();
  }, [teamId]);

  useEffect(() => {
    let filtered = players;

    if (searchQuery) {
      filtered = filtered.filter(
        (player) =>
          player.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          player.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          String(player.jerseyNumber).includes(searchQuery)
      );
    }

    if (selectedPosition) {
      filtered = filtered.filter(
        (player) => player.position.toUpperCase() === selectedPosition
      );
    }

    setFilteredPlayers(filtered);
  }, [searchQuery, selectedPosition, players]);

  const fetchPlayers = async () => {
    try {
      const data = await playersApi.getPlayers(teamId);
      // Add mock stats
      const playersWithStats: PlayerWithStats[] = data.map((player: Player) => ({
        ...player,
        stats: {
          playerId: player.id,
          gamesPlayed: Math.floor(Math.random() * 20) + 5,
          avgPoints: Math.random() * 20 + 5,
          avgRebounds: Math.random() * 8 + 2,
          avgAssists: Math.random() * 6 + 1,
          avgSteals: Math.random() * 2,
          avgBlocks: Math.random() * 1.5,
          fgPercentage: Math.random() * 30 + 35,
          threePointPercentage: Math.random() * 25 + 20,
          ftPercentage: Math.random() * 25 + 60,
        },
      }));
      setPlayers(playersWithStats);
      setFilteredPlayers(playersWithStats);
    } catch (error) {
      console.error('Error fetching players:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchPlayers();
  };

  const getPositionColor = (position: string, isSelected: boolean) => {
    if (!isSelected) return courtColors.cardBg;
    switch (position) {
      case 'PG': return '#FF6B35';
      case 'SG': return '#10B981';
      case 'SF': return '#F59E0B';
      case 'PF': return '#8B5CF6';
      case 'C': return '#3B82F6';
      default: return courtColors.textMuted;
    }
  };

  const renderPlayer = ({ item, index }: { item: PlayerWithStats; index: number }) => (
    <PlayerCard
      player={item}
      index={index}
      onPress={() => navigation.navigate('PlayerDetail', { playerId: item.id })}
    />
  );

  const renderHeader = () => (
    <Animated.View
      style={[
        styles.headerContainer,
        {
          opacity: headerAnim,
          transform: [
            {
              translateY: headerAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-20, 0],
              }),
            },
          ],
        },
      ]}
    >
      <View style={styles.headerTop}>
        <View>
          <Text style={styles.headerTitle}>PLAYERS</Text>
          <Text style={styles.headerSubtitle}>{filteredPlayers.length} players</Text>
        </View>
        {teamId && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('CreatePlayer', { teamId })}
            activeOpacity={0.85}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        )}
      </View>

      <SearchBar
        placeholder="Search by name or jersey #..."
        onSearch={setSearchQuery}
      />

      {/* Position Filter */}
      <View style={styles.positionFilter}>
        <TouchableOpacity
          style={[
            styles.positionChip,
            !selectedPosition && styles.positionChipActive,
          ]}
          onPress={() => setSelectedPosition(null)}
        >
          <Text style={[
            styles.positionChipText,
            !selectedPosition && styles.positionChipTextActive,
          ]}>
            ALL
          </Text>
        </TouchableOpacity>
        {positions.map((pos) => (
          <TouchableOpacity
            key={pos}
            style={[
              styles.positionChip,
              selectedPosition === pos && {
                backgroundColor: getPositionColor(pos, true),
                borderColor: getPositionColor(pos, true),
              },
            ]}
            onPress={() => setSelectedPosition(selectedPosition === pos ? null : pos)}
          >
            <Text style={[
              styles.positionChipText,
              selectedPosition === pos && styles.positionChipTextActive,
            ]}>
              {pos}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Stats Leaders */}
      {players.length > 0 && (
        <View style={styles.leadersContainer}>
          <Text style={styles.leadersTitle}>TOP PERFORMERS</Text>
          <View style={styles.leadersRow}>
            <View style={styles.leaderCard}>
              <Text style={styles.leaderLabel}>SCORING</Text>
              <Text style={styles.leaderName}>
                {[...players].sort((a, b) => b.stats.avgPoints - a.stats.avgPoints)[0]?.firstName}
              </Text>
              <Text style={styles.leaderValue}>
                {[...players].sort((a, b) => b.stats.avgPoints - a.stats.avgPoints)[0]?.stats.avgPoints.toFixed(1)} PPG
              </Text>
            </View>
            <View style={styles.leaderCard}>
              <Text style={styles.leaderLabel}>REBOUNDS</Text>
              <Text style={styles.leaderName}>
                {[...players].sort((a, b) => b.stats.avgRebounds - a.stats.avgRebounds)[0]?.firstName}
              </Text>
              <Text style={styles.leaderValue}>
                {[...players].sort((a, b) => b.stats.avgRebounds - a.stats.avgRebounds)[0]?.stats.avgRebounds.toFixed(1)} RPG
              </Text>
            </View>
            <View style={styles.leaderCard}>
              <Text style={styles.leaderLabel}>ASSISTS</Text>
              <Text style={styles.leaderName}>
                {[...players].sort((a, b) => b.stats.avgAssists - a.stats.avgAssists)[0]?.firstName}
              </Text>
              <Text style={styles.leaderValue}>
                {[...players].sort((a, b) => b.stats.avgAssists - a.stats.avgAssists)[0]?.stats.avgAssists.toFixed(1)} APG
              </Text>
            </View>
          </View>
        </View>
      )}
    </Animated.View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Text style={styles.emptyIcon}>👤</Text>
      </View>
      <Text style={styles.emptyTitle}>No Players Found</Text>
      <Text style={styles.emptyText}>
        {searchQuery || selectedPosition
          ? 'Try adjusting your filters'
          : 'Add players to your team roster'}
      </Text>
      {teamId && !searchQuery && !selectedPosition && (
        <TouchableOpacity
          style={styles.emptyButton}
          onPress={() => navigation.navigate('CreatePlayer', { teamId })}
          activeOpacity={0.85}
        >
          <Text style={styles.emptyButtonText}>ADD PLAYER</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Loading fullScreen />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Background */}
      <View style={styles.backgroundLines}>
        <View style={[styles.courtLine, styles.courtLine1]} />
        <View style={[styles.courtLine, styles.courtLine2]} />
      </View>

      <FlatList
        data={filteredPlayers}
        renderItem={renderPlayer}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={!isLoading ? renderEmptyState : null}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={courtColors.courtOrange}
            colors={[courtColors.courtOrange]}
          />
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
  loadingContainer: {
    flex: 1,
    backgroundColor: courtColors.deepNavy,
  },
  backgroundLines: {
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
    top: '25%',
    left: -width * 0.5,
  },
  courtLine2: {
    top: '65%',
    left: -width * 0.3,
    opacity: 0.5,
  },
  listContent: {
    paddingBottom: spacing.xxl,
  },
  headerContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: courtColors.white,
    letterSpacing: 3,
  },
  headerSubtitle: {
    fontSize: 14,
    color: courtColors.textMuted,
    marginTop: 2,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: courtColors.courtOrange,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: courtColors.courtOrange,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonText: {
    color: courtColors.white,
    fontSize: 28,
    fontWeight: '300',
    marginTop: -2,
  },
  positionFilter: {
    flexDirection: 'row',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.xs,
  },
  positionChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: courtColors.cardBg,
    borderWidth: 1,
    borderColor: courtColors.cardBorder,
  },
  positionChipActive: {
    backgroundColor: courtColors.courtOrange,
    borderColor: courtColors.courtOrange,
  },
  positionChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: courtColors.textMuted,
    letterSpacing: 1,
  },
  positionChipTextActive: {
    color: courtColors.white,
  },
  leadersContainer: {
    backgroundColor: courtColors.cardBg,
    borderRadius: 16,
    padding: spacing.md,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: courtColors.cardBorder,
  },
  leadersTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: courtColors.courtOrange,
    letterSpacing: 2,
    marginBottom: spacing.sm,
  },
  leadersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leaderCard: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
  },
  leaderLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: courtColors.textMuted,
    letterSpacing: 1,
    marginBottom: 4,
  },
  leaderName: {
    fontSize: 14,
    fontWeight: '700',
    color: courtColors.white,
  },
  leaderValue: {
    fontSize: 11,
    fontWeight: '600',
    color: courtColors.success,
    marginTop: 2,
  },
  cardContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: courtColors.cardBg,
    borderRadius: 16,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: courtColors.cardBorder,
  },
  jerseyContainer: {
    position: 'relative',
    marginRight: spacing.md,
  },
  jerseyBadge: {
    position: 'absolute',
    top: -6,
    left: -6,
    backgroundColor: courtColors.courtOrange,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    zIndex: 1,
    borderWidth: 2,
    borderColor: courtColors.cardBg,
  },
  jerseyNumber: {
    fontSize: 10,
    fontWeight: '800',
    color: courtColors.white,
  },
  playerPhoto: {
    width: 56,
    height: 56,
    borderRadius: 14,
  },
  playerPhotoPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: courtColors.cardBorder,
  },
  playerInitials: {
    fontSize: 18,
    fontWeight: '700',
    color: courtColors.textMuted,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 16,
    fontWeight: '500',
    color: courtColors.white,
  },
  playerLastName: {
    fontWeight: '700',
  },
  playerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    gap: spacing.sm,
  },
  positionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  positionText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  gradeText: {
    fontSize: 12,
    color: courtColors.textMuted,
    fontWeight: '500',
  },
  heightText: {
    fontSize: 12,
    color: courtColors.textMuted,
    fontWeight: '500',
  },
  statsContainer: {
    alignItems: 'center',
    paddingLeft: spacing.md,
    borderLeftWidth: 1,
    borderLeftColor: courtColors.cardBorder,
    marginLeft: spacing.sm,
  },
  mainStat: {
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  mainStatValue: {
    fontSize: 22,
    fontWeight: '800',
    color: courtColors.courtOrange,
  },
  mainStatLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: courtColors.textMuted,
    letterSpacing: 1,
  },
  secondaryStatsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  secondaryStat: {
    alignItems: 'center',
  },
  secondaryStatValue: {
    fontSize: 12,
    fontWeight: '700',
    color: courtColors.white,
  },
  secondaryStatLabel: {
    fontSize: 8,
    fontWeight: '600',
    color: courtColors.textMuted,
    letterSpacing: 0.5,
  },
  arrowContainer: {
    paddingLeft: spacing.sm,
  },
  arrowText: {
    fontSize: 24,
    color: courtColors.textMuted,
    fontWeight: '300',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl * 2,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: courtColors.white,
    marginBottom: spacing.sm,
  },
  emptyText: {
    fontSize: 15,
    color: courtColors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  emptyButton: {
    backgroundColor: courtColors.courtOrange,
    paddingVertical: 14,
    paddingHorizontal: spacing.xl,
    borderRadius: 12,
    shadowColor: courtColors.courtOrange,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyButtonText: {
    color: courtColors.white,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 2,
  },
});

export default PlayerListScreen;
