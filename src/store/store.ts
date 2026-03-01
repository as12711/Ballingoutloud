import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import gameReducer from './slices/gameSlice';
import statReducer from './slices/statSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    game: gameReducer,
    stat: statReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
