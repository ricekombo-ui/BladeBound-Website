"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import AMCShell from "@/components/amc/AMCShell";
import type { Profile, Task, TaskStatus, TaskType, TaskPriority, TaskSubtask, TaskAssignee } from "@/types/amc";

// ── Config ────────────────────────────────────────────────────────────────────

const COLUMNS: { key: TaskStatus; label: string; color: string }[] = [
  { key: "backlog",     label: "Backlog",     color: "rgba(255,255,255,0.2)" },
  { key: "ready",       label: "Ready",       color: "#6d9eeb" },
  { key: "in_progress", label: "In Progress", color: "#d56047" },
  { key: "review",      label: "Review",      color: "#ae8c41" },
  { key: "scheduled",   label: "Scheduled",   color: "#8cae41" },
  { key: "published",   label: "Published",   color: "#47ae70" },
  { key: "repurpose",   label: "Repurpose",   color: "#9b6deb" },
];

const TYPE_COLORS: Record<TaskType, [string, string]> = {
  yt:           ["rgba(213,96,71,0.15)",   "#d56047"],
  infographic:  ["rgba(109,158,235,0.15)", "#6d9eeb"],
  frame_design: ["rgba(174,140,65,0.15)",  "#ae8c41"],
  actual_play:  ["rgba(71,174,112,0.15)",  "#47ae70"],
  community:    ["rgba(155,109,235,0.15)", "#9b6deb"],
  admin:        ["rgba(255,255,255,0.08)", "rgba(255,255,255,0.4)"],
  tech:         ["rgba(140,174,65,0.15)",  "#8cae41"],
};

const TYPE_LABELS: Record<TaskType, string> = {
  yt: "YT", infographic: "Infographic", frame_design: "Frame",
  actual_play: "Actual Play", community: "Community", admin: "Admin", tech: "Tech",
};

const PRIORITY_COLORS: Record<TaskPriority, string> = {
  high: "#e07070", medium: "#ae8c41", low: "rgba(255,255,255,0.25)",
};

const PRIORITY_LABELS: Record<TaskPriority, string> = {
  high: "P1", medium: "P2", low: "P3",
};

const blank = (): Partial<Task> => ({
  title: "", description: "", status: "backlog", type: "yt",
  priority: "high", owner_id: null, due_date: null,
});

// ── Page ──────────────────────────────────────────────────────────────────────

