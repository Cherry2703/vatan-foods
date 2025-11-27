
import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Signup.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Operator",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();



useEffect(() => {
  const user = localStorage.getItem("user");
  if (user) {
    navigate("/dashboard");
  }
}, [navigate]);


  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSignup = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      // Send POST request to backend
      const { data } = await axios.post(
        "https://vatan-foods-backend-final.onrender.com/api/auth/register",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Success
      setSuccess("Signup successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error(err);

      // Handle backend errors
      if (err.response && err.response.data) {
        setError(err.response.data.message || "Signup failed. Try again.");
      } else {
        setError("Server error. Please try again later.");
      }
    }
  };

  return (
    <div className="signup-page-wrapper">
      <div className="signup-card">
        <div className="signup-left-section">
          <h1 className="signup-title">Create Account</h1>
          <p className="signup-subtitle">
            VATAN FOODS wants you to join the operations panel
          </p>
        </div>

        <div className="signup-right-section">
          <form className="signup-form" onSubmit={handleSignup}>
            <h2 className="form-title">Signup</h2>

            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="input-field"
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="input-field"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="input-field"
            />

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="input-field select-field"
            >
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="Operator">Operator</option>
            </select>

            <button type="submit" className="signup-btn">
              Sign Up
            </button>

            <p className="login-text" onClick={() => navigate("/login")}>
              Already have an account? <span className="login-link">Login</span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
