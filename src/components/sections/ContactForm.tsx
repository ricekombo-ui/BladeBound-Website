"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { SITE } from "@/lib/constants";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Replace with your preferred form handler: Formspree, Resend, or a Next.js API route
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="bg-ember/10 border border-ember/30 rounded-lg p-6">
        <p className="text-bone font-medium mb-1">Message received.</p>
        <p className="text-stone text-sm">We will get back to you at the email you provided.</p>
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

      <div>
        <label htmlFor="subject" className="block text-bone text-sm font-medium mb-1.5">
          Subject
        </label>
        <select
          id="subject"
          name="subject"
          required
          value={form.subject}
          onChange={handleChange}
          className="w-full bg-shadow/10 border border-white/10 rounded px-4 py-2.5 text-bone text-sm focus:outline-none focus:border-ember/50 transition-colors"
        >
          <option value="" disabled>Select a topic</option>
          <option value="collaboration">Collaboration or Partnership</option>
          <option value="media">Media or Press Inquiry</option>
          <option value="private-game">Private Game Request</option>
          <option value="general">General Question</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block text-bone text-sm font-medium mb-1.5">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          value={form.message}
          onChange={handleChange}
          className="w-full bg-shadow/10 border border-white/10 rounded px-4 py-2.5 text-bone text-sm placeholder-stone/50 focus:outline-none focus:border-ember/50 transition-colors resize-none"
          placeholder="What can we help with?"
        />
      </div>

      <Button type="submit" variant="primary" size="md">
        Send Message
      </Button>
      <p className="text-stone text-xs mt-2">
        Or email directly:{" "}
        <a href={SITE.email} className="text-ember hover:underline">
          hello@bladebound.games
        </a>
      </p>
    </form>
  );
}
