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
  Platform,
  Easing,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../navigation/MainNavigator';
import { teamsApi } from '../../api/teams';
import { Team, TeamWithStats } from '../../types/team';
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
  courtLine: 'rgba(255, 107, 53, 0.1)',
  cardBorder: 'rgba(255, 255, 255, 0.06)',
};

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

interface TeamCardProps {
  team: TeamWithStats;
  index: number;
  onPress: () => void;
}

const TeamCard: React.FC<TeamCardProps> = ({ team, index, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
        delay: index * 80,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        delay: index * 80,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start();
  }, [index]);

  const winRate = team.wins + team.losses > 0
    ? ((team.wins / (team.wins + team.losses)) * 100).toFixed(0)
    : '0';

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
        style={styles.teamCard}
        onPress={onPress}
        activeOpacity={0.85}
      >
        {/* Team Logo / Avatar */}
        <View style={styles.logoSection}>
          {team.logoUrl ? (
            <Image source={{ uri: team.logoUrl }} style={styles.teamLogo} />
          ) : (
            <View style={styles.teamLogoPlaceholder}>
              <Text style={styles.teamInitials}>
                {team.name.substring(0, 2).toUpperCase()}
              </Text>
            </View>
          )}
          {/* Win rate badge */}
          <View style={[
            styles.winRateBadge,
            { backgroundColor: Number(winRate) >= 50 ? courtColors.success : courtColors.courtOrange }
          ]}>
            <Text style={styles.winRateText}>{winRate}%</Text>
          </View>
        </View>

        {/* Team Info */}
        <View style={styles.teamInfo}>
          <Text style={styles.teamName}>{team.name}</Text>
          <Text style={styles.schoolName}>{team.school}</Text>
          <View style={styles.leagueBadge}>
            <Text style={styles.leagueText}>{team.league}</Text>
          </View>
        </View>

        {/* Stats Column */}
        <View style={styles.statsColumn}>
          <View style={styles.recordContainer}>
            <Text style={styles.recordWins}>{team.wins}</Text>
            <Text style={styles.recordDivider}>-</Text>
            <Text style={styles.recordLosses}>{team.losses}</Text>
          </View>
          <Text style={styles.recordLabel}>RECORD</Text>

          <View style={styles.secondaryStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{team.avgPoints.toFixed(1)}</Text>
              <Text style={styles.statLabel}>PPG</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{team.playerCount}</Text>
              <Text style={styles.statLabel}>ROSTER</Text>
            </View>
          </View>
        </View>

        {/* Arrow indicator */}
        <View style={styles.arrowContainer}>
          <Text style={styles.arrowText}>›</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const TeamListScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [teams, setTeams] = useState<TeamWithStats[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<TeamWithStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Header animation
  const headerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchTeams();
    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
      easing: Easing.out(Easing.cubic),
    }).start();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = teams.filter(
        (team) =>
          team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          team.school.toLowerCase().includes(searchQuery.toLowerCase()) ||
          team.league.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredTeams(filtered);
    } else {
      setFilteredTeams(teams);
    }
  }, [searchQuery, teams]);

  const fetchTeams = async () => {
    try {
      const data = await teamsApi.getTeams();
      // Transform to TeamWithStats (mocking stats for now)
      const teamsWithStats: TeamWithStats[] = data.map((team: Team) => ({
        ...team,
        wins: Math.floor(Math.random() * 15) + 5,
        losses: Math.floor(Math.random() * 10) + 2,
        avgPoints: Math.floor(Math.random() * 30) + 50,
        playerCount: Math.floor(Math.random() * 8) + 8,
      }));
      setTeams(teamsWithStats);
      setFilteredTeams(teamsWithStats);
    } catch (error) {
      console.error('Error fetching teams:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchTeams();
  };

  const renderTeam = ({ item, index }: { item: TeamWithStats; index: number }) => (
    <TeamCard
      team={item}
      index={index}
      onPress={() => navigation.navigate('TeamDetail', { teamId: item.id })}
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
          <Text style={styles.headerTitle}>TEAMS</Text>
          <Text style={styles.headerSubtitle}>{filteredTeams.length} teams</Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('CreateTeam')}
          activeOpacity={0.85}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <SearchBar
        placeholder="Search teams, schools, leagues..."
        onSearch={setSearchQuery}
      />

      {/* Quick Stats Bar */}
      <View style={styles.quickStats}>
        <View style={styles.quickStatItem}>
          <Text style={styles.quickStatValue}>{teams.length}</Text>
          <Text style={styles.quickStatLabel}>Total</Text>
        </View>
        <View style={styles.quickStatDivider} />
        <View style={styles.quickStatItem}>
          <Text style={styles.quickStatValue}>
            {teams.filter(t => t.wins > t.losses).length}
          </Text>
          <Text style={styles.quickStatLabel}>Winning</Text>
        </View>
        <View style={styles.quickStatDivider} />
        <View style={styles.quickStatItem}>
          <Text style={styles.quickStatValue}>
            {teams.reduce((acc, t) => acc + t.playerCount, 0)}
          </Text>
          <Text style={styles.quickStatLabel}>Players</Text>
        </View>
      </View>
    </Animated.View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Text style={styles.emptyIcon}>🏀</Text>
      </View>
      <Text style={styles.emptyTitle}>No Teams Yet</Text>
      <Text style={styles.emptyText}>
        Create your first team to start tracking stats
      </Text>
      <TouchableOpacity
        style={styles.emptyButton}
        onPress={() => navigation.navigate('CreateTeam')}
        activeOpacity={0.85}
      >
        <Text style={styles.emptyButtonText}>CREATE TEAM</Text>
      </TouchableOpacity>
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
      {/* Background court lines */}
      <View style={styles.backgroundLines}>
        <View style={[styles.courtLine, styles.courtLine1]} />
        <View style={[styles.courtLine, styles.courtLine2]} />
      </View>

      <FlatList
        data={filteredTeams}
        renderItem={renderTeam}
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
    top: '30%',
    left: -width * 0.5,
  },
  courtLine2: {
    top: '70%',
    left: -width * 0.3,
    opacity: 0.5,
  },
  listContent: {
    paddingBottom: spacing.xxl,
  },
  headerContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
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
  quickStats: {
    flexDirection: 'row',
    backgroundColor: courtColors.cardBg,
    borderRadius: 12,
    padding: spacing.md,
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: courtColors.cardBorder,
  },
  quickStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  quickStatValue: {
    fontSize: 24,
    fontWeight: '800',
    color: courtColors.white,
  },
  quickStatLabel: {
    fontSize: 11,
    color: courtColors.textMuted,
    fontWeight: '600',
    letterSpacing: 1,
    marginTop: 2,
  },
  quickStatDivider: {
    width: 1,
    backgroundColor: courtColors.cardBorder,
    marginHorizontal: spacing.sm,
  },
  cardContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  teamCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: courtColors.cardBg,
    borderRadius: 16,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: courtColors.cardBorder,
  },
  logoSection: {
    position: 'relative',
    marginRight: spacing.md,
  },
  teamLogo: {
    width: 60,
    height: 60,
    borderRadius: 16,
  },
  teamLogoPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 107, 53, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: courtColors.courtOrange,
  },
  teamInitials: {
    fontSize: 20,
    fontWeight: '800',
    color: courtColors.courtOrange,
    letterSpacing: 1,
  },
  winRateBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: courtColors.cardBg,
  },
  winRateText: {
    fontSize: 10,
    fontWeight: '800',
    color: courtColors.white,
  },
  teamInfo: {
    flex: 1,
  },
  teamName: {
    fontSize: 17,
    fontWeight: '700',
    color: courtColors.white,
    marginBottom: 2,
  },
  schoolName: {
    fontSize: 13,
    color: courtColors.textMuted,
    marginBottom: spacing.xs,
  },
  leagueBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  leagueText: {
    fontSize: 10,
    fontWeight: '600',
    color: courtColors.textMuted,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  statsColumn: {
    alignItems: 'center',
    paddingLeft: spacing.sm,
    borderLeftWidth: 1,
    borderLeftColor: courtColors.cardBorder,
    marginLeft: spacing.sm,
  },
  recordContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  recordWins: {
    fontSize: 20,
    fontWeight: '800',
    color: courtColors.success,
  },
  recordDivider: {
    fontSize: 16,
    fontWeight: '400',
    color: courtColors.textMuted,
    marginHorizontal: 2,
  },
  recordLosses: {
    fontSize: 20,
    fontWeight: '800',
    color: courtColors.courtOrange,
  },
  recordLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: courtColors.textMuted,
    letterSpacing: 1,
    marginTop: 2,
    marginBottom: spacing.xs,
  },
  secondaryStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  statValue: {
    fontSize: 12,
    fontWeight: '700',
    color: courtColors.white,
  },
  statLabel: {
    fontSize: 8,
    fontWeight: '600',
    color: courtColors.textMuted,
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: 20,
    backgroundColor: courtColors.cardBorder,
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

export default TeamListScreen;
