import { createServiceClient } from "@/lib/supabase/service";
import type { Profile, Task, CheckIn } from "@/types/amc";
import DailyCheckinForm from "./DailyCheckinForm";

export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false } };

function ExpiredState({ message }: { message: string }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", background: "#07050f" }}>
      <div style={{ textAlign: "center", maxWidth: 360 }}>
        <p style={{ color: "#fdf2e1", fontSize: "1rem", marginBottom: "0.5rem", fontFamily: "Playfair Display, Georgia, serif" }}>{message}</p>
        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.8rem" }}>
          Use the full dashboard at <a href="/amc/login" style={{ color: "#d56047" }}>/amc/login</a> instead.
        </p>
      </div>
    </div>
  );
}

export default async function DailyCheckinPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const supabase = createServiceClient();

  const { data: tokenRow } = await supabase
    .from("checkin_tokens")
    .select("*")
    .eq("token", token)
    .single();

  if (!tokenRow) {
    return <ExpiredState message="This link is invalid." />;
  }
  if (new Date(tokenRow.expires_at) < new Date()) {
    return <ExpiredState message="This link has expired." />;
  }

  const { data: profileRow } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", tokenRow.profile_id)
    .single();
  const profile = profileRow as Profile | null;
  if (!profile) {
    return <ExpiredState message="This link is invalid." />;
  }

  const IN_FLIGHT = ["backlog", "ready", "in_progress", "review"];

  const [ownedRes, assignedRes, checkInRes] = await Promise.all([
    supabase
      .from("tasks")
      .select("*, subtasks:task_subtasks(*)")
      .eq("owner_id", profile.id)
      .in("status", IN_FLIGHT),
    supabase
      .from("task_assignees")
      .select("task:tasks(*, subtasks:task_subtasks(*))")
      .eq("profile_id", profile.id),
    supabase
      .from("check_ins")
      .select("*")
      .eq("user_id", profile.id)
      .eq("date", tokenRow.date)
      .maybeSingle(),
  ]);

  const owned = (ownedRes.data ?? []) as Task[];
  const assignedTasks = ((assignedRes.data ?? []) as unknown as { task: Task }[])
    .map(r => r.task)
    .filter(t => t && IN_FLIGHT.includes(t.status));

  const byId = new Map<string, Task>();
  for (const t of [...owned, ...assignedTasks]) byId.set(t.id, t);
  const tasks = Array.from(byId.values()).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const existingCheckIn = checkInRes.data as CheckIn | null;

  return (
    <DailyCheckinForm
      token={token}
      profile={profile}
      tasks={tasks}
      existingCheckIn={existingCheckIn}
    />
  );
}
