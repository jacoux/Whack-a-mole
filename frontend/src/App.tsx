import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import Intro from './pages/Intro';
import Game from './pages/Game';
import LeaderboardPage from './pages/Leaderboard';
import WAM_Hammer from './assets/WAM_Hammer.png';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Intro />} />
            <Route path="/game" element={<Game />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
