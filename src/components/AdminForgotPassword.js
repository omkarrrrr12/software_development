import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [token, setToken] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('forgot'); // Track the current step (forgot or reset)

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`http://localhost:8080/auth/forgot-password?email=${encodeURIComponent(email)}`);
      setMessage(response.data); // Success or error message
      setStep('reset'); // Show the reset form after sending the link
    } catch (error) {
      setMessage('Error: Unable to send reset link');
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:8080/auth/reset-password?token=${token}&newPassword=${newPassword}`
      );
      setMessage(response.data); // Success or error message from the backend
    } catch (error) {
      setMessage('Error: Unable to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {step === 'forgot' ? (
        <>
          <h2>Forgot Password</h2>
          <form onSubmit={handleForgotSubmit}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        </>
      ) : (
        <>
          <h2>Reset Password</h2>
          <form onSubmit={handleResetSubmit}>
            <div>
              <label htmlFor="token">Reset Token:</label>
              <input
                id="token"
                type="text"
                placeholder="Enter the reset token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="newPassword">New Password:</label>
              <input
                id="newPassword"
                type="password"
                placeholder="Enter your new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        </>
      )}
      {message && <p>{message}</p>}
    </div>
  );
};

export default ForgotPassword;
