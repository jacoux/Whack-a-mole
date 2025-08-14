import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface GameState {
  currentScore: number;
  speed: number;
  isPlaying: boolean;
  isPaused: boolean;
  playerName: string;
  gameStartTime: number | null;
  level: number;
  timeRemaining: number;
  isGameEnded: boolean;
}

const initialState: GameState = {
  currentScore: 0,
  speed: 1.0,
  isPlaying: false,
  isPaused: false,
  playerName: '',
  gameStartTime: null,
  level: 1,
  timeRemaining: 120, // 2 minutes in seconds
  isGameEnded: false,
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    startGame: (state) => {
      state.isPlaying = true;
      state.isPaused = false;
      state.gameStartTime = Date.now();
      state.currentScore = 0;
      state.level = 1;
      state.timeRemaining = 120;
      state.isGameEnded = false;
    },
    pauseGame: (state) => {
      state.isPaused = true;
    },
    resumeGame: (state) => {
      state.isPaused = false;
    },
    stopGame: (state) => {
      state.isPlaying = false;
      state.isPaused = false;
      state.gameStartTime = null;
    },
    endGame: (state) => {
      state.isPlaying = false;
      state.isPaused = false;
      state.isGameEnded = true;
    },
    updateTimer: (state, action: PayloadAction<number>) => {
      state.timeRemaining = Math.max(0, action.payload);
      if (state.timeRemaining === 0 && state.isPlaying) {
        state.isPlaying = false;
        state.isGameEnded = true;
      }
    },
    increaseScore: (state, action: PayloadAction<number>) => {
      state.currentScore += action.payload;
    },
    setSpeed: (state, action: PayloadAction<number>) => {
      state.speed = action.payload;
    },
    setPlayerName: (state, action: PayloadAction<string>) => {
      state.playerName = action.payload;
    },
    levelUp: (state) => {
      if (state.level < 10) {
        state.level += 1;
      }
    },
    resetGame: (state) => {
      return { ...initialState, playerName: state.playerName };
    },
  },
});

export const {
  startGame,
  pauseGame,
  resumeGame,
  stopGame,
  endGame,
  updateTimer,
  increaseScore,
  setSpeed,
  setPlayerName,
  levelUp,
  resetGame,
} = gameSlice.actions;

export default gameSlice.reducer;