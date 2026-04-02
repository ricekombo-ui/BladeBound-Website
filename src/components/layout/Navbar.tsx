"use client";

import { useState } from "react";
import Link from "next/link";
import { NAV_LINKS, LINKS } from "@/lib/constants";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-void/90 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top row: Platform CTAs + centered logo + hamburger */}
        <div className="flex items-center justify-between h-16">
          {/* Left: Platform links (desktop) */}
          <div className="hidden md:flex items-center gap-2 min-w-[200px]">
            <Link
              href={LINKS.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium bg-red-900/20 border border-red-800/30 text-red-400 hover:bg-red-900/40 hover:border-red-700/50 px-3 py-1.5 rounded-full transition-all duration-200"
            >
              YouTube
            </Link>
            <Link
              href={LINKS.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium bg-indigo-900/20 border border-indigo-800/30 text-indigo-400 hover:bg-indigo-900/40 hover:border-indigo-700/50 px-3 py-1.5 rounded-full transition-all duration-200"
            >
              Discord
            </Link>
            <Link
              href={LINKS.patreon}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium bg-ember/10 border border-ember/30 text-ember hover:bg-ember/20 hover:border-ember/50 px-3 py-1.5 rounded-full transition-all duration-200"
            >
              Patreon
            </Link>
          </div>

          {/* Center: Logo */}
          <Link href="/" className="flex items-center gap-2.5 group absolute left-1/2 -translate-x-1/2 md:relative md:left-auto md:translate-x-0">
            <img
              src="/logo.png"
              alt="BladeBound"
              className="w-9 h-9 rounded-full object-cover ring-1 ring-ember/20 group-hover:ring-ember/50 transition-all duration-300"
            />
            <span className="font-serif font-semibold text-bone text-lg tracking-wide hidden sm:block">
              BladeBound
            </span>
          </Link>

          {/* Right: Nav links (desktop) */}
          <nav className="hidden md:flex items-center gap-5 min-w-[200px] justify-end">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-stone hover:text-bone transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 text-stone hover:text-bone transition-colors ml-auto"
            aria-label="Toggle navigation"
          >
            <span className={`block w-5 h-0.5 bg-current transition-all duration-200 ${open ? "rotate-45 translate-y-[3px]" : "mb-1"}`} />
            {!open && <span className="block w-5 h-0.5 bg-current mb-1" />}
            <span className={`block w-5 h-0.5 bg-current transition-all duration-200 ${open ? "-rotate-45 -translate-y-[3px]" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-void/95 backdrop-blur-md border-t border-white/5 px-4 pb-5 animate-fade-in-up">
          <nav className="flex flex-col gap-1 pt-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="py-2.5 text-sm text-stone hover:text-bone transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 flex flex-col gap-2 border-t border-white/5 mt-2">
              <Link
                href={LINKS.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
              >
                YouTube
              </Link>
              <Link
                href={LINKS.discord}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Discord
              </Link>
              <Link
                href={LINKS.patreon}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 text-sm font-medium text-ember"
              >
                Patreon
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
