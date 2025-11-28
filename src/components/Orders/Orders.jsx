
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './Orders.css';

// const API_BASE = 'http://localhost:5000/api/orders';

// const states = [
//   'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi'
// ];

// export default function Orders() {
//   const [orders, setOrders] = useState([]);
//   const [showPopup, setShowPopup] = useState(false);
//   const [showEditPopup, setShowEditPopup] = useState(false);
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [deleteId, setDeleteId] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [selectedPdf, setSelectedPdf] = useState(null);

//   console.log(orders);
  

//   const emptyForm = {
//     customerName: '',
//     customerType: 'Retail',
//     contactPerson: '',
//     contactNumber: '',
//     email: '',
//     vendorName: '',
//     vendorAddress: '',
//     vendorGSTIN: '',
//     poNumber: '',
//     poDate: '',
//     items: [{ name: '', quantity: '', unit: '', pricePerUnit: '' }],
//     totalAmount: '',
//     deliveryAddress: '',
//     deliveryCity: '',
//     deliveryState: '',
//     deliveryPincode: '',
//     deliveryDate: '',
//     deliveryTimeSlot: '10:00 AM - 12:00 PM',
//     assignedVehicle: '',
//     driverName: '',
//     driverContact: '',
//     warehouseLocation: '',
//     remarks: '',
//   };

//   const [formData, setFormData] = useState(emptyForm);

//   // fetch orders
//   const fetchOrders = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get(API_BASE, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
//       setOrders(res.data || []);
//     } catch (err) {
//       console.error('❌ Error fetching orders:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { fetchOrders(); }, []);

//   // handlers
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleItemChange = (index, e) => {
//     const { name, value } = e.target;
//     setFormData(prev => {
//       const items = [...prev.items];
//       items[index] = { ...items[index], [name]: value };
//       return { ...prev, items };
//     });
//   };

//   const addItem = () => setFormData(prev => ({ ...prev, items: [...prev.items, { name: '', quantity: '', unit: '', pricePerUnit: '', batchNo: '' }] }));
//   const deleteItem = (index) => setFormData(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }));

//   // auto-calc total
//   useEffect(() => {
//     const total = formData.items.reduce((sum, it) => {
//       const qty = parseFloat(it.quantity) || 0;
//       const price = parseFloat(it.pricePerUnit) || 0;
//       return sum + qty * price;
//     }, 0);
//     setFormData(prev => ({ ...prev, totalAmount: total.toFixed(2) }));
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [formData.items.length, JSON.stringify(formData.items)]);

//   // create
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const data = new FormData();
//       console.log("orders form data input : ", data);
      
//       Object.entries(formData).forEach(([k, v]) => {
//         if (k === 'items') data.append('items', JSON.stringify(v));
//         else data.append(k, v);
//       });
//       if (selectedPdf) data.append('orderPdf', selectedPdf);
//       await axios.post(API_BASE, data, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'multipart/form-data' } });
//       fetchOrders();
//       setShowPopup(false);
//       setFormData(emptyForm);
//       setSelectedPdf(null);
//     } catch (err) { console.error('❌ Error creating order:', err); }
//   };

//   // edit
//   const handleEdit = (order) => { setSelectedOrder(order); setFormData({ ...order, items: order.items || [] }); setShowEditPopup(true); };
//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.put(`${API_BASE}/${selectedOrder._id}`, formData, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' } });
//       fetchOrders();
//       setShowEditPopup(false);
//       setSelectedOrder(null);
//     } catch (err) { console.error('❌ Error updating order:', err); }
//   };

//   // delete
//   const confirmDelete = (id) => { setDeleteId(id); setShowDeleteConfirm(true); };
//   const handleDelete = async () => {
//     try {
//       await axios.delete(`${API_BASE}/${deleteId}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
//       setOrders(prev => prev.filter(o => o._id !== deleteId));
//       setShowDeleteConfirm(false);
//     } catch (err) { console.error('❌ Error deleting order:', err); }
//   };

