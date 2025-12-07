// import React, { useEffect, useState, useCallback } from "react";
// import axios from "axios";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
//   ArcElement,
// } from "chart.js";
// import { Bar, Line, Pie } from "react-chartjs-2";
// import ChartDataLabels from "chartjs-plugin-datalabels";
// import "./Reports.css";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   PointElement,
//   LineElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend,
//   ChartDataLabels
// );

// const lightColors = [
//   "#a2d5f2", "#ffb3c1", "#c1fba4", "#fce1a8", "#d3c0f9", "#f5c0c0",
//   "#9bf6ff", "#ffd6a5", "#caffbf", "#ffc6ff"
// ];

// const Reports = () => {
//   const [ordersData, setOrdersData] = useState([]);
//   const [incomingData, setIncomingData] = useState([]);
//   const [cleaningData, setCleaningData] = useState([]);
//   const [packingData, setPackingData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [filter, setFilter] = useState({ range: "7days", startDate: null, endDate: null });

//   const token = localStorage.getItem("token");

//   const fetchData = useCallback(async () => {
//     setLoading(true);
//     try {
//       const headers = { Authorization: `Bearer ${token}` };
//       const [ordersRes, incomingRes, cleaningRes, packingRes] = await Promise.all([
//         axios.get("https://vatan-foods-backend-final.onrender.com/api/orders", { headers }),
//         axios.get("https://vatan-foods-backend-final.onrender.com/api/incoming", { headers }),
//         axios.get("https://vatan-foods-backend-final.onrender.com/api/cleaning", { headers }),
//         axios.get("https://vatan-foods-backend-final.onrender.com/api/packing", { headers }),
//       ]);

//       setOrdersData(ordersRes.data);
//       setIncomingData(incomingRes.data);
//       setCleaningData(cleaningRes.data);
//       setPackingData(packingRes.data);
//     } catch (err) {
//       console.error("Error fetching data:", err);
//     } finally {
//       setLoading(false);
//     }
//   }, [token]);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   // ===== Date filter helpers =====
//   const getDateRange = () => {
//     const today = new Date();
//     let start = new Date();
//     switch (filter.range) {
//       case "7days": start.setDate(today.getDate() - 7); break;
//       case "1month": start.setMonth(today.getMonth() - 1); break;
//       case "6months": start.setMonth(today.getMonth() - 6); break;
//       case "1year": start.setFullYear(today.getFullYear() - 1); break;
//       default: start = filter.startDate ? new Date(filter.startDate) : today; break;
//     }
//     const end = filter.endDate ? new Date(filter.endDate) : today;
//     return [start, end];
//   };

//   const filterByDate = (data, key = "deliveryDate") => {
//     const [start, end] = getDateRange();
//     return data.filter((item) => {
//       const date = new Date(item[key]);
//       return date >= start && date <= end;
//     });
//   };

//  // ===== Orders Analytics =====
// // Dynamically get all statuses from data
// const orderStatuses = [...new Set(ordersData.map(o => o.orderStatus))];

// // Total Orders Summary (all orders, not filtered by date)
// const totalOrdersStatus = orderStatuses.map((status) => ({
//   status,
//   count: ordersData.filter((o) => o.orderStatus === status).length,
// }));
// const totalOrdersStatusData = {
//   labels: totalOrdersStatus.map((o) => o.status),
//   datasets: [{
//     data: totalOrdersStatus.map((o) => o.count),
//     backgroundColor: lightColors,
//     hoverOffset: 15,
//   }],
// };

// // Filtered orders by date for trend/chart
// const filteredOrders = filterByDate(ordersData, "deliveryDate");
// const ordersSummary = orderStatuses.map((status) => ({
//   status,
//   count: filteredOrders.filter((o) => o.orderStatus === status).length,
// }));

// const ordersPieData = {
//   labels: ordersSummary.map((o) => o.status),
//   datasets: [{
//     data: ordersSummary.map((o) => o.count),
//     backgroundColor: lightColors,
//     hoverOffset: 15,
//   }],
// };

// const ordersDates = [...new Set(filteredOrders.map((o) => o.deliveryDate))].sort();
// const ordersTrendData = {
//   labels: ordersDates,
//   datasets: orderStatuses.map((status, idx) => ({
//     label: status,
//     data: ordersDates.map(
//       (date) => filteredOrders.filter((o) => o.deliveryDate === date && o.orderStatus === status).length
//     ),
//     borderColor: lightColors[idx],
//     backgroundColor: lightColors[idx] + "50",
//     tension: 0.4,
//   })),
// };


//   // ===== Incoming Analytics =====
//   const incomingTotalChartData = {
//     labels: incomingData.map(i => i.itemName),
//     datasets: [{ label: "Total Quantity", data: incomingData.map(i => i.totalQuantity), backgroundColor: "#C1FBA4" }]
//   };
//   const lowStockItems = incomingData.filter(i => i.remainingQuantity < 500);
//   const lowStockChartData = {
//     labels: lowStockItems.map(i => i.itemName),
//     datasets: [{ label: "Low Stock (<500kg)", data: lowStockItems.map(i => i.remainingQuantity), backgroundColor: "#FFB3C1" }]
//   };

