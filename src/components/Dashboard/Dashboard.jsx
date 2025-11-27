// DashboardUpgraded.jsx
import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import axios from "axios";

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [completedOrders, setCompletedOrders] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  // popup state
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupType, setPopupType] = useState(null); // "order" | "task" | "notification"
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [activeTab, setActiveTab] = useState("details"); // details | items | timeline | contact

  


  // Dummy tasks (kept, but popup also supports tasks)
  useEffect(() => {
    setRecentTasks([
      { id: "t1", name: "Welding Unit A", status: "in-progress", workers: 3, deadline: "2h remaining", remarks: "Heat settings reviewed" },
      { id: "t2", name: "Assembly Line B", status: "completed", workers: 5, deadline: "Completed", remarks: "No issues" },
      { id: "t3", name: "Quality Check", status: "delayed", workers: 2, deadline: "1h overdue", remarks: "Re-run tests" },
      { id: "t4", name: "Packaging", status: "pending", workers: 4, deadline: "4h remaining", remarks: "" },
    ]);
  }, []);

  // Fetch orders and compute stats & notifications
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://vatan-foods-backend-final.onrender.com/api/orders/", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);

      // stats
      let pending = 0;
      let completed = 0;
      if (Array.isArray(data)) {
        data.forEach((o) => {
          if (o.orderStatus === "Pending" || o.orderStatus === "Confirmed") pending++;
          if (o.orderStatus === "Delivered") completed++;
        });
      }
      setPendingOrders(pending);
      setCompletedOrders(completed);

      // last 7 days filter
      const now = new Date();
      const weekAgo = new Date(now);
      weekAgo.setDate(now.getDate() - 7);

      const lastWeek = (Array.isArray(data) ? data : []).filter((o) => {
        return o.createdAt ? new Date(o.createdAt) >= weekAgo : false;
      });

      // sort newest first
      const sorted = lastWeek.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setRecentOrders(sorted.slice(0, 5));
