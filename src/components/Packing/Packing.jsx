
// // Packing.jsx
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "./Packing.css";

// const API_BASE = "https://vatan-foods-backend-final.onrender.com/api/packing";
// const BATCH_API = "https://vatan-foods-backend-final.onrender.com/api/cleaning";
// const MATERIAL_API = "https://vatan-foods-backend-final.onrender.com/api/incoming";

// export default function Packing() {
//   const [records, setRecords] = useState([]);
//   const [batchList, setBatchList] = useState([]);
//   const [selectedBatch, setSelectedBatch] = useState(null);
//   const [showDialog, setShowDialog] = useState(false);
//   const [editMode, setEditMode] = useState(false);
//   const [selected, setSelected] = useState(null);

//   const token = localStorage.getItem("token");
//   const user = JSON.parse(localStorage.getItem("user"));

//   const initialForm = {
//     batchId: "",
//     packingType: "Final Packaging",
//     shift: "",
//     // inputFromRaw: 0,
//     inputFromCleaning: 0,
//     outputPacked: 0,
//     numberOfBags: 0,
//     bagWeight: 0,
//     wastage: 0,
//     workers: "",
//     status: "Pending",
//     // pendingReason: "",
//     remarks: "",
//     vendorName: "",
//     brandName: "",
//     itemName: "",
//     noOfPackets: 0,
//     packetsInEachBag: 0,
//   };

//   const [formData, setFormData] = useState(initialForm);

//   // ---------- Fetching ----------
//   const fetchRecords = async () => {
//     try {
//       const res = await axios.get(API_BASE, { headers: { Authorization: `Bearer ${token}` } });
//       setRecords(res.data || []);
//     } catch (err) {
//       console.error("Error fetching packing records:", err);
//     }
//   };

//   const fetchBatchIds = async () => {
//     try {
//       const res = await axios.get(BATCH_API, { headers: { Authorization: `Bearer ${token}` } });
//       setBatchList(res.data || []);
//     } catch (err) {
//       console.error("Error fetching batch list:", err);
//     }
//   };

//   useEffect(() => {
//     fetchRecords();
//     fetchBatchIds();
//   }, []);

//   // ---------- Helpers ----------
//   const formatNumber = (v) => {
//     const n = Number(v);
//     return Number.isFinite(n) ? n : 0;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     let val = value;

//     if (["inputFromRaw", "inputFromCleaning", "outputPacked", "numberOfBags", "bagWeight", "noOfPackets", "packetsInEachBag"].includes(name)) {
//       val = val.replace(/[^\d.]/g, "");
//       if ((val.match(/\./g) || []).length > 1) val = val.replace(/\.+$/, "");
//     }

//     setFormData((prev) => ({ ...prev, [name]: val }));
//   };

//   // Update itemName and outputQuantity from selected batch
//   useEffect(() => {
//     if (!selectedBatch) return;
//     const fetchMaterial = async (id) => {
//       try {
//         const res = await axios.get(`${MATERIAL_API}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
//         setFormData((prev) => ({
//           ...prev,
//           itemName: res.data.itemName || selectedBatch.itemName,
//           outputPacked: res.data.outputQuantity || 0,
//         }));

//         console.log("packing component incoming",res);
        
//       } catch (err) {
//         console.error("Error fetching material:", err);
//       }
//     };
//     fetchMaterial(selectedBatch.batchId);
//   }, [selectedBatch]);

//   // Recalculate wastage
//   useEffect(() => {
//     const totalInput = formatNumber(formData.inputFromRaw) + formatNumber(formData.inputFromCleaning);
//     const wastage = totalInput - formatNumber(formData.outputPacked);
//     setFormData((prev) => ({ ...prev, wastage: wastage >= 0 ? wastage : 0 }));
//   }, [formData.inputFromRaw, formData.inputFromCleaning, formData.outputPacked]);

