// import React, { useEffect, useState } from "react";
// import "./Materials.css";
// import { 
//   FaPlus, FaEdit, FaTrash, FaSearch, FaTruck, FaBoxes, FaExclamationTriangle 
// } from "react-icons/fa";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const API_BASE = "https://vatan-foods-backend-final.onrender.com/api/incoming";

// const Materials = () => {
//   const navigate = useNavigate();
//   const [materials, setMaterials] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showAddDialog, setShowAddDialog] = useState(false);
//   const [showEditDialog, setShowEditDialog] = useState(false);
//   const [showDeleteDialog, setShowDeleteDialog] = useState(false);
//   const [selectedItem, setSelectedItem] = useState(null);

//   const initialForm = {
//     batchId: "",
//     billNo: "",
//     vendorName: "",
//     vendorAddress: "",
//     itemName: "",
//     unit: "kg",
//     totalQuantity: "",
//     vehicleNo: "",
//     driverName: "",
//     driverMobile: "",
//     remarks: "",
//   };
//   const [formData, setFormData] = useState(initialForm);

//   const user = JSON.parse(localStorage.getItem("user"));

//   useEffect(() => {
//     if (!user) navigate("/login", { replace: true });
//   }, [user, navigate]);

//   const fetchMaterials = async () => {
//     try {
//       const res = await axios.get(API_BASE, {
//         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//       });
//       setMaterials(res.data);
//     } catch (err) {
//       console.error("❌ Error fetching:", err);
//     }
//   };

//   useEffect(() => {
//     if (user) fetchMaterials();
//   }, [user]);

//   if (!user) return null;

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleAddMaterial = async () => {
//     try {
//       const payload = { ...formData, createdBy: user.uuid || "" };
//       await axios.post(API_BASE, payload, {
//         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//       });
//       setShowAddDialog(false);
//       setFormData(initialForm);
//       fetchMaterials();
//     } catch (err) {
//       console.error("❌ Error adding material:", err);
//     }
//   };

//   const handleUpdateMaterial = async () => {
//     try {
//       const payload = { ...formData, createdBy: user.uuid || "", incomingId: selectedItem.incomingId };
//       await axios.put(`${API_BASE}/${selectedItem.incomingId}`, payload, {
//         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//       });
//       setShowEditDialog(false);
//       setFormData(initialForm);
//       fetchMaterials();
//     } catch (err) {
//       console.error("❌ Error updating:", err);
//     }
//   };

//   const handleDeleteMaterial = async () => {
//     try {
//       if (!selectedItem?.incomingId) return;
//       await axios.delete(`${API_BASE}/${selectedItem.incomingId}`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//       });
//       setShowDeleteDialog(false);
//       fetchMaterials();
//     } catch (err) {
//       console.error("❌ Error deleting:", err.response?.data || err.message);
//     }
//   };

//   const filteredMaterials = materials.filter((m) =>
//     m.itemName?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="materials-container">
//       {/* Header */}
//       <div className="materials-header">
//         <div>
//           <h1>Incoming Materials</h1>
//           <p>Manage and track raw materials</p>
//         </div>
//         <button
//           className="add-btn"
//           onClick={() => { setFormData(initialForm); setShowAddDialog(true); }}
//         >
//           <FaPlus /> Add Material
//         </button>
//       </div>

//       {/* Summary */}
//       <div className="summary-cards">
//         <div className="summary-card">
//           <FaBoxes className="icon primary" />
//           <div>
//             <p>Total Records</p>
//             <h2>{materials.length}</h2>
//           </div>
//         </div>

//         <div className="summary-card">
//           <FaTruck className="icon success" />
//           <div>
//             <p>Total Quantity</p>
//             <h2>{materials.reduce((sum, m) => sum + (Number(m.totalQuantity) || 0), 0)} kg</h2>
//           </div>
//         </div>

//         <div className="summary-card warning">
//           <FaExclamationTriangle className="icon warning" />
//           <div>
//             <p>Vendors</p>
//             <h2>{new Set(materials.map((m) => m.vendorName)).size}</h2>
//           </div>
//         </div>
//       </div>

//       {/* Search */}
//       <div className="search-bar">
//         <FaSearch className="search-icon" />
//         <input
//           type="text"
//           placeholder="Search materials..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//       </div>

//       {/* Table */}
//       <div className="table-container">
//         <table className="materials-table">
//           <thead>
//             <tr>
//               <th>Batch ID</th>
//               <th>Item</th>
//               <th>Total Qty(Present)</th>
//               <th>Unit</th>
//               <th>Vendor</th>
//               <th>Driver</th>
//               <th>Vehicle</th>
//               <th>Remarks</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredMaterials.length > 0 ? (
//               filteredMaterials.map((mat) => (
//                 <tr key={mat._id}>
//                   <td>{mat.batchId}</td>
//                   <td className="bold">{mat.itemName}</td>
//                   <td>{mat.totalQuantity}</td>
//                   <td>{mat.unit}</td>
//                   <td>{mat.vendorName}</td>
//                   <td>{mat.driverName}</td>
//                   <td>{mat.vehicleNo}</td>
//                   <td>{mat.remarks}</td>
//                   <td className="actions">
//                     <button
//                       className="edit-btn"
//                       onClick={() => { setSelectedItem(mat); setFormData(mat); setShowEditDialog(true); }}
//                     >
//                       <FaEdit />
//                     </button>
//                     <button
//                       className="delete-btn"
//                       onClick={() => { setSelectedItem(mat); setShowDeleteDialog(true); }}
//                     >
//                       <FaTrash />
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="9" className="no-data">No records found</td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Add/Edit Dialog */}
//       {(showAddDialog || (showEditDialog && selectedItem)) && (
//         <PopupDialog
//           title={showAddDialog ? "Add New Material" : "Edit Material"}
//           formData={formData}
//           onChange={handleChange}
//           onClose={() => {
//             setShowAddDialog(false);
//             setShowEditDialog(false);
//           }}
//           onSubmit={showAddDialog ? handleAddMaterial : handleUpdateMaterial}
//         />
//       )}

