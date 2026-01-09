// User Types
export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

// Team Types
export interface Team {
  id: string;
  name: string;
  sport: string;
  season: string;
  year: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}

// Player Types
export interface Player {
  id: string;
  team_id: string;
  name: string;
  jersey_number?: number;
  position?: string;
  created_at: string;
  updated_at: string;
}

// Game Types
export interface Game {
  id: string;
  team_id: string;
  opponent_name: string;
  scheduled_at: string;
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  home_score?: number;
  away_score?: number;
  quarter?: number;
  created_at: string;
  updated_at: string;
}

export interface GameWithTeams extends Game {
  team: Team;
}

// Stat Types
export interface Stat {
  id: string;
  game_id: string;
  player_id: string;
  stat_type: string;
  value: number;
  quarter?: number;
  timestamp: string;
  created_at: string;
}

// Navigation Types
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  GameDetail: { gameId: string };
  PlayerDetail: { playerId: string };
  TeamDetail: { teamId: string };
};

export type MainTabParamList = {
  GameStream: undefined;
  Teams: undefined;
  Players: undefined;
  Profile: undefined;
};
