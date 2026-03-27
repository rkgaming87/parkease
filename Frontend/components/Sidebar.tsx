"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard",      label: "Dashboard",      icon: "⊞" },
  { href: "/vehicle-entry",  label: "Vehicle Entry",  icon: "🚗" },
  { href: "/vehicle-exit",   label: "Vehicle Exit",   icon: "🚦" },
  { href: "/tickets",        label: "Tickets",        icon: "🎫" },
  { href: "/reports",        label: "Reports",        icon: "📊" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid var(--border)" }}>
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "linear-gradient(135deg, var(--blue), var(--teal))",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "18px",
          }}>🅿</div>
          <span style={{ fontWeight: 800, fontSize: "1.1rem", color: "#fff", letterSpacing: "-0.02em" }}>
            Park<span className="grad-text">Ease</span>
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
        <p style={{ fontSize: "0.65rem", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.1em", padding: "4px 8px 10px" }}>
          Menu
        </p>
        {links.map(({ href, label, icon }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 12px", borderRadius: 10,
              textDecoration: "none", fontSize: "0.9rem",
              fontWeight: active ? 700 : 500,
              color: active ? "#fff" : "var(--muted)",
              background: active ? "linear-gradient(135deg, var(--blue), var(--blue-l))" : "transparent",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => { if (!active) (e.currentTarget as HTMLAnchorElement).style.background = "var(--glass-2)"; (e.currentTarget as HTMLAnchorElement).style.color = "#fff"; }}
            onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; (e.currentTarget as HTMLAnchorElement).style.color = "var(--muted)"; }}}
            >
              <span style={{ fontSize: "1.1rem" }}>{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: "16px 20px", borderTop: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", fontWeight: 700 }}>A</div>
          <div>
            <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "#fff" }}>Admin</p>
            <p style={{ fontSize: "0.72rem", color: "var(--muted)" }}>admin@parkease.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
