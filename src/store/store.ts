import { configureStore } from '@reduxjs/toolkit';
// Import slices as they are created
// import authSlice from './slices/authSlice';
// import gamesSlice from './slices/gamesSlice';
// import statsSlice from './slices/statsSlice';

export const store = configureStore({
  reducer: {
    // Add slices here as they are created
    // auth: authSlice,
    // games: gamesSlice,
    // stats: statsSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
