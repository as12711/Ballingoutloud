import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { statsApi } from '../../api/stats';
import { GameStats, StatEvent, BoxScore } from '../../types/stat';

interface StatState {
  gameStats: GameStats[];
  statEvents: StatEvent[];
  boxScore: BoxScore | null;
  isLoading: boolean;
  error: string | null;
  undoStack: StatEvent[];
}

const initialState: StatState = {
  gameStats: [],
  statEvents: [],
  boxScore: null,
  isLoading: false,
  error: null,
  undoStack: [],
};

export const fetchGameStats = createAsyncThunk(
  'stat/fetchGameStats',
  async (gameId: string) => {
    const stats = await statsApi.getGameStats(gameId);
    return stats;
  }
);

export const createStatEvent = createAsyncThunk(
  'stat/createStatEvent',
  async (event: Omit<StatEvent, 'id' | 'created_at'>) => {
    const createdEvent = await statsApi.createStatEvent(event);
    return createdEvent;
  }
);

export const updatePlayerStats = createAsyncThunk(
  'stat/updatePlayerStats',
  async ({
    gameId,
    playerId,
    teamId,
    stats,
  }: {
    gameId: string;
    playerId: string;
    teamId: string;
    stats: Partial<GameStats>;
  }) => {
    const updatedStats = await statsApi.updatePlayerStats(gameId, playerId, teamId, stats);
    return updatedStats;
  }
);

export const fetchBoxScore = createAsyncThunk('stat/fetchBoxScore', async (gameId: string) => {
  const boxScore = await statsApi.getBoxScore(gameId);
  return boxScore;
});

const statSlice = createSlice({
  name: 'stat',
  initialState,
  reducers: {
    addStatEvent: (state, action: PayloadAction<StatEvent>) => {
      state.statEvents.push(action.payload);
      state.undoStack.push(action.payload);
    },
    undoLastEvent: (state) => {
      if (state.undoStack.length > 0) {
        state.undoStack.pop();
        state.statEvents.pop();
      }
    },
    clearUndoStack: (state) => {
      state.undoStack = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGameStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGameStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.gameStats = action.payload;
      })
      .addCase(fetchGameStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch game stats';
      })
      .addCase(createStatEvent.fulfilled, (state, action) => {
        state.statEvents.push(action.payload);
        state.undoStack.push(action.payload);
      })
      .addCase(updatePlayerStats.fulfilled, (state, action) => {
        const index = state.gameStats.findIndex(
          (stat) => stat.player_id === action.payload.player_id
        );
        if (index >= 0) {
          state.gameStats[index] = action.payload;
        } else {
          state.gameStats.push(action.payload);
        }
      })
      .addCase(fetchBoxScore.fulfilled, (state, action) => {
        state.boxScore = action.payload;
      });
  },
});

export const { addStatEvent, undoLastEvent, clearUndoStack, clearError } = statSlice.actions;
export default statSlice.reducer;
