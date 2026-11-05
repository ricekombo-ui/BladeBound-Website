import { NextResponse } from "next/server";
import { betaMember } from "@/lib/beta/supabase";

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (Number(request.headers.get("content-length") || 0) > 16000) return NextResponse.json({ error: "Too large" }, { status: 413 });
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) return NextResponse.json({ error: "Invalid request" }, { status: 415 });
  const member = await betaMember().catch(() => null);
  if (!member) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  let body: unknown;
  try {
    const reader = request.body?.getReader();
    if (!reader) throw new Error("Missing body");
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > 16000) { await reader.cancel(); return NextResponse.json({ error: "Too large" }, { status: 413 }); }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size); let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
    body = JSON.parse(new TextDecoder().decode(bytes));
  } catch { return NextResponse.json({ error: "Invalid request" }, { status: 400 }); }
  const message = typeof body === "object" && body !== null && "message" in body ? (body as { message?: unknown }).message : null;
  if (typeof message !== "string" || !message.trim() || message.length > 3000) return NextResponse.json({ error: "Invalid message" }, { status: 400 });
  const { error } = await member.client.from("beta_feedback").insert({ user_id: member.user.id, message: message.trim() });
  return error ? NextResponse.json({ error: "Unable to save" }, { status: 429 }) : NextResponse.json({ ok: true });
}
