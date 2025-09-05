import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import'./Login.css';
function Login() {
   const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    // Simulate successful login
    console.log('Login attempt:', { email, password });
    
    // Navigate to flows on successful login
    navigate('/Exploreflow');
  };

  return (
    <div className="login-container">
      {/* Left side - Logo and branding */}
      <div className="branding-section">
        <div className="brand-wrapper">
          {/* Logo - Blue geometric shapes */}
          

          {/* Brand text */}
          <div className="brand-text">
            <img src="NXT.png" alt="NXT Logo" />
            <span className="brand-flows">Flows</span>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="form-section">
        <div className="form-container">
          {/* Header */}
          <div className="form-header">
            <h1 className="form-title">Sign In</h1>
            <p className="form-subtitle">Corporate Login</p>
          </div>

          {/* Form */}
          <form className="login-form" onSubmit={handleSubmit}>
            {/* Email field */}
            <div className="form-group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="form-input"
                required
              />
            </div>

            {/* Password field */}
            <div className="form-group">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="form-input"
                required
              />
            </div>

            {/* Forgot password link */}
            <div className="forgot-password-container">
              <a href="#" className="forgot-password-link">
                Forgot Password?
              </a>
            </div>

            {/* Sign in button */}
            <button type="submit" className="signin-button">
              Sign In
            </button>

            {/* Sign up link */}
            <div className="signup-container">
              Not a member yet?{' '}
              <Link to="/signup" className="signup-link">
                Sign Up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