//   // reusable form UI with labels above inputs (Option A)
//   const renderFormFields = (onSubmit, buttonText) => (
//     <form onSubmit={onSubmit} className="form-root">
//       <div className="form-grid">
//         <div className="field">
//           <label htmlFor="customerName">Customer Name</label>
//           <input id="customerName" name="customerName" value={formData.customerName} onChange={handleChange} required />
//         </div>

//         <div className="field">
//           <label htmlFor="customerType">Customer Type</label>
//           <select id="customerType" name="customerType" value={formData.customerType} onChange={handleChange}>
//             <option value="Retail">Retail</option>
//             <option value="Wholesale">Wholesale</option>
//             <option value="Distributor">Distributor</option>
//           </select>
//         </div>

//         <div className="field">
//           <label htmlFor="contactPerson">Contact Person</label>
//           <input id="contactPerson" name="contactPerson" value={formData.contactPerson} onChange={handleChange} required />
//         </div>

//         <div className="field">
//           <label htmlFor="contactNumber">Contact Number</label>
//           <input id="contactNumber" name="contactNumber" value={formData.contactNumber} onChange={handleChange} required />
//         </div>

//         <div className="field">
//           <label htmlFor="email">Email</label>
//           <input id="email" name="email" value={formData.email} onChange={handleChange} required />
//         </div>

        
      
//         <div className="field">
//           <label htmlFor="vendorName">Vendor Name</label>
//           <input id="vendorName" name="vendorName" value={formData.vendorName} onChange={handleChange} />
//         </div>

//         <div className="field">
//           <label htmlFor="vendorAddress">Vendor Address</label>
//           <input id="vendorAddress" name="vendorAddress" value={formData.vendorAddress} onChange={handleChange} />
//         </div>

//         <div className="field">
//           <label htmlFor="vendorGSTIN">Vendor GSTIN</label>
//           <input id="vendorGSTIN" name="vendorGSTIN" value={formData.vendorGSTIN} onChange={handleChange} />
//         </div>

//         <div className="field">
//           <label htmlFor="poNumber">PO Number</label>
//           <input id="poNumber" name="poNumber" value={formData.poNumber} onChange={handleChange} />
//         </div>
      
//         <div className="field">
//           <label htmlFor="poDate">Ordered Date</label>
//           <input id="poDate" name="poDate" type="date" value={formData.poDate?.split('T')[0] || ''} onChange={handleChange} />
//         </div>
    
    
    
         
//       </div>
//       <div className='form-grid2'>
//         <div><h4 className="section-title">Items</h4></div>

//         {formData.items.map((item, idx) => (
//           <div key={idx} className="items-row">
//             <div className="field small">
//               <label>Item Name</label>
//               <input name="name" value={item.name} onChange={(e) => handleItemChange(idx, e)} required />
//             </div>

//             <div className="field tiny">
//               <label>Qty</label>
//               <input name="quantity" type="number" value={item.quantity} onChange={(e) => handleItemChange(idx, e)} required />
//             </div>

//             <div className="field tiny">
//               <label>Unit</label>
//               <select name="unit" value={item.unit} onChange={(e) => handleItemChange(idx, e)} required>
//                 <option value="">Select</option>
//                 <option value="pcs">Pieces</option>
//                 <option value="kg">Kilograms</option>
//                 <option value="litre">Litres</option>
//               </select>
//             </div>

//             <div className="field small">
//               <label>Price/Unit</label>
//               <input name="pricePerUnit" type="number" value={item.pricePerUnit} onChange={(e) => handleItemChange(idx, e)} required />
//             </div>

//             <div className="item-actions">
//               {formData.items.length > 1 && (
//                 <button type="button" className="icon-btn" onClick={() => deleteItem(idx)} aria-label="Remove item">🗑️</button>
//               )}
//             </div>
//           </div>
//         ))}

//         <div className="row-actions">
//           <button type="button" onClick={addItem} className="secondary">➕ Add Item</button>
//         </div>

//         <div className="form-grid">
//           <div className="field">
//             <label>Total (₹)</label>
//             <input name="totalAmount" type="number" value={formData.totalAmount} readOnly />
//           </div>

//           <div className="field">
//             <label>Delivery Date</label>
//             <input name="deliveryDate" type="date" value={formData.deliveryDate?.split('T')[0] || ''} onChange={handleChange} required />
//           </div>

