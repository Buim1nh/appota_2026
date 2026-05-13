import type { ReactNode } from "react";

export default function BuildLayout({ children }: { children: ReactNode }) {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#090907]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_12%,rgba(73,66,33,0.34),transparent_42%),radial-gradient(circle_at_80%_75%,rgba(79,48,27,0.32),transparent_42%),radial-gradient(circle_at_50%_10%,rgba(31,31,22,0.25),transparent_60%)]"
      />
      <div className="relative z-10">{children}</div>
    </section>
  );
}
