import type { Metadata } from "next";
import SectionWrapper from "@/components/ui/SectionWrapper";
import CTABlock from "@/components/ui/CTABlock";
import Button from "@/components/ui/Button";
import EmailCapture from "@/components/ui/EmailCapture";
import { LINKS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "The Armory",
  description:
    "Support BladeBound on Patreon and arm your table — weekly Daggerheart homebrew drops, build infographics, GM tools, adversaries, and seats at exclusive one-shots.",
};

// ── Real Patreon tiers ─────────────────────────────────────────────────────────

const tiers = [
  {
    name: "The Circle",
    price: "$5",
    motto: "Where the story begins.",
    description:
      "Be part of BladeBound and help shape what comes next. Early access, behind-the-scenes insight, and a voice in what we create.",
    perks: [
      "Early access to YouTube videos",
      "Patron-only updates and behind-the-scenes posts",
      "Access to the Patron Discord space",
      "Voting on future content and ideas",
    ],
    cta: "Join The Circle",
    accentClass: "border-white/5 bg-shadow/10",
    glowColor: "text-ember",
    accent: false,
  },
  {
    name: "The Forge",
    price: "$10",
    motto: "Where ideas become playable.",
    description:
      "The core of BladeBound. Every week you get Daggerheart content you can actually use at your table — designed for fast, narrative-first play.",
    perks: [
      "Everything in The Circle",
      "Weekly homebrew drops — magic items, character builds, connection question packs, GM tools & adversaries",
      "Monthly downloadable content bundle (clean PDF)",
      "Priority voting on future releases",
    ],
    cta: "Enter The Forge",
    accentClass: "border-ember/40 bg-ember/10",
    glowColor: "text-ember",
    accent: true,
  },
  {
    name: "The Table",
    price: "$30",
    motto: "Where the story is played.",
    description:
      "Step into the game. For those who want more than content — play in BladeBound games and engage directly with the stories we are building. Seats are limited.",
    perks: [
      "Everything in The Forge",
      "Signups for monthly Daggerheart one-shots",
      "Priority access to additional game tables",
      "Monthly Patron Q&A or live session",
      "Submit ideas for future BladeBound content",
      "Name listed in BladeBound supporter credits",
    ],
    cta: "Claim a Seat",
    accentClass: "border-white/5 bg-shadow/10",
    glowColor: "text-ember",
    accent: false,
  },
];

// ── The Vault teaser — what's locked inside The Forge ─────────────────────────
// These render as locked preview cards. As free samples are released,
// move entries into FREE_SAMPLES below with real image paths.

const VAULT_ITEMS = [
  { title: "Vengeance — Guardian Quick Guide", kind: "Class Build" },
  { title: "Wordsmith — Bard Quick Guide", kind: "Class Build" },
  { title: "Primal Origin — Sorcerer Quick Guide", kind: "Class Build" },
  { title: "Rogue | Syndicate & Nightwalker Builds", kind: "Class Build" },
  { title: "Adversary Pack — Vol. 1", kind: "GM Tools" },
  { title: "Connection Question Pack", kind: "Session Zero" },
  { title: "Magic Item Drop — Weekly", kind: "Homebrew" },
  { title: "Campaign Frame Toolkit", kind: "GM Tools" },
];

// Free samples — fully visible proof of what The Forge delivers.
const FREE_SAMPLES: { title: string; kind: string; image: string; download?: string }[] = [
  {
    title: "Stalwart — Guardian Quick Guide",
    kind: "Class Build",
    image: "/armory/stalwart-guardian.jpg",
    download: "/armory/stalwart-guardian.jpg",
  },
  {
    title: "Troubadour — Bard Quick Guide",
    kind: "Class Build",
    image: "/armory/troubadour-bard.jpg",
    download: "/armory/troubadour-bard.jpg",
  },
  {
    title: "Elemental Origin — Sorcerer Quick Guide",
    kind: "Class Build",
    image: "/armory/elemental-origin-sorcerer.jpg",
    download: "/armory/elemental-origin-sorcerer.jpg",
  },
];

