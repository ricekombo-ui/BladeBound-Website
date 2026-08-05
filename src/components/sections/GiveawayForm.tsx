"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { LINKS } from "@/lib/constants";

export default function GiveawayForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "duplicate" | "error">("idle");
  const [form, setForm] = useState({ name: "", discord: "", youtube: "", email: "", zip: "" });
  const [eligible, setEligible] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/giveaway", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("done");
      } else if (res.status === 409) {
        setStatus("duplicate");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "done" || status === "duplicate") {
    return (
      <div className="bg-ember/10 border border-ember/30 rounded-lg p-6">
        <p className="text-bone font-medium mb-1">
          {status === "done" ? "You're entered! ⚔" : "You're already entered!"}
        </p>
        <p className="text-stone text-sm">
          Winners are drawn live on stream. Keep an eye on{" "}
          <a href={LINKS.discord} target="_blank" rel="noopener noreferrer" className="text-ember hover:underline">
            Discord
          </a>{" "}
          and{" "}
          <a href={LINKS.youtube} target="_blank" rel="noopener noreferrer" className="text-ember hover:underline">
            YouTube
          </a>{" "}
          for the stream.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-bone text-sm font-medium mb-1.5">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={form.name}
            onChange={handleChange}
            className="w-full bg-shadow/10 border border-white/10 rounded px-4 py-2.5 text-bone text-sm placeholder-stone/50 focus:outline-none focus:border-ember/50 transition-colors"
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-bone text-sm font-medium mb-1.5">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            className="w-full bg-shadow/10 border border-white/10 rounded px-4 py-2.5 text-bone text-sm placeholder-stone/50 focus:outline-none focus:border-ember/50 transition-colors"
            placeholder="your@email.com"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="discord" className="block text-bone text-sm font-medium mb-1.5">
            Discord Username
          </label>
          <input
            id="discord"
            name="discord"
            type="text"
            required
            value={form.discord}
            onChange={handleChange}
            className="w-full bg-shadow/10 border border-white/10 rounded px-4 py-2.5 text-bone text-sm placeholder-stone/50 focus:outline-none focus:border-ember/50 transition-colors"
            placeholder="yourname"
          />
        </div>
        <div>
          <label htmlFor="youtube" className="block text-bone text-sm font-medium mb-1.5">
            YouTube Channel <span className="text-stone/50 font-normal">(optional)</span>
          </label>
          <input
            id="youtube"
            name="youtube"
            type="text"
            value={form.youtube}
            onChange={handleChange}
            className="w-full bg-shadow/10 border border-white/10 rounded px-4 py-2.5 text-bone text-sm placeholder-stone/50 focus:outline-none focus:border-ember/50 transition-colors"
            placeholder="@yourchannel"
          />
        </div>
      </div>

      <div>
        <label htmlFor="zip" className="block text-bone text-sm font-medium mb-1.5">
          Zip Code
        </label>
        <input
          id="zip"
          name="zip"
          type="text"
          required
          value={form.zip}
          onChange={handleChange}
          className="w-full sm:w-48 bg-shadow/10 border border-white/10 rounded px-4 py-2.5 text-bone text-sm placeholder-stone/50 focus:outline-none focus:border-ember/50 transition-colors"
          placeholder="12345"
        />
      </div>

      <label className="flex items-start gap-2.5 cursor-pointer">
        <input
          type="checkbox"
          required
          checked={eligible}
          onChange={e => setEligible(e.target.checked)}
          className="mt-0.5 w-4 h-4 accent-ember flex-shrink-0"
        />
        <span className="text-stone text-sm leading-relaxed">
          I confirm I am 18 years of age or older and have a shipping address within the United States.
        </span>
      </label>

      <Button type="submit" variant="primary" size="md" disabled={status === "sending" || !eligible}>
        {status === "sending" ? "Entering…" : "Enter the Giveaway"}
      </Button>
      {status === "error" && (
        <p className="text-red-400 text-sm">Something went wrong. Try again in a moment.</p>
      )}
    </form>
  );
}
