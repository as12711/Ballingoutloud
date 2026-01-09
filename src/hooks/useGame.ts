import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import {
  fetchGames,
  fetchGame,
  createGame,
  updateGame,
  setCurrentGame,
} from '../store/slices/gameSlice';

export const useGame = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { games, currentGame, isLoading, error } = useSelector(
    (state: RootState) => state.game
  );

  const getGames = (filters?: { status?: string; teamId?: string; league?: string; date?: string }) => {
    return dispatch(fetchGames(filters));
  };

  const getGame = (id: string) => {
    return dispatch(fetchGame(id));
  };

  const createNewGame = (input: any) => {
    return dispatch(createGame(input));
  };

  const updateCurrentGame = (id: string, input: any) => {
    return dispatch(updateGame({ id, input }));
  };

  const selectGame = (game: any) => {
    dispatch(setCurrentGame(game));
  };

  return {
    games,
    currentGame,
    isLoading,
    error,
    getGames,
    getGame,
    createGame: createNewGame,
    updateGame: updateCurrentGame,
    setCurrentGame: selectGame,
  };
};
