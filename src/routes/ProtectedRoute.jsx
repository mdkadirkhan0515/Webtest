import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getCurrentUser, isAuthenticated } from '@/services/authService';

/**
 * ProtectedRoute - Guards admin routes
 * - If authenticated: renders <Outlet /> (child routes)
 * - If not: redirects to /admin/login
 */
const ProtectedRoute = ({ children }) => {
  const isAuth = isAuthenticated();
  const currentUser = getCurrentUser();
  const isValid = isAuth && currentUser?.token;

  if (!isValid) {
    return <Navigate to="/admin/login" replace />;
  }

  // Supports both: <ProtectedRoute><Dashboard/></ProtectedRoute> and <Route element={<ProtectedRoute/>}>
  return children? children : <Outlet />;
};

export default ProtectedRoute;
