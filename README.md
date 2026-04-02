# BladeBound Saga

Production website for BladeBound Saga, a Daggerheart-focused content brand.

**Stack:** Next.js 15, TypeScript, Tailwind CSS

---

## Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── layout.tsx        # Root layout (Navbar, Footer, global metadata)
│   ├── globals.css       # Global styles, font imports, CSS variables
│   ├── page.tsx          # Home page
│   ├── about/page.tsx
│   ├── play/page.tsx
│   ├── content/page.tsx
│   ├── community/page.tsx
│   ├── support/page.tsx
│   ├── resources/page.tsx
│   └── contact/page.tsx
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx    # Sticky navbar with mobile menu
│   │   └── Footer.tsx    # Footer with nav, social, and brand info
│   ├── ui/               # Reusable primitive components
│   │   ├── Button.tsx
│   │   ├── SectionWrapper.tsx
│   │   ├── PageHeader.tsx
│   │   ├── CTABlock.tsx
│   │   └── FAQAccordion.tsx
│   └── sections/         # Page-level section components
│       ├── Hero.tsx
│       ├── FeatureCards.tsx
│       ├── SeriesCard.tsx
│       ├── ContentCard.tsx
│       ├── ProofSection.tsx
│       └── ContactForm.tsx
└── lib/
    └── constants.ts      # Site-wide links, nav config, brand constants
```

---

## Where to Edit Content

### Global Links and Social URLs
**`src/lib/constants.ts`**

All external links live here. Update these first:
```ts
export const LINKS = {
  youtube: "https://youtube.com/@bladeboundsaga",
  discord: "https://discord.gg/YOUR_INVITE",
  startplaying: "https://startplaying.games/YOUR_LISTING",
  patreon: "https://patreon.com/YOUR_PAGE",
  instagram: "https://instagram.com/bladeboundsaga",
  email: "mailto:hello@bladebound.games",
};
```

### Navigation
**`src/lib/constants.ts`** - `NAV_LINKS` array controls the nav order and labels.

### Global Styles and Colors
**`src/app/globals.css`** - CSS variables and font imports
**`tailwind.config.ts`** - Color tokens and theme extensions

### Per-Page Copy
Each page is a self-contained file in `src/app/[page]/page.tsx`. All copy, section data, and layout are defined inside the page file.

---

## Adding Content

### New Blog or Guide Posts
Add a `blog/` directory to `src/app/` and create `[slug]/page.tsx` files. No CMS is wired up yet. Markdown with `gray-matter` + `remark` is a clean lightweight option.

### New YouTube Videos on Content Page
Open `src/app/content/page.tsx` and add entries to the `contentCategories` array or `featuredSeries` array.

### New Resource Downloads
Open `src/app/resources/page.tsx` and add to the `freeResources` array. Set `status` to `"Free Download"` and point `href` to your file path or external URL.

### New Support Tiers
Open `src/app/support/page.tsx` and edit the `tiers` array.

---

## Contact Form

The contact form at `src/components/sections/ContactForm.tsx` handles client-side state but does not submit to any backend.

To wire it up, choose one of:

1. **Formspree** - Simple, no backend needed. Replace `handleSubmit` with a `fetch` to your Formspree endpoint.
2. **Resend** - Add an API route at `src/app/api/contact/route.ts` and `POST` to it from the form.
3. **Next.js Server Action** - Convert the form to use a `<form action={serverAction}>` pattern.

---

## Logo

Place your logo at `public/logo.png` (or `.svg`) and update `src/components/layout/Navbar.tsx` to use `<Image>` instead of the letter mark.

```tsx
import Image from "next/image";
// Replace the letter mark div with:
<Image src="/logo.png" alt="BladeBound Saga" width={32} height={32} />
```

---

## SEO

- Page-level metadata is in each `page.tsx` file via Next.js `export const metadata`
- Root metadata defaults are in `src/app/layout.tsx`
- OpenGraph and Twitter card basics are included
- Update `metadataBase` in `layout.tsx` once the domain is live

---

## Deployment

The site is ready to deploy on Vercel with zero configuration.

```bash
# Deploy via Vercel CLI
npx vercel

# Or connect the GitHub repo to vercel.com for automatic deploys
```

For other platforms (Netlify, Cloudflare Pages), run `npm run build` and deploy the `.next` output.
