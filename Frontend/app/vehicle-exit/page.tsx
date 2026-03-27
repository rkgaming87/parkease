"use client";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import TicketCard from "@/components/TicketCard";

const paymentModes = ["Cash", "UPI", "Card", "Debit/Credit"];

export default function VehicleExitPage() {
  const [search, setSearch] = useState("");
  const [found, setFound]   = useState<any | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [payMode, setPayMode] = useState("Cash");
  const [done, setDone] = useState(false);
  
  const [searching, setSearching] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!search.trim()) return;
    
    const key = search.toUpperCase().trim();
    setSearching(true);
    setNotFound(false);
    
    try {
      const res = await fetch(`http://localhost:8000/api/tickets/active/${key}`);
      if (res.ok) {
        const data = await res.json();
        setFound(data);
      } else {
        setFound(null);
        setNotFound(true);
      }
    } catch (e) {
      console.error("Search failed:", e);
      setFound(null);
      setNotFound(true);
    } finally {
      setSearching(false);
    }
  }

  async function handleCheckout() {
    if (!found) return;
    setCheckingOut(true);
    try {
      const res = await fetch(`http://localhost:8000/api/tickets/checkout/${found.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentMode: payMode })
      });
      if (res.ok) {
         setDone(true);
      } else {
         alert("Checkout failed. Check the console.");
      }
    } catch (e) {
      console.error("Checkout failed:", e);
    } finally {
      setCheckingOut(false);
    }
  }
  
  function handleReset() { setSearch(""); setFound(null); setNotFound(false); setDone(false); }

  const exitTime = new Date().toLocaleString("en-IN", { hour12: true });

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <header className="topbar">
          <div>
            <h2 style={{ fontWeight: 800, fontSize: "1.1rem", color: "#fff" }}>Vehicle Exit</h2>
            <p style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: 1 }}>Calculate fare and record vehicle departure</p>
          </div>
        </header>

        <main style={{ padding: "28px", flex: 1 }}>
          {!done ? (
            <div style={{ maxWidth: 680, width: "100%" }}>
              {/* Search */}
              <div className="glass anim-fade-up" style={{ padding: "28px", marginBottom: 24 }}>
                <h3 style={{ fontWeight: 700, color: "#fff", marginBottom: 6 }}>Find Ticket</h3>
                <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginBottom: 20 }}>Enter the Ticket ID to look up the active session.</p>
                <form onSubmit={handleSearch} style={{ display: "flex", gap: 12 }}>
                  <input className="input" placeholder="e.g. TKT-0091" value={search} onChange={e => setSearch(e.target.value)} style={{ flex: 1 }} />
                  <button type="submit" className="btn-primary" disabled={searching}>{searching ? "Searching..." : "Search"}</button>
                </form>

                {notFound && (
                  <div style={{ marginTop: 16, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "10px 14px", fontSize: "0.82rem", color: "#fca5a5" }}>
                    ⚠ No active ticket found for "{search}". It may already be checked out or doesn't exist.
                  </div>
                )}
              </div>

              {found && (
                <div className="anim-fade-up">
                  {/* Fare Summary */}
                  <div className="glass" style={{ padding: "24px", marginBottom: 20 }}>
                    <h3 style={{ fontWeight: 700, color: "#fff", marginBottom: 20, fontSize: "1rem" }}>Exit Summary</h3>
                    <div className="grid-2" style={{ gap: "12px 24px", marginBottom: 20 }}>
                      {[
                        { label: "Ticket ID",    val: found.id },
                        { label: "Vehicle No",   val: found.vehicleNo },
                        { label: "Vehicle Type", val: found.vehicleType },
                        { label: "Slot",         val: found.slot },
                        { label: "Entry Time",   val: found.entryTime },
                        { label: "Current Exit", val: exitTime },
                        { label: "Duration",     val: found.duration },
                        { label: "Status",       val: found.status },
                      ].map(f => (
                        <div key={f.label}>
                          <p style={{ fontSize: "0.7rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700, marginBottom: 2 }}>{f.label}</p>
                          <p style={{ fontWeight: 600, color: "var(--text)" }}>{f.val}</p>
                        </div>
                      ))}
                    </div>

                    {/* Fare Box */}
                    <div style={{ background: "rgba(37,99,235,0.1)", border: "1px solid rgba(37,99,235,0.25)", borderRadius: 12, padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div>
                        <p style={{ fontSize: "0.78rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Total Amount Due</p>
                        <p style={{ fontSize: "2.4rem", fontWeight: 900, color: "#fff", lineHeight: 1.1 }}>₹{found.amount}</p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <label className="label" style={{ marginBottom: 6 }}>Payment Mode</label>
                        <select className="input" value={payMode} onChange={e => setPayMode(e.target.value)} style={{ width: "auto" }}>
                          {paymentModes.map(m => <option key={m}>{m}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 12 }}>
                    <button className="btn-primary" onClick={handleCheckout} disabled={checkingOut}>
                       {checkingOut ? "Processing..." : "✅ Confirm Checkout"}
                    </button>
                    <button className="btn-ghost" onClick={handleReset} disabled={checkingOut}>Cancel</button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ maxWidth: 520, width: "100%" }}>
              <div className="glass anim-fade-up" style={{ padding: "24px", marginBottom: 20, background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: "var(--radius)" }}>
                <p style={{ color: "var(--green)", fontWeight: 700, fontSize: "1rem" }}>✅ Checkout Successful!</p>
                <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginTop: 4 }}>Payment recorded. Slot {found?.slot} is now free.</p>
              </div>
              <TicketCard
                ticketId={found!.id}
                vehicleNo={found!.vehicleNo}
                vehicleType={found!.vehicleType}
                slot={found!.slot}
                entryTime={found!.entryTime}
                exitTime={exitTime}
                duration={found!.duration}
                amount={String(found!.amount)}
                ownerName={found!.owner}
                status="paid"
              />
              <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
                <button className="btn-primary" onClick={handleReset}>New Exit</button>
                <button className="btn-ghost"   onClick={() => window.print()}>🖨 Print Receipt</button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
