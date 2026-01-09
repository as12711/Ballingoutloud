import { supabase } from '../config/supabase';
import { Game, GameWithTeams, CreateGameInput, UpdateGameInput } from '../types/game';
import { Team } from '../types/team';

// Transform Supabase snake_case response to camelCase
const transformGame = (data: any): GameWithTeams => {
  const transformTeam = (team: any): Team => ({
    id: team.id,
    name: team.name,
    school: team.school || '',
    league: team.league || '',
    logoUrl: team.logo_url || undefined,
    coachId: team.coach_id || '',
    createdAt: team.created_at,
    updatedAt: team.updated_at,
  });

  return {
    id: data.id,
    homeTeamId: data.home_team_id,
    awayTeamId: data.away_team_id,
    scheduledAt: data.scheduled_at,
    venue: data.venue,
    league: data.league || '',
    status: data.status,
    currentQuarter: data.current_quarter,
    homeScore: data.home_score,
    awayScore: data.away_score,
    createdBy: data.created_by,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    homeTeam: transformTeam(data.home_team),
    awayTeam: transformTeam(data.away_team),
  };
};

export const gamesApi = {
  getGames: async (filters?: {
    status?: string;
    teamId?: string;
    league?: string;
    date?: string;
  }): Promise<GameWithTeams[]> => {
    let query = supabase
      .from('games')
      .select(
        `
        *,
        home_team:teams!home_team_id(id, name, school, league, logo_url, coach_id, created_at, updated_at),
        away_team:teams!away_team_id(id, name, school, league, logo_url, coach_id, created_at, updated_at)
      `
      )
      .order('scheduled_at', { ascending: true });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.teamId) {
      query = query.or(`home_team_id.eq.${filters.teamId},away_team_id.eq.${filters.teamId}`);
    }
    if (filters?.league) {
      query = query.eq('league', filters.league);
    }
    if (filters?.date) {
      const startOfDay = new Date(filters.date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(filters.date);
      endOfDay.setHours(23, 59, 59, 999);
      query = query
        .gte('scheduled_at', startOfDay.toISOString())
        .lte('scheduled_at', endOfDay.toISOString());
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map(transformGame);
  },

  getGame: async (id: string): Promise<GameWithTeams> => {
    const { data, error } = await supabase
      .from('games')
      .select(
        `
        *,
        home_team:teams!home_team_id(id, name, school, league, logo_url, coach_id, created_at, updated_at),
        away_team:teams!away_team_id(id, name, school, league, logo_url, coach_id, created_at, updated_at)
      `
      )
      .eq('id', id)
      .single();

    if (error) throw error;
    return transformGame(data);
  },

  createGame: async (input: CreateGameInput): Promise<Game> => {
    const { data, error } = await supabase.from('games').insert(input).select().single();
    if (error) throw error;
    return data;
  },

  updateGame: async (id: string, input: UpdateGameInput): Promise<Game> => {
    const { data, error } = await supabase
      .from('games')
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  deleteGame: async (id: string): Promise<void> => {
    const { error } = await supabase.from('games').delete().eq('id', id);
    if (error) throw error;
  },
};
