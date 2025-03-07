// src/Components/RoleProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthContext } from '../../Contexts/AuthContext';

const RoleProtectedRoute = ({ allowedRoles }) => {
  const { user, isAuthenticationFetched } = useAuthContext();
  const location = useLocation();

  if (!isAuthenticationFetched) {
    return <div>Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/home" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default RoleProtectedRoute;