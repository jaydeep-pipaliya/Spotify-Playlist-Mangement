import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Playlist, { IPlaylist } from '../models/Playlist';
const { body, validationResult } = require('express-validator');

interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

const router = express.Router();

// Middleware for checking JWT
const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = verified as { id: string };
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

// Get all playlists for a user
router.get('/', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const playlists = await Playlist.find({ user: userId });
    res.json(playlists);
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'An unknown error occurred' });
  }
});

// Create a new playlist
router.post(
  '/',
  authMiddleware,
  [
    body('name').not().isEmpty().withMessage('Name is required'),
    body('description').optional().isString(),
    body('songs').optional().isArray().custom((songs: any) => {
      for (const song of songs) {
        if (!song.title || !song.artist) {
          throw new Error('Each song must have a title and an artist');
        }
      }
      return true;
    })
  ],
  async (req: AuthenticatedRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, description, songs } = req.body;
      const userId = req.user?.id;
      const newPlaylist: IPlaylist = new Playlist({ 
        name, 
        description, 
        songs: songs?.map((song: { title: string; artist: string }) => ({
          title: song.title,
          artist: song.artist
        })), // Explicitly map each song
        user: userId 
      });
      await newPlaylist.save();
      res.status(201).json(newPlaylist);
    } catch (err: unknown) {
      res.status(500).json({ error: err instanceof Error ? err.message : 'An unknown error occurred' });
    }
  }
);

// Update a playlist
router.put(
  '/:id',
  authMiddleware,
  [
    body('name').not().isEmpty().withMessage('Name is required'),
    body('description').optional().isString(),
    body('songs').optional().isArray().custom((songs: any) => {
      for (const song of songs) {
        if (!song.title || !song.artist) {
          throw new Error('Each song must have a title and an artist');
        }
      }
      return true;
    })
  ],
  async (req: AuthenticatedRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, description, songs } = req.body;
      const playlist = await Playlist.findById(req.params.id);

      // Check if the playlist exists and belongs to the user
      if (!playlist) {
        return res.status(404).json({ message: 'Playlist not found' });
      }
      if (playlist.user.toString() !== req.user?.id) {
        return res.status(403).json({ message: 'User not authorized' });
      }

      // Update playlist properties
      playlist.name = name;
      playlist.description = description;
      playlist.songs = songs?.map((song: { title: string; artist: string }) => ({
        title: song.title,
        artist: song.artist
      })); // Explicitly map each song

      const updatedPlaylist = await playlist.save();
      res.status(200).json(updatedPlaylist);
    } catch (err: unknown) {
      res.status(500).json({ error: err instanceof Error ? err.message : 'An unknown error occurred' });
    }
  }
);

// Delete a playlist
router.delete('/:id', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const playlist = await Playlist.findById(req.params.id);

    // Check if the playlist exists and belongs to the user
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }
    if (playlist.user.toString() !== req.user?.id) {
      return res.status(403).json({ message: 'User not authorized' });
    }

    await Playlist.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Playlist deleted' });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'An unknown error occurred' });
  }
});

export default router;
