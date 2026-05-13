"use client";

import { useBuildDraftStore } from "@/store/build-draft-store";
import { calculateDerivedStats } from "@/utils/statCalculations";
import { useRef, useState } from "react";
import Button from "../Button";
import StepReview from "./StepReview";

export default function StepFinalize() {
  const draft = useBuildDraftStore((state) => state.draft);
  const resetDraft = useBuildDraftStore((state) => state.resetDraft);

  const [buildName, setBuildName] = useState(draft.name || "");
  const [notes, setNotes] = useState(draft.notes || "");
  const [isPublic, setIsPublic] = useState(draft.isPublic || false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [savedBuildId, setSavedBuildId] = useState<string | null>(null);

  const reviewRef = useRef<HTMLDivElement>(null);

  // Validate that the build has required fields
  const canSave =
    buildName.trim().length > 0 &&
    draft.classRule &&
    draft.raceRule &&
    draft.level > 0;

  const handleSave = async () => {
    if (!canSave) {
      setError("Please complete all required fields before saving.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const derivedStats = calculateDerivedStats(draft.stats, draft.level);

      const buildPayload = {
        name: buildName.trim(),
        level: draft.level,
        classRef: draft.classRule?.id,
        raceRef: draft.raceRule?.id,
        backgroundRef: draft.backgroundRule?.id,
        subclassId: draft.subclassRule?.id,
        baseStats: draft.stats,
        derivedStats,
        equipment: Object.fromEntries(
          Object.entries(draft.equipment).map(([k, v]) => [
            k,
            v === "" ? null : v,
          ]),
        ),
        spells: draft.spells,
        feats: draft.feats,
        activeModifiers: [],
        shareId: Math.random().toString(36).substring(2, 9),
        isPublic,
        optimizationScore: 75,
        tags:
          draft.tags.length > 0
            ? draft.tags
            : [
                draft.classRule?.name || "",
                draft.raceRule?.name || "",
                draft.backgroundRule?.name || "",
              ].filter(Boolean),
        notes: notes.trim() || draft.notes.trim() || undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const response = await fetch("/api/builds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save build");
      }

      const savedBuild = await response.json();
      setSavedBuildId(savedBuild._id);
      setSuccess(true);

      // Reset the form after a delay
      setTimeout(() => {
        resetDraft();
        setBuildName("");
        setNotes("");
        setIsPublic(false);
      }, 2000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async () => {
    if (!reviewRef.current) return;
    const html2pdf = (await import("html2pdf.js")).default;

    const opt = {
      margin: 10,
      filename: `${buildName || "character"}-dossier.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: false,
      },
      jsPDF: { orientation: "portrait", unit: "mm", format: "a4" },
    } as const;

    // Thực hiện chụp trực tiếp từ ref đã được đẩy ra ngoài màn hình
    html2pdf().set(opt).from(reviewRef.current).save();
  };
  if (success && savedBuildId) {
    return (
      <div className="space-y-5">
        <div className="rounded-sm border border-[rgba(78,242,176,0.5)] bg-[rgba(78,242,176,0.1)] px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="text-2xl">✨</div>
            <div>
              <h2 className="font-press text-lg text-[#4ef2b0]">
                Build Saved Successfully!
              </h2>
              <p className="mt-1 text-sm text-[#f3e5c7]">
                Your adventurer dossier has been added to the archive.
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <Button
              href={`/builds/${savedBuildId}`}
              variant="primary"
              className="px-6 py-3"
            >
              View Build
            </Button>
            <Button href="/builds" variant="ghost" className="px-6 py-3">
              Browse All Builds
            </Button>
            <Button href="/build" variant="ghost" className="px-6 py-3">
              Create Another
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rpg-panel ornate-border rounded-sm p-4 md:p-6">
        <h2 className="font-press text-2xl text-[#f0e6d2] drop-shadow-[0_2px_0_rgba(0,0,0,0.9),0_0_10px_rgba(0,0,0,0.45)]">
          Step 6: Seal the Dossier
        </h2>
        <p className="mt-3 text-sm leading-6 text-(--muted)">
          Name your adventurer, add notes, and choose whether to share publicly.
          Then save to the archive or export as PDF.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-5">
          {/* Build Details */}
          <div className="rpg-panel ornate-border rounded-sm p-5">
            <h3 className="font-press text-sm text-[#f0e6d2]">Build Details</h3>

            <label className="mt-4 flex flex-col gap-2 text-sm text-[#f3e5c7]">
              <span className="font-semibold">Character Name *</span>
              <input
                type="text"
                value={buildName}
                onChange={(e) => setBuildName(e.target.value)}
                placeholder="e.g., Eldrin the Wanderer"
                className="rpg-control rounded-sm px-3 py-3"
              />
            </label>

            <label className="mt-4 flex flex-col gap-2 text-sm text-[#f3e5c7]">
              <span className="font-semibold">Notes</span>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add campaign notes, backstory, or build rationale..."
                rows={4}
                className="rpg-control rounded-sm px-3 py-3"
              />
            </label>

            <label className="mt-4 flex items-center gap-3">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="h-4 w-4 cursor-pointer"
              />
              <span className="text-sm text-[#f3e5c7]">
                Make this build public
              </span>
            </label>
          </div>

          {/* Status Messages */}
          {error && (
            <div className="rounded-sm border border-[rgba(255,120,120,0.4)] bg-[rgba(64,18,18,0.6)] px-4 py-3 text-sm text-[#ffd9d2]">
              ⚠️ {error}
            </div>
          )}

          {/* Preview */}
          <div
            ref={reviewRef}
            style={{
              position: "absolute",
              left: "-9999px",
              top: "0",
              width: "800px", // Cố định chiều rộng để PDF không bị vỡ layout
            }}
          >
            <StepReview />
          </div>

          {/* Save Actions */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              variant="primary"
              className="px-6 py-3 flex-1"
              onClick={handleSave}
              disabled={!canSave || loading}
            >
              {loading ? "Saving..." : "Save to Archive"}
            </Button>
            <Button
              variant="ghost"
              className="px-6 py-3 flex-1"
              onClick={handleExportPDF}
              disabled={loading}
            >
              Export to PDF
            </Button>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-4">
          <div className="rpg-panel ornate-border rounded-sm p-5">
            <h3 className="font-press text-sm text-[#f0e6d2]">Checklist</h3>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span
                  className={
                    draft.level > 0 ? "text-[#4ef2b0]" : "text-(--muted)"
                  }
                >
                  {draft.level > 0 ? "✓" : "○"}
                </span>
                <span className="text-[#f3e5c7]">Level selected</span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={
                    draft.classRule ? "text-[#4ef2b0]" : "text-(--muted)"
                  }
                >
                  {draft.classRule ? "✓" : "○"}
                </span>
                <span className="text-[#f3e5c7]">Class chosen</span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={
                    draft.raceRule ? "text-[#4ef2b0]" : "text-(--muted)"
                  }
                >
                  {draft.raceRule ? "✓" : "○"}
                </span>
                <span className="text-[#f3e5c7]">Race chosen</span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={
                    buildName.trim().length > 0
                      ? "text-[#4ef2b0]"
                      : "text-(--muted)"
                  }
                >
                  {buildName.trim().length > 0 ? "✓" : "○"}
                </span>
                <span className="text-[#f3e5c7]">Name entered</span>
              </div>
            </div>
          </div>

          <div className="rpg-panel ornate-border rounded-sm p-5">
            <h3 className="font-press text-sm text-[#f0e6d2]">
              Share Settings
            </h3>
            <div className="mt-3 text-sm text-[#f3e5c7]">
              {isPublic ? (
                <p>🔓 This build will be visible in the public archive.</p>
              ) : (
                <p>
                  🔒 This build is private and only accessible via direct link.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Full Review Below */}
      <div>
        <h3 className="font-press mb-4 text-lg text-[#f0e6d2]">
          Full Character Review
        </h3>
        <StepReview />
      </div>
    </div>
  );
}
