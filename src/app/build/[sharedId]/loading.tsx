import { ViewTransition } from "react";

export default function BuildLoading() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
      <ViewTransition exit="slide-down" default="none">
        <section className="rounded-2xl border border-[#4d4738] bg-[#16130f] p-6">
          <div className="h-6 w-56 animate-pulse rounded bg-[#2d271b]" />
          <div className="mt-4 h-4 w-full animate-pulse rounded bg-[#211d14]" />
          <div className="mt-2 h-4 w-4/5 animate-pulse rounded bg-[#211d14]" />
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="h-28 animate-pulse rounded-xl bg-[#201b13]" />
            <div className="h-28 animate-pulse rounded-xl bg-[#201b13]" />
          </div>
        </section>
      </ViewTransition>
    </main>
  );
}
