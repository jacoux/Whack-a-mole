import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { LeaderboardEntry, CreateLeaderboardEntry } from '../../types/leaderboard';
import { leaderboardAPI } from '../../services/api';

export interface LeaderboardState {
  entries: LeaderboardEntry[];
  topEntries: LeaderboardEntry[];
  loading: boolean;
  error: string | null;
}

const initialState: LeaderboardState = {
  entries: [],
  topEntries: [],
  loading: false,
  error: null,
};

export const fetchLeaderboard = createAsyncThunk(
  'leaderboard/fetchAll',
  async () => {
    const response = await leaderboardAPI.getAllLeaderboard();
    return response;
  }
);

export const fetchTopLeaders = createAsyncThunk(
  'leaderboard/fetchTop',
  async () => {
    const response = await leaderboardAPI.getTopLeaders();
    return response;
  }
);

export const createLeaderboardEntry = createAsyncThunk(
  'leaderboard/create',
  async (entry: CreateLeaderboardEntry) => {
    const response = await leaderboardAPI.createLeaderboardEntry(entry);
    return response;
  }
);

export const deleteLeaderboardEntry = createAsyncThunk(
  'leaderboard/delete',
  async (id: string) => {
    await leaderboardAPI.deleteLeaderboardEntry(id);
    return id;
  }
);

export const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaderboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        state.loading = false;
        state.entries = action.payload;
      })
      .addCase(fetchLeaderboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch leaderboard';
      })
      .addCase(fetchTopLeaders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTopLeaders.fulfilled, (state, action) => {
        state.loading = false;
        state.topEntries = action.payload;
      })
      .addCase(fetchTopLeaders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch top leaders';
      })
      .addCase(createLeaderboardEntry.fulfilled, (state, action) => {
        state.entries.unshift(action.payload);
        state.topEntries.unshift(action.payload);
        state.topEntries = state.topEntries.slice(0, 10);
      })
      .addCase(createLeaderboardEntry.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to create entry';
      })
      .addCase(deleteLeaderboardEntry.fulfilled, (state, action) => {
        state.entries = state.entries.filter(entry => entry._id !== action.payload);
        state.topEntries = state.topEntries.filter(entry => entry._id !== action.payload);
      })
      .addCase(deleteLeaderboardEntry.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to delete entry';
      });
  },
});

export const { clearError } = leaderboardSlice.actions;

export default leaderboardSlice.reducer;