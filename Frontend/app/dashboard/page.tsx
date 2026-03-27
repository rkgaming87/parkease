"use client";
import Sidebar from "@/components/Sidebar";
import StatCard from "@/components/StatCard";
import Link from "next/link";
import { useState, useEffect } from "react";

const statusCls: Record<string, string> = {
  active: "badge-blue", paid: "badge-green", unpaid: "badge-amber",
};

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalTickets: 0,
    activeTickets: 0,
    paidTickets: 0,
    unpaidTickets: 0,
    totalRevenue: 0.0
  });
  
  const [recentTickets, setRecentTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const statsRes = await fetch("http://localhost:8000/api/dashboard/stats");
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }

        const ticketsRes = await fetch("http://localhost:8000/api/tickets?status=all");
        if (ticketsRes.ok) {
          const ticketsData = await ticketsRes.json();
          // Assuming backend returns latest tickets at the end of the list, reverse and take first 5
          setRecentTickets(ticketsData.reverse().slice(0, 5));
        }
      } catch (e) {
        console.error("Failed to fetch dashboard data:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div className="app-layout"><Sidebar /><div className="main-content" style={{display:"flex",alignItems:"center",justifyContent:"center"}}><p>Loading...</p></div></div>;

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        {/* Topbar */}
        <header className="topbar">
          <div>
            <h2 style={{ fontWeight: 800, fontSize: "1.1rem", color: "#fff" }}>Dashboard</h2>
            <p style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: 1 }}>{new Date().toLocaleDateString("en-IN", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <Link href="/vehicle-entry" className="btn-primary btn-sm">+ New Entry</Link>
            <Link href="/vehicle-exit"  className="btn-ghost btn-sm">Record Exit</Link>
          </div>
        </header>

        {/* Content */}
        <main style={{ padding: "28px 28px", flex: 1 }}>
          {/* KPI Cards */}
          <div className="grid-4" style={{ marginBottom: 28 }}>
            <StatCard icon="₹"  label="Total Revenue"      value={`₹${stats.totalRevenue}`}  color="blue"   delay={0}   />
            <StatCard icon="🚗" label="Active Vehicles"    value={String(stats.activeTickets)}     color="teal"   delay={100} />
            <StatCard icon="🎫" label="Total Tickets"      value={String(stats.totalTickets)}    color="green"  delay={200} />
            <StatCard icon="🅿" label="Unpaid Tickets"     value={String(stats.unpaidTickets)}    color="amber"  delay={300} />
          </div>

          {/* Quick Actions */}
          <div className="glass anim-fade-up" style={{ padding: "20px 24px", marginBottom: 28, display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontWeight: 700, color: "#fff", marginRight: 8 }}>Quick Actions:</span>
            <Link href="/vehicle-entry" className="btn-primary btn-sm">🚗 New Vehicle Entry</Link>
            <Link href="/vehicle-exit"  className="btn-ghost btn-sm">🚦 Record Exit</Link>
            <Link href="/tickets"       className="btn-ghost btn-sm">🎫 View All Tickets</Link>
            <Link href="/reports"       className="btn-ghost btn-sm">📊 Reports</Link>
          </div>

          {/* Grid: Recent + Slot Overview */}
          <div className="grid-2" style={{ gap: 24 }}>
            {/* Recent Tickets */}
            <div className="glass" style={{ overflow: "hidden" }}>
              <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ fontWeight: 700, color: "#fff", fontSize: "1rem" }}>Recent Tickets</h3>
                <Link href="/tickets" style={{ color: "var(--blue-l)", fontSize: "0.8rem", textDecoration: "none", fontWeight: 600 }}>View All →</Link>
              </div>
              <table className="pe-table">
                <thead>
                  <tr><th>ID</th><th>Vehicle</th><th>Type</th><th>Slot</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {recentTickets.map(t => (
                    <tr key={t.id}>
                      <td style={{ fontWeight: 700, color: "var(--blue-l)" }}>{t.id}</td>
                      <td style={{ color: "#fff", fontWeight: 600 }}>{t.vehicleNo}</td>
                      <td style={{ color: "var(--muted)" }}>{t.vehicleType}</td>
                      <td style={{ color: "var(--muted)" }}>{t.slot}</td>
                      <td><span className={`badge ${statusCls[t.status] || "badge-blue"}`}>{t.status}</span></td>
                    </tr>
                  ))}
                  {recentTickets.length === 0 && (
                    <tr><td colSpan={5} style={{textAlign: "center", color: "var(--muted)", padding: "20px"}}>No recent tickets</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Slot Overview */}
            {/* Currently maintaining static slot allocation UI unless we add a dedicated slots endpoint counting by zone */}
            <div className="glass" style={{ padding: "24px" }}>
              <h3 style={{ fontWeight: 700, color: "#fff", marginBottom: 20, fontSize: "1rem" }}>System Overview</h3>
              <p style={{color: "var(--muted)", fontSize: "0.85rem", marginBottom: 20}}>General ticket status breakdown</p>

              {[
                { zone: "Active Tickets", total: stats.totalTickets, used: stats.activeTickets, color: "var(--blue)"  },
                { zone: "Paid Tickets",  total: stats.totalTickets, used: stats.paidTickets, color: "var(--green)"  },
                { zone: "Unpaid Tickets", total: stats.totalTickets, used: stats.unpaidTickets, color: "var(--amber)" },
              ].map(z => {
                const pct = z.total > 0 ? (z.used / z.total) * 100 : 0;
                return (
                  <div key={z.zone} style={{ marginBottom: 20 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text)" }}>{z.zone}</span>
                      <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>{z.used}/{z.total}</span>
                    </div>
                    <div style={{ height: 8, background: "var(--glass-2)", borderRadius: 9999, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: z.color, borderRadius: 9999, transition: "width 0.6s ease" }} />
                    </div>
                  </div>
                );
              })}

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
