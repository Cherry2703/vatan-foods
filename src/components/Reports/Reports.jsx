


// import React, { useEffect, useState, useCallback } from "react";
// import axios from "axios";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   PointElement,
//   LineElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import ChartDataLabels from "chartjs-plugin-datalabels";

// import "./Reports.css";
// import IncomingReports from "../IncomingCharts/IncomingReports";
// import CleaningReports from "../CleaningReports/CleaningReports";
// import PackingReports from "../PackingReports/PackingReports";
// import OrdersReports from "../OrdersReports/OrdersReports";

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

// const API_BASE = "https://vatan-foods-backend-final.onrender.com/api";

// const Reports = () => {
//   const [incomingData, setIncomingData] = useState([]);
//   const [cleaningData, setCleaningData] = useState([]);
//   const [packingData, setPackingData] = useState([]);
//   const [ordersData, setOrdersData] = useState([]);

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [selectedRange, setSelectedRange] = useState("7days");
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");

//   const token = localStorage.getItem("token") || "";

//   // Compute default 7 days
//   const computeDates = (range) => {
//     const today = new Date();
//     let start = new Date();
//     switch (range) {
//       case "7days":
//         start.setDate(today.getDate() - 7);
//         break;
//       case "15days":
//         start.setDate(today.getDate() - 15);
//         break;
//       case "1month":
//         start.setMonth(today.getMonth() - 1);
//         break;
//       case "6months":
//         start.setMonth(today.getMonth() - 6);
//         break;
//       case "1year":
//         start.setFullYear(today.getFullYear() - 1);
//         break;
//       case "custom":
//         start = startDate ? new Date(startDate) : today;
//         break;
//       default:
//         start.setDate(today.getDate() - 7);
//     }
//     return { start, end: today };
//   };

//   const fetchAll = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const headers = token ? { Authorization: `Bearer ${token}` } : {};

//       // Optional: pass date params to API
//       const params = {
//         startDate: startDate,
//         endDate: endDate,
//       };

//       const [incRes, cleanRes, packRes, ordersRes] = await Promise.all([
//         axios.get(`${API_BASE}/incoming`, { headers, params }),
//         axios.get(`${API_BASE}/cleaning`, { headers, params }),
//         axios.get(`${API_BASE}/packing`, { headers, params }),
//         axios.get(`${API_BASE}/orders`, { headers, params }),
//       ]);

//       console.log("incRes", incRes);
// // Example: filter cleaning data based on startDate and endDate
//       const filteredIncoming = (incRes.data || []).filter((item) => {
//         const created = new Date(item.createdAt); // or item.timestamp if that is the right field
//         const start = new Date(startDate);
//         const end = new Date(endDate);
//         end.setHours(23, 59, 59, 999); // include entire end day
//         return created >= start && created <= end;
//       });

//       setIncomingData(filteredIncoming);


//         // Example: filter cleaning data based on startDate and endDate
//         const filteredCleaning = (cleanRes.data || []).filter((item) => {
//           const created = new Date(item.createdAt); // or item.timestamp if that is the right field
//           const start = new Date(startDate);
//           const end = new Date(endDate);
//           end.setHours(23, 59, 59, 999); // include entire end day
//           return created >= start && created <= end;
//         });

//         setCleaningData(filteredCleaning);

      
//                   // Example: filter cleaning data based on startDate and endDate
//           const filteredPacking = (packRes.data || []).filter((item) => {
//             const created = new Date(item.createdAt); // or item.timestamp if that is the right field
//             const start = new Date(startDate);
//             const end = new Date(endDate);
//             end.setHours(23, 59, 59, 999); // include entire end day
//             return created >= start && created <= end;
//           });

//           setPackingData(filteredPacking);


//           const filteredOrders = (ordersRes.data || []).filter((item) => {
//             const created = new Date(item.createdAt); // or item.timestamp if that is the right field
//             const start = new Date(startDate);
//             const end = new Date(endDate);
//             end.setHours(23, 59, 59, 999); // include entire end day
//             return created >= start && created <= end;
//           });

//           setOrdersData(filteredOrders);


