"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import AMCShell from "@/components/amc/AMCShell";
import type { Profile, CheckIn } from "@/types/amc";

const TODAY = new Date().toISOString().split("T")[0];

function fmtDate(d: string) {
  return new Date(d + "T00:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

const ENERGY_LABELS = ["", "💀 Drained", "😔 Low", "😐 Okay", "😊 Good", "⚡ Energized"];

export default function CheckInsPage() {
  const supabase = createClient();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(TODAY);

  // form state
  const [myCheckIn, setMyCheckIn] = useState<CheckIn | null>(null);
  const [energy, setEnergy] = useState(3);
  const [wins, setWins] = useState("");
  const [blockers, setBlockers] = useState("");
  const [plan, setPlan] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const [pRes, psRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("user_id", user.id).single(),
      supabase.from("profiles").select("*").order("name"),
    ]);
    const me = pRes.data as Profile | null;
    setProfile(me);
    setProfiles(psRes.data ?? []);

    await loadDate(selectedDate, me);
    setLoading(false);
  }, [supabase]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadDate = useCallback(async (date: string, me?: Profile | null) => {
    const { data } = await supabase
      .from("check_ins")
      .select("*, profile:profiles!check_ins_user_id_fkey(*)")
      .eq("date", date)
      .order("created_at");
    const cis = (data ?? []) as CheckIn[];
    setCheckIns(cis);

    const currentProfile = me ?? profile;
    if (currentProfile) {
      const mine = cis.find(c => c.user_id === currentProfile.id);
      if (mine) {
        setMyCheckIn(mine);
        setEnergy(mine.energy);
        setWins(mine.wins ?? "");
        setBlockers(mine.blockers ?? "");
        setPlan(mine.plan ?? "");
      } else {
        setMyCheckIn(null);
        setEnergy(3);
        setWins("");
        setBlockers("");
        setPlan("");
      }
    }
  }, [supabase, profile]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (!loading) loadDate(selectedDate);
  }, [selectedDate]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    const payload = {
      user_id: profile.id,
      date: selectedDate,
      energy,
      wins: wins.trim() || null,
      blockers: blockers.trim() || null,
      plan: plan.trim() || null,
    };
    if (myCheckIn) {
      await supabase.from("check_ins").update(payload).eq("id", myCheckIn.id);
    } else {
      await supabase.from("check_ins").insert(payload);
    }
    await loadDate(selectedDate);
    setSaving(false);
  }

  const teamCheckIns = profiles.map(p => ({
    profile: p,
    checkIn: checkIns.find(c => c.user_id === p.id) ?? null,
  }));

  return (
    <AMCShell profile={profile}>
      <div style={{ padding: "2rem 2.5rem", maxWidth: 900 }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
          <div>
            <h1 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#fdf2e1", margin: 0, fontFamily: "Playfair Display, Georgia, serif" }}>Check-ins</h1>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.75rem", marginTop: "0.2rem" }}>Daily team pulse</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <button onClick={() => setSelectedDate(TODAY)}
              style={{ background: selectedDate === TODAY ? "rgba(213,96,71,0.15)" : "rgba(255,255,255,0.04)", border: `1px solid ${selectedDate === TODAY ? "#d56047" : "rgba(255,255,255,0.1)"}`, borderRadius: 6, color: selectedDate === TODAY ? "#d56047" : "rgba(255,255,255,0.5)", fontSize: "0.72rem", padding: "0.4rem 0.85rem", cursor: "pointer" }}>
              Today
            </button>
            <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)}
              style={{ background: "#0d0a1a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, color: "rgba(255,255,255,0.6)", fontSize: "0.75rem", padding: "0.4rem 0.6rem", outline: "none" }} />
          </div>
        </div>

        <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.25)", marginBottom: "1.75rem" }}>
          {fmtDate(selectedDate)}{selectedDate === TODAY ? " · Today" : ""}
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "rgba(255,255,255,0.2)", fontSize: "0.8rem" }}>Loading…</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
            {/* My Check-in form */}
            <div>
              <SectionLabel>{myCheckIn ? "✏️ Update My Check-in" : "📋 Log My Check-in"}</SectionLabel>
              <form onSubmit={handleSubmit} style={{ background: "#0d0a1a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "1.25rem" }}>
                {/* Energy */}
                <Field label="Energy Level">
                  <div style={{ display: "flex", gap: "0.4rem", marginTop: "0.25rem" }}>
                    {[1, 2, 3, 4, 5].map(v => (
                      <button key={v} type="button" onClick={() => setEnergy(v)}
                        style={{ flex: 1, padding: "0.4rem 0", background: energy === v ? "#d56047" : "rgba(255,255,255,0.05)", border: `1px solid ${energy === v ? "#d56047" : "rgba(255,255,255,0.1)"}`, borderRadius: 6, color: energy === v ? "#07050f" : "rgba(255,255,255,0.5)", fontSize: "0.75rem", fontWeight: energy === v ? 700 : 400, cursor: "pointer" }}>
                        {v}
                      </button>
                    ))}
                  </div>
                  {energy > 0 && <div style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.3)", marginTop: "0.35rem" }}>{ENERGY_LABELS[energy]}</div>}
                </Field>

                <Field label="Wins">
                  <textarea value={wins} onChange={e => setWins(e.target.value)} placeholder="What went well?" rows={3} style={taStyle} />
                </Field>
                <Field label="Blockers">
                  <textarea value={blockers} onChange={e => setBlockers(e.target.value)} placeholder="What's in your way?" rows={3} style={taStyle} />
                </Field>
                <Field label="Plan for Today">
                  <textarea value={plan} onChange={e => setPlan(e.target.value)} placeholder="What are you working on?" rows={3} style={taStyle} />
                </Field>

                <button type="submit" disabled={saving}
                  style={{ width: "100%", background: "#d56047", border: "none", borderRadius: 6, color: "#07050f", fontWeight: 700, fontSize: "0.78rem", padding: "0.6rem", cursor: "pointer", marginTop: "0.5rem", opacity: saving ? 0.6 : 1 }}>
                  {saving ? "Saving…" : myCheckIn ? "Update Check-in" : "Submit Check-in"}
                </button>
              </form>
            </div>

            {/* Team overview */}
            <div>
              <SectionLabel>👥 Team Status</SectionLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {teamCheckIns.map(({ profile: p, checkIn: ci }) => (
                  <div key={p.id} style={{ background: "#0d0a1a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "1rem 1.1rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: ci ? "0.75rem" : 0 }}>
                      <Avatar profile={p} size={28} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "0.82rem", color: "#fdf2e1", fontWeight: 600 }}>{p.name}</div>
                        {ci ? (
                          <div style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.35)" }}>Energy {ci.energy}/5 · {ENERGY_LABELS[ci.energy]}</div>
                        ) : (
                          <div style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.2)" }}>Not checked in</div>
                        )}
                      </div>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: ci ? "#47ae70" : "rgba(255,255,255,0.1)", flexShrink: 0 }} />
                    </div>

                    {ci && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", paddingTop: "0.5rem", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                        {ci.wins && <CheckInRow label="🏆" text={ci.wins} />}
                        {ci.blockers && <CheckInRow label="🚧" text={ci.blockers} />}
                        {ci.plan && <CheckInRow label="📌" text={ci.plan} />}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </AMCShell>
  );
}

// ── micro helpers ─────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: "0.65rem" }}>{children}</div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "0.9rem" }}>
      <label style={{ display: "block", fontSize: "0.62rem", color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.35rem" }}>{label}</label>
      {children}
    </div>
  );
}

function CheckInRow({ label, text }: { label: string; text: string }) {
  return (
    <div style={{ display: "flex", gap: "0.5rem", fontSize: "0.75rem" }}>
      <span style={{ flexShrink: 0 }}>{label}</span>
      <span style={{ color: "rgba(255,255,255,0.45)", lineHeight: 1.4 }}>{text}</span>
    </div>
  );
}

function Avatar({ profile, size = 32 }: { profile: Profile; size?: number }) {
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: profile.avatar_color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.3 + "px", fontWeight: 700, color: "#07050f", flexShrink: 0 }}>
      {profile.name.slice(0, 2).toUpperCase()}
    </div>
  );
}

const baseInput: React.CSSProperties = {
  width: "100%", padding: "0.5rem 0.7rem",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 6, color: "#fdf2e1", fontSize: "0.82rem",
  outline: "none", boxSizing: "border-box",
};

const taStyle: React.CSSProperties = { ...baseInput, resize: "vertical" };
