"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";

type Period = "daily" | "weekly" | "monthly";

const vehicleBreakdown = [
  { type: "Car",   pct: 48, color: "var(--blue)"  },
  { type: "Bike",  pct: 28, color: "var(--teal)"  },
  { type: "SUV",   pct: 14, color: "var(--amber)" },
  { type: "Truck", pct:  6, color: "var(--green)" },
  { type: "Auto",  pct:  4, color: "#8b5cf6"      },
];

export default function ReportsPage() {
  const [period, setPeriod] = useState<Period>("daily");
  
  const [chartData, setChartData] = useState<{name: string, revenue: number}[]>([]);
  const [summary, setSummary] = useState({ total: 0, avg: 0, vehicles: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReports() {
       setLoading(true);
       try {
         const res = await fetch(`http://localhost:8000/api/reports?period=${period}`);
         if (res.ok) {
            const data = await res.json();
            setChartData(data.chartData);
            
            // Calculate summary from the chartData
            const total = data.chartData.reduce((acc: number, cur: any) => acc + cur.revenue, 0);
            const avg = data.chartData.length ? Math.round(total / data.chartData.length) : 0;
            const vehicles = Math.round(total / 40); // Rough estimate since ticket count isn't in this endpoint
            
            setSummary({ total, avg, vehicles });
         }
       } catch (e) {
         console.error("Failed to fetch reports:", e);
       } finally {
         setLoading(false);
       }
    }
    fetchReports();
  }, [period]);

  const maxRev = chartData.length > 0 ? Math.max(...chartData.map(c => c.revenue)) : 1000;

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <header className="topbar">
          <div>
            <h2 style={{ fontWeight: 800, fontSize: "1.1rem", color: "#fff" }}>Reports</h2>
            <p style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: 1 }}>Revenue and occupancy analytics</p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {(["daily","weekly","monthly"] as const).map(p => (
              <button key={p} onClick={() => setPeriod(p)} style={{
                padding: "6px 18px", borderRadius: 9999, fontSize: "0.8rem", fontWeight: 600,
                cursor: "pointer", border: "1px solid",
                background: period === p ? "var(--blue)" : "transparent",
                borderColor: period === p ? "var(--blue)" : "var(--border)",
                color: period === p ? "#fff" : "var(--muted)",
                transition: "all 0.2s",
                textTransform: "capitalize",
              }}>{p}</button>
            ))}
            <button className="btn-ghost btn-sm">⬇ Export CSV</button>
          </div>
        </header>

        <main style={{ padding: "28px", flex: 1 }}>
          {/* KPI Row */}
          <div className="grid-3" style={{ marginBottom: 28 }}>
            <div className="glass anim-fade-up" style={{ padding: "24px" }}>
              <p style={{ fontSize: "0.72rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Total Revenue</p>
              <p style={{ fontSize: "2rem", fontWeight: 900, color: "#fff" }}>{loading ? "..." : `₹${summary.total.toLocaleString()}`}</p>
              <p style={{ fontSize: "0.8rem", color: "var(--green)", marginTop: 6, fontWeight: 600 }}>Calculated over period</p>
            </div>
            <div className="glass anim-fade-up delay-100" style={{ padding: "24px" }}>
              <p style={{ fontSize: "0.72rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Avg Revenue</p>
              <p style={{ fontSize: "2rem", fontWeight: 900, color: "#fff" }}>{loading ? "..." : `₹${summary.avg.toLocaleString()}`}</p>
              <p style={{ fontSize: "0.8rem", color: "var(--blue-l)", marginTop: 6, fontWeight: 600 }}>per {period === "daily" ? "day" : period === "weekly" ? "week" : "month"}</p>
            </div>
            <div className="glass anim-fade-up delay-200" style={{ padding: "24px" }}>
              <p style={{ fontSize: "0.72rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Est. Vehicles</p>
              <p style={{ fontSize: "2rem", fontWeight: 900, color: "#fff" }}>{loading ? "..." : summary.vehicles.toLocaleString()}</p>
              <p style={{ fontSize: "0.8rem", color: "var(--amber-l)", marginTop: 6, fontWeight: 600 }}>Estimated volume</p>
            </div>
          </div>

          {/* Chart + Breakdown */}
          <div className="grid-2" style={{ gap: 24, marginBottom: 28 }}>
            {/* Revenue Bar Chart */}
            <div className="glass anim-fade-up" style={{ padding: "24px", gridColumn: "span 2" }}>
              <h3 style={{ fontWeight: 700, color: "#fff", marginBottom: 20, fontSize: "1rem" }}>Revenue Overview</h3>
              {loading ? (
                <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <p style={{ color: "var(--muted)" }}>Loading chart data...</p>
                </div>
              ) : chartData.length === 0 ? (
                <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
                   <p style={{ color: "var(--muted)" }}>No revenue data for this period.</p>
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "flex-end", gap: 16, height: 200 }}>
                  {chartData.map((d, i) => (
                    <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, height: "100%" }}>
                      <div style={{ flex: 1, width: "100%", display: "flex", alignItems: "flex-end" }}>
                        <div style={{
                          width: "100%",
                          height: `${(d.revenue / maxRev) * 100}%`,
                          background: "linear-gradient(180deg, var(--blue), var(--teal))",
                          borderRadius: "4px 4px 0 0",
                          minHeight: 4,
                          transition: "height 0.5s ease",
                          position: "relative",
                        }}>
                          <div style={{
                            position: "absolute", top: -22, left: "50%", transform: "translateX(-50%)",
                            fontSize: "0.6rem", color: "var(--muted)", fontWeight: 600, whiteSpace: "nowrap",
                          }}>₹{d.revenue >= 1000 ? `${(d.revenue/1000).toFixed(1)}k` : d.revenue}</div>
                        </div>
                      </div>
                      <span style={{ fontSize: "0.65rem", color: "var(--muted)", textAlign: "center" }}>{d.name.substring(5)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
