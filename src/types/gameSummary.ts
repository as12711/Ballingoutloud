/**
 * Type definitions for Game Summary Screen
 * @module types/gameSummary
 */

import { BoxScore, PlayerStatRow } from './stat';

/**
 * Represents player statistics displayed in the game summary
 */
export interface PlayerStats {
  id: string;
  playerName: string;
  jerseyNumber: string;
  points: number;
  rebounds: number;
  assists: number;
  pfTf: string; // Personal Fouls / Technical Fouls format: "X/Y"
}

/**
 * Represents team box score data for display
 */
export interface TeamBoxScoreData {
  teamName: string;
  totalPoints: number;
  totalRebounds: number;
  totalAssists: number;
  totalPfTf: string;
  players: PlayerStats[];
}

/**
 * Transformed game summary data ready for rendering
 */
export interface GameSummaryData {
  homeTeam: TeamBoxScoreData;
  awayTeam: TeamBoxScoreData;
}

/**
 * Hook return type for game summary data
 */
export interface UseGameSummaryReturn {
  homeTeam: TeamBoxScoreData | null;
  awayTeam: TeamBoxScoreData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}
