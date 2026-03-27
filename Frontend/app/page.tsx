import Link from "next/link";

const features = [
  { icon: "🔐", title: "Secure Login", desc: "Role-based access control for admins and operators with encrypted credentials." },
  { icon: "🚗", title: "Vehicle Entry", desc: "Capture vehicle number, type, and entry time. Auto-generate unique ticket IDs instantly." },
  { icon: "🚦", title: "Vehicle Exit", desc: "Record exit time, compute parking duration, and calculate charges automatically." },
  { icon: "🎫", title: "Ticket Generation", desc: "Create digital tickets with all parking details — printable and shareable." },
  { icon: "🗄️", title: "Database Management", desc: "Secure RDBMS-backed storage and retrieval of all records and history." },
  { icon: "📊", title: "Report Generation", desc: "Daily, weekly, and monthly revenue and occupancy reports for management." },
];

const stats = [
  { value: "10K+", label: "Tickets Issued" },
  { value: "99.9%", label: "Uptime" },
  { value: "3-Tier", label: "Architecture" },
  { value: "< 1s", label: "Ticket Generation" },
];

const steps = [
  { num: "01", title: "Vehicle Arrives", desc: "Operator logs enter vehicle number and type into the system." },
  { num: "02", title: "Ticket Generated", desc: "System auto-assigns a slot and prints a unique ticket ID." },
  { num: "03", title: "Vehicle Exits", desc: "Operator scans ticket — fare calculated and payment recorded." },
  { num: "04", title: "Report Ready", desc: "Admin views revenue and occupancy stats in real time." },
];

