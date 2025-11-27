// Cleaning.jsx
import React, { useEffect, useState } from "react";
import "./Cleaning.css";
import { FaPlus, FaEdit, FaTrash, FaBroom, FaCheckCircle, FaSearch, FaHistory } from "react-icons/fa";
import axios from "axios";

const API_BASE = "https://vatan-foods-backend-final.onrender.com/api/cleaning";
const user = JSON.parse(localStorage.getItem("user"));

export default function Cleaning() {
  const [records, setRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selected, setSelected] = useState(null);
  const [showHistoryFor, setShowHistoryFor] = useState(null);

  const initialForm = {
    batchId: "",
    cycleNumber: "",
    previousOutput: "",
    itemName: "",
    cleaningType: "Manual",
    inputQuantity: "",
    outputQuantity: "",
    wastageQuantity: "",
    usedQuantity: "",
    remainingAfterCleaning: "",
    coverWastage: "",
    unit: "kg",
    operator: "",
    supervisor: "",
    shift: "Morning",
    signed: false,
    vendorName: "",
    remarks: "",
  };

  const [formData, setFormData] = useState(initialForm);
  const token = localStorage.getItem("token");

  // ---------- Fetch Records ----------
  const fetchRecords = async () => {
    try {
      const res = await axios.get(API_BASE, { headers: { Authorization: `Bearer ${token}` } });
      setRecords(res.data || []);
    } catch (err) {
      console.error("Error loading cleaning records", err);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // ---------- Helpers ----------
  const formatNumber = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };

  const handleChange = (e) => {
    const { name, value: rawValue, type, checked } = e.target;
    let value = type === "checkbox" ? checked : rawValue;

    if (["inputQuantity", "outputQuantity", "coverWastage"].includes(name)) {
      value = value.replace(/[^\d.]/g, "");
      if ((value.match(/\./g) || []).length > 1) value = value.replace(/\.+$/, "");
    }

    setFormData((prev) => {
      const next = { ...prev, [name]: value };

      if (name === "inputQuantity" || name === "outputQuantity") {
        const inputQ = formatNumber(name === "inputQuantity" ? value : next.inputQuantity);
        const outputQ = formatNumber(name === "outputQuantity" ? value : next.outputQuantity);
        next.wastageQuantity = inputQ - outputQ >= 0 ? inputQ - outputQ : 0;
        next.usedQuantity = inputQ;
        next.remainingAfterCleaning = 0; // optional business logic
      }

      return next;
    });
  };

  // ---------- Add / Update / Delete ----------
  const openAdd = () => {
    setFormData(initialForm);
    setSelected(null);
    setEditMode(false);
    setShowDialog(true);
  };

  const openEdit = (rec) => {
    setSelected(rec);
    setEditMode(true);
    setFormData({
      ...rec,
      inputQuantity: rec.inputQuantity != null ? String(rec.inputQuantity) : "",
      outputQuantity: rec.outputQuantity != null ? String(rec.outputQuantity) : "",
      wastageQuantity: rec.wastageQuantity != null ? String(rec.wastageQuantity) : "",
      usedQuantity: rec.usedQuantity != null ? String(rec.usedQuantity) : "",
      remainingAfterCleaning: rec.remainingAfterCleaning != null ? String(rec.remainingAfterCleaning) : "",
      coverWastage: rec.coverWastage || "",
      signed: !!rec.signed,
    });
    setShowDialog(true);
  };

  const handleAdd = async () => {
    if (!formData.batchId || !formData.itemName || !formData.inputQuantity)
      return alert("Please fill required fields.");

    const payload = {
      ...formData,
      inputQuantity: formatNumber(formData.inputQuantity),
      outputQuantity: formatNumber(formData.outputQuantity),
      wastageQuantity: formatNumber(formData.wastageQuantity),
      usedQuantity: formatNumber(formData.usedQuantity),
      remainingAfterCleaning: formatNumber(formData.remainingAfterCleaning),
      coverWastage: formatNumber(formData.coverWastage),
      createdBy: user.uuid || "",
    };

    try {
      await axios.post(API_BASE, payload, { headers: { Authorization: `Bearer ${token}` } });
      await fetchRecords();
      alert("Cleaning record added successfully.");
      setShowDialog(false);
      setFormData(initialForm);
    } catch (err) {
      console.error("Error adding cleaning record", err);
      alert(err.response?.data?.message || "Error creating record");
    }
  };

  const handleUpdate = async () => {
    if (!selected) return;

    const payload = {
      ...formData,
      inputQuantity: formatNumber(formData.inputQuantity),
      outputQuantity: formatNumber(formData.outputQuantity),
      wastageQuantity: formatNumber(formData.wastageQuantity),
      usedQuantity: formatNumber(formData.usedQuantity),
      remainingAfterCleaning: formatNumber(formData.remainingAfterCleaning),
      coverWastage: formatNumber(formData.coverWastage),
      createdBy: user.uuid || "",
    };

    try {
      await axios.put(`${API_BASE}/${selected.cleaningId}`, payload, { headers: { Authorization: `Bearer ${token}` } });
      await fetchRecords();
      alert("Cleaning record updated successfully.");
      setShowDialog(false);
      setEditMode(false);
      setSelected(null);
      setFormData(initialForm);
    } catch (err) {
      console.error("Error updating cleaning record", err);
      alert(err.response?.data?.message || "Error updating record");
    }
  };

  const handleDelete = async (cleaningId) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      await axios.delete(`${API_BASE}/${cleaningId}`, { headers: { Authorization: `Bearer ${token}` } });
      await fetchRecords();
      alert("Record deleted successfully.");
    } catch (err) {
      console.error("Error deleting record", err);
      alert("Error deleting record.");
    }
  };

  const filtered = records.filter((rec) => rec.itemName?.toLowerCase().includes(searchTerm.toLowerCase()));

  const openHistory = (batchId) => setShowHistoryFor(batchId);
  const closeHistory = () => setShowHistoryFor(null);

  // ---------- JSX ----------
  return (
    <div className="cleaning-container">
      <div className="cleaning-header">
        <h1><FaBroom /> Cleaning Records</h1>
        <button className="add-btn" onClick={openAdd}><FaPlus /> Add Record</button>
      </div>

      <div className="search-bar">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search by item name or batch..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="table-container">
        <table className="cleaning-table">
          <thead>
            <tr>
              <th>Batch ID</th>
              <th>Cycle</th>
              <th>Item</th>
              <th>Type</th>
              <th>Input</th>
              <th>Output</th>
              <th>Wastage</th>
              <th>Used</th>
              <th>Remaining</th>
              <th>Cover Wastage</th>
              <th>Unit</th>
              <th>Operator</th>
              <th>Shift</th>
              <th>Signed</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length ? filtered.map((rec) => (
              <tr key={rec.cleaningId}>
                <td>{rec.batchId}</td>
                <td>{rec.cycleNumber}</td>
                <td>{rec.itemName}</td>
                <td>{rec.cleaningType}</td>
                <td>{rec.inputQuantity}</td>
                <td>{rec.outputQuantity}</td>
                <td>{rec.wastageQuantity}</td>
                <td>{rec.usedQuantity}</td>
                <td>{rec.remainingAfterCleaning}</td>
                <td>{rec.coverWastage}</td>
                <td>{rec.unit}</td>
                <td>{rec.operator}</td>
                <td>{rec.shift}</td>
                <td>{rec.signed ? <FaCheckCircle className="signed-true" /> : "❌"}</td>
                <td>
                  <button onClick={() => openEdit(rec)} title="Edit"><FaEdit /></button>
                  <button onClick={() => handleDelete(rec.cleaningId)} title="Delete"><FaTrash /></button>
                  <button onClick={() => openHistory(rec.batchId)} title="History"><FaHistory /></button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="15" className="no-data">No records found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ---------- Add/Edit Dialog ---------- */}
      {showDialog && (
        <div className="dialog-overlay" onClick={() => setShowDialog(false)}>
          <div className="dialog" onClick={(e) => e.stopPropagation()}>
            <h3>{editMode ? "Edit Cleaning Record" : "Add Cleaning Record"}</h3>
            <div className="dialog-body">
              <div className="form-grid">
                <div className="form-field">
                  <label>Batch ID</label>
                  <input name="batchId" placeholder="Batch ID" value={formData.batchId} onChange={handleChange} />
                </div>
                <div className="form-field">
                  <label>Item Name</label>
                  <input name="itemName" placeholder="Item Name" value={formData.itemName} onChange={handleChange} />
                </div>
                <div className="form-field">
                  <label>Cleaning Type</label>
                  <select name="cleaningType" value={formData.cleaningType} onChange={handleChange}>
                    <option value="Manual">Manual</option>
                    <option value="Machine">Machine</option>
                  </select>
                </div>
                <div className="form-field">
                  <label>Input Quantity</label>
                  <input name="inputQuantity" placeholder="Input Quantity" value={formData.inputQuantity} onChange={handleChange} type="text" />
                </div>
                <div className="form-field">
                  <label>Output Quantity</label>
                  <input name="outputQuantity" placeholder="Output Quantity" value={formData.outputQuantity} onChange={handleChange} type="text" />
                </div>
                <div className="form-field">
                  <label>Wastage Quantity</label>
                  <input name="wastageQuantity" placeholder="Wastage Quantity" value={formData.wastageQuantity} readOnly />
                </div>
                <div className="form-field">
                  <label>Used Quantity</label>
                  <input name="usedQuantity" placeholder="Used Quantity" value={formData.usedQuantity} readOnly />
                </div>
                <div className="form-field">
                  <label>Remaining After Cleaning</label>
                  <input name="remainingAfterCleaning" placeholder="Remaining After Cleaning" value={formData.remainingAfterCleaning} readOnly />
                </div>
                <div className="form-field">
                  <label>Cover Wastage</label>
                  <input name="coverWastage" placeholder="Cover Wastage" value={formData.coverWastage} onChange={handleChange} />
                </div>
                <div className="form-field">
                  <label>Unit</label>
                  <input name="unit" placeholder="Unit" value={formData.unit} onChange={handleChange} />
                </div>
                <div className="form-field">
                  <label>Operator</label>
                  <input name="operator" placeholder="Operator" value={formData.operator} onChange={handleChange} />
                </div>
                <div className="form-field">
                  <label>Supervisor</label>
                  <input name="supervisor" placeholder="Supervisor" value={formData.supervisor} onChange={handleChange} />
                </div>
                <div className="form-field">
                  <label>Shift</label>
                  <select name="shift" value={formData.shift} onChange={handleChange}>
                    <option value="Morning">Morning</option>
                    <option value="Evening">Evening</option>
                    <option value="Night">Night</option>
                  </select>
                </div>
                <div className="form-field">
                  <label>Signed</label>
                  <input name="signed" type="checkbox" checked={!!formData.signed} onChange={handleChange} />
                </div>
                <div className="form-field full">
                  <label>Remarks</label>
                  <textarea name="remarks" value={formData.remarks} onChange={handleChange} />
                </div>
              </div>
            </div>

            <div className="dialog-actions">
              <button onClick={() => { setShowDialog(false); setEditMode(false); setSelected(null); }}>Cancel</button>
              {!editMode ? (
                <button onClick={handleAdd}>Save</button>
              ) : (
                <button onClick={handleUpdate}>Update</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ---------- History Modal ---------- */}
      {showHistoryFor && (
        <div className="dialog-overlay" onClick={closeHistory}>
          <div className="dialog" onClick={(e) => e.stopPropagation()}>
            <h3>History — {showHistoryFor}</h3>
            <p>History view is optional and can fetch from cleaning collection only.</p>
            <div className="dialog-actions">
              <button onClick={closeHistory}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
