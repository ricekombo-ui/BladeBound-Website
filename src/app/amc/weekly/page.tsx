"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import AMCShell from "@/components/amc/AMCShell";
import type { Profile, WeeklyMeeting, WeeklyPriority } from "@/types/amc";

// ── helpers ──────────────────────────────────────────────────────────────────

function getMondayOf(d = new Date()): string {
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const mon = new Date(d);
  mon.setDate(d.getDate() + diff);
  return mon.toISOString().split("T")[0];
}

function fmtWeek(weekStart: string): string {
  const d = new Date(weekStart + "T00:00:00");
  const end = new Date(d);
  end.setDate(d.getDate() + 6);
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  return `${d.toLocaleDateString("en-US", opts)} – ${end.toLocaleDateString("en-US", opts)}`;
}

// ── page ─────────────────────────────────────────────────────────────────────

export default function WeeklyPage() {
  const supabase = createClient();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [meetings, setMeetings] = useState<WeeklyMeeting[]>([]);
  const [selected, setSelected] = useState<WeeklyMeeting | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [creating, setCreating] = useState(false);

  // ── load ──────────────────────────────────────────────────────────────────

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const [pRes, psRes, mRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("user_id", user.id).single(),
      supabase.from("profiles").select("*").order("name"),
      supabase.from("weekly_meetings")
        .select("*, priorities:weekly_priorities(*, profile:profiles!weekly_priorities_owner_id_fkey(*))")
        .order("week_start", { ascending: false }),
    ]);
    setProfile(pRes.data);
    setProfiles(psRes.data ?? []);
    const fetched = (mRes.data ?? []) as WeeklyMeeting[];
    setMeetings(fetched);
    // auto-select the most recent meeting
    if (!selected && fetched.length > 0) setSelected(fetched[0]);
    setLoading(false);
  }, [supabase]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { load(); }, [load]);

  // ── create this week ──────────────────────────────────────────────────────

  async function createThisWeek() {
    const weekStart = getMondayOf();
    const exists = meetings.find(m => m.week_start === weekStart);
    if (exists) { setSelected(exists); return; }
    setCreating(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { data } = await supabase.from("weekly_meetings").insert({
      week_start: weekStart,
      wins: [],
      blockers: [],
      notes: null,
      created_by: profile?.id ?? null,
    }).select("*, priorities:weekly_meetings(*)").single();
    // refetch properly
    await load();
    // select newly created
    setCreating(false);
    setMeetings(prev => {
      const next = prev.find(m => m.week_start === weekStart);
      if (next) setSelected(next);
      return prev;
    });
    void user; void data;
  }

  // ── save meeting fields ────────────────────────────────────────────────────

  async function saveMeeting(patch: Partial<WeeklyMeeting>) {
    if (!selected) return;
    setSaving(true);
    await supabase.from("weekly_meetings").update(patch).eq("id", selected.id);
    setSelected(prev => prev ? { ...prev, ...patch } : prev);
    setMeetings(prev => prev.map(m => m.id === selected.id ? { ...m, ...patch } : m));
    setSaving(false);
  }

  // ── priority CRUD ─────────────────────────────────────────────────────────

  async function addPriority(title: string, ownerId: string | null) {
    if (!selected || !title.trim()) return;
    const order = (selected.priorities?.length ?? 0);
    const { data } = await supabase.from("weekly_priorities").insert({
      meeting_id: selected.id,
      title: title.trim(),
      owner_id: ownerId || null,
      completed: false,
      order_index: order,
    }).select("*, profile:profiles!weekly_priorities_owner_id_fkey(*)").single();
    if (data) {
      setSelected(prev => prev ? { ...prev, priorities: [...(prev.priorities ?? []), data] } : prev);
      setMeetings(prev => prev.map(m => m.id === selected.id ? { ...m, priorities: [...(m.priorities ?? []), data] } : m));
    }
  }

  async function togglePriority(p: WeeklyPriority) {
    const updated = { ...p, completed: !p.completed };
    await supabase.from("weekly_priorities").update({ completed: updated.completed }).eq("id", p.id);
    const patchList = (list: WeeklyPriority[]) => list.map(x => x.id === p.id ? updated : x);
    setSelected(prev => prev ? { ...prev, priorities: patchList(prev.priorities ?? []) } : prev);
    setMeetings(prev => prev.map(m => m.id === selected?.id ? { ...m, priorities: patchList(m.priorities ?? []) } : m));
  }

  async function deletePriority(id: string) {
    await supabase.from("weekly_priorities").delete().eq("id", id);
    const remove = (list: WeeklyPriority[]) => list.filter(x => x.id !== id);
    setSelected(prev => prev ? { ...prev, priorities: remove(prev.priorities ?? []) } : prev);
    setMeetings(prev => prev.map(m => m.id === selected?.id ? { ...m, priorities: remove(m.priorities ?? []) } : m));
  }

  // ── render ────────────────────────────────────────────────────────────────

  return (
    <AMCShell profile={profile}>
      <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>

        {/* Left: meeting list */}
        <div style={{ width: 220, flexShrink: 0, borderRight: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", background: "#09061a" }}>
          <div style={{ padding: "1.25rem 1rem 0.75rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: "0.75rem" }}>Weekly Meetings</div>
            <button
              onClick={createThisWeek}
              disabled={creating}
              style={{ width: "100%", background: "#d56047", border: "none", borderRadius: 6, color: "#07050f", fontWeight: 700, fontSize: "0.72rem", padding: "0.45rem 0.75rem", cursor: "pointer", letterSpacing: "0.05em" }}>
              {creating ? "Creating…" : "+ This Week"}
            </button>
          </div>
          <div style={{ flex: 1, overflow: "auto", padding: "0.5rem 0" }}>
            {loading ? (
              <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.2)", padding: "1.5rem 1rem" }}>Loading…</div>
            ) : meetings.length === 0 ? (
              <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.2)", padding: "1.5rem 1rem" }}>No meetings yet</div>
            ) : meetings.map(m => {
              const active = selected?.id === m.id;
              return (
                <button key={m.id} onClick={() => setSelected(m)}
                  style={{ width: "100%", textAlign: "left", background: active ? "rgba(213,96,71,0.1)" : "transparent", border: "none", borderLeft: active ? "2px solid #d56047" : "2px solid transparent", padding: "0.6rem 1rem", cursor: "pointer", color: active ? "#fdf2e1" : "rgba(255,255,255,0.4)", fontSize: "0.75rem", display: "block" }}>
                  <div style={{ fontWeight: active ? 600 : 400 }}>{fmtWeek(m.week_start)}</div>
                  <div style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.25)", marginTop: "0.1rem" }}>{(m.priorities?.length ?? 0)} priorities</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: meeting detail */}
        <div style={{ flex: 1, overflow: "auto", padding: "2rem 2.5rem" }}>
          {!selected ? (
            <div style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.85rem", marginTop: "4rem", textAlign: "center" }}>
              Select a meeting or create this week's
            </div>
          ) : (
            <MeetingDetail
              meeting={selected}
              profiles={profiles}
              saving={saving}
              onSave={saveMeeting}
              onAddPriority={addPriority}
              onTogglePriority={togglePriority}
              onDeletePriority={deletePriority}
            />
          )}
        </div>
      </div>
    </AMCShell>
  );
}

// ── MeetingDetail ─────────────────────────────────────────────────────────────

interface DetailProps {
  meeting: WeeklyMeeting;
  profiles: Profile[];
  saving: boolean;
  onSave: (patch: Partial<WeeklyMeeting>) => Promise<void>;
  onAddPriority: (title: string, ownerId: string | null) => Promise<void>;
  onTogglePriority: (p: WeeklyPriority) => Promise<void>;
  onDeletePriority: (id: string) => Promise<void>;
}

function MeetingDetail({ meeting, profiles, saving, onSave, onAddPriority, onTogglePriority, onDeletePriority }: DetailProps) {
  const [wins, setWins] = useState(meeting.wins.join("\n"));
  const [blockers, setBlockers] = useState(meeting.blockers.join("\n"));
  const [notes, setNotes] = useState(meeting.notes ?? "");
  const [dirty, setDirty] = useState(false);

  const [newPTitle, setNewPTitle] = useState("");
  const [newPOwner, setNewPOwner] = useState("");
  const [addingP, setAddingP] = useState(false);

  // sync when meeting changes (sidebar click)
  useEffect(() => {
    setWins(meeting.wins.join("\n"));
    setBlockers(meeting.blockers.join("\n"));
    setNotes(meeting.notes ?? "");
    setDirty(false);
  }, [meeting.id]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSave() {
    await onSave({
      wins: wins.split("\n").map(s => s.trim()).filter(Boolean),
      blockers: blockers.split("\n").map(s => s.trim()).filter(Boolean),
      notes: notes.trim() || null,
    });
    setDirty(false);
  }

  async function handleAddP(e: React.FormEvent) {
    e.preventDefault();
    if (!newPTitle.trim()) return;
    setAddingP(true);
    await onAddPriority(newPTitle, newPOwner || null);
    setNewPTitle("");
    setNewPOwner("");
    setAddingP(false);
  }

  const priorities = meeting.priorities ?? [];
  const done = priorities.filter(p => p.completed).length;

  return (
    <div style={{ maxWidth: 780 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#fdf2e1", margin: 0, fontFamily: "Playfair Display, Georgia, serif" }}>
            Week of {fmtWeek(meeting.week_start)}
          </h1>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.75rem", marginTop: "0.2rem" }}>
            {priorities.length > 0 ? `${done} / ${priorities.length} priorities complete` : "No priorities logged"}
          </p>
        </div>
        {dirty && (
          <button onClick={handleSave} disabled={saving}
            style={{ background: "#d56047", border: "none", borderRadius: 6, color: "#07050f", fontWeight: 700, fontSize: "0.75rem", padding: "0.5rem 1.2rem", cursor: "pointer" }}>
            {saving ? "Saving…" : "Save Changes"}
          </button>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "2rem" }}>
        {/* Wins */}
        <div>
          <SectionLabel>🏆 Wins</SectionLabel>
          <textarea
            value={wins}
            onChange={e => { setWins(e.target.value); setDirty(true); }}
            placeholder={"One win per line…"}
            rows={5}
            style={taStyle}
          />
        </div>
        {/* Blockers */}
        <div>
          <SectionLabel>🚧 Blockers</SectionLabel>
          <textarea
            value={blockers}
            onChange={e => { setBlockers(e.target.value); setDirty(true); }}
            placeholder={"One blocker per line…"}
            rows={5}
            style={taStyle}
          />
        </div>
      </div>

      {/* Notes */}
      <div style={{ marginBottom: "2rem" }}>
        <SectionLabel>📝 Notes</SectionLabel>
        <textarea
          value={notes}
          onChange={e => { setNotes(e.target.value); setDirty(true); }}
          placeholder="Meeting notes, agenda items, follow-ups…"
          rows={4}
          style={taStyle}
        />
      </div>

      {/* Priorities */}
      <div>
        <SectionLabel>🎯 Priorities</SectionLabel>

        {/* Add form */}
        <form onSubmit={handleAddP} style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
          <input
            value={newPTitle}
            onChange={e => setNewPTitle(e.target.value)}
            placeholder="Add a priority…"
            style={{ ...inputStyle, flex: 1 }}
          />
          <select value={newPOwner} onChange={e => setNewPOwner(e.target.value)} style={{ ...inputStyle, width: 140 }}>
            <option value="">Anyone</option>
            {profiles.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <button type="submit" disabled={addingP || !newPTitle.trim()}
            style={{ background: "#d56047", border: "none", borderRadius: 6, color: "#07050f", fontWeight: 700, fontSize: "0.75rem", padding: "0.5rem 0.9rem", cursor: "pointer", opacity: (!newPTitle.trim() || addingP) ? 0.5 : 1 }}>
            {addingP ? "…" : "Add"}
          </button>
        </form>

        {/* List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          {priorities.length === 0 && (
            <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.2)", padding: "0.75rem 0" }}>No priorities yet</div>
          )}
          {priorities.sort((a, b) => a.order_index - b.order_index).map(p => (
            <div key={p.id} style={{ display: "flex", alignItems: "center", gap: "0.75rem", background: "#0d0a1a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, padding: "0.65rem 0.9rem" }}>
              <button onClick={() => onTogglePriority(p)}
                style={{ width: 18, height: 18, borderRadius: 4, border: `1.5px solid ${p.completed ? "#47ae70" : "rgba(255,255,255,0.2)"}`, background: p.completed ? "#47ae70" : "transparent", cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {p.completed && <span style={{ color: "#07050f", fontSize: "0.6rem", fontWeight: 900 }}>✓</span>}
              </button>
              <span style={{ flex: 1, fontSize: "0.82rem", color: p.completed ? "rgba(255,255,255,0.3)" : "#fdf2e1", textDecoration: p.completed ? "line-through" : "none" }}>
                {p.title}
              </span>
              {p.profile && (
                <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.3)" }}>{p.profile.name}</span>
              )}
              <button onClick={() => onDeletePriority(p.id)}
                style={{ background: "none", border: "none", color: "rgba(255,255,255,0.2)", cursor: "pointer", fontSize: "0.8rem", padding: "0.15rem 0.3rem" }}
                title="Remove">✕</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── micro helpers ─────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: "0.5rem" }}>{children}</div>;
}

const inputStyle: React.CSSProperties = {
  padding: "0.5rem 0.75rem", background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6,
  color: "#fdf2e1", fontSize: "0.82rem", outline: "none", boxSizing: "border-box",
};

const taStyle: React.CSSProperties = {
  ...inputStyle, width: "100%", resize: "vertical",
};
