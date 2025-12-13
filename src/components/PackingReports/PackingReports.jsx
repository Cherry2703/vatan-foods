import React, { useMemo } from "react";
import { Bar, Pie, Line } from "react-chartjs-2";

/**
 * PackingReports
 * Props:
 *  - packingData: array of packing records (based on your model)
 */
const accent = ["#a2d5f2","#ffd6a5","#c1fba4","#ffb3c1","#d3c0f9","#f5c0c0"];
const ensureColor = (i) => accent[i % accent.length];

const PackingReports = ({ packingData = [] }) => {
  const {
    byItem, statusCounts, packingTypeCounts, trendByDate, bagStats, wasteTotals
  } = useMemo(() => {
    const byItemMap = {};
    const statusCounts = {};
    const packingTypeCounts = {};
    const byDate = {};
    let totalBags = 0, totalPacked = 0, totalWastage = 0;

    packingData.forEach(r => {
      const item = r.itemName || "Unknown";
      const status = r.status || "Unknown";
      const ptype = r.packingType || "Manual Packaging";
      const dateKey = (r.createdAt || r.updatedAt) ? new Date(r.createdAt || r.updatedAt).toISOString().slice(0,10) : "Unknown";

      byItemMap[item] = byItemMap[item] || { packed:0, output:0, bags:0 };
      byItemMap[item].packed += Number(r.outputPacked || 0);
      byItemMap[item].bags += Number(r.numberOfBags || 0);
      byItemMap[item].output += Number(r.outputPacked || 0);

      statusCounts[status] = (statusCounts[status] || 0) + 1;
      packingTypeCounts[ptype] = (packingTypeCounts[ptype] || 0) + 1;

      byDate[dateKey] = byDate[dateKey] || { packed:0 };
      byDate[dateKey].packed += Number(r.outputPacked || 0);

      totalBags += Number(r.numberOfBags || 0);
      totalPacked += Number(r.outputPacked || 0);
      totalWastage += Number(r.wastage || 0);
    });

    const byItem = Object.entries(byItemMap).map(([item, v])=>({ item, ...v })).sort((a,b)=>b.output-a.output);
    const trendByDate = Object.entries(byDate).map(([date,v])=>({ date, ...v })).sort((a,b)=>a.date.localeCompare(b.date));
    const bagStats = { totalBags, totalPacked, totalWastage };
    const wasteTotals = totalWastage;

    return { byItem, statusCounts, packingTypeCounts, trendByDate, bagStats, wasteTotals };
  }, [packingData]);

  const itemData = {
    labels: byItem.map(b=>b.item),
    datasets: [{ label: "Packed Output", data: byItem.map(b=>b.output), backgroundColor: byItem.map((_,i)=>ensureColor(i)) }]
  };

  const statusData = {
    labels: Object.keys(statusCounts),
    datasets: [{ data: Object.values(statusCounts), backgroundColor: Object.keys(statusCounts).map((_,i)=>ensureColor(i)) }]
  };

  const typeData = {
    labels: Object.keys(packingTypeCounts),
    datasets: [{ data: Object.values(packingTypeCounts), backgroundColor: Object.keys(packingTypeCounts).map((_,i)=>ensureColor(i)) }]
  };

  const trendData = {
    labels: trendByDate.map(t=>t.date),
    datasets: [{ label: "Packed Qty", data: trendByDate.map(t=>t.packed), borderColor: ensureColor(1), fill:false }]
  };

  // KPIs
  const totalItemsPacked = byItem.reduce((s,i)=>s+i.output,0);
  const totalBags = bagStats.totalBags;
  const totalWastage = bagStats.totalWastage;

  return (
    <div className="report-card">
      <div className="card-header">
        <div>
          <h3 className="card-title">Packing — Output & Quality</h3>
          <div className="card-sub">Packing productivity, bags, and wastage</div>
        </div>
      </div>

      <div className="kpi-row" style={{marginTop:8}}>
        <div className="kpi"><h3>{totalItemsPacked}</h3><p className="card-sub">Total Packed</p></div>
        <div className="kpi"><h3>{totalBags}</h3><p className="card-sub">Total Bags</p></div>
        <div className="kpi"><h3>{totalWastage}</h3><p className="card-sub">Total Wastage</p></div>
      </div>

      <div className="charts-grid" style={{marginTop:8}}>
        <div style={{minHeight:200}}>
          <Bar data={itemData} options={{plugins:{title:{display:true,text:"Packed Qty per Item"}}, maintainAspectRatio:false}} />
        </div>

        <div style={{minHeight:200}}>
          <Pie data={statusData} options={{plugins:{title:{display:true,text:"Packing Status Distribution"}}, maintainAspectRatio:false}} />
        </div>

        {/* <div style={{gridColumn:"1 / -1", minHeight:220}}>
          <Line data={trendData} options={{plugins:{title:{display:true,text:"Packing Trend (by date)"}}, maintainAspectRatio:false}} />
        </div> */}

        <div>
          <Pie data={typeData} options={{plugins:{title:{display:true,text:"Packing Type Distribution"}}, maintainAspectRatio:false}} />
        </div>
      </div>

    </div>
  );
};

export default PackingReports;
