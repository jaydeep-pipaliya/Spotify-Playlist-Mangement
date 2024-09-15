import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import {
  Container, Typography, Button, TextField, Card, CardContent, CardActions, MenuItem, Grid, Paper, IconButton, Box,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditPlaylistModal from '../components/EditPlaylistModal';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import LogoutIcon from '@mui/icons-material/Logout';


interface Track {
  id: string;
  name: string;
  artists: { name: string }[];
}

interface SimplifiedTrack {
  title: string;
  artist: string;
}

interface Playlist {
  _id: string;
  name: string;
  description: string;
  songs: SimplifiedTrack[];
}

interface SimplifiedPlaylist {
  _id: string;
  name: string;
  description: string;
  songs: SimplifiedTrack[];
}

const Dashboard: React.FC = () => {
  const authContext = useContext(AuthContext);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [newPlaylist, setNewPlaylist] = useState({ name: '', description: '' });
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const [editPlaylist, setEditPlaylist] = useState<SimplifiedPlaylist | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [viewingPlaylistId, setViewingPlaylistId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Track[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPlaylists = async () => {
      if (authContext?.user?.token) {
        setLoading(true);
        try {
          const response = await axios.get<Playlist[]>(`${process.env.REACT_APP_BACKEND_URL}/api/playlists`, {
            headers: { Authorization: `Bearer ${authContext.user.token}` },
          });
          setPlaylists(response.data);
        } catch (error) {
          setErrorMessage('Error fetching playlists. Please try again.');
        } finally {
          setLoading(false);
        }
      }
    };
    fetchPlaylists();
  }, [authContext]);

  const handleCreatePlaylist = async () => {
    if (authContext?.user?.token) {
      try {
        const response = await axios.post<Playlist>(
          `${process.env.REACT_APP_BACKEND_URL}/api/playlists`,
          newPlaylist,
          { headers: { Authorization: `Bearer ${authContext.user.token}` } }
        );
        setPlaylists([...playlists, response.data]);
        setNewPlaylist({ name: '', description: '' });
      } catch (error) {
        setErrorMessage('Error creating playlist. Please try again.');
      }
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/songs/search`, {
        params: { query: searchQuery },
      });
      
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching for songs:', error);
      alert('Failed to search for songs.');
    }
  };

  const handleDeletePlaylist = async (id: string) => {
    if (authContext?.user?.token) {
      try {
        await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/playlists/${id}`, {
          headers: { Authorization: `Bearer ${authContext.user.token}` },
        });
        setPlaylists(playlists.filter((playlist) => playlist._id !== id));
      } catch (error) {
        setErrorMessage('Error deleting playlist. Please try again.');
      }
    }
  };

  const handleOpenEditModal = (playlist: Playlist) => {
    const simplifiedPlaylist: SimplifiedPlaylist = {
      _id: playlist._id,
      name: playlist.name,
      description: playlist.description,
      songs: playlist.songs,
    };
    setEditPlaylist(simplifiedPlaylist);
    setIsEditModalOpen(true);
  };

  const handleEditPlaylist = async (updatedPlaylist: SimplifiedPlaylist) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/playlists/${updatedPlaylist._id}`,
        updatedPlaylist,
        {
          headers: { Authorization: `Bearer ${authContext?.user?.token}` },
        }
      );
      const updatedFullPlaylist = response.data;
      setPlaylists((prevPlaylists) =>
        prevPlaylists.map((playlist) =>
          playlist._id === updatedFullPlaylist._id ? updatedFullPlaylist : playlist
        )
      );
      setIsEditModalOpen(false);
    } catch (error) {
      alert('Failed to update playlist. Please try again.');
    }
  };

  const handleAddSongToPlaylist = (track: Track) => {
    if (selectedPlaylistId) {
      const selectedPlaylist = playlists.find((playlist) => playlist._id === selectedPlaylistId);
      if (selectedPlaylist) {
        const updatedPlaylist: SimplifiedPlaylist = {
          _id: selectedPlaylist._id,
          name: selectedPlaylist.name,
          description: selectedPlaylist.description,
          songs: [
            ...selectedPlaylist.songs,
            { title: track.name, artist: track.artists[0]?.name || 'Unknown Artist' },
          ],
        };
        handleEditPlaylist(updatedPlaylist);
      }
    }
  };

  const handleViewSongs = (playlistId: string) => {
    if (viewingPlaylistId === playlistId) {
      setViewingPlaylistId(null);
    } else {
      setViewingPlaylistId(playlistId);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ p: 0 }}>
       <AppBar position="static" sx={{ mb: 3 }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6">Dashboard</Typography>
        <Button
          color="inherit"
          startIcon={<LogoutIcon />}
          onClick={() => {
            if (authContext) {
              authContext.logout();
            }
          }}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>

      <Grid container spacing={2}>
        {/* Left Section: Create New Playlist */}
        <Grid item xs={12} md={3}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6">Create New Playlist</Typography>
            <TextField
              label="Name"
              value={newPlaylist.name}
              onChange={(e) => setNewPlaylist({ ...newPlaylist, name: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Description"
              value={newPlaylist.description}
              onChange={(e) => setNewPlaylist({ ...newPlaylist, description: e.target.value })}
              fullWidth
              margin="normal"
            />
            <Button variant="contained" color="primary" onClick={handleCreatePlaylist} fullWidth>
              Create Playlist
            </Button>
          </Paper>
        </Grid>

        {/* Middle Section: Search Songs */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6">Search Songs</Typography>
            <TextField
              label="Search for songs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              fullWidth
              margin="normal"
            />
            <Button variant="contained" color="primary" onClick={handleSearch}>
              Search
            </Button>

            {/* Playlist Selection Dropdown */}
            <TextField
              select
              label="Select Playlist"
              value={selectedPlaylistId || ''}
              onChange={(e) => setSelectedPlaylistId(e.target.value)}
              fullWidth
              margin="normal"
            >
              <MenuItem value="" disabled>Select a playlist</MenuItem>
              {playlists.map((playlist) => (
                <MenuItem key={playlist._id} value={playlist._id}>
                  {playlist.name}
                </MenuItem>
              ))}
            </TextField>

            {/* Search Results */}
            <Box>
            {searchResults.map((track) => (
              <Paper key={track.id} elevation={3} sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6">{track.name}</Typography>
                <Typography>{track.artists.map((artist) => artist.name).join(', ')}</Typography>
                <Box mt={1}>
                  <Button
                    variant="contained"
                    onClick={() => handleAddSongToPlaylist(track)}
                    disabled={!selectedPlaylistId}
                    startIcon={<AddCircleOutlineIcon />}
                  >
                    Add to Playlist
                  </Button>
                </Box>
              </Paper>
            ))}
          </Box>

          </Paper>
        </Grid>

        {/* Right Section: Your Playlists */}
        <Grid item xs={12} md={3}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6">Your Playlists</Typography>
            {playlists.map((playlist) => (
              <Card key={playlist._id} sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6">{playlist.name}</Typography>
                  <Typography>{playlist.description}</Typography>
                  {viewingPlaylistId === playlist._id && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle1">Songs:</Typography>
                      {playlist.songs.map((song, index) => (
                        <Typography key={index}>
                          {song.title} - {song.artist}
                        </Typography>
                      ))}
                    </Box>
                  )}
                </CardContent>
                <CardActions>
                  <IconButton color="primary" onClick={() => handleViewSongs(playlist._id)}>
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton color="primary" onClick={() => handleOpenEditModal(playlist)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => handleDeletePlaylist(playlist._id)}>
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            ))}
          </Paper>
        </Grid>
      </Grid>

      {/* Edit Playlist Modal */}
      {editPlaylist && (
        <EditPlaylistModal
          open={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          playlist={editPlaylist}
          onEdit={handleEditPlaylist}
        />
      )}

      {/* Error Message */}
      {errorMessage && (
        <Typography color="error" style={{ marginTop: '20px' }}>
          {errorMessage}
        </Typography>
      )}
    </Container>
  );
};

export default Dashboard;
