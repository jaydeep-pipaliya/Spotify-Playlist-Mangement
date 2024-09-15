import React, { useState } from 'react';
import { Modal, TextField, Button, Box, Typography } from '@mui/material';

interface SimplifiedTrack {
  title: string;
  artist: string;
}

interface Playlist {
  _id: string;
  name: string;
  description: string;
  songs: SimplifiedTrack[]; // Expect simplified track objects with title and artist
}

interface EditPlaylistModalProps {
  open: boolean;
  onClose: () => void;
  playlist: Playlist;
  onEdit: (updatedPlaylist: Playlist) => void;
}

const EditPlaylistModal: React.FC<EditPlaylistModalProps> = ({ open, onClose, playlist, onEdit }) => {
  const [name, setName] = useState(playlist.name);
  const [description, setDescription] = useState(playlist.description);

  // Handle form submission
  const handleEdit = () => {
    const updatedPlaylist: Playlist = {
      ...playlist,
      name,
      description,
    };
    onEdit(updatedPlaylist);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
        <Typography variant="h6" component="h2">
          Edit Playlist
        </Typography>
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button variant="contained" color="primary" onClick={handleEdit}>
          Save Changes
        </Button>
      </Box>
    </Modal>
  );
};

export default EditPlaylistModal;
