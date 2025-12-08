// import React, { useMemo } from "react";
// import { Bar, Line, Pie } from "react-chartjs-2";
// import ChartDataLabels from "chartjs-plugin-datalabels";

// /**
//  * IncomingReports
//  * Props:
//  *  - incomingData: array of incoming records
//  */
// const lightColors = [
//   "#a2d5f2", "#ffb3c1", "#c1fba4", "#fce1a8", "#d3c0f9",
//   "#f5c0c0", "#9bf6ff", "#ffd6a5", "#caffbf", "#ffc6ff"
// ];

// const ensureColor = (i) => lightColors[i % lightColors.length];

// const formatDateKey = (iso) => {
//   const d = new Date(iso);
//   if (Number.isNaN(d.getTime())) return "Unknown";
//   return d.toISOString().slice(0, 10);
// };

// const IncomingReports = ({ incomingData = [] }) => {
//   const {
//     totalPerItemArr,
//     vendorTotalsArr,
//     dateBucketsArr,
//     batchTotalsArr,
//     vehicleTotalsArr,
//   } = useMemo(() => {
//     // Group by itemName
//     const byItem = incomingData.reduce((acc, r) => {
//       const k = r.itemName || "Unknown";
//       acc[k] = acc[k] || { total: 0, unit: r.unit || "", rows: [] };
//       acc[k].total += Number(r.totalQuantity || 0);
//       acc[k].rows.push(r);
//       return acc;
//     }, {});
//     const totalPerItemArr = Object.entries(byItem).map(([item, v]) => ({ item, total: v.total, unit: v.unit, rows: v.rows })).sort((a,b)=>b.total-a.total);

//     // vendor totals
//     const byVendor = incomingData.reduce((acc, r) => {
//       const k = r.vendorName || "Unknown";
//       acc[k] = acc[k] || { total: 0, rows: [] };
//       acc[k].total += Number(r.totalQuantity || 0);
//       acc[k].rows.push(r);
//       return acc;
//     }, {});
//     const vendorTotalsArr = Object.entries(byVendor).map(([vendor, v]) => ({ vendor, total: v.total, rows: v.rows })).sort((a,b)=>b.total-a.total);

//     // date buckets
//     const byDate = incomingData.reduce((acc, r) => {
//       const k = formatDateKey(r.timestamp || r.createdAt || r.updatedAt);
//       acc[k] = acc[k] || { total: 0, rows: [] };
//       acc[k].total += Number(r.totalQuantity || 0);
//       acc[k].rows.push(r);
//       return acc;
//     }, {});
//     const dateBucketsArr = Object.entries(byDate).map(([date, v]) => ({ date, total: v.total, rows: v.rows })).sort((a,b)=>a.date.localeCompare(b.date));

//     // batch totals
//     const byBatch = incomingData.reduce((acc, r) => {
//       const k = r.batchId || "Unknown";
//       acc[k] = acc[k] || { total: 0, rows: [] };
//       acc[k].total += Number(r.totalQuantity || 0);
//       acc[k].rows.push(r);
//       return acc;
//     }, {});
//     const batchTotalsArr = Object.entries(byBatch).map(([batchId, v]) => ({ batchId, total: v.total, rows: v.rows })).sort((a,b)=>b.total-a.total);

//     // vehicle totals
//     const byVehicle = incomingData.reduce((acc, r) => {
//       const k = r.vehicleNo || "Unknown";
//       acc[k] = acc[k] || { total: 0, rows: [] };
//       acc[k].total += Number(r.totalQuantity || 0);
//       acc[k].rows.push(r);
//       return acc;
//     }, {});
//     const vehicleTotalsArr = Object.entries(byVehicle).map(([vehicleNo, v]) => ({ vehicleNo, total: v.total, rows: v.rows })).sort((a,b)=>b.total-a.total);

//     return { totalPerItemArr, vendorTotalsArr, dateBucketsArr, batchTotalsArr, vehicleTotalsArr };
//   }, [incomingData]);

//   // Chart data
//   const totalPerItemData = {
//     labels: totalPerItemArr.map(i => i.item),
//     datasets: [{ label: "Qty", data: totalPerItemArr.map(i=>i.total), backgroundColor: totalPerItemArr.map((_,i)=>ensureColor(i)) }]
//   };

