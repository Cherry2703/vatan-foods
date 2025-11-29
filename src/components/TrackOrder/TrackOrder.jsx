


// import React, { useState } from "react";
// import axios from "axios";
// import "./TrackOrder.css"; // You can style this according to your needs

// const TrackOrder = () => {
//   const [batchId, setBatchId] = useState("");
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
// const token = localStorage.getItem("token");


//   const fetchHistory = async () => {
//     if (!batchId) return;
//     setLoading(true);
//     setError("");
//     try {
//     const res = await axios.get(`https://vatan-foods-backend-final.onrender.com/api/track-orders/${batchId}`,{ headers: { Authorization: `Bearer ${token}` } });

//       setData(res.data);
//     } catch (err) {
//       console.error(err);
//       setError("Failed to fetch history.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const excludeFields = [
//     "_id",
//     "__v",
//     "incomingId",
//     "cleaningId",
//     "packingId",
//     "createdBy",
//     "history",
//   ];

//   const filterData = (obj) =>
//     Object.fromEntries(
//       Object.entries(obj).filter(([key]) => !excludeFields.includes(key))
//     );

//   const renderCard = (item) => {
//     const { action, data: itemData, updatedBy, timestamp, model } = item;
//     const previous = itemData.previous || null;
//     const updated = itemData.updated || itemData;

//     const prevFiltered = previous ? filterData(previous) : null;
//     const updatedFiltered = filterData(updated);

//     return (
//       <div className="timeline-card" key={item._id}>
//         <div className="timeline-header">
//           <span className="model">{model}</span>
//           <span className="timestamp">
//             {new Date(timestamp).toLocaleString()}
//           </span>
//           <span className={`action ${action.toLowerCase()}`}>{action}</span>
//         </div>

//         <div className="timeline-body">
//           {prevFiltered ? (
//             <div className="prev-upd-container">
//               <div className="prev">
//                 <h4>Previous</h4>
//                 {Object.entries(prevFiltered).map(([key, val]) => (
//                   <p key={key}>
//                     <strong>{key}:</strong>{" "}
//                     {val && typeof val === "object" ? JSON.stringify(val) : val?.toString()}
//                   </p>
//                 ))}
//               </div>
//               <div className="updated">
//                 <h4>Updated</h4>
//                 {Object.entries(updatedFiltered).map(([key, val]) => (
//                   <p key={key}>
//                     <strong>{key}:</strong>{" "}
//                     {val && typeof val === "object" ? JSON.stringify(val) : val?.toString()}
//                   </p>
//                 ))}
//               </div>
//             </div>
//           ) : (
//             <div className="updated-only">
//               {Object.entries(updatedFiltered).map(([key, val]) => (
//                 <p key={key}>
//                   <strong>{key}:</strong>{" "}
//                   {val && typeof val === "object" ? JSON.stringify(val) : val?.toString()}
//                 </p>
//               ))}
//             </div>
//           )}
//           <p className="updatedBy">Updated by: {updatedBy}</p>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="timeline-container">
//       <h2>Batch History Timeline</h2>
//       <div className="input-container">
//         <input
//           type="text"
//           placeholder="Enter Batch ID"
//           value={batchId}
//           onChange={(e) => setBatchId(e.target.value)}
//         />
//         <button onClick={fetchHistory}>Fetch History</button>
//       </div>

//       {loading && <p>Loading...</p>}
//       {error && <p className="error">{error}</p>}

//       {data && (
//         <div className="timeline-section">
//           {["incoming", "cleaning", "packing"].map((modelKey) =>
//             data[modelKey]?.map((item) => renderCard(item))
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default TrackOrder;






// -------------- working code of track order above---------





import React, { useState } from "react";
import axios from "axios";
import "./TrackOrder.css";

