import gameReducer, {
  startGame,
  increaseScore,
  levelUp,
  pauseGame,
  stopGame,
  endGame,
  updateTimer,
  setSpeed,
} from '../store/slices/gameSlice';

describe('gameSlice', () => {
  const initialState = {
    currentScore: 0,
    speed: 1.0,
    isPlaying: false,
    isPaused: false,
    playerName: '',
    gameStartTime: null,
    level: 1,
    timeRemaining: 120,
    isGameEnded: false,
  };

  test('should return the initial state', () => {
    expect(gameReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  test('should handle startGame', () => {
    const action = startGame();
    const state = gameReducer(initialState, action);

    expect(state.isPlaying).toBe(true);
    expect(state.isPaused).toBe(false);
    expect(state.isGameEnded).toBe(false);
    expect(state.gameStartTime).toBeDefined();
    expect(state.timeRemaining).toBe(120);
  });

  test('should handle increaseScore', () => {
    const action = increaseScore(200);
    const state = gameReducer(initialState, action);

    expect(state.currentScore).toBe(200);
  });

  test('should handle levelUp', () => {
    const action = levelUp();
    const state = gameReducer(initialState, action);

    expect(state.level).toBe(2);
  });

  test('should handle pauseGame', () => {
    const playingState = {
      ...initialState,
      isPlaying: true,
    };
    const action = pauseGame();
    const state = gameReducer(playingState, action);

    expect(state.isPaused).toBe(true);
  });

  test('should handle stopGame', () => {
    const playingState = {
      ...initialState,
      isPlaying: true,
    };
    const action = stopGame();
    const state = gameReducer(playingState, action);

    expect(state.isPlaying).toBe(false);
    expect(state.isPaused).toBe(false);
  });

  test('should handle endGame', () => {
    const playingState = {
      ...initialState,
      isPlaying: true,
    };
    const action = endGame();
    const state = gameReducer(playingState, action);

    expect(state.isPlaying).toBe(false);
    expect(state.isPaused).toBe(false);
    expect(state.isGameEnded).toBe(true);
  });

  test('should handle updateTimer', () => {
    const action = updateTimer(90);
    const state = gameReducer(initialState, action);

    expect(state.timeRemaining).toBe(90);
  });

  test('should handle setSpeed', () => {
    const action = setSpeed(2.5);
    const state = gameReducer(initialState, action);

    expect(state.speed).toBe(2.5);
  });

  test('should accumulate score correctly', () => {
    let state = gameReducer(initialState, increaseScore(200));
    expect(state.currentScore).toBe(200);

    state = gameReducer(state, increaseScore(300));
    expect(state.currentScore).toBe(500);
  });

  test('should increment level correctly', () => {
    let state = gameReducer(initialState, levelUp());
    expect(state.level).toBe(2);

    state = gameReducer(state, levelUp());
    expect(state.level).toBe(3);
  });
});