//   const vendorShareData = {
//     labels: vendorTotalsArr.map(v => v.vendor),
//     datasets: [{ data: vendorTotalsArr.map(v=>v.total), backgroundColor: vendorTotalsArr.map((_,i)=>ensureColor(i)) }]
//   };

//   const trendData = {
//     labels: dateBucketsArr.map(d=>d.date),
//     datasets: [{
//       label: "Incoming Qty",
//       data: dateBucketsArr.map(d=>d.total),
//       fill: true,
//       tension: 0.3,
//       backgroundColor: ensureColor(0) + "33",
//       borderColor: ensureColor(0)
//     }]
//   };

//   const batchData = {
//     labels: batchTotalsArr.map(b=>b.batchId),
//     datasets: [{ label: "Batch Qty", data: batchTotalsArr.map(b=>b.total), backgroundColor: batchTotalsArr.map((_,i)=>ensureColor(i)) }]
//   };

//   const vehicleData = {
//     labels: vehicleTotalsArr.map(v=>v.vehicleNo),
//     datasets: [{ label: "Vehicle Load", data: vehicleTotalsArr.map(v=>v.total), backgroundColor: vehicleTotalsArr.map((_,i)=>ensureColor(i)) }]
//   };

//   // KPIs
//   const totalItems = totalPerItemArr.length;
//   const totalVendors = vendorTotalsArr.length;
//   const grandTotalQty = totalPerItemArr.reduce((s,x)=>s+x.total,0);

//   return (
//     <div className="report-card">
//       <div className="card-header">
//         <div>
//           <h3 className="card-title">Incoming — Purchases & Receipts</h3>
//           <div className="card-sub">Overview of incoming raw materials</div>
//         </div>
//       </div>

//       <div className="kpi-row" style={{marginTop:8, marginBottom:8}}>
//         <div className="kpi"><h3>{grandTotalQty}</h3><p className="card-sub">Total Quantity</p></div>
//         <div className="kpi"><h3>{totalItems}</h3><p className="card-sub">Item types</p></div>
//         <div className="kpi"><h3>{totalVendors}</h3><p className="card-sub">Vendors</p></div>
//       </div>

//       <div className="charts-grid" style={{marginTop:8}}>
//         <div style={{minHeight:220}}>
//           <Bar data={totalPerItemData} options={{plugins:{title:{display:true,text:"Total Qty per Item"}, legend:{display:false}, datalabels:{display:false}}, maintainAspectRatio:false}} />
//         </div>

//         <div style={{minHeight:220}}>
//           <Pie data={vendorShareData} options={{plugins:{title:{display:true,text:"Vendor Share"}, datalabels:{display:true, formatter:(v)=>`${Math.round(v)} `}}, maintainAspectRatio:false}} />
//         </div>

//         <div style={{gridColumn:"1 / -1", minHeight:260}}>
//           <Line data={trendData} options={{plugins:{title:{display:true,text:"Incoming Trend (by date)"}}, maintainAspectRatio:false}} />
//         </div>

//         <div>
//           <Bar data={batchData} options={{plugins:{title:{display:true,text:"Batch-wise Quantity"}, datalabels:{anchor:"end",align:"end"}}, maintainAspectRatio:false}} />
//         </div>

//         <div>
//           <Bar data={vehicleData} options={{plugins:{title:{display:true,text:"Vehicle Load"}}, maintainAspectRatio:false}} />
//         </div>
//       </div>

//       <div style={{marginTop:10, display:"flex", gap:10, flexWrap:"wrap"}}>
//         <div style={{flex:1}}>
//           <h4 style={{margin:"6px 0"}}>Top Items</h4>
//           <ol className="small-list">
//             {totalPerItemArr.slice(0,6).map(it => <li key={it.item}><span>{it.item}</span><span className="small-muted">{it.total} {it.unit || ""}</span></li>)}
//           </ol>
//         </div>

