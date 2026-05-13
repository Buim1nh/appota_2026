"use client";
import React from "react";
import Link from "next/link";

type IBuild = {
  _id: string;
  id: string;
  name: string;
  class?: string;
  race?: string;
  classRef?: { name: string };
  raceRef?: { name: string };
  level: number;
  optimizationScore: number;
  tags: string[];
};

import Card from "./Card";

export default function BuildCard({ build }: { build: IBuild }) {
  const className = build.classRef?.name || build.class || "Unknown";
  const raceName = build.raceRef?.name || build.race || "Unknown";
  const buildId = build._id || build.id;

  return (
    <Link href={`/builds/${buildId}`} className="no-underline">
      <Card title={build.name} className="cursor-pointer">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="mt-1 text-xs dossier-subtle text-ink">
              {className} • {raceName}
            </div>
          </div>

          <div className="text-right">
            <div className="text-sm font-medium text-ink">Lv {build.level}</div>
            <div className="mt-1 text-xs dossier-subtle text-ink">
              Score {build.optimizationScore}
            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {build.tags.map((t) => (
            <span key={t} className="badge-ornate">
              {t}
            </span>
          ))}
        </div>
      </Card>
    </Link>
  );
}
