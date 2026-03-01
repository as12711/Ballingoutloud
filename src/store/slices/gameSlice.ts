import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { gamesApi } from '../../api/games';
import { Game, GameWithTeams } from '../../types/game';

interface GameState {
  games: GameWithTeams[];
  currentGame: GameWithTeams | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: GameState = {
  games: [],
  currentGame: null,
  isLoading: false,
  error: null,
};

export const fetchGames = createAsyncThunk(
  'game/fetchGames',
  async (filters?: { status?: string; teamId?: string; league?: string; date?: string }) => {
    const games = await gamesApi.getGames(filters);
    return games;
  }
);

export const fetchGame = createAsyncThunk('game/fetchGame', async (id: string) => {
  const game = await gamesApi.getGame(id);
  return game;
});

export const createGame = createAsyncThunk('game/createGame', async (input: any) => {
  const game = await gamesApi.createGame(input);
  return game;
});

export const updateGame = createAsyncThunk(
  'game/updateGame',
  async ({ id, input }: { id: string; input: any }) => {
    const game = await gamesApi.updateGame(id, input);
    return game;
  }
);

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setCurrentGame: (state, action: PayloadAction<GameWithTeams | null>) => {
      state.currentGame = action.payload;
    },
    updateGameScore: (
      state,
      action: PayloadAction<{ homeScore: number; awayScore: number }>
    ) => {
      if (state.currentGame) {
        state.currentGame.homeScore = action.payload.homeScore;
        state.currentGame.awayScore = action.payload.awayScore;
      }
    },
    updateGameQuarter: (state, action: PayloadAction<number>) => {
      if (state.currentGame) {
        state.currentGame.currentQuarter = action.payload;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGames.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGames.fulfilled, (state, action) => {
        state.isLoading = false;
        state.games = action.payload;
      })
      .addCase(fetchGames.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch games';
      })
      .addCase(fetchGame.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGame.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentGame = action.payload;
      })
      .addCase(fetchGame.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch game';
      })
      .addCase(createGame.fulfilled, (state, action) => {
        // Optionally add to games list
      })
      .addCase(updateGame.fulfilled, (state, action) => {
        if (state.currentGame?.id === action.payload.id) {
          state.currentGame = { ...state.currentGame, ...action.payload };
        }
      });
  },
});

export const { setCurrentGame, updateGameScore, updateGameQuarter, clearError } =
  gameSlice.actions;
export default gameSlice.reducer;
