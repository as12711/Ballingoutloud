/**
 * Utility functions for transforming and calculating game summary data
 * @module utils/gameSummary
 */

import { BoxScore, PlayerStatRow } from '../types/stat';
import { PlayerStats, TeamBoxScoreData } from '../types/gameSummary';

/**
 * Formats fouls into PF/TF (Personal Fouls/Technical Fouls) string format
 * @param fouls - Number of personal fouls
 * @param technicalFouls - Number of technical fouls (defaults to 0)
 * @returns Formatted string in "X/Y" format
 */
export const formatPfTf = (fouls: number, technicalFouls: number = 0): string => {
  return `${fouls || 0}/${technicalFouls || 0}`;
};

/**
 * Formats jersey number with # prefix
 * @param jerseyNumber - Jersey number (can be number or already formatted string)
 * @returns Formatted jersey number string (e.g., "#23")
 */
export const formatJerseyNumber = (jerseyNumber: number | string): string => {
  if (typeof jerseyNumber === 'string' && jerseyNumber.startsWith('#')) {
    return jerseyNumber;
  }
  return `#${jerseyNumber ?? 0}`;
};

/**
 * Transforms a PlayerStatRow from API to PlayerStats for display
 * @param player - Player stat row from API
 * @returns Transformed player stats for UI display
 */
export const transformPlayerStats = (player: PlayerStatRow): PlayerStats => {
  return {
    id: player.player_id,
    playerName: player.player_name || 'Unknown Player',
    jerseyNumber: formatJerseyNumber(player.jersey_number),
    points: player.points || 0,
    rebounds: player.rebounds || 0,
    assists: player.assists || 0,
    pfTf: formatPfTf(player.fouls || 0),
  };
};

/**
 * Calculates total rebounds from player stats array
 * @param players - Array of player stat rows
 * @returns Sum of all player rebounds
 */
export const calculateTotalRebounds = (players: PlayerStatRow[]): number => {
  return players.reduce((sum, player) => sum + (player.rebounds || 0), 0);
};

/**
 * Calculates total assists from player stats array
 * @param players - Array of player stat rows
 * @returns Sum of all player assists
 */
export const calculateTotalAssists = (players: PlayerStatRow[]): number => {
  return players.reduce((sum, player) => sum + (player.assists || 0), 0);
};

/**
 * Transforms team box score data from API format to display format
 * @param teamData - Team data from BoxScore API response
 * @returns Transformed team box score for UI display
 */
export const transformTeamBoxScore = (
  teamData: BoxScore['home_team'] | BoxScore['away_team']
): TeamBoxScoreData => {
  const players = teamData?.players || [];
  const transformedPlayers = players.map(transformPlayerStats);

  return {
    teamName: teamData?.team_name || 'Unknown Team',
    totalPoints: teamData?.total_points || 0,
    totalRebounds: calculateTotalRebounds(players),
    totalAssists: calculateTotalAssists(players),
    totalPfTf: formatPfTf(teamData?.total_fouls || 0),
    players: transformedPlayers,
  };
};

/**
 * Transforms complete BoxScore from API to GameSummaryData for display
 * @param boxScore - Box score data from API
 * @returns Transformed game summary data ready for rendering
 */
export const transformGameSummaryData = (boxScore: BoxScore): {
  homeTeam: TeamBoxScoreData;
  awayTeam: TeamBoxScoreData;
} => {
  return {
    homeTeam: transformTeamBoxScore(boxScore.home_team),
    awayTeam: transformTeamBoxScore(boxScore.away_team),
  };
};
