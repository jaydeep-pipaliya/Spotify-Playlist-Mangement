import mongoose, { Document, Schema } from 'mongoose';

interface ISong {
  title: string;
  artist: string;
}

export interface IPlaylist extends Document {
  name: string;
  description: string;
  songs: ISong[]; // Update this to use the ISong interface
  user: mongoose.Schema.Types.ObjectId;
}

const SongSchema = new Schema<ISong>({
  title: { type: String, required: true },
  artist: { type: String, required: true },
});

const PlaylistSchema = new Schema<IPlaylist>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  songs: [SongSchema], // Use the SongSchema for songs
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

export default mongoose.model<IPlaylist>('Playlist', PlaylistSchema);
