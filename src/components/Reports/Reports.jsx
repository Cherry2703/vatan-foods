


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

const API_BASE = "https://vatan-foods-backend-final.onrender.com/api";

const Reports = () => {
  const [incomingData, setIncomingData] = useState([]);
  const [cleaningData, setCleaningData] = useState([]);
  const [packingData, setPackingData] = useState([]);
  const [ordersData, setOrdersData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedRange, setSelectedRange] = useState("7days");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const token = localStorage.getItem("token") || "";

  // Compute default 7 days
  const computeDates = (range) => {
    const today = new Date();
    let start = new Date();
    switch (range) {
      case "7days":
        start.setDate(today.getDate() - 7);
        break;
      case "15days":
        start.setDate(today.getDate() - 15);
        break;
      case "1month":
        start.setMonth(today.getMonth() - 1);
        break;
      case "6months":
        start.setMonth(today.getMonth() - 6);
        break;
      case "1year":
        start.setFullYear(today.getFullYear() - 1);
        break;
      case "custom":
        start = startDate ? new Date(startDate) : today;
        break;
      default:
        start.setDate(today.getDate() - 7);
    }
    return { start, end: today };
  };

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      // Optional: pass date params to API
      const params = {
        startDate: startDate,
        endDate: endDate,
      };

      const [incRes, cleanRes, packRes, ordersRes] = await Promise.all([
        axios.get(`${API_BASE}/incoming`, { headers, params }),
        axios.get(`${API_BASE}/cleaning`, { headers, params }),
        axios.get(`${API_BASE}/packing`, { headers, params }),
        axios.get(`${API_BASE}/orders`, { headers, params }),
      ]);

      console.log("incRes", incRes);
// Example: filter cleaning data based on startDate and endDate
      const filteredIncoming = (incRes.data || []).filter((item) => {
        const created = new Date(item.createdAt); // or item.timestamp if that is the right field
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // include entire end day
        return created >= start && created <= end;
      });

      setIncomingData(filteredIncoming);


        // Example: filter cleaning data based on startDate and endDate
        const filteredCleaning = (cleanRes.data || []).filter((item) => {
          const created = new Date(item.createdAt); // or item.timestamp if that is the right field
          const start = new Date(startDate);
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999); // include entire end day
          return created >= start && created <= end;
        });

        setCleaningData(filteredCleaning);

      
                  // Example: filter cleaning data based on startDate and endDate
          const filteredPacking = (packRes.data || []).filter((item) => {
            const created = new Date(item.createdAt); // or item.timestamp if that is the right field
            const start = new Date(startDate);
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999); // include entire end day
            return created >= start && created <= end;
          });

          setPackingData(filteredPacking);


          const filteredOrders = (ordersRes.data || []).filter((item) => {
            const created = new Date(item.createdAt); // or item.timestamp if that is the right field
            const start = new Date(startDate);
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999); // include entire end day
            return created >= start && created <= end;
          });

          setOrdersData(filteredOrders);


    } catch (err) {
      console.error("Reports fetch error:", err);
      setError(err?.response?.data?.message || err.message || "Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  }, [token, startDate, endDate]);

  useEffect(() => {
    // default: 7days
    const { start, end } = computeDates(selectedRange);
    setStartDate(start.toISOString().split("T")[0]);
    setEndDate(end.toISOString().split("T")[0]);
  }, [selectedRange]);



  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const applyDateFilter = () => {
    
    fetchAll();
  };

  console.log(startDate,endDate);
  

  return (
    <div className="reports-page">
      <header className="reports-header">
        <h1>Vatan Foods Analytics — Reports</h1>

        <div className="reports-filters">
          <select value={selectedRange} onChange={(e) => setSelectedRange(e.target.value)}>
            <option value="7days">Last 7 Days</option>
            <option value="15days">Last 15 Days</option>
            <option value="1month">Last 1 Month</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last 1 Year</option>
            <option value="custom">Custom</option>
          </select>

          {selectedRange === "custom" && (
            <div className="custom-date-inputs">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          )}

          <button className="btn" onClick={applyDateFilter}>
            Apply Date Filter
          </button>
        </div>

        <div className="reports-actions">
          <button className="btn" onClick={fetchAll} disabled={loading}>
            Refresh
          </button>
        </div>
      </header>

      {loading && <div className="reports-loading">Loading datasets...</div>}
      {error && <div className="reports-error">Error: {error}</div>}

      <main className="reports-main">
        <section className="reports-section">
          <IncomingReports incomingData={incomingData} startDate={startDate} endDate={endDate} />
        </section>

        <section className="reports-section">
          <CleaningReports cleaningData={cleaningData} startDate={startDate} endDate={endDate} />
        </section>

        <section className="reports-section">
          <PackingReports packingData={packingData} startDate={startDate} endDate={endDate} />
        </section>

        <section className="reports-section">
          <OrdersReports ordersData={ordersData} startDate={startDate} endDate={endDate} />
        </section>
      </main>
    </div>
  );
};

export default Reports;
