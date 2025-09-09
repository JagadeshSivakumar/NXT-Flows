import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify"; // ✅ import
import "react-toastify/dist/ReactToastify.css"; // ✅ import styles
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

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);

        // ✅ Success toast
        toast.success("Login successful!", {
          position: "top-center",
          autoClose: 2000,
        });

        // Navigate after short delay
        setTimeout(() => {
          navigate("/Exploreflow");
        }, 2000);
      }
    } catch (err) {
      console.error("❌ Login error:", err.response?.data || err.message);

      const message =
        err.response?.data?.message ||
        "Invalid email or password. Please try again.";

      setError(message);

      // ✅ Error toast
      toast.error(message, {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="login-container">
      {/* Toast container */}
      <ToastContainer />

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

          {error && <div className="error-message">{error}</div>} {/* ✅ Red text */}

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className={`form-input ${error && "input-error"}`} // ✅ highlight input on error
                required
              />
            </div>

            <div className="form-group">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className={`form-input ${error && "input-error"}`}
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
