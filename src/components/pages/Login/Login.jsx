import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const API_BASE_URL = "http://192.168.1.137:4000"; // ✅ backend URL

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password,
      });

      console.log("✅ Login success:", response.data);

      // ✅ Save token if backend returns it
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      // Navigate after success
      navigate("/Exploreflow");
    } catch (err) {
      console.error("❌ Login error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-container">
      {/* Left side - Logo and branding */}
      <div className="branding-section">
        <div className="brand-wrapper">
          <div className="brand-text">
            <img src="NXT.png" alt="NXT Logo" />
            <span className="brand-flows">Flows</span>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="form-section">
        <div className="form-container">
          <div className="form-header">
            <h1 className="form-title">Sign In</h1>
            <p className="form-subtitle">Corporate Login</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form className="login-form" onSubmit={handleSubmit}>
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

            <div className="forgot-password-container">
              <a href="#" className="forgot-password-link">
                Forgot Password?
              </a>
            </div>

            <button type="submit" className="signin-button">
              Sign In
            </button>

            <div className="signup-container">
              Not a member yet?{" "}
              <Link to="/" className="signup-link">
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
