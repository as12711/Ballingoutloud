import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { playersApi } from '../../api/players';
import { Player } from '../../types/player';

interface PlayerState {
  players: Player[];
  currentPlayer: Player | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: PlayerState = {
  players: [],
  currentPlayer: null,
  isLoading: false,
  error: null,
};

export const fetchPlayers = createAsyncThunk(
  'player/fetchPlayers',
  async (teamId?: string) => {
    const players = await playersApi.getPlayers(teamId);
    return players;
  }
);

export const fetchPlayer = createAsyncThunk('player/fetchPlayer', async (id: string) => {
  const player = await playersApi.getPlayer(id);
  return player;
});

export const createPlayer = createAsyncThunk('player/createPlayer', async (input: any) => {
  const player = await playersApi.createPlayer(input);
  return player;
});

export const updatePlayer = createAsyncThunk(
  'player/updatePlayer',
  async ({ id, input }: { id: string; input: any }) => {
    const player = await playersApi.updatePlayer(id, input);
    return player;
  }
);

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setCurrentPlayer: (state, action: PayloadAction<Player | null>) => {
      state.currentPlayer = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlayers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPlayers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.players = action.payload;
      })
      .addCase(fetchPlayers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch players';
      })
      .addCase(fetchPlayer.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPlayer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentPlayer = action.payload;
      })
      .addCase(fetchPlayer.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch player';
      })
      .addCase(createPlayer.fulfilled, (state, action) => {
        state.players.push(action.payload);
      })
      .addCase(updatePlayer.fulfilled, (state, action) => {
        const index = state.players.findIndex((p) => p.id === action.payload.id);
        if (index >= 0) {
          state.players[index] = action.payload;
        }
        if (state.currentPlayer?.id === action.payload.id) {
          state.currentPlayer = action.payload;
        }
      });
  },
});

export const { setCurrentPlayer, clearError } = playerSlice.actions;
export default playerSlice.reducer;
