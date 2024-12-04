import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken'));
  const navigate = useNavigate();

  // Login function that accepts either username or email
  const adminLogin = async (login, password) => {
    try {
      // Build query parameters
      const params = new URLSearchParams();
      params.append("login", login);  // 'login' will either be username or email
      params.append("password", password);

      const response = await fetch(`http://localhost:8080/auth/login?${params.toString()}`, {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        setAdminToken(data.token);
        localStorage.setItem('adminToken', data.token);
        navigate('/admin'); // Redirect to admin page
      } else {
        alert('Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  // Logout function
  const adminLogout = () => {
    setAdminToken(null);
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const isAdminAuthenticated = !!adminToken;

  return (
    <AdminAuthContext.Provider
      value={{ adminToken, adminLogin, adminLogout, isAdminAuthenticated }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