//     } catch (err) {
//       console.error("Reports fetch error:", err);
//       setError(err?.response?.data?.message || err.message || "Failed to fetch reports");
//     } finally {
//       setLoading(false);
//     }
//   }, [token, startDate, endDate]);

//   useEffect(() => {
//     // default: 7days
//     const { start, end } = computeDates(selectedRange);
//     setStartDate(start.toISOString().split("T")[0]);
//     setEndDate(end.toISOString().split("T")[0]);
//   }, [selectedRange]);



//   useEffect(() => {
//     fetchAll();
//   }, [fetchAll]);

//   const applyDateFilter = () => {
    
//     fetchAll();
//   };

//   console.log(startDate,endDate);
  

//   return (
//     <div className="reports-page">
//       <header className="reports-header">
//         <h1>Vatan Foods Analytics — Reports</h1>

//         <div className="reports-filters">
//           <select value={selectedRange} onChange={(e) => setSelectedRange(e.target.value)}>
//             <option value="7days">Last 7 Days</option>
//             <option value="15days">Last 15 Days</option>
//             <option value="1month">Last 1 Month</option>
//             <option value="6months">Last 6 Months</option>
//             <option value="1year">Last 1 Year</option>
//             <option value="custom">Custom</option>
//           </select>

//           {selectedRange === "custom" && (
//             <div className="custom-date-inputs">
//               <input
//                 type="date"
//                 value={startDate}
//                 onChange={(e) => setStartDate(e.target.value)}
//               />
//               <input
//                 type="date"
//                 value={endDate}
//                 onChange={(e) => setEndDate(e.target.value)}
//               />
//             </div>
//           )}

//           <button className="btn" onClick={applyDateFilter}>
//             Apply Date Filter
//           </button>
//         </div>

//         <div className="reports-actions">
//           <button className="btn" onClick={fetchAll} disabled={loading}>
//             Refresh
//           </button>
//         </div>
//       </header>

//       {loading && <div className="reports-loading">Loading datasets...</div>}
//       {error && <div className="reports-error">Error: {error}</div>}

//       <main className="reports-main">
//         <section className="reports-section">
//           <IncomingReports incomingData={incomingData} startDate={startDate} endDate={endDate} />
//         </section>

//         <section className="reports-section">
//           <CleaningReports cleaningData={cleaningData} startDate={startDate} endDate={endDate} />
//         </section>

//         <section className="reports-section">
//           <PackingReports packingData={packingData} startDate={startDate} endDate={endDate} />
//         </section>

//         <section className="reports-section">
//           <OrdersReports ordersData={ordersData} startDate={startDate} endDate={endDate} />
//         </section>
//       </main>
//     </div>
//   );
// };

// export default Reports;






import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Reports.css";

const API_URL = "https://vatan-foods-backend-final.onrender.com/api/analytics";

const todayISO = () => new Date().toISOString().split("T")[0];
const subtractDays = (days) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().split("T")[0];
};

