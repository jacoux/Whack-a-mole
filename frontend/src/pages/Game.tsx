import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import WAM_Mole from '../assets/WAM_Mole.png';
import WAM_Hammer from '../assets/WAM_Hammer.png';
import { 
  startGame, 
  increaseScore, 
  levelUp, 
  stopGame,
  endGame,
  updateTimer,
  setSpeed 
} from '../store/slices/gameSlice';
import { createLeaderboardEntry, fetchTopLeaders } from '../store/slices/leaderboardSlice';
import GameNavbar from '../components/GameNavbar/GameNavbar';
import GameEndScreen from '../components/GameEndScreen/GameEndScreen';
import './Game.scss';

interface Mole {
  id: number;
  isActive: boolean;
  isHit: boolean;
}

const Game: React.FC = () => {
  const { 
    currentScore, 
    speed, 
    isPlaying, 
    isPaused, 
    playerName, 
    gameStartTime,
    level,
    timeRemaining,
    isGameEnded
  } = useAppSelector(state => state.game);
  
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const [moles, setMoles] = useState<Mole[]>(
    Array.from({ length: 12 }, (_, i) => ({ id: i, isActive: false, isHit: false }))
  );
  const [gameInterval, setGameInterval] = useState<NodeJS.Timeout | null>(null);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const [isClicking, setIsClicking] = useState(false);

  const spawnMole = useCallback(() => {
    if (isPaused || !isPlaying) return;
    
    const inactiveMoles = moles.filter(mole => !mole.isActive);
    if (inactiveMoles.length === 0) return;
    
    const randomMole = inactiveMoles[Math.floor(Math.random() * inactiveMoles.length)];
    
    setMoles(prevMoles => 
      prevMoles.map(mole => 
        mole.id === randomMole.id 
          ? { ...mole, isActive: true, isHit: false }
          : mole
      )
    );
    
    setTimeout(() => {
      setMoles(prevMoles => 
        prevMoles.map(mole => 
          mole.id === randomMole.id && mole.isActive && !mole.isHit
            ? { ...mole, isActive: false }
            : mole
        )
      );
    }, 1500 / speed);
  }, [moles, isPaused, isPlaying, speed, dispatch]);


  const hitMole = (moleId: number) => {
    if (isPaused || !isPlaying) return;

    setMoles(prevMoles =>
      prevMoles.map(mole => {
        if (mole.id === moleId && mole.isActive && !mole.isHit) {
          const points = 200;
          const newScore = currentScore + points;
          dispatch(increaseScore(points));

          if (newScore % 1000 === 0) {
            dispatch(levelUp());
          }

          if (newScore % 2000 === 0 && speed < 3.0) {
            const newSpeed = Math.min(3.0, speed + 0.5);
            dispatch(setSpeed(newSpeed));
          }

          return { ...mole, isHit: true, isActive: false };
        }
        return mole;
      })
    );
  };

  const handleGameStart = () => {
    if (!playerName) {
      navigate('/');
      return;
    }
    dispatch(startGame());
  };

  const handleGameEnd = async () => {
    console.log('Game ending...', { playerName, currentScore, gameStartTime });
    let scoreSubmitted = false;
    
    if (gameStartTime && playerName && currentScore > 0) {
      const gameTime = 120 - timeRemaining;
      const avgSpeed = gameTime > 0 ? (currentScore / 100) / gameTime : 0;
      
      console.log('Submitting score...', { 
        playerName, 
        score: currentScore, 
        speed: parseFloat(avgSpeed.toFixed(2)) 
      });

      try {
        const result = await dispatch(createLeaderboardEntry({
          playerName,
          score: currentScore,
          speed: parseFloat(avgSpeed.toFixed(2))
        })).unwrap();
        console.log('Score submitted successfully:', result);
        scoreSubmitted = true;
      } catch (error) {
        console.error('Failed to save score:', error);
      }
    }
    
    dispatch(endGame());
    
    if (scoreSubmitted) {
      console.log('Refreshing leaderboard in 500ms...');
      setTimeout(() => {
        console.log('Fetching top leaders...');
        dispatch(fetchTopLeaders());
      }, 500);
    }
  };

  useEffect(() => {
    if (!playerName) {
      navigate('/');
    }
  }, [playerName, navigate]);

  // Timer effect
  useEffect(() => {
    if (isPlaying && !isPaused) {
      const timer = setInterval(() => {
        dispatch(updateTimer(timeRemaining - 1));
      }, 1000);
      setTimerInterval(timer);

      return () => {
        clearInterval(timer);
      };
    } else if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
  }, [isPlaying, isPaused, timeRemaining, dispatch]);

  // Game end effect
  useEffect(() => {
    if (timeRemaining === 0 && isPlaying) {
      handleGameEnd();
    }
  }, [timeRemaining, isPlaying]);


  useEffect(() => {
    if (isPlaying && !isPaused) {
      const interval = setInterval(spawnMole, 1000 / speed);
      setGameInterval(interval);

      return () => {
        if (interval) clearInterval(interval);
      };
    } else if (gameInterval) {
      clearInterval(gameInterval);
      setGameInterval(null);
    }
  }, [isPlaying, isPaused, spawnMole, speed]);

  useEffect(() => {
    dispatch(setSpeed(1.0 + (level - 1) * 0.2));
  }, [level, dispatch]);

  if (!playerName) {
    return null;
  }

  return (
    <div className={`game-page ${isClicking ? 'clicking' : ''}`}>
      <GameNavbar />

      {isGameEnded && <GameEndScreen />}

      <main className="game-content">
        {!isPlaying && (
          <div className="game-overlay">
            <div className="game-overlay__content">
              <h2>Ready to Play?</h2>
              <p>Get ready to whack some moles, {playerName}!</p>
              <button className="game-overlay__button" onClick={handleGameStart}>
                Start Game
              </button>
            </div>
          </div>
        )}

        {isPaused && isPlaying && (
          <div className="game-overlay">
            <div className="game-overlay__content">
              <h2>Game Paused</h2>
              <p>Click Resume in the navbar to continue</p>
            </div>
          </div>
        )}

        <div
          data-testid="game-board"
          className={`game-board ${!isPlaying || isPaused ? 'game-board--disabled' : ''} ${isClicking ? 'clicking' : ''}`}
        >
          {moles.map((mole) => (
            <div
              key={mole.id}
              data-testid={`game-hole-${mole.id}`}
              className={`game-hole ${mole.isActive ? 'game-hole--active' : ''} ${mole.isHit ? 'game-hole--hit' : ''}`}
              onClick={() => hitMole(mole.id)}
            >
              <div className="game-hole__background">
                <div className="game-hole__rim"></div>
              </div>
              {mole.isActive && (
                <div className={`game-mole ${mole.isHit ? 'game-mole--hit' : ''}`}>
                  <img 
                    src={WAM_Mole}
                    alt="Mole" 
                    className="game-mole__image"
                  />
                </div>
              )}
              {mole.isHit && (
                <div className="game-score-popup">+200</div>
              )}
            </div>
          ))}
        </div>
        
        <div className="game-instructions">
          <p>Click on the moles as they appear!</p>
          <p>Get the highest score possible!</p>
        </div>
      </main>
    </div>
  );
};

export default Game;