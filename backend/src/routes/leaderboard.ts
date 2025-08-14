import express, { Request, Response } from 'express';
import { LeaderboardService } from '../services/leaderboardService';

const router = express.Router();
const leaderboardService = new LeaderboardService();

router.get('/', async (req: Request, res: Response) => {
  try {
    const leaderboard = await leaderboardService.getAllLeaderboard();
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

router.get('/top10', async (req: Request, res: Response) => {
  try {
    const topLeaders = await leaderboardService.getTopLeaders(10);
    res.json(topLeaders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch top leaders' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const entry = await leaderboardService.getLeaderboardEntry(req.params.id);
    if (!entry) {
      return res.status(404).json({ error: 'Leaderboard entry not found' });
    }
    res.json(entry);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leaderboard entry' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { playerName, score, speed } = req.body;
    
    if (!playerName || score === undefined || speed === undefined) {
      return res.status(400).json({ error: 'playerName, score, and speed are required' });
    }

    const entry = await leaderboardService.createLeaderboardEntry(playerName, score, speed);
    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create leaderboard entry' });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { playerName, score, speed } = req.body;
    
    if (!playerName || score === undefined || speed === undefined) {
      return res.status(400).json({ error: 'playerName, score, and speed are required' });
    }

    const updatedEntry = await leaderboardService.updateLeaderboardEntry(
      req.params.id,
      playerName,
      score,
      speed
    );

    if (!updatedEntry) {
      return res.status(404).json({ error: 'Leaderboard entry not found' });
    }

    res.json(updatedEntry);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update leaderboard entry' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const deletedEntry = await leaderboardService.deleteLeaderboardEntry(req.params.id);
    
    if (!deletedEntry) {
      return res.status(404).json({ error: 'Leaderboard entry not found' });
    }

    res.json({ message: 'Leaderboard entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete leaderboard entry' });
  }
});

export default router;