//           <div className="field">
//             <label>City</label>
//             <input name="deliveryCity" value={formData.deliveryCity} onChange={handleChange} required />
//           </div>

//           <div className="field">
//             <label>State</label>
//             <select name="deliveryState" value={formData.deliveryState} onChange={handleChange} required>
//               <option value="">Select State</option>
//               {states.map(s => <option key={s} value={s}>{s}</option>)}
//             </select>
//           </div>

//           <div className="field">
//             <label>Pincode</label>
//             <input name="deliveryPincode" value={formData.deliveryPincode} onChange={handleChange} required />
//           </div>
//         </div>

//         <div className="field full">
//           <label>Delivery Address</label>
//           <textarea name="deliveryAddress" rows="3" value={formData.deliveryAddress} onChange={handleChange} />
//         </div>

//         <div className="form-grid">
//           <div className="field">
//             <label>Vehicle Number</label>
//             <input name="assignedVehicle" value={formData.assignedVehicle} onChange={handleChange} />
//           </div>
//           <div className="field">
//             <label>Driver Name</label>
//             <input name="driverName" value={formData.driverName} onChange={handleChange} />
//           </div>
//           <div className="field">
//             <label>Driver Contact</label>
//             <input name="driverContact" value={formData.driverContact} onChange={handleChange} />
//           </div>
//         </div>

//         <div className="field full">
//           <label>Remarks</label>
//           <textarea name="remarks" rows="2" value={formData.remarks} onChange={handleChange} />
//         </div>

//         <div className="popup-actions">
//           <button type="button" className="ghost" onClick={() => { setShowPopup(false); setShowEditPopup(false); }}>Cancel</button>
//           <button type="submit" className="primary">{buttonText}</button>
//         </div>
//       </div>

//     </form>
//   );

//   return (
//     <div className="orders-container theme-admin">
//       <div className="orders-header">
//         <h2>📦 Orders Management</h2>
//         <div className="header-actions">
//           <button className="add-btn" onClick={() => { setFormData(emptyForm); setSelectedPdf(null); setShowPopup(true); }}>➕ Add Order</button>
//         </div>
//       </div>

