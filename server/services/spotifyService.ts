import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const client_id = process.env.SPOTIFY_CLIENT_ID; // Your Spotify Client ID
const client_secret = process.env.SPOTIFY_CLIENT_SECRET; // Your Spotify Client Secret

// Define the type for the Spotify token response
interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

// Define the structure of a track in the search results
interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
  album: { name: string };
  // Add any other properties you may use
}

// Define the structure of the Spotify search response
interface SpotifySearchResponse {
  tracks: {
    items: SpotifyTrack[];
  };
}

// Function to get an access token using client credentials flow
export const getSpotifyAccessToken = async (): Promise<string> => {
  const tokenUrl = 'https://accounts.spotify.com/api/token';
  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization: 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64'),
  };

  try {
    const response = await axios.post<SpotifyTokenResponse>(tokenUrl, params, { headers });
    return response.data.access_token;
  } catch (error) {
    console.error('Error fetching Spotify access token:', error);
    throw new Error('Failed to retrieve Spotify access token');
  }
};

// Function to search tracks using Spotify API
export const searchSpotifyTracks = async (query: string): Promise<SpotifyTrack[]> => {
  const token = await getSpotifyAccessToken(); // Get access token
  const searchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track`;

  const headers = {
    Authorization: `Bearer ${token}`, // Use the access token in the header
  };

  try {
    const response = await axios.get<SpotifySearchResponse>(searchUrl, { headers });
    return response.data.tracks.items; // Return the list of tracks
  } catch (error) {
    console.error('Error searching Spotify tracks:', error);
    throw new Error('Failed to search Spotify tracks');
  }
};