//       {/* Delete Dialog */}
//       {showDeleteDialog && selectedItem && (
//         <div className="dialog-overlay">
//           <div className="dialog delete-dialog">
//             <h3>Confirm Delete</h3>
//             <p>
//               Delete <b>{selectedItem.itemName}</b> ({selectedItem.batchId})?
//             </p>
//             <div className="dialog-actions">
//               <button onClick={() => setShowDeleteDialog(false)}>Cancel</button>
//               <button className="delete-btn" onClick={handleDeleteMaterial}>Delete</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// // Popup Dialog Component
// const PopupDialog = ({ title, formData, onChange, onClose, onSubmit }) => {
//   const visibleFields = [
//     "batchId",
//     "billNo",
//     "vendorName",
//     "vendorAddress",
//     "itemName",
//     "unit",
//     "totalQuantity",
//     "vehicleNo",
//     "driverName",
//     "driverMobile",
//     "remarks"
//   ];

//   const handleInputChange = (e) => {
//     let { name, value } = e.target;

//     if (name === "driverMobile") value = value.replace(/\D/g, "").slice(0, 10);
//     if (name === "vehicleNo") value = value.toUpperCase().replace(/[^A-Z0-9]/g, "");

//     onChange({ target: { name, value } });
//   };

//   return (
//     <div className="dialog-overlay">
//       <div className="dialog scrollable">
//         <h3>{title}</h3>
//         <div className="dialog-body">
//           <div className="form-grid">
//             {visibleFields.map((key) => (
//               <div className="form-field" key={key}>
//                 {key === "unit" ? (
//                   <>
//                     <label>Unit</label>
//                     <select name={key} value={formData[key] || ""} onChange={handleInputChange}>
//                       <option value="kg">Kg</option>
//                       <option value="gms">Grams</option>
//                       <option value="ltr">Litre</option>
//                       <option value="pcs">Pieces</option>
//                     </select>
//                   </>
//                 ) : (
//                   <>
//                     <label>{key.replace(/([A-Z])/g, " $1")}</label>
//                     <input
//                       name={key}
//                       placeholder={`Enter ${key}`}
//                       value={formData[key] || ""}
//                       onChange={handleInputChange}
//                     />
//                   </>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//         <div className="dialog-actions">
//           <button onClick={onClose}>Cancel</button>
//           <button className="save-btn" onClick={onSubmit}>Save</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Materials;





