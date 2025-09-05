import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Signup.css';



function Signup() {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tenantSlug, setTenantSlug] = useState(''); // ✅ new field
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const API_BASE_URL = "http://192.168.1.137:4000";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!firstname || !lastname || !email || !password || !tenantSlug) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          name: `${firstname} ${lastname}`,  // ✅ combine names
          tenantSlug                   // ✅ match API schema
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Signup failed");
      }

      const data = await response.json();
      console.log("✅ Signup success:", data);

      navigate("/Exploreflow");
    } catch (err) {
      console.error("❌ Signup error:", err.message);
      setError(err.message);
    }
  };

  return (
    <div className="signup-container">
      {/* Branding */}
      <div className="branding-section">
        <div className="brand-wrapper">
          <div className="brand-text">
            <img src="NXT.png" alt="NXT Logo" />
            <span className="brand-flows">Flows</span>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="form-section">
        <div className="form-container">
          <div className="form-header">
            <h1 className="form-title">Sign Up</h1>
            <p className="form-subtitle">Create Corporate Account</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form className="signup-form" onSubmit={handleSubmit}>
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

            {/* ✅ Tenant Slug field */}
            <div className="form-group">
              <input
                type="text"
                value={tenantSlug}
                onChange={(e) => setTenantSlug(e.target.value)}
                placeholder="Tenant Slug"
                className="form-input"
                required
              />
            </div>

            <div className="forgot-password-container">
              <a href="#" className="forgot-password-link">
                Forgot Password?
              </a>
            </div>

            <button type="submit" className="signin-button">
              Sign Up
            </button>

            <div className="signup-container-bottom">
              Already a member?{' '}
              <Link to="/login" className="signup-link">
                Sign In
              </Link>

            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
