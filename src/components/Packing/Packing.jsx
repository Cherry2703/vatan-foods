// // Packing.jsx
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "./Packing.css";

// const API_BASE = "https://vatan-foods-backend-final.onrender.com/api/packing";
// const CLEANING_API = "https://vatan-foods-backend-final.onrender.com/api/cleaning";
// const INCOMING_API = "https://vatan-foods-backend-final.onrender.com/api/incoming";

// export default function Packing() {
//   const [records, setRecords] = useState([]);
//   const [batchList, setBatchList] = useState([]);
//   const [selectedBatch, setSelectedBatch] = useState(null);
//   const [cleaningRecords, setCleaningRecords] = useState([]);
//   const [selectedCleaning, setSelectedCleaning] = useState(null);
//   const [showDialog, setShowDialog] = useState(false);
//   const [editMode, setEditMode] = useState(false);
//   const [selected, setSelected] = useState(null);

//   const token = localStorage.getItem("token");
//   const user = JSON.parse(localStorage.getItem("user"));

//   const initialForm = {
//     batchId: "",
//     cleaningId: "",
//     packingType: "Final Packaging",
//     shift: "",
//     inputFromCleaning: 0,
//     outputPacked: 0,
//     numberOfBags: 0,
//     bagWeight: 0,
//     wastage: 0,
//     workers: "",
//     status: "Pending",
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

//   const fetchBatchList = async () => {
//     try {
//       const res = await axios.get(INCOMING_API, { headers: { Authorization: `Bearer ${token}` } });
//       setBatchList(res.data || []);
//     } catch (err) {
//       console.error("Error fetching batches:", err);
//     }
//   };

//   useEffect(() => {
//     fetchRecords();
//     fetchBatchList();
//   }, []);

//   // ---------- Helpers ----------
//   const formatNumber = (v) => {
//     const n = Number(v);
//     return Number.isFinite(n) ? n : 0;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     let val = value;

//     if (["inputFromCleaning", "outputPacked", "numberOfBags", "bagWeight", "noOfPackets", "packetsInEachBag"].includes(name)) {
//       val = val.replace(/[^\d.]/g, "");
//       if ((val.match(/\./g) || []).length > 1) val = val.replace(/\.+$/, "");
//     }

//     setFormData((prev) => ({ ...prev, [name]: val }));
//   };

//   // ---------- When batch is selected ----------
//   useEffect(() => {
//     if (!selectedBatch) return;

//     const fetchCleaningRecords = async (batchId) => {
//       try {
//         const res = await axios.get(`${CLEANING_API}?batchId=${batchId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setCleaningRecords(res.data || []);
//       } catch (err) {
//         console.error("Error fetching cleaning records:", err);
//       }
//     };

//     fetchCleaningRecords(selectedBatch.batchId);

//     // reset cleaning selection
//     setSelectedCleaning(null);
//     setFormData((prev) => ({ ...prev, cleaningId: "", inputFromCleaning: 0, itemName: "" }));
//   }, [selectedBatch]);

//   // ---------- When cleaning record is selected ----------
//   useEffect(() => {
//     if (!selectedCleaning) return;

//     setFormData((prev) => ({
//       ...prev,
//       cleaningId: selectedCleaning.cleaningId,
//       itemName: selectedCleaning.itemName || "",
//       inputFromCleaning: selectedCleaning.outputQuantity || 0,
//       outputPacked: selectedCleaning.outputQuantity || 0,
//     }));
//   }, [selectedCleaning]);

//   // ---------- Calculate wastage ----------
//   useEffect(() => {
//     const wastage = formatNumber(formData.inputFromCleaning) - formatNumber(formData.outputPacked);
//     setFormData((prev) => ({ ...prev, wastage: wastage >= 0 ? wastage : 0 }));
//   }, [formData.inputFromCleaning, formData.outputPacked]);

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
//           onClick={() => { setFormData(initialForm); setEditMode(false); setShowDialog(true); }}
//         >
//           ➕ Add Packing Entry
//         </button>
//       </div>

