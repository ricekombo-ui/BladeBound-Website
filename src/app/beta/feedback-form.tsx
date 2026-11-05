"use client";
import { useState } from "react";

export default function FeedbackForm() {
  const [message, setMessage] = useState("");
  const [result, setResult] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setResult("");
    try {
      const response = await fetch("/api/beta/feedback", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message }) });
      if (response.ok) { setMessage(""); setResult("Thanks, your feedback was saved."); }
      else setResult("Feedback could not be saved. Please try again later.");
    } catch { setResult("Feedback could not be saved. Please try again later."); }
    setBusy(false);
  }
  return <form onSubmit={submit} className="mt-8 space-y-3"><label htmlFor="feedback" className="block font-bold">Send feedback</label><textarea id="feedback" className="block w-full rounded p-3 text-black" value={message} onChange={event => setMessage(event.target.value)} maxLength={3000} required rows={5} /><button disabled={busy} className="rounded bg-orange-500 px-4 py-2 text-black">{busy ? "Sending…" : "Send feedback"}</button><p role="status">{result}</p></form>;
}