//         <div style={{flex:1}}>
//           <h4 style={{margin:"6px 0"}}>Top Vendors</h4>
//           <ol className="small-list">
//             {vendorTotalsArr.slice(0,6).map(v => <li key={v.vendor}><span>{v.vendor}</span><span className="small-muted">{v.total}</span></li>)}
//           </ol>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default IncomingReports;









import React, { useMemo } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

const lightColors = [
  "#a2d5f2", "#ffb3c1", "#c1fba4", "#fce1a8", "#d3c0f9",
  "#f5c0c0", "#9bf6ff", "#ffd6a5", "#caffbf", "#ffc6ff"
];
const ensureColor = (i) => lightColors[i % lightColors.length];

const formatDateKey = (iso) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "Unknown";
  return d.toISOString().slice(0, 10);
};

const IncomingReports = ({ incomingData = [], startDate, endDate }) => {

  // 🔥 1. Filter by date range first
  const filteredData = useMemo(() => {
    if (!startDate && !endDate) return incomingData;

    const sd = startDate ? new Date(startDate) : null;
    const ed = endDate ? new Date(endDate) : null;

    return incomingData.filter((r) => {
      const d = new Date(r.timestamp || r.createdAt || r.updatedAt);

      if (Number.isNaN(d.getTime())) return false;

      if (sd && d < sd) return false;
      if (ed && d > ed) return false;

      return true;
    });
  }, [incomingData, startDate, endDate]);

  // 🔥 2. Compute chart groups from filtered data
  const {
    totalPerItemArr,
    vendorTotalsArr,
    dateBucketsArr,
    batchTotalsArr,
    vehicleTotalsArr,
  } = useMemo(() => {

    // item totals
    const byItem = filteredData.reduce((acc, r) => {
      const k = r.itemName || "Unknown";
      acc[k] = acc[k] || { total: 0, unit: r.unit || "", rows: [] };
      acc[k].total += Number(r.totalQuantity || 0);
      acc[k].rows.push(r);
      return acc;
    }, {});
    const totalPerItemArr = Object.entries(byItem)
      .map(([item, v]) => ({ item, total: v.total, unit: v.unit, rows: v.rows }))
      .sort((a, b) => b.total - a.total);

    // vendor totals
    const byVendor = filteredData.reduce((acc, r) => {
      const k = r.vendorName || "Unknown";
      acc[k] = acc[k] || { total: 0, rows: [] };
      acc[k].total += Number(r.totalQuantity || 0);
      acc[k].rows.push(r);
      return acc;
    }, {});
    const vendorTotalsArr = Object.entries(byVendor)
      .map(([vendor, v]) => ({ vendor, total: v.total, rows: v.rows }))
      .sort((a, b) => b.total - a.total);

    // date totals
    const byDate = filteredData.reduce((acc, r) => {
      const k = formatDateKey(r.timestamp || r.createdAt || r.updatedAt);
      acc[k] = acc[k] || { total: 0, rows: [] };
      acc[k].total += Number(r.totalQuantity || 0);
      acc[k].rows.push(r);
      return acc;
    }, {});
    const dateBucketsArr = Object.entries(byDate)
      .map(([date, v]) => ({ date, total: v.total, rows: v.rows }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // batch totals
    const byBatch = filteredData.reduce((acc, r) => {
      const k = r.batchId || "Unknown";
      acc[k] = acc[k] || { total: 0, rows: [] };
      acc[k].total += Number(r.totalQuantity || 0);
      acc[k].rows.push(r);
      return acc;
    }, {});
    const batchTotalsArr = Object.entries(byBatch)
      .map(([batchId, v]) => ({ batchId, total: v.total, rows: v.rows }))
      .sort((a, b) => b.total - a.total);

    // vehicle totals
    const byVehicle = filteredData.reduce((acc, r) => {
      const k = r.vehicleNo || "Unknown";
      acc[k] = acc[k] || { total: 0, rows: [] };
      acc[k].total += Number(r.totalQuantity || 0);
      acc[k].rows.push(r);
      return acc;
    }, {});
    const vehicleTotalsArr = Object.entries(byVehicle)
      .map(([vehicleNo, v]) => ({ vehicleNo, total: v.total, rows: v.rows }))
      .sort((a, b) => b.total - a.total);

    return {
      totalPerItemArr,
      vendorTotalsArr,
      dateBucketsArr,
      batchTotalsArr,
      vehicleTotalsArr
    };
  }, [filteredData]);

  // 🔥 3. Chart Data
  const totalPerItemData = {
    labels: totalPerItemArr.map(i => i.item),
    datasets: [
      {
        label: "Qty",
        data: totalPerItemArr.map(i => i.total),
        backgroundColor: totalPerItemArr.map((_, i) => ensureColor(i)),
      },
    ],
  };

  const vendorShareData = {
    labels: vendorTotalsArr.map(v => v.vendor),
    datasets: [
      {
        data: vendorTotalsArr.map(v => v.total),
        backgroundColor: vendorTotalsArr.map((_, i) => ensureColor(i)),
      },
    ],
  };

  const trendData = {
    labels: dateBucketsArr.map(d => d.date),
    datasets: [
      {
        label: "Incoming Qty",
        data: dateBucketsArr.map(d => d.total),
        fill: true,
        tension: 0.3,
        backgroundColor: ensureColor(0) + "33",
        borderColor: ensureColor(0),
      },
    ],
  };

  const batchData = {
    labels: batchTotalsArr.map(b => b.batchId),
    datasets: [
      {
        label: "Batch Qty",
        data: batchTotalsArr.map(b => b.total),
        backgroundColor: batchTotalsArr.map((_, i) => ensureColor(i)),
      },
    ],
  };

  const vehicleData = {
    labels: vehicleTotalsArr.map(v => v.vehicleNo),
    datasets: [
      {
        label: "Vehicle Load",
        data: vehicleTotalsArr.map(v => v.total),
        backgroundColor: vehicleTotalsArr.map((_, i) => ensureColor(i)),
      },
    ],
  };

  // KPIs
  const totalItems = totalPerItemArr.length;
  const totalVendors = vendorTotalsArr.length;
  const grandTotalQty = totalPerItemArr.reduce((s, x) => s + x.total, 0);

  return (
    <div className="report-card">

      <div className="card-header">
        <div>
          <h3 className="card-title">Incoming — Purchases & Receipts</h3>
          <div className="card-sub">Filtered by selected date range</div>
        </div>
      </div>

      <div className="kpi-row" style={{ marginTop: 8, marginBottom: 8 }}>
        <div className="kpi"><h3>{grandTotalQty}</h3><p>Total Quantity</p></div>
        <div className="kpi"><h3>{totalItems}</h3><p>Item types</p></div>
        <div className="kpi"><h3>{totalVendors}</h3><p>Vendors</p></div>
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <div style={{ minHeight: 220 }}>
          <Bar data={totalPerItemData} options={{ plugins: { title: { display: true, text: "Total Qty per Item" } } }} />
        </div>

        <div style={{ minHeight: 220 }}>
          <Pie data={vendorShareData} options={{ plugins: { title: { display: true, text: "Vendor Share" } } }} />
        </div>

        <div style={{ gridColumn: "1 / -1", minHeight: 260 }}>
          <Line data={trendData} options={{ plugins: { title: { display: true, text: "Incoming Trend (by Date)" } } }} />
        </div>

        <div>
          <Bar data={batchData} options={{ plugins: { title: { display: true, text: "Batch-wise Quantity" } } }} />
        </div>

        <div>
          <Bar data={vehicleData} options={{ plugins: { title: { display: true, text: "Vehicle Load" } } }} />
        </div>
      </div>

      {/* LISTS */}
      <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
        <div style={{ flex: 1 }}>
          <h4>Top Items</h4>
          <ol>
            {totalPerItemArr.slice(0, 6).map(it => (
              <li key={it.item}>{it.item} — {it.total} {it.unit}</li>
            ))}
          </ol>
        </div>

        <div style={{ flex: 1 }}>
          <h4>Top Vendors</h4>
          <ol>
            {vendorTotalsArr.slice(0, 6).map(v => (
              <li key={v.vendor}>{v.vendor} — {v.total}</li>
            ))}
          </ol>
        </div>
      </div>

    </div>
  );
};

export default IncomingReports;
