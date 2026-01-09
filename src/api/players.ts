import { supabase } from '../config/supabase';
import { Player, CreatePlayerInput, UpdatePlayerInput } from '../types/player';

export const playersApi = {
  getPlayers: async (teamId?: string): Promise<Player[]> => {
    let query = supabase.from('players').select('*').order('jersey_number');

    if (teamId) {
      query = query.eq('team_id', teamId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  getPlayer: async (id: string): Promise<Player> => {
    const { data, error } = await supabase.from('players').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },

  createPlayer: async (input: CreatePlayerInput): Promise<Player> => {
    const { data, error } = await supabase.from('players').insert(input).select().single();
    if (error) throw error;
    return data;
  },

  updatePlayer: async (id: string, input: UpdatePlayerInput): Promise<Player> => {
    const { data, error } = await supabase
      .from('players')
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  deletePlayer: async (id: string): Promise<void> => {
    const { error } = await supabase.from('players').delete().eq('id', id);
    if (error) throw error;
  },
};
