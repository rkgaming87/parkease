"use client";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import TicketCard from "@/components/TicketCard";

const vehicleTypes = ["Car", "Bike", "SUV", "Truck", "Auto/Rickshaw"];
const slots: Record<string, string[]> = {
  Car:            ["A-01","A-02","A-03","A-04","A-05"],
  Bike:           ["B-01","B-02","B-03","B-04","B-05"],
  SUV:            ["C-01","C-02","C-03","C-04"],
  Truck:          ["D-01","D-02","D-03"],
  "Auto/Rickshaw":["B-06","B-07","B-08"],
};

function genTicketId() {
  return `TKT-${Math.floor(1000 + Math.random() * 9000)}`;
}

export default function VehicleEntryPage() {
  const [form, setForm] = useState({
    vehicleNo: "", vehicleType: "", ownerName: "", ownerContact: "", slot: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [ticket, setTicket] = useState<{ id: string; entryTime: string } | null>(null);
  const [error, setError] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value, ...(name === "vehicleType" ? { slot: "" } : {}) }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.vehicleNo || !form.vehicleType || !form.slot) {
      setError("Vehicle Number, Type, and Slot are required.");
      return;
    }
    const id = genTicketId();
    const entryTime = new Date().toLocaleString("en-IN", { hour12: true });
    setTicket({ id, entryTime });
    setSubmitted(true);
  }

  function handleReset() {
    setForm({ vehicleNo: "", vehicleType: "", ownerName: "", ownerContact: "", slot: "" });
    setSubmitted(false);
    setTicket(null);
    setError("");
  }

  const availableSlots = slots[form.vehicleType] || [];

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
                      <input className="input" name="vehicleNo" placeholder="e.g. MH12AB1234" value={form.vehicleNo} onChange={handleChange} />
                    </div>
                    <div>
                      <label className="label">Vehicle Type *</label>
                      <select className="input" name="vehicleType" value={form.vehicleType} onChange={handleChange}>
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
                      <select className="input" name="slot" value={form.slot} onChange={handleChange} disabled={!form.vehicleType}>
                        <option value="">{form.vehicleType ? "Select slot…" : "Choose vehicle type first"}</option>
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
                    <button type="submit" className="btn-primary">🎫 Generate Ticket</button>
                    <button type="button" className="btn-ghost" onClick={handleReset}>Clear</button>
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
