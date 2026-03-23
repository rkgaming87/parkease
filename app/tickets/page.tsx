"use client";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import TicketCard from "@/components/TicketCard";

type TicketStatus = "active" | "paid" | "unpaid";

const allTickets = [
  { id: "TKT-0091", vehicleNo: "MH12AB1234", vehicleType: "Car",   slot: "A-04", entryTime: "09:15 AM", exitTime: undefined,    duration: undefined,  amount: undefined, status: "active" as TicketStatus,  owner: "Ravi Kumar"    },
  { id: "TKT-0090", vehicleNo: "MH14CD5678", vehicleType: "Bike",  slot: "B-12", entryTime: "08:50 AM", exitTime: "10:30 AM",  duration: "1h 40m",   amount: "40",      status: "paid"   as TicketStatus,  owner: "Neha Patil"    },
  { id: "TKT-0089", vehicleNo: "MH04EF9012", vehicleType: "SUV",   slot: "A-07", entryTime: "08:20 AM", exitTime: "11:05 AM",  duration: "2h 45m",   amount: "180",     status: "paid"   as TicketStatus,  owner: "Suresh Mehta"  },
  { id: "TKT-0088", vehicleNo: "MH02GH3456", vehicleType: "Car",   slot: "C-02", entryTime: "07:45 AM", exitTime: undefined,    duration: undefined,  amount: undefined, status: "active" as TicketStatus,  owner: "Priya Sharma"  },
  { id: "TKT-0087", vehicleNo: "MH01IJ7890", vehicleType: "Truck", slot: "D-01", entryTime: "07:10 AM", exitTime: "09:50 AM",  duration: "2h 40m",   amount: "280",     status: "paid"   as TicketStatus,  owner: "Vijay Singh"   },
  { id: "TKT-0086", vehicleNo: "MH09KL2345", vehicleType: "Car",   slot: "A-02", entryTime: "06:30 AM", exitTime: "10:15 AM",  duration: "3h 45m",   amount: "160",     status: "unpaid" as TicketStatus,  owner: "Anita Rao"     },
  { id: "TKT-0085", vehicleNo: "MH05KL6543", vehicleType: "Bike",  slot: "B-03", entryTime: "11:00 AM", exitTime: undefined,    duration: undefined,  amount: undefined, status: "active" as TicketStatus,  owner: "Amit Desai"    },
  { id: "TKT-0084", vehicleNo: "MH08MN9876", vehicleType: "Auto/Rickshaw", slot: "B-07", entryTime: "10:30 AM", exitTime: "12:00 PM", duration: "1h 30m", amount: "45", status: "paid" as TicketStatus, owner: "Rekha Joshi" },
];

const statusCls: Record<string, string> = { active: "badge-blue", paid: "badge-green", unpaid: "badge-amber" };

export default function TicketsPage() {
  const [filter, setFilter] = useState<"all" | TicketStatus>("all");
  const [view, setView] = useState<string | null>(null);

  const filtered = filter === "all" ? allTickets : allTickets.filter(t => t.status === filter);
  const viewTicket = allTickets.find(t => t.id === view);

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <header className="topbar">
          <div>
            <h2 style={{ fontWeight: 800, fontSize: "1.1rem", color: "#fff" }}>Tickets</h2>
            <p style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: 1 }}>All parking tickets and their statuses</p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {(["all","active","paid","unpaid"] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: "6px 16px", borderRadius: 9999, fontSize: "0.8rem", fontWeight: 600,
                cursor: "pointer", border: "1px solid",
                background: filter === f ? "var(--blue)" : "transparent",
                borderColor: filter === f ? "var(--blue)" : "var(--border)",
                color: filter === f ? "#fff" : "var(--muted)",
                transition: "all 0.2s",
                textTransform: "capitalize",
              }}>{f}</button>
            ))}
          </div>
        </header>

        <main style={{ padding: "28px", flex: 1 }}>
          {/* Summary row */}
          <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
            {[
              { label: "Total",   val: allTickets.length,                         color: "#fff" },
              { label: "Active",  val: allTickets.filter(t=>t.status==="active").length,  color: "var(--blue-l)" },
              { label: "Paid",    val: allTickets.filter(t=>t.status==="paid").length,    color: "var(--green)" },
              { label: "Unpaid",  val: allTickets.filter(t=>t.status==="unpaid").length,  color: "var(--amber-l)" },
            ].map(s => (
              <div key={s.label} className="glass" style={{ padding: "14px 24px", display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: "1.4rem", fontWeight: 900, color: s.color }}>{s.val}</span>
                <span style={{ color: "var(--muted)", fontSize: "0.82rem", fontWeight: 600 }}>{s.label}</span>
              </div>
            ))}
          </div>

          {!view ? (
            <div className="glass anim-fade-up" style={{ overflow: "hidden" }}>
              <table className="pe-table">
                <thead>
                  <tr>
                    <th>Ticket ID</th><th>Vehicle No</th><th>Type</th><th>Slot</th>
                    <th>Entry</th><th>Exit</th><th>Duration</th><th>Amount</th><th>Status</th><th></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(t => (
                    <tr key={t.id}>
                      <td style={{ fontWeight: 700, color: "var(--blue-l)" }}>{t.id}</td>
                      <td style={{ fontWeight: 600, color: "#fff" }}>{t.vehicleNo}</td>
                      <td style={{ color: "var(--muted)" }}>{t.vehicleType}</td>
                      <td style={{ color: "var(--muted)" }}>{t.slot}</td>
                      <td style={{ color: "var(--muted)" }}>{t.entryTime}</td>
                      <td style={{ color: "var(--muted)" }}>{t.exitTime || "—"}</td>
                      <td style={{ color: "var(--muted)" }}>{t.duration || "—"}</td>
                      <td style={{ fontWeight: 700, color: t.amount ? "var(--amber-l)" : "var(--muted)" }}>{t.amount ? `₹${t.amount}` : "—"}</td>
                      <td><span className={`badge ${statusCls[t.status]}`}>{t.status}</span></td>
                      <td>
                        <button onClick={() => setView(t.id)} style={{ background: "var(--glass-2)", border: "none", color: "var(--blue-l)", borderRadius: 6, padding: "4px 12px", fontSize: "0.78rem", cursor: "pointer", fontWeight: 600 }}>
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ maxWidth: 520 }}>
              <button onClick={() => setView(null)} className="btn-ghost btn-sm" style={{ marginBottom: 20 }}>← Back to list</button>
              {viewTicket && (
                <TicketCard
                  ticketId={viewTicket.id}
                  vehicleNo={viewTicket.vehicleNo}
                  vehicleType={viewTicket.vehicleType}
                  slot={viewTicket.slot}
                  entryTime={viewTicket.entryTime}
                  exitTime={viewTicket.exitTime}
                  duration={viewTicket.duration}
                  amount={viewTicket.amount}
                  ownerName={viewTicket.owner}
                  status={viewTicket.status}
                />
              )}
              <button className="btn-ghost btn-sm" onClick={() => window.print()} style={{ marginTop: 16 }}>🖨 Print</button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