const TrackOrder = () => {
  const [batchId, setBatchId] = useState("");
  const [data, setData] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [modelFilter, setModelFilter] = useState("all"); // all / incoming / cleaning / packing

  const token = localStorage.getItem("token");

  // Fetch batch history
  const fetchHistory = async () => {
    if (!batchId) return;
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(
        `https://vatan-foods-backend-final.onrender.com/api/track-orders/${batchId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setData(res.data);
      setFilteredData(res.data); // initially show all
    } catch (err) {
      console.error(err);
      setError("Failed to fetch history.");
    } finally {
      setLoading(false);
    }
  };

  // Date-only helper
  const toDateString = (timestamp) => new Date(timestamp).toISOString().split("T")[0];

  // Apply filters
  const applyFilters = () => {
    if (!data) return;

    const modelsToCheck =
      modelFilter === "all" ? ["incoming", "cleaning", "packing"] : [modelFilter];

    const result = {};

    modelsToCheck.forEach((modelKey) => {
      if (!data[modelKey]) return;
      result[modelKey] = data[modelKey].filter((item) => {
        const itemDate = toDateString(item.timestamp);
        const from = fromDate || "1970-01-01"; // default min
        const to = toDate || "9999-12-31"; // default max
        return itemDate >= from && itemDate <= to;
      });
    });

    setFilteredData(result);
  };

  // Preset filters
  const applyPreset = (type) => {
    const today = new Date();
    let from, to;

    if (type === "7days") {
      from = new Date(today);
      from.setDate(today.getDate() - 7);
    } else if (type === "1month") {
      from = new Date(today);
      from.setMonth(today.getMonth() - 1);
    }

    setFromDate(from.toISOString().split("T")[0]);
    setToDate(today.toISOString().split("T")[0]);
  };

  const excludeFields = [
    "_id",
    "__v",
    "incomingId",
    "cleaningId",
    "packingId",
    "createdBy",
    "history",
  ];

  const filterData = (obj) =>
    Object.fromEntries(Object.entries(obj).filter(([key]) => !excludeFields.includes(key)));

  const renderCard = (item) => {
    const { action, data: itemData, updatedBy, timestamp, model } = item;
    const previous = itemData.previous || null;
    const updated = itemData.updated || itemData;

    const prevFiltered = previous ? filterData(previous) : null;
    const updatedFiltered = filterData(updated);

    return (
      <div className="timeline-card" key={item._id}>
        <div className="timeline-header">
          <span className="model">{model}</span>
          <span className="timestamp">{new Date(timestamp).toLocaleString()}</span>
          <span className={`action ${action.toLowerCase()}`}>{action}</span>
        </div>

        <div className="timeline-body">
          {prevFiltered ? (
            <div className="prev-upd-container">
              <div className="prev">
                <h4>Previous</h4>
                {Object.entries(prevFiltered).map(([key, val]) => (
                  <p key={key}>
                    <strong>{key}:</strong>{" "}
                    {val && typeof val === "object" ? JSON.stringify(val) : val?.toString()}
                  </p>
                ))}
              </div>
              <div className="updated">
                <h4>Updated</h4>
                {Object.entries(updatedFiltered).map(([key, val]) => (
                  <p key={key}>
                    <strong>{key}:</strong>{" "}
                    {val && typeof val === "object" ? JSON.stringify(val) : val?.toString()}
                  </p>
                ))}
              </div>
            </div>
          ) : (
            <div className="updated-only">
              {Object.entries(updatedFiltered).map(([key, val]) => (
                <p key={key}>
                  <strong>{key}:</strong>{" "}
                  {val && typeof val === "object" ? JSON.stringify(val) : val?.toString()}
                </p>
              ))}
            </div>
          )}
          <p className="updatedBy">Updated by: {updatedBy}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="timeline-container">
      <h2>Batch History Timeline</h2>

      <div className="filters-container">
        <div className="input-container">
          <input
            type="text"
            placeholder="Enter Batch ID"
            value={batchId}
            onChange={(e) => setBatchId(e.target.value)}
          />
          <button onClick={fetchHistory}>Fetch History</button>
        </div>

        <div className="model-filter">
          <label>Model:</label>
          <select value={modelFilter} onChange={(e) => setModelFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="incoming">Incoming</option>
            <option value="cleaning">Cleaning</option>
            <option value="packing">Packing</option>
          </select>
        </div>

        <div className="date-filter">
          <label>From:</label>
          <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          <label>To:</label>
          <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
        </div>

        <div className="preset-buttons">
          <button onClick={() => applyPreset("7days")}>Last 7 Days</button>
          <button onClick={() => applyPreset("1month")}>Last 1 Month</button>
        </div>

        <div className="apply-filters-btn">
          <button onClick={applyFilters}>Apply Filters</button>
        </div>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      {filteredData && (
        <div className="timeline-section">
          {["incoming", "cleaning", "packing"].map(
            (modelKey) =>
              filteredData[modelKey]?.map((item) => renderCard(item))
          )}
        </div>
      )}
    </div>
  );
};

export default TrackOrder;
