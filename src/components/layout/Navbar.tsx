"use client";

import { useState } from "react";
import Link from "next/link";
import { NAV_LINKS, LINKS } from "@/lib/constants";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-void/90 backdrop-blur-sm border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
           <img src="/logo.png" alt="BladeBound Saga" className="w-8 h-8 rounded-full object-cover" />

            <span className="font-serif font-semibold text-bone text-lg tracking-wide hidden sm:block">
              BladeBound Saga
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-stone hover:text-bone transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href={LINKS.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-stone hover:text-bone transition-colors"
            >
              YouTube
            </Link>
            <Link
              href={LINKS.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm bg-ember/10 border border-ember/30 hover:border-ember/70 hover:bg-ember/20 text-ember px-4 py-1.5 rounded transition-all duration-200"
            >
              Join Discord
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 text-stone hover:text-bone transition-colors"
            aria-label="Toggle navigation"
          >
            <span className="block w-5 h-0.5 bg-current mb-1 transition-transform" />
            <span className="block w-5 h-0.5 bg-current mb-1" />
            <span className="block w-5 h-0.5 bg-current transition-transform" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-void border-t border-white/5 px-4 pb-4">
          <nav className="flex flex-col gap-1 pt-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="py-2 text-sm text-stone hover:text-bone transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 flex flex-col gap-2 border-t border-white/5 mt-2">
              <Link
                href={LINKS.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 text-sm text-stone hover:text-bone transition-colors"
              >
                YouTube
              </Link>
              <Link
                href={LINKS.discord}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 text-sm text-ember"
              >
                Join Discord
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
