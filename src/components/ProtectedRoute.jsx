import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  // Check if user is authenticated
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Parse user data to check role
  try {
    const userData = JSON.parse(user);
    
    // Check if user role is allowed (if specific roles are required)
    if (allowedRoles.length > 0 && !allowedRoles.includes(userData.role)) {
      return <Navigate to="/login" replace />;
    }
    
    return children;
  } catch (error) {
    // If user data is corrupted, redirect to login
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
