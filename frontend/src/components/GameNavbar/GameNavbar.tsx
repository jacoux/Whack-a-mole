import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { pauseGame, resumeGame, stopGame } from '../../store/slices/gameSlice';
import GameNavbarLivescore from '../GameNavbarLivescore/GameNavbarLivescore';
import GameSpeed from '../GameSpeed/GameSpeed';
import './GameNavbar.scss';

const GameNavbar: React.FC = () => {
  const { playerName, isPlaying, isPaused, currentScore, timeRemaining } = useAppSelector(state => state.game);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handlePauseResume = () => {
    if (isPaused) {
      dispatch(resumeGame());
    } else {
      dispatch(pauseGame());
    }
  };

  const handleQuitGame = () => {
    if (window.confirm('Are you sure you want to quit the game?')) {
      dispatch(stopGame());
      navigate('/');
    }
  };

  const handleViewLeaderboard = () => {
    dispatch(pauseGame());
    navigate('/leaderboard');
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <nav className="game-navbar">
      <div className="game-navbar__container">
        <div className="game-navbar__left">
          <h2 className="game-navbar__title">🥒 Whack-a-Mole</h2>
          <div className="game-navbar__player">
            <span className="game-navbar__player-label">Player:</span>
            <span className="game-navbar__player-name">{playerName}</span>
          </div>
        </div>

        <div className="game-navbar__center">
          <div className="game-navbar__timer">
            <span className="game-navbar__timer-label">Time:</span>
            <span className={`game-navbar__timer-value ${timeRemaining <= 30 ? 'game-navbar__timer-value--warning' : ''}`}>
              {formatTime(timeRemaining)}
            </span>
          </div>
          <GameNavbarLivescore />
          <GameSpeed />
        </div>

        <div className="game-navbar__right">
          <div className="game-navbar__score">
            <span className="game-navbar__score-label">Score:</span>
            <span className="game-navbar__score-value">{currentScore.toLocaleString()}</span>
          </div>
          
          <div className="game-navbar__actions">
            {isPlaying && (
              <button
                className={`game-navbar__button ${isPaused ? 'game-navbar__button--resume' : 'game-navbar__button--pause'}`}
                onClick={handlePauseResume}
              >
                {isPaused ? '▶️ Resume' : '⏸️ Pause'}
              </button>
            )}
            
            <button
              className="game-navbar__button game-navbar__button--secondary"
              onClick={handleViewLeaderboard}
            >
              📊 Leaderboard
            </button>
            
            <button
              className="game-navbar__button game-navbar__button--danger"
              onClick={handleQuitGame}
            >
              ❌ Quit
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default GameNavbar;