//   // ===== Cleaning Analytics =====
//   const cleaningItems = cleaningData.map(c => ({
//     item: c.itemName,
//     output: c.outputQuantity,
//     wastage: c.wastageQuantity,
//   }));
//   const cleaningChartData = {
//     labels: cleaningItems.map(c => c.item),
//     datasets: [
//       { label: "Output", data: cleaningItems.map(c => c.output), backgroundColor: "#8FD694" },
//       { label: "Wastage", data: cleaningItems.map(c => c.wastage), backgroundColor: "#F5A962" },
//     ],
//   };

//   return (
//     <div className="reports-container">
//       <h1 className="reports-title">Enterprise Analytics Dashboard</h1>

//       {/* Filters */}
//       <div className="filter-container">
//         <select value={filter.range} onChange={(e) => setFilter({ ...filter, range: e.target.value })}>
//           <option value="7days">Last 7 Days</option>
//           <option value="1month">Last 1 Month</option>
//           <option value="6months">Last 6 Months</option>
//           <option value="1year">Last 1 Year</option>
//           <option value="custom">Custom Range</option>
//         </select>
//         {filter.range === "custom" && (
//           <>
//             <input type="date" onChange={(e) => setFilter({ ...filter, startDate: e.target.value })} />
//             <input type="date" onChange={(e) => setFilter({ ...filter, endDate: e.target.value })} />
//           </>
//         )}
//         <button onClick={fetchData}>Apply Filter</button>
//       </div>

//       {loading && <p>Loading data...</p>}

//       {/* Charts Grid */}
//       <div className="charts-grid">
//         {ordersData.length > 0 && (
//           <>
//             <div className="chart-card">
//               <h3>Total Orders Summary</h3>
//               <Pie data={totalOrdersStatusData} plugins={[ChartDataLabels]} />
//             </div>
//             <div className="chart-card">
//               <h3>Orders Status (Filtered)</h3>
//               <Pie data={ordersPieData} plugins={[ChartDataLabels]} />
//             </div>
//             <div className="chart-card">
//               <h3>Orders Trend</h3>
//               <Line data={ordersTrendData} plugins={[ChartDataLabels]} />
//             </div>
//           </>
//         )}

//         {incomingData.length > 0 && (
//           <>
//             <div className="chart-card">
//               <h3>Incoming Total Quantity</h3>
//               <Bar data={incomingTotalChartData} plugins={[ChartDataLabels]} />
//             </div>
//             {lowStockItems.length > 0 && (
//               <div className="chart-card">
//                 <h3>Low Stock Items (&lt;500kg)</h3>
//                 <Bar data={lowStockChartData} plugins={[ChartDataLabels]} />
//               </div>
//             )}
//           </>
//         )}

//         {cleaningItems.length > 0 && (
//           <div className="chart-card">
//             <h3>Cleaning Output vs Wastage</h3>
//             <Bar data={cleaningChartData} plugins={[ChartDataLabels]} />
//           </div>
//         )}

//       </div>
//     </div>
//   );
// };

// export default Reports;






import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

import "./Reports.css";
import IncomingReports from "../IncomingCharts/IncomingReports";
import CleaningReports from "../CleaningReports/CleaningReports";
import PackingReports from "../PackingReports/PackingReports";
import OrdersReports from "../OrdersReports/OrdersReports";

// Register ChartJS globally once
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

const API_BASE = "https://vatan-foods-backend-final.onrender.com/api"; // change if needed

const Reports = () => {
  const [incomingData, setIncomingData] = useState([]);
  const [cleaningData, setCleaningData] = useState([]);
  const [packingData, setPackingData] = useState([]);
  const [ordersData, setOrdersData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token") || "";

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const [incRes, cleanRes, packRes, ordersRes] = await Promise.all([
        axios.get(`${API_BASE}/incoming`, { headers }),
        axios.get(`${API_BASE}/cleaning`, { headers }),
        axios.get(`${API_BASE}/packing`, { headers }),
        axios.get(`${API_BASE}/orders`, { headers }),
      ]);
      const totalIncoming = incomingData.reduce((sum, r) => sum + Number(r.totalQuantity || 0), 0);
      const totalPacked = packingData.reduce((sum, r) => sum + Number(r.outputQuantity || r.totalPacked || 0), 0);

      setIncomingData(Array.isArray(incRes.data) ? incRes.data : incRes.data.data || []);
      setCleaningData(Array.isArray(cleanRes.data) ? cleanRes.data : cleanRes.data.data || []);
      setPackingData(Array.isArray(packRes.data) ? packRes.data : packRes.data.data || []);
      setOrdersData(Array.isArray(ordersRes.data) ? ordersRes.data : ordersRes.data.data || []);
    } catch (err) {
      console.error("Reports fetch error:", err);
      setError(err?.response?.data?.message || err.message || "Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return (
    <div className="reports-page">
      <header className="reports-header">
        <h1>Vatan Foods Analytics — Reports</h1>
        <div className="reports-actions">
          <button className="btn" onClick={fetchAll} disabled={loading}>Refresh</button>
        </div>
      </header>

      {loading && <div className="reports-loading">Loading datasets...</div>}
      {error && <div className="reports-error">Error: {error}</div>}

      

      <main className="reports-main">
        {/* Grid layout: all components render at once */}
        <section className="reports-section">
          <IncomingReports incomingData={incomingData} />
        </section>

        <section className="reports-section">
          <CleaningReports cleaningData={cleaningData} />
        </section>

        <section className="reports-section">
          <PackingReports packingData={packingData} />
        </section>

        <section className="reports-section">
          <OrdersReports ordersData={ordersData} />
        </section>
      </main>
    </div>
  );
};

export default Reports;
