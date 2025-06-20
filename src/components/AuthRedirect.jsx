import React from 'react';
import { Navigate } from 'react-router-dom';

const AuthRedirect = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  // If user is already authenticated, redirect to appropriate dashboard
  if (token && user) {
    try {
      const userData = JSON.parse(user);
        switch (userData.role) {
        case 'admin':
          return <Navigate to="/admin" replace />;
        case 'kasir':
          return <Navigate to="/kasir" replace />;
        case 'gudang':
          return <Navigate to="/gudang" replace />;
        default:
          // For users with unknown roles, clear their data and redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          return children;
      }
    } catch (error) {
      // If user data is corrupted, clear storage and show login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }
  
  return children;
};

export default AuthRedirect;
