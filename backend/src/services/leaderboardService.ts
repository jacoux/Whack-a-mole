import Leaderboard, { ILeaderboard } from '../models/Leaderboard';

export class LeaderboardService {
  async getAllLeaderboard(): Promise<ILeaderboard[]> {
    return await Leaderboard.find().sort({ score: -1, speed: -1, createdAt: -1 });
  }

  async getTopLeaders(limit: number = 10): Promise<ILeaderboard[]> {
    return await Leaderboard.find()
      .sort({ score: -1, speed: -1, createdAt: -1 })
      .limit(limit);
  }

  async createLeaderboardEntry(playerName: string, score: number, speed: number): Promise<ILeaderboard> {
    const entry = new Leaderboard({
      playerName,
      score,
      speed
    });
    return await entry.save();
  }

  async updateLeaderboardEntry(id: string, playerName: string, score: number, speed: number): Promise<ILeaderboard | null> {
    return await Leaderboard.findByIdAndUpdate(
      id,
      { playerName, score, speed },
      { new: true, runValidators: true }
    );
  }

  async deleteLeaderboardEntry(id: string): Promise<ILeaderboard | null> {
    return await Leaderboard.findByIdAndDelete(id);
  }

  async getLeaderboardEntry(id: string): Promise<ILeaderboard | null> {
    return await Leaderboard.findById(id);
  }
}