import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { fetchTopLeaders } from '../../store/slices/leaderboardSlice';
import { resetGame } from '../../store/slices/gameSlice';
import { LeaderboardEntry } from '../../types/leaderboard';
import './GameEndScreen.scss';

const GameEndScreen: React.FC = () => {
  const { currentScore, playerName } = useAppSelector(state => state.game);
  const { topEntries: leaderboard, loading } = useAppSelector(state => state.leaderboard);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [playerRank, setPlayerRank] = useState<number | null>(null);
  const [isNewHighScore, setIsNewHighScore] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(fetchTopLeaders());
    }, 200);
    
    return () => clearTimeout(timer);
  }, [dispatch]);

  useEffect(() => {
    console.log('GameEndScreen: Leaderboard updated', { 
      leaderboardLength: leaderboard.length, 
      currentScore, 
      playerName 
    });
    
    if (leaderboard.length > 0 && currentScore > 0) {
      const playerEntry = leaderboard.find(entry => 
        entry.playerName === playerName && entry.score === currentScore
      );
      
      console.log('GameEndScreen: Player entry found', playerEntry);
      
      if (playerEntry) {
        const rank = leaderboard.findIndex(entry => entry._id === playerEntry._id) + 1;
        console.log('GameEndScreen: Player rank', rank);
        setPlayerRank(rank);
        setIsNewHighScore(rank === 1);
      } else {
        const betterScores = leaderboard.filter(entry => entry.score > currentScore).length;
        const calculatedRank = betterScores + 1;
        console.log('GameEndScreen: Calculated rank', calculatedRank);
        setPlayerRank(calculatedRank);
      }
    }
  }, [leaderboard, currentScore, playerName]);

  const handlePlayAgain = () => {
    dispatch(resetGame());
    navigate('/game');
  };

  const handleMainMenu = () => {
    dispatch(resetGame());
    navigate('/');
  };

  const handleViewFullLeaderboard = () => {
    navigate('/leaderboard');
  };

  const getScoreMessage = () => {
    if (isNewHighScore) {
      return "🎉 NEW HIGH SCORE! 🎉";
    }
    if (playerRank && playerRank <= 3) {
      return `🏆 Excellent! You're ranked #${playerRank}!`;
    }
    if (playerRank && playerRank <= 10) {
      return `🎯 Great job! You're in the top 10!`;
    }
    return "Good game! Keep practicing to climb the leaderboard!";
  };

  if (loading) {
    return (
      <div className="game-end-screen">
        <div className="game-end-screen__container">
          <h2>Game Over!</h2>
          <p>Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="game-end-screen">
      <div className="game-end-screen__container">
        <div className="game-end-screen__header">
          <h1 className="game-end-screen__title">Time's Up!</h1>
          <p className="game-end-screen__subtitle">{getScoreMessage()}</p>
        </div>

        <div className="game-end-screen__score">
          <h2 className="game-end-screen__final-score">
            Final Score: {currentScore.toLocaleString()}
          </h2>
          {playerRank && (
            <p className="game-end-screen__rank">
              Your Rank: #{playerRank}
            </p>
          )}
        </div>

        <div className="game-end-screen__leaderboard">
          <h3>🏆 Top 10 Leaderboard</h3>
          <div className="leaderboard-preview">
            {leaderboard.slice(0, 10).map((entry, index) => (
              <div 
                key={entry._id} 
                className={`leaderboard-preview__entry ${
                  entry.playerName === playerName && entry.score === currentScore 
                    ? 'leaderboard-preview__entry--current-player' 
                    : ''
                }`}
              >
                <span className="leaderboard-preview__rank">#{index + 1}</span>
                <span className="leaderboard-preview__name">{entry.playerName}</span>
                <span className="leaderboard-preview__score">
                  {entry.score.toLocaleString()}
                </span>
                <span className="leaderboard-preview__speed">
                  {entry.speed.toFixed(1)}x
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="game-end-screen__actions">
          <button 
            className="game-end-screen__button game-end-screen__button--primary"
            onClick={handlePlayAgain}
          >
            🎮 Play Again
          </button>
          <button 
            className="game-end-screen__button game-end-screen__button--secondary"
            onClick={handleViewFullLeaderboard}
          >
            📊 Full Leaderboard
          </button>
          <button 
            className="game-end-screen__button game-end-screen__button--outline"
            onClick={handleMainMenu}
          >
            🏠 Main Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameEndScreen;