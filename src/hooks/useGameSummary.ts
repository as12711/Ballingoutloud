/**
 * Custom hook for fetching and managing game summary data
 * @module hooks/useGameSummary
 */

import { useState, useEffect, useCallback } from 'react';
import { statsApi } from '../api/stats';
import { BoxScore } from '../types/stat';
import { UseGameSummaryReturn } from '../types/gameSummary';
import { transformGameSummaryData } from '../utils/gameSummary';

/**
 * Custom hook to fetch and manage game summary/box score data
 * 
 * @param gameId - The unique identifier for the game
 * @returns Object containing home/away team data, loading state, error state, and refetch function
 * 
 * @example
 * ```tsx
 * const { homeTeam, awayTeam, loading, error, refetch } = useGameSummary(gameId);
 * 
 * if (loading) return <Loading />;
 * if (error) return <Error message={error} />;
 * 
 * return (
 *   <View>
 *     <TeamSection team={homeTeam} />
 *     <TeamSection team={awayTeam} />
 *   </View>
 * );
 * ```
 */
export const useGameSummary = (gameId: string): UseGameSummaryReturn => {
  const [homeTeam, setHomeTeam] = useState<UseGameSummaryReturn['homeTeam']>(null);
  const [awayTeam, setAwayTeam] = useState<UseGameSummaryReturn['awayTeam']>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetches game summary data from API and transforms it for display
   */
  const fetchGameSummary = useCallback(async () => {
    if (!gameId) {
      setError('Game ID is required');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const boxScore: BoxScore = await statsApi.getBoxScore(gameId);
      const transformedData = transformGameSummaryData(boxScore);

      setHomeTeam(transformedData.homeTeam);
      setAwayTeam(transformedData.awayTeam);
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to load game summary';
      console.error('Error loading game summary:', err);
      setError(errorMessage);
      setHomeTeam(null);
      setAwayTeam(null);
    } finally {
      setLoading(false);
    }
  }, [gameId]);

  /**
   * Refetch game summary data (useful for refresh button)
   */
  const refetch = useCallback(async () => {
    await fetchGameSummary();
  }, [fetchGameSummary]);

  // Fetch data on mount and when gameId changes
  useEffect(() => {
    fetchGameSummary();
  }, [fetchGameSummary]);

  return {
    homeTeam,
    awayTeam,
    loading,
    error,
    refetch,
  };
};