//       {showDialog && (
//         <div className="dialog-overlay" onClick={() => setShowDialog(false)}>
//           <div className="dialog" onClick={(e) => e.stopPropagation()}>
//             <div className="dialog-header">
//               <h3>{editMode ? "Edit Packing Record" : "Add New Packing Record"}</h3>
//               <span className="close-icon" onClick={() => setShowDialog(false)}>✖</span>
//             </div>

//             <div className="form-grid">
//               {/* Batch Selection */}
//               <div className="section-title">Batch Details</div>
//               <label>Batch ID</label>
//               <select
//                 value={formData.batchId}
//                 onChange={(e) => {
//                   const b = batchList.find(x => x.batchId === e.target.value);
//                   setSelectedBatch(b || null);
//                   setFormData(prev => ({ ...prev, batchId: e.target.value }));
//                 }}
//               >
//                 <option value="">Select Batch</option>
//                 {batchList.map(b => (
//                   <option key={b._id} value={b.batchId}>{b.batchId}</option>
//                 ))}
//               </select>

//               {/* Cleaning Selection */}
//               {cleaningRecords.length > 0 && (
//                 <>
//                   <label>Cleaning Record</label>
//                   <select
//                     value={formData.cleaningId}
//                     onChange={(e) => {
//                       const c = cleaningRecords.find(x => x.cleaningId === e.target.value);
//                       setSelectedCleaning(c || null);
//                     }}
//                   >
//                     <option value="">Select Cleaning Record</option>
//                     {cleaningRecords.map(c => (
//                       <option key={c.cleaningId} value={c.cleaningId}>
//                         {c.cleaningId} | {c.itemName} | Available: {c.outputQuantity} kg
//                       </option>
//                     ))}
//                   </select>
//                 </>
//               )}

//               {selectedCleaning && (
//                 <p className="batch-info">
//                   <strong>Available:</strong> {selectedCleaning.outputQuantity} kg | <strong>Item:</strong> {selectedCleaning.itemName}
//                 </p>
//               )}

//               {/* Packing Info (unchanged) */}
//               <div className="section-title">Packing Info</div>
//               <label>Packing Type</label>
//               <select value={formData.packingType} onChange={handleChange} name="packingType">
//                 <option value="Initial Packaging">Manual Packing</option>
//                 <option value="Final Packaging">Machinery Packing</option>
//               </select>

//               <label>Shift</label>
//               <input name="shift" value={formData.shift} onChange={handleChange} placeholder="Shift A/B/C" />

//               <label>Vendor Name</label>
//               <input name="vendorName" value={formData.vendorName} onChange={handleChange} placeholder="Vendor Name" />

//               <label>Brand Name</label>
//               <input name="brandName" value={formData.brandName} onChange={handleChange} placeholder="Brand Name" />

//               <label>Input Quantity from Cleaning</label>
//               <input name="inputFromCleaning" value={formData.inputFromCleaning} onChange={handleChange} placeholder="Input from Cleaning" />

//               <label>Output Packed</label>
//               <input name="outputPacked" value={formData.outputPacked} onChange={handleChange} placeholder="Output Packed" />

//               <label>Each Packet Weight (kg)</label>
//               <input name="bagWeight" value={formData.bagWeight} onChange={handleChange} placeholder="Bag Weight" />

//               <label>Total No of Packets</label>
//               <input name="noOfPackets" value={formData.noOfPackets} onChange={handleChange} placeholder="No Of Packets" />

//               <label>Number of Boxes</label>
//               <input name="numberOfBags" value={formData.numberOfBags} onChange={handleChange} placeholder="Number of Boxes" />

//               <label>No of Packets in Each Box</label>
//               <input name="packetsInEachBag" value={formData.packetsInEachBag} onChange={handleChange} placeholder="Packets in Each Box" />

//               <label>Workers</label>
//               <input name="workers" value={formData.workers} onChange={handleChange} placeholder="Comma separated" />

