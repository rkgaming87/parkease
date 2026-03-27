"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import TicketCard from "@/components/TicketCard";

const vehicleTypes = ["Car", "Bike", "SUV", "Truck", "Auto"];

export default function VehicleEntryPage() {
  const [form, setForm] = useState({
    vehicleNo: "", vehicleType: "", ownerName: "", ownerContact: "", slot: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [ticket, setTicket] = useState<{ id: string; entryTime: string } | null>(null);
  const [error, setError] = useState("");
  
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchSlots() {
      if (!form.vehicleType) {
        setAvailableSlots([]);
        return;
      }
      setLoadingSlots(true);
      try {
        const res = await fetch(`http://localhost:8000/api/slots/available?type=${form.vehicleType}`);
        if (res.ok) {
          const data = await res.json();
          setAvailableSlots(data);
        }
      } catch (e) {
        console.error("Failed to fetch slots:", e);
      } finally {
        setLoadingSlots(false);
      }
    }
    fetchSlots();
  }, [form.vehicleType]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value, ...(name === "vehicleType" ? { slot: "" } : {}) }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.vehicleNo || !form.vehicleType || !form.slot) {
      setError("Vehicle Number, Type, and Slot are required.");
      return;
    }
    
    setSubmitting(true);
    try {
      const res = await fetch("http://localhost:8000/api/tickets/entry", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({
            vehicleNo: form.vehicleNo,
            vehicleType: form.vehicleType,
            ownerName: form.ownerName,
            ownerContact: form.ownerContact,
            slot: form.slot
         })
      });
      
      const data = await res.json();
      if (res.ok) {
        const entryTime = new Date().toLocaleString("en-IN", { hour12: true });
        setTicket({ id: data.ticket_id, entryTime });
        setSubmitted(true);
      } else {
        setError(data.detail || "Failed to create ticket.");
      }
    } catch (e: any) {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleReset() {
    setForm({ vehicleNo: "", vehicleType: "", ownerName: "", ownerContact: "", slot: "" });
    setSubmitted(false);
    setTicket(null);
    setError("");
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <header className="topbar">
          <div>
            <h2 style={{ fontWeight: 800, fontSize: "1.1rem", color: "#fff" }}>Vehicle Entry</h2>
            <p style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: 1 }}>Register an incoming vehicle and generate a ticket</p>
          </div>
        </header>

        <main style={{ padding: "28px", flex: 1 }}>
          {!submitted ? (
            <div style={{ maxWidth: 720, width: "100%" }}>
              <div className="glass anim-fade-up" style={{ padding: "32px" }}>
                <h3 style={{ fontWeight: 700, color: "#fff", marginBottom: 6 }}>New Entry Form</h3>
                <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginBottom: 28 }}>Fill in the vehicle details below. Ticket ID and entry time will be auto-generated.</p>

                <form onSubmit={handleSubmit} style={{ display: "grid", gap: 20 }}>
                  <div className="grid-2" style={{ gap: 20 }}>
                    <div>
                      <label className="label">Vehicle Number *</label>
                      <input className="input" name="vehicleNo" placeholder="e.g. MH12AB1234" value={form.vehicleNo} onChange={handleChange} required />
                    </div>
                    <div>
                      <label className="label">Vehicle Type *</label>
                      <select className="input" name="vehicleType" value={form.vehicleType} onChange={handleChange} required>
                        <option value="">Select type…</option>
                        {vehicleTypes.map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="label">Owner Name</label>
                      <input className="input" name="ownerName" placeholder="Full name" value={form.ownerName} onChange={handleChange} />
                    </div>
                    <div>
                      <label className="label">Owner Contact</label>
                      <input className="input" name="ownerContact" placeholder="+91 XXXXX XXXXX" value={form.ownerContact} onChange={handleChange} />
                    </div>
                    <div>
                      <label className="label">Assign Slot *</label>
                      <select className="input" name="slot" value={form.slot} onChange={handleChange} disabled={!form.vehicleType || loadingSlots} required>
                        <option value="">{loadingSlots ? "Loading slots..." : form.vehicleType ? (availableSlots.length > 0 ? "Select slot…" : "No slots available") : "Choose vehicle type first"}</option>
                        {availableSlots.map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="label">Entry Time</label>
                      <input className="input" value={new Date().toLocaleString("en-IN")} readOnly style={{ color: "var(--muted)" }} />
                    </div>
                  </div>

                  {error && (
                    <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "10px 14px", fontSize: "0.82rem", color: "#fca5a5" }}>
                      ⚠ {error}
                    </div>
                  )}

                  <div style={{ display: "flex", gap: 12 }}>
                    <button type="submit" className="btn-primary" disabled={submitting}>
                       {submitting ? "Generating..." : "🎫 Generate Ticket"}
                    </button>
                    <button type="button" className="btn-ghost" onClick={handleReset} disabled={submitting}>Clear</button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div style={{ maxWidth: 520, width: "100%" }}>
              <div className="glass anim-fade-up" style={{ padding: "24px", marginBottom: 20, background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: "var(--radius)" }}>
                <p style={{ color: "var(--green)", fontWeight: 700, fontSize: "1rem" }}>✅ Ticket Generated Successfully!</p>
                <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginTop: 4 }}>The vehicle has been registered and a parking slot assigned.</p>
              </div>

              <TicketCard
                ticketId={ticket!.id}
                vehicleNo={form.vehicleNo}
                vehicleType={form.vehicleType}
                slot={form.slot}
                entryTime={ticket!.entryTime}
                ownerName={form.ownerName || "—"}
                status="active"
              />

              <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
                <button className="btn-primary" onClick={handleReset}>+ New Entry</button>
                <button className="btn-ghost" onClick={() => window.print()}>🖨 Print Ticket</button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