export default function LandingPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--navy)", overflowX: "hidden" }}>
      {/* ── NAV ────────────────────────────────────────────────── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: "rgba(10,15,30,0.85)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border)",
        padding: "0 40px", height: 64,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "linear-gradient(135deg, var(--blue), var(--teal))",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "18px",
          }}>🅿</div>
          <span style={{ fontWeight: 800, fontSize: "1.15rem", color: "#fff" }}>
            Park<span style={{ background: "linear-gradient(135deg,#3b82f6,#06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Ease</span>
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/login" className="btn-ghost btn-sm">Login</Link>
          <Link href="/dashboard" className="btn-primary btn-sm">Dashboard →</Link>
        </div>
      </nav>

      {/* ── HERO ───────────────────────────────────────────────── */}
      <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", paddingTop: 64, overflow: "hidden" }}>
        {/* blobs */}
        <div className="blob blob-blue" style={{ width: 500, height: 500, top: "10%", left: "-10%", opacity: 0.6 }} />
        <div className="blob blob-teal"  style={{ width: 400, height: 400, top: "30%", right: "-5%"  }} />
        <div className="blob blob-amber" style={{ width: 300, height: 300, bottom: "10%", left: "30%" }} />

        <div className="container" style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "80px 24px" }}>
          <div className="anim-fade-up" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(37,99,235,0.12)", border: "1px solid rgba(37,99,235,0.3)",
            padding: "6px 16px", borderRadius: 9999, marginBottom: 28,
          }}>
            <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#60a5fa", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              🚀 Parking Ticket Automation System
            </span>
          </div>

          <h1 className="anim-fade-up delay-100" style={{ fontSize: "clamp(2.5rem, 7vw, 5.5rem)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.05, marginBottom: 24, color: "#fff" }}>
            Smart Parking,<br />
            <span style={{ background: "linear-gradient(135deg,#3b82f6,#06b6d4,#10b981)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Zero Hassle
            </span>
          </h1>

          <p className="anim-fade-up delay-200" style={{ fontSize: "clamp(1rem,2vw,1.25rem)", color: "var(--muted)", maxWidth: 580, margin: "0 auto 40px", lineHeight: 1.7 }}>
            ParkEase automates vehicle entry, exit, ticket generation, and billing — giving parking operators a powerful, real-time management platform.
          </p>

          <div className="anim-fade-up delay-300" style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/dashboard" className="btn-primary" style={{ fontSize: "1rem", padding: "14px 36px" }}>
              Go to Dashboard →
            </Link>
            <Link href="/vehicle-entry" className="btn-ghost" style={{ fontSize: "1rem", padding: "14px 36px" }}>
              New Vehicle Entry
            </Link>
          </div>

          {/* Stat strip */}
          <div className="anim-fade-up delay-400" style={{
            display: "flex", justifyContent: "center", gap: "48px", marginTop: 72, flexWrap: "wrap",
          }}>
            {stats.map(s => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <p style={{ fontSize: "2rem", fontWeight: 900, color: "#fff" }}>{s.value}</p>
                <p style={{ fontSize: "0.8rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 4 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────────────────── */}
      <section style={{ padding: "96px 24px", background: "var(--navy-2)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--blue-l)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 12 }}>Core Modules</p>
            <h2 style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 800, color: "#fff" }}>Everything You Need</h2>
            <p style={{ color: "var(--muted)", marginTop: 12, maxWidth: 520, margin: "12px auto 0", fontSize: "1rem" }}>Six integrated modules covering the full lifecycle of parking management.</p>
          </div>
          <div className="grid-3">
            {features.map((f, i) => (
              <div key={f.title} className="glass anim-fade-up" style={{ padding: "28px", animationDelay: `${i * 80}ms` }}>
                <div style={{ fontSize: "2.2rem", marginBottom: 14 }}>{f.icon}</div>
                <h3 style={{ fontWeight: 700, fontSize: "1.05rem", color: "#fff", marginBottom: 8 }}>{f.title}</h3>
                <p style={{ color: "var(--muted)", fontSize: "0.875rem", lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────────── */}
      <section style={{ padding: "96px 24px" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--amber-l)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 12 }}>Workflow</p>
            <h2 style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 800, color: "#fff" }}>How It Works</h2>
          </div>
          <div className="grid-4">
            {steps.map((s, i) => (
              <div key={s.num} className="glass anim-fade-up" style={{ padding: "28px 24px", textAlign: "center", animationDelay: `${i * 100}ms` }}>
                <div style={{
                  width: 52, height: 52, borderRadius: "50%", margin: "0 auto 16px",
                  background: "linear-gradient(135deg, var(--blue), var(--teal))",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 900, fontSize: "0.9rem", color: "#fff",
                }}>{s.num}</div>
                <h3 style={{ fontWeight: 700, color: "#fff", marginBottom: 8, fontSize: "1rem" }}>{s.title}</h3>
                <p style={{ color: "var(--muted)", fontSize: "0.85rem", lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ─────────────────────────────────────────── */}
      <section style={{ padding: "80px 24px", background: "var(--navy-2)" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <div className="glass-2" style={{ padding: "60px 40px", position: "relative", overflow: "hidden" }}>
            <div className="blob blob-blue" style={{ width: 300, height: 300, top: "-50%", left: "20%", opacity: 0.4 }} />
            <div className="blob blob-teal" style={{ width: 250, height: 250, bottom: "-40%", right: "20%", opacity: 0.3 }} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <h2 style={{ fontSize: "clamp(1.6rem,4vw,2.5rem)", fontWeight: 800, color: "#fff", marginBottom: 16 }}>
                Ready to Streamline Your Parking?
              </h2>
              <p style={{ color: "var(--muted)", marginBottom: 32, fontSize: "1rem" }}>Log in to the admin portal and start managing vehicles instantly.</p>
              <Link href="/login" className="btn-amber" style={{ fontSize: "1rem", padding: "14px 40px" }}>
                Launch Admin Portal →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────── */}
      <footer style={{ borderTop: "1px solid var(--border)", padding: "32px 40px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: "1.2rem" }}>🅿</span>
            <span style={{ fontWeight: 800, color: "#fff" }}>ParkEase</span>
          </div>
          <p style={{ color: "var(--muted)", fontSize: "0.82rem" }}>
            © 2026 ParkEase · Parking Ticket Automation System
          </p>
          <div style={{ display: "flex", gap: 20 }}>
            {["Login", "Dashboard", "Tickets", "Reports"].map(l => (
              <a key={l} href="#" style={{ color: "var(--muted)", textDecoration: "none", fontSize: "0.82rem" }}>{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
