import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../store/hooks';
import { setPlayerName } from '../../store/slices/gameSlice';
import './GameIntro.scss';

const GameIntro: React.FC = () => {
  const [playerNameInput, setPlayerNameInput] = useState('');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleStartGame = () => {
    if (playerNameInput.trim()) {
      dispatch(setPlayerName(playerNameInput.trim()));
      navigate('/game');
    }
  };

  const handleViewLeaderboard = () => {
    navigate('/leaderboard');
  };

  return (
    <div className="game-intro">
      <div className="game-intro__container">
        <h1 className="game-intro__title">🥒 Whack-a-Mole 🥒</h1>
        <p className="game-intro__subtitle">
          Test your reflexes and speed in this classic arcade game!
        </p>
        
        <div className="game-intro__instructions">
          <h3>How to Play:</h3>
          <ul>
            <li>You have exactly 2 minutes to score as many points as possible</li>
            <li>Moles will pop up randomly from holes</li>
            <li>Click on them quickly to score 200 points each</li>
            <li>Game speed increases every 2000 points (max 3x speed - HARD mode)</li>
            <li>Your score will be saved to the leaderboard automatically!</li>
          </ul>
        </div>

        <div className="game-intro__form">
          <label htmlFor="playerName" className="game-intro__label">
            Enter Your Name:
          </label>
          <input
            id="playerName"
            type="text"
            className="game-intro__input"
            value={playerNameInput}
            onChange={(e) => setPlayerNameInput(e.target.value)}
            placeholder="Player Name"
            maxLength={20}
            onKeyPress={(e) => e.key === 'Enter' && handleStartGame()}
          />
        </div>

        <div className="game-intro__buttons">
          <button
            className="game-intro__button game-intro__button--primary"
            onClick={handleStartGame}
            disabled={!playerNameInput.trim()}
          >
            Start Game
          </button>
          <button
            className="game-intro__button game-intro__button--secondary"
            onClick={handleViewLeaderboard}
          >
            View Leaderboard
          </button>
        </div>

        <div className="game-intro__stats">
          <div className="game-intro__stat">
            <span className="game-intro__stat-label">Game Duration:</span>
            <span className="game-intro__stat-value">2:00</span>
          </div>
          <div className="game-intro__stat">
            <span className="game-intro__stat-label">Max Speed:</span>
            <span className="game-intro__stat-value">3.0x (HARD)</span>
          </div>
          <div className="game-intro__stat">
            <span className="game-intro__stat-label">Points per Hit:</span>
            <span className="game-intro__stat-value">200</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameIntro;