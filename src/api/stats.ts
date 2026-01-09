import { supabase } from '../config/supabase';
import {
  GameStats,
  StatEvent,
  TeamStats,
  BoxScore,
  StatEventType,
  PlayerStatRow,
} from '../types/stat';

export const statsApi = {
  getGameStats: async (gameId: string): Promise<GameStats[]> => {
    const { data, error } = await supabase
      .from('game_stats')
      .select('*')
      .eq('game_id', gameId);

    if (error) throw error;
    return data;
  },

  getPlayerStats: async (gameId: string, playerId: string): Promise<GameStats | null> => {
    const { data, error } = await supabase
      .from('game_stats')
      .select('*')
      .eq('game_id', gameId)
      .eq('player_id', playerId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  createStatEvent: async (event: Omit<StatEvent, 'id' | 'created_at'>): Promise<StatEvent> => {
    const { data, error } = await supabase
      .from('stat_events')
      .insert(event)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  updatePlayerStats: async (
    gameId: string,
    playerId: string,
    teamId: string,
    stats: Partial<GameStats>
  ): Promise<GameStats> => {
    // Check if stats exist
    const existing = await statsApi.getPlayerStats(gameId, playerId);

    if (existing) {
      const { data, error } = await supabase
        .from('game_stats')
        .update({ ...stats, updated_at: new Date().toISOString() })
        .eq('game_id', gameId)
        .eq('player_id', playerId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase
        .from('game_stats')
        .insert({
          game_id: gameId,
          player_id: playerId,
          team_id: teamId,
          ...stats,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  },

  getTeamStats: async (gameId: string, teamId: string, quarter?: number): Promise<TeamStats[]> => {
    let query = supabase
      .from('team_stats')
      .select('*')
      .eq('game_id', gameId)
      .eq('team_id', teamId);

    if (quarter) {
      query = query.eq('quarter', quarter);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  updateTeamStats: async (
    gameId: string,
    teamId: string,
    quarter: number,
    stats: Partial<TeamStats>
  ): Promise<TeamStats> => {
    // Check if stats exist
    const { data: existing } = await supabase
      .from('team_stats')
      .select('*')
      .eq('game_id', gameId)
      .eq('team_id', teamId)
      .eq('quarter', quarter)
      .single();

    if (existing) {
      const { data, error } = await supabase
        .from('team_stats')
        .update({ ...stats, updated_at: new Date().toISOString() })
        .eq('game_id', gameId)
        .eq('team_id', teamId)
        .eq('quarter', quarter)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase
        .from('team_stats')
        .insert({
          game_id: gameId,
          team_id: teamId,
          quarter,
          ...stats,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  },

  getBoxScore: async (gameId: string): Promise<BoxScore> => {
    // Get game info
    const { data: game, error: gameError } = await supabase
      .from('games')
      .select('home_team_id, away_team_id')
      .eq('id', gameId)
      .single();

    if (gameError) throw gameError;

    // Get team names
    const { data: homeTeam, error: homeError } = await supabase
      .from('teams')
      .select('id, name')
      .eq('id', game.home_team_id)
      .single();

    const { data: awayTeam, error: awayError } = await supabase
      .from('teams')
      .select('id, name')
      .eq('id', game.away_team_id)
      .single();

    if (homeError || awayError) throw homeError || awayError;

    // Get player stats
    const { data: playerStats, error: statsError } = await supabase
      .from('game_stats')
      .select(
        `
        *,
        player:players(id, first_name, last_name, jersey_number)
      `
      )
      .eq('game_id', gameId);

    if (statsError) throw statsError;

    // Get team totals
    const { data: teamStats, error: teamStatsError } = await supabase
      .from('team_stats')
      .select('*')
      .eq('game_id', gameId);

    if (teamStatsError) throw teamStatsError;

    // Aggregate stats
    const homePlayers: PlayerStatRow[] = [];
    const awayPlayers: PlayerStatRow[] = [];

    let homeTotalPoints = 0;
    let homeTotalFouls = 0;
    let awayTotalPoints = 0;
    let awayTotalFouls = 0;

    playerStats?.forEach((stat: any) => {
      const playerRow: PlayerStatRow = {
        player_id: stat.player_id,
        player_name: `${stat.player.first_name} ${stat.player.last_name}`,
        jersey_number: stat.player.jersey_number,
        points: stat.points,
        rebounds: stat.rebounds,
        assists: stat.assists,
        fouls: stat.fouls,
        turnovers: stat.turnovers,
        fg_made: stat.fg_made,
        fg_attempts: stat.fg_attempts,
        three_pt_made: stat.three_pt_made,
        three_pt_attempts: stat.three_pt_attempts,
        free_throw_made: stat.free_throw_made,
        free_throw_attempts: stat.free_throw_attempts,
      };

      if (stat.team_id === game.home_team_id) {
        homePlayers.push(playerRow);
        homeTotalPoints += stat.points;
        homeTotalFouls += stat.fouls;
      } else {
        awayPlayers.push(playerRow);
        awayTotalPoints += stat.points;
        awayTotalFouls += stat.fouls;
      }
    });

    // Aggregate team stats
    teamStats?.forEach((stat) => {
      if (stat.team_id === game.home_team_id) {
        homeTotalPoints += stat.points;
        homeTotalFouls += stat.fouls;
      } else {
        awayTotalPoints += stat.points;
        awayTotalFouls += stat.fouls;
      }
    });

    return {
      game_id: gameId,
      home_team: {
        team_id: homeTeam.id,
        team_name: homeTeam.name,
        total_points: homeTotalPoints,
        total_fouls: homeTotalFouls,
        players: homePlayers,
      },
      away_team: {
        team_id: awayTeam.id,
        team_name: awayTeam.name,
        total_points: awayTotalPoints,
        total_fouls: awayTotalFouls,
        players: awayPlayers,
      },
    };
  },
};
