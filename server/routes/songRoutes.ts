// server/routes/songRoutes.ts
import express from 'express';
import { searchSpotifyTracks } from '../services/spotifyService';

const router = express.Router();

router.get('/search', async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  try {
    const tracks = await searchSpotifyTracks(query as string);
    res.json(tracks);
  } catch (error) {
    res.status(500).json({ error: 'Error searching for tracks' });
  }
});

export default router;
