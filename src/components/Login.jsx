import React, { useState } from 'react';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Email:', email, 'Password:', password);
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Welcome Back</h2>
      <p className="login-subtitle">Please login to your account</p>
      <form onSubmit={handleSubmit} className="login-form">
        <label htmlFor="email">Email Address</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
        />
        <button type="submit" className="login-button">Login</button>
      </form>
      <p className="login-footer">
        Don't have an account? <a href="/register">Sign up</a>
      </p>
    </div>
  );
};

export default Login;
