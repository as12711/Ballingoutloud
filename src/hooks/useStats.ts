import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import {
  fetchGameStats,
  createStatEvent,
  updatePlayerStats,
  fetchBoxScore,
  undoLastEvent,
} from '../store/slices/statSlice';
import { StatEventType } from '../types/stat';

export const useStats = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { gameStats, statEvents, boxScore, isLoading, error, undoStack } = useSelector(
    (state: RootState) => state.stat
  );

  const getGameStats = (gameId: string) => {
    return dispatch(fetchGameStats(gameId));
  };

  const recordStatEvent = (
    gameId: string,
    playerId: string,
    teamId: string,
    eventType: StatEventType,
    quarter: number,
    createdBy: string
  ) => {
    return dispatch(
      createStatEvent({
        gameId,
        playerId,
        teamId,
        eventType,
        quarter,
        timestamp: new Date().toISOString(),
        createdBy,
      })
    );
  };

  const updateStats = (gameId: string, playerId: string, teamId: string, stats: any) => {
    return dispatch(updatePlayerStats({ gameId, playerId, teamId, stats }));
  };

  const getBoxScore = (gameId: string) => {
    return dispatch(fetchBoxScore(gameId));
  };

  const undo = () => {
    dispatch(undoLastEvent());
  };

  return {
    gameStats,
    statEvents,
    boxScore,
    isLoading,
    error,
    undoStack,
    getGameStats,
    recordStatEvent,
    updateStats,
    getBoxScore,
    undo,
  };
};
