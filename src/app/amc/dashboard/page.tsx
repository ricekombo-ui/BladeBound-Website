import { createClient } from "@/lib/supabase/server";
import AMCShell from "@/components/amc/AMCShell";
import type { Profile, Task, Goal, CheckIn } from "@/types/amc";
import { redirect } from "next/navigation";

const STATUS_COLOR: Record<string, string> = {
  backlog: "rgba(255,255,255,0.2)",
  in_progress: "#d56047",
  review: "#ae8c41",
  done: "#47ae70",
};

const PRIORITY_COLOR: Record<string, string> = {
  high: "#e07070",
  medium: "#ae8c41",
  low: "rgba(255,255,255,0.25)",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/amc/login");

  const [profileRes, tasksRes, goalsRes, checkInsRes] = await Promise.all([
    supabase.from("profiles").select("*").eq("user_id", user.id).single(),
    supabase.from("tasks").select("*, profile:profiles!tasks_owner_id_fkey(*)").neq("status", "published").order("created_at", { ascending: false }).limit(6),
    supabase.from("goals").select("*, profile:profiles!goals_owner_id_fkey(*)").eq("status", "active").order("created_at", { ascending: false }),
    supabase.from("check_ins").select("*, profile:profiles!check_ins_user_id_fkey(*)").eq("date", new Date().toISOString().split("T")[0]),
  ]);

  const profile = profileRes.data as Profile | null;
  const tasks = (tasksRes.data ?? []) as Task[];
  const goals = (goalsRes.data ?? []) as Goal[];
  const checkIns = (checkInsRes.data ?? []) as CheckIn[];

  const allProfiles = await supabase.from("profiles").select("*");
  const teamProfiles = (allProfiles.data ?? []) as Profile[];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <AMCShell profile={profile}>
      <div style={{ padding: "2rem 2.5rem", maxWidth: 1100 }}>
        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.3rem" }}>
            {greeting}
          </div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 700, color: "#fdf2e1", margin: 0, fontFamily: "Playfair Display, Georgia, serif" }}>
            {profile?.name ?? "Adventurer"}
          </h1>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.8rem", marginTop: "0.3rem" }}>
            {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
          {[
            { label: "Active Tasks",    value: tasks.filter(t => t.status === "in_progress").length, color: "#d56047" },
            { label: "In Review",       value: tasks.filter(t => t.status === "review").length,      color: "#ae8c41" },
            { label: "Active Goals",    value: goals.length,                                          color: "#6d9eeb" },
            { label: "Checked In Today",value: checkIns.length + " / " + teamProfiles.length,         color: "#47ae70" },
          ].map(stat => (
            <div key={stat.label} style={{
              background: "#0d0a1a", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 10, padding: "1.2rem 1.4rem",
            }}>
              <div style={{ fontSize: "1.6rem", fontWeight: 700, color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.35)", marginTop: "0.25rem", letterSpacing: "0.05em" }}>{stat.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
          {/* Active Tasks */}
          <section>
            <SectionHeader title="Active Pipeline" href="/amc/pipeline" />
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {tasks.length === 0 && <Empty text="No active tasks" />}
              {tasks.map(task => (
                <div key={task.id} style={{
                  background: "#0d0a1a", border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 8, padding: "0.9rem 1rem",
                  display: "flex", alignItems: "flex-start", gap: "0.75rem",
                }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: STATUS_COLOR[task.status], marginTop: 5, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "0.82rem", color: "#fdf2e1", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {task.title}
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.3rem", alignItems: "center" }}>
                      <TypeBadge type={task.type} />
                      <span style={{ fontSize: "0.65rem", color: PRIORITY_COLOR[task.priority] }}>{task.priority}</span>
                      {task.profile && <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.3)" }}>→ {task.profile.name}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Right column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Today's check-ins */}
            <section>
              <SectionHeader title="Today's Check-ins" href="/amc/check-ins" />
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {teamProfiles.map(p => {
                  const ci = checkIns.find(c => c.user_id === p.id);
                  return (
                    <div key={p.id} style={{
                      background: "#0d0a1a", border: "1px solid rgba(255,255,255,0.06)",
                      borderRadius: 8, padding: "0.75rem 1rem",
                      display: "flex", alignItems: "center", gap: "0.75rem",
                    }}>
                      <Avatar profile={p} size={28} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "0.8rem", color: "#fdf2e1", fontWeight: 500 }}>{p.name}</div>
                        {ci ? (
                          <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.35)", marginTop: "0.1rem" }}>
                            Energy {ci.energy}/5 · {ci.plan ? ci.plan.slice(0, 50) + (ci.plan.length > 50 ? "…" : "") : "No plan logged"}
                          </div>
                        ) : (
                          <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.2)", marginTop: "0.1rem" }}>Not checked in</div>
                        )}
                      </div>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: ci ? "#47ae70" : "rgba(255,255,255,0.1)" }} />
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Active Goals */}
            <section>
              <SectionHeader title="Active Goals" href="/amc/goals" />
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {goals.slice(0, 3).map(goal => (
                  <div key={goal.id} style={{
                    background: "#0d0a1a", border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 8, padding: "0.9rem 1rem",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.3rem" }}>
                      <span style={{ fontSize: "0.6rem", padding: "0.15rem 0.5rem", borderRadius: 4, background: goal.type === "long" ? "rgba(109,158,235,0.15)" : "rgba(71,174,112,0.15)", color: goal.type === "long" ? "#6d9eeb" : "#47ae70", letterSpacing: "0.05em", textTransform: "uppercase" as const }}>{goal.type}-term</span>
                      {goal.profile && <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.3)" }}>{goal.profile.name}</span>}
                    </div>
                    <div style={{ fontSize: "0.82rem", color: "#fdf2e1", fontWeight: 500 }}>{goal.title}</div>
                    {goal.progress_note && <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.35)", marginTop: "0.25rem" }}>{goal.progress_note}</div>}
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </AMCShell>
  );
}

function SectionHeader({ title, href }: { title: string; href: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
      <h2 style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", margin: 0 }}>{title}</h2>
      <a href={href} style={{ fontSize: "0.65rem", color: "#d56047", textDecoration: "none" }}>View all →</a>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.2)", padding: "1rem", textAlign: "center" }}>{text}</div>;
}

function Avatar({ profile, size = 32 }: { profile: Profile; size?: number }) {
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: profile.avatar_color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.3 + "px", fontWeight: 700, color: "#07050f", flexShrink: 0 }}>
      {profile.name.slice(0, 2).toUpperCase()}
    </div>
  );
}

function TypeBadge({ type }: { type: string }) {
  const colors: Record<string, [string, string]> = {
    yt:           ["rgba(213,96,71,0.15)",   "#d56047"],
    infographic:  ["rgba(109,158,235,0.15)", "#6d9eeb"],
    frame_design: ["rgba(174,140,65,0.15)",  "#ae8c41"],
    actual_play:  ["rgba(71,174,112,0.15)",  "#47ae70"],
    community:    ["rgba(155,109,235,0.15)", "#9b6deb"],
    admin:        ["rgba(255,255,255,0.08)", "rgba(255,255,255,0.4)"],
    tech:         ["rgba(140,174,65,0.15)",  "#8cae41"],
  };
  const labels: Record<string, string> = {
    yt: "YT", infographic: "Infographic", frame_design: "Frame",
    actual_play: "Actual Play", community: "Community", admin: "Admin", tech: "Tech",
  };
  const [bg, fg] = colors[type] ?? ["rgba(255,255,255,0.08)", "rgba(255,255,255,0.4)"];
  return (
    <span style={{ fontSize: "0.6rem", padding: "0.1rem 0.45rem", borderRadius: 4, background: bg, color: fg, letterSpacing: "0.05em", textTransform: "uppercase" as const }}>
      {labels[type] ?? type}
    </span>
  );
}
