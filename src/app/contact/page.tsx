import type { Metadata } from "next";
import SectionWrapper from "@/components/ui/SectionWrapper";
import ContactForm from "@/components/sections/ContactForm";
import { LINKS, SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with BladeBound Saga for collaboration, media inquiries, private game requests, or general questions.",
};

const socialLinks = [
  { label: "YouTube", href: LINKS.youtube, description: "Content, series, and guides" },
  { label: "Discord", href: LINKS.discord, description: "Community and fast answers" },
  { label: "Instagram", href: LINKS.instagram, description: "Updates and behind-the-scenes" },
  { label: "Patreon", href: LINKS.patreon, description: "Support and exclusive access" },
  { label: "StartPlaying", href: LINKS.startplaying, description: "Book a game" },
];

export default function ContactPage() {
  return (
    <>
      {/* Page Hero */}
      <section className="bg-void border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <span className="inline-block text-ember text-xs font-semibold uppercase tracking-widest mb-4">
            Contact
          </span>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-bone max-w-3xl leading-tight mb-6">
            Get in Touch
          </h1>
          <p className="text-stone text-lg md:text-xl max-w-2xl leading-relaxed">
            For collaboration, business inquiries, media requests, or general questions. We read everything.
          </p>
        </div>
      </section>

      <SectionWrapper>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div>
            <h2 className="font-serif text-2xl text-bone mb-6">Send a Message</h2>
            <ContactForm />
          </div>

          {/* Contact Info */}
          <div>
            <h2 className="font-serif text-2xl text-bone mb-6">Where to Find Us</h2>
            <div className="space-y-3 mb-10">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 bg-shadow/10 border border-white/5 rounded-lg hover:border-ember/25 transition-colors group"
                >
                  <div>
                    <div className="text-bone text-sm font-medium group-hover:text-ember transition-colors">
                      {link.label}
                    </div>
                    <div className="text-stone text-xs mt-0.5">{link.description}</div>
                  </div>
                  <span className="text-stone text-sm group-hover:text-ember transition-colors">
                    &rarr;
                  </span>
                </a>
              ))}
            </div>

            <div className="bg-shadow/10 border border-white/5 rounded-lg p-5">
              <h3 className="font-serif text-base text-bone mb-2">Business Inquiries</h3>
              <p className="text-stone text-sm leading-relaxed mb-3">
                For collaboration, sponsorships, licensed content, or media partnerships, reach out directly via email or use the Collaboration subject above.
              </p>
              <a href={SITE.email} className="text-ember text-sm hover:underline">
                hello@bladebound.games
              </a>
            </div>
          </div>
        </div>
      </SectionWrapper>
    </>
  );
}