const RAW_MATERIALS_API = "https://vatan-foods-backend-final.onrender.com/api/incoming";

  // Fetch raw materials safely
  const rawRes = await axios.get(RAW_MATERIALS_API, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  }).catch(() => ({ data: [] }));

  console.log(rawRes);
  

  const incoming = Array.isArray(rawRes.data) ? rawRes.data : [];

  console.log("Incoming Raw Materials:", incoming);

  // Filter ONLY low-stock materials
  const LOW_STOCK_LIMIT = 500; // you can change threshold

  const lowStockItems = incoming.filter(
    (item) => Number(item.totalQuantity) < LOW_STOCK_LIMIT
  );

  // Build notifications JUST for low stock
  const notifs = lowStockItems.map((item) => ({
    id:
      item._id ||
      crypto.randomUUID?.() ||
      Math.random().toString(36).slice(2),
    type: "warning",
    title: `${item.itemName || "Material"} :::: low stock`,
    message: `Available: ${item.totalQuantity} kg`,
    time: item.updatedAt
      ? new Date(item.updatedAt).toLocaleString()
      : new Date().toLocaleString(),
    payload: item,
  }));

  console.log("notifis",notifs);
  

  // Take only latest 6
  setNotifications(notifs.slice(0, 6));
    } catch (err) {
      console.error("Fetch orders error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Popup helpers
  const openPopup = (type, item) => {
    setPopupType(type);
    setSelectedEntity(item);
    setActiveTab("details");
    setIsPopupOpen(true);
    // lock scroll
    document.body.style.overflow = "hidden";
  };
  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedEntity(null);
    setPopupType(null);
    setActiveTab("details");
    document.body.style.overflow = "";
  };

  // Utility for totals in items
  const calcItemsTotal = (items) =>
    (items || []).reduce((s, it) => s + ((Number(it.quantity) || 0) * (Number(it.pricePerUnit) || 0)), 0);

  // Render content for the popup tabbed view
  const PopupContent = () => {
    if (!selectedEntity) return null;

    // if it's an order
    if (popupType === "order") {
      const o = selectedEntity;
      return (
        <>
          <div className="popup-tabs">
            <button className={activeTab === "details" ? "active" : ""} onClick={() => setActiveTab("details")}>Details</button>
            <button className={activeTab === "items" ? "active" : ""} onClick={() => setActiveTab("items")}>Items</button>
            <button className={activeTab === "timeline" ? "active" : ""} onClick={() => setActiveTab("timeline")}>Timeline</button>
            <button className={activeTab === "contact" ? "active" : ""} onClick={() => setActiveTab("contact")}>Contact</button>
          </div>

          {activeTab === "details" && (
            <div className="popup-section">
              <h4>Order Summary</h4>
              <div className="grid-2">
                <div><strong>Order ID:</strong> {o.orderId || o._id}</div>
                <div><strong>Status:</strong> <span className={`status-pill ${o.orderStatus?.toLowerCase()}`}>{o.orderStatus}</span></div>
                <div><strong>Created:</strong> {o.createdAt ? new Date(o.createdAt).toLocaleString() : "-"}</div>
                <div><strong>Updated:</strong> {o.updatedAt ? new Date(o.updatedAt).toLocaleString() : "-"}</div>
                <div><strong>Delivery:</strong> {o.deliveryDate} {o.deliveryTimeSlot ? `• ${o.deliveryTimeSlot}` : ""}</div>
                <div><strong>Warehouse:</strong> {o.warehouseLocation || "N/A"}</div>
              </div>

              <h4 style={{ marginTop: 12 }}>Delivery Address</h4>
              <p>{o.deliveryAddress}<br />{o.deliveryCity}, {o.deliveryState} - {o.deliveryPincode}</p>

              {o.remarks && <>
                <h4 style={{ marginTop: 12 }}>Remarks</h4>
                <p>{o.remarks}</p>
              </>}
            </div>
          )}

          {activeTab === "items" && (
            <div className="popup-section scroll-table">
              <table className="items-table">
                <thead>
                  <tr><th>Name</th><th>Qty</th><th>Unit</th><th>Price</th><th>Total</th><th>Batch</th></tr>
                </thead>
                <tbody>
                  {(o.items || []).map((it, i) => (
                    <tr key={i}>
                      <td>{it.name}</td>
                      <td>{it.quantity}</td>
                      <td>{it.unit}</td>
                      <td>₹{it.pricePerUnit}</td>
                      <td>₹{(Number(it.quantity)||0) * (Number(it.pricePerUnit)||0)}</td>
                      <td>{it.batchNo || "-"}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="4" style={{ textAlign: "right", fontWeight: 700 }}>Subtotal</td>
                    <td colSpan="2" style={{ fontWeight: 700 }}>₹{calcItemsTotal(o.items)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}

          {activeTab === "timeline" && (
            <div className="popup-section">
              <h4>Timeline</h4>
              <ul className="timeline-list">
                <li><strong>Created:</strong> {o.createdAt ? new Date(o.createdAt).toLocaleString() : "-"}</li>
                <li><strong>Updated:</strong> {o.updatedAt ? new Date(o.updatedAt).toLocaleString() : "-"}</li>
                {/* optional history if present */}
                {o.history?.length > 0 && (
                  <>
                    <li><strong>History:</strong></li>
                    {o.history.map((h, idx) => (
                      <li key={idx} className="history-item">
                        <small>{new Date(h.updatedAt).toLocaleString()} — Updated by {h.updatedBy || "system"}</small>
                      </li>
                    ))}
                  </>
                )}
              </ul>
            </div>
          )}

          {activeTab === "contact" && (
            <div className="popup-section">
              <h4>Contact</h4>
              <p><strong>Customer:</strong> {o.customerName}</p>
              <p><strong>Contact Person:</strong> {o.contactPerson}</p>
              <p><strong>Phone:</strong> {o.contactNumber}</p>
              <p><strong>Email:</strong> {o.email}</p>
              <h4 style={{ marginTop: 12 }}>Logistics</h4>
              <p><strong>Vehicle:</strong> {o.assignedVehicle || "-"}</p>
              <p><strong>Driver:</strong> {o.driverName || "-"} ({o.driverContact || "-"})</p>
              {o.pdfUrl && (
                <p style={{ marginTop: 12 }}>
                  <a className="pdf-link" href={o.pdfUrl} target="_blank" rel="noreferrer">View Attached PDF</a>
                </p>
              )}
            </div>
          )}
        </>
      );
    }

    // if it's a task
    if (popupType === "task") {
      const t = selectedEntity;
      return (
        <>
          <div className="popup-tabs">
            <button className={activeTab === "details" ? "active" : ""} onClick={() => setActiveTab("details")}>Details</button>
            <button className={activeTab === "timeline" ? "active" : ""} onClick={() => setActiveTab("timeline")}>Timeline</button>
            <button className={activeTab === "contact" ? "active" : ""} onClick={() => setActiveTab("contact")}>Workers</button>
          </div>

          {activeTab === "details" && (
            <div className="popup-section">
              <h4>{t.name}</h4>
              <p><strong>Status:</strong> <span className={`status-pill ${t.status}`}>{t.status}</span></p>
              <p><strong>Deadline:</strong> {t.deadline}</p>
              <p><strong>Workers:</strong> {t.workers}</p>
              <p><strong>Notes:</strong> {t.remarks || "-"}</p>
            </div>
          )}

          {activeTab === "timeline" && (
            <div className="popup-section">
              <h4>Timeline</h4>
              <p>Created recently — no timeline data for tasks (dummy)</p>
            </div>
          )}

          {activeTab === "contact" && (
            <div className="popup-section">
              <h4>Assigned Workers</h4>
              <p>{t.workers} worker(s) — contact details not available in dummy data.</p>
            </div>
          )}
        </>
      );
    }

    // if it's a notification
    if (popupType === "notification") {
      const n = selectedEntity;
      return (
        <>
          <div className="popup-tabs">
            <button className={activeTab === "details" ? "active" : ""} onClick={() => setActiveTab("details")}>Details</button>
            <button className={activeTab === "timeline" ? "active" : ""} onClick={() => setActiveTab("timeline")}>Source</button>
          </div>

          {activeTab === "details" && (
            <div className="popup-section">
              <h4>{n.title}</h4>
              <p>{n.message}</p>
              <p><small>{n.time}</small></p>
            </div>
          )}

          {activeTab === "timeline" && (
            <div className="popup-section">
              <h4>Origin</h4>
              <p>This notification was generated from the order <strong>{n.payload?.orderId || n.payload?._id}</strong>.</p>
            </div>
          )}
        </>
      );
    }

    return null;
  };

  // Stats we display
  const stats = [
    { title: "Completed Orders", value: completedOrders, icon: "✅" },
    { title: "Pending Orders", value: pendingOrders, icon: "⏳" },
    { title: "Weekly Orders", value: recentOrders.length, icon: "📦" },
    // { title: "Weekly Revenue", value: `₹${recentOrders.reduce((s,o)=> s + (Number(o.totalAmount)||0),0)}`, icon: "💰" },
  ];

  return (
    <div className="dash-wrap">
      <header className="dash-header">
        <div>
          <h1>Dashboard</h1>
          <p className="muted">Production & Sales overview — last 7 days</p>
        </div>
        <div className="dash-actions">
          <button className="primary-btn" onClick={() => fetchOrders()}>🔄 Refresh</button>
        </div>
      </header>

      <section className="stats-grid">
        {stats.map((s, i) => (
          <div className="stat-card" key={i}>
            <div className="stat-top">
              <div className="stat-title">{s.title}</div>
              <div className="stat-icon">{s.icon}</div>
            </div>
            <div className="stat-value">{s.value}</div>
          </div>
        ))}
      </section>

      <main className="main-grid">
        <div className="card recent-card">
          <div className="card-head">
            <h3>Recent Orders</h3>
            <div className="small-note">Showing latest 5 orders (last 7 days)</div>
          </div>
          <div className="list">
            {loading ? <p className="muted">Loading…</p> : (
              recentOrders.length ? recentOrders.map((o) => (
                <div key={o._id || o.orderId} className="list-item">
                  <div>
                    <div className="list-title">{o.customerName}</div>
                    <div className="list-meta">
                      <span>📅 {o.deliveryDate || "-"}</span>
                      <span> • ₹{o.totalAmount}</span>
                      <span> • {o.orderStatus}</span>
                    </div>
                  </div>
                  <div className="list-actions">
                    <button className="ghost" onClick={() => openPopup("order", o)}>View</button>
                  </div>
                </div>
              )) : <p className="muted">No recent orders</p>
            )}
          </div>
        </div>

        <div className="card notifications-card">
          <div className="card-head">
            <h3>Notifications</h3>
            <p className="small-note">Auto-generated from recent orders</p>
          </div>
          <div className="list">
            {notifications.length ? notifications.map((n) => (
              <div key={n.id} className="list-item notif" onClick={() => openPopup("notification", n)}>
                <div>
                  <div className="list-title">{n.title}</div>
                  <div className="list-meta"><span>{n.message}</span></div>
                </div>
                <div className="list-actions">
                  <small className="muted">{n.time.split(",")[0]}</small>
                </div>
              </div>
            )) : <p className="muted">No notifications</p>}
          </div>
        </div>

        {/* <div className="card tasks-card">
          <div className="card-head">
            <h3>Recent Tasks</h3>
            <div className="small-note">Operational tasks</div>
          </div>
          <div className="list">
            {recentTasks.map((t) => (
              <div key={t.id} className="list-item" onClick={() => openPopup("task", t)}>
                <div>
                  <div className="list-title">{t.name}</div>
                  <div className="list-meta"><span>👥 {t.workers}</span> <span>• {t.deadline}</span></div>
                </div>
                <div className="list-actions">
                  <span className={`status-pill ${t.status}`}>{t.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div> */}
      </main>

      {/* Quick Actions */}
      <div className="card quick-card">
        <h3>Quick Actions</h3>
        <div className="quick-actions">
          <button className="quick-btn">✨ Generate AI Plan</button>
          <button className="quick-btn">📦 Add New Order</button>
          <button className="quick-btn">👥 Manage Employees</button>
          <button className="quick-btn">✅ Review AI Tasks</button>
        </div>
      </div>

      {/* Popup (centered modal) */}
      {isPopupOpen && selectedEntity && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-card" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <div className="popup-header">
              <h2>
                {popupType === "order" && (selectedEntity.customerName || "Order")}
                {popupType === "task" && selectedEntity.name}
                {popupType === "notification" && selectedEntity.title}
              </h2>
              <div className="popup-controls">
                <button className="icon-btn" onClick={() => { navigator.clipboard?.writeText(JSON.stringify(selectedEntity)); }}>
                  Copy
                </button>
                <button className="icon-btn close" onClick={closePopup}>Close ✖</button>
              </div>
            </div>

            <div className="popup-body">
              <PopupContent />
            </div>

            <div className="popup-footer">
              <div className="left">
                <small className="muted">Type: {popupType}</small>
              </div>
              <div className="right">
                <button className="primary-btn" onClick={() => { /* placeholder for actions like Edit / Approve */ alert("Action not implemented"); }}>
                  Action
                </button>
                <button className="secondary-btn" onClick={closePopup}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
