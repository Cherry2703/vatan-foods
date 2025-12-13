import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Employees.css";

const API_URL = "https://vatan-foods-backend-final.onrender.com/api/auth/employees";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  const isAdmin = currentUser.role === "admin";

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
  try {
    const res = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // ✅ Extract employees array correctly
    let data = res.data?.employees || [];

    // 🔐 Role-based filtering
    if (!isAdmin) {
      data = data.filter((u) => u.role !== "admin");
    }

    setEmployees(data);
  } catch (err) {
    console.error("Error fetching employees", err);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="employees-page">
      <header className="employees-header">
        <h1>Employees</h1>
        <p>{isAdmin ? "All Employees" : "Team Members"}</p>
      </header>

      {loading ? (
        <p className="loading">Loading employees…</p>
      ) : (
        <div className="employees-grid">
          {employees.map((emp) => (
            <div
              key={emp._id}
              className="employee-card"
              onClick={() => setSelected(emp)}
            >
              <div className="avatar">
                {emp.name?.charAt(0).toUpperCase()}
              </div>

              <h3>{emp.name}</h3>
              <p className="designation">{emp.designation || "Employee"}</p>

              <span className={`role ${emp.role}`}>
                {emp.role.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* ===== Popup Modal ===== */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close-btn" onClick={() => setSelected(null)}>
              ✖
            </button>

            <div className="modal-avatar">
              {selected.name?.charAt(0).toUpperCase()}
            </div>

            <h2>{selected.name}</h2>
            <p className="modal-role">{selected.role}</p>

            <div className="modal-info">
              <p><strong>Email:</strong> {selected.email}</p>
              <p><strong>Phone:</strong> {selected.phone || "-"}</p>
              <p><strong>Department:</strong> {selected.department || "-"}</p>
              <p><strong>Designation:</strong> {selected.designation || "-"}</p>
              <p>
                <strong>Joined:</strong>{" "}
                {selected.createdAt
                  ? new Date(selected.createdAt).toDateString()
                  : "-"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
