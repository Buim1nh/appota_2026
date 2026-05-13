"use client";

import { ViewTransition } from "react";

import { Button } from "@/components/shared/button";
import { Card, CardDescription, CardTitle } from "@/components/shared/card";

import { useWizardSnapshot } from "./wizard-context";

export function StepExport({ sharedId }: { sharedId: string }) {
  const state = useWizardSnapshot();

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], {
      type: "application/json",
    });
    const objectUrl = URL.createObjectURL(blob);

    const anchor = document.createElement("a");
    anchor.href = objectUrl;
    anchor.download = `character-build-${sharedId}.json`;
    anchor.click();

    URL.revokeObjectURL(objectUrl);
  };

  return (
    <ViewTransition enter="slide-up" exit="slide-down" default="none">
      <Card>
        <CardTitle>Export Character</CardTitle>
        <CardDescription>
          Download final build as JSON for sharing, backups, or API import.
        </CardDescription>

        <section className="mt-6 rounded-xl border border-[#3f3a30] bg-[#100e0a] p-5">
          <p className="text-sm text-[#bdb7a7]">
            This file includes selected IDs, level, dynamic selections, and
            Build.baseStats mapping.
          </p>
          <Button type="button" className="mt-4" onClick={exportJson}>
            Download JSON
          </Button>
        </section>
      </Card>
    </ViewTransition>
  );
}
