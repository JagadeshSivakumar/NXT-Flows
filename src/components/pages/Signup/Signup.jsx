import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Signup.css';

function Signup() {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tenantSlug, setTenantSlug] = useState('');
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
          name: `${firstname} ${lastname}`,
          tenantSlug
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Signup failed");
      }

      const data = await response.json();
      console.log("✅ Signup success:", data);

      navigate("/login");
    } catch (err) {
      console.error("❌ Signup error:", err.message);
      setError(err.message);
    }
  };

  return (
    <div className="signup">
      {/* Branding */}
      <div className="signup__branding">
        <div className="signup__brand-wrapper">
          <div className="signup__brand-text">
            <img src="NXT.png" alt="NXT Logo" className="signup__logo" />
            <span className="signup__flows">Flows</span>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="signup__form-section">
        <div className="signup__form-container">
          <div className="signup__header">
            <h1 className="signup__title">Sign Up</h1>
            <p className="signup__subtitle">Create Corporate Account</p>
          </div>

          {error && <div className="signup__error">{error}</div>}

          <form className="signup__form" onSubmit={handleSubmit}>
            <div className="signup__group">
              <input
                type="text"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                placeholder="First Name"
                className="signup__input"
                required
              />
            </div>

            <div className="signup__group">
              <input
                type="text"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                placeholder="Last Name"
                className="signup__input"
                required
              />
            </div>

            <div className="signup__group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="signup__input"
                required
              />
            </div>

            <div className="signup__group">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="signup__input"
                required
              />
            </div>

            <div className="signup__group">
              <input
                type="text"
                value={tenantSlug}
                onChange={(e) => setTenantSlug(e.target.value)}
                placeholder="Tenant Slug"
                className="signup__input"
                required
              />
            </div>

            <div className="signup__forgot">
              <a href="#" className="signup__forgot-link">
                Forgot Password?
              </a>
            </div>

            <button type="submit" className="signup__button">
              Sign Up
            </button>

            <div className="signup__bottom">
              Already a member?{' '}
              <Link to="/login" className="signup__link">
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
