"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import AMCShell from "@/components/amc/AMCShell";
import GiveawayWheel from "@/components/amc/GiveawayWheel";
import type { Profile, GiveawayEntry } from "@/types/amc";

export default function GiveawayPage() {
  const supabase = createClient();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [entries, setEntries] = useState<GiveawayEntry[]>([]);
  const [winners, setWinners] = useState<GiveawayEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [presenting, setPresenting] = useState(false);
  const [revealed, setRevealed] = useState<Set<string>>(new Set());

  function toggleReveal(id: string) {
    setRevealed(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const [pRes, entriesRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("user_id", user.id).single(),
      supabase.from("giveaway_entries").select("*").order("created_at"),
    ]);
    setProfile(pRes.data);
    const all = (entriesRes.data ?? []) as GiveawayEntry[];
    setEntries(all.filter(e => !e.won));
    setWinners(all.filter(e => e.won).sort((a, b) => new Date(b.won_at ?? 0).getTime() - new Date(a.won_at ?? 0).getTime()));
    setLoading(false);
  }, [supabase]);

  useEffect(() => { load(); }, [load]);

  async function handleMarkWon(id: string) {
    await supabase.from("giveaway_entries").update({ won: true, won_at: new Date().toISOString() }).eq("id", id);
    await load();
  }

  async function handleUndoWin(id: string) {
    await supabase.from("giveaway_entries").update({ won: false, won_at: null }).eq("id", id);
    await load();
  }

  const content = (
    <div style={{ padding: presenting ? "1.5rem 2.5rem" : "2rem 2.5rem" }}>
      <div style={{ marginBottom: "2rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#fdf2e1", margin: 0, fontFamily: "Playfair Display, Georgia, serif" }}>
            Hope &amp; Fear Giveaway
          </h1>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.75rem", marginTop: "0.2rem" }}>
            Spin to draw a winner live on stream
          </p>
        </div>
        <button
          onClick={() => setPresenting(p => !p)}
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, color: "rgba(255,255,255,0.5)", fontSize: "0.72rem", padding: "0.5rem 1rem", cursor: "pointer" }}
        >
          {presenting ? "Exit Presentation Mode" : "Presentation Mode"}
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "rgba(255,255,255,0.2)", fontSize: "0.8rem" }}>Loading…</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "3rem", alignItems: "start" }}>
          <GiveawayWheel entries={entries} onMarkWon={handleMarkWon} />

          <div>
            <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: "0.65rem" }}>
              Recent Winners
            </div>
            {winners.length === 0 ? (
              <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.75rem" }}>No winners drawn yet</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {winners.map(w => {
                  const isRevealed = revealed.has(w.id);
                  return (
                    <div key={w.id} style={{ background: "#0d0a1a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, padding: "0.75rem 0.9rem" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}>
                        <div style={{ fontSize: "0.8rem", color: "#fdf2e1", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{w.name}</div>
                        <button onClick={() => handleUndoWin(w.id)} title="Undo — put back in the pool"
                          style={{ background: "none", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 5, color: "rgba(255,255,255,0.3)", fontSize: "0.65rem", padding: "0.3rem 0.55rem", cursor: "pointer", flexShrink: 0 }}>
                          Undo
                        </button>
                      </div>
                      {isRevealed ? (
                        <div style={{ marginTop: "0.5rem", fontSize: "0.65rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>
                          <div>Discord: {w.discord}</div>
                          {w.youtube && <div>YouTube: {w.youtube}</div>}
                          <div>Email: {w.email}</div>
                          <div>Zip: {w.zip_code}</div>
                        </div>
                      ) : (
                        <button onClick={() => toggleReveal(w.id)}
                          style={{ background: "none", border: "none", color: "rgba(255,255,255,0.25)", fontSize: "0.65rem", padding: 0, marginTop: "0.35rem", cursor: "pointer" }}>
                          👁 Show contact info
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  if (presenting) {
    return (
      <div style={{ minHeight: "100vh", background: "#07050f", fontFamily: "Inter, system-ui, sans-serif" }}>
        {content}
      </div>
    );
  }

  return <AMCShell profile={profile}>{content}</AMCShell>;
}
