"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function EmailCapture({
  source = "site",
  headline = "Join the Dispatch",
  body = "Daggerheart content drops, free resources, and BladeBound news. No spam — just the good stuff.",
}: {
  source?: string;
  headline?: string;
  body?: string;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !trimmed.includes("@")) return;
    setStatus("saving");
    const supabase = createClient();
    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email: trimmed, source });
    if (error) {
      if (error.code === "23505") {
        // duplicate — treat as success, they're already on the list
        setStatus("done");
        setMessage("You're already on the list — see you in the next dispatch.");
      } else {
        setStatus("error");
        setMessage("Something went wrong. Try again in a moment.");
      }
    } else {
      setStatus("done");
      setMessage("You're in. Watch your inbox.");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-lg bg-ember/10 border border-ember/30 p-6 text-center">
        <p className="text-bone font-serif text-lg mb-1">⚔ Welcome to the Dispatch</p>
        <p className="text-stone text-sm">{message}</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-shadow/10 border border-white/5 p-6 md:p-8">
      <h3 className="font-serif text-xl md:text-2xl text-bone mb-2">{headline}</h3>
      <p className="text-stone text-sm leading-relaxed mb-5">{body}</p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="flex-1 px-4 py-3 rounded-md bg-void border border-white/10 text-bone text-sm placeholder:text-stone/40 focus:border-ember/50 focus:outline-none transition-colors"
        />
        <button
          type="submit"
          disabled={status === "saving"}
          className="px-6 py-3 rounded-md bg-ember text-void font-semibold text-sm uppercase tracking-wider hover:bg-ember/90 transition-colors disabled:opacity-60 cursor-pointer"
        >
          {status === "saving" ? "Joining…" : "Join Free"}
        </button>
      </form>
      {status === "error" && (
        <p className="text-red-400 text-xs mt-3">{message}</p>
      )}
    </div>
  );
}
