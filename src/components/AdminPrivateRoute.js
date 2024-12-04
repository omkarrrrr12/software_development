import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../contexts/AdminAuthContext';

const AdminPrivateRoute = ({ children }) => {
  const { isAdminAuthenticated } = useAdminAuth();
  return isAdminAuthenticated ? children : <Navigate to="/admin/login" />;
};

export default AdminPrivateRoute;
