import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

export async function POST(request: Request) {
  if (request.headers.get("origin") !== new URL(request.url).origin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) return NextResponse.json({ error: "Invalid request" }, { status: 415 });
  try {
    const reader = request.body?.getReader();
    if (!reader) return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    const chunks: Uint8Array[] = []; let length = 0;
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      length += value.length;
      if (length > 64000) { await reader.cancel(); return NextResponse.json({ error: "Request too large" }, { status: 413 }); }
      chunks.push(value);
    }
    const bytes = new Uint8Array(length); let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
    const body: unknown = JSON.parse(new TextDecoder().decode(bytes));
    if (!body || typeof body !== "object") return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    const input = body as Record<string, unknown>;
    if (typeof input.token !== "string" || !Array.isArray(input.taskUpdates) || !Array.isArray(input.subtaskUpdates) || !input.checkIn || typeof input.checkIn !== "object") return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    const { error } = await createServiceClient().rpc("submit_daily_checkin", { p_token: input.token, p_tasks: input.taskUpdates, p_subtasks: input.subtaskUpdates, p_checkin: input.checkIn });
    if (error) return NextResponse.json({ error: "Unable to complete check-in. The link may have expired or already been used." }, { status: 400 });
    return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Unable to complete check-in." }, { status: 400 });
  }
}
