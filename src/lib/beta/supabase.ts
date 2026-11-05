import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { isolatedBetaUrl } from "./config";

// Deliberately separate from the AMC Supabase project and its cookies.
export async function betaClient() {
  const url = process.env.NEXT_PUBLIC_BETA_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_BETA_SUPABASE_ANON_KEY;
  if (!url || !key || !isolatedBetaUrl(url, process.env.NEXT_PUBLIC_SUPABASE_URL)) throw new Error("Isolated beta project is not configured");
  const store = await cookies();
  return createServerClient(url, key, { cookies: {
    getAll: () => store.getAll(),
    setAll: (values) => { try { values.forEach(({ name, value, options }) => store.set(name, value, options)); } catch { /* refreshed in middleware */ } },
  } });
}

export async function betaMember() {
  const client = await betaClient();
  const { data: { user }, error } = await client.auth.getUser();
  if (error || !user) return null;
  const { data } = await client.from("beta_members").select("user_id").eq("user_id", user.id).maybeSingle();
  return data ? { client, user } : null;
}
