import Link from "next/link";
import { LINKS, NAV_LINKS, SITE } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="relative bg-void border-t border-white/5 mt-20">
      {/* Top CTA bar */}
      <div className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <span className="text-stone text-sm">Stay connected:</span>
            <div className="flex items-center gap-3">
              <Link
                href={LINKS.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium bg-red-900/20 border border-red-800/30 text-red-400 hover:bg-red-900/40 px-4 py-2 rounded-full transition-all"
              >
                YouTube
              </Link>
              <Link
                href={LINKS.discord}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium bg-indigo-900/20 border border-indigo-800/30 text-indigo-400 hover:bg-indigo-900/40 px-4 py-2 rounded-full transition-all"
              >
                Discord
              </Link>
              <Link
                href={LINKS.patreon}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium bg-ember/10 border border-ember/30 text-ember hover:bg-ember/20 px-4 py-2 rounded-full transition-all"
              >
                Patreon
              </Link>
            </div>
          </div>
        </div>
      </div>

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
            <div className="flex gap-4 mt-5">
              <Link href={LINKS.youtube} target="_blank" rel="noopener noreferrer" className="text-stone hover:text-ember text-sm transition-colors">YouTube</Link>
              <Link href={LINKS.discord} target="_blank" rel="noopener noreferrer" className="text-stone hover:text-ember text-sm transition-colors">Discord</Link>
              <Link href={LINKS.patreon} target="_blank" rel="noopener noreferrer" className="text-stone hover:text-ember text-sm transition-colors">Patreon</Link>
              <Link href={LINKS.instagram} target="_blank" rel="noopener noreferrer" className="text-stone hover:text-ember text-sm transition-colors">Instagram</Link>
            </div>
          </div>

          {/* Pages */}
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
                <Link href={LINKS.discord} target="_blank" rel="noopener noreferrer" className="text-stone hover:text-bone text-sm transition-colors">
                  Join the Discord
                </Link>
              </li>
              <li>
                <Link href={LINKS.youtube} target="_blank" rel="noopener noreferrer" className="text-stone hover:text-bone text-sm transition-colors">
                  Watch on YouTube
                </Link>
              </li>
              <li>
                <Link href={LINKS.patreon} target="_blank" rel="noopener noreferrer" className="text-stone hover:text-bone text-sm transition-colors">
                  Support on Patreon
                </Link>
              </li>
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
