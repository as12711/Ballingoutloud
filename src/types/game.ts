import type { Team } from './team';

export enum GameStatus {
  SCHEDULED = 'scheduled',
  LIVE = 'live',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export interface Game {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  scheduledAt: string;
  venue: string;
  league: string;
  status: GameStatus;
  currentQuarter: number;
  homeScore: number;
  awayScore: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface GameWithTeams extends Game {
  homeTeam: Team;
  awayTeam: Team;
}

export interface GameStreamItem extends GameWithTeams {
  isLive: boolean;
  timeUntilStart?: string;
}

export interface QuarterScore {
  quarter: number;
  homeScore: number;
  awayScore: number;
}

export interface LiveGameState {
  gameId: string;
  quarter: number;
  possession: 'home' | 'away';
  homeScore: number;
  awayScore: number;
  homeTimeoutsFull: number;
  homeTimeoutsHalf: number;
  awayTimeoutsFull: number;
  awayTimeoutsHalf: number;
  homeFouls: number;
  awayFouls: number;
  quarterScores: QuarterScore[];
}

export interface CreateGameInput {
  home_team_id: string;
  away_team_id: string;
  scheduled_at: string;
  venue: string;
  league?: string;
  status?: GameStatus;
}

export interface UpdateGameInput {
  home_score?: number;
  away_score?: number;
  current_quarter?: number;
  status?: GameStatus;
}
