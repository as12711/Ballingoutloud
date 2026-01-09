import { supabase } from '../config/supabase';
import { Team, CreateTeamInput, UpdateTeamInput } from '../types/team';

export const teamsApi = {
  getTeams: async (): Promise<Team[]> => {
    const { data, error } = await supabase.from('teams').select('*').order('name');
    if (error) throw error;
    return data;
  },

  getTeam: async (id: string): Promise<Team> => {
    const { data, error } = await supabase.from('teams').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },

  createTeam: async (input: CreateTeamInput): Promise<Team> => {
    const { data, error } = await supabase.from('teams').insert(input).select().single();
    if (error) throw error;
    return data;
  },

  updateTeam: async (id: string, input: UpdateTeamInput): Promise<Team> => {
    const { data, error } = await supabase
      .from('teams')
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  deleteTeam: async (id: string): Promise<void> => {
    const { error } = await supabase.from('teams').delete().eq('id', id);
    if (error) throw error;
  },
};
