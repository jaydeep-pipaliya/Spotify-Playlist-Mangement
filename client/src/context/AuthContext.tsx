import React, { createContext, useState, ReactNode, useEffect } from 'react';
import axios from 'axios';

// Define the User type
interface User {
  id: string;
  username: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ status: number }>; // Updated return type
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const userId = localStorage.getItem('userId');

    if (token && username && userId) {
      setUser({ id: userId, username: username, token: token });
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ status: number }> => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/login`, { email, password });
      const { token, user } = response.data;

      // Store token and user details in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('username', user.username);
      localStorage.setItem('userId', user.id);

      // Set user state
      setUser({ id: user.id, username: user.username, token });

      // Return a success status to handle in handleSubmit
      return { status: 200 };
    } catch (error: any) {
      // Throw the error so that it can be caught in handleSubmit
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
