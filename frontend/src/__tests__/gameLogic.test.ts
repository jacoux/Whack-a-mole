interface Mole {
  id: number;
  isActive: boolean;
  isHit: boolean;
}

const createMoles = (count: number): Mole[] => {
  return Array.from({ length: count }, (_, i) => ({ 
    id: i, 
    isActive: false, 
    isHit: false 
  }));
};

const getInactiveMoles = (moles: Mole[]): Mole[] => {
  return moles.filter(mole => !mole.isActive);
};

const calculateNewScore = (currentScore: number, points: number): number => {
  return currentScore + points;
};

const shouldLevelUp = (score: number): boolean => {
  return score > 0 && score % 1000 === 0;
};

const shouldSpeedUp = (score: number, currentSpeed: number): boolean => {
  return score > 0 && score % 2000 === 0 && currentSpeed < 3.0;
};

const calculateNewSpeed = (currentSpeed: number): number => {
  return Math.min(3.0, currentSpeed + 0.5);
};

describe('Game Logic', () => {
  test('createMoles should create correct number of moles', () => {
    const moles = createMoles(12);
    
    expect(moles).toHaveLength(12);
    expect(moles[0]).toEqual({ id: 0, isActive: false, isHit: false });
    expect(moles[11]).toEqual({ id: 11, isActive: false, isHit: false });
  });

  test('getInactiveMoles should filter correctly', () => {
    const moles: Mole[] = [
      { id: 0, isActive: false, isHit: false },
      { id: 1, isActive: true, isHit: false },
      { id: 2, isActive: false, isHit: true },
      { id: 3, isActive: true, isHit: true },
    ];
    
    const inactiveMoles = getInactiveMoles(moles);
    
    expect(inactiveMoles).toHaveLength(2);
    expect(inactiveMoles[0].id).toBe(0);
    expect(inactiveMoles[1].id).toBe(2);
  });

  test('calculateNewScore should add points correctly', () => {
    expect(calculateNewScore(0, 200)).toBe(200);
    expect(calculateNewScore(500, 200)).toBe(700);
    expect(calculateNewScore(1800, 200)).toBe(2000);
  });

  test('shouldLevelUp should return true at 1000 point intervals', () => {
    expect(shouldLevelUp(1000)).toBe(true);
    expect(shouldLevelUp(2000)).toBe(true);
    expect(shouldLevelUp(3000)).toBe(true);
    expect(shouldLevelUp(999)).toBe(false);
    expect(shouldLevelUp(1001)).toBe(false);
    expect(shouldLevelUp(0)).toBe(false);
  });

  test('shouldSpeedUp should return true at 2000 point intervals when speed is below max', () => {
    expect(shouldSpeedUp(2000, 1.0)).toBe(true);
    expect(shouldSpeedUp(4000, 2.5)).toBe(true);
    expect(shouldSpeedUp(2000, 3.0)).toBe(false);
    expect(shouldSpeedUp(1999, 1.0)).toBe(false);
    expect(shouldSpeedUp(0, 1.0)).toBe(false);
  });

  test('calculateNewSpeed should increment by 0.5 but cap at 3.0', () => {
    expect(calculateNewSpeed(1.0)).toBe(1.5);
    expect(calculateNewSpeed(2.5)).toBe(3.0);
    expect(calculateNewSpeed(3.0)).toBe(3.0);
  });

  test('game timer should count down correctly', () => {
    let timeRemaining = 120;
    
    timeRemaining -= 1;
    expect(timeRemaining).toBe(119);
    
    for (let i = 0; i < 119; i++) {
      timeRemaining -= 1;
    }
    expect(timeRemaining).toBe(0);
  });

  test('mole state transitions should work correctly', () => {
    let mole: Mole = { id: 0, isActive: false, isHit: false };
    
    mole = { ...mole, isActive: true };
    expect(mole.isActive).toBe(true);
    expect(mole.isHit).toBe(false);
    
    mole = { ...mole, isHit: true, isActive: false };
    expect(mole.isActive).toBe(false);
    expect(mole.isHit).toBe(true);
  });

  test('level calculation should be correct', () => {
    const getLevel = (score: number): number => {
      return Math.floor(score / 1000) + 1;
    };
    
    expect(getLevel(0)).toBe(1);
    expect(getLevel(999)).toBe(1);
    expect(getLevel(1000)).toBe(2);
    expect(getLevel(2500)).toBe(3);
    expect(getLevel(5000)).toBe(6);
  });
});