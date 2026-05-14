"use client";

import type { BuildDetailDto } from "@/types/build-detail";
import { useState, useEffect } from "react";
import type React from "react";

type PDFDownloadLinkComponent = React.ComponentType<{
  document: React.ReactElement;
  fileName?: string;
  children?: (props: {
    loading: boolean;
    blob?: Blob | null;
    url?: string | null;
  }) => React.ReactNode;
}>;
import Button from "../Button";
import BuildDetailSheet from "./BuildDetailSheet";
import CharacterPDFDocument from "./CharacterPDFDocument";

export default function BuildDetailClient({
  build,
}: {
  build: BuildDetailDto;
}) {
  const [PDFDownloadLinkComp, setPDFDownloadLinkComp] =
    useState<PDFDownloadLinkComponent | null>(null);

  useEffect(() => {
    let mounted = true;
    import("@react-pdf/renderer")
      .then((mod) => {
        if (mounted)
          setPDFDownloadLinkComp(
            mod.PDFDownloadLink as PDFDownloadLinkComponent,
          );
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

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
            {PDFDownloadLinkComp ? (
              <PDFDownloadLinkComp
                document={<CharacterPDFDocument build={build} />}
                fileName={`${build.name || "character"}-dossier.pdf`}
              >
                {({ loading }: { loading: boolean }) => (
                  <Button variant="ghost" className="px-4 py-3">
                    {loading ? "Preparing..." : "Export to PDF"}
                  </Button>
                )}
              </PDFDownloadLinkComp>
            ) : (
              <Button variant="ghost" className="px-4 py-3">
                Export to PDF
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <BuildDetailSheet build={build} />
      </div>
    </div>
  );
}