//   // ---------- Add / Update / Delete ----------
//   const handleAdd = async () => {
//     const payload = { ...formData, createdBy: user.uuid || "" };
//     try {
//       await axios.post(API_BASE, payload, { headers: { Authorization: `Bearer ${token}` } });
//       setShowDialog(false);
//       setFormData(initialForm);
//       fetchRecords();
//     } catch (err) {
//       console.error("Error adding packing record:", err);
//       alert(err.response?.data?.message || "Error adding record");
//     }
//   };

//   const handleUpdate = async () => {
//     if (!selected) return;
//     const payload = { ...formData, createdBy: user.uuid || "" };
//     try {
//       await axios.put(`${API_BASE}/${selected.packingId}`, payload, { headers: { Authorization: `Bearer ${token}` } });
//       setShowDialog(false);
//       setEditMode(false);
//       setSelected(null);
//       setFormData(initialForm);
//       fetchRecords();
//     } catch (err) {
//       console.error("Error updating packing record:", err);
//       alert(err.response?.data?.message || "Error updating record");
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this record?")) return;
//     try {
//       await axios.delete(`${API_BASE}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
//       fetchRecords();
//     } catch (err) {
//       console.error("Error deleting packing record:", err);
//       alert("Error deleting record");
//     }
//   };

  

//   // ---------- JSX ----------
//   return (
//     <div className="packing-wrapper">
//       <div className="packing-header">
//         <h2>Packing Records</h2>
//         <button
//           className="add-btn"
//           onClick={() => {
//             setFormData(initialForm);
//             setEditMode(false);
//             setShowDialog(true);
//           }}
//         >
//           ➕ Add Packing Entry
//         </button>
//       </div>

//       {/* ---------- Dialog ---------- */}
//       {showDialog && (
//         <div className="dialog-overlay" onClick={() => setShowDialog(false)}>
//           <div className="dialog" onClick={(e) => e.stopPropagation()}>
//             <div className="dialog-header">
//               <h3>{editMode ? "Edit Packing Record" : "Add New Packing Record"}</h3>
//               <span className="close-icon" onClick={() => setShowDialog(false)}>✖</span>
//             </div>

//             <div className="form-grid">
//               <div className="section-title">Batch Details</div>
//               <label>Batch ID</label>
//               <select
//                 value={formData.batchId}
//                 onChange={(e) => {
//                   const id = e.target.value;
//                   setFormData({ ...formData, batchId: id });
//                   const b = batchList.find((x) => x.batchId === id);
//                   setSelectedBatch(b || null);
//                 }}
//               >
//                 <option value="">Select Batch</option>
//                 {batchList.map((b) => (
//                   <option key={b._id} value={b.batchId}>{b.batchId} - {b.itemName} - {b.outputQuantity} kgs</option>
//                 ))}
//               </select>

              

//               {selectedBatch && (
//                 <p className="batch-info">
//                   <strong>Available:</strong> {selectedBatch.outputQuantity} kg | <strong>Item:</strong> {selectedBatch.itemName}
//                 </p>
//               )}

//               <div className="section-title">Packing Info</div>
//               <label>Packing Type</label>
//               <select value={formData.packingType} onChange={handleChange} name="packingType">
//                 <option value="Initial Packaging">Manual Packing</option>
//                 <option value="Final Packaging">Machinery Packing</option>
//               </select>

//               <label>Shift</label>
//               <input name="shift" value={formData.shift} onChange={handleChange} placeholder="Shift A/B/C" />

//               <label>Vendor Name</label>
//               <input name="vendorName" placeholder="Vendor Name" value={formData.vendorName} onChange={handleChange} />

//               <label>Brand Name</label>
//               <input name="brandName" placeholder="Brand Name" value={formData.brandName} onChange={handleChange} />

//               {/* <label>Input from Raw</label>
//               <input name="inputFromRaw" placeholder="Input From Raw" type="text" value={formData.inputFromRaw} onChange={handleChange} /> */}

//               <label>Input Quantity from Cleaning</label>
//               <input name="inputFromCleaning" placeholder="Input From Cleaning" type="text" value={formData.inputFromCleaning} onChange={handleChange} />

