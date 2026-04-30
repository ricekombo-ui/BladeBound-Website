"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types/amc";

const NAV = [
  { href: "/amc/dashboard",  label: "Dashboard",   icon: "⬡" },
  { href: "/amc/pipeline",   label: "Pipeline",    icon: "▦" },
  { href: "/amc/weekly",     label: "Weekly",      icon: "◈" },
  { href: "/amc/goals",      label: "Goals",       icon: "◎" },
  { href: "/amc/check-ins",  label: "Check-ins",   icon: "✦" },
  { href: "/amc/decisions",  label: "Decisions",   icon: "◆" },
];

interface AMCShellProps {
  children: React.ReactNode;
  profile: Profile | null;
}

export default function AMCShell({ children, profile }: AMCShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/amc/login");
    router.refresh();
  }

  const initials = profile?.name?.slice(0, 2).toUpperCase() ?? "??";
  const color = profile?.avatar_color ?? "#d56047";

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#07050f", fontFamily: "Inter, system-ui, sans-serif" }}>
      {/* Sidebar */}
      <aside style={{
        width: 220, flexShrink: 0,
        background: "#0d0a1a",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        display: "flex", flexDirection: "column",
        position: "sticky", top: 0, height: "100vh",
      }}>
        {/* Brand */}
        <div style={{ padding: "1.5rem 1.25rem 1rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <img src="/logo.png" alt="" style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover" }} />
            <div>
              <div style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.2em", color: "#d56047", textTransform: "uppercase" }}>AMC</div>
              <div style={{ fontSize: "0.55rem", color: "rgba(255,255,255,0.25)", letterSpacing: "0.1em" }}>BladeBound Ops</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "0.75rem 0" }}>
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link key={item.href} href={item.href} style={{
                display: "flex", alignItems: "center", gap: "0.75rem",
                padding: "0.55rem 1.25rem",
                fontSize: "0.78rem",
                color: active ? "#fdf2e1" : "rgba(255,255,255,0.4)",
                background: active ? "rgba(213,96,71,0.08)" : "transparent",
                borderLeft: active ? "2px solid #d56047" : "2px solid transparent",
                textDecoration: "none",
                transition: "all 150ms",
              }}>
                <span style={{ fontSize: "0.9rem", opacity: active ? 1 : 0.6 }}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div style={{
          padding: "1rem 1.25rem",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          display: "flex", alignItems: "center", gap: "0.75rem",
        }}>
          <div style={{
            width: 30, height: 30, borderRadius: "50%",
            background: color,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "0.6rem", fontWeight: 700, color: "#07050f", flexShrink: 0,
          }}>{initials}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: "0.75rem", color: "#fdf2e1", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {profile?.name ?? "Unknown"}
            </div>
            <div style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.3)", textTransform: "capitalize" }}>
              {profile?.role ?? "member"}
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Log out"
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: "rgba(255,255,255,0.3)", fontSize: "0.8rem", padding: "0.25rem",
            }}
          >⏻</button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, overflow: "auto" }}>
        {children}
      </main>
    </div>
  );
}
