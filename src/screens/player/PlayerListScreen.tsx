import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../navigation/MainNavigator';
import { playersApi } from '../../api/players';
import { Player, PlayerSeasonStats } from '../../types/player';
import SearchBar from '../../components/common/SearchBar';
import Loading from '@/components/ui/loading';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

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
  const getPositionColor = (position: string) => {
    switch (position.toUpperCase()) {
      case 'PG': return '#FF6B35';
      case 'SG': return '#10B981';
      case 'SF': return '#F59E0B';
      case 'PF': return '#8B5CF6';
      case 'C': return '#3B82F6';
      default: return '#6B7280';
    }
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} className="px-4 mb-2">
      <Card className="flex-row items-center p-4">
        {/* Jersey Number Badge + Player Photo */}
        <View className="relative mr-4">
          <Badge variant="default" className="absolute -top-1.5 -left-1.5 z-10 bg-primary">
            <Text className="text-[10px] font-extrabold text-white">#{player.jerseyNumber}</Text>
          </Badge>
          {player.photoUrl ? (
            <Image source={{ uri: player.photoUrl }} className="w-14 h-14 rounded-xl" />
          ) : (
            <View className="w-14 h-14 rounded-xl bg-muted items-center justify-center border border-border">
              <Text className="text-lg font-bold text-muted-foreground">
                {player.firstName[0]}{player.lastName[0]}
              </Text>
            </View>
          )}
        </View>

        {/* Player Info */}
        <View className="flex-1">
          <Text className="text-base">
            {player.firstName}{' '}
            <Text className="font-bold">{player.lastName}</Text>
          </Text>
          <View className="flex-row items-center mt-1 gap-2">
            <Badge
              variant="outline"
              className="px-2 py-0.5"
              style={{ backgroundColor: `${getPositionColor(player.position)}20`, borderColor: getPositionColor(player.position) }}
            >
              <Text className="text-[10px] font-extrabold" style={{ color: getPositionColor(player.position) }}>
                {player.position}
              </Text>
            </Badge>
            <Text className="text-xs text-muted-foreground">Grade {player.grade}</Text>
            {player.height && <Text className="text-xs text-muted-foreground">{player.height}</Text>}
          </View>
        </View>

        {/* Stats */}
        <View className="items-center pl-4 border-l border-border ml-2">
          <View className="items-center mb-1">
            <Text className="text-[22px] font-extrabold text-primary">{player.stats.avgPoints.toFixed(1)}</Text>
            <Text className="text-[9px] font-bold text-muted-foreground tracking-widest">PPG</Text>
          </View>
          <View className="flex-row gap-2">
            <View className="items-center">
              <Text className="text-xs font-bold">{player.stats.avgRebounds.toFixed(1)}</Text>
              <Text className="text-[8px] font-semibold text-muted-foreground tracking-wide">REB</Text>
            </View>
            <View className="items-center">
              <Text className="text-xs font-bold">{player.stats.avgAssists.toFixed(1)}</Text>
              <Text className="text-[8px] font-semibold text-muted-foreground tracking-wide">AST</Text>
            </View>
          </View>
        </View>

        {/* Arrow */}
        <View className="pl-2">
          <Text className="text-2xl text-muted-foreground font-light">&rsaquo;</Text>
        </View>
      </Card>
    </TouchableOpacity>
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

  const positions = ['PG', 'SG', 'SF', 'PF', 'C'];

  useEffect(() => {
    fetchPlayers();
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

  const renderPlayer = ({ item, index }: { item: PlayerWithStats; index: number }) => (
    <PlayerCard
      player={item}
      index={index}
      onPress={() => navigation.navigate('PlayerDetail', { playerId: item.id })}
    />
  );

  const renderHeader = () => (
    <View className="px-4 pt-4">
      <View className="flex-row justify-between items-center mb-4">
        <View>
          <Text className="text-3xl font-black tracking-widest">PLAYERS</Text>
          <Text variant="muted">{filteredPlayers.length} players</Text>
        </View>
        {teamId && (
          <Button
            variant="default"
            size="icon"
            onPress={() => navigation.navigate('CreatePlayer', { teamId })}
            className="w-12 h-12 rounded-xl"
          >
            <Text className="text-primary-foreground text-2xl font-light">+</Text>
          </Button>
        )}
      </View>

      <SearchBar
        placeholder="Search by name or jersey #..."
        onSearch={setSearchQuery}
      />

      {/* Position Filter */}
      <View className="flex-row mt-3 mb-2 gap-1.5">
        <Button
          variant={!selectedPosition ? 'default' : 'outline'}
          size="sm"
          onPress={() => setSelectedPosition(null)}
          className="rounded-full"
        >
          <Text className={!selectedPosition ? 'text-primary-foreground font-bold text-xs tracking-widest' : 'text-muted-foreground font-bold text-xs tracking-widest'}>
            ALL
          </Text>
        </Button>
        {positions.map((pos) => (
          <Button
            key={pos}
            variant={selectedPosition === pos ? 'default' : 'outline'}
            size="sm"
            onPress={() => setSelectedPosition(selectedPosition === pos ? null : pos)}
            className="rounded-full"
          >
            <Text className={selectedPosition === pos ? 'text-primary-foreground font-bold text-xs tracking-widest' : 'text-muted-foreground font-bold text-xs tracking-widest'}>
              {pos}
            </Text>
          </Button>
        ))}
      </View>

      {/* Stats Leaders */}
      {players.length > 0 && (
        <Card className="mt-3 mb-2">
          <CardHeader>
            <Text className="text-[11px] font-bold text-primary tracking-widest">TOP PERFORMERS</Text>
          </CardHeader>
          <CardContent className="flex-row justify-between">
            <View className="flex-1 items-center px-1">
              <Text className="text-[9px] font-semibold text-muted-foreground tracking-widest mb-1">SCORING</Text>
              <Text className="text-sm font-bold">
                {[...players].sort((a, b) => b.stats.avgPoints - a.stats.avgPoints)[0]?.firstName}
              </Text>
              <Text className="text-[11px] font-semibold text-green-500 mt-0.5">
                {[...players].sort((a, b) => b.stats.avgPoints - a.stats.avgPoints)[0]?.stats.avgPoints.toFixed(1)} PPG
              </Text>
            </View>
            <View className="flex-1 items-center px-1">
              <Text className="text-[9px] font-semibold text-muted-foreground tracking-widest mb-1">REBOUNDS</Text>
              <Text className="text-sm font-bold">
                {[...players].sort((a, b) => b.stats.avgRebounds - a.stats.avgRebounds)[0]?.firstName}
              </Text>
              <Text className="text-[11px] font-semibold text-green-500 mt-0.5">
                {[...players].sort((a, b) => b.stats.avgRebounds - a.stats.avgRebounds)[0]?.stats.avgRebounds.toFixed(1)} RPG
              </Text>
            </View>
            <View className="flex-1 items-center px-1">
              <Text className="text-[9px] font-semibold text-muted-foreground tracking-widest mb-1">ASSISTS</Text>
              <Text className="text-sm font-bold">
                {[...players].sort((a, b) => b.stats.avgAssists - a.stats.avgAssists)[0]?.firstName}
              </Text>
              <Text className="text-[11px] font-semibold text-green-500 mt-0.5">
                {[...players].sort((a, b) => b.stats.avgAssists - a.stats.avgAssists)[0]?.stats.avgAssists.toFixed(1)} APG
              </Text>
            </View>
          </CardContent>
        </Card>
      )}
    </View>
  );

  const renderEmptyState = () => (
    <View className="flex-1 items-center justify-center px-6 py-16">
      <View className="w-24 h-24 rounded-3xl bg-primary/10 items-center justify-center mb-6">
        <Text className="text-5xl">👤</Text>
      </View>
      <Text className="text-xl font-extrabold mb-2">No Players Found</Text>
      <Text className="text-muted-foreground text-center mb-6 leading-6">
        {searchQuery || selectedPosition
          ? 'Try adjusting your filters'
          : 'Add players to your team roster'}
      </Text>
      {teamId && !searchQuery && !selectedPosition && (
        <Button
          variant="default"
          onPress={() => navigation.navigate('CreatePlayer', { teamId })}
          className="px-8"
        >
          <Text className="text-primary-foreground font-extrabold tracking-widest text-sm">ADD PLAYER</Text>
        </Button>
      )}
    </View>
  );

  if (isLoading) {
    return (
      <View className="flex-1 bg-background">
        <Loading fullScreen />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <FlatList
        data={filteredPlayers}
        renderItem={renderPlayer}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 32 }}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={!isLoading ? renderEmptyState : null}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <Separator className="mx-4" />}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
          />
        }
      />
    </View>
  );
};

export default PlayerListScreen;
