import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  let body: { name?: string; discord?: string; youtube?: string; email?: string; zip?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const name = body.name?.trim() ?? "";
  const discord = body.discord?.trim() ?? "";
  const youtube = body.youtube?.trim() ?? "";
  const email = body.email?.trim().toLowerCase() ?? "";
  const zip = body.zip?.trim() ?? "";

  if (!name || !discord || !email || !zip || !email.includes("@")) {
    return NextResponse.json({ error: "Name, Discord, email, and zip code are required" }, { status: 400 });
  }
  if (name.length > 200 || discord.length > 100 || youtube.length > 200 || email.length > 320 || zip.length > 20) {
    return NextResponse.json({ error: "One of the fields is too long" }, { status: 400 });
  }

  const supabase = await createClient();
  const { error } = await supabase.from("giveaway_entries").insert({
    name,
    discord,
    youtube: youtube || null,
    email,
    zip_code: zip,
  });

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "duplicate" }, { status: 409 });
    }
    return NextResponse.json({ error: "Could not save your entry" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