//               <label>Output Packed</label>
//               <input name="outputPacked" placeholder="Output Packed" type="text" value={formData.outputPacked} onChange={handleChange} />


//               <label>Each Packet Weight (kg)</label>
//               <input name="bagWeight" placeholder="Each Pack Weight" type="text" value={formData.bagWeight} onChange={handleChange} />

//               <label>Total No of Packets</label>
//               <input name="noOfPackets" placeholder="Total No Of Packets" type="text" value={formData.noOfPackets} onChange={handleChange} />

//               <label>Number of Boxes</label>
//               <input name="numberOfBags" placeholder="Number Of Boxes" type="text" value={formData.numberOfBags} onChange={handleChange} />

//               <label>No of Packets in Each Box</label>
//               <input name="packetsInEachBag" placeholder="No of Pakets In Each Box" type="text" value={formData.packetsInEachBag} onChange={handleChange} />
              

//               <label>Workers</label>
//               <input name="workers" value={formData.workers} onChange={handleChange} placeholder="Comma separated" />

//               <label>Status</label>
//               <select name="status" value={formData.status} onChange={handleChange}>
//                 <option value="Pending">Pending</option>
//                 <option value="Ongoing">Ongoing</option>
//                 <option value="Completed">Completed</option>
//               </select>

//               {/* {formData.status === "Pending" && (
//                 <>
//                   <label>Pending Reason</label>
//                   <select name="pendingReason" value={formData.pendingReason} onChange={handleChange}>
//                     <option value="">Select Reason</option>
//                     <option value="Stock shortage">Stock shortage</option>
//                     <option value="Machine issue">Machine issue</option>
//                     <option value="Labor shortage">Labor shortage</option>
//                     <option value="Other">Other</option>
//                   </select>
//                 </>
//               )} */}

//               <label>Remarks</label>
//               <textarea name="remarks" value={formData.remarks} onChange={handleChange} />
//             </div>

//             <div className="dialog-actions">
//               <button className="cancel-btn" onClick={() => { setShowDialog(false); setEditMode(false); setSelected(null); }}>Cancel</button>
//               <button className="save-btn" onClick={editMode ? handleUpdate : handleAdd}>{editMode ? "Update" : "Add"}</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ---------- Table ---------- */}
//       <div className="table-container">
//         <table>
//           <thead>
//             <tr>
//               <th>Batch ID</th>
//               <th>Packing Type</th>
//               <th>Shift</th>
//               <th>Output</th>
//               <th>Bag Weight</th>
//               <th>No of Bags</th>
//               <th>Packets per Bag</th>
//               <th>Status</th>
//               <th>Wastage</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {records.map((r) => (
//               <tr key={r.packingId}>
//                 <td>{r.batchId}</td>
//                 <td>{r.packingType}</td>
//                 <td>{r.shift}</td>
//                 <td>{r.outputPacked}</td>
//                 <td>{r.bagWeight}</td>
//                 <td>{r.numberOfBags}</td>
//                 <td>{r.packetsInEachBag}</td>
//                 <td>{r.status}</td>
//                 <td>{r.wastage}</td>
//                 <td>
//                   <button onClick={() => { setSelected(r); setFormData(r); setEditMode(true); setShowDialog(true); }}>✏️</button>
//                   <button onClick={() => handleDelete(r.packingId)}>🗑️</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }







// Packing.jsx (updated)
// Assumes MATERIAL_API = "https://.../api/incoming" that supports PUT /api/incoming/:incomingId
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Packing.css";

const API_BASE = "https://vatan-foods-backend-final.onrender.com/api/packing";
const CLEANING_API = "https://vatan-foods-backend-final.onrender.com/api/cleaning";
const MATERIAL_API = "https://vatan-foods-backend-final.onrender.com/api/incoming";

