


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




import React, { useEffect, useMemo, useState } from "react";
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

  // ================= API =================
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

  useEffect(() => {
    fetchReports();
  }, []);

  // ================= RANGE =================
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

  // ================= MERGED VENDOR PERFORMANCE =================
  const vendorPerformance = useMemo(() => {
    const map = {};

    data?.vendorAnalytics?.purchaseVendors?.forEach((v) => {
      const key = v.vendorName?.toLowerCase();
      map[key] = {
        vendorName: v.vendorName,
        suppliedKg: v.totalPurchasedKg || 0,
        soldKg: 0,
        salePercent: "-",
      };
    });

    data?.vendorAnalytics?.saleVendors?.forEach((v) => {
      const key = v.saleVendorName?.toLowerCase();
      if (!map[key]) {
        map[key] = {
          vendorName: v.saleVendorName,
          suppliedKg: 0,
          soldKg: v.totalSoldKg || 0,
          salePercent: v.saleContributionPercent || "0",
        };
      } else {
        map[key].soldKg = v.totalSoldKg || 0;
        map[key].salePercent = v.saleContributionPercent || "0";
      }
    });

    return Object.values(map);
  }, [data]);

  const topSupplier = useMemo(
    () =>
      vendorPerformance.reduce(
        (max, v) => (v.suppliedKg > (max?.suppliedKg || 0) ? v : max),
        null
      ),
    [vendorPerformance]
  );

  const topSeller = useMemo(
    () =>
      vendorPerformance.reduce(
        (max, v) => (v.soldKg > (max?.soldKg || 0) ? v : max),
        null
      ),
    [vendorPerformance]
  );

  // ================= LOADER =================
  if (loading) {
    return (
      <div className="loader-screen">
        <div className="spinner" />
        <p>Loading reports…</p>
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
        </select>

        <input type="date" value={startDate} max={todayISO()}
          onChange={(e) => { setRange("custom"); setStartDate(e.target.value); }} />

        <input type="date" value={endDate} max={todayISO()}
          onChange={(e) => { setRange("custom"); setEndDate(e.target.value); }} />

        <button onClick={fetchReports}>Apply</button>
      </div>

      {/* ================= SUMMARY ================= */}
      <div className="summary-grid">
        <SummaryCard title="Incoming" items={[
          ["Records", incoming.totalRecords],
          ["Vendors", incoming.vendorsInvolved],
          ["Total Kg", incoming.totalIncomingKg]
        ]} />

        <SummaryCard title="Cleaning" items={[
          ["Records", cleaning.totalRecords],
          ["Cleaned Kg", cleaning.totalCleanedKg],
          ["Wastage Kg", cleaning.totalWastageKg]
        ]} />

        <SummaryCard title="Packing" items={[
          ["Records", packing.totalRecords],
          ["Completed", packing.statusBreakdown?.completed],
          ["Packed Kg", packing.totals?.packedKg]
        ]} />

        <SummaryCard title="Orders" items={[
          ["Total", orders.totalOrders],
          ["Delivered", orders.statusBreakdown?.delivered],
          ["Pending", orders.statusBreakdown?.pending]
        ]} />
      </div>

      {/* ================= MONTHLY HIGHLIGHTS ================= */}
      <h3>⭐ Monthly Highlights</h3>
      <div className="summary-grid">
        <SummaryCard title="Top Supplier" highlight
          items={[
            ["Vendor", topSupplier?.vendorName || "-"],
            ["Supplied Kg", topSupplier?.suppliedKg || 0]
          ]}
        />
        <SummaryCard title="Top Seller" highlight
          items={[
            ["Vendor", topSeller?.vendorName || "-"],
            ["Sold Kg", topSeller?.soldKg || 0],
            ["Contribution", `${topSeller?.salePercent || 0}%`]
          ]}
        />
      </div>

      {/* ================= MERGED VENDOR TABLE ================= */}
      <h3>📅 Monthly Vendor Performance</h3>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Vendor</th>
              <th>Supplied Kg</th>
              <th>Sold Kg</th>
              <th>Sale %</th>
              <th>Highlight</th>
            </tr>
          </thead>
          <tbody>
            {vendorPerformance.map((v) => (
              <tr key={v.vendorName}>
                <td>{v.vendorName}</td>
                <td>{v.suppliedKg}</td>
                <td>{v.soldKg}</td>
                <td>{v.salePercent}%</td>
                <td>
                  {topSupplier?.vendorName === v.vendorName && "🏆 Top Supplier"}
                  {topSeller?.vendorName === v.vendorName && " 🏆 Top Seller"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= BATCH TABLE (UNCHANGED) ================= */}
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
    </div>
  );
}

// ================= SMALL COMPONENT =================
function SummaryCard({ title, items, highlight }) {
  return (
    <div className={`summary-card ${highlight ? "highlight" : ""}`}>
      <h4>{title}</h4>
      {items.map(([k, v]) => (
        <p key={k}>{k}: <b>{v ?? 0}</b></p>
      ))}
    </div>
  );
}
