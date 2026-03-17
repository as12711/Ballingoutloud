import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  Image,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { MainStackParamList } from '../../navigation/MainNavigator';
import { playersApi } from '../../api/players';
import { Player, PlayerSeasonStats } from '../../types/player';
import Loading from '../../components/common/Loading';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

type PlayerDetailRouteProp = RouteProp<MainStackParamList, 'PlayerDetail'>;

interface PlayerWithStats extends Player {
  stats: PlayerSeasonStats;
}

interface StatCardProps {
  label: string;
  value: string;
  sublabel?: string;
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, sublabel, color }) => {
  return (
    <Card className="flex-1 items-center p-4">
      <Text className="text-[10px] font-semibold text-muted-foreground tracking-widest mb-1">{label}</Text>
      <Text className="text-3xl font-black" style={color ? { color } : undefined}>{value}</Text>
      {sublabel && <Text className="text-[11px] font-semibold text-muted-foreground mt-0.5">{sublabel}</Text>}
    </Card>
  );
};

const PlayerDetailScreen: React.FC = () => {
  const route = useRoute<PlayerDetailRouteProp>();
  const { playerId } = route.params;

  const [player, setPlayer] = useState<PlayerWithStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPlayer();
  }, [playerId]);

  const fetchPlayer = async () => {
    try {
      const data = await playersApi.getPlayer(playerId);
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
      default: return '#6B7280';
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
      <View className="flex-1 bg-background">
        <Loading fullScreen />
      </View>
    );
  }

  if (!player) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <Text className="text-muted-foreground">Player not found</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background" showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      <View className="items-center pt-8 px-4 pb-8">
        {/* Jersey Number */}
        <Badge variant="default" className="mb-4 px-4 py-2 rounded-xl">
          <Text className="text-2xl font-black text-primary-foreground tracking-widest">#{player.jerseyNumber}</Text>
        </Badge>

        {/* Player Photo */}
        <View className="relative mb-6">
          {player.photoUrl ? (
            <Image source={{ uri: player.photoUrl }} className="w-[140px] h-[140px] rounded-[35px]" />
          ) : (
            <View className="w-[140px] h-[140px] rounded-[35px] bg-card items-center justify-center border-[3px] border-border">
              <Text className="text-5xl font-extrabold text-muted-foreground">
                {player.firstName[0]}{player.lastName[0]}
              </Text>
            </View>
          )}
          <View
            className="absolute -top-1 -left-1 -right-1 -bottom-1 rounded-[39px] border-[3px]"
            style={{ borderColor: getPositionColor(player.position) }}
          />
        </View>

        {/* Player Name */}
        <Text className="text-xl text-muted-foreground tracking-widest">{player.firstName}</Text>
        <Text className="text-4xl font-black tracking-[4px] mb-4">{player.lastName.toUpperCase()}</Text>

        {/* Position */}
        <Badge
          variant="outline"
          className="mb-4 px-4 py-2 rounded-full"
          style={{ backgroundColor: `${getPositionColor(player.position)}25`, borderColor: getPositionColor(player.position) }}
        >
          <Text className="text-sm font-bold tracking-wider" style={{ color: getPositionColor(player.position) }}>
            {getPositionFull(player.position)}
          </Text>
        </Badge>

        {/* Meta Row */}
        <Card className="flex-row w-full p-4">
          <View className="flex-1 items-center">
            <Text className="font-bold">{player.height || 'N/A'}</Text>
            <Text className="text-[10px] font-semibold text-muted-foreground tracking-widest mt-0.5">HEIGHT</Text>
          </View>
          <Separator orientation="vertical" className="h-8 mx-2" />
          <View className="flex-1 items-center">
            <Text className="font-bold">Grade {player.grade}</Text>
            <Text className="text-[10px] font-semibold text-muted-foreground tracking-widest mt-0.5">CLASS</Text>
          </View>
          <Separator orientation="vertical" className="h-8 mx-2" />
          <View className="flex-1 items-center">
            <Text className="font-bold">{player.stats.gamesPlayed}</Text>
            <Text className="text-[10px] font-semibold text-muted-foreground tracking-widest mt-0.5">GAMES</Text>
          </View>
        </Card>
      </View>

      {/* Stats Section */}
      <View className="px-4 pb-16">
        {/* Primary Stats */}
        <Text className="text-xs font-extrabold text-primary tracking-[3px] mb-4 mt-4">SEASON AVERAGES</Text>
        <View className="flex-row gap-2">
          <StatCard label="POINTS" value={player.stats.avgPoints.toFixed(1)} sublabel="PPG" color="#FF6B35" />
          <StatCard label="REBOUNDS" value={player.stats.avgRebounds.toFixed(1)} sublabel="RPG" color="#10B981" />
          <StatCard label="ASSISTS" value={player.stats.avgAssists.toFixed(1)} sublabel="APG" color="#3B82F6" />
        </View>

        {/* Secondary Stats */}
        <View className="flex-row gap-2 mt-2 justify-center">
          <StatCard label="STEALS" value={player.stats.avgSteals.toFixed(1)} />
          <StatCard label="BLOCKS" value={player.stats.avgBlocks.toFixed(1)} />
        </View>

        {/* Shooting Stats */}
        <Text className="text-xs font-extrabold text-primary tracking-[3px] mb-4 mt-6">SHOOTING SPLITS</Text>
        <View className="gap-2">
          <Card className="p-4">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-sm font-bold text-muted-foreground tracking-wider">FG%</Text>
              <Text className="text-lg font-extrabold">{player.stats.fgPercentage.toFixed(1)}%</Text>
            </View>
            <View className="h-1.5 bg-muted rounded-full overflow-hidden">
              <View
                className="h-full rounded-full bg-primary"
                style={{ width: `${player.stats.fgPercentage}%` }}
              />
            </View>
          </Card>

          <Card className="p-4">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-sm font-bold text-muted-foreground tracking-wider">3PT%</Text>
              <Text className="text-lg font-extrabold">{player.stats.threePointPercentage.toFixed(1)}%</Text>
            </View>
            <View className="h-1.5 bg-muted rounded-full overflow-hidden">
              <View
                className="h-full rounded-full bg-green-500"
                style={{ width: `${player.stats.threePointPercentage}%` }}
              />
            </View>
          </Card>

          <Card className="p-4">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-sm font-bold text-muted-foreground tracking-wider">FT%</Text>
              <Text className="text-lg font-extrabold">{player.stats.ftPercentage.toFixed(1)}%</Text>
            </View>
            <View className="h-1.5 bg-muted rounded-full overflow-hidden">
              <View
                className="h-full rounded-full bg-blue-500"
                style={{ width: `${player.stats.ftPercentage}%` }}
              />
            </View>
          </Card>
        </View>

        {/* Action Buttons */}
        <View className="mt-8 gap-2">
          <Button variant="default" className="py-4">
            <Text className="text-primary-foreground font-extrabold tracking-widest text-sm">VIEW GAME LOGS</Text>
          </Button>
          <Button variant="outline" className="py-4">
            <Text className="text-muted-foreground font-bold tracking-widest text-sm">EDIT PROFILE</Text>
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

export default PlayerDetailScreen;
