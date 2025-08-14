import React from 'react';
import { useNavigate } from 'react-router-dom';
import Leaderboard from '../components/Leaderboard/Leaderboard';
import './Leaderboard.scss';

const LeaderboardPage: React.FC = () => {
  const navigate = useNavigate();

  const handleBackToMenu = () => {
    navigate('/');
  };

  return (
    <div className="leaderboard-page">
      <div className="leaderboard-page__header">
        <button 
          className="leaderboard-page__back-btn"
          onClick={handleBackToMenu}
        >
          ← Back to The game
        </button>
        <h1 className="leaderboard-page__title">🏆 Hall of Fame 🏆</h1>
      </div>
      
      <div className="leaderboard-page__content">
        <Leaderboard />
      </div>
    </div>
  );
};

export default LeaderboardPage;