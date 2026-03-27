"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import TicketCard from "@/components/TicketCard";

type TicketStatus = "active" | "paid" | "unpaid";

const statusCls: Record<string, string> = { active: "badge-blue", paid: "badge-green", unpaid: "badge-amber" };

export default function TicketsPage() {
  const [filter, setFilter] = useState<"all" | TicketStatus>("all");
  const [view, setView] = useState<string | null>(null);
  
  const [allTickets, setAllTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTickets() {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:8000/api/tickets?status=${filter}`);
        if (res.ok) {
          const data = await res.json();
          // Assume backend returns all tickets latest first
          setAllTickets(data.reverse());
        }
      } catch (e) {
        console.error("Failed to fetch tickets:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchTickets();
  }, [filter]);

  // If filter is passed to the backend, the array is already filtered, but we filter anyway for robustness or if filter change happens fast
  const filtered = allTickets;
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
              { label: "Showing", val: allTickets.length, color: "#fff" }
            ].map(s => (
              <div key={s.label} className="glass" style={{ padding: "14px 24px", display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: "1.4rem", fontWeight: 900, color: s.color }}>{s.val}</span>
                <span style={{ color: "var(--muted)", fontSize: "0.82rem", fontWeight: 600 }}>{s.label}</span>
              </div>
            ))}
            {loading && (
              <div style={{ padding: "14px 24px", display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ color: "var(--blue-l)", fontSize: "0.82rem", fontWeight: 600 }}>Loading...</span>
              </div>
            )}
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
                  {!loading && filtered.length === 0 && (
                     <tr><td colSpan={10} style={{textAlign: "center", color: "var(--muted)", padding: "20px"}}>No tickets found</td></tr>
                  )}
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
