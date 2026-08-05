import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { createServiceClient } from "@/lib/supabase/service";
import type { Profile } from "@/types/amc";

const TIMEZONE = "America/New_York";

// Vercel Hobby plan only allows cron jobs to fire once per day, so this route
// is scheduled directly at a fixed UTC time (see vercel.json) rather than
// running hourly and self-checking for 5pm ET — which means the actual local
// send time drifts by ~1hr across the twice-yearly DST change.

function localDateString(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TIMEZONE }).format(new Date()); // en-CA gives YYYY-MM-DD
}

export async function GET(request: Request) {
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient();
  const today = localDateString();

  const [profilesRes, checkInsRes] = await Promise.all([
    supabase.from("profiles").select("*"),
    supabase.from("check_ins").select("user_id").eq("date", today),
  ]);

  const profiles = (profilesRes.data ?? []) as Profile[];
  const alreadyCheckedIn = new Set((checkInsRes.data ?? []).map(c => c.user_id as string));

  const sent: string[] = [];
  const skipped: string[] = [];

  for (const profile of profiles) {
    if (alreadyCheckedIn.has(profile.id)) {
      skipped.push(profile.name);
      continue;
    }
    if (!profile.email) {
      skipped.push(`${profile.name} (no email on file)`);
      continue;
    }

    const token = randomBytes(24).toString("base64url");
    const expiresAt = new Date(Date.now() + 32 * 60 * 60 * 1000).toISOString();

    const { error: tokenError } = await supabase
      .from("checkin_tokens")
      .upsert(
        { token, profile_id: profile.id, date: today, expires_at: expiresAt },
        { onConflict: "profile_id,date" }
      );

    if (tokenError) {
      skipped.push(`${profile.name} (token error)`);
      continue;
    }

    const link = `${process.env.NEXT_PUBLIC_SITE_URL}/amc/daily/${token}`;

    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "BladeBound AMC <onboarding@resend.dev>",
          to: [profile.email],
          subject: `What did you get done today, ${profile.name}?`,
          text: `Quick 60-second update: ${link}\n\nNo login needed — tap the link, update your tasks, done.`,
        }),
      });
      sent.push(profile.name);
    } catch {
      skipped.push(`${profile.name} (email failed)`);
    }
  }

  return NextResponse.json({ sent, skipped });
}