//               <label>Status</label>
//               <select name="status" value={formData.status} onChange={handleChange}>
//                 <option value="Pending">Pending</option>
//                 <option value="Ongoing">Ongoing</option>
//                 <option value="Completed">Completed</option>
//               </select>

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

//       {/* Table (unchanged) */}
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










// Packing.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Packing.css";

const API_BASE = "https://vatan-foods-backend-final.onrender.com/api/packing";
const BATCH_API = "https://vatan-foods-backend-final.onrender.com/api/cleaning";
const MATERIAL_API = "https://vatan-foods-backend-final.onrender.com/api/incoming";

export default function Packing() {
  const [records, setRecords] = useState([]);
  const [batchList, setBatchList] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selected, setSelected] = useState(null);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const initialForm = {
    batchId: "",
    packingType: "Final Packaging",
    shift: "",
    // inputFromRaw: 0,
    inputFromCleaning: 0,
    outputPacked: 0,
    numberOfBags: 0,
    bagWeight: 0,
    wastage: 0,
    workers: "",
    status: "Pending",
    // pendingReason: "",
    remarks: "",
    vendorName: "",
    brandName: "",
    itemName: "",
    noOfPackets: 0,
    packetsInEachBag: 0,
  };

  const [formData, setFormData] = useState(initialForm);

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
      const res = await axios.get(BATCH_API, { headers: { Authorization: `Bearer ${token}` } });
      setBatchList(res.data || []);
    } catch (err) {
      console.error("Error fetching batch list:", err);
    }
  };

  useEffect(() => {
    fetchRecords();
    fetchBatchIds();
  }, []);

  // ---------- Helpers ----------
  const formatNumber = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let val = value;

    if (["inputFromRaw", "inputFromCleaning", "outputPacked", "numberOfBags", "bagWeight", "noOfPackets", "packetsInEachBag"].includes(name)) {
      val = val.replace(/[^\d.]/g, "");
      if ((val.match(/\./g) || []).length > 1) val = val.replace(/\.+$/, "");
    }

    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  // Update itemName and outputQuantity from selected batch
  useEffect(() => {
    if (!selectedBatch) return;
    const fetchMaterial = async (id) => {
      try {
        const res = await axios.get(`${MATERIAL_API}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        setFormData((prev) => ({
          ...prev,
          itemName: res.data.itemName || selectedBatch.itemName,
          outputPacked: res.data.outputQuantity || 0,
        }));
      } catch (err) {
        console.error("Error fetching material:", err);
      }
    };
    fetchMaterial(selectedBatch.batchId);
  }, [selectedBatch]);

  // Recalculate wastage
  useEffect(() => {
    const totalInput = formatNumber(formData.inputFromRaw) + formatNumber(formData.inputFromCleaning);
    const wastage = totalInput - formatNumber(formData.outputPacked);
    setFormData((prev) => ({ ...prev, wastage: wastage >= 0 ? wastage : 0 }));
  }, [formData.inputFromRaw, formData.inputFromCleaning, formData.outputPacked]);

  // ---------- Add / Update / Delete ----------
  const handleAdd = async () => {
    const payload = { ...formData, createdBy: user.uuid || "" };
    try {
      await axios.post(API_BASE, payload, { headers: { Authorization: `Bearer ${token}` } });
      setShowDialog(false);
      setFormData(initialForm);
      fetchRecords();
    } catch (err) {
      console.error("Error adding packing record:", err);
      alert(err.response?.data?.message || "Error adding record");
    }
  };

  const handleUpdate = async () => {
    if (!selected) return;
    const payload = { ...formData, createdBy: user.uuid || "" };
    try {
      await axios.put(`${API_BASE}/${selected.packingId}`, payload, { headers: { Authorization: `Bearer ${token}` } });
      setShowDialog(false);
      setEditMode(false);
      setSelected(null);
      setFormData(initialForm);
      fetchRecords();
    } catch (err) {
      console.error("Error updating packing record:", err);
      alert(err.response?.data?.message || "Error updating record");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      await axios.delete(`${API_BASE}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchRecords();
    } catch (err) {
      console.error("Error deleting packing record:", err);
      alert("Error deleting record");
    }
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
            setShowDialog(true);
          }}
        >
          ➕ Add Packing Entry
        </button>
      </div>

      {/* ---------- Dialog ---------- */}
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
                  const b = batchList.find((x) => x.batchId === id);
                  setSelectedBatch(b || null);
                }}
              >
                <option value="">Select Batch</option>
                {batchList.map((b) => (
                  <option key={b._id} value={b.batchId}>{b.batchId}</option>
                ))}
              </select>

              

              {selectedBatch && (
                <p className="batch-info">
                  <strong>Available:</strong> {selectedBatch.outputQuantity} kg | <strong>Item:</strong> {selectedBatch.itemName}
                </p>
              )}

              <div className="section-title">Packing Info</div>
              <label>Packing Type</label>
              <select value={formData.packingType} onChange={handleChange} name="packingType">
                <option value="Initial Packaging">Manual Packing</option>
                <option value="Final Packaging">Machinery Packing</option>
              </select>

              <label>Shift</label>
              <input name="shift" value={formData.shift} onChange={handleChange} placeholder="Shift A/B/C" />

              <label>Vendor Name</label>
              <input name="vendorName" placeholder="Vendor Name" value={formData.vendorName} onChange={handleChange} />

              <label>Brand Name</label>
              <input name="brandName" placeholder="Brand Name" value={formData.brandName} onChange={handleChange} />

              {/* <label>Input from Raw</label>
              <input name="inputFromRaw" placeholder="Input From Raw" type="text" value={formData.inputFromRaw} onChange={handleChange} /> */}

              <label>Input Quantity from Cleaning</label>
              <input name="inputFromCleaning" placeholder="Input From Cleaning" type="text" value={formData.inputFromCleaning} onChange={handleChange} />

              <label>Output Packed</label>
              <input name="outputPacked" placeholder="Output Packed" type="text" value={formData.outputPacked} onChange={handleChange} />


              <label>Each Packet Weight (kg)</label>
              <input name="bagWeight" placeholder="Each Pack Weight" type="text" value={formData.bagWeight} onChange={handleChange} />

              <label>Total No of Packets</label>
              <input name="noOfPackets" placeholder="Total No Of Packets" type="text" value={formData.noOfPackets} onChange={handleChange} />

              <label>Number of Boxes</label>
              <input name="numberOfBags" placeholder="Number Of Boxes" type="text" value={formData.numberOfBags} onChange={handleChange} />

              <label>No of Packets in Each Box</label>
              <input name="packetsInEachBag" placeholder="No of Pakets In Each Box" type="text" value={formData.packetsInEachBag} onChange={handleChange} />
              

              <label>Workers</label>
              <input name="workers" value={formData.workers} onChange={handleChange} placeholder="Comma separated" />

              <label>Status</label>
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="Pending">Pending</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
              </select>

              {/* {formData.status === "Pending" && (
                <>
                  <label>Pending Reason</label>
                  <select name="pendingReason" value={formData.pendingReason} onChange={handleChange}>
                    <option value="">Select Reason</option>
                    <option value="Stock shortage">Stock shortage</option>
                    <option value="Machine issue">Machine issue</option>
                    <option value="Labor shortage">Labor shortage</option>
                    <option value="Other">Other</option>
                  </select>
                </>
              )} */}

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

      {/* ---------- Table ---------- */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Batch ID</th>
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
                <td>{r.packingType}</td>
                <td>{r.shift}</td>
                <td>{r.outputPacked}</td>
                <td>{r.bagWeight}</td>
                <td>{r.numberOfBags}</td>
                <td>{r.packetsInEachBag}</td>
                <td>{r.status}</td>
                <td>{r.wastage}</td>
                <td>
                  <button onClick={() => { setSelected(r); setFormData(r); setEditMode(true); setShowDialog(true); }}>✏️</button>
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


// working fine