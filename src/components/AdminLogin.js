import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation to Forgot/Reset pages
import { useAdminAuth } from '../contexts/AdminAuthContext';
import axios from 'axios';

const AdminLogin = () => {
  const { adminLogin } = useAdminAuth();
  const navigate = useNavigate();

  const [login, setLogin] = useState('');  // Can be either email or username
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminLogin(login, password);  // Call adminLogin with login (email or username)
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };

  const handleForgotPassword = () => {
    // Navigate to Forgot Password page
    navigate('/admin/forgot-password');
  };

  const handleResetPassword = () => {
    // Navigate to Reset Password page (can pass token if available)
    navigate('/admin/reset-password');
  };

  return (
    <div style={styles.container}>
      <h2>Admin Login</h2>
      {error && <p style={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Username or Email"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          Login
        </button>
      </form>

      <div style={styles.additionalLinks}>
        <a onClick={handleForgotPassword} style={styles.linkButton}>
          Forgot Password?
        </a>
        
        
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f5f5f5',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    maxWidth: '300px',
    margin: '10px 0',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ddd',
  },
  button: {
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#3498db',
    color: '#fff',
    cursor: 'pointer',
  },
  additionalLinks: {
    marginTop: '20px',
    textAlign: 'center',
  },
  linkButton: {
    padding: '8px 16px',
    borderRadius: '5px',
    border: 'none',
    color: 'blue',
    cursor: 'pointer',
    margin: '5px',
    textDecoration: 'underline',
  },
  error: {
    color: 'red',
    fontSize: '14px',
  },
};

export default AdminLogin;
