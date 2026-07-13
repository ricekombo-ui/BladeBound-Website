import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import type { TaskStatus } from "@/types/amc";

interface Body {
  token: string;
  taskUpdates: { taskId: string; status: TaskStatus }[];
  subtaskUpdates: { subtaskId: string; completed: boolean }[];
  checkIn: { energy: number; wins: string; blockers: string; plan: string };
}

export async function POST(request: Request) {
  let body: Body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!body.token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  const supabase = createServiceClient();

  const { data: tokenRow } = await supabase
    .from("checkin_tokens")
    .select("*")
    .eq("token", body.token)
    .single();

  if (!tokenRow) {
    return NextResponse.json({ error: "Invalid link" }, { status: 404 });
  }
  if (new Date(tokenRow.expires_at) < new Date()) {
    return NextResponse.json({ error: "This link has expired" }, { status: 410 });
  }

  const profileId = tokenRow.profile_id as string;

  await Promise.all([
    ...(body.taskUpdates ?? []).map(u =>
      supabase.from("tasks").update({ status: u.status }).eq("id", u.taskId)
    ),
    ...(body.subtaskUpdates ?? []).map(u =>
      supabase.from("task_subtasks").update({ completed: u.completed }).eq("id", u.subtaskId)
    ),
  ]);

  if (body.checkIn) {
    const { energy, wins, blockers, plan } = body.checkIn;
    const { data: existing } = await supabase
      .from("check_ins")
      .select("id")
      .eq("user_id", profileId)
      .eq("date", tokenRow.date)
      .maybeSingle();

    const payload = {
      user_id: profileId,
      date: tokenRow.date,
      energy,
      wins: wins || null,
      blockers: blockers || null,
      plan: plan || null,
    };

    if (existing) {
      await supabase.from("check_ins").update(payload).eq("id", existing.id);
    } else {
      await supabase.from("check_ins").insert(payload);
    }
  }

  await supabase.from("checkin_tokens").update({ used_at: new Date().toISOString() }).eq("id", tokenRow.id);

  return NextResponse.json({ ok: true });
}
