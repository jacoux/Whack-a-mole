import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { 
  fetchTopLeaders, 
  createLeaderboardEntry as createEntry, 
  deleteLeaderboardEntry as deleteEntry,
  clearError 
} from '../../store/slices/leaderboardSlice';
import { CreateLeaderboardEntry } from '../../types/leaderboard';
import './Leaderboard.scss';

const Leaderboard: React.FC = () => {
  const leaderboardState = useAppSelector(state => state.leaderboard);
  const { topEntries: leaderboard, loading, error } = leaderboardState;
  
  const safeLeaderboard = Array.isArray(leaderboard) ? leaderboard : [];
  const dispatch = useAppDispatch();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<CreateLeaderboardEntry>({
    playerName: '',
    score: 0,
    speed: 0
  });

  useEffect(() => {
    dispatch(fetchTopLeaders());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(createEntry(formData)).unwrap();
      setFormData({ playerName: '', score: 0, speed: 0 });
      setShowForm(false);
    } catch (err) {
      console.error('Error creating entry:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        await dispatch(deleteEntry(id)).unwrap();
      } catch (err) {
        console.error('Error deleting entry:', err);
      }
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="leaderboard-container">
      <h1>Whack-a-Mole Leaderboard</h1>
      
      {error && <div className="error">{error}</div>}

      {showForm && (
        <form className="entry-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Player Name:</label>
            <input
              type="text"
              value={formData.playerName}
              onChange={(e) => setFormData({ ...formData, playerName: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Score:</label>
            <input
              type="number"
              value={formData.score}
              onChange={(e) => setFormData({ ...formData, score: parseInt(e.target.value) || 0 })}
              required
              min="0"
            />
          </div>
          <div className="form-group">
            <label>Speed:</label>
            <input
              type="number"
              value={formData.speed}
              onChange={(e) => setFormData({ ...formData, speed: parseFloat(e.target.value) || 0 })}
              required
              min="0"
              step="0.1"
            />
          </div>
          <button type="submit" className="submit-btn">Add Entry</button>
        </form>
      )}

      <div className="leaderboard-table">
        <div className="table-header">
          <div className="rank">Rank</div>
          <div className="player-name">Player Name</div>
          <div className="score">Score</div>
          <div className="speed">Speed</div>
          <div className="date">Date</div>
          <div className="actions">Actions</div>
        </div>
        
        {safeLeaderboard.map((entry, index) => (
          <div key={entry._id} className="table-row">
            <div className="rank">#{index + 1}</div>
            <div className="player-name">{entry.playerName}</div>
            <div className="score">{entry.score}</div>
            <div className="speed">{entry.speed.toFixed(1)}</div>
            <div className="date">{new Date(entry.createdAt).toLocaleDateString()}</div>
            <div className="actions">
              <button 
                className="delete-btn"
                onClick={() => handleDelete(entry._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {safeLeaderboard.length === 0 && !loading && (
        <div className="no-entries">No entries found. Be the first to add one!</div>
      )}
    </div>
  );
};

export default Leaderboard;