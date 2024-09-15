# Spotify Playlist Management

A full-stack application that allows users to manage their Spotify playlists. This project includes a frontend built with React and a backend built with Node.js and Express, utilizing MongoDB as the database. Users can register, log in, search for songs, and create and manage playlists.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Screenshots](#screenshots)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Features
- User authentication (registration, login, and logout).
- Search for songs using the Spotify API.
- Create, edit, and delete custom playlists.
- Add and view songs within playlists.
- Responsive design and user-friendly UI.

## Tech Stack
### Frontend
- React.js
- Material-UI for styling
- Axios for API requests
- React Router for navigation

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- TypeScript for type safety
- Spotify API for song search

### Deployment
- **Frontend**: Deployed on Vercel
- **Backend**: Deployed on Railway with MongoDB Atlas as the database

## Screenshots
*(Include screenshots of the application showing the login page, dashboard, playlist management, etc.)*

## Getting Started
Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites
- Node.js (version 14 or above)
- npm (Node Package Manager)
- A MongoDB Atlas account
- A Spotify Developer account (for API access)

### Installation

#### 1. Clone the repository
```bash
git clone https://github.com/yourusername/spotify-playlist-management.git
cd spotify-playlist-management
```

#### 2. Backend Setup
1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `server` directory and add the environment variables (details in the next section).

4. Build the TypeScript files:
   ```bash
   npm run build
   ```
5. Start the server:
   ```bash
   npm start
   ```

#### 3. Frontend Setup
1. Navigate to the client directory:
   ```bash
   cd ../client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `client` directory and add the environment variables (details in the next section).

4. Start the frontend:
   ```bash
   npm start
   ```

### Environment Variables
#### Backend (.env file in the `server` directory)
```plaintext
PORT=8080
MONGODB_URI=<Your MongoDB Atlas connection string>
JWT_SECRET=<Your JWT secret>
SPOTIFY_CLIENT_ID=<Your Spotify Client ID>
SPOTIFY_CLIENT_SECRET=<Your Spotify Client Secret>
```

#### Frontend (.env file in the `client` directory)
```plaintext
REACT_APP_SPOTIFY_CLIENT_ID=<Your Spotify Client ID>
REACT_APP_SPOTIFY_CLIENT_SECRET=<Your Spotify Client Secret>
REACT_APP_REDIRECT_URI=https://<your-frontend-url>/callback
REACT_APP_AUTH_ENDPOINT=https://accounts.spotify.com/authorize
REACT_APP_RESPONSE_TYPE=token
REACT_APP_BACKEND_URL=https://<your-backend-url>
```

### Deployment
#### 1. Backend (Railway)
1. Push your backend code to a GitHub repository.
2. Go to [Railway](https://railway.app/), create a new project, and connect it to your GitHub repository.
3. Set up environment variables in the Railway dashboard (same as in the `.env` file).
4. Deploy the backend.

#### 2. Frontend (Vercel)
1. Push your frontend code to a GitHub repository.
2. Go to [Vercel](https://vercel.com/), create a new project, and import your GitHub repository.
3. During setup, add the necessary environment variables (same as in the frontend `.env` file).
4. Deploy the frontend.

### Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a pull request.

### License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

This README should give a comprehensive overview of your project, including how to set it up locally, the technologies used, and the deployment process. Feel free to customize the sections to fit your project's specifics.
