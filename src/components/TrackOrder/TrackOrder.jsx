// import React, { useState } from "react";
// import axios from "axios";
// import "./TrackOrder.css"; // We will define timeline styles here

// const TrackOrder = () => {
//   const [batchId, setBatchId] = useState("");
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const token = localStorage.getItem("token");

//   const fetchHistory = async () => {
//     if (!batchId) return alert("Enter a batch ID");
//     setLoading(true);
//     try {
//       const res = await axios.get(`https://vatan-foods-backend-final.onrender.com/api/track-orders/${batchId}`,{ headers: { Authorization: `Bearer ${token}` } });
//       setData(res.data);
//       console.log(res);
      
//     } catch (err) {
//       console.error(err);
//       alert("Failed to fetch history");
//     }
//     setLoading(false);
//   };

//   const renderCard = (item) => {
//     const { action, data: itemData, updatedBy, timestamp, model } = item;
//     const previous = itemData.previous || null;
//     const updated = itemData.updated || itemData;

//     return (
//       <div className="timeline-card" key={item._id}>
//         <div className="timeline-header">
//           <span className="model">{model}</span>
//           <span className="timestamp">{new Date(timestamp).toLocaleString()}</span>
//           <span className={`action ${action.toLowerCase()}`}>{action}</span>
//         </div>
//         <div className="timeline-body">
//           {previous ? (
//             <div className="prev-upd-container">
//               <div className="prev">
//                 <h4>Previous</h4>
//                 {Object.entries(previous).map(([key, val]) => (
//                   <p key={key}>
//                     <strong>{key}:</strong>{" "}
//                     {val && typeof val === "object" ? JSON.stringify(val) : val?.toString()}
//                   </p>
//                 ))}
//               </div>
//               <div className="updated">
//                 <h4>Updated</h4>
//                 {Object.entries(updated).map(([key, val]) => (
//                   <p key={key}>
//                     <strong>{key}:</strong>{" "}
//                     {val && typeof val === "object" ? JSON.stringify(val) : val?.toString()}
//                   </p>
//                 ))}
//               </div>
//             </div>
//           ) : (
//             <div className="updated-only">
//               {Object.entries(updated).map(([key, val]) => (
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
//     <div className="batch-timeline-container">
//       <h2>Batch History Timeline</h2>
//       <div className="batch-input">
//         <input
//           type="text"
//           placeholder="Enter Batch ID"
//           value={batchId}
//           onChange={(e) => setBatchId(e.target.value)}
//         />
//         <button onClick={fetchHistory} disabled={loading}>
//           {loading ? "Loading..." : "Fetch History"}
//         </button>
//       </div>

//       {data && (
//         <div className="timeline-sections">
//           {["incoming", "cleaning", "packing"].map((section) => (
//             <div key={section} className="timeline-section">
//               <h3>{section.charAt(0).toUpperCase() + section.slice(1)}</h3>
//               {data[section] && data[section].length > 0 ? (
//                 data[section].map((item) => renderCard(item))
//               ) : (
//                 <p>No records</p>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default TrackOrder;






import React, { useState } from "react";
import axios from "axios";
import "./TrackOrder.css"; // You can style this according to your needs

const TrackOrder = () => {
  const [batchId, setBatchId] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
const token = localStorage.getItem("token");


  const fetchHistory = async () => {
    if (!batchId) return;
    setLoading(true);
    setError("");
    try {
    const res = await axios.get(`https://vatan-foods-backend-final.onrender.com/api/track-orders/${batchId}`,{ headers: { Authorization: `Bearer ${token}` } });

      setData(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch history.");
    } finally {
      setLoading(false);
    }
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
    Object.fromEntries(
      Object.entries(obj).filter(([key]) => !excludeFields.includes(key))
    );

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
          <span className="timestamp">
            {new Date(timestamp).toLocaleString()}
          </span>
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
      <div className="input-container">
        <input
          type="text"
          placeholder="Enter Batch ID"
          value={batchId}
          onChange={(e) => setBatchId(e.target.value)}
        />
        <button onClick={fetchHistory}>Fetch History</button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      {data && (
        <div className="timeline-section">
          {["incoming", "cleaning", "packing"].map((modelKey) =>
            data[modelKey]?.map((item) => renderCard(item))
          )}
        </div>
      )}
    </div>
  );
};

export default TrackOrder;
