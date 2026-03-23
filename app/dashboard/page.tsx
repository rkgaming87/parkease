import Sidebar from "@/components/Sidebar";
import StatCard from "@/components/StatCard";
import Link from "next/link";

const recentTickets = [
  { id: "TKT-0091", vehicle: "MH12AB1234", type: "Car",   slot: "A-04", entry: "09:15 AM", status: "active"  },
  { id: "TKT-0090", vehicle: "MH14CD5678", type: "Bike",  slot: "B-12", entry: "08:50 AM", status: "paid"    },
  { id: "TKT-0089", vehicle: "MH04EF9012", type: "SUV",   slot: "A-07", entry: "08:20 AM", status: "paid"    },
  { id: "TKT-0088", vehicle: "MH02GH3456", type: "Car",   slot: "C-02", entry: "07:45 AM", status: "unpaid"  },
  { id: "TKT-0087", vehicle: "MH01IJ7890", type: "Truck", slot: "D-01", entry: "07:10 AM", status: "paid"    },
];

const statusCls: Record<string, string> = {
  active: "badge-blue", paid: "badge-green", unpaid: "badge-amber",
};

export default function DashboardPage() {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        {/* Topbar */}
        <header className="topbar">
          <div>
            <h2 style={{ fontWeight: 800, fontSize: "1.1rem", color: "#fff" }}>Dashboard</h2>
            <p style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: 1 }}>Monday, 23 March 2026</p>
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
            <StatCard icon="₹"  label="Today's Revenue"    value="₹4,820"  trend="12%"   trendUp color="blue"   delay={0}   />
            <StatCard icon="🚗" label="Active Vehicles"    value="23"      trend="3"     trendUp color="teal"   delay={100} />
            <StatCard icon="🎫" label="Tickets Today"      value="91"      trend="8%"    trendUp color="green"  delay={200} />
            <StatCard icon="🅿" label="Available Slots"    value="37/120"              color="amber"  delay={300} />
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
                      <td style={{ color: "#fff", fontWeight: 600 }}>{t.vehicle}</td>
                      <td style={{ color: "var(--muted)" }}>{t.type}</td>
                      <td style={{ color: "var(--muted)" }}>{t.slot}</td>
                      <td><span className={`badge ${statusCls[t.status]}`}>{t.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Slot Overview */}
            <div className="glass" style={{ padding: "24px" }}>
              <h3 style={{ fontWeight: 700, color: "#fff", marginBottom: 20, fontSize: "1rem" }}>Slot Occupancy</h3>

              {[
                { zone: "Zone A – Cars",   total: 40, used: 28, color: "var(--blue)"  },
                { zone: "Zone B – Bikes",  total: 30, used: 18, color: "var(--teal)"  },
                { zone: "Zone C – SUVs",   total: 30, used: 25, color: "var(--amber)" },
                { zone: "Zone D – Trucks", total: 20, used: 12, color: "var(--green)" },
              ].map(z => (
                <div key={z.zone} style={{ marginBottom: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text)" }}>{z.zone}</span>
                    <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>{z.used}/{z.total}</span>
                  </div>
                  <div style={{ height: 8, background: "var(--glass-2)", borderRadius: 9999, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${(z.used / z.total) * 100}%`, background: z.color, borderRadius: 9999, transition: "width 0.6s ease" }} />
                  </div>
                </div>
              ))}

              <div style={{ marginTop: 24, padding: "16px", background: "var(--glass)", borderRadius: 10, display: "flex", justifyContent: "space-between" }}>
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontWeight: 800, fontSize: "1.4rem", color: "#fff" }}>83</p>
                  <p style={{ fontSize: "0.72rem", color: "var(--muted)", textTransform: "uppercase" }}>Occupied</p>
                </div>
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontWeight: 800, fontSize: "1.4rem", color: "var(--green)" }}>37</p>
                  <p style={{ fontSize: "0.72rem", color: "var(--muted)", textTransform: "uppercase" }}>Available</p>
                </div>
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontWeight: 800, fontSize: "1.4rem", color: "var(--amber-l)" }}>69%</p>
                  <p style={{ fontSize: "0.72rem", color: "var(--muted)", textTransform: "uppercase" }}>Utilization</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
