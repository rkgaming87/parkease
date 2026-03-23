"use client";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";

type Period = "daily" | "weekly" | "monthly";

const data: Record<Period, { labels: string[]; revenue: number[]; tickets: number[]; summary: { total: number; avg: number; vehicles: number } }> = {
  daily: {
    labels:  ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
    revenue: [3200, 4100, 3800, 5200, 4820, 6400, 5100],
    tickets: [72, 88, 80, 103, 91, 124, 98],
    summary: { total: 32620, avg: 4660, vehicles: 656 },
  },
  weekly: {
    labels:  ["Wk 1","Wk 2","Wk 3","Wk 4"],
    revenue: [22400, 31800, 28600, 34200],
    tickets: [520, 740, 660, 798],
    summary: { total: 117000, avg: 29250, vehicles: 2718 },
  },
  monthly: {
    labels:  ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
    revenue: [88000,95000,102000,91000,110000,124000,118000,130000,121000,115000,128000,140000],
    tickets: [2100,2300,2500,2200,2700,3000,2900,3200,2980,2800,3100,3400],
    summary: { total: 1362000, avg: 113500, vehicles: 33180 },
  },
};

const vehicleBreakdown = [
  { type: "Car",   pct: 48, color: "var(--blue)"  },
  { type: "Bike",  pct: 28, color: "var(--teal)"  },
  { type: "SUV",   pct: 14, color: "var(--amber)" },
  { type: "Truck", pct:  6, color: "var(--green)" },
  { type: "Auto",  pct:  4, color: "#8b5cf6"      },
];

export default function ReportsPage() {
  const [period, setPeriod] = useState<Period>("daily");
  const d = data[period];
  const maxRev = Math.max(...d.revenue);

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
              <p style={{ fontSize: "2rem", fontWeight: 900, color: "#fff" }}>₹{d.summary.total.toLocaleString()}</p>
              <p style={{ fontSize: "0.8rem", color: "var(--green)", marginTop: 6, fontWeight: 600 }}>▲ 12% vs previous period</p>
            </div>
            <div className="glass anim-fade-up delay-100" style={{ padding: "24px" }}>
              <p style={{ fontSize: "0.72rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Avg Revenue</p>
              <p style={{ fontSize: "2rem", fontWeight: 900, color: "#fff" }}>₹{d.summary.avg.toLocaleString()}</p>
              <p style={{ fontSize: "0.8rem", color: "var(--blue-l)", marginTop: 6, fontWeight: 600 }}>per {period === "daily" ? "day" : period === "weekly" ? "week" : "month"}</p>
            </div>
            <div className="glass anim-fade-up delay-200" style={{ padding: "24px" }}>
              <p style={{ fontSize: "0.72rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Total Vehicles</p>
              <p style={{ fontSize: "2rem", fontWeight: 900, color: "#fff" }}>{d.summary.vehicles.toLocaleString()}</p>
              <p style={{ fontSize: "0.8rem", color: "var(--amber-l)", marginTop: 6, fontWeight: 600 }}>▲ 8% vs previous period</p>
            </div>
          </div>

          {/* Chart + Breakdown */}
          <div className="grid-2" style={{ gap: 24, marginBottom: 28 }}>
            {/* Revenue Bar Chart */}
            <div className="glass anim-fade-up" style={{ padding: "24px" }}>
              <h3 style={{ fontWeight: 700, color: "#fff", marginBottom: 20, fontSize: "1rem" }}>Revenue Overview</h3>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 200 }}>
                {d.revenue.map((val, i) => (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, height: "100%" }}>
                    <div style={{ flex: 1, width: "100%", display: "flex", alignItems: "flex-end" }}>
                      <div style={{
                        width: "100%",
                        height: `${(val / maxRev) * 100}%`,
                        background: "linear-gradient(180deg, var(--blue), var(--teal))",
                        borderRadius: "4px 4px 0 0",
                        minHeight: 4,
                        transition: "height 0.5s ease",
                        position: "relative",
                      }}>
                        <div style={{
                          position: "absolute", top: -22, left: "50%", transform: "translateX(-50%)",
                          fontSize: "0.6rem", color: "var(--muted)", fontWeight: 600, whiteSpace: "nowrap",
                        }}>₹{val >= 1000 ? `${(val/1000).toFixed(1)}k` : val}</div>
                      </div>
                    </div>
                    <span style={{ fontSize: "0.6rem", color: "var(--muted)", textAlign: "center" }}>{d.labels[i]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Ticket Bar Chart */}
            <div className="glass anim-fade-up delay-100" style={{ padding: "24px" }}>
              <h3 style={{ fontWeight: 700, color: "#fff", marginBottom: 20, fontSize: "1rem" }}>Tickets Issued</h3>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 200 }}>
                {d.tickets.map((val, i) => {
                  const maxT = Math.max(...d.tickets);
                  return (
                    <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, height: "100%" }}>
                      <div style={{ flex: 1, width: "100%", display: "flex", alignItems: "flex-end" }}>
                        <div style={{
                          width: "100%",
                          height: `${(val / maxT) * 100}%`,
                          background: "linear-gradient(180deg, var(--amber), var(--amber-l))",
                          borderRadius: "4px 4px 0 0",
                          minHeight: 4,
                          transition: "height 0.5s ease",
                          position: "relative",
                        }}>
                          <div style={{ position: "absolute", top: -22, left: "50%", transform: "translateX(-50%)", fontSize: "0.6rem", color: "var(--muted)", fontWeight: 600 }}>{val}</div>
                        </div>
                      </div>
                      <span style={{ fontSize: "0.6rem", color: "var(--muted)", textAlign: "center" }}>{d.labels[i]}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Vehicle Type Breakdown */}
          <div className="glass anim-fade-up" style={{ padding: "24px" }}>
            <h3 style={{ fontWeight: 700, color: "#fff", marginBottom: 20, fontSize: "1rem" }}>Vehicle Type Breakdown</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {vehicleBreakdown.map(v => (
                <div key={v.type}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text)", display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ width: 10, height: 10, borderRadius: "50%", background: v.color, display: "inline-block" }} />
                      {v.type}
                    </span>
                    <span style={{ fontSize: "0.8rem", color: "var(--muted)", fontWeight: 600 }}>{v.pct}%</span>
                  </div>
                  <div style={{ height: 8, background: "var(--glass-2)", borderRadius: 9999, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${v.pct}%`, background: v.color, borderRadius: 9999 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
