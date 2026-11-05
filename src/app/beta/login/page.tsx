"use client";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { isolatedBetaUrl } from "@/lib/beta/config";

export default function BetaLogin() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function signIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError("");
    const url = process.env.NEXT_PUBLIC_BETA_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_BETA_SUPABASE_ANON_KEY;
    if (!url || !key || !isolatedBetaUrl(url, process.env.NEXT_PUBLIC_SUPABASE_URL)) { setError("Beta access is not configured."); setBusy(false); return; }
    const form = new FormData(event.currentTarget);
    const client = createBrowserClient(url, key);
    const result = await client.auth.signInWithPassword({ email: String(form.get("email")), password: String(form.get("password")) });
    if (result.error) { setError("Unable to sign in. Check your details or contact the beta owner."); setBusy(false); return; }
    router.replace("/beta"); router.refresh();
  }
  return <main><h1 className="text-3xl font-bold">Private beta sign in</h1><p className="mt-4">Access is by invitation. Contact the beta owner if you need help.</p><form onSubmit={signIn} className="mt-8 space-y-4"><label className="block">Email<input className="mt-1 block w-full rounded p-3 text-black" name="email" type="email" required autoComplete="email" /></label><label className="block">Password<input className="mt-1 block w-full rounded p-3 text-black" name="password" type="password" required autoComplete="current-password" /></label><button disabled={busy} className="rounded bg-orange-500 px-4 py-2 text-black">{busy ? "Signing in…" : "Sign in"}</button>{error && <p role="alert">{error}</p>}</form></main>;
}
