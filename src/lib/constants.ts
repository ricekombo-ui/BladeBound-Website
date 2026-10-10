export const SITE = {
  name: "BladeBound",
  tagline: "Narrative-First Daggerheart Content",
  domain: "bladebound.games",
  email: "mailto:hello@bladebound.games",
  description:
    "BladeBound is a Daggerheart-focused content brand and tabletop community built around cinematic play, system education, and narrative-first storytelling.",
};

export const LINKS = {
  youtube: "https://youtube.com/@BladeBoundgames",
  discord: "https://discord.gg/quZ2kprX47",
  startplaying: "https://startplaying.games/gm/ricekombo",
  patreon: "https://www.patreon.com/BladeBound",
  shop: "https://shop.bladebound.games",
  instagram: "https://www.instagram.com/bladeboundsaga/",
  email: "mailto:hello@bladebound.games",
};

// footerOnly links are kept out of the header so it stays scannable; the
// footer and the mobile menu still list everything.
export const NAV_LINKS: { label: string; href: string; external?: boolean; footerOnly?: boolean }[] = [
  { label: "Content", href: "/content" },
  { label: "Play", href: "/play" },
  { label: "Community", href: "/community" },
  { label: "Membership", href: "/armory" },
  { label: "Shop", href: "https://shop.bladebound.games", external: true },
  { label: "About", href: "/about" },
  { label: "Resources", href: "/resources", footerOnly: true },
  { label: "Contact", href: "/contact", footerOnly: true },
];