export default function Packing() {
  const [records, setRecords] = useState([]);
  const [batchList, setBatchList] = useState([]); // cleaning batches
  const [incomingList, setIncomingList] = useState([]); // incoming materials
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectedIncoming, setSelectedIncoming] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selected, setSelected] = useState(null);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const initialForm = {
    batchId: "",
    packingType: "Final Packaging",
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
    itemName: "",
    noOfPackets: 0,
    packetsInEachBag: 0,
  };

  const [formData, setFormData] = useState(initialForm);
  const [batchCleanedQty, setBatchCleanedQty] = useState(0); // cleaned quantity available for selected batch
  const [remainingQty, setRemainingQty] = useState(0); // computed cleanedQty - input

  // ---------- Fetching ----------
  const fetchRecords = async () => {
    try {
      const res = await axios.get(API_BASE, { headers: { Authorization: `Bearer ${token}` } });
      setRecords(res.data || []);
    } catch (err) {
      console.error("Error fetching packing records:", err);
    }
  };

  const fetchBatchIds = async () => {
    try {
      const res = await axios.get(CLEANING_API, { headers: { Authorization: `Bearer ${token}` } });
      // cleaning API returns cleaning records with batchId and outputQuantity
      setBatchList(res.data || []);
    } catch (err) {
      console.error("Error fetching batch list:", err);
    }
  };

  const fetchIncomingList = async () => {
    try {
      const res = await axios.get(MATERIAL_API, { headers: { Authorization: `Bearer ${token}` } });
      // incoming API returns items with batchId and incomingId and totalQuantity
      setIncomingList(res.data || []);
    } catch (err) {
      console.error("Error fetching incoming list:", err);
    }
  };

  useEffect(() => {
    fetchRecords();
    fetchBatchIds();
    fetchIncomingList();
  }, []);

  // ---------- Helpers ----------
  const formatNumber = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let val = value;

    // numeric fields: sanitize
    if (
      [
        "inputFromCleaning",
        "outputPacked",
        "numberOfBags",
        "bagWeight",
        "noOfPackets",
        "packetsInEachBag",
      ].includes(name)
    ) {
      val = val.replace(/[^\d.]/g, "");
      if ((val.match(/\./g) || []).length > 1) val = val.replace(/\.+$/, "");
    }

    // if user is directly editing outputPacked, validate against batchCleanedQty
    if (name === "outputPacked") {
      const num = formatNumber(val);
      if (batchCleanedQty && num > batchCleanedQty) {
        // prevent excess values
        alert(`Input cannot exceed cleaned quantity (${batchCleanedQty} kg).`);
        return;
      }
      // update remaining immediately
      setRemainingQty(batchCleanedQty - num);
    }

    // if user edits inputFromCleaning (we consider same as outputPacked here), keep consistency
    if (name === "inputFromCleaning") {
      const num = formatNumber(val);
      if (batchCleanedQty && num > batchCleanedQty) {
        alert(`Input cannot exceed cleaned quantity (${batchCleanedQty} kg).`);
        return;
      }
      setRemainingQty(batchCleanedQty - num);
    }

    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  // ---------- When batch is selected ----------
  useEffect(() => {
    if (!formData.batchId) {
      setSelectedBatch(null);
      setSelectedIncoming(null);
      setBatchCleanedQty(0);
      setRemainingQty(0);
      return;
    }

    const b = batchList.find((x) => x.batchId === formData.batchId);
    setSelectedBatch(b || null);

    // cleaned qty from cleaning record (outputQuantity)
    const cleanedQty = b ? formatNumber(b.outputQuantity) : 0;
    setBatchCleanedQty(cleanedQty);

    // find matching incoming entry by batchId (incoming items list)
    const inc = incomingList.find((it) => it.batchId === formData.batchId);
    setSelectedIncoming(inc || null);

    // set initial item name and default packed/input values if editing not happening
    setFormData((prev) => ({
      ...prev,
      itemName: b?.itemName || prev.itemName,
      inputFromCleaning: b ? cleanedQty : prev.inputFromCleaning,
      outputPacked: b ? Math.min(prev.outputPacked || cleanedQty, cleanedQty) : prev.outputPacked,
    }));

    // recalc remaining based on current outputPacked
    const currentPacked = formatNumber(formData.outputPacked) || 0;
    const rem = cleanedQty - currentPacked;
    setRemainingQty(rem >= 0 ? rem : 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.batchId, batchList, incomingList]);

  // Recalculate wastage automatically (based on inputFromCleaning + inputFromRaw if present)
  useEffect(() => {
    const totalInput = formatNumber(formData.inputFromCleaning);
    const wastage = totalInput - formatNumber(formData.outputPacked);
    setFormData((prev) => ({ ...prev, wastage: wastage >= 0 ? wastage : 0 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.inputFromCleaning, formData.outputPacked]);

  // ---------- Add / Update / Delete ----------
  const handleAdd = async () => {
    const packed = formatNumber(formData.outputPacked);
    const cleaned = batchCleanedQty;
    if (!formData.batchId) {
      alert("Please select a batch ID.");
      return;
    }
    if (packed > cleaned) {
      alert(`Packed quantity (${packed}) cannot exceed cleaned quantity (${cleaned}).`);
      return;
    }

    const payload = { ...formData, createdBy: user.uuid || "" };

    try {
      // Create packing record
      const createRes = await axios.post(API_BASE, payload, { headers: { Authorization: `Bearer ${token}` } });

      // Only update incoming if remaining > 0 and incoming record exists
      const remaining = cleaned - packed;
      if (remaining > 0 && selectedIncoming) {
        // Add remaining to incoming.totalQuantity
        const currentIncomingQty = formatNumber(selectedIncoming.totalQuantity);
        const newTotal = currentIncomingQty + remaining;

        // Use incomingId field in URL as you specified earlier
        const incomingId = selectedIncoming.incomingId || selectedIncoming._id;
        await axios.put(`${MATERIAL_API}/${incomingId}`, { totalQuantity: newTotal }, { headers: { Authorization: `Bearer ${token}` } });

        // refresh incoming list
        await fetchIncomingList();
      }

      // Refresh packing records and UI
      await fetchRecords();
      setShowDialog(false);
      setFormData(initialForm);
      setBatchCleanedQty(0);
      setRemainingQty(0);
      setSelectedBatch(null);
      setSelectedIncoming(null);
    } catch (err) {
      console.error("Error adding packing record:", err);
      alert(err.response?.data?.message || "Error adding record");
    }
  };

  const handleUpdate = async () => {
    if (!selected) return;

    const newPacked = formatNumber(formData.outputPacked);
    const cleaned = batchCleanedQty;

    if (newPacked > cleaned) {
      alert(`Packed quantity (${newPacked}) cannot exceed cleaned quantity (${cleaned}).`);
      return;
    }

    const payload = { ...formData, createdBy: user.uuid || "" };

    try {
      // previous packed value from selected
      const prevPacked = formatNumber(selected.outputPacked || 0);

      // Update packing record
      await axios.put(`${API_BASE}/${selected.packingId}`, payload, { headers: { Authorization: `Bearer ${token}` } });

      // If incoming record exists, compute delta of remaining and apply
      if (selectedIncoming) {
        // prevRemaining = cleaned - prevPacked
        // newRemaining = cleaned - newPacked
        const prevRemaining = cleaned - prevPacked;
        const newRemaining = cleaned - newPacked;
        const delta = newRemaining - prevRemaining; // amount to add to incoming (can be negative)

        if (delta !== 0) {
          const currentIncomingQty = formatNumber(selectedIncoming.totalQuantity);
          const newTotal = currentIncomingQty + delta;

          const incomingId = selectedIncoming.incomingId || selectedIncoming._id;
          await axios.put(`${MATERIAL_API}/${incomingId}`, { totalQuantity: newTotal }, { headers: { Authorization: `Bearer ${token}` } });

          await fetchIncomingList();
        }
      }

      // Refresh packing records and UI
      await fetchRecords();
      setShowDialog(false);
      setEditMode(false);
      setSelected(null);
      setFormData(initialForm);
      setBatchCleanedQty(0);
      setRemainingQty(0);
      setSelectedBatch(null);
      setSelectedIncoming(null);
    } catch (err) {
      console.error("Error updating packing record:", err);
      alert(err.response?.data?.message || "Error updating record");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      await axios.delete(`${API_BASE}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      await fetchRecords();
    } catch (err) {
      console.error("Error deleting packing record:", err);
      alert("Error deleting record");
    }
  };

  // when user clicks edit on a row: populate form, set selected and set batch context
  const handleEditClick = (r) => {
    setSelected(r);
    setFormData({
      batchId: r.batchId || "",
      packingType: r.packingType || "Final Packaging",
      shift: r.shift || "",
      inputFromCleaning: r.inputFromCleaning || 0,
      outputPacked: r.outputPacked || 0,
      numberOfBags: r.numberOfBags || 0,
      bagWeight: r.bagWeight || 0,
      wastage: r.wastage || 0,
      workers: r.workers || "",
      status: r.status || "Pending",
      remarks: r.remarks || "",
      vendorName: r.vendorName || "",
      brandName: r.brandName || "",
      itemName: r.itemName || "",
      noOfPackets: r.noOfPackets || 0,
      packetsInEachBag: r.packetsInEachBag || 0,
      invoiceNumber: r.invoiceNumber || "",
    });
    setEditMode(true);
    setShowDialog(true);

    // set batch context so validation and remaining calc works
    const b = batchList.find((x) => x.batchId === r.batchId);
    setSelectedBatch(b || null);
    const cleanedQty = b ? formatNumber(b.outputQuantity) : 0;
    setBatchCleanedQty(cleanedQty);

    // set selectedIncoming for updating incoming later (if exists)
    const inc = incomingList.find((it) => it.batchId === r.batchId);
    setSelectedIncoming(inc || null);

    const rem = cleanedQty - formatNumber(r.outputPacked || 0);
    setRemainingQty(rem >= 0 ? rem : 0);
  };

  // ---------- JSX ----------
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
        <div className="dialog-overlay" onClick={() => setShowDialog(false)}>
          <div className="dialog" onClick={(e) => e.stopPropagation()}>
            <div className="dialog-header">
              <h3>{editMode ? "Edit Packing Record" : "Add New Packing Record"}</h3>
              <span className="close-icon" onClick={() => setShowDialog(false)}>✖</span>
            </div>

            <div className="form-grid">
              <div className="section-title">Batch Details</div>
              <label>Batch ID</label>
              <select
                value={formData.batchId}
                onChange={(e) => {
                  const id = e.target.value;
                  setFormData({ ...formData, batchId: id });
                }}
              >
                <option value="">Select Batch</option>
                {batchList.map((b) => (
                  <option key={b._id} value={b.batchId}>
                    {b.batchId} - {b.itemName} - {b.outputQuantity} kg
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
              <select value={formData.packingType} onChange={handleChange} name="packingType">
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
                <strong>Remaining after this packing:</strong> {selectedBatch.outputQuantity - formData.inputFromCleaning} kg
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
              <button className="save-btn" onClick={editMode ? handleUpdate : handleAdd}>{editMode ? "Update" : "Add"}</button>
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
              <th>Packing Type</th>
              <th>Shift</th>
              <th>Output</th>
              <th>Bag Weight</th>
              <th>No of Bags</th>
              <th>Packets per Bag</th>
              <th>Status</th>
              <th>Wastage</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.packingId}>
                <td>{r.batchId}</td>
                <td>{r.invoiceNumber || "-"}</td>
                <td>{r.packingType}</td>
                <td>{r.shift}</td>
                <td>{r.outputPacked}</td>
                <td>{r.bagWeight}</td>
                <td>{r.numberOfBags}</td>
                <td>{r.packetsInEachBag}</td>
                <td>{r.status}</td>
                <td>{r.wastage}</td>
                <td>
                  <button onClick={() => handleEditClick(r)}>✏️</button>
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

// // working fine