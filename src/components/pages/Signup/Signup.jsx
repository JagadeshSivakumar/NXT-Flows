import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

function Signup() {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!firstname || !lastname || !email || !password) {
      setError('Please fill in all fields');
      return;
    }
    // Simulate successful login
    console.log('Signup attempt:', { firstname, lastname, email, password });
    
    // Navigate to flows on successful login
    navigate('/Exploreflow');
  };

  return (
    <div className="signup-container">
      {/* Left side - Logo and branding */}
      <div className="branding-section">
        <div className="brand-wrapper">
          {/* Brand text */}
          <div className="brand-text">
            <img src="NXT.png" alt="NXT Logo" />
            <span className="brand-flows">Flows</span>
          </div>
        </div>
      </div>

      {/* Right side - Signup form */}
      <div className="form-section">
        <div className="form-container">
          {/* Header */}
          <div className="form-header">
            <h1 className="form-title">Sign Up</h1>
            <p className="form-subtitle">Create Corporate Account</p>
          </div>
          
          {/* Error message */}
          {error && <div className="error-message">{error}</div>}
          
          {/* Form */}
          <form className="signup-form" onSubmit={handleSubmit}>
            {/* Firstname */}
            <div className="form-group">
              <input
                type="text"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                placeholder="First Name"
                className="form-input"
                required
              />
            </div>

            {/* Lastname */}
            <div className="form-group">
              <input
                type="text"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                placeholder="Last Name"
                className="form-input"
                required
              />
            </div>

            {/* Email */}
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

            {/* Sign up button */}
            <button type="submit" className="signin-button">
              Sign Up
            </button>

            {/* Login link */}
            <div className="signup-container-bottom">
              Already a member?{' '}
              <a href="#" className="signup-link">
                Sign In
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;