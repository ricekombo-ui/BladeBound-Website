import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const SUBJECT_LABELS: Record<string, string> = {
  collaboration: "Collaboration or Partnership",
  media: "Media or Press Inquiry",
  "private-game": "Private Game Request",
  general: "General Question",
  other: "Other",
};

export async function POST(request: Request) {
  let body: { name?: string; email?: string; subject?: string; message?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const name = body.name?.trim() ?? "";
  const email = body.email?.trim().toLowerCase() ?? "";
  const subject = body.subject?.trim() ?? "";
  const message = body.message?.trim() ?? "";

  if (!name || !email || !subject || !message || !email.includes("@")) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }
  if (name.length > 200 || email.length > 320 || message.length > 5000) {
    return NextResponse.json({ error: "Message too long" }, { status: 400 });
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("contact_messages")
    .insert({ name, email, subject, message });

  if (error) {
    return NextResponse.json({ error: "Could not save your message" }, { status: 500 });
  }

  // Best-effort email notification — the Supabase row is the source of truth,
  // so a failure here must not fail the request.
  if (process.env.RESEND_API_KEY) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "BladeBound Contact <onboarding@resend.dev>",
          to: ["hello@bladebound.games"],
          reply_to: email,
          subject: `[Site Contact] ${SUBJECT_LABELS[subject] ?? subject} — ${name}`,
          text: `From: ${name} <${email}>\nTopic: ${SUBJECT_LABELS[subject] ?? subject}\n\n${message}`,
        }),
      });
    } catch {
      // ignore — message is already stored
    }
  }

  return NextResponse.json({ ok: true });
}
