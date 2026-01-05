// DashboardUpgraded.jsx
import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import axios from "axios";

export default function Dashboard() {
  // core state
  const [orders, setOrders] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [completedOrders, setCompletedOrders] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  // upcoming orders derived state (next 7 days, pending)
  const [upcomingOrders, setUpcomingOrders] = useState([]);

  // popup state
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupType, setPopupType] = useState(null); // "order" | "task" | "notification"
  const [selectedEntity, setSelectedEntity] = useState(null);

  // --- helper: due label ---
  const getDueLabel = (deliveryDate) => {
    if (!deliveryDate) return "-";
    const today = new Date();
    const t0 = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const target = new Date(deliveryDate);
    const d0 = new Date(target.getFullYear(), target.getMonth(), target.getDate());
    const diff = Math.ceil((d0 - t0) / (1000 * 60 * 60 * 24));
    if (diff <= 0) return "Due Today";
    if (diff === 1) return "Due Tomorrow";
    return `Due in ${diff} days`;
  };

  // --- Dummy tasks ---
  useEffect(() => {
    setRecentTasks([
      { id: "t1", name: "Welding Unit A", status: "in-progress", workers: 3, deadline: "2h remaining", remarks: "Heat settings reviewed" },
      { id: "t2", name: "Assembly Line B", status: "completed", workers: 5, deadline: "Completed", remarks: "No issues" },
      { id: "t3", name: "Quality Check", status: "delayed", workers: 2, deadline: "1h overdue", remarks: "Re-run tests" },
      { id: "t4", name: "Packaging", status: "pending", workers: 4, deadline: "4h remaining", remarks: "" },
    ]);
  }, []);

  // --- Fetch orders and notifications ---
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://vatan-foods-backend-final.onrender.com/api/orders/", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      const arr = Array.isArray(data) ? data : [];
      setOrders(arr);

      // stats
      let pending = 0;
      let completed = 0;
      arr.forEach((o) => {
        if (o.orderStatus === "Pending" || o.orderStatus === "Confirmed") pending++;
        if (o.orderStatus === "Delivered") completed++;
      });
      setPendingOrders(pending);
      setCompletedOrders(completed);

      // recent orders last 7 days
      const now = new Date();
      const weekAgo = new Date(now);
      weekAgo.setDate(now.getDate() - 7);
      const lastWeek = arr.filter((o) => (o.createdAt ? new Date(o.createdAt) >= weekAgo : false));
      setRecentOrders(lastWeek.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5));

      // notifications
      const RAW_MATERIALS_API = "https://vatan-foods-backend-final.onrender.com/api/incoming";
      const rawRes = await axios.get(RAW_MATERIALS_API, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }).catch(() => ({ data: [] }));
      const incoming = Array.isArray(rawRes.data) ? rawRes.data : [];
      const LOW_STOCK_LIMIT = 500;
      const lowStockItems = incoming.filter((item) => Number(item.totalQuantity) < LOW_STOCK_LIMIT);
      const notifs = lowStockItems.map((item) => ({
        id: item._id || (crypto?.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2)),
        type: "warning",
        title: `${item.itemName || "Material"} :::: low stock`,
        message: `Available: ${item.totalQuantity} kg`,
        time: item.updatedAt ? new Date(item.updatedAt).toLocaleString() : new Date().toLocaleString(),
        payload: item,
      }));
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

  // --- Compute upcoming pending orders for next 7 days ---
  useEffect(() => {
    if (!orders.length) {
      setUpcomingOrders([]);
      return;
    }
    const today = new Date();
    const next7 = new Date();
    next7.setDate(today.getDate() + 7);

    const dayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const dayEnd = new Date(next7.getFullYear(), next7.getMonth(), next7.getDate(), 23, 59, 59, 999);

    const isPending = (status) => ["Pending", "Confirmed"].includes(status);

    const upcoming = orders
      .filter((o) => o.deliveryDate && isPending(o.orderStatus) && new Date(o.deliveryDate) >= dayStart && new Date(o.deliveryDate) <= dayEnd)
      .map((o) => ({
        ...o,
        daysLeft: Math.ceil((new Date(o.deliveryDate) - dayStart) / (1000 * 60 * 60 * 24)),
      }))
      .sort((a, b) => new Date(a.deliveryDate) - new Date(b.deliveryDate));

    setUpcomingOrders(upcoming);
  }, [orders]);

  // Popup helpers
  const openPopup = (type, entity) => {
    setPopupType(type);
    setSelectedEntity(entity);
    setIsPopupOpen(true);
    document.body.style.overflow = "hidden";
  };
  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedEntity(null);
    setPopupType(null);
    document.body.style.overflow = "";
  };

  // Utility for totals
  const calcItemsTotal = (items) =>
    (items || []).reduce((s, it) => s + ((Number(it.quantity) || 0) * (Number(it.pricePerUnit) || 0)), 0);

  // --- Popup Content ---
  const PopupContent = () => {
    if (!selectedEntity) return null;

    if (popupType === "order") {
      const o = selectedEntity;
      return (
        <div className="popup-section scroll-table">
          <h4>Order Items</h4>
          {(o.items && o.items.length) ? (
            <table className="items-table">
              <thead>
                <tr><th>Name</th><th>Qty</th><th>Unit</th><th>Price</th><th>Total</th></tr>
              </thead>
              <tbody>
                {o.items.map((it, i) => (
                  <tr key={i}>
                    <td>{it.name}</td>
                    <td>{it.quantity}</td>
                    <td>{it.unit}</td>
                    <td>₹{it.pricePerUnit}</td>
                    <td>₹{(Number(it.quantity)||0)*(Number(it.pricePerUnit)||0)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="4" style={{ textAlign:"right", fontWeight:700 }}>Subtotal</td>
                  <td style={{ fontWeight:700 }}>₹{calcItemsTotal(o.items)}</td>
                </tr>
              </tfoot>
            </table>
          ) : <p className="muted">No items in this order</p>}
        </div>
      );
    }

    if (popupType === "task") return <p>Task details (existing)</p>;
    if (popupType === "notification") return <p>Notification details (existing)</p>;
    return null;
  };

  // --- Stats ---
  const stats = [
    { title: "Completed Orders", value: completedOrders, icon: "✅" },
    { title: "Pending Orders", value: pendingOrders, icon: "⏳" },
    { title: "Weekly Orders", value: recentOrders.length, icon: "📦" },
  ];

  return (
    <div className="dash-wrap">
      <header className="dash-header">
        <h1>Dashboard</h1>
        <button className="primary-btn" onClick={fetchOrders}>🔄 Refresh</button>
      </header>

      <section className="stats-grid">
        {stats.map((s,i) => (
          <div className="stat-card" key={i}>
            <div className="stat-top"><div className="stat-title">{s.title}</div><div className="stat-icon">{s.icon}</div></div>
            <div className="stat-value">{s.value}</div>
          </div>
        ))}
      </section>

      <main className="main-grid">
        {/* Recent Orders */}
        <div className="card recent-card">
          <div className="card-head"><h3>Recent Orders</h3></div>
          <div className="list">
            {loading ? <p className="muted">Loading…</p> : (
              recentOrders.length ? recentOrders.map((o)=>(
                <div key={o._id || o.orderId} className="list-item">
                  <div>
                    <div className="list-title">{o.customerName}</div>
                    <div className="list-meta">📅 {o.deliveryDate || "-"} • ₹{o.totalAmount} • {o.orderStatus}</div>
                  </div>
                  <div className="list-actions">
                    <button className="ghost" onClick={()=>openPopup("order", o)}>View</button>
                  </div>
                </div>
              )) : <p className="muted">No recent orders</p>
            )}
          </div>
        </div>

        {/* Upcoming Pending Orders */}
        <div className="card upcoming-card">
          <div className="card-head"><h3>Pending Orders - Next 7 Days</h3></div>
          <div className="list">
            {upcomingOrders.length === 0 ? <p className="muted">No pending orders in next 7 days</p> :
              upcomingOrders.map((o)=>(
                <div key={o._id || o.orderId} className="list-item">
                  <div>
                    <div className="list-title">{o.customerName}</div>
                    <div className="list-meta">📅 {o.deliveryDate} • {getDueLabel(o.deliveryDate)}</div>
                  </div>
                  <div className="list-actions">
                    <button className="ghost" onClick={()=>openPopup("order", o)}>View</button>
                  </div>
                </div>
              ))
            }
          </div>
        </div>

        {/* Notifications */}
        <div className="card notifications-card">
          <div className="card-head"><h3>Notifications</h3></div>
          <div className="list">
            {notifications.length === 0 ? <p className="muted">No notifications</p> :
              notifications.map((n)=>(
                <div key={n.id} className="list-item notif" onClick={()=>openPopup("notification", n)}>
                  <div><div className="list-title">{n.title}</div><div className="list-meta">{n.message}</div></div>
                  <div className="list-actions"><small className="muted">{n.time.split(",")[0]}</small></div>
                </div>
              ))
            }
          </div>
        </div>
      </main>

      {/* Popup */}
      {isPopupOpen && selectedEntity && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-card" onClick={e=>e.stopPropagation()}>
            <div className="popup-header">
              <h2>{popupType==="order"?selectedEntity.customerName:(popupType==="task"?selectedEntity.name:selectedEntity.title)}</h2>
              <button className="close" onClick={closePopup}>✖ Close</button>
            </div>
            <div className="popup-body"><PopupContent /></div>
          </div>
        </div>
      )}
    </div>
  );
}





