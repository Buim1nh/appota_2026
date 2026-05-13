"use client";

import React from "react";
import Button from "../../components/Button";
import BuildWizard from "../../components/build/BuildWizard";

export default function BuildPage() {
  return (
    <div className="space-y-6">
      <div className="rpg-panel ornate-border rounded-sm p-5 md:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <h1
              style={{ fontFamily: "var(--font-press)" }}
              className="text-3xl text-[#f0e6d2] drop-shadow-[2px_4px_0_rgba(0,0,0,0.95),0_0_14px_rgba(0,0,0,0.45)]"
            >
              Character Forge
            </h1>
            <p className="mt-3 text-sm leading-6 text-[#f3e5c7]">
              Shape a hero through a richly ornamented dark-fantasy builder,
              from class and lineage to the final battlefield dossier.
            </p>
          </div>

          <Button href="/builds" variant="ghost" className="px-4 py-3">
            View Public Builds
          </Button>
        </div>
      </div>

      <BuildWizard />
    </div>
  );
}
