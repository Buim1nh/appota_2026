"use client";

import React from "react";
import Card from "../Card";
import {
  calculateDerivedStats,
  getAbilityModifier,
} from "@/utils/statCalculations";
import type { BuildDetailDto } from "@/types/build-detail";

const ABILITY_KEYS = ["str", "dex", "con", "int", "wis", "cha"] as const;

const ABILITY_LABELS: Record<(typeof ABILITY_KEYS)[number], string> = {
  str: "Strength",
  dex: "Dexterity",
  con: "Constitution",
  int: "Intelligence",
  wis: "Wisdom",
  cha: "Charisma",
};

function SectionHeader({
  title,
  pdfSafe = false,
}: {
  title: string;
  pdfSafe?: boolean;
}) {
  const lineClass = pdfSafe ? "bg-[#2e2418]" : "bg-[rgba(0,0,0,0.15)]";
  const titleClass = pdfSafe
    ? "font-press text-sm text-[#23170f]"
    : "font-press text-sm text-(--ink)";

  return (
    <div className="mb-3 flex items-center gap-3">
      <div className={`h-px flex-1 ${lineClass}`} />
      <h3 className={titleClass}>{title}</h3>
      <div className={`h-px flex-1 ${lineClass}`} />
    </div>
  );
}

function StatTile({
  label,
  value,
  pdfSafe = false,
}: {
  label: string;
  value: string;
  pdfSafe?: boolean;
}) {
  const tileClass = pdfSafe
    ? "rounded-sm border border-[#2e2418] bg-[#f8eed9] px-4 py-3"
    : "rounded-sm border border-[rgba(0,0,0,0.1)] bg-[rgba(0,0,0,0.03)] px-4 py-3";
  const labelClass = pdfSafe
    ? "text-[11px] font-semibold uppercase text-[#5c5142]"
    : "text-[11px] font-semibold uppercase text-gray-600";
  const valueClass = pdfSafe
    ? "mt-2 text-lg font-bold text-[#23170f]"
    : "mt-2 text-lg font-bold text-(--ink)";

  return (
    <div className={tileClass}>
      <div className={labelClass}>{label}</div>
      <div className={valueClass}>{value}</div>
    </div>
  );
}

function AbilityBox({
  ability,
  score,
  pdfSafe = false,
}: {
  ability: (typeof ABILITY_KEYS)[number];
  score: number;
  pdfSafe?: boolean;
}) {
  const modifier = getAbilityModifier(score);
  const boxClass = pdfSafe
    ? "rounded-sm border border-[#b68b2a] bg-[#f4e0b2] px-3 py-3 text-center"
    : "rounded-sm border border-(--gold) bg-[rgba(182,139,42,0.1)] px-3 py-3 text-center";
  const titleClass = pdfSafe
    ? "text-[11px] font-semibold uppercase text-[#5c5142]"
    : "text-[11px] font-semibold uppercase text-gray-600";
  const scoreClass = pdfSafe
    ? "mt-2 text-2xl font-bold text-[#23170f]"
    : "mt-2 text-2xl font-bold text-(--ink)";

  return (
    <div className={boxClass}>
      <div className={titleClass}>{ABILITY_LABELS[ability]}</div>
      <div className={scoreClass}>{score}</div>
      <div className="mt-1 text-sm font-semibold text-[#8a6a1c]">
        {modifier >= 0 ? "+" : ""}
        {modifier}
      </div>
    </div>
  );
}

function slotLabel(slot: string) {
  return (
    {
      head: "Head",
      chest: "Chest",
      mainHand: "Main Hand",
      offHand: "Off Hand",
      ring1: "Ring I",
      ring2: "Ring II",
      amulet: "Amulet",
    }[slot] || slot
  );
}

function OrnamentFrame({
  title,
  children,
  pdfSafe = false,
}: {
  title: string;
  children: React.ReactNode;
  pdfSafe?: boolean;
}) {
  if (pdfSafe) {
    return (
      <div className="rounded-sm border border-[#2e2418] bg-[#f4e8cf] p-5 shadow-[0_0_0_1px_rgba(70,50,30,0.12)]">
        <div className="mb-4 font-press text-sm text-[#23170f]">{title}</div>
        {children}
      </div>
    );
  }

  return (
    <Card title={title} className="rpg-panel">
      {children}
    </Card>
  );
}

