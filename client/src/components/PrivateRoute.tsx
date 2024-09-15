import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const authContext = useContext(AuthContext);

  // Check if the user is authenticated
  if (!authContext?.user) {
    // Redirect to login if the user is not authenticated
    return <Navigate to="/login" />;
  }

  // If authenticated, render the protected component
  return children;
};

export default PrivateRoute;
