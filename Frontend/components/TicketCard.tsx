interface TicketCardProps {
  ticketId: string;
  vehicleNo: string;
  vehicleType: string;
  slot: string;
  entryTime: string;
  exitTime?: string;
  duration?: string;
  amount?: string;
  status: "active" | "paid" | "unpaid";
  ownerName?: string;
}

export default function TicketCard(props: TicketCardProps) {
  const { ticketId, vehicleNo, vehicleType, slot, entryTime, exitTime, duration, amount, status, ownerName } = props;

  const statusMap = {
    active:  { label: "Active",  cls: "badge-blue"  },
    paid:    { label: "Paid",    cls: "badge-green"  },
    unpaid:  { label: "Unpaid",  cls: "badge-amber"  },
  };

  return (
    <div className="glass" style={{ padding: "24px", position: "relative", overflow: "hidden" }}>
      {/* decorative stripe */}
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0, width: 4,
        background: status === "active" ? "var(--blue)" : status === "paid" ? "var(--green)" : "var(--amber)",
      }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div>
          <p style={{ fontSize: "0.72rem", color: "var(--muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Ticket ID</p>
          <p style={{ fontWeight: 800, fontSize: "1.05rem", color: "#fff" }}>{ticketId}</p>
        </div>
        <span className={`badge ${statusMap[status].cls}`}>{statusMap[status].label}</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 20px" }}>
        <Field label="Vehicle No" value={vehicleNo} />
        <Field label="Type" value={vehicleType} />
        <Field label="Slot" value={slot} />
        {ownerName && <Field label="Owner" value={ownerName} />}
        <Field label="Entry Time" value={entryTime} />
        {exitTime && <Field label="Exit Time" value={exitTime} />}
        {duration && <Field label="Duration" value={duration} />}
        {amount && <Field label="Amount" value={`₹${amount}`} highlight />}
      </div>
    </div>
  );
}

function Field({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <p style={{ fontSize: "0.7rem", color: "var(--muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>{label}</p>
      <p style={{ fontSize: "0.9rem", fontWeight: highlight ? 800 : 600, color: highlight ? "var(--amber-l)" : "var(--text)" }}>{value}</p>
    </div>
  );
}