import React, { useEffect, useState } from "react";
import "./Materials.css";
import { 
  FaPlus, FaEdit, FaTrash, FaSearch, FaTruck, FaBoxes, FaExclamationTriangle 
} from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = "https://vatan-foods-backend-final.onrender.com/api/incoming";

const Materials = () => {
  const navigate = useNavigate();
  const [materials, setMaterials] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("itemName"); // default search by itemName
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const initialForm = {
    batchId: "",
    billNo: "",
    vendorName: "",
    vendorAddress: "",
    itemName: "",
    unit: "kg",
    totalQuantity: "",
    vehicleNo: "",
    driverName: "",
    driverMobile: "",
    remarks: "",
  };
  const [formData, setFormData] = useState(initialForm);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) navigate("/login", { replace: true });
  }, [user, navigate]);

  const fetchMaterials = async () => {
    try {
      const res = await axios.get(API_BASE, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setMaterials(res.data);
    } catch (err) {
      console.error("❌ Error fetching:", err);
    }
  };

  useEffect(() => {
    if (user) fetchMaterials();
  }, [user]);

  if (!user) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddMaterial = async () => {
    try {
      const payload = { ...formData, createdBy: user.uuid || "" };
      await axios.post(API_BASE, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setShowAddDialog(false);
      setFormData(initialForm);
      fetchMaterials();
    } catch (err) {
      console.error("❌ Error adding material:", err);
    }
  };

  const handleUpdateMaterial = async () => {
    try {
      const payload = { ...formData, createdBy: user.uuid || "", incomingId: selectedItem.incomingId };
      await axios.put(`${API_BASE}/${selectedItem.incomingId}`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setShowEditDialog(false);
      setFormData(initialForm);
      fetchMaterials();
    } catch (err) {
      console.error("❌ Error updating:", err);
    }
  };

  const handleDeleteMaterial = async () => {
    try {
      if (!selectedItem?.incomingId) return;
      await axios.delete(`${API_BASE}/${selectedItem.incomingId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setShowDeleteDialog(false);
      fetchMaterials();
    } catch (err) {
      console.error("❌ Error deleting:", err.response?.data || err.message);
    }
  };

  // Filter based on searchType and searchTerm
  const filteredMaterials = materials.filter((m) => {
    if (!searchTerm) return true;
    const field = m[searchType] || "";
    return field.toString().toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="materials-container">
      {/* Header */}
      <div className="materials-header">
        <div>
          <h1>Incoming Materials</h1>
          <p>Manage and track raw materials</p>
        </div>
        <button
          className="add-btn"
          onClick={() => { setFormData(initialForm); setShowAddDialog(true); }}
        >
          <FaPlus /> Add Material
        </button>
      </div>

      {/* Summary */}
      <div className="summary-cards">
        <div className="summary-card">
          <FaBoxes className="icon primary" />
          <div>
            <p>Total Records</p>
            <h2>{materials.length}</h2>
          </div>
        </div>

        <div className="summary-card">
          <FaTruck className="icon success" />
          <div>
            <p>Total Quantity</p>
            <h2>{materials.reduce((sum, m) => sum + (Number(m.totalQuantity) || 0), 0)} kg</h2>
          </div>
        </div>

        <div className="summary-card warning">
          <FaExclamationTriangle className="icon warning" />
          <div>
            <p>Vendors</p>
            <h2>{new Set(materials.map((m) => m.vendorName)).size}</h2>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="search-bar">
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          style={{ marginRight: "10px" }}
          className="select-search"
        >
          <option value="itemName">Item Name</option>
          <option value="batchId">Batch ID</option>
        </select>
        <div className="search-input-cont">

        
            <input
              type="text"
              placeholder={`Search by ${searchType}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />  
                      <FaSearch className="search-icon" />

        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="materials-table">
          <thead>
            <tr>
              <th>Batch ID</th>
              <th>Item</th>
              <th>Total Qty(Present)</th>
              <th>Unit</th>
              <th>Vendor</th>
              <th>Driver</th>
              <th>Vehicle</th>
              <th>Remarks</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMaterials.length > 0 ? (
              filteredMaterials.map((mat) => (
                <tr key={mat._id}>
                  <td>{mat.batchId}</td>
                  <td className="bold">{mat.itemName}</td>
                  <td>{mat.totalQuantity}</td>
                  <td>{mat.unit}</td>
                  <td>{mat.vendorName}</td>
                  <td>{mat.driverName}</td>
                  <td>{mat.vehicleNo}</td>
                  <td>{mat.remarks}</td>
                  <td className="actions">
                    <button
                      className="edit-btn"
                      onClick={() => { setSelectedItem(mat); setFormData(mat); setShowEditDialog(true); }}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => { setSelectedItem(mat); setShowDeleteDialog(true); }}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="no-data">No records found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Dialog */}
      {(showAddDialog || (showEditDialog && selectedItem)) && (
        <PopupDialog
          title={showAddDialog ? "Add New Material" : "Edit Material"}
          formData={formData}
          onChange={handleChange}
          onClose={() => {
            setShowAddDialog(false);
            setShowEditDialog(false);
          }}
          onSubmit={showAddDialog ? handleAddMaterial : handleUpdateMaterial}
        />
      )}

      {/* Delete Dialog */}
      {showDeleteDialog && selectedItem && (
        <div className="dialog-overlay">
          <div className="dialog delete-dialog">
            <h3>Confirm Delete</h3>
            <p>
              Delete <b>{selectedItem.itemName}</b> ({selectedItem.batchId})?
            </p>
            <div className="dialog-actions">
              <button onClick={() => setShowDeleteDialog(false)}>Cancel</button>
              <button className="delete-btn" onClick={handleDeleteMaterial}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Popup Dialog Component
const PopupDialog = ({ title, formData, onChange, onClose, onSubmit }) => {
  const visibleFields = [
    "batchId",
    "billNo",
    "vendorName",
    "vendorAddress",
    "itemName",
    "unit",
    "totalQuantity",
    "vehicleNo",
    "driverName",
    "driverMobile",
    "remarks"
  ];

  const handleInputChange = (e) => {
    let { name, value } = e.target;

    if (name === "driverMobile") value = value.replace(/\D/g, "").slice(0, 10);
    if (name === "vehicleNo") value = value.toUpperCase().replace(/[^A-Z0-9]/g, "");

    onChange({ target: { name, value } });
  };

  return (
    <div className="dialog-overlay">
      <div className="dialog scrollable">
        <h3>{title}</h3>
        <div className="dialog-body">
          <div className="form-grid">
            {visibleFields.map((key) => (
              <div className="form-field" key={key}>
                {key === "unit" ? (
                  <>
                    <label>Unit</label>
                    <select name={key} value={formData[key] || ""} onChange={handleInputChange}>
                      <option value="kg">Kg</option>
                      <option value="gms">Grams</option>
                      <option value="ltr">Litre</option>
                      <option value="pcs">Pieces</option>
                    </select>
                  </>
                ) : (
                  <>
                    <label>{key.replace(/([A-Z])/g, " $1")}</label>
                    <input
                      name={key}
                      placeholder={`Enter ${key}`}
                      value={formData[key] || ""}
                      onChange={handleInputChange}
                    />
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="dialog-actions">
          <button onClick={onClose}>Cancel</button>
          <button className="save-btn" onClick={onSubmit}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default Materials;
