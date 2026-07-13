"use client";

import { useState } from "react";
import type { Profile, Task, TaskStatus, CheckIn } from "@/types/amc";
import { COLUMNS, TYPE_COLORS, TYPE_LABELS, PRIORITY_COLORS, PRIORITY_LABELS } from "@/lib/amc/constants";

const ENERGY_LABELS = ["", "💀 Drained", "😔 Low", "😐 Okay", "😊 Good", "⚡ Energized"];

const baseInput: React.CSSProperties = {
  width: "100%", padding: "0.6rem 0.75rem",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 6, color: "#fdf2e1", fontSize: "0.85rem",
  outline: "none", boxSizing: "border-box",
};

export default function DailyCheckinForm({
  token,
  profile,
  tasks,
  existingCheckIn,
}: {
  token: string;
  profile: Profile;
  tasks: Task[];
  existingCheckIn: CheckIn | null;
}) {
  const [statusByTask, setStatusByTask] = useState<Record<string, TaskStatus>>(
    Object.fromEntries(tasks.map(t => [t.id, t.status]))
  );
  const [subtaskDone, setSubtaskDone] = useState<Record<string, boolean>>(
    Object.fromEntries(tasks.flatMap(t => (t.subtasks ?? []).map(s => [s.id, s.completed])))
  );
  const [energy, setEnergy] = useState(existingCheckIn?.energy ?? 3);
  const [wins, setWins] = useState(existingCheckIn?.wins ?? "");
  const [blockers, setBlockers] = useState(existingCheckIn?.blockers ?? "");
  const [plan, setPlan] = useState(existingCheckIn?.plan ?? "");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/amc/daily-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          taskUpdates: tasks
            .filter(t => statusByTask[t.id] !== t.status)
            .map(t => ({ taskId: t.id, status: statusByTask[t.id] })),
          subtaskUpdates: tasks
            .flatMap(t => t.subtasks ?? [])
            .filter(s => subtaskDone[s.id] !== s.completed)
            .map(s => ({ subtaskId: s.id, completed: subtaskDone[s.id] })),
          checkIn: { energy, wins: wins.trim(), blockers: blockers.trim(), plan: plan.trim() },
        }),
      });
      if (!res.ok) throw new Error();
      setDone(true);
    } catch {
      setError("Something went wrong — try again in a moment.");
    } finally {
      setSaving(false);
    }
  }

  if (done) {
    return (
      <Shell>
        <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
          <p style={{ fontSize: "1.4rem", marginBottom: "0.5rem" }}>✅</p>
          <p style={{ color: "#fdf2e1", fontSize: "1rem", fontFamily: "Playfair Display, Georgia, serif" }}>
            Thanks, {profile.name} — see you tomorrow.
          </p>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <h1 style={{ fontSize: "1.2rem", color: "#fdf2e1", fontFamily: "Playfair Display, Georgia, serif", margin: "0 0 0.25rem" }}>
        Hey {profile.name}, what did you get done today?
      </h1>
      <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.78rem", marginBottom: "1.5rem" }}>
        Quick 60-second update — tap what changed, nothing else required.
      </p>

      <form onSubmit={handleSubmit}>
        {tasks.length > 0 && (
          <div style={{ marginBottom: "1.5rem" }}>
            <SectionLabel>Your Tasks</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {tasks.map(task => (
                <TaskRow
                  key={task.id}
                  task={task}
                  status={statusByTask[task.id]}
                  onStatusChange={s => setStatusByTask(prev => ({ ...prev, [task.id]: s }))}
                  subtaskDone={subtaskDone}
                  onToggleSubtask={id => setSubtaskDone(prev => ({ ...prev, [id]: !prev[id] }))}
                />
              ))}
            </div>
          </div>
        )}

        <div style={{ marginBottom: "1.5rem" }}>
          <SectionLabel>Daily Check-in</SectionLabel>
          <div style={{ background: "#0d0a1a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "1.1rem" }}>
            <Field label="Energy Level">
              <div style={{ display: "flex", gap: "0.4rem", marginTop: "0.25rem" }}>
                {[1, 2, 3, 4, 5].map(v => (
                  <button key={v} type="button" onClick={() => setEnergy(v)}
                    style={{ flex: 1, padding: "0.5rem 0", background: energy === v ? "#d56047" : "rgba(255,255,255,0.05)", border: `1px solid ${energy === v ? "#d56047" : "rgba(255,255,255,0.1)"}`, borderRadius: 6, color: energy === v ? "#07050f" : "rgba(255,255,255,0.5)", fontSize: "0.8rem", fontWeight: energy === v ? 700 : 400, cursor: "pointer" }}>
                    {v}
                  </button>
                ))}
              </div>
              {energy > 0 && <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.3)", marginTop: "0.4rem" }}>{ENERGY_LABELS[energy]}</div>}
            </Field>
            <Field label="Wins">
              <textarea value={wins} onChange={e => setWins(e.target.value)} placeholder="What went well?" rows={2} style={{ ...baseInput, resize: "vertical" }} />
            </Field>
            <Field label="Blockers">
              <textarea value={blockers} onChange={e => setBlockers(e.target.value)} placeholder="Anything in your way?" rows={2} style={{ ...baseInput, resize: "vertical" }} />
            </Field>
            <Field label="Plan for Tomorrow">
              <textarea value={plan} onChange={e => setPlan(e.target.value)} placeholder="Optional" rows={2} style={{ ...baseInput, resize: "vertical" }} />
            </Field>
          </div>
        </div>

        {error && <p style={{ color: "#e07070", fontSize: "0.8rem", marginBottom: "1rem" }}>{error}</p>}

        <button type="submit" disabled={saving}
          style={{ width: "100%", background: "#d56047", border: "none", borderRadius: 8, color: "#07050f", fontWeight: 700, fontSize: "0.9rem", padding: "0.85rem", cursor: "pointer", opacity: saving ? 0.6 : 1 }}>
          {saving ? "Saving…" : "Submit"}
        </button>
      </form>
    </Shell>
  );
}

function TaskRow({ task, status, onStatusChange, subtaskDone, onToggleSubtask }: {
  task: Task;
  status: TaskStatus;
  onStatusChange: (s: TaskStatus) => void;
  subtaskDone: Record<string, boolean>;
  onToggleSubtask: (id: string) => void;
}) {
  const [bg, fg] = TYPE_COLORS[task.type] ?? ["rgba(255,255,255,0.08)", "rgba(255,255,255,0.4)"];
  const subtasks = task.subtasks ?? [];

  return (
    <div style={{ background: "#0d0a1a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "0.9rem" }}>
      <div style={{ fontSize: "0.85rem", color: "#fdf2e1", fontWeight: 500, marginBottom: "0.4rem" }}>{task.title}</div>
      <div style={{ display: "flex", gap: "0.35rem", marginBottom: "0.65rem" }}>
        <span style={{ fontSize: "0.58rem", padding: "0.1rem 0.4rem", borderRadius: 3, background: bg, color: fg, letterSpacing: "0.05em", textTransform: "uppercase" }}>{TYPE_LABELS[task.type]}</span>
        <span style={{ fontSize: "0.58rem", color: PRIORITY_COLORS[task.priority], fontWeight: 600 }}>{PRIORITY_LABELS[task.priority]}</span>
      </div>

      <select value={status} onChange={e => onStatusChange(e.target.value as TaskStatus)}
        style={{ ...baseInput, cursor: "pointer", marginBottom: subtasks.length > 0 ? "0.65rem" : 0 }}>
        {COLUMNS.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
      </select>

      {subtasks.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
          {subtasks.map(s => {
            const checked = subtaskDone[s.id] ?? s.completed;
            return (
              <button key={s.id} type="button" onClick={() => onToggleSubtask(s.id)}
                style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "rgba(255,255,255,0.02)", border: "none", borderRadius: 5, padding: "0.4rem 0.5rem", cursor: "pointer", textAlign: "left" }}>
                <span style={{ width: 16, height: 16, borderRadius: 3, border: `1.5px solid ${checked ? "#47ae70" : "rgba(255,255,255,0.2)"}`, background: checked ? "#47ae70" : "transparent", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {checked && <span style={{ color: "#07050f", fontSize: "0.55rem", fontWeight: 900 }}>✓</span>}
                </span>
                <span style={{ fontSize: "0.78rem", color: checked ? "rgba(255,255,255,0.3)" : "#fdf2e1", textDecoration: checked ? "line-through" : "none" }}>{s.title}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", background: "#07050f", padding: "2rem 1.25rem" }}>
      <div style={{ maxWidth: 480, margin: "0 auto" }}>{children}</div>
    </div>
  );
}

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
