import React from 'react';
import { Navigate } from 'react-router-dom';
import { PrivateRouteProps } from '../../../types/auth';

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute; 