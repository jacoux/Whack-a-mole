import React from 'react';
import { useAppSelector } from '../../store/hooks';
import './GameNavbarLivescore.scss';

const GameNavbarLivescore: React.FC = () => {
  const { level } = useAppSelector(state => state.game);

  return (
    <div className="game-livescore">
      <div className="game-livescore__section">
        <span className="game-livescore__label">Level:</span>
        <span className="game-livescore__level">{level}</span>
      </div>
    </div>
  );
};

export default GameNavbarLivescore;