//       {loading ? <p className="muted">Loading orders...</p> : (
//         <>
//           <div className="orders-table-wrapper">
//             <table className="orders-table">
//               <thead>
//                 <tr>
//                   <th>Customer</th>
//                   {/* <th>Ordered Date</th> */}
//                   <th>Contact</th>
//                   <th>City</th>
//                   <th>Total</th>
//                   <th>Delivery</th>
//                   {/* <th>PDF</th> */}
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {orders.length > 0 ? orders.map(order => (
//                   <tr key={order._id}>
//                     <td className="sticky-column"><strong>{order.customerName}</strong><div className="muted small">{order.vendorName}</div></td>
//                     {/* <td>{order.poDate?.split('T')[0] || '—'}</td> */}
//                     <td>{order.contactNumber}</td>
//                     <td>{order.deliveryCity}</td>
//                     <td>₹{order.totalAmount}</td>
//                     <td>{order.deliveryDate?.split('T')[0] || '—'}</td>
//                     {/* need to add pdf in future */}
//                     {/* <td>{order.pdfUrl ? <a href={order.pdfUrl} target="_blank" rel="noreferrer" className="pdf-link">View</a> : '-'}</td> */}
//                     <td className="actions-cell">
//                       <button className="btn small" onClick={() => setSelectedOrder(order)}>📄 Show Items</button>
//                       <button className="btn small" onClick={() => handleEdit(order)}>✏️</button>
//                       <button className="btn danger small" onClick={() => confirmDelete(order._id)}>🗑️</button>
//                     </td>
//                   </tr>
//                 )) : (
//                   <tr><td colSpan="8" style={{ textAlign: 'center' }}>No orders found</td></tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {selectedOrder && (
//             <div className="popup-overlay" onClick={() => setSelectedOrder(null)}>
//               <div className="popup order-items-popup" onClick={(e) => e.stopPropagation()}>
//                 <h3>📦 Items in Order</h3>
//                 <p><strong>Customer:</strong> {selectedOrder.customerName}</p>
//                 <p><strong>Delivery City:</strong> {selectedOrder.deliveryCity}</p>

//                 <table className="items-table">
//                   <thead>
//                     <tr>
//                       <th>Item Name</th>
//                       <th>Quantity</th>
//                       <th>Unit</th>
//                       <th>Price per Unit</th>
//                       <th>Total Price</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {selectedOrder.items.map((item, idx) => (
//                       <tr key={idx}>
//                         <td>{item.name}</td>
//                         <td>{item.quantity}</td>
//                         <td>{item.unit}</td>
//                         <td>₹{item.pricePerUnit}</td>
//                         <td>₹{(item.quantity * item.pricePerUnit).toFixed?.(2) ?? item.quantity * item.pricePerUnit}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>

//                 <div className="popup-actions">
//                   <button onClick={() => setSelectedOrder(null)} className="primary">Close</button>
//                 </div>
//               </div>
//             </div>
//           )}

//         </>
//       )}

//       {/* Add Popup */}
//       {showPopup && (
//         <div className="popup-overlay" onClick={() => setShowPopup(false)}>
//           <div className="popup" onClick={(e) => e.stopPropagation()}>
//             <h3>➕ Add New Order</h3>
//             {renderFormFields(handleSubmit, 'Create Order')}
//           </div>
//         </div>
//       )}

//       {/* Edit Popup */}
//       {showEditPopup && (
//         <div className="popup-overlay" onClick={() => setShowEditPopup(false)}>
//           <div className="popup" onClick={(e) => e.stopPropagation()}>
//             <h3>✏️ Edit Order</h3>
//             {renderFormFields(handleUpdate, 'Update Order')}
//           </div>
//         </div>
//       )}

//       {/* Delete Confirm */}
//       {showDeleteConfirm && (
//         <div className="popup-overlay" onClick={() => setShowDeleteConfirm(false)}>
//           <div className="confirm-popup" onClick={(e) => e.stopPropagation()}>
//             <h4>Are you sure you want to delete this order?</h4>
//             <div className="popup-actions">
//               <button className="ghost" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
//               <button className="danger" onClick={handleDelete}>Yes, Delete</button>
//             </div>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// }
































// Orders.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Orders.css";

// <<<<<<< HEAD
// const API_BASE = "http://localhost:5000/api/orders";
// =======
const API_BASE = "https://vatan-foods-backend-final.onrender.com/api/orders";
// >>>>>>> e8934343a83c0b2dcb09ae809c177bf6940aa8ed

const states = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala",
  "Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura",
  "Uttar Pradesh","Uttarakhand","West Bengal","Delhi"
];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);

  const emptyForm = {
    customerName: "",
    customerType: "Retail",
    contactPerson: "",
    contactNumber: "",
    email: "",
    vendorName: "",
    vendorAddress: "",
    vendorGSTIN: "",
    poNumber: "",
    poDate: "",
    items: [{ name: "", quantity: "", unit: "", pricePerUnit: "", batchNo: "" }],
    totalAmount: "0.00",
    deliveryAddress: "",
    deliveryCity: "",
    deliveryState: "",
    deliveryPincode: "",
    deliveryDate: "",
    deliveryTimeSlot: "10:00 AM - 12:00 PM",
    assignedVehicle: "",
    driverName: "",
    driverContact: "",
    warehouseLocation: "",
    remarks: "",
  };

  const [formData, setFormData] = useState(emptyForm);

  // ---- Fetch orders ----
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_BASE, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      // support responses like { orders: [...] } or array directly
      setOrders(res.data.orders || res.data || []);
    } catch (err) {
      console.error("❌ Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ---- Form handlers ----
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const items = [...prev.items];
      items[index] = { ...items[index], [name]: value };
      return { ...prev, items };
    });
  };

  const addItem = () =>
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { name: "", quantity: "", unit: "", pricePerUnit: "", batchNo: "" }],
    }));

  const deleteItem = (index) =>
    setFormData((prev) => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }));

  // ---- Auto-calc total (only when items change) ----
  useEffect(() => {
    const total = formData.items.reduce((sum, it) => {
      const qty = Number(it.quantity) || 0;
      const price = Number(it.pricePerUnit) || 0;
      return sum + qty * price;
    }, 0);
    const formatted = total.toFixed(2);
    if (formData.totalAmount !== formatted) {
      setFormData((prev) => ({ ...prev, totalAmount: formatted }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.items]);

  // ---- Create order (JSON body) ----
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // sanitize numbers on items
      const sanitizedItems = formData.items.map((it) => ({
        ...it,
        quantity: Number(it.quantity) || 0,
        pricePerUnit: Number(it.pricePerUnit) || 0,
      }));

      const payload = {
        ...formData,
        items: sanitizedItems,
        totalAmount: Number(formData.totalAmount) || 0,
      };

      await axios.post(API_BASE, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}`, "Content-Type": "application/json" },
      });

      await fetchOrders();
      setShowPopup(false);
      setFormData(emptyForm);
    } catch (err) {
      console.error("❌ Error creating order:", err.response?.data || err.message);
    }
  };

  // ---- Edit / Update ----
  const handleEdit = (order) => {
    // normalize dates to ISO-ish strings so date inputs can show them
    const normalized = {
      ...order,
      poDate: order.poDate || order.orderedDate || order.poDate || "",
      deliveryDate: order.deliveryDate || "",
      items: (order.items || []).map((it) => ({
        ...it,
        quantity: it.quantity != null ? String(it.quantity) : "",
        pricePerUnit: it.pricePerUnit != null ? String(it.pricePerUnit) : "",
      })),
      totalAmount: order.totalAmount != null ? String(order.totalAmount) : "0.00",
    };
    setSelectedOrder(order);
    setFormData(normalized);
    setShowEditPopup(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    if (!selectedOrder) return;
    try {
      const sanitizedItems = formData.items.map((it) => ({
        ...it,
        quantity: Number(it.quantity) || 0,
        pricePerUnit: Number(it.pricePerUnit) || 0,
      }));

      const payload = { ...formData, items: sanitizedItems, totalAmount: Number(formData.totalAmount) || 0 };

      await axios.put(`${API_BASE}/${selectedOrder.orderId}`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}`, "Content-Type": "application/json" },
      });

      await fetchOrders();
      setShowEditPopup(false);
      setSelectedOrder(null);
      setFormData(emptyForm);
    } catch (err) {
      console.error("❌ Error updating order:", err.response?.data || err.message);
    }
  };

  // ---- Delete ----
  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_BASE}/${deleteId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setOrders((prev) => prev.filter((o) => o._id !== deleteId));
      setShowDeleteConfirm(false);
      fetchOrders();
    } catch (err) {
      console.error("❌ Error deleting order:", err.response?.data || err.message);
    }
  };

  // ---- Reusable form rendering ----
  const renderFormFields = (onSubmit, buttonText) => (
    <form onSubmit={onSubmit} className="form-root">
      <div className="form-grid">
        <div className="field">
          <label htmlFor="customerName">Customer Name</label>
          <input id="customerName" placeholder="Customer Name" name="customerName" value={formData.customerName} onChange={handleChange} required />
        </div>

        <div className="field">
          <label htmlFor="customerType">Customer Type</label>
          <select id="customerType" name="customerType" value={formData.customerType} onChange={handleChange}>
            <option value="Retail">Retail</option>
            <option value="Wholesale">Wholesale</option>
            <option value="Distributor">Distributor</option>
          </select>
        </div>

        <div className="field">
          <label htmlFor="contactPerson">Contact Person</label>
          <input id="contactPerson" placeholder="Contact Person" name="contactPerson" value={formData.contactPerson} onChange={handleChange} required />
        </div>

        <div className="field">
          <label htmlFor="contactNumber">Contact Number</label>
          <input id="contactNumber" placeholder="Mobile Number" name="contactNumber" value={formData.contactNumber} onChange={handleChange} required />
        </div>

        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
        </div>

        <div className="field">
          <label htmlFor="vendorName">Vendor Name</label>
          <input id="vendorName" placeholder="Vendor Name" name="vendorName" value={formData.vendorName} onChange={handleChange} />
        </div>

        <div className="field">
          <label htmlFor="vendorAddress">Vendor Address</label>
          <input id="vendorAddress" placeholder="Vendor Address" name="vendorAddress" value={formData.vendorAddress} onChange={handleChange} />
        </div>

        <div className="field">
          <label htmlFor="vendorGSTIN">Vendor GSTIN</label>
          <input id="vendorGSTIN" name="vendorGSTIN" placeholder="GST Number" value={formData.vendorGSTIN} onChange={handleChange} />
        </div>

        <div className="field">
          <label htmlFor="poNumber">PO Number</label>
          <input id="poNumber" name="poNumber" placeholder="PO Number" value={formData.poNumber} onChange={handleChange} />
        </div>

        <div className="field">
          <label htmlFor="poDate">Ordered Date</label>
          <input
            id="poDate"
            name="poDate"
            type="date"
            placeholder="Ordered Date"
            value={formData.poDate ? formData.poDate.split("T")[0] : ""}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-grid2">
        <div><h4 className="section-title">Items</h4></div>

        {formData.items.map((item, idx) => (
          <div key={idx} className="items-row">
            <div className="field small">
              <label>Item Name</label>
              <input name="name" placeholder="Item Name" value={item.name} onChange={(e) => handleItemChange(idx, e)} required />
            </div>

            <div className="field tiny">
              <label>Qty</label>
              <input name="quantity" placeholder="Quantity" type="number" value={item.quantity} onChange={(e) => handleItemChange(idx, e)} required />
            </div>

            <div className="field tiny">
              <label>Unit</label>
              <select name="unit" value={item.unit} onChange={(e) => handleItemChange(idx, e)} required>
                <option value="">Select</option>
                <option value="pcs">Pieces</option>
                <option value="kg">Kilograms</option>
                <option value="litre">Litres</option>
              </select>
            </div>

            <div className="field small">
              <label>Price/Unit</label>
              <input name="pricePerUnit" placeholder="Price per unit" type="number" value={item.pricePerUnit} onChange={(e) => handleItemChange(idx, e)} required />
            </div>

            <div className="item-actions">
              {formData.items.length > 1 && (
                <button type="button" className="icon-btn" onClick={() => deleteItem(idx)} aria-label="Remove item">🗑️</button>
              )}
            </div>
          </div>
        ))}

        <div className="row-actions">
          <button type="button" onClick={addItem} className="secondary">➕ Add Item</button>
        </div>

        <div className="form-grid">
          <div className="field">
            <label>Total (₹)</label>
            <input name="totalAmount" type="number" value={formData.totalAmount} readOnly />
          </div>

          <div className="field">
            <label>Delivery Date</label>
            <input name="deliveryDate" placeholder="Delivery Date" type="date" value={formData.deliveryDate ? formData.deliveryDate.split("T")[0] : ""} onChange={handleChange} />
          </div>

          <div className="field">
            <label>State</label>
            <select name="deliveryState"  value={formData.deliveryState} onChange={handleChange}>
              <option value="">Select State</option>
              {states.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="field">
            <label>City</label>
            <input name="deliveryCity" placeholder="Delivery City Name" value={formData.deliveryCity} onChange={handleChange} />
          </div>

          

          <div className="field">
            <label>Pincode</label>
            <input name="deliveryPincode" placeholder="Delivery Address Pincode" value={formData.deliveryPincode} onChange={handleChange} />
          </div>
        </div>

        <div className="field full">
          <label>Delivery Address</label>
          <textarea name="deliveryAddress" placeholder="Please enter complete delivery address" rows="3" value={formData.deliveryAddress} onChange={handleChange} />
        </div>

        <div className="form-grid">
          <div className="field">
            <label>Vehicle Number</label>
            <input name="assignedVehicle" placeholder="Vechicle Number" value={formData.assignedVehicle} onChange={handleChange} />
          </div>
          <div className="field">
            <label>Driver Name</label>
            <input name="driverName" placeholder="Driver Name" value={formData.driverName} onChange={handleChange} />
          </div>
          <div className="field">
            <label>Driver Contact</label>
            <input name="driverContact" placeholder="Driver Mobile Number" value={formData.driverContact} onChange={handleChange} />
          </div>
        </div>

        <div className="field full">
          <label>Remarks</label>
          <textarea name="remarks" placeholder="Anything else if you want to convey about your order?" rows="2" value={formData.remarks} onChange={handleChange} />
        </div>

        <div className="popup-actions">
          <button type="button" className="ghost" onClick={() => { setShowPopup(false); setShowEditPopup(false); setFormData(emptyForm); }}>Cancel</button>
          <button type="submit" className="primary">{buttonText}</button>
        </div>
      </div>
    </form>
  );

  return (
    <div className="orders-container theme-admin">
      <div className="orders-header">
        <h2>📦 Orders Management</h2>
        <div className="header-actions">
          <button className="add-btn" onClick={() => { setFormData(emptyForm); setShowPopup(true); }}>➕ Add Order</button>
        </div>
      </div>

      {loading ? <p className="muted">Loading orders...</p> : (
        <>
          <div className="orders-table-wrapper">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Contact</th>
                  <th>City</th>
                  <th>Total</th>
                  <th>Delivery</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.length > 0 ? orders.map((order) => (
                  <tr key={order._id}>
                    <td className="sticky-column"><strong>{order.customerName}</strong><div className="muted small">{order.vendorName}</div></td>
                    <td>{order.contactNumber}</td>
                    <td>{order.deliveryCity}</td>
                    <td>₹{Number(order.totalAmount || 0).toFixed(2)}</td>
                    <td>{order.deliveryDate ? (order.deliveryDate.split ? order.deliveryDate.split("T")[0] : order.deliveryDate) : "—"}</td>
                    <td className="actions-cell">
                      <button className="btn small" onClick={() => setSelectedOrder(order)}>📄 Show Items</button>
                      <button className="btn small" onClick={() => handleEdit(order)}>✏️</button>
                      <button className="btn danger small" onClick={() => confirmDelete(order.orderId)}>🗑️</button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="6" style={{ textAlign: "center" }}>No orders found</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {selectedOrder && (
            <div className="popup-overlay" onClick={() => setSelectedOrder(null)}>
              <div className="popup order-items-popup" onClick={(e) => e.stopPropagation()}>
                <h3>📦 Items in Order</h3>
                <p><strong>Customer:</strong> {selectedOrder.customerName}</p>
                <p><strong>Delivery City:</strong> {selectedOrder.deliveryCity}</p>

                <table className="items-table">
                  <thead>
                    <tr>
                      <th>Item Name</th>
                      <th>Quantity</th>
                      <th>Unit</th>
                      <th>Price per Unit</th>
                      <th>Total Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(selectedOrder.items || []).map((item, idx) => {
                      const qty = Number(item.quantity) || 0;
                      const price = Number(item.pricePerUnit) || 0;
                      return (
                        <tr key={idx}>
                          <td>{item.name}</td>
                          <td>{qty}</td>
                          <td>{item.unit}</td>
                          <td>₹{price.toFixed(2)}</td>
                          <td>₹{(qty * price).toFixed(2)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                <div className="popup-actions">
                  <button onClick={() => setSelectedOrder(null)} className="primary">Close</button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Add Popup */}
      {showPopup && (
        <div className="popup-overlay" onClick={() => setShowPopup(false)}>
          <div className="popup" onClick={(e) => e.stopPropagation()}>
            <h3>➕ Add New Order</h3>
            {renderFormFields(handleSubmit, "Create Order")}
          </div>
        </div>
      )}

      {/* Edit Popup */}
      {showEditPopup && (
        <div className="popup-overlay" onClick={() => setShowEditPopup(false)}>
          <div className="popup" onClick={(e) => e.stopPropagation()}>
            <h3>✏️ Edit Order</h3>
            {renderFormFields(handleUpdate, "Update Order")}
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {showDeleteConfirm && (
        <div className="popup-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="confirm-popup" onClick={(e) => e.stopPropagation()}>
            <h4>Are you sure you want to delete this order?</h4>
            <div className="popup-actions">
              <button className="ghost" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
              <button className="danger" onClick={handleDelete}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
