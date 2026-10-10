"use client";

import { useState } from "react";
import Link from "next/link";
import { NAV_LINKS, LINKS } from "@/lib/constants";
import { ExternalIcon } from "@/components/ui/Button";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const headerLinks = NAV_LINKS.filter((l) => !l.footerOnly);

  return (
    <header className="sticky top-0 z-50 bg-void/90 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <img
              src="/logo.png"
              alt=""
              className="w-9 h-9 rounded-full object-cover ring-1 ring-ember/20 group-hover:ring-ember/50 transition-all duration-300"
            />
            <span className="font-serif font-semibold text-bone text-lg tracking-wide">BladeBound</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7" aria-label="Main">
            {headerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="group relative inline-flex items-center gap-1 text-sm text-bone/80 hover:text-bone transition-colors duration-200"
              >
                {link.label}
                {link.external && <ExternalIcon />}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-ember group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </nav>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-3 -mr-3 text-stone hover:text-bone transition-colors"
            aria-label="Toggle navigation"
            aria-expanded={open}
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
          <nav className="flex flex-col pt-2" aria-label="Mobile">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                onClick={() => setOpen(false)}
                className="py-3 text-base text-bone/90 hover:text-bone transition-colors inline-flex items-center gap-1.5"
              >
                {link.label}
                {link.external && <ExternalIcon />}
              </Link>
            ))}
            <div className="pt-3 flex gap-5 border-t border-white/5 mt-2">
              <Link href={LINKS.youtube} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}
                className="py-2 text-sm font-medium text-red-400 hover:text-red-300 transition-colors">
                YouTube
              </Link>
              <Link href={LINKS.discord} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}
                className="py-2 text-sm font-medium text-indigo-300 hover:text-indigo-200 transition-colors">
                Discord
              </Link>
              <Link href={LINKS.patreon} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}
                className="py-2 text-sm font-medium text-ember">
                Patreon
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
