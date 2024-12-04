import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLogin from '../components/AdminLogin';
import ForgotPassword from '../components/AdminForgotPassword';

import AdminPanel from './AdminPanel';
import AdminPrivateRoute from '../components/AdminPrivateRoute';
import { AdminAuthProvider } from '../contexts/AdminAuthContext';

const AdminApp = () => {
  return (
    <Router>
      <AdminAuthProvider>
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/forgot-password" element={<ForgotPassword />} />

          <Route
            path="/admin/*"
            element={
              <AdminPrivateRoute>
                <AdminPanel />
              </AdminPrivateRoute>
            }
          />
        </Routes>
      </AdminAuthProvider>
    </Router>
  );
};

export default AdminApp;
