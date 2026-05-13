"use client";

import type { BuildDetailDto } from "@/types/build-detail";
import { useRef } from "react";
import Button from "../Button";
import BuildDetailSheet from "./BuildDetailSheet";

export default function BuildDetailClient({
  build,
}: {
  build: BuildDetailDto;
}) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);

  const waitForLayout = async () => {
    await Promise.all([
      (document as Document & { fonts?: FontFaceSet }).fonts?.ready ??
        Promise.resolve(),
      new Promise<void>((resolve) => requestAnimationFrame(() => resolve())),
      new Promise<void>((resolve) => requestAnimationFrame(() => resolve())),
    ]);
  };

  const handleExportPDF = async () => {
    const target = exportRef.current;
    if (!target) return;

    await waitForLayout();

    const html2pdf = (await import("html2pdf.js")).default;

    const opt = {
      margin: 8,
      filename: `${build.name || "character"}-dossier.pdf`,
      pagebreak: { mode: ["css", "legacy"] },
      image: { type: "jpeg", quality: 1 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: true,
        backgroundColor: "#efe2c9",
        scrollX: 0,
        scrollY: 0,
      },
      jsPDF: { orientation: "portrait", unit: "mm", format: "a4" },
    } as const;

    await html2pdf().set(opt).from(target).save();
  };

  return (
    <div className="space-y-6">
      <div className="rpg-panel ornate-border rounded-sm p-5 md:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <h1
              style={{ fontFamily: "var(--font-press)" }}
              className="text-3xl text-[#f0e6d2] drop-shadow-[2px_4px_0_rgba(0,0,0,0.95),0_0_14px_rgba(0,0,0,0.45)]"
            >
              {build.name}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#f3e5c7]">
              A level {build.level} dossier preserved in the archive.
              {build.classRef?.name ? ` ${build.classRef.name}` : ""}
              {build.raceRef?.name ? ` ${build.raceRef.name}` : ""}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              variant="ghost"
              className="px-4 py-3"
              onClick={handleExportPDF}
            >
              Export to PDF
            </Button>
          </div>
        </div>
      </div>

      <div ref={sheetRef} className="space-y-6">
        <BuildDetailSheet build={build} />
      </div>

      <div
        ref={exportRef}
        data-pdf-safe-export
        aria-hidden="true"
        className="pointer-events-none fixed top-0 overflow-hidden"
        style={{ left: "-10000px", width: "900px" }}
      >
        <BuildDetailSheet build={build} pdfSafe />
      </div>
    </div>
  );
}
