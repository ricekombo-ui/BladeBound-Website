import type { Metadata } from "next";

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
