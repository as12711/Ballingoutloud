import type { Team } from './team';

export interface Player {
  id: string;
  teamId: string;
  userId?: string;
  firstName: string;
  lastName: string;
  jerseyNumber: number;
  position: string;
  grade: number;
  height?: string;
  photoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlayerWithTeam extends Player {
  team: Team;
}

export interface PlayerSeasonStats {
  playerId: string;
  gamesPlayed: number;
  avgPoints: number;
  avgRebounds: number;
  avgAssists: number;
  avgSteals: number;
  avgBlocks: number;
  fgPercentage: number;
  threePointPercentage: number;
  ftPercentage: number;
}

export interface CreatePlayerInput {
  team_id: string;
  first_name: string;
  last_name: string;
  jersey_number: number;
  position: string;
  grade?: number;
  height?: string;
}

export interface UpdatePlayerInput {
  first_name?: string;
  last_name?: string;
  jersey_number?: number;
  position?: string;
  grade?: number;
  height?: string;
}
