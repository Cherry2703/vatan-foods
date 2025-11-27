import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      navigate("/dashboard");
    }
    // window.location.reload();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      const { data } = await axios.post(
        "https://vatan-foods-backend-final.onrender.com/api/auth/login",
        { email, password },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      // Save user + token in localStorage
      localStorage.setItem(
        "user",
        JSON.stringify({
          uuid: data.uuid,
          name: data.name,
          email: data.email,
          role: data.role,
        })
      );
      localStorage.setItem("token", data.token);

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data) {
        setError(err.response.data.message || "Invalid credentials");
      } else {
        setError("Server error. Please try again later.");
      }
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-card">
        <div className="login-left-section">
          <h1 className="login-title">Welcome Back to VATAN FOODS</h1>
          <p className="login-subtitle">Login to continue your operations</p>
        </div>

        <div className="login-right-section">
          <form className="login-form" onSubmit={handleLogin}>
            <h2 className="form-title">Login</h2>

            {error && <p className="error-message">{error}</p>}

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              autoComplete="username"
            />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                autoComplete="current-password"
            />


            <button type="submit" className="login-btn">
              Login
            </button>

            <p className="signup-text" onClick={() => navigate("/signup")}>
              Don't have an account? <span className="signup-link">Signup</span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
