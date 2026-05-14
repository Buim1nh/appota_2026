"use client";

import React from "react";

type StepState = {
  id: number;
  label: string;
  detail: string;
};

const steps: StepState[] = [
  { id: 1, label: "Class", detail: "Choose a calling" },
  { id: 2, label: "Race", detail: "Blood and heritage" },
  { id: 3, label: "Background", detail: "Past and oath" },
  { id: 4, label: "Stats", detail: "Shape your core" },
  { id: 5, label: "Review", detail: "Review your build" },
  { id: 6, label: "Save/Export", detail: "Seal the dossier" },
];

export default function BuildProgressIndicator({
  activeStep,
}: {
  activeStep: number;
}) {
  return (
    <ol className="grid gap-3 md:grid-cols-6">
      {steps.map((step) => {
        const isActive = step.id === activeStep;
        const isComplete = step.id < activeStep;

        return (
          <li
            key={step.id}
            className={[
              "rounded-sm border px-3 py-3 text-left transition",
              isActive
                ? "border-[color:var(--gold)] bg-[rgba(182,139,42,0.12)] shadow-[0_0_0_1px_rgba(182,139,42,0.35),0_0_24px_rgba(182,139,42,0.12)]"
                : isComplete
                  ? "border-[color:rgba(182,139,42,0.55)] bg-[rgba(255,255,255,0.03)]"
                  : "border-[color:var(--border)] bg-[rgba(255,255,255,0.02)]",
            ].join(" ")}
          >
            <div className="flex items-center gap-3">
              <div
                className={[
                  "flex h-10 w-10 items-center justify-center rounded-sm border text-sm font-bold",
                  isActive
                    ? "border-[color:var(--gold)] bg-[rgba(182,139,42,0.18)] text-[#f5ead0]"
                    : isComplete
                      ? "border-[color:rgba(182,139,42,0.45)] bg-[rgba(255,255,255,0.06)] text-[#f5ead0]"
                      : "border-[color:var(--border)] bg-[rgba(0,0,0,0.2)] text-[color:var(--muted)]",
                ].join(" ")}
              >
                {step.id}
              </div>
              <div>
                <div className="font-press text-xs tracking-wide text-[#f0e6d2]">
                  {step.label}
                </div>
                <div className="mt-1 text-[11px] text-[color:var(--muted)]">
                  {step.detail}
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
