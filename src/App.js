import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

import Orders from "./components/Orders/Orders";
import Materials from "./components/Materials/Materials";
import Cleaning from "./components/Cleaning/Cleaning";
import Packing from "./components/Packing/Packing";
import Settings from "./components/Settings/Settings";
import Dashboard from "./components/Dashboard/Dashboard";
import TrackOrder from "./components/TrackOrder/TrackOrder";

import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";

function App() {
  // Check if user is logged in by looking for a token or user info in localStorage
  const isLoggedIn = !!localStorage.getItem("user"); // adjust the key name you use in localStorage

  return (
    <Router>
      {/* Show Navbar only if logged in */}
      {isLoggedIn && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login />}
        />
        <Route
          path="/signup"
          element={isLoggedIn ? <Navigate to="/dashboard" /> : <Signup />}
        />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/track-order"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <TrackOrder />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/raw-materials"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Materials />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cleaning"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Cleaning />
            </ProtectedRoute>
          }
        />
        <Route
          path="/packing"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Packing />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Settings />
            </ProtectedRoute>
          }
        />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
