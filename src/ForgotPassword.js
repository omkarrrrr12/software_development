import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/auth/forgot-password', { email });
            alert(response.data);
        } catch (error) {
            alert('Error in sending password reset email');
        }
    };

    return (
        <div>
            <h2>Forgot Password</h2>
            <form onSubmit={handleForgotPassword}>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required />
                <button type="submit">Send Reset Link</button>
            </form>
        </div>
    );
};

export default ForgotPassword;
