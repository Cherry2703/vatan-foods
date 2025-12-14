
// import React, { useState,useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import "./Signup.css";

// const Signup = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     role: "Operator",
//   });
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const navigate = useNavigate();



// useEffect(() => {
//   const user = localStorage.getItem("user");
//   if (user) {
//     navigate("/dashboard");
//   }
// }, [navigate]);


//   // Handle input changes
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // Handle form submission
//   const handleSignup = async (e) => {
//     e.preventDefault();

//     setError("");
//     setSuccess("");

//     // Validation
//     if (!formData.name || !formData.email || !formData.password) {
//       setError("Please fill in all required fields.");
//       return;
//     }

//     try {
//       // Send POST request to backend
//       const { data } = await axios.post(
//         "https://vatan-foods-backend-final.onrender.com/api/auth/register",
//         formData,
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       // Success
//       setSuccess("Signup successful! Redirecting to login...");
//       setTimeout(() => navigate("/login"), 2000);
//     } catch (err) {
//       console.error(err);

//       // Handle backend errors
//       if (err.response && err.response.data) {
//         setError(err.response.data.message || "Signup failed. Try again.");
//       } else {
//         setError("Server error. Please try again later.");
//       }
//     }
//   };

//   return (
//     <div className="signup-page-wrapper">
//       <div className="signup-card">
//         <div className="signup-left-section">
//           <h1 className="signup-title">Create Account</h1>
//           <p className="signup-subtitle">
//             VATAN FOODS wants you to join the operations panel
//           </p>
//         </div>

//         <div className="signup-right-section">
//           <form className="signup-form" onSubmit={handleSignup}>
//             <h2 className="form-title">Signup</h2>

//             {error && <p className="error-message">{error}</p>}
//             {success && <p className="success-message">{success}</p>}

//             <input
//               type="text"
//               name="name"
//               placeholder="Full Name"
//               value={formData.name}
//               onChange={handleChange}
//               className="input-field"
//             />

//             <input
//               type="email"
//               name="email"
//               placeholder="Email Address"
//               value={formData.email}
//               onChange={handleChange}
//               className="input-field"
//             />

//             <input
//               type="password"
//               name="password"
//               placeholder="Password"
//               value={formData.password}
//               onChange={handleChange}
//               className="input-field"
//             />

//             <select
//               name="role"
//               value={formData.role}
//               onChange={handleChange}
//               className="input-field select-field"
//             >
//               <option value="Admin">Admin</option>
//               <option value="Manager">Manager</option>
//               <option value="Operator">Operator</option>
//             </select>

//             <button type="submit" className="signup-btn">
//               Sign Up
//             </button>

//             <p className="login-text" onClick={() => navigate("/login")}>
//               Already have an account? <span className="login-link">Login</span>
//             </p>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Signup;









import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Signup.css";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Operator",
    mobile: "",
    department: "",
    designation: "",
    address: "",
    state: "",
    country: "",
    DOB: "",
    gender: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) navigate("/dashboard");

    // Generate particles for animated background
    const container = document.querySelector(".particles-layer");
    for (let i = 0; i < 50; i++) {
      const particle = document.createElement("div");
      particle.className = "particle";
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.animationDuration = `${5 + Math.random() * 10}s`;
      container.appendChild(particle);
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.name || !formData.email || !formData.password) {
      setError("Name, Email, and Password are required.");
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        "https://vatan-foods-backend-final.onrender.com/api/auth/register",
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      setSuccess("Account created successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page-wrapper">
      {/* Background Circles */}
      <div className="bg-circle"></div>
      <div className="bg-circle"></div>
      <div className="bg-circle"></div>
      <div className="bg-circle"></div>
      {/* Particle Layer */}
      <div className="particles-layer"></div>

      {/* Signup Card */}
      <div className="signup-card">
        <div className="signup-left-section">
          <h1 className="signup-title">Create Account</h1>
          <p className="signup-subtitle">
            Join VATAN FOODS Operations Panel
          </p>
        </div>

        <div className="signup-right-section">
          <form className="signup-form" onSubmit={handleSignup}>
            <h2 className="form-title">Signup</h2>

            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}

            {/* Required Fields */}
            <input type="text" name="name" placeholder="Full Name *" value={formData.name} onChange={handleChange} className="input-field" />
            <input type="email" name="email" placeholder="Email Address *" value={formData.email} onChange={handleChange} className="input-field" />
            <input type="password" name="password" placeholder="Password *" value={formData.password} onChange={handleChange} className="input-field" />

            {/* Optional Profile Fields */}
            <input type="text" name="mobile" placeholder="Mobile" value={formData.mobile} onChange={handleChange} className="input-field" />
            <input type="text" name="department" placeholder="Department" value={formData.department} onChange={handleChange} className="input-field" />
            <input type="text" name="designation" placeholder="Designation" value={formData.designation} onChange={handleChange} className="input-field" />
            <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} className="input-field" />
            <input type="text" name="state" placeholder="State" value={formData.state} onChange={handleChange} className="input-field" />
            <input type="text" name="country" placeholder="Country" value={formData.country} onChange={handleChange} className="input-field" />
            <div>
            <label htmlFor="DOB">Date of Birth</label>
            <input type="date" name="DOB" placeholder="Date of Birth" value={formData.DOB} onChange={handleChange} className="input-field" />
            </div>
            <select name="gender" value={formData.gender} onChange={handleChange} className="input-field select-field">
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>

            {/* Role */}
            <select name="role" value={formData.role} onChange={handleChange} className="input-field select-field">
              <option value="Operator">Operator</option>
              <option value="Manager">Manager</option>
              <option value="Admin">Admin</option>
            </select>

            <button type="submit" className="signup-btn" disabled={loading}>
              {loading ? "Creating Account..." : "Sign Up"}
            </button>

            <p className="login-text">
              Already have an account?{" "}
              <span className="login-link" onClick={() => navigate("/login")}>Login</span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