function FeatureBlock({
  label,
  description,
  modifiers,
  pdfSafe = false,
}: {
  label: string;
  description?: string;
  modifiers?: Array<{ targetStat: string; type: string }>;
  pdfSafe?: boolean;
}) {
  const shellClass = pdfSafe
    ? "rounded-sm border border-[rgba(0,0,0,0.1)] bg-[#f8eed9] px-4 py-3 text-sm text-[#23170f]"
    : "rounded-sm border border-[rgba(0,0,0,0.1)] bg-[rgba(0,0,0,0.03)] px-4 py-3 text-sm text-(--ink)";

  return (
    <div className={shellClass}>
      <div className="font-semibold text-black">{label}</div>
      <div className="mt-2 leading-6 text-gray-700">
        {description || "No feature text available."}
      </div>
      {modifiers?.length ? (
        <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-black">
          {modifiers.slice(0, 4).map((modifier, index) => (
            <span key={`${label}-${index}`} className="badge-ornate">
              {modifier.targetStat} · {modifier.type}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function BuildDetailSheet({
  build,
  pdfSafe = false,
}: {
  build: BuildDetailDto;
  pdfSafe?: boolean;
}) {
  const derivedStats =
    build.derivedStats ?? calculateDerivedStats(build.baseStats, build.level);
  const equipmentEntries = Object.entries(build.equipment || {});
  const rootClass = pdfSafe
    ? "space-y-6 bg-[#efe2c9] p-6 text-[#23170f]"
    : "space-y-6";

  const featureCards = [
    { label: "Class Feature", rule: build.classRef },
    { label: "Subclass Feature", rule: build.subclassId },
    { label: "Race Feature", rule: build.raceRef },
    { label: "Background Feature", rule: build.backgroundRef },
  ];

  const infoPanel = pdfSafe ? (
    <div className="rounded-sm border border-[#2e2418] bg-[#f4e8cf] p-5 shadow-[0_0_0_1px_rgba(70,50,30,0.12)]">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatTile label="Level" value={`Lv ${build.level}`} pdfSafe />
        <StatTile
          label="Class"
          value={build.classRef?.name || "Unset"}
          pdfSafe
        />
        <StatTile label="Race" value={build.raceRef?.name || "Unset"} pdfSafe />
        <StatTile
          label="Background"
          value={build.backgroundRef?.name || "Unset"}
          pdfSafe
        />
      </div>
      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        {build.subclassId ? (
          <span className="badge-ornate">
            Subclass: {build.subclassId.name}
          </span>
        ) : null}
        {build.tags.map((tag) => (
          <span key={tag} className="badge-ornate">
            {tag}
          </span>
        ))}
        <span className="badge-ornate">
          {build.isPublic ? "Public" : "Private"}
        </span>
        <span className="badge-ornate">Score {build.optimizationScore}</span>
      </div>
    </div>
  ) : (
    <Card title={build.name} className="rpg-panel">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatTile label="Level" value={`Lv ${build.level}`} />
        <StatTile label="Class" value={build.classRef?.name || "Unset"} />
        <StatTile label="Race" value={build.raceRef?.name || "Unset"} />
        <StatTile
          label="Background"
          value={build.backgroundRef?.name || "Unset"}
        />
      </div>
      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        {build.subclassId ? (
          <span className="badge-ornate">
            Subclass: {build.subclassId.name}
          </span>
        ) : null}
        {build.tags.map((tag) => (
          <span key={tag} className="badge-ornate">
            {tag}
          </span>
        ))}
        <span className="badge-ornate">
          {build.isPublic ? "Public" : "Private"}
        </span>
        <span className="badge-ornate">Score {build.optimizationScore}</span>
      </div>
    </Card>
  );

  return (
    <div
      className={rootClass}
      data-pdf-safe-export={pdfSafe ? "true" : undefined}
    >
      {infoPanel}

      <OrnamentFrame title="Ability Scores" pdfSafe={pdfSafe}>
        <SectionHeader title="Base Stats" pdfSafe={pdfSafe} />
        <div className="grid gap-3 md:grid-cols-3">
          {ABILITY_KEYS.map((ability) => (
            <AbilityBox
              key={ability}
              ability={ability}
              score={build.baseStats[ability]}
              pdfSafe={pdfSafe}
            />
          ))}
        </div>
      </OrnamentFrame>

      <OrnamentFrame title="Derived Stats" pdfSafe={pdfSafe}>
        <SectionHeader title="Combat & Defenses" pdfSafe={pdfSafe} />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatTile
            label="Hit Points"
            value={`${derivedStats.hp.max}`}
            pdfSafe={pdfSafe}
          />
          <StatTile
            label="Armor Class"
            value={`${derivedStats.ac}`}
            pdfSafe={pdfSafe}
          />
          <StatTile
            label="Initiative"
            value={`${derivedStats.initiative >= 0 ? "+" : ""}${derivedStats.initiative}`}
            pdfSafe={pdfSafe}
          />
          <StatTile
            label="Proficiency Bonus"
            value={`+${derivedStats.proficiencyBonus}`}
            pdfSafe={pdfSafe}
          />
          <StatTile
            label="Speed"
            value={`${derivedStats.speed} ft`}
            pdfSafe={pdfSafe}
          />
          <StatTile
            label="Spell Save DC"
            value={`${derivedStats.spellSaveDC}`}
            pdfSafe={pdfSafe}
          />
          <StatTile
            label="Attack Bonus"
            value={`+${derivedStats.attackBonus}`}
            pdfSafe={pdfSafe}
          />
          <StatTile
            label="Carry Capacity"
            value={`${derivedStats.carryWeight.max} lb`}
            pdfSafe={pdfSafe}
          />
        </div>
      </OrnamentFrame>

      <OrnamentFrame title="Features" pdfSafe={pdfSafe}>
        <SectionHeader title="Class, Race, and Background" pdfSafe={pdfSafe} />
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {featureCards.map(({ label, rule }) => (
            <FeatureBlock
              key={label}
              label={label}
              description={rule?.description}
              modifiers={rule?.modifiers}
              pdfSafe={pdfSafe}
            />
          ))}
        </div>
      </OrnamentFrame>

      <div className="grid gap-6 xl:grid-cols-2">
        <OrnamentFrame title="Spells" pdfSafe={pdfSafe}>
          <SectionHeader title="Spellbook" pdfSafe={pdfSafe} />
          {build.spells.length > 0 ? (
            <div className="space-y-3">
              {build.spells.map((spell) => (
                <div
                  key={spell._id}
                  className={
                    pdfSafe
                      ? "rounded-sm border border-[rgba(0,0,0,0.1)] bg-[#f8eed9] px-4 py-3 text-sm text-[#23170f]"
                      : "rounded-sm border border-[rgba(0,0,0,0.1)] bg-[rgba(0,0,0,0.03)] px-4 py-3 text-sm text-(--ink)"
                  }
                >
                  <div className="font-semibold text-black">{spell.name}</div>
                  <div className="mt-1 text-xs text-gray-600">
                    Level {spell.level} · {spell.school} · {spell.castingTime}
                  </div>
                  {spell.description ? (
                    <p className="mt-2 leading-6 text-gray-800">
                      {spell.description}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm leading-6 text-gray-600">
              No spells recorded for this build.
            </p>
          )}
        </OrnamentFrame>

        <OrnamentFrame title="Feats" pdfSafe={pdfSafe}>
          <SectionHeader title="Feat Archive" pdfSafe={pdfSafe} />
          {build.feats.length > 0 ? (
            <div className="space-y-3">
              {build.feats.map((feat) => (
                <div
                  key={feat._id}
                  className={
                    pdfSafe
                      ? "rounded-sm border border-[rgba(0,0,0,0.1)] bg-[#f8eed9] px-4 py-3 text-sm text-[#23170f]"
                      : "rounded-sm border border-[rgba(0,0,0,0.1)] bg-[rgba(0,0,0,0.03)] px-4 py-3 text-sm text-(--ink)"
                  }
                >
                  <div className="font-semibold text-black">{feat.name}</div>
                  {feat.description ? (
                    <p className="mt-2 leading-6 text-gray-800">
                      {feat.description}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm leading-6 text-gray-600">
              No feats attached to this build.
            </p>
          )}
        </OrnamentFrame>
      </div>

      <OrnamentFrame title="Equipment" pdfSafe={pdfSafe}>
        <SectionHeader title="Gear Loadout" pdfSafe={pdfSafe} />
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {equipmentEntries.map(([slot, item]) => (
            <div
              key={slot}
              className={
                pdfSafe
                  ? "rounded-sm border border-[rgba(0,0,0,0.1)] bg-[#f8eed9] px-4 py-3 text-sm text-[#23170f]"
                  : "rounded-sm border border-[rgba(0,0,0,0.1)] bg-[rgba(0,0,0,0.03)] px-4 py-3 text-sm text-(--ink)"
              }
            >
              <div className="font-semibold text-black">{slotLabel(slot)}</div>
              <div className="mt-2 leading-6 text-gray-700">
                {item?.name || "Unequipped"}
              </div>
            </div>
          ))}
        </div>
      </OrnamentFrame>

      {build.notes ? (
        <OrnamentFrame title="Dossier Notes" pdfSafe={pdfSafe}>
          <p className="text-sm leading-6 text-(--ink)">{build.notes}</p>
        </OrnamentFrame>
      ) : null}

      {pdfSafe ? (
        <style jsx global>{`
          [data-pdf-safe-export] .badge-ornate {
            background: #e8dcc2;
            color: #23170f;
            border-color: rgba(0, 0, 0, 0.12);
          }
        `}</style>
      ) : null}
    </div>
  );
}
