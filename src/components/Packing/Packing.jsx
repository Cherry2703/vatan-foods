import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Packing.css";

const API_BASE = "https://vatan-foods-backend-final.onrender.com/api/packing";
const CLEANING_API = "https://vatan-foods-backend-final.onrender.com/api/cleaning";
const MATERIAL_API = "https://vatan-foods-backend-final.onrender.com/api/incoming";

export default function Packing() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const headers = { Authorization: `Bearer ${token}` };

  const initialForm = {
    cleaningId: "",
    batchId: "",
    itemName: "",
    invoiceNumber: "",
    packingType: "Manual Packing",
    shift: "",
    inputFromCleaning: 0,
    outputPacked: 0,
    numberOfBags: 0,
    bagWeight: 0,
    wastage: 0,
    workers: "",
    status: "Pending",
    remarks: "",
    vendorName: "",
    brandName: "",
    noOfPackets: 0,
    packetsInEachBag: 0,
    packedDate: "",
  };

  const [records, setRecords] = useState([]);
  const [batchList, setBatchList] = useState([]);
  const [incomingList, setIncomingList] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [batchCleanedQty, setBatchCleanedQty] = useState(0);
  const [showDialog, setShowDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selected, setSelected] = useState(null);
  const [remainingQty, setRemainingQty] = useState(0);




  const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData(prev => ({ ...prev, [name]: value }));
};


  const formatNumber = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };

  /* ================= FETCH DATA ================= */

  const fetchAll = async () => {
    try {
      const [packRes, cleanRes, incRes] = await Promise.all([
        axios.get(API_BASE, { headers }),
        axios.get(CLEANING_API, { headers }),
        axios.get(MATERIAL_API, { headers }),
      ]);

      setRecords(packRes.data || []);

      console.log("paking list : ", packRes.data);
      console.log("cleaning list : ", cleanRes.data);
      

      // ✅ ONLY batches with remaining stock
      setBatchList(
        (cleanRes.data || []).filter(
          (b) => formatNumber(b.remainingAfterCleaning) > 0
        )
      );

      setIncomingList(incRes.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  /* ================= DERIVED LOGIC ================= */

  useEffect(() => {
    const wastage =
      formatNumber(formData.inputFromCleaning) -
      formatNumber(formData.outputPacked);

    setFormData((prev) => ({
      ...prev,
      wastage: wastage > 0 ? wastage : 0,
    }));
  }, [formData.inputFromCleaning, formData.outputPacked]);

  /* ================= HANDLERS ================= */

  const handleBatchSelect = (cleaningId) => {
    const batch = batchList.find((b) => b.cleaningId === cleaningId);
    if (!batch) return;

    const availableQty = formatNumber(batch.remainingAfterCleaning);

    setFormData({
      ...initialForm,
      cleaningId: batch.cleaningId,
      batchId: batch.batchId,
      itemName: batch.itemName,
      inputFromCleaning: availableQty,
    });

    setSelectedBatch(batch);
    setBatchCleanedQty(availableQty);
  };

  const handleSave = async () => {
    const packed = formatNumber(formData.outputPacked);
    const cleaned = batchCleanedQty;

    if (!formData.cleaningId) {
      alert("Please select a cleaned batch");
      return;
    }

    if (packed > cleaned) {
      alert("Packed quantity exceeds available quantity");
      return;
    }

    try {
      if (editMode && selected) {
        await axios.put(`${API_BASE}/${selected.packingId}`, formData, {
          headers,
        });
      } else {
        await axios.post(
          API_BASE,
          { ...formData, createdBy: user.uuid },
          { headers }
        );
      }

      await fetchAll();
      setShowDialog(false);
      setFormData({
        ...initialForm,
        packedDate: new Date().toISOString().split("T")[0],
      });
      setSelected(null);
      setEditMode(false);
      setSelectedBatch(null);
      setBatchCleanedQty(0);
    } catch (err) {
      alert(err.response?.data?.message || "Save failed");
    }
  };

  const handleEdit = (r) => {
    setSelected(r);
    setEditMode(true);
    setFormData(r);

    const batch = batchList.find((b) => b.cleaningId === r.cleaningId);
    if (batch) {
      setSelectedBatch(batch);
      setBatchCleanedQty(formatNumber(batch.remainingAfterCleaning));
    }

    setShowDialog(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this record?")) return;
    await axios.delete(`${API_BASE}/${id}`, { headers });
    fetchAll();
  };

  /* ================= UI ================= */

  return (
    <div className="packing-wrapper">
      <div className="packing-header">
        <h2>Packing Records</h2>
        <button
          className="add-btn"
          onClick={() => {
            setFormData(initialForm);
            setEditMode(false);
            setSelected(null);
            setShowDialog(true);
          }}
        >
          ➕ Add Packing Entry
        </button>
      </div>

      {/* Dialog */}
      {showDialog && (
        <div className="dialog-overlay" onClick={(e) => {
    if (e.target.classList.contains("dialog-overlay")) {
      setShowDialog(false);
    }
  }}
>
          <div className="dialog" onClick={(e) => e.stopPropagation()}>
            <div className="dialog-header">
              <h3>{editMode ? "Edit Packing Record" : "Add New Packing Record"}</h3>
              <span className="close-icon" onClick={() => setShowDialog(false)}>✖</span>
            </div>

            <div className="form-grid">
              <div className="section-title">Batch Details</div>
              <label>Batch ID</label>
         
<select
  name="cleaningId"
  value={formData.cleaningId}
  onChange={(e) => {
    const cleaningId = e.target.value;

    if (!cleaningId) {
      setFormData(initialForm);
      setSelectedBatch(null);
      setBatchCleanedQty(0);
      setRemainingQty(0);
      return;
    }

    const batch = batchList.find(b => b.cleaningId === cleaningId);
    if (!batch) return;

    // ✅ IMPORTANT CHANGE: use remainingAfterCleaning
    const availableQty = formatNumber(batch.outputQuantity);

    setFormData(prev => ({
      ...prev,
      cleaningId: batch.cleaningId,
      batchId: batch.batchId,
      itemName: batch.itemName,
      inputFromCleaning: availableQty,
      // ❌ do NOT auto-fill outputPacked
      outputPacked: prev.outputPacked || 0
    }));

    setSelectedBatch({
      ...batch,
      // normalize quantity for UI usage
      outputQuantity: availableQty
    });

    setBatchCleanedQty(availableQty);
    setRemainingQty(availableQty);
  }}
>
  <option value="">-- Select Cleaned Batch {batchList.length} --</option>

  {batchList
    .filter(b => b.cleaningId && Number(b.remainingAfterCleaning) > 0)
    .map((b, index) => (
      <option key={`${b.cleaningId}-${index}`} value={b.cleaningId}>
       {b.batchId} || {b.itemName} || Cleaned: {b.outputQuantity} kg
      </option>
    ))}
</select>



              {selectedBatch && (
                <p className="batch-info">
                  <strong>Available (cleaned):</strong> {selectedBatch.outputQuantity} kg | <strong>Item:</strong> {selectedBatch.itemName}
                </p>
              )}

              <div>
                <label>Invoice Number</label>
                <input
                  name="invoiceNumber"
                  value={formData.invoiceNumber}
                  onChange={handleChange}
                  placeholder="Invoice Number"  />
              </div>

              <div className="section-title">Packing Info</div>
              <label>Packing Type</label>
              <select
                value={formData.packingType}
                onChange={handleChange}
                name="packingType"
              >
                <option value="Manual Packing">Manual Packing</option>
                <option value="Machine Packing">Machine Packing</option>
                <option value="Loose Packing">Loose Packing</option>
              </select>


              <label>Shift</label>
              <input name="shift" value={formData.shift} onChange={handleChange} placeholder="Shift A/B/C" />

              <label>Vendor Name</label>
              <input name="vendorName" placeholder="Vendor Name" value={formData.vendorName} onChange={handleChange} />

              <label>Brand Name</label>
              <input name="brandName" placeholder="Brand Name" value={formData.brandName} onChange={handleChange} />

              <label>Input Quantity from Cleaning</label>
              <input name="inputFromCleaning" placeholder="Input From Cleaning" type="text" value={formData.inputFromCleaning} onChange={handleChange} />

              <label>Output Packed</label>
              <input name="outputPacked" placeholder="Output Packed" type="text" value={formData.outputPacked} onChange={handleChange} />

              <p style={{ marginTop: 6, fontSize: 13, color: "#444" }}>
                  <strong>Remaining after this packing:</strong>{" "}
                  {selectedBatch
                    ? selectedBatch.outputQuantity - formatNumber(formData.outputPacked)
                    : 0
                  } kg
              </p>


              <div>
              <label>Each Packet Weight (kg)</label>
              <input name="bagWeight" placeholder="Each Pack Weight" type="text" value={formData.bagWeight} onChange={handleChange} />
              </div>
              <div>
              <label>Total No of Packets</label>
              <input name="noOfPackets" placeholder="Total No Of Packets" type="text" value={formData.noOfPackets} onChange={handleChange} />
              </div>
              <div>
              <label>Number of Boxes</label>
              <input name="numberOfBags" placeholder="Number Of Boxes" type="text" value={formData.numberOfBags} onChange={handleChange} />
              </div>
              <div>
              <label>No of Packets in Each Box</label>
              <input name="packetsInEachBag" placeholder="No of Packets In Each Box" type="text" value={formData.packetsInEachBag} onChange={handleChange} />
              </div>
              <div>
                <label>Packing Date</label>
                <input
                  type="date"
                  name="packedDate"
                  max={new Date().toISOString().split("T")[0]}
                  value={formData.packedDate}
                  onChange={handleChange}
                />
                </div>
              <div>
              <label>Workers</label>
              <input name="workers" value={formData.workers} onChange={handleChange} placeholder="Comma separated" />
              </div>
              <label>Status</label>
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="Pending">Pending</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
              </select>

              <label>Remarks</label>
              <textarea name="remarks" value={formData.remarks} onChange={handleChange} />
            </div>

            <div className="dialog-actions">
              <button className="cancel-btn" onClick={() => { setShowDialog(false); setEditMode(false); setSelected(null); }}>Cancel</button>
              <button className="save-btn" onClick={handleSave}>{editMode ? "Update" : "Add"}</button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
<div className="table-container">
  <table>
    <thead>
      <tr>
        <th>Batch ID</th>
        <th>Invoice Number</th>
        <th>Item Name</th>
        <th>Brand Name</th>
        <th>Packing Type</th>
        <th>Shift</th>
        <th>Input Quantity</th>
        <th>Output</th>
        <th>Each Packet Weight</th>
        <th>Total Bags</th>
        <th>Each bag contains no of packs</th>
        <th>Status</th>
        <th>Wastage</th>
        <th>Packed Date</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {records
        .filter((r) => {
          // If status is not Completed → always show
          if (r.status !== "Completed") return true;

          // If Completed, check updatedAt or createdAt
          const recordDate = new Date(r.updatedAt || r.createdAt);
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

          // Show only if Completed within last 7 days
          return recordDate >= sevenDaysAgo;
        })
        .map((r) => (
          <tr key={r.packingId}>
            <td>{r.batchId}</td>
            <td>{r.invoiceNumber || "-"}</td>
            <td>{r.itemName}</td>
            <td>{r.brandName || "-"}</td>
            <td>{r.packingType}</td>
            <td>{r.shift}</td>
            <td>{r.inputFromCleaning}</td>
            <td>{r.outputPacked}</td>
            <td>{r.bagWeight}</td>
            <td>{r.numberOfBags}</td>
            <td>{r.packetsInEachBag}</td>
            <td>{r.status}</td>
            <td>{r.wastage}</td>
            <td>{r.packedDate.split("T")[0] || "-"}</td>
            <td>
              <button onClick={() => handleEdit(r)}>✏️</button>
              <button onClick={() => handleDelete(r.packingId)}>🗑️</button>
            </td>
          </tr>
        ))}
    </tbody>
  </table>
</div>

    </div>
  );
}
