import type { HTMLAttributes, ReactNode } from "react";
import { motion } from "framer-motion";

import { Card } from "@/components/shared/card";
import { cn } from "@/utils/cn";

function Root({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <Card
      className={cn(
        "relative overflow-hidden border-[#5a513e] bg-[linear-gradient(170deg,rgba(20,18,14,0.98),rgba(16,14,11,0.95))] p-6 sm:p-8",
        className,
      )}
      {...props}
    />
  );
}

function Header({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <header className="mb-6 border-b border-[#3f3a30] pb-4">
      <h1 className="font-(family-name:--font-cormorant) text-4xl font-semibold tracking-wide text-[#f7f4ea] sm:text-5xl">
        <span className="text-[#f7f4ea]">{title.split(" ")[0]}</span>{" "}
        <span className="text-[#d9ba6f]">
          {title.split(" ").slice(1).join(" ")}
        </span>
      </h1>
      <p className="mt-2 text-sm text-[#b9b4a6]">{subtitle}</p>
    </header>
  );
}

function Progress({
  current,
  total,
  steps,
}: {
  current: number;
  total: number;
  steps: Array<{ title: string }>;
}) {
  const percent = Math.round(((current + 1) / total) * 100);

  return (
    <section aria-label="Wizard progress" className="mb-6">
      <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.14em] text-[#b5af9f]">
        <span>Progress</span>
        <span>{percent}%</span>
      </div>
      <div className="h-2 rounded-full bg-[#262117]">
        <motion.div
          className="h-full rounded-full bg-linear-to-r from-[#8a6429] via-[#e4c377] to-[#c39b4f]"
          initial={false}
          animate={{ width: `${percent}%` }}
          transition={{ type: "spring", stiffness: 130, damping: 20 }}
        />
      </div>
      <ol className="mt-4 grid gap-2 text-xs text-[#9c978a] sm:grid-cols-6">
        {steps.map((step, index) => {
          const active = current === index;
          const completed = index < current;
          return (
            <li
              key={step.title}
              className={cn(
                "rounded-lg border px-2 py-2 text-center",
                active && "border-[#d8bb74] bg-[#2f2718] text-[#f2e6ca]",
                completed && "border-[#7a6432] bg-[#241d12] text-[#d7be83]",
                !active && !completed && "border-[#3f3a30]",
              )}
            >
              {step.title}
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function Content({ children }: { children: ReactNode }) {
  return <section className="grid gap-4">{children}</section>;
}

function Actions({ children }: { children: ReactNode }) {
  return (
    <footer className="mt-8 flex flex-wrap items-center justify-between gap-3">
      {children}
    </footer>
  );
}

export const WizardShell = Object.assign(Root, {
  Header,
  Progress,
  Content,
  Actions,
});
