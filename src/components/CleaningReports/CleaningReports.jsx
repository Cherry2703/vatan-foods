import React, { useMemo } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";

/**
 * CleaningReports
 * Props:
 *  - cleaningData: array of cleaning records
 */
const colors = ["#a2d5f2","#c1fba4","#ffd6a5","#ffb3c1","#d3c0f9","#f5c0c0","#9bf6ff"];

const ensureColor = (i) => colors[i % colors.length];

const formatDateKey = (iso) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "Unknown";
  return d.toISOString().slice(0,10);
};

const parseOperators = (opString = "") => {
  return opString.split(",").map(s => s.trim()).filter(Boolean);
};

const CleaningReports = ({ cleaningData = [] }) => {
  const {
    itemsAgg,
    wastageTrend,
    efficiencyArr,
    typeCounts,
    shiftCounts,
    supervisorTotals,
    operatorCounts,
    remainingByItem,
  } = useMemo(() => {
    const itemsMap = {};
    const byDate = {};
    const typeCounts = {};
    const shiftCounts = {};
    const supervisorTotals = {};
    const operatorCounts = {};
    const remainingByItem = {};

    cleaningData.forEach(r => {
      const item = r.itemName || "Unknown";
      const input = Number(r.inputQuantity || 0);
      const output = Number(r.outputQuantity || 0);
      const wastage = Number(r.wastageQuantity || 0);
      const dateKey = formatDateKey(r.timestamp || r.createdAt);
      const type = r.cleaningType || "Unknown";
      const shift = r.shift || "Unknown";
      const sup = r.supervisor || "Unknown";

      // items aggregate
      itemsMap[item] = itemsMap[item] || { input:0, output:0, wastage:0, rows:[] };
      itemsMap[item].input += input;
      itemsMap[item].output += output;
      itemsMap[item].wastage += wastage;
      itemsMap[item].rows.push(r);

      // byDate for trend
      byDate[dateKey] = byDate[dateKey] || { input:0, output:0, wastage:0 };
      byDate[dateKey].input += input;
      byDate[dateKey].output += output;
      byDate[dateKey].wastage += wastage;

      // type counts
      typeCounts[type] = (typeCounts[type] || 0) + 1;

      // shift
      shiftCounts[shift] = (shiftCounts[shift] || 0) + 1;

      // supervisor totals
      supervisorTotals[sup] = (supervisorTotals[sup] || 0) + output;

      // operators (split comma list)
      const ops = parseOperators(r.operator || "");
      ops.forEach(op => { operatorCounts[op] = (operatorCounts[op] || 0) + 1; });

      // remaining after cleaning
      remainingByItem[item] = (remainingByItem[item] || 0) + Number(r.remainingAfterCleaning || 0);
    });

    const itemsAgg = Object.entries(itemsMap).map(([item, v]) => ({
      item, input: v.input, output: v.output, wastage: v.wastage, efficiency: v.input ? (v.output / v.input) * 100 : 0
    })).sort((a,b)=>b.input-a.input);

    const wastageTrend = Object.entries(byDate).map(([date,v])=>({ date, ...v })).sort((a,b)=>a.date.localeCompare(b.date));

    const efficiencyArr = itemsAgg.map(i=>({ item:i.item, efficiency: Number(i.efficiency.toFixed(2)), input:i.input, output:i.output, wastage:i.wastage }));

    const typeCountArr = Object.entries(typeCounts).map(([k,v])=>({ type:k, count:v }));
    const shiftArr = Object.entries(shiftCounts).map(([k,v])=>({ shift:k, count:v }));
    const supervisorTotalsArr = Object.entries(supervisorTotals).map(([k,v])=>({ supervisor:k, total:v })).sort((a,b)=>b.total-a.total);
    const operatorCountsArr = Object.entries(operatorCounts).map(([k,v])=>({ operator:k, count:v })).sort((a,b)=>b.count-a.count);

    const remainingByItemArr = Object.entries(remainingByItem).map(([item,total])=>({ item, total })).sort((a,b)=>b.total-a.total);

    return {
      itemsAgg,
      wastageTrend,
      efficiencyArr,
      typeCounts: typeCountArr,
      shiftCounts: shiftArr,
      supervisorTotals: supervisorTotalsArr,
      operatorCounts: operatorCountsArr,
      remainingByItem: remainingByItemArr
    };
  }, [cleaningData]);

  // Data for charts
  const ioData = {
    labels: itemsAgg.map(i=>i.item),
    datasets: [
      { label: "Input", data: itemsAgg.map(i=>i.input), backgroundColor: itemsAgg.map((_,i)=>ensureColor(i)) },
      { label: "Output", data: itemsAgg.map(i=>i.output), backgroundColor: itemsAgg.map((_,i)=>ensureColor(i+3)) },
      { label: "Wastage", data: itemsAgg.map(i=>i.wastage), backgroundColor: itemsAgg.map((_,i)=>ensureColor(i+6)) }
    ]
  };

  const wastageTrendData = {
    labels: wastageTrend.map(d=>d.date),
    datasets: [
      { label: "Wastage", data: wastageTrend.map(d=>d.wastage), borderColor: ensureColor(2), fill:false }
    ]
  };

  const efficiencyData = {
    labels: efficiencyArr.map(e=>e.item),
    datasets: [{ label: "Efficiency %", data: efficiencyArr.map(e=>e.efficiency), backgroundColor: efficiencyArr.map((_,i)=>ensureColor(i)) }]
  };

  const typePie = {
    labels: typeCounts.map(t=>t.type),
    datasets: [{ data: typeCounts.map(t=>t.count), backgroundColor: typeCounts.map((_,i)=>ensureColor(i)) }]
  };

  const shiftPie = {
    labels: shiftCounts.map(s=>s.shift),
    datasets: [{ data: shiftCounts.map(s=>s.count), backgroundColor: shiftCounts.map((_,i)=>ensureColor(i)) }]
  };

  const remainingData = {
    labels: remainingByItem.map(r=>r.item),
    datasets: [{ label: "Remaining After Cleaning", data: remainingByItem.map(r=>r.total), backgroundColor: remainingByItem.map((_,i)=>ensureColor(i)) }]
  };

  // KPIs
  const totalOps = cleaningData.length;
  const totalInput = itemsAgg.reduce((s,i)=>s+i.input,0);
  const totalOutput = itemsAgg.reduce((s,i)=>s+i.output,0);
  const totalWastage = itemsAgg.reduce((s,i)=>s+i.wastage,0);
  const avgEfficiency = itemsAgg.length ? (itemsAgg.reduce((s,i)=>s+i.efficiency,0)/itemsAgg.length).toFixed(2) : 0;

  return (
    <div className="report-card">
      <div className="card-header">
        <div>
          <h3 className="card-title">Cleaning — Process & Quality</h3>
          <div className="card-sub">Input/output performance, wastage & operator metrics</div>
        </div>
      </div>

      <div className="kpi-row" style={{marginTop:8}}>
        <div className="kpi"><h3>{totalOps}</h3><p className="card-sub">Cleaning Ops</p></div>
        <div className="kpi"><h3>{totalInput}</h3><p className="card-sub">Total Input</p></div>
        <div className="kpi"><h3>{totalOutput}</h3><p className="card-sub">Total Output</p></div>
        <div className="kpi"><h3>{totalWastage}</h3><p className="card-sub">Total Wastage</p></div>
        <div className="kpi"><h3>{avgEfficiency}%</h3><p className="card-sub">Avg Efficiency</p></div>
      </div>

      <div className="charts-grid" style={{marginTop:8}}>
        <div style={{minHeight:200}}>
          <Bar data={ioData} options={{plugins:{title:{display:true,text:"Input / Output / Wastage by Item"}, datalabels:{display:false}}, maintainAspectRatio:false}} />
        </div>

        <div style={{minHeight:200}}>
          <Pie data={typePie} options={{plugins:{title:{display:true,text:"Cleaning Type Distribution"}}, maintainAspectRatio:false}} />
        </div>

        {/* <div style={{gridColumn:"1 / -1", minHeight:220}}>
          <Line data={wastageTrendData} options={{plugins:{title:{display:true,text:"Wastage Trend (by date)"}}, maintainAspectRatio:false}} />
        </div> */}

        {/* <div>
          <Bar data={efficiencyData} options={{plugins:{title:{display:true,text:"Efficiency % by Item"}, datalabels:{anchor:"end",align:"end"}}, maintainAspectRatio:false}} />
        </div> */}

        <div>
          <Pie data={shiftPie} options={{plugins:{title:{display:true,text:"Shift Distribution"}}, maintainAspectRatio:false}} />
        </div>

      </div>

      {/* <div style={{marginTop:10, display:"flex", gap:10, flexWrap:"wrap"}}>
        <div style={{flex:1}}>
          <h4 style={{margin:"6px 0"}}>Top Operators</h4>
          <ol className="small-list">
            {operatorCounts.slice(0,6).map(o => <li key={o.operator}><span>{o.operator}</span><span className="small-muted">{o.count}</span></li>)}
          </ol>
        </div>

        <div style={{flex:1}}>
          <h4 style={{margin:"6px 0"}}>Remaining Stock (sample)</h4>
          <ol className="small-list">
            {remainingByItem.slice(0,6).map(r => <li key={r.item}><span>{r.item}</span><span className="small-muted">{r.total}</span></li>)}
          </ol>
        </div>
      </div> */}
    </div>
  );
};

export default CleaningReports;
