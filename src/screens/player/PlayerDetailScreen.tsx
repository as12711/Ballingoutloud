import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  Dimensions,
  TouchableOpacity,
  Easing,
  Image,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { MainStackParamList } from '../../navigation/MainNavigator';
import { playersApi } from '../../api/players';
import { Player, PlayerSeasonStats } from '../../types/player';
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
  courtLine: 'rgba(255, 107, 53, 0.15)',
  cardBorder: 'rgba(255, 255, 255, 0.06)',
};

type PlayerDetailRouteProp = RouteProp<MainStackParamList, 'PlayerDetail'>;

interface PlayerWithStats extends Player {
  stats: PlayerSeasonStats;
}

interface StatCardProps {
  label: string;
  value: string;
  sublabel?: string;
  color?: string;
  delay: number;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, sublabel, color = courtColors.white, delay }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 6,
      tension: 40,
      useNativeDriver: true,
      delay,
    }).start();
  }, [delay]);

  return (
    <Animated.View
      style={[
        styles.statCard,
        { transform: [{ scale: scaleAnim }], opacity: scaleAnim },
      ]}
    >
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      {sublabel && <Text style={styles.statSublabel}>{sublabel}</Text>}
    </Animated.View>
  );
};

const PlayerDetailScreen: React.FC = () => {
  const route = useRoute<PlayerDetailRouteProp>();
  const { playerId } = route.params;

  const [player, setPlayer] = useState<PlayerWithStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Animations
  const headerAnim = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    fetchPlayer();
  }, [playerId]);

  useEffect(() => {
    if (player) {
      Animated.parallel([
        Animated.timing(headerAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
        Animated.timing(contentAnim, {
          toValue: 0,
          duration: 600,
          delay: 200,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
      ]).start();
    }
  }, [player]);

  const fetchPlayer = async () => {
    try {
      const data = await playersApi.getPlayer(playerId);
      // Add mock stats
      const playerWithStats: PlayerWithStats = {
        ...data,
        stats: {
          playerId: data.id,
          gamesPlayed: Math.floor(Math.random() * 20) + 10,
          avgPoints: Math.random() * 20 + 8,
          avgRebounds: Math.random() * 8 + 3,
          avgAssists: Math.random() * 6 + 2,
          avgSteals: Math.random() * 2 + 0.5,
          avgBlocks: Math.random() * 1.5 + 0.2,
          fgPercentage: Math.random() * 25 + 40,
          threePointPercentage: Math.random() * 20 + 28,
          ftPercentage: Math.random() * 20 + 65,
        },
      };
      setPlayer(playerWithStats);
    } catch (error) {
      console.error('Error fetching player:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPositionColor = (position: string) => {
    switch (position?.toUpperCase()) {
      case 'PG': return '#FF6B35';
      case 'SG': return '#10B981';
      case 'SF': return '#F59E0B';
      case 'PF': return '#8B5CF6';
      case 'C': return '#3B82F6';
      default: return courtColors.textMuted;
    }
  };

  const getPositionFull = (position: string) => {
    switch (position?.toUpperCase()) {
      case 'PG': return 'Point Guard';
      case 'SG': return 'Shooting Guard';
      case 'SF': return 'Small Forward';
      case 'PF': return 'Power Forward';
      case 'C': return 'Center';
      default: return position;
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Loading fullScreen />
      </View>
    );
  }

  if (!player) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Player not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Background Elements */}
      <View style={styles.backgroundContainer}>
        <View style={[styles.courtLine, styles.courtLine1]} />
        <View style={[styles.courtLine, styles.courtLine2]} />
        <Animated.View
          style={[
            styles.heroGradient,
            {
              opacity: headerAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.8],
              }),
            },
          ]}
        />
      </View>

      {/* Hero Section */}
      <Animated.View
        style={[
          styles.heroSection,
          {
            opacity: headerAnim,
            transform: [
              {
                translateY: headerAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-30, 0],
                }),
              },
            ],
          },
        ]}
      >
        {/* Jersey Number */}
        <View style={styles.jerseyBadge}>
          <Text style={styles.jerseyNumber}>#{player.jerseyNumber}</Text>
        </View>

        {/* Player Photo */}
        <View style={styles.photoContainer}>
          {player.photoUrl ? (
            <Image source={{ uri: player.photoUrl }} style={styles.playerPhoto} />
          ) : (
            <View style={styles.playerPhotoPlaceholder}>
              <Text style={styles.playerInitials}>
                {player.firstName[0]}{player.lastName[0]}
              </Text>
            </View>
          )}
          <View style={[styles.positionRing, { borderColor: getPositionColor(player.position) }]} />
        </View>

        {/* Player Name */}
        <Text style={styles.playerFirstName}>{player.firstName}</Text>
        <Text style={styles.playerLastName}>{player.lastName.toUpperCase()}</Text>

        {/* Position & Info */}
        <View style={styles.infoRow}>
          <View style={[styles.positionBadge, { backgroundColor: `${getPositionColor(player.position)}25` }]}>
            <Text style={[styles.positionText, { color: getPositionColor(player.position) }]}>
              {getPositionFull(player.position)}
            </Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Text style={styles.metaValue}>{player.height || 'N/A'}</Text>
            <Text style={styles.metaLabel}>HEIGHT</Text>
          </View>
          <View style={styles.metaDivider} />
          <View style={styles.metaItem}>
            <Text style={styles.metaValue}>Grade {player.grade}</Text>
            <Text style={styles.metaLabel}>CLASS</Text>
          </View>
          <View style={styles.metaDivider} />
          <View style={styles.metaItem}>
            <Text style={styles.metaValue}>{player.stats.gamesPlayed}</Text>
            <Text style={styles.metaLabel}>GAMES</Text>
          </View>
        </View>
      </Animated.View>

      {/* Stats Section */}
      <Animated.View
        style={[
          styles.statsSection,
          {
            opacity: headerAnim,
            transform: [{ translateY: contentAnim }],
          },
        ]}
      >
        {/* Primary Stats */}
        <Text style={styles.sectionTitle}>SEASON AVERAGES</Text>
        <View style={styles.primaryStatsRow}>
          <StatCard
            label="POINTS"
            value={player.stats.avgPoints.toFixed(1)}
            sublabel="PPG"
            color={courtColors.courtOrange}
            delay={0}
          />
          <StatCard
            label="REBOUNDS"
            value={player.stats.avgRebounds.toFixed(1)}
            sublabel="RPG"
            color={courtColors.success}
            delay={100}
          />
          <StatCard
            label="ASSISTS"
            value={player.stats.avgAssists.toFixed(1)}
            sublabel="APG"
            color="#3B82F6"
            delay={200}
          />
        </View>

        {/* Secondary Stats */}
        <View style={styles.secondaryStatsRow}>
          <StatCard
            label="STEALS"
            value={player.stats.avgSteals.toFixed(1)}
            delay={300}
          />
          <StatCard
            label="BLOCKS"
            value={player.stats.avgBlocks.toFixed(1)}
            delay={400}
          />
        </View>

        {/* Shooting Stats */}
        <Text style={styles.sectionTitle}>SHOOTING SPLITS</Text>
        <View style={styles.shootingContainer}>
          <View style={styles.shootingCard}>
            <View style={styles.shootingHeader}>
              <Text style={styles.shootingLabel}>FG%</Text>
              <Text style={styles.shootingValue}>{player.stats.fgPercentage.toFixed(1)}%</Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${player.stats.fgPercentage}%`, backgroundColor: courtColors.courtOrange },
                ]}
              />
            </View>
          </View>

          <View style={styles.shootingCard}>
            <View style={styles.shootingHeader}>
              <Text style={styles.shootingLabel}>3PT%</Text>
              <Text style={styles.shootingValue}>{player.stats.threePointPercentage.toFixed(1)}%</Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${player.stats.threePointPercentage}%`, backgroundColor: courtColors.success },
                ]}
              />
            </View>
          </View>

          <View style={styles.shootingCard}>
            <View style={styles.shootingHeader}>
              <Text style={styles.shootingLabel}>FT%</Text>
              <Text style={styles.shootingValue}>{player.stats.ftPercentage.toFixed(1)}%</Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${player.stats.ftPercentage}%`, backgroundColor: '#3B82F6' },
                ]}
              />
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.primaryButton} activeOpacity={0.85}>
            <Text style={styles.primaryButtonText}>VIEW GAME LOGS</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.85}>
            <Text style={styles.secondaryButtonText}>EDIT PROFILE</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </ScrollView>
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
  errorContainer: {
    flex: 1,
    backgroundColor: courtColors.deepNavy,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: courtColors.textMuted,
    fontSize: 16,
  },
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  courtLine: {
    position: 'absolute',
    height: 2,
    backgroundColor: courtColors.courtLine,
    transform: [{ rotate: '-25deg' }],
    width: width * 2,
  },
  courtLine1: {
    top: 150,
    left: -width * 0.5,
  },
  courtLine2: {
    top: 350,
    left: -width * 0.3,
    opacity: 0.5,
  },
  heroGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 350,
    backgroundColor: courtColors.courtOrange,
    opacity: 0.08,
  },
  heroSection: {
    alignItems: 'center',
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  jerseyBadge: {
    backgroundColor: courtColors.courtOrange,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: spacing.md,
  },
  jerseyNumber: {
    fontSize: 24,
    fontWeight: '900',
    color: courtColors.white,
    letterSpacing: 2,
  },
  photoContainer: {
    position: 'relative',
    marginBottom: spacing.lg,
  },
  playerPhoto: {
    width: 140,
    height: 140,
    borderRadius: 35,
  },
  playerPhotoPlaceholder: {
    width: 140,
    height: 140,
    borderRadius: 35,
    backgroundColor: courtColors.cardBg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: courtColors.cardBorder,
  },
  playerInitials: {
    fontSize: 48,
    fontWeight: '800',
    color: courtColors.textMuted,
  },
  positionRing: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: 39,
    borderWidth: 3,
  },
  playerFirstName: {
    fontSize: 20,
    fontWeight: '400',
    color: courtColors.textMuted,
    letterSpacing: 2,
  },
  playerLastName: {
    fontSize: 36,
    fontWeight: '900',
    color: courtColors.white,
    letterSpacing: 4,
    marginBottom: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  positionBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  positionText: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: courtColors.cardBg,
    borderRadius: 16,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: courtColors.cardBorder,
  },
  metaItem: {
    flex: 1,
    alignItems: 'center',
  },
  metaValue: {
    fontSize: 16,
    fontWeight: '700',
    color: courtColors.white,
  },
  metaLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: courtColors.textMuted,
    letterSpacing: 1,
    marginTop: 2,
  },
  metaDivider: {
    width: 1,
    height: 30,
    backgroundColor: courtColors.cardBorder,
    marginHorizontal: spacing.sm,
  },
  statsSection: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl * 2,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: courtColors.courtOrange,
    letterSpacing: 3,
    marginBottom: spacing.md,
    marginTop: spacing.lg,
  },
  primaryStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  secondaryStatsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: courtColors.cardBg,
    borderRadius: 16,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: courtColors.cardBorder,
    maxWidth: '48%',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: courtColors.textMuted,
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '900',
  },
  statSublabel: {
    fontSize: 11,
    fontWeight: '600',
    color: courtColors.textMuted,
    marginTop: 2,
  },
  shootingContainer: {
    gap: spacing.sm,
  },
  shootingCard: {
    backgroundColor: courtColors.cardBg,
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: courtColors.cardBorder,
  },
  shootingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  shootingLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: courtColors.textMuted,
    letterSpacing: 1,
  },
  shootingValue: {
    fontSize: 18,
    fontWeight: '800',
    color: courtColors.white,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  actionsContainer: {
    marginTop: spacing.xl,
    gap: spacing.sm,
  },
  primaryButton: {
    backgroundColor: courtColors.courtOrange,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: courtColors.courtOrange,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  primaryButtonText: {
    color: courtColors.white,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 2,
  },
  secondaryButton: {
    backgroundColor: courtColors.cardBg,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: courtColors.cardBorder,
  },
  secondaryButtonText: {
    color: courtColors.textMuted,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 2,
  },
});

export default PlayerDetailScreen;
