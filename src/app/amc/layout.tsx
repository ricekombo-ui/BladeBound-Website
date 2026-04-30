import type { Metadata } from "next";

// Never statically prerender any /amc route — they all require auth + Supabase
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "AMC",
  robots: { index: false, follow: false },
};

export default function AMCLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="amc-root">
      {children}
    </div>
  );
}
