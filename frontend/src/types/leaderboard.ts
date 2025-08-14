export interface LeaderboardEntry {
  _id: string;
  playerName: string;
  score: number;
  speed: number;
  createdAt: string;
}

export interface CreateLeaderboardEntry {
  playerName: string;
  score: number;
  speed: number;
}