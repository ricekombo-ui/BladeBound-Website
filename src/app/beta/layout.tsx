import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Private beta", robots: { index: false, follow: false } };

export default function BetaLayout({ children }: { children: React.ReactNode }) {
  return <section className="mx-auto max-w-2xl px-6 py-20">{children}</section>;
}