export default function SupportPage() {
  return (
    <>
      {/* Page Hero */}
      <section className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <span className="inline-block text-ember text-xs font-semibold uppercase tracking-widest mb-4">
            The Armory
          </span>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-bone max-w-3xl leading-tight mb-6">
            Arm Your Table
          </h1>
          <p className="text-stone text-lg md:text-xl max-w-2xl leading-relaxed mb-10">
            Weekly Daggerheart homebrew, build infographics, GM tools, and seats at exclusive
            one-shots. Supporting BladeBound doesn&apos;t just fund the work — it puts playable
            content in your hands every single week.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button href={LINKS.patreon} variant="primary" size="lg" external>
              Browse the Tiers
            </Button>
            <Button href={LINKS.discord} variant="secondary" size="lg" external>
              Join the Community First
            </Button>
          </div>
        </div>
      </section>

      {/* Tiers */}
      <SectionWrapper>
        <div className="mb-10 text-center">
          <span className="inline-block text-ember text-xs font-semibold uppercase tracking-widest mb-3">
            Choose Your Path
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-bone mb-3">
            Three Ways In
          </h2>
          <p className="text-stone text-base md:text-lg max-w-xl mx-auto">
            Every tier is managed through Patreon. Cancel anytime — the content you&apos;ve
            downloaded is yours to keep.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-lg p-6 flex flex-col border ${tier.accentClass} ${
                tier.accent ? "md:-my-3 md:py-9 shadow-2xl shadow-ember/10" : ""
              }`}
            >
              {tier.accent && (
                <span className="text-xs font-semibold uppercase tracking-widest text-ember mb-3">
                  ⚒ The Core of BladeBound
                </span>
              )}
              <h3 className="font-serif text-2xl text-bone mb-0.5">{tier.name}</h3>
              <p className="text-stone/70 text-xs italic mb-3">{tier.motto}</p>
              <div className="flex items-baseline gap-1 mb-4">
                <span className={`text-3xl font-semibold ${tier.glowColor}`}>{tier.price}</span>
                <span className="text-stone text-sm">/month</span>
              </div>
              <p className="text-stone text-sm mb-5 leading-relaxed">{tier.description}</p>
              <ul className="space-y-2.5 mb-6 flex-1">
                {tier.perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-2">
                    <span className="text-ember flex-shrink-0 text-xs mt-0.5">✓</span>
                    <span className="text-stone text-xs leading-relaxed">{perk}</span>
                  </li>
                ))}
              </ul>
              <Button href={LINKS.patreon} variant={tier.accent ? "primary" : "secondary"} external>
                {tier.cta}
              </Button>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* Divider */}
      <div className="section-divider" />

      {/* The Vault */}
      <SectionWrapper>
        <div className="mb-10">
          <span className="inline-block text-ember text-xs font-semibold uppercase tracking-widest mb-3">
            The Vault
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-bone mb-3">
            What&apos;s Inside The Forge
          </h2>
          <p className="text-stone text-base md:text-lg max-w-2xl">
            A growing library of playable Daggerheart content — new drops every week.
            Here&apos;s a look at what members are already using at their tables.
          </p>
        </div>

        {/* Free samples — visible proof of Forge quality */}
        {FREE_SAMPLES.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {FREE_SAMPLES.map((item) => (
              <div key={item.title} className="rounded-lg overflow-hidden border border-ember/30 bg-shadow/10 flex flex-col group">
                <a
                  href={item.image}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative block aspect-[3/4] overflow-hidden"
                  title="View full size"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover object-top group-hover:scale-[1.02] transition-transform duration-500"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-void/90 to-transparent" />
                  <span className="absolute bottom-3 left-1/2 -translate-x-1/2 text-bone/80 text-[10px] uppercase tracking-widest border border-white/20 rounded-full px-3 py-1 bg-void/60 backdrop-blur-sm group-hover:border-ember/50 group-hover:text-ember transition-colors">
                    View Full Guide
                  </span>
                </a>
                <div className="p-4 flex items-center justify-between gap-3 mt-auto">
                  <div className="min-w-0">
                    <p className="text-bone text-sm font-semibold leading-snug">{item.title}</p>
                    <p className="text-ember text-xs uppercase tracking-wider mt-0.5">Free Sample · {item.kind}</p>
                  </div>
                  {item.download && (
                    <a
                      href={item.download}
                      download
                      className="flex-shrink-0 px-3.5 py-2 rounded-md bg-ember text-void text-xs font-semibold uppercase tracking-wider hover:bg-ember/90 transition-colors"
                    >
                      Download
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Locked vault grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {VAULT_ITEMS.map((item) => (
            <div
              key={item.title}
              className="relative rounded-lg border border-white/5 bg-gradient-to-br from-shadow/40 to-void p-5 md:p-6 overflow-hidden group"
            >
              {/* Blurred glow effect suggesting hidden content */}
              <div className="absolute inset-0 opacity-20 blur-2xl bg-gradient-to-br from-ember/40 via-transparent to-transparent group-hover:opacity-30 transition-opacity" />
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-void border border-ember/30 flex items-center justify-center mb-4">
                  <svg className="w-3.5 h-3.5 text-ember" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 1a5 5 0 00-5 5v3H6a2 2 0 00-2 2v9a2 2 0 002 2h12a2 2 0 002-2v-9a2 2 0 00-2-2h-1V6a5 5 0 00-5-5zm-3 8V6a3 3 0 116 0v3H9z" />
                  </svg>
                </div>
                <p className="text-bone text-sm font-semibold leading-snug mb-1">{item.title}</p>
                <p className="text-stone/60 text-xs uppercase tracking-wider">{item.kind}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-stone text-sm mb-4">
            New drops every week. Unlock the full vault inside The Forge.
          </p>
          <Button href={LINKS.patreon} variant="primary" external>
            Unlock The Forge — $10/mo
          </Button>
        </div>
      </SectionWrapper>

      {/* Divider */}
      <div className="section-divider" />

      {/* Email capture */}
      <SectionWrapper tight>
        <div className="max-w-2xl mx-auto">
          <EmailCapture
            source="armory"
            headline="Not ready to join? Take the free path."
            body="Get the BladeBound Dispatch — free Daggerheart resources, content drops, and news from the table. Straight to your inbox, no spam."
          />
        </div>
      </SectionWrapper>

      {/* Divider */}
      <div className="section-divider" />

      {/* CTA */}
      <SectionWrapper tight>
        <CTABlock
          label="Play With Us"
          title="Want a Seat at the Table?"
          body="The Table tier includes signups for monthly Daggerheart one-shots run by BladeBound. Seats are limited — this is where the community becomes the party."
          primaryText="Claim a Seat — $30/mo"
          primaryHref={LINKS.patreon}
          primaryExternal
          secondaryText="Book a Pro Game Instead"
          secondaryHref={LINKS.startplaying}
          secondaryExternal
        />
      </SectionWrapper>
    </>
  );
}