export default function Reports() {
  const [startDate, setStartDate] = useState(subtractDays(30));
  const [endDate, setEndDate] = useState(todayISO());
  const [range, setRange] = useState("1m");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const token = localStorage.getItem("token");

  // ================= API CALL =================
  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        API_URL,
        { startDate, endDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ================= DEFAULT LOAD (1 MONTH) =================
  useEffect(() => {
    fetchReports();
  }, []);

  // ================= RANGE HANDLER =================
  const handleRangeChange = (value) => {
    setRange(value);
    if (value === "7d") setStartDate(subtractDays(7));
    if (value === "15d") setStartDate(subtractDays(15));
    if (value === "1m") setStartDate(subtractDays(30));
    if (value === "6m") setStartDate(subtractDays(180));
    setEndDate(todayISO());
  };

  // ================= SAFE DATA =================
  const incoming = data?.operationsSummary?.incoming || {};
  const cleaning = data?.operationsSummary?.cleaning || {};
  const packing = data?.operationsSummary?.packing || {};
  const orders = data?.orders || {};

  // ================= LOADING SPINNER =================
  if (loading) {
    return (
      <div className="loader-screen">
        <div className="spinner" />
        <p>Loading, please wait…</p>
      </div>
    );
  }

  return (
    <div className="reports-container">
      <h2>📊 Reports & Analytics</h2>

      {/* ================= FILTER BAR ================= */}
      <div className="filter-bar">
        <select value={range} onChange={(e) => handleRangeChange(e.target.value)}>
          <option value="7d">Last 7 Days</option>
          <option value="15d">Last 15 Days</option>
          <option value="1m">Last 1 Month</option>
          <option value="6m">Last 6 Months</option>
          <option value="custom">Custom</option>
        </select>

        <input type="date" value={startDate} max={todayISO()}
          onChange={(e) => { setRange("custom"); setStartDate(e.target.value); }} />

        <input type="date" value={endDate} max={todayISO()}
          onChange={(e) => { setRange("custom"); setEndDate(e.target.value); }} />

        <button onClick={fetchReports}>Apply</button>
        <button className="secondary" onClick={fetchReports}>Refresh</button>
      </div>

      {/* ================= 4 SUMMARY CONTAINERS ================= */}
      <div className="summary-grid">

        {/* Incoming */}
        <div className="summary-card">
          <h4>Incoming</h4>
          <p>Total Records: <b>{incoming.totalRecords || 0}</b></p>
          <p>Vendors: <b>{incoming.vendorsInvolved || 0}</b></p>
          <p>Total Kg: <b>{incoming.totalIncomingKg || 0}</b></p>
        </div>

        {/* Cleaning */}
        <div className="summary-card">
          <h4>Cleaning</h4>
          <p>Total Records: <b>{cleaning.totalRecords || 0}</b></p>
          <p>Cleaned Kg: <b>{cleaning.totalCleanedKg || 0}</b></p>
          <p>Wastage Kg: <b>{cleaning.totalWastageKg || 0}</b></p>
        </div>

        {/* Packing */}
        <div className="summary-card">
          <h4>Packing</h4>
          <p>Total Records: <b>{packing.totalRecords || 0}</b></p>
          <p>Completed: <b>{packing.statusBreakdown?.completed || 0}</b></p>
          <p>Packed Kg: <b>{packing.totals?.packedKg || 0}</b></p>
          <p>Wastage Kg: <b>{packing.totals?.wastageKg || 0}</b></p>
        </div>

        {/* Orders */}
        <div className="summary-card">
          <h4>Orders</h4>
          <p>Total Orders: <b>{orders.totalOrders || 0}</b></p>
          <p>Delivered: <b>{orders.statusBreakdown?.delivered || 0}</b></p>
          <p>Pending: <b>{orders.statusBreakdown?.pending || 0}</b></p>
        </div>

      </div>

      {/* ================= BATCH TABLE ================= */}
      <h3>Batch Wise Performance</h3>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Batch</th>
              <th>Cleaned Kg</th>
              <th>Packed Kg</th>
              <th>Status</th>
              <th>Efficiency %</th>
              <th>Sale Vendor</th>
            </tr>
          </thead>
          <tbody>
            {data?.batchWisePerformance?.map((b) => (
              <tr key={b.batchId}>
                <td>{b.batchId}</td>
                <td>{b.cleaning?.cleanedKg || 0}</td>
                <td>{b.packing?.packedKg || 0}</td>
                <td>{b.packing?.status || "Not Started"}</td>
                <td>{b.metrics?.batchEfficiencyPercent || "0.00"}</td>
                <td>{b.packing?.saleVendorName || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>



      {/* ================= VENDORS ================= */}
      <h3>Sale Vendors</h3>
      <table>
        <thead>
          <tr>
            <th>Vendor</th>
            <th>Sold Kg</th>
            <th>Contribution %</th>
          </tr>
        </thead>
        <tbody>
          {data?.vendorAnalytics?.saleVendors?.map((v, i) => (
            <tr key={i}>
              <td>{v.saleVendorName}</td>
              <td>{v.totalSoldKg}</td>
              <td>{v.saleContributionPercent}</td>
            </tr>
          ))}
        </tbody>
      </table>
    

    </div>
  );
}
