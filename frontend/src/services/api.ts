import axios from 'axios';
import { LeaderboardEntry, CreateLeaderboardEntry } from '../types/leaderboard';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const leaderboardAPI = {
  getAllLeaderboard: async (): Promise<LeaderboardEntry[]> => {
    const response = await api.get('/leaderboard');
    return response.data;
  },

  getTopLeaders: async (): Promise<LeaderboardEntry[]> => {
    const response = await api.get('/leaderboard/top10');
    return response.data;
  },

  getLeaderboardEntry: async (id: string): Promise<LeaderboardEntry> => {
    const response = await api.get(`/leaderboard/${id}`);
    return response.data;
  },

  createLeaderboardEntry: async (entry: CreateLeaderboardEntry): Promise<LeaderboardEntry> => {
    const response = await api.post('/leaderboard', entry);
    return response.data;
  },

  updateLeaderboardEntry: async (id: string, entry: CreateLeaderboardEntry): Promise<LeaderboardEntry> => {
    const response = await api.put(`/leaderboard/${id}`, entry);
    return response.data;
  },

  deleteLeaderboardEntry: async (id: string): Promise<void> => {
    await api.delete(`/leaderboard/${id}`);
  },
};