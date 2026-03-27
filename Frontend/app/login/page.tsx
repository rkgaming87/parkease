"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    // Simulate auth (replace with real API call)
    setTimeout(() => {
      if (email === "admin@parkease.com" && password === "admin123") {
        router.push("/dashboard");
      } else {
        setError("Invalid credentials. Try admin@parkease.com / admin123");
        setLoading(false);
      }
    }, 1200);
  }

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "var(--navy)", position: "relative", overflow: "hidden",
    }}>
      {/* Blobs */}
      <div className="blob blob-blue"  style={{ width: 500, height: 500, top: "-20%", left: "-10%"  }} />
      <div className="blob blob-teal"  style={{ width: 400, height: 400, bottom: "-15%", right: "-8%" }} />

      {/* Animated ring */}
      <div style={{
        position: "absolute", width: 600, height: 600, borderRadius: "50%",
        border: "1px solid rgba(37,99,235,0.15)",
        animation: "spin-slow 30s linear infinite",
      }} />

      <div className="glass-2 anim-fade-up" style={{
        width: "100%", maxWidth: 440,
        padding: "48px 40px", zIndex: 1, position: "relative", margin: "24px",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16, margin: "0 auto 16px",
            background: "linear-gradient(135deg, var(--blue), var(--teal))",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px",
          }}>🅿</div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#fff" }}>
            Park<span style={{ background: "linear-gradient(135deg,#3b82f6,#06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Ease</span>
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "0.875rem", marginTop: 6 }}>Admin Portal · Secure Login</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <label className="label">Email Address</label>
            <input
              className="input"
              type="email"
              placeholder="admin@parkease.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="label">Password</label>
            <input
              className="input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div style={{
              background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: 8, padding: "10px 14px", fontSize: "0.82rem", color: "#fca5a5",
            }}>⚠ {error}</div>
          )}

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ justifyContent: "center", padding: "14px", borderRadius: 12, marginTop: 4, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Authenticating…" : "Sign In →"}
          </button>
        </form>

        <p style={{ textAlign: "center", color: "var(--muted)", fontSize: "0.78rem", marginTop: 24 }}>
          Demo: admin@parkease.com / admin123
        </p>

        <div className="divider" style={{ margin: "24px 0" }} />

        <p style={{ textAlign: "center", fontSize: "0.82rem", color: "var(--muted)" }}>
          <Link href="/" style={{ color: "var(--blue-l)", textDecoration: "none" }}>← Back to Home</Link>
        </p>
      </div>
    </div>
  );
}