export default function PipelinePage() {
  const supabase = createClient();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ open: boolean; task: Partial<Task>; isNew: boolean }>({ open: false, task: blank(), isNew: true });
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState<TaskType | "all">("all");

  // Subtask state for open modal
  const [modalSubtasks, setModalSubtasks] = useState<TaskSubtask[]>([]);
  const [newSubtask, setNewSubtask] = useState("");
  const [addingSubtask, setAddingSubtask] = useState(false);

  // Assignee state for open modal
  const [modalAssignees, setModalAssignees] = useState<TaskAssignee[]>([]);

  // ── Load ──────────────────────────────────────────────────────────────────

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const [pRes, psRes, tRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("user_id", user.id).single(),
      supabase.from("profiles").select("*").order("name"),
      supabase.from("tasks")
        .select("*, profile:profiles!tasks_owner_id_fkey(*), subtasks:task_subtasks(*), assignees:task_assignees(task_id, profile_id, profile:profiles!task_assignees_profile_id_fkey(*))")
        .order("created_at", { ascending: false }),
    ]);
    setProfile(pRes.data);
    setProfiles(psRes.data ?? []);
    setTasks((tRes.data ?? []) as Task[]);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { load(); }, [load]);

  // ── Modal helpers ─────────────────────────────────────────────────────────

  function openModal(task: Partial<Task>, isNew: boolean) {
    setModal({ open: true, task, isNew });
    setModalSubtasks(
      isNew ? [] : [...(task.subtasks ?? [])].sort((a, b) => a.order_index - b.order_index)
    );
    setModalAssignees(isNew ? [] : (task.assignees ?? []));
    setNewSubtask("");
  }

  function closeModal() {
    setModal({ open: false, task: blank(), isNew: true });
    setModalSubtasks([]);
    setModalAssignees([]);
    setNewSubtask("");
  }

  // ── Move ──────────────────────────────────────────────────────────────────

  async function moveTask(id: string, status: TaskStatus) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    await supabase.from("tasks").update({ status }).eq("id", id);
  }

  // ── Save ──────────────────────────────────────────────────────────────────

  async function saveTask() {
    if (!modal.task.title?.trim()) return;
    setSaving(true);
    const payload = {
      title: modal.task.title,
      description: modal.task.description || null,
      status: modal.task.status,
      type: modal.task.type,
      priority: modal.task.priority,
      owner_id: modal.task.owner_id || null,
      due_date: modal.task.due_date || null,
    };
    if (modal.isNew) {
      const { data } = await supabase.from("tasks")
        .insert(payload)
        .select("*, profile:profiles!tasks_owner_id_fkey(*)")
        .single();
      if (data) {
        const taskId = (data as Task).id;
        const ops: PromiseLike<unknown>[] = [];
        if (modalSubtasks.length > 0) {
          ops.push(supabase.from("task_subtasks").insert(
            modalSubtasks.map((s, i) => ({ task_id: taskId, title: s.title, completed: false, order_index: i }))
          ));
        }
        if (modalAssignees.length > 0) {
          ops.push(supabase.from("task_assignees").insert(
            modalAssignees.map(a => ({ task_id: taskId, profile_id: a.profile_id }))
          ));
        }
        if (ops.length > 0) await Promise.all(ops);
      }
    } else {
      await supabase.from("tasks").update(payload).eq("id", modal.task.id!);
    }
    await load();
    setSaving(false);
    closeModal();
  }

  // ── Delete ────────────────────────────────────────────────────────────────

  async function deleteTask(id: string) {
    if (!confirm("Delete this task?")) return;
    setTasks(prev => prev.filter(t => t.id !== id));
    await supabase.from("tasks").delete().eq("id", id);
  }

  // ── Subtasks ──────────────────────────────────────────────────────────────

  async function addSubtask() {
    if (!newSubtask.trim()) return;
    if (modal.isNew) {
      setModalSubtasks(prev => [...prev, {
        id: crypto.randomUUID(), task_id: "", title: newSubtask.trim(),
        completed: false, order_index: prev.length, created_at: new Date().toISOString(),
      }]);
      setNewSubtask("");
      return;
    }
    setAddingSubtask(true);
    const { data } = await supabase.from("task_subtasks").insert({
      task_id: modal.task.id!,
      title: newSubtask.trim(),
      completed: false,
      order_index: modalSubtasks.length,
    }).select("*").single();
    if (data) {
      setModalSubtasks(prev => [...prev, data as TaskSubtask]);
      setTasks(prev => prev.map(t =>
        t.id === modal.task.id ? { ...t, subtasks: [...(t.subtasks ?? []), data as TaskSubtask] } : t
      ));
    }
    setNewSubtask("");
    setAddingSubtask(false);
  }

  async function toggleSubtask(s: TaskSubtask) {
    const updated = { ...s, completed: !s.completed };
    setModalSubtasks(prev => prev.map(x => x.id === s.id ? updated : x));
    setTasks(prev => prev.map(t =>
      t.id === s.task_id ? { ...t, subtasks: (t.subtasks ?? []).map(x => x.id === s.id ? updated : x) } : t
    ));
    if (s.task_id) await supabase.from("task_subtasks").update({ completed: updated.completed }).eq("id", s.id);
  }

  async function removeSubtask(s: TaskSubtask) {
    setModalSubtasks(prev => prev.filter(x => x.id !== s.id));
    setTasks(prev => prev.map(t =>
      t.id === s.task_id ? { ...t, subtasks: (t.subtasks ?? []).filter(x => x.id !== s.id) } : t
    ));
    if (s.task_id) await supabase.from("task_subtasks").delete().eq("id", s.id);
  }

  async function toggleAssignee(p: Profile) {
    const taskId = modal.task.id;
    const already = modalAssignees.some(a => a.profile_id === p.id);
    if (modal.isNew) {
      // manage locally until save
      setModalAssignees(prev =>
        already ? prev.filter(a => a.profile_id !== p.id)
                : [...prev, { task_id: "", profile_id: p.id, profile: p }]
      );
      return;
    }
    if (already) {
      setModalAssignees(prev => prev.filter(a => a.profile_id !== p.id));
      setTasks(prev => prev.map(t =>
        t.id === taskId ? { ...t, assignees: (t.assignees ?? []).filter(a => a.profile_id !== p.id) } : t
      ));
      await supabase.from("task_assignees").delete().eq("task_id", taskId!).eq("profile_id", p.id);
    } else {
      const newAssignee: TaskAssignee = { task_id: taskId!, profile_id: p.id, profile: p };
      setModalAssignees(prev => [...prev, newAssignee]);
      setTasks(prev => prev.map(t =>
        t.id === taskId ? { ...t, assignees: [...(t.assignees ?? []), newAssignee] } : t
      ));
      await supabase.from("task_assignees").insert({ task_id: taskId!, profile_id: p.id });
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  const filtered = filter === "all" ? tasks : tasks.filter(t => t.type === filter);
  const inProgressCount = tasks.filter(t => t.status === "in_progress").length;

  return (
    <AMCShell profile={profile}>
      <div style={{ padding: "2rem 2rem 2rem 2.5rem" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
          <div>
            <h1 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#fdf2e1", margin: 0, fontFamily: "Playfair Display, Georgia, serif" }}>Pipeline</h1>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.75rem", marginTop: "0.2rem" }}>
              Production board ·{" "}
              <span style={{ color: inProgressCount >= 3 ? "#e07070" : "#47ae70" }}>{inProgressCount}/3</span> in progress
            </p>
          </div>
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <select value={filter} onChange={e => setFilter(e.target.value as TaskType | "all")}
              style={{ background: "#0d0a1a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, color: "rgba(255,255,255,0.6)", fontSize: "0.75rem", padding: "0.4rem 0.75rem", outline: "none" }}>
              <option value="all">All types</option>
              {(Object.keys(TYPE_LABELS) as TaskType[]).map(t => (
                <option key={t} value={t}>{TYPE_LABELS[t]}</option>
              ))}
            </select>
            <button onClick={() => openModal(blank(), true)}
              style={{ background: "#d56047", border: "none", borderRadius: 6, color: "#07050f", fontWeight: 700, fontSize: "0.75rem", padding: "0.5rem 1.2rem", cursor: "pointer", letterSpacing: "0.05em" }}>
              + New Task
            </button>
          </div>
        </div>

        {/* Board */}
        {loading ? <Spinner /> : (
          <div style={{ overflowX: "auto", paddingBottom: "1rem" }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: `repeat(${COLUMNS.length}, minmax(170px, 1fr))`,
              gap: "0.75rem",
              alignItems: "start",
              minWidth: COLUMNS.length * 178,
            }}>
              {COLUMNS.map(col => {
                const colTasks = filtered.filter(t => t.status === col.key);
                const warn = col.key === "in_progress" && inProgressCount >= 3;
                return (
                  <div key={col.key}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", marginBottom: "0.65rem", padding: "0 0.2rem" }}>
                      <div style={{ width: 7, height: 7, borderRadius: "50%", background: col.color, flexShrink: 0 }} />
                      <span style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)" }}>{col.label}</span>
                      <span style={{ fontSize: "0.62rem", color: warn ? "#e07070" : "rgba(255,255,255,0.2)", marginLeft: "auto" }}>
                        {colTasks.length}{col.key === "in_progress" ? "/3" : ""}
                      </span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem", minHeight: 60 }}>
                      {colTasks.map(task => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          columns={COLUMNS}
                          currentCol={col.key}
                          onEdit={() => openModal({ ...task }, false)}
                          onMove={moveTask}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {modal.open && (
        <Modal title={modal.isNew ? "New Task" : "Edit Task"} onClose={closeModal}>
          <Field label="Title">
            <Input value={modal.task.title ?? ""} onChange={v => setModal(m => ({ ...m, task: { ...m.task, title: v } }))} />
          </Field>
          <Field label="Description">
            <Textarea value={modal.task.description ?? ""} onChange={v => setModal(m => ({ ...m, task: { ...m.task, description: v } }))} />
          </Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <Field label="Status">
              <Select value={modal.task.status ?? "backlog"} onChange={v => setModal(m => ({ ...m, task: { ...m.task, status: v as TaskStatus } }))}>
                {COLUMNS.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
              </Select>
            </Field>
            <Field label="Type">
              <Select value={modal.task.type ?? "yt"} onChange={v => setModal(m => ({ ...m, task: { ...m.task, type: v as TaskType } }))}>
                {(Object.keys(TYPE_LABELS) as TaskType[]).map(t => (
                  <option key={t} value={t}>{TYPE_LABELS[t]}</option>
                ))}
              </Select>
            </Field>
            <Field label="Priority">
              <Select value={modal.task.priority ?? "high"} onChange={v => setModal(m => ({ ...m, task: { ...m.task, priority: v as TaskPriority } }))}>
                <option value="high">P1 — High</option>
                <option value="medium">P2 — Medium</option>
                <option value="low">P3 — Low</option>
              </Select>
            </Field>
            <Field label="Owner">
              <Select value={modal.task.owner_id ?? ""} onChange={v => setModal(m => ({ ...m, task: { ...m.task, owner_id: v || null } }))}>
                <option value="">Unassigned</option>
                {profiles.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </Select>
            </Field>
          </div>
          <Field label="Due Date">
            <Input type="date" value={modal.task.due_date ?? ""} onChange={v => setModal(m => ({ ...m, task: { ...m.task, due_date: v || null } }))} />
          </Field>

          {/* Assignees */}
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", fontSize: "0.65rem", color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
              Working On This
            </label>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {profiles.map(p => {
                const active = modalAssignees.some(a => a.profile_id === p.id);
                return (
                  <button key={p.id} type="button" onClick={() => toggleAssignee(p)}
                    style={{ display: "flex", alignItems: "center", gap: "0.45rem", padding: "0.35rem 0.7rem", borderRadius: 20, border: `1.5px solid ${active ? p.avatar_color : "rgba(255,255,255,0.1)"}`, background: active ? p.avatar_color + "22" : "transparent", cursor: "pointer", transition: "all 150ms" }}>
                    <div style={{ width: 18, height: 18, borderRadius: "50%", background: p.avatar_color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.48rem", fontWeight: 700, color: "#07050f", flexShrink: 0 }}>
                      {p.name.slice(0, 2).toUpperCase()}
                    </div>
                    <span style={{ fontSize: "0.75rem", color: active ? "#fdf2e1" : "rgba(255,255,255,0.4)", fontWeight: active ? 600 : 400 }}>{p.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Checklist */}
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", fontSize: "0.65rem", color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
              Checklist {modalSubtasks.length > 0 && `· ${modalSubtasks.filter(s => s.completed).length}/${modalSubtasks.length}`}
            </label>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", marginBottom: "0.5rem" }}>
              {modalSubtasks.length === 0 && (
                <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.2)" }}>No items yet</div>
              )}
              {modalSubtasks.map(s => (
                <div key={s.id} style={{ display: "flex", alignItems: "center", gap: "0.6rem", background: "rgba(255,255,255,0.02)", borderRadius: 5, padding: "0.35rem 0.5rem" }}>
                  <button type="button" onClick={() => toggleSubtask(s)}
                    style={{ width: 16, height: 16, borderRadius: 3, border: `1.5px solid ${s.completed ? "#47ae70" : "rgba(255,255,255,0.2)"}`, background: s.completed ? "#47ae70" : "transparent", cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {s.completed && <span style={{ color: "#07050f", fontSize: "0.55rem", fontWeight: 900, lineHeight: 1 }}>✓</span>}
                  </button>
                  <span style={{ flex: 1, fontSize: "0.78rem", color: s.completed ? "rgba(255,255,255,0.3)" : "#fdf2e1", textDecoration: s.completed ? "line-through" : "none" }}>{s.title}</span>
                  <button type="button" onClick={() => removeSubtask(s)}
                    style={{ background: "none", border: "none", color: "rgba(255,255,255,0.2)", cursor: "pointer", fontSize: "0.75rem", padding: "0 0.2rem", lineHeight: 1 }}>✕</button>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input
                value={newSubtask}
                onChange={e => setNewSubtask(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addSubtask(); } }}
                placeholder="Add checklist item…"
                style={{ ...inputStyle, flex: 1 }}
              />
              <button type="button" onClick={addSubtask} disabled={addingSubtask || !newSubtask.trim()}
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, color: "rgba(255,255,255,0.5)", fontSize: "0.75rem", padding: "0.4rem 0.75rem", cursor: "pointer", opacity: !newSubtask.trim() ? 0.4 : 1 }}>
                Add
              </button>
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem", justifyContent: "space-between" }}>
            {!modal.isNew && (
              <button onClick={() => { deleteTask(modal.task.id!); closeModal(); }}
                style={{ ...btnStyle, background: "rgba(174,70,65,0.15)", color: "#e07070" }}>Delete</button>
            )}
            <div style={{ display: "flex", gap: "0.75rem", marginLeft: "auto" }}>
              <button onClick={closeModal} style={{ ...btnStyle, background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)" }}>Cancel</button>
              <button onClick={saveTask} disabled={saving}
                style={{ ...btnStyle, background: "#d56047", color: "#07050f", fontWeight: 700 }}>{saving ? "Saving…" : "Save"}</button>
            </div>
          </div>
        </Modal>
      )}
    </AMCShell>
  );
}

// ── TaskCard ──────────────────────────────────────────────────────────────────

function TaskCard({ task, columns, currentCol, onEdit, onMove }: {
  task: Task;
  columns: typeof COLUMNS;
  currentCol: TaskStatus;
  onEdit: () => void;
  onMove: (id: string, status: TaskStatus) => void;
}) {
  const [bg, fg] = TYPE_COLORS[task.type] ?? ["rgba(255,255,255,0.08)", "rgba(255,255,255,0.4)"];
  const subtasks = task.subtasks ?? [];
  const doneCount = subtasks.filter(s => s.completed).length;

  return (
    <div onClick={onEdit}
      style={{ background: "#0d0a1a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, padding: "0.8rem 0.85rem", cursor: "pointer" }}>
      <div style={{ fontSize: "0.8rem", color: "#fdf2e1", fontWeight: 500, lineHeight: 1.35, marginBottom: "0.45rem" }}>{task.title}</div>
      <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ fontSize: "0.57rem", padding: "0.1rem 0.4rem", borderRadius: 3, background: bg, color: fg, letterSpacing: "0.05em", textTransform: "uppercase" }}>{TYPE_LABELS[task.type]}</span>
        <span style={{ fontSize: "0.58rem", color: PRIORITY_COLORS[task.priority], fontWeight: 600 }}>{PRIORITY_LABELS[task.priority]}</span>
        {subtasks.length > 0 && (
          <span style={{ fontSize: "0.58rem", color: doneCount === subtasks.length ? "#47ae70" : "rgba(255,255,255,0.3)", marginLeft: "auto" }}>
            {doneCount}/{subtasks.length} ✓
          </span>
        )}
      </div>
      {(task.assignees ?? []).length > 0 && (
        <div style={{ display: "flex", gap: "0.2rem", marginTop: "0.4rem", flexWrap: "wrap" }}>
          {(task.assignees ?? []).map(a => (
            <div key={a.profile_id} title={a.profile.name}
              style={{ width: 20, height: 20, borderRadius: "50%", background: a.profile.avatar_color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.48rem", fontWeight: 700, color: "#07050f" }}>
              {a.profile.name.slice(0, 2).toUpperCase()}
            </div>
          ))}
        </div>
      )}
      <div style={{ display: "flex", gap: "0.2rem", marginTop: "0.5rem", flexWrap: "wrap" }} onClick={e => e.stopPropagation()}>
        {columns.filter(c => c.key !== currentCol).map(c => (
          <button key={c.key} onClick={() => onMove(task.id, c.key)}
            title={`Move to ${c.label}`}
            style={{ fontSize: "0.52rem", padding: "0.12rem 0.35rem", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 3, color: "rgba(255,255,255,0.35)", cursor: "pointer" }}>
            → {c.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Shared UI helpers ─────────────────────────────────────────────────────────

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
      <div style={{ background: "#0d0a1a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "1.75rem", width: "100%", maxWidth: 500, maxHeight: "90vh", overflow: "auto" }} onClick={e => e.stopPropagation()}>
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
