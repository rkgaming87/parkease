"use client";

interface StatCardProps {
  icon: string;
  label: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
  color?: "blue" | "green" | "amber" | "teal";
  delay?: number;
}

const colorMap = {
  blue:  { bg: "rgba(37,99,235,0.12)",  icon: "#3b82f6" },
  green: { bg: "rgba(16,185,129,0.12)", icon: "#10b981" },
  amber: { bg: "rgba(245,158,11,0.12)", icon: "#f59e0b" },
  teal:  { bg: "rgba(6,182,212,0.12)",  icon: "#06b6d4" },
};

export default function StatCard({ icon, label, value, trend, trendUp, color = "blue", delay = 0 }: StatCardProps) {
  const c = colorMap[color];
  return (
    <div className="glass anim-fade-up" style={{ padding: "24px", animationDelay: `${delay}ms` }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: c.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem" }}>
          {icon}
        </div>
        {trend && (
          <span style={{
            fontSize: "0.78rem", fontWeight: 700, padding: "3px 10px", borderRadius: 9999,
            background: trendUp ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
            color: trendUp ? "#10b981" : "#ef4444",
          }}>
            {trendUp ? "▲" : "▼"} {trend}
          </span>
        )}
      </div>
      <p style={{ fontSize: "2rem", fontWeight: 800, color: "#fff", lineHeight: 1, marginBottom: 6 }}>{value}</p>
      <p style={{ fontSize: "0.82rem", color: "var(--muted)", fontWeight: 500 }}>{label}</p>
    </div>
  );
}
