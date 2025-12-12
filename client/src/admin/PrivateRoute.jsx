import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';

export default function PrivateRoute({ children }) {
  const auth = useAuth();
  if (!auth) return null;
  if (!auth.token) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}
