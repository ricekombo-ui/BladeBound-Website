"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import AMCShell from "@/components/amc/AMCShell";
import type { Profile, Decision } from "@/types/amc";

const blank = (): Partial<Decision> => ({
  title: "", context: "", decision_text: "", made_by: null,
  date: new Date().toISOString().split("T")[0], tags: [],
});

function fmtDate(d: string) {
  return new Date(d + "T00:00:00").toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default function DecisionsPage() {
  const supabase = createClient();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ open: boolean; decision: Partial<Decision>; isNew: boolean }>({ open: false, decision: blank(), isNew: true });
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [tagFilter, setTagFilter] = useState("");

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const [pRes, psRes, dRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("user_id", user.id).single(),
      supabase.from("profiles").select("*").order("name"),
      supabase.from("decisions")
        .select("*, profile:profiles!decisions_made_by_fkey(*)")
        .order("date", { ascending: false }),
    ]);
    setProfile(pRes.data);
    setProfiles(psRes.data ?? []);
    setDecisions(dRes.data ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { load(); }, [load]);

  async function saveDecision() {
    if (!modal.decision.title?.trim() || !modal.decision.decision_text?.trim()) return;
    setSaving(true);
    const payload = {
      title: modal.decision.title!,
      context: modal.decision.context?.trim() || null,
      decision_text: modal.decision.decision_text!,
      made_by: modal.decision.made_by || null,
      date: modal.decision.date!,
      tags: modal.decision.tags ?? [],
    };
    if (modal.isNew) {
      await supabase.from("decisions").insert(payload);
    } else {
      await supabase.from("decisions").update(payload).eq("id", modal.decision.id!);
    }
    await load();
    setSaving(false);
    setModal({ open: false, decision: blank(), isNew: true });
  }

  async function deleteDecision(id: string) {
    if (!confirm("Delete this decision?")) return;
    setDecisions(prev => prev.filter(d => d.id !== id));
    await supabase.from("decisions").delete().eq("id", id);
  }

  // ── filtering ─────────────────────────────────────────────────────────────

  const allTags = Array.from(new Set(decisions.flatMap(d => d.tags))).sort();

  const filtered = decisions.filter(d => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      d.title.toLowerCase().includes(q) ||
      (d.decision_text?.toLowerCase().includes(q)) ||
      (d.context?.toLowerCase().includes(q)) ||
      d.tags.some(t => t.toLowerCase().includes(q));
    const matchTag = !tagFilter || d.tags.includes(tagFilter);
    return matchSearch && matchTag;
  });

  // ── tag helpers ───────────────────────────────────────────────────────────

  function addTag(tag: string) {
    tag = tag.trim().toLowerCase().replace(/\s+/g, "-");
    if (!tag) return;
    const tags = modal.decision.tags ?? [];
    if (tags.includes(tag)) return;
    setModal(m => ({ ...m, decision: { ...m.decision, tags: [...tags, tag] } }));
  }

  function removeTag(tag: string) {
    setModal(m => ({ ...m, decision: { ...m.decision, tags: (m.decision.tags ?? []).filter(t => t !== tag) } }));
  }

  return (
    <AMCShell profile={profile}>
      <div style={{ padding: "2rem 2.5rem", maxWidth: 860 }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
          <div>
            <h1 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#fdf2e1", margin: 0, fontFamily: "Playfair Display, Georgia, serif" }}>Decisions</h1>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.75rem", marginTop: "0.2rem" }}>Log of key decisions and reasoning</p>
          </div>
          <button onClick={() => setModal({ open: true, decision: blank(), isNew: true })}
            style={{ background: "#d56047", border: "none", borderRadius: 6, color: "#07050f", fontWeight: 700, fontSize: "0.75rem", padding: "0.5rem 1.2rem", cursor: "pointer" }}>
            + New Decision
          </button>
        </div>

        {/* Search + tag filter */}
        <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem" }}>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search decisions…"
            style={{ flex: 1, background: "#0d0a1a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, color: "rgba(255,255,255,0.7)", fontSize: "0.78rem", padding: "0.45rem 0.85rem", outline: "none" }}
          />
          {allTags.length > 0 && (
            <select value={tagFilter} onChange={e => setTagFilter(e.target.value)}
              style={{ background: "#0d0a1a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, color: "rgba(255,255,255,0.6)", fontSize: "0.75rem", padding: "0.4rem 0.75rem", outline: "none" }}>
              <option value="">All tags</option>
              {allTags.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          )}
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "rgba(255,255,255,0.2)", fontSize: "0.8rem" }}>Loading…</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "rgba(255,255,255,0.2)", fontSize: "0.8rem" }}>
            {decisions.length === 0 ? "No decisions logged yet" : "No results match your search"}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {filtered.map(d => (
              <div key={d.id}
                onClick={() => setModal({ open: true, decision: { ...d }, isNew: false })}
                style={{ background: "#0d0a1a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "1.1rem 1.25rem", cursor: "pointer" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "0.88rem", color: "#fdf2e1", fontWeight: 600, marginBottom: "0.35rem" }}>{d.title}</div>
                    <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>{d.decision_text}</div>
                    {d.context && (
                      <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.3)", marginTop: "0.4rem", fontStyle: "italic" }}>{d.context}</div>
                    )}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginTop: "0.75rem", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.25)" }}>{fmtDate(d.date)}</span>
                  {d.profile && <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.3)" }}>→ {d.profile.name}</span>}
                  {d.tags.map(t => (
                    <span key={t} style={{ fontSize: "0.6rem", padding: "0.1rem 0.45rem", borderRadius: 4, background: "rgba(174,140,65,0.15)", color: "#ae8c41", letterSpacing: "0.05em" }}>{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {modal.open && (
        <Modal title={modal.isNew ? "New Decision" : "Edit Decision"} onClose={() => setModal({ open: false, decision: blank(), isNew: true })}>
          <Field label="Title">
            <Input value={modal.decision.title ?? ""} onChange={v => setModal(m => ({ ...m, decision: { ...m.decision, title: v } }))} placeholder="What was decided?" />
          </Field>
          <Field label="Decision">
            <Textarea value={modal.decision.decision_text ?? ""} onChange={v => setModal(m => ({ ...m, decision: { ...m.decision, decision_text: v } }))} placeholder="Describe the decision clearly…" />
          </Field>
          <Field label="Context / Reasoning">
            <Textarea value={modal.decision.context ?? ""} onChange={v => setModal(m => ({ ...m, decision: { ...m.decision, context: v } }))} placeholder="Why was this decided? What were the alternatives?" />
          </Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <Field label="Made By">
              <Select value={modal.decision.made_by ?? ""} onChange={v => setModal(m => ({ ...m, decision: { ...m.decision, made_by: v || null } }))}>
                <option value="">Team / Unassigned</option>
                {profiles.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </Select>
            </Field>
            <Field label="Date">
              <Input type="date" value={modal.decision.date ?? ""} onChange={v => setModal(m => ({ ...m, decision: { ...m.decision, date: v } }))} />
            </Field>
          </div>

          {/* Tags */}
          <Field label="Tags">
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "0.5rem" }}>
              {(modal.decision.tags ?? []).map(t => (
                <span key={t} style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.68rem", padding: "0.15rem 0.5rem", borderRadius: 4, background: "rgba(174,140,65,0.15)", color: "#ae8c41" }}>
                  {t}
                  <button type="button" onClick={() => removeTag(t)} style={{ background: "none", border: "none", color: "#ae8c41", cursor: "pointer", padding: 0, fontSize: "0.7rem", lineHeight: 1 }}>✕</button>
                </span>
              ))}
            </div>
            <TagInput onAdd={addTag} existingTags={allTags} />
          </Field>

          <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem", justifyContent: "space-between" }}>
            {!modal.isNew && (
              <button onClick={() => { deleteDecision(modal.decision.id!); setModal({ open: false, decision: blank(), isNew: true }); }}
                style={{ ...btnStyle, background: "rgba(174,70,65,0.15)", color: "#e07070" }}>Delete</button>
            )}
            <div style={{ display: "flex", gap: "0.75rem", marginLeft: "auto" }}>
              <button onClick={() => setModal({ open: false, decision: blank(), isNew: true })}
                style={{ ...btnStyle, background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)" }}>Cancel</button>
              <button onClick={saveDecision} disabled={saving || !modal.decision.title?.trim() || !modal.decision.decision_text?.trim()}
                style={{ ...btnStyle, background: "#d56047", color: "#07050f", fontWeight: 700, opacity: (!modal.decision.title?.trim() || !modal.decision.decision_text?.trim()) ? 0.5 : 1 }}>
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </AMCShell>
  );
}

// ── TagInput ──────────────────────────────────────────────────────────────────

function TagInput({ onAdd, existingTags }: { onAdd: (t: string) => void; existingTags: string[] }) {
  const [val, setVal] = useState("");

  function commit() {
    if (val.trim()) { onAdd(val); setVal(""); }
  }

  return (
    <div style={{ position: "relative" }}>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <input
          value={val} onChange={e => setVal(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); commit(); } }}
          placeholder="Add tag…"
          list="tag-suggestions"
          style={{ ...inputStyle, flex: 1 }}
        />
        <button type="button" onClick={commit}
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, color: "rgba(255,255,255,0.5)", fontSize: "0.75rem", padding: "0.4rem 0.8rem", cursor: "pointer" }}>
          Add
        </button>
      </div>
      {existingTags.length > 0 && (
        <datalist id="tag-suggestions">
          {existingTags.map(t => <option key={t} value={t} />)}
        </datalist>
      )}
    </div>
  );
}

// ── Shared UI helpers ─────────────────────────────────────────────────────────

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
      <div style={{ background: "#0d0a1a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "1.75rem", width: "100%", maxWidth: 520, maxHeight: "90vh", overflow: "auto" }} onClick={e => e.stopPropagation()}>
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

function Input({ value, onChange, type = "text", placeholder }: { value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={inputStyle} />;
}
function Textarea({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3} style={{ ...inputStyle, resize: "vertical" as const }} />;
}
function Select({ value, onChange, children }: { value: string; onChange: (v: string) => void; children: React.ReactNode }) {
  return <select value={value} onChange={e => onChange(e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>{children}</select>;
}
