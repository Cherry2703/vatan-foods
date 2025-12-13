import React, { useMemo } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";


const palette = ["#a2d5f2","#ffd6a5","#c1fba4","#ffb3c1","#d3c0f9","#f5c0c0"];

const ensureColor = (i) => palette[i % palette.length];

const OrdersReports = ({ ordersData = [] }) => {
  const {
    ordersByDate,
    statusCounts,
    topCities,
    revenueByDate,
    topItems,
  } = useMemo(() => {
    const byDate = {};
    const statusCounts = {};
    const cityCounts = {};
    const revenueByDate = {};
    const itemMap = {};

    ordersData.forEach(o => {
      const dateKey = (o.deliveryDate) ? o.deliveryDate.slice(0,10) : (o.orderedDate ? o.orderedDate.slice(0,10) : (o.createdAt ? new Date(o.createdAt).toISOString().slice(0,10) : "Unknown"));
      byDate[dateKey] = (byDate[dateKey] || 0) + 1;
      revenueByDate[dateKey] = (revenueByDate[dateKey] || 0) + Number(o.totalAmount || 0);

      const status = o.orderStatus || "Unknown";
      statusCounts[status] = (statusCounts[status] || 0) + 1;

      const city = o.deliveryCity || "Unknown";
      cityCounts[city] = (cityCounts[city] || 0) + 1;

      // items
      (o.items || []).forEach(it => {
        const name = it.name || "Unknown";
        itemMap[name] = (itemMap[name] || 0) + Number(it.quantity || 0);
      });
    });

    const ordersByDate = Object.entries(byDate).map(([date,count])=>({ date, count })).sort((a,b)=>a.date.localeCompare(b.date));
    const revenueByDateArr = Object.entries(revenueByDate).map(([date,rev])=>({ date, rev })).sort((a,b)=>a.date.localeCompare(b.date));
    const topCities = Object.entries(cityCounts).map(([city,c])=>({ city, count:c })).sort((a,b)=>b.count-a.count);
    const topItems = Object.entries(itemMap).map(([name,q])=>({ name, qty:q })).sort((a,b)=>b.qty-a.qty);

    return { ordersByDate, statusCounts, topCities, revenueByDate: revenueByDateArr, topItems };
  }, [ordersData]);

  const ordersTrend = {
    labels: ordersByDate.map(d=>d.date),
    datasets: [{ label: "Orders", data: ordersByDate.map(d=>d.count), borderColor: ensureColor(0), fill:false }]
  };

  const statusData = {
    labels: Object.keys(statusCounts),
    datasets: [{ data: Object.values(statusCounts), backgroundColor: Object.keys(statusCounts).map((_,i)=>ensureColor(i)) }]
  };

  const cityData = {
    labels: topCities.slice(0,6).map(c=>c.city),
    datasets: [{ label: "Orders", data: topCities.slice(0,6).map(c=>c.count), backgroundColor: topCities.slice(0,6).map((_,i)=>ensureColor(i)) }]
  };

  const revenueData = {
    labels: revenueByDate.map(d=>d.date),
    datasets: [{ label: "Revenue", data: revenueByDate.map(d=>d.rev), borderColor: ensureColor(2), fill:false }]
  };

  const topItemsData = {
    labels: topItems.slice(0,8).map(i=>i.name),
    datasets: [{ label: "Qty Ordered", data: topItems.slice(0,8).map(i=>i.qty), backgroundColor: topItems.slice(0,8).map((_,i)=>ensureColor(i)) }]
  };

  // KPIs
  const totalOrders = ordersData.length;
  const totalRevenue = ordersData.reduce((s,o)=>s + Number(o.totalAmount || 0), 0);
  const pending = statusCounts["Pending"] || 0;

  return (
    <div className="report-card">
      <div className="card-header">
        <div>
          <h3 className="card-title">Orders — Sales & Delivery</h3>
          <div className="card-sub">Order volume, revenue, and status breakdown</div>
        </div>
      </div>

      <div className="kpi-row" style={{marginTop:8}}>
        <div className="kpi"><h3>{totalOrders}</h3><p className="card-sub">Total Orders</p></div>
        <div className="kpi"><h3>{totalRevenue}</h3><p className="card-sub">Total Revenue</p></div>
        <div className="kpi"><h3>{pending}</h3><p className="card-sub">Pending Orders</p></div>
      </div>

      <div className="charts-grid" style={{marginTop:8}}>
        {/* <div style={{minHeight:200}}>
          <Line data={ordersTrend} options={{plugins:{title:{display:true,text:"Orders Trend (by date)"}}, maintainAspectRatio:false}} />
        </div> */}

        <div style={{minHeight:200}}>
          <Pie data={statusData} options={{plugins:{title:{display:true,text:"Order Status Distribution"}}, maintainAspectRatio:false}} />
        </div>

        {/* <div style={{gridColumn:"1 / -1", minHeight:220}}>
          <Line data={revenueData} options={{plugins:{title:{display:true,text:"Revenue Trend"}}, maintainAspectRatio:false}} />
        </div>

        <div>
          <Bar data={cityData} options={{plugins:{title:{display:true,text:"Top Cities (orders)"}}, maintainAspectRatio:false}} />
        </div>

        <div>
          <Bar data={topItemsData} options={{plugins:{title:{display:true,text:"Top Items Ordered"}}, maintainAspectRatio:false}} />
        </div> */}
      </div>
    </div>
  );
};

export default OrdersReports;









