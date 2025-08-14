import mongoose, { Document, Schema } from 'mongoose';

export interface ILeaderboard extends Document {
  playerName: string;
  score: number;
  speed: number;
  createdAt: Date;
}

const LeaderboardSchema: Schema = new Schema({
  playerName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  score: {
    type: Number,
    required: true,
    min: 0
  },
  speed: {
    type: Number,
    required: true,
    min: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model<ILeaderboard>('Leaderboard', LeaderboardSchema);