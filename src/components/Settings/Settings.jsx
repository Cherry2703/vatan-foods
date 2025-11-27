import React, { useState } from "react";
import axios from "axios";
import "./Settings.css";

const RESET_API = "https://vatan-foods-backend.vercel.app/api/reset";

export default function Settings() {
  const [loading, setLoading] = useState(false);
  const [lowStock, setLowStock] = useState(true);

  // Dummy company data (you can replace later)
  const companyInfo = {
    companyName: "VatanFoods Pvt Ltd",
    email: "contact@vatanfoods.com",
    phone: "+91 9876543210",
    address: "Hyderabad, Telangana, India",
    gstNo: "37ABCDE1234F1Z5",
    timezone: "IST (UTC+5:30)",
  };

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  // Reset All Data
  const handleResetAllData = async () => {
    if (!window.confirm("⚠️ Are you sure? This will delete ALL data permanently.")) return;

    setLoading(true);
    try {
      await axios.delete(RESET_API, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("All data has been deleted successfully!");
    } catch (err) {
      alert("Error deleting all data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-container">
      <h1 className="settings-title">Settings</h1>
      <p className="settings-subtitle">Manage your application configuration</p>

      {/* Company Info Display */}
      <div className="settings-card fade-in">
        <h2 className="settings-card-title">Company Information</h2>

        <div className="info-row">
          <strong>Company Name:</strong>
          <span>{companyInfo.companyName}</span>
        </div>

        <div className="info-row">
          <strong>Email:</strong>
          <span>{companyInfo.email}</span>
        </div>

        <div className="info-row">
          <strong>Phone:</strong>
          <span>{companyInfo.phone}</span>
        </div>

        <div className="info-row">
          <strong>Address:</strong>
          <span>{companyInfo.address}</span>
        </div>

        <div className="info-row">
          <strong>GST Number:</strong>
          <span>{companyInfo.gstNo}</span>
        </div>

        <div className="info-row">
          <strong>Timezone:</strong>
          <span>{companyInfo.timezone}</span>
        </div>
      </div>

      {/* Low Stock Warnings */}
      <div className="settings-card fade-in">
        <h2 className="settings-card-title">Alerts & Notifications</h2>

        <div className="toggle-row">
          <div>
            <label className="toggle-title">Low Stock Warnings</label>
            <p className="toggle-subtitle">Alert when materials fall below threshold</p>
          </div>

          <label className="switch">
            <input
              type="checkbox"
              checked={lowStock}
              onChange={() => setLowStock(!lowStock)}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>

      {/* Danger Zone */}
      {user?.role === "Admin" && (
        <div className="settings-card danger-card slide-up">
          <h2 className="settings-card-title danger-text">Danger Zone</h2>

          <div className="danger-row">
            <div>
              <label className="toggle-title">Reset All Data</label>
              <p className="toggle-subtitle">This action cannot be undone</p>
            </div>

            <button
              className="btn-danger"
              onClick={handleResetAllData}
              disabled={loading}
            >
              {loading ? "Processing..." : "Reset"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
