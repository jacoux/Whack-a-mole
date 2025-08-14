import React from 'react';
import { useAppSelector } from '../../store/hooks';
import './GameSpeed.scss';

const GameSpeed: React.FC = () => {
  const { speed } = useAppSelector(state => state.game);

  const getSpeedColor = (currentSpeed: number) => {
    if (currentSpeed <= 1.5) return 'game-speed__indicator--slow';
    if (currentSpeed < 2.5) return 'game-speed__indicator--medium';
    return 'game-speed__indicator--hard';
  };

  const getSpeedLabel = (currentSpeed: number) => {
    if (currentSpeed <= 1.5) return 'SLOW';
    if (currentSpeed < 2.5) return 'MEDIUM';
    return 'HARD';
  };

  const renderSpeedBars = () => {
    const maxBars = 5;
    const filledBars = Math.ceil((speed / 3.0) * maxBars);
    
    return Array.from({ length: maxBars }, (_, index) => (
      <div
        key={index}
        className={`game-speed__bar ${
          index < filledBars ? 'game-speed__bar--filled' : 'game-speed__bar--empty'
        }`}
      />
    ));
  };

  return (
    <div className="game-speed">
      <span className="game-speed__label">Speed:</span>
      
      <div className="game-speed__display">
        <div className="game-speed__bars">
          {renderSpeedBars()}
        </div>
        
        <div className={`game-speed__indicator ${getSpeedColor(speed)}`}>
          <span className="game-speed__value">{speed.toFixed(1)}x</span>
          <span className="game-speed__status">{getSpeedLabel(speed)}</span>
        </div>
      </div>
    </div>
  );
};

export default GameSpeed;