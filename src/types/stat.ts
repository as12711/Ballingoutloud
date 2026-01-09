import type { Player } from './player';
import type { Team } from './team';
import type { GameWithTeams, QuarterScore } from './game';

export enum StatEventType {
  TWO_PT_FGA = '2pt_fga',
  TWO_PT_FGM = '2pt_fgm',
  THREE_PT_FGA = '3pt_fga',
  THREE_PT_FGM = '3pt_fgm',
  FREE_THROW_FGA = 'ft_fga',
  FREE_THROW_FGM = 'ft_fgm',
  FOUL = 'foul',
  TURNOVER = 'turnover',
  BLOCK = 'block',
  STEAL = 'steal',
  REBOUND = 'rebound',
  ASSIST = 'assist',
  SUBSTITUTION = 'substitution',
  TIMEOUT_FULL = 'timeout_full',
  TIMEOUT_HALF = 'timeout_half',
}

export interface StatEvent {
  id: string;
  gameId: string;
  playerId: string;
  teamId: string;
  eventType: StatEventType;
  quarter: number;
  timestamp: string;
  createdBy: string;
  createdAt: string;
}

export interface GameStats {
  id: string;
  gameId: string;
  playerId: string;
  teamId: string;
  points: number;
  rebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  turnovers: number;
  fouls: number;
  fgAttempts: number;
  fgMade: number;
  threePtAttempts: number;
  threePtMade: number;
  freeThrowAttempts: number;
  freeThrowMade: number;
  createdAt: string;
  updatedAt: string;
}

export interface PlayerBoxScore extends GameStats {
  player: Player;
  fgPercentage: number;
  threePtPercentage: number;
  ftPercentage: number;
}

export interface TeamBoxScore {
  teamId: string;
  team: Team;
  points: number;
  fouls: number;
  turnovers: number;
  rebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  fgAttempts: number;
  fgMade: number;
  fgPercentage: number;
  threePtAttempts: number;
  threePtMade: number;
  threePtPercentage: number;
  playerStats: PlayerBoxScore[];
}

export interface GameSummary {
  game: GameWithTeams;
  homeTeamStats: TeamBoxScore;
  awayTeamStats: TeamBoxScore;
  quarterScores: QuarterScore[];
}

export interface TeamStats {
  id: string;
  gameId: string;
  teamId: string;
  quarter: number;
  points: number;
  fouls: number;
  turnovers: number;
  timeoutsFull: number;
  timeoutsHalf: number;
  createdAt: string;
  updatedAt: string;
}

export interface PlayerStatRow {
  player_id: string;
  player_name: string;
  jersey_number: number;
  points: number;
  rebounds: number;
  assists: number;
  fouls: number;
  turnovers: number;
  fg_made: number;
  fg_attempts: number;
  three_pt_made: number;
  three_pt_attempts: number;
  free_throw_made: number;
  free_throw_attempts: number;
}

export interface BoxScore {
  game_id: string;
  home_team: {
    team_id: string;
    team_name: string;
    total_points: number;
    total_fouls: number;
    players: PlayerStatRow[];
  };
  away_team: {
    team_id: string;
    team_name: string;
    total_points: number;
    total_fouls: number;
    players: PlayerStatRow[];
  };
}