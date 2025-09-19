import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Login.css";
import { LucideEye, LucideEyeOff } from "lucide-react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const API_BASE_URL = "http://192.168.1.137:4000";

  const validateEmail = (email) => {
    // simple email regex check
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setEmailError(false);
    setPasswordError(false);

    // Email validation
    if (!email || !validateEmail(email)) {
      setEmailError(true);
      setError("Please enter a valid email address");
      return;
    }

    // Password validation
    if (!password) {
      setPasswordError(true);
      setError("Please enter your password");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);

        toast.success("Login successful!", {
          position: "top-center",
          autoClose: 2000,
        });

        setTimeout(() => {
          navigate("/Exploreflow");
        }, 2000);
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Invalid email or password. Please try again.";
      setError(message);

      // Decide which field to highlight
      if (message.toLowerCase().includes("email")) {
        setEmailError(true);
      } else if (message.toLowerCase().includes("password")) {
        setPasswordError(true);
      } else {
        // default: highlight both if unsure
        setEmailError(true);
        setPasswordError(true);
      }

      toast.error(message, {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="login-container">
      <ToastContainer />

      <div className="branding-section">
        <div className="brand-wrapper">
          <div className="brand-text">
            <img src="NXT.png" alt="NXT Logo" />
            <span className="brand-flows">Flows</span>
          </div>
        </div>
      </div>

      <div className="form-section">
        <div className="form-container">
          <div className="form-header">
            <h1 className="form-title">Sign In</h1>
            <p className="form-subtitle">Corporate Login</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className={`form-input ${emailError ? "input-error" : ""}`}
                required
              />
            </div>

            <div
              className="form-group password-wrapper"
              style={{ marginBottom: -10 }}
            >
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className={`form-input ${passwordError ? "input-error" : ""}`}
                required
              />
              <span
                className="eye-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <LucideEye size={20} /> : <LucideEyeOff size={20} />}
              </span>
            </div>

            {error && <div className="error-message">{error}</div>}

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
