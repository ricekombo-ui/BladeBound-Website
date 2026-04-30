"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import AMCShell from "@/components/amc/AMCShell";
import type { Profile, Goal, GoalType, GoalStatus } from "@/types/amc";

const STATUS_COLORS: Record<GoalStatus, [string, string]> = {
  active:    ["rgba(71,174,112,0.15)",  "#47ae70"],
  completed: ["rgba(109,158,235,0.15)", "#6d9eeb"],
  paused:    ["rgba(255,255,255,0.06)", "rgba(255,255,255,0.3)"],
};

const blank = (): Partial<Goal> => ({
  title: "", description: "", type: "short", status: "active", owner_id: null, target_date: null, progress_note: "",
});

export default function GoalsPage() {
  const supabase = createClient();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ open: boolean; goal: Partial<Goal>; isNew: boolean }>({ open: false, goal: blank(), isNew: true });
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState<GoalStatus | "all">("all");

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const [pRes, psRes, gRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("user_id", user.id).single(),
      supabase.from("profiles").select("*").order("name"),
      supabase.from("goals").select("*, profile:profiles!goals_owner_id_fkey(*)").order("created_at", { ascending: false }),
    ]);
    setProfile(pRes.data);
    setProfiles(psRes.data ?? []);
    setGoals(gRes.data ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { load(); }, [load]);

  async function saveGoal() {
    if (!modal.goal.title?.trim()) return;
    setSaving(true);
    if (modal.isNew) {
      await supabase.from("goals").insert({
        title: modal.goal.title, description: modal.goal.description || null,
        type: modal.goal.type, status: modal.goal.status,
        owner_id: modal.goal.owner_id || null, target_date: modal.goal.target_date || null,
        progress_note: modal.goal.progress_note || null,
      });
    } else {
      await supabase.from("goals").update({
        title: modal.goal.title, description: modal.goal.description || null,
        type: modal.goal.type, status: modal.goal.status,
        owner_id: modal.goal.owner_id || null, target_date: modal.goal.target_date || null,
        progress_note: modal.goal.progress_note || null,
      }).eq("id", modal.goal.id!);
    }
    await load();
    setSaving(false);
    setModal({ open: false, goal: blank(), isNew: true });
  }

  async function deleteGoal(id: string) {
    if (!confirm("Delete this goal?")) return;
    setGoals(prev => prev.filter(g => g.id !== id));
    await supabase.from("goals").delete().eq("id", id);
  }

  const filtered = filter === "all" ? goals : goals.filter(g => g.status === filter);
  const short = filtered.filter(g => g.type === "short");
  const long = filtered.filter(g => g.type === "long");

  return (
    <AMCShell profile={profile}>
      <div style={{ padding: "2rem 2.5rem", maxWidth: 900 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
          <div>
            <h1 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#fdf2e1", margin: 0, fontFamily: "Playfair Display, Georgia, serif" }}>Goals</h1>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.75rem", marginTop: "0.2rem" }}>Short and long-term objectives</p>
          </div>
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <select value={filter} onChange={e => setFilter(e.target.value as GoalStatus | "all")}
              style={{ background: "#0d0a1a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, color: "rgba(255,255,255,0.6)", fontSize: "0.75rem", padding: "0.4rem 0.75rem", outline: "none" }}>
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="paused">Paused</option>
            </select>
            <button onClick={() => setModal({ open: true, goal: blank(), isNew: true })}
              style={{ background: "#d56047", border: "none", borderRadius: 6, color: "#07050f", fontWeight: 700, fontSize: "0.75rem", padding: "0.5rem 1.2rem", cursor: "pointer" }}>
              + New Goal
            </button>
          </div>
        </div>

        {loading ? <Spinner /> : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
            <GoalGroup title="Short-term" goals={short} onEdit={g => setModal({ open: true, goal: { ...g }, isNew: false })} />
            <GoalGroup title="Long-term"  goals={long}  onEdit={g => setModal({ open: true, goal: { ...g }, isNew: false })} />
          </div>
        )}
      </div>

      {modal.open && (
        <Modal title={modal.isNew ? "New Goal" : "Edit Goal"} onClose={() => setModal({ open: false, goal: blank(), isNew: true })}>
          <Field label="Title"><Input value={modal.goal.title ?? ""} onChange={v => setModal(m => ({ ...m, goal: { ...m.goal, title: v } }))} /></Field>
          <Field label="Description"><Textarea value={modal.goal.description ?? ""} onChange={v => setModal(m => ({ ...m, goal: { ...m.goal, description: v } }))} /></Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <Field label="Type">
              <Select value={modal.goal.type ?? "short"} onChange={v => setModal(m => ({ ...m, goal: { ...m.goal, type: v as GoalType } }))}>
                <option value="short">Short-term</option>
                <option value="long">Long-term</option>
              </Select>
            </Field>
            <Field label="Status">
              <Select value={modal.goal.status ?? "active"} onChange={v => setModal(m => ({ ...m, goal: { ...m.goal, status: v as GoalStatus } }))}>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="paused">Paused</option>
              </Select>
            </Field>
            <Field label="Owner">
              <Select value={modal.goal.owner_id ?? ""} onChange={v => setModal(m => ({ ...m, goal: { ...m.goal, owner_id: v || null } }))}>
                <option value="">Team / Unassigned</option>
                {profiles.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </Select>
            </Field>
            <Field label="Target Date">
              <Input type="date" value={modal.goal.target_date ?? ""} onChange={v => setModal(m => ({ ...m, goal: { ...m.goal, target_date: v || null } }))} />
            </Field>
          </div>
          <Field label="Progress Note"><Textarea value={modal.goal.progress_note ?? ""} onChange={v => setModal(m => ({ ...m, goal: { ...m.goal, progress_note: v } }))} /></Field>
          <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem", justifyContent: "space-between" }}>
            {!modal.isNew && (
              <button onClick={() => { deleteGoal(modal.goal.id!); setModal({ open: false, goal: blank(), isNew: true }); }}
                style={{ ...btnStyle, background: "rgba(174,70,65,0.15)", color: "#e07070" }}>Delete</button>
            )}
            <div style={{ display: "flex", gap: "0.75rem", marginLeft: "auto" }}>
              <button onClick={() => setModal({ open: false, goal: blank(), isNew: true })} style={{ ...btnStyle, background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)" }}>Cancel</button>
              <button onClick={saveGoal} disabled={saving} style={{ ...btnStyle, background: "#d56047", color: "#07050f", fontWeight: 700 }}>{saving ? "Saving…" : "Save"}</button>
            </div>
          </div>
        </Modal>
      )}
    </AMCShell>
  );
}

function GoalGroup({ title, goals, onEdit }: { title: string; goals: Goal[]; onEdit: (g: Goal) => void }) {
  return (
    <div>
      <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: "0.75rem" }}>{title}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
        {goals.length === 0 && <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.2)", padding: "1rem" }}>No {title.toLowerCase()} goals</div>}
        {goals.map(goal => {
          const [bg, fg] = STATUS_COLORS[goal.status];
          return (
            <div key={goal.id} onClick={() => onEdit(goal)}
              style={{ background: "#0d0a1a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "1rem 1.1rem", cursor: "pointer" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.75rem" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "0.85rem", color: "#fdf2e1", fontWeight: 600, marginBottom: "0.3rem" }}>{goal.title}</div>
                  {goal.description && <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.35)", marginBottom: "0.5rem", lineHeight: 1.4 }}>{goal.description}</div>}
                  {goal.progress_note && <div style={{ fontSize: "0.72rem", color: "#ae8c41", fontStyle: "italic" }}>↳ {goal.progress_note}</div>}
                </div>
                <span style={{ fontSize: "0.6rem", padding: "0.15rem 0.5rem", borderRadius: 4, background: bg, color: fg, textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap", flexShrink: 0 }}>{goal.status}</span>
              </div>
              <div style={{ display: "flex", gap: "1rem", marginTop: "0.6rem" }}>
                {goal.profile && <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.3)" }}>{goal.profile.name}</span>}
                {goal.target_date && <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.25)" }}>Due {goal.target_date}</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Shared helpers (same as pipeline) ────────────────────────────────────────

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
      <div style={{ background: "#0d0a1a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "1.75rem", width: "100%", maxWidth: 480, maxHeight: "90vh", overflow: "auto" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
          <h3 style={{ margin: 0, fontSize: "1rem", color: "#fdf2e1", fontFamily: "Playfair Display, Georgia, serif" }}>{title}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: "1.2rem", cursor: "pointer" }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <label style={{ display: "block", fontSize: "0.65rem", color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.4rem" }}>{label}</label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = { width: "100%", padding: "0.55rem 0.75rem", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, color: "#fdf2e1", fontSize: "0.82rem", outline: "none", boxSizing: "border-box" };
const btnStyle: React.CSSProperties = { padding: "0.55rem 1.2rem", border: "none", borderRadius: 6, fontSize: "0.78rem", cursor: "pointer", letterSpacing: "0.05em" };

function Input({ value, onChange, type = "text" }: { value: string; onChange: (v: string) => void; type?: string }) {
  return <input type={type} value={value} onChange={e => onChange(e.target.value)} style={inputStyle} />;
}
function Textarea({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return <textarea value={value} onChange={e => onChange(e.target.value)} rows={3} style={{ ...inputStyle, resize: "vertical" as const }} />;
}
function Select({ value, onChange, children }: { value: string; onChange: (v: string) => void; children: React.ReactNode }) {
  return <select value={value} onChange={e => onChange(e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>{children}</select>;
}
function Spinner() {
  return <div style={{ textAlign: "center", padding: "3rem", color: "rgba(255,255,255,0.2)", fontSize: "0.8rem" }}>Loading…</div>;
}
