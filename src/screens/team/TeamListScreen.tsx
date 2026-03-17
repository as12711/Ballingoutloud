import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../navigation/MainNavigator';
import { teamsApi } from '../../api/teams';
import { Team, TeamWithStats } from '../../types/team';
import SearchBar from '../../components/common/SearchBar';
import Loading from '../../components/common/Loading';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

interface TeamCardProps {
  team: TeamWithStats;
  index: number;
  onPress: () => void;
}

const TeamCard: React.FC<TeamCardProps> = ({ team, index, onPress }) => {
  const winRate = team.wins + team.losses > 0
    ? ((team.wins / (team.wins + team.losses)) * 100).toFixed(0)
    : '0';

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} className="px-4 mb-2">
      <Card className="flex-row items-center p-4">
        {/* Team Logo / Avatar */}
        <View className="relative mr-4">
          {team.logoUrl ? (
            <Image source={{ uri: team.logoUrl }} className="w-[60px] h-[60px] rounded-2xl" />
          ) : (
            <View className="w-[60px] h-[60px] rounded-2xl bg-primary/15 items-center justify-center border-2 border-primary">
              <Text className="text-xl font-extrabold text-primary tracking-wider">
                {team.name.substring(0, 2).toUpperCase()}
              </Text>
            </View>
          )}
          {/* Win rate badge */}
          <Badge
            variant="default"
            className={`absolute -bottom-1 -right-1 ${Number(winRate) >= 50 ? 'bg-green-500' : 'bg-primary'}`}
          >
            <Text className="text-[10px] font-extrabold text-white">{winRate}%</Text>
          </Badge>
        </View>

        {/* Team Info */}
        <View className="flex-1">
          <Text className="text-[17px] font-bold">{team.name}</Text>
          <Text className="text-sm text-muted-foreground">{team.school}</Text>
          <Badge variant="secondary" className="self-start mt-1">
            <Text className="text-[10px] font-semibold uppercase tracking-wide">{team.league}</Text>
          </Badge>
        </View>

        {/* Stats Column */}
        <View className="items-center pl-3 border-l border-border ml-3">
          <View className="flex-row items-baseline">
            <Text className="text-xl font-extrabold text-green-500">{team.wins}</Text>
            <Text className="text-base text-muted-foreground mx-0.5">-</Text>
            <Text className="text-xl font-extrabold text-destructive">{team.losses}</Text>
          </View>
          <Text className="text-[9px] font-bold text-muted-foreground tracking-widest mt-0.5 mb-1">RECORD</Text>

          <View className="flex-row items-center">
            <View className="items-center px-1.5">
              <Text className="text-xs font-bold">{team.avgPoints.toFixed(1)}</Text>
              <Text className="text-[8px] font-semibold text-muted-foreground tracking-wide">PPG</Text>
            </View>
            <Separator orientation="vertical" className="h-5" />
            <View className="items-center px-1.5">
              <Text className="text-xs font-bold">{team.playerCount}</Text>
              <Text className="text-[8px] font-semibold text-muted-foreground tracking-wide">ROSTER</Text>
            </View>
          </View>
        </View>

        {/* Arrow indicator */}
        <View className="pl-2">
          <Text className="text-2xl text-muted-foreground font-light">&rsaquo;</Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const TeamListScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [teams, setTeams] = useState<TeamWithStats[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<TeamWithStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchTeams();
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
    <View className="px-4 pt-4 pb-2">
      <View className="flex-row justify-between items-center mb-4">
        <View>
          <Text className="text-3xl font-black tracking-widest">TEAMS</Text>
          <Text variant="muted">{filteredTeams.length} teams</Text>
        </View>
        <Button
          variant="default"
          size="icon"
          onPress={() => navigation.navigate('CreateTeam')}
          className="w-12 h-12 rounded-xl"
        >
          <Text className="text-primary-foreground text-2xl font-light">+</Text>
        </Button>
      </View>

      <SearchBar
        placeholder="Search teams, schools, leagues..."
        onSearch={setSearchQuery}
      />

      {/* Quick Stats Bar */}
      <Card className="flex-row p-4 mt-3">
        <View className="flex-1 items-center">
          <Text className="text-2xl font-extrabold">{teams.length}</Text>
          <Text className="text-[11px] text-muted-foreground font-semibold tracking-widest mt-0.5">Total</Text>
        </View>
        <Separator orientation="vertical" />
        <View className="flex-1 items-center">
          <Text className="text-2xl font-extrabold">
            {teams.filter(t => t.wins > t.losses).length}
          </Text>
          <Text className="text-[11px] text-muted-foreground font-semibold tracking-widest mt-0.5">Winning</Text>
        </View>
        <Separator orientation="vertical" />
        <View className="flex-1 items-center">
          <Text className="text-2xl font-extrabold">
            {teams.reduce((acc, t) => acc + t.playerCount, 0)}
          </Text>
          <Text className="text-[11px] text-muted-foreground font-semibold tracking-widest mt-0.5">Players</Text>
        </View>
      </Card>
    </View>
  );

  const renderEmptyState = () => (
    <View className="flex-1 items-center justify-center px-6 py-16">
      <View className="w-24 h-24 rounded-3xl bg-primary/10 items-center justify-center mb-6">
        <Text className="text-5xl">🏀</Text>
      </View>
      <Text className="text-xl font-extrabold mb-2">No Teams Yet</Text>
      <Text className="text-muted-foreground text-center mb-6 leading-6">
        Create your first team to start tracking stats
      </Text>
      <Button
        variant="default"
        onPress={() => navigation.navigate('CreateTeam')}
        className="px-8"
      >
        <Text className="text-primary-foreground font-extrabold tracking-widest text-sm">CREATE TEAM</Text>
      </Button>
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
        data={filteredTeams}
        renderItem={renderTeam}
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

export default TeamListScreen;
