"use client";

import React from "react";
import Button from "../Button";
import Card from "../Card";
import BuildProgressIndicator from "./BuildProgressIndicator";
import StepBackground from "./StepBackground";
import StepClass from "./StepClass";
import StepRace from "./StepRace";
import StepStats from "./StepStats";
import StepReview from "./StepReview";
import StepFinalize from "./StepFinalize";
import { useBuildDraftStore } from "@/store/build-draft-store";

// Cập nhật để hỗ trợ hiển thị văn bản dài (isLongText)
function SummaryLine({
  label,
  value,
  isLongText = false,
}: {
  label: string;
  value: string;
  isLongText?: boolean;
}) {
  if (isLongText) {
    return (
      <div className="flex flex-col gap-1.5 rounded-sm border-b border-[rgba(35,23,15,0.1)] py-2 text-sm">
        <span className="font-medium text-[#23170f] opacity-70">{label}</span>
        <span
          className="text-[#23170f] leading-snug line-clamp-3"
          title={value}
        >
          {value}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-start justify-between gap-4 rounded-sm border-b border-[rgba(35,23,15,0.1)] py-2 text-sm">
      <span className="font-medium text-[#23170f] opacity-70">{label}</span>
      <span className="text-right font-bold text-[#23170f]">{value}</span>
    </div>
  );
}

export default function BuildWizard() {
  const activeStep = useBuildDraftStore((state) => state.activeStep);
  const draft = useBuildDraftStore((state) => state.draft);
  const nextStep = useBuildDraftStore((state) => state.nextStep);
  const prevStep = useBuildDraftStore((state) => state.prevStep);
  const setStep = useBuildDraftStore((state) => state.setStep);

  const currentStep = (() => {
    switch (activeStep) {
      case 1:
        return <StepClass />;
      case 2:
        return <StepRace />;
      case 3:
        return <StepBackground />;
      case 4:
        return <StepStats />;
      case 5:
        return <StepReview />;
      case 6:
      default:
        return <StepFinalize />;
    }
  })();

  return (
    <div className="space-y-6">
      <div className="rpg-panel ornate-border rounded-sm p-5 md:p-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <h1
              style={{ fontFamily: "var(--font-press)" }}
              className="text-3xl text-[#f0e6d2] drop-shadow-[2px_4px_0_rgba(0,0,0,0.95),0_0_14px_rgba(0,0,0,0.45)]"
            >
              Forge a new adventurer
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#f3e5c7]">
              Build your character through a six-step ritual of class, race,
              background, stats, equipment, and final review. The first three
              steps are fully wired to the game-rule archive.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button href="/" variant="ghost" className="px-4 py-3">
              Return Home
            </Button>
            <Button
              variant="primary"
              className="px-4 py-3"
              onClick={() => setStep(1)}
            >
              Restart Ritual
            </Button>
          </div>
        </div>
      </div>

      <BuildProgressIndicator activeStep={activeStep} />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div>{currentStep}</div>

        <aside className="space-y-4">
          <Card title="Dossier Summary" className="rpg-panel">
            <div className="space-y-3">
              <SummaryLine
                label="Character Name"
                value={draft.name || "Unset"}
              />
              <SummaryLine label="Level" value={`Lv ${draft.level}`} />
              <SummaryLine
                label="Class"
                value={draft.classRule?.name || "Unset"}
              />
              <SummaryLine
                label="Subclass"
                value={draft.subclassRule?.name || "Unset"}
              />
              <SummaryLine
                label="Race"
                value={draft.raceRule?.name || "Unset"}
              />
              <SummaryLine
                label="Background"
                value={draft.backgroundRule?.name || "Unset"}
              />

              {/* Lấy trực tiếp description của Rule thay vì state cứng */}
              <SummaryLine
                label="Class Feature"
                value={
                  draft.classRule?.description || draft.classFeature || "Unset"
                }
                isLongText
              />
              <SummaryLine
                label="Race Trait"
                value={
                  draft.raceRule?.description || draft.raceTrait || "Unset"
                }
                isLongText
              />
              <SummaryLine
                label="Background Feature"
                value={
                  draft.backgroundRule?.description ||
                  draft.backgroundFeature ||
                  "Unset"
                }
                isLongText
              />
            </div>
          </Card>

          <Card title="Navigation" className="rpg-panel">
            <div className="flex items-center justify-between gap-3">
              <Button
                variant="primary"
                className="px-4 py-3"
                onClick={prevStep}
                disabled={activeStep === 1}
              >
                Back
              </Button>
              <Button
                variant="primary"
                className="px-4 py-3"
                onClick={nextStep}
                disabled={activeStep === 6}
              >
                Next
              </Button>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}
