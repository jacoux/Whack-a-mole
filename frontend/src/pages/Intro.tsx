import React from 'react';
import GameIntro from '../components/GameIntro/GameIntro';
import './Intro.scss';

const Intro: React.FC = () => {
  return (
    <div className="intro-page">
      <GameIntro />
    </div>
  );
};

export default Intro;