import { configureStore } from '@reduxjs/toolkit';
import gameReducer from './slices/gameSlice';
import leaderboardReducer from './slices/leaderboardSlice';

export const store = configureStore({
  reducer: {
    game: gameReducer,
    leaderboard: leaderboardReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;