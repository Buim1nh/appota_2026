"use client";

import { ViewTransition } from "react";

import { Card, CardDescription, CardTitle } from "@/components/shared/card";

import { useWizardSnapshot } from "./wizard-context";

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#383327] py-2 text-sm">
      <dt className="font-medium text-[#c9c3b2]">{label}</dt>
      <dd className="text-[#f3ead2]">{value || "-"}</dd>
    </div>
  );
}

export function StepReview() {
  const state = useWizardSnapshot();

  return (
    <ViewTransition enter="slide-up" exit="slide-down" default="none">
      <Card>
        <CardTitle>Review Character Build</CardTitle>
        <CardDescription>
          Full summary across Class, Race, Background, and Base Stats before
          export.
        </CardDescription>

        <dl className="mt-5 rounded-xl border border-[#3f3a30] bg-[#100e0a] px-4 py-2">
          <SummaryRow label="Class ID" value={state.classStep.classId} />
          <SummaryRow label="Level" value={String(state.classStep.level)} />
          <SummaryRow label="Subclass ID" value={state.classStep.subclassId} />
          <SummaryRow label="Race ID" value={state.raceStep.raceId} />
          <SummaryRow label="Subrace ID" value={state.raceStep.subraceId} />
          <SummaryRow
            label="Background ID"
            value={state.backgroundStep.backgroundId}
          />
        </dl>

        <div className="mt-6 grid gap-3 rounded-xl border border-[#3f3a30] bg-[#100e0a] p-4 text-sm text-[#dfd7c0] sm:grid-cols-3">
          <p>STR: {state.baseStats.str}</p>
          <p>DEX: {state.baseStats.dex}</p>
          <p>CON: {state.baseStats.con}</p>
          <p>INT: {state.baseStats.int}</p>
          <p>WIS: {state.baseStats.wis}</p>
          <p>CHA: {state.baseStats.cha}</p>
        </div>
      </Card>
    </ViewTransition>
  );
}
