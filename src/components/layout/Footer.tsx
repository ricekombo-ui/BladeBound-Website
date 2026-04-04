import Link from "next/link";
import { LINKS, NAV_LINKS, SITE } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-3">
              <img src="/logo.png" alt="BladeBound" className="w-7 h-7 rounded-full object-cover" />
              <span className="font-serif font-semibold text-xl text-bone">BladeBound</span>
            </Link>
            <p className="text-stone text-sm leading-relaxed max-w-sm">
              Narrative-first Daggerheart content, cinematic play, and a community built around serious tabletop craft.
            </p>
            <div className="flex gap-5 mt-5">
              <Link href={LINKS.youtube} target="_blank" rel="noopener noreferrer" className="group relative text-stone hover:text-red-400 text-sm transition-colors">
                YouTube
                <span className="absolute bottom-0 left-0 w-0 h-px bg-red-400 group-hover:w-full transition-all duration-300" />
              </Link>
              <Link href={LINKS.discord} target="_blank" rel="noopener noreferrer" className="group relative text-stone hover:text-indigo-400 text-sm transition-colors">
                Discord
                <span className="absolute bottom-0 left-0 w-0 h-px bg-indigo-400 group-hover:w-full transition-all duration-300" />
              </Link>
              <Link href={LINKS.patreon} target="_blank" rel="noopener noreferrer" className="group relative text-stone hover:text-ember text-sm transition-colors">
                Patreon
                <span className="absolute bottom-0 left-0 w-0 h-px bg-ember group-hover:w-full transition-all duration-300" />
              </Link>
              <Link href={LINKS.instagram} target="_blank" rel="noopener noreferrer" className="group relative text-stone hover:text-ember text-sm transition-colors">
                Instagram
                <span className="absolute bottom-0 left-0 w-0 h-px bg-ember group-hover:w-full transition-all duration-300" />
              </Link>
            </div>
          </div>

          {/* Navigate */}
          <div>
            <h3 className="text-bone text-sm font-semibold mb-3 uppercase tracking-wider">Navigate</h3>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-stone hover:text-bone text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-bone text-sm font-semibold mb-3 uppercase tracking-wider">Connect</h3>
            <ul className="space-y-2">
              <li>
                <Link href={LINKS.startplaying} target="_blank" rel="noopener noreferrer" className="text-stone hover:text-bone text-sm transition-colors">
                  Play in a Game
                </Link>
              </li>
              <li>
                <Link href={SITE.email} className="text-stone hover:text-bone text-sm transition-colors">
                  contact@bladebound.games
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-stone text-xs">
            &copy; {new Date().getFullYear()} BladeBound. All rights reserved.
          </p>
          <p className="text-stone text-xs">
            Daggerheart is a product of Darrington Press.
          </p>
        </div>
      </div>
    </footer>
  );
}
