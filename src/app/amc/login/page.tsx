"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AMCLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [mode, setMode] = useState<"login" | "reset">("login");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/amc/dashboard");
      router.refresh();
    }
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/amc/login`,
    });
    setLoading(false);
    if (error) setError(error.message);
    else setResetSent(true);
  }

  const s = {
    wrap: {
      minHeight: "100vh", background: "#07050f",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "Inter, system-ui, sans-serif",
    } as React.CSSProperties,
    card: {
      width: "100%", maxWidth: 380,
      background: "#0d0a1a",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 12, padding: "2.5rem 2rem",
    } as React.CSSProperties,
    logo: { display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "2rem" } as React.CSSProperties,
    label: { display: "block", fontSize: "0.7rem", color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: "0.4rem" },
    input: {
      width: "100%", padding: "0.65rem 0.85rem",
      background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 6, color: "#fdf2e1", fontSize: "0.875rem", outline: "none",
      boxSizing: "border-box" as const,
    } as React.CSSProperties,
    btn: {
      width: "100%", padding: "0.75rem",
      background: "#d56047", border: "none", borderRadius: 6,
      color: "#07050f", fontWeight: 700, fontSize: "0.8rem",
      letterSpacing: "0.1em", textTransform: "uppercase" as const,
      cursor: "pointer", marginTop: "1.5rem",
    } as React.CSSProperties,
    err: { marginTop: "1rem", padding: "0.65rem 0.85rem", background: "rgba(174,70,65,0.15)", border: "1px solid rgba(174,70,65,0.3)", borderRadius: 6, color: "#e07070", fontSize: "0.8rem" } as React.CSSProperties,
  };

  return (
    <div style={s.wrap}>
      <div style={s.card}>
        <div style={s.logo}>
          <img src="/logo.png" alt="" style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }} />
          <div>
            <div style={{ fontWeight: 700, letterSpacing: "0.2em", color: "#d56047", fontSize: "0.8rem", textTransform: "uppercase" }}>AMC</div>
            <div style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.25)", letterSpacing: "0.1em" }}>Internal Access Only</div>
          </div>
        </div>

        {mode === "login" ? (
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: "1rem" }}>
              <label style={s.label}>Email</label>
              <input style={s.input} type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" />
            </div>
            <div>
              <label style={s.label}>Password</label>
              <input style={s.input} type="password" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password" />
            </div>
            {error && <div style={s.err}>{error}</div>}
            <button style={{ ...s.btn, opacity: loading ? 0.6 : 1 }} type="submit" disabled={loading}>
              {loading ? "Signing in…" : "Sign In"}
            </button>
            <button type="button" onClick={() => { setMode("reset"); setError(null); }}
              style={{ display: "block", margin: "1rem auto 0", background: "none", border: "none", color: "rgba(255,255,255,0.3)", fontSize: "0.72rem", cursor: "pointer" }}>
              Forgot password?
            </button>
          </form>
        ) : (
          <form onSubmit={handleReset}>
            <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", marginBottom: "1.5rem", lineHeight: 1.5 }}>
              Enter your email to receive a password reset link.
            </p>
            <div>
              <label style={s.label}>Email</label>
              <input style={s.input} type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            {error && <div style={s.err}>{error}</div>}
            {resetSent && (
              <div style={{ ...s.err, background: "rgba(71,174,70,0.1)", border: "1px solid rgba(71,174,70,0.25)", color: "#70e070" }}>
                Reset email sent. Check your inbox.
              </div>
            )}
            <button style={{ ...s.btn, opacity: loading ? 0.6 : 1 }} type="submit" disabled={loading}>
              {loading ? "Sending…" : "Send Reset Link"}
            </button>
            <button type="button" onClick={() => { setMode("login"); setError(null); setResetSent(false); }}
              style={{ display: "block", margin: "1rem auto 0", background: "none", border: "none", color: "rgba(255,255,255,0.3)", fontSize: "0.72rem", cursor: "pointer" }}>
              ← Back to login
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
