"use client";

import React from "react";
import { useBuildDraftStore } from "@/store/build-draft-store";
import {
  calculateDerivedStats,
  getAbilityModifier,
} from "@/utils/statCalculations";
import Card from "../Card";

const ABILITY_NAMES: Record<string, string> = {
  str: "Strength",
  dex: "Dexterity",
  con: "Constitution",
  int: "Intelligence",
  wis: "Wisdom",
  cha: "Charisma",
};

const ABILITY_KEYS = ["str", "dex", "con", "int", "wis", "cha"] as const;

function StatBox({ ability, score }: { ability: string; score: number }) {
  const mod = getAbilityModifier(score);
  return (
    <div className="rounded-sm border border-(--gold) bg-[rgba(182,139,42,0.08)] px-3 py-3 text-center">
      <div className="text-[11px] font-semibold uppercase text-(--muted)">
        {ability}
      </div>
      <div className="mt-2 text-lg font-bold text-[#f0e6d2]">{score}</div>
      <div className="mt-1 text-sm font-semibold text-(--gold)">
        {mod >= 0 ? "+" : ""}
        {mod}
      </div>
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="mb-3 flex items-center gap-3">
      <div className="h-px flex-1 bg-(--border)" />
      <h3 className="font-press text-sm text-[#f0e6d2]">{title}</h3>
      <div className="h-px flex-1 bg-(--border)" />
    </div>
  );
}

export default function StepReview() {
  const draft = useBuildDraftStore((state) => state.draft);
  const derivedStats = calculateDerivedStats(draft.stats, draft.level);

  return (
    <div className="space-y-6">
      <div className="rpg-panel ornate-border rounded-sm p-4 md:p-6">
        <h2 className="font-press text-2xl text-[#f0e6d2] drop-shadow-[0_2px_0_rgba(0,0,0,0.9),0_0_10px_rgba(0,0,0,0.45)]">
          Step 5: Character Review
        </h2>
        <p className="mt-3 text-sm leading-6 text-(--muted)">
          Here is your complete character summary. All stats and modifiers are
          calculated and ready for finalization.
        </p>
      </div>

      {/* Header Info */}
      <div className="rpg-panel ornate-border rounded-sm p-5">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <div className="text-[11px] font-semibold uppercase text-(--muted)">
              Level
            </div>
            <div className="mt-1 text-2xl font-bold text-[#f0e6d2]">
              {draft.level}
            </div>
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase text-(--muted)">
              Class
            </div>
            <div className="mt-1 text-lg font-bold text-[#f0e6d2]">
              {draft.classRule?.name || "Unset"}
            </div>
            {draft.subclassRule && (
              <div className="mt-1 text-xs text-(--muted)">
                {draft.subclassRule.name}
              </div>
            )}
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase text-(--muted)">
              Race
            </div>
            <div className="mt-1 text-lg font-bold text-[#f0e6d2]">
              {draft.raceRule?.name || "Unset"}
            </div>
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase text-(--muted)">
              Background
            </div>
            <div className="mt-1 text-lg font-bold text-[#f0e6d2]">
              {draft.backgroundRule?.name || "Unset"}
            </div>
          </div>
        </div>
      </div>

      {/* Ability Scores */}
      <div className="rpg-panel ornate-border rounded-sm p-5">
        <SectionHeader title="Ability Scores" />
        <div className="grid gap-3 md:grid-cols-3">
          {ABILITY_KEYS.map((ability) => (
            <StatBox
              key={ability}
              ability={ability.toUpperCase()}
              score={draft.stats[ability]}
            />
          ))}
        </div>
      </div>

      {/* Combat Stats */}
      <div className="rpg-panel ornate-border rounded-sm p-5">
        <SectionHeader title="Combat & Defenses" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-sm border border-(--border) bg-[rgba(255,255,255,0.04)] px-4 py-3">
            <div className="text-[11px] font-semibold uppercase text-(--muted)">
              Hit Points
            </div>
            <div className="mt-2 text-2xl font-bold text-[#f0e6d2]">
              {derivedStats.hp.max}
            </div>
          </div>

          <div className="rounded-sm border border-(--border) bg-[rgba(255,255,255,0.04)] px-4 py-3">
            <div className="text-[11px] font-semibold uppercase text-(--muted)">
              Armor Class
            </div>
            <div className="mt-2 text-2xl font-bold text-[#f0e6d2]">
              {derivedStats.ac}
            </div>
          </div>

          <div className="rounded-sm border border-(--border) bg-[rgba(255,255,255,0.04)] px-4 py-3">
            <div className="text-[11px] font-semibold uppercase text-(--muted)">
              Initiative
            </div>
            <div className="mt-2 text-2xl font-bold text-[#f0e6d2]">
              {derivedStats.initiative >= 0 ? "+" : ""}
              {derivedStats.initiative}
            </div>
          </div>

          <div className="rounded-sm border border-(--border) bg-[rgba(255,255,255,0.04)] px-4 py-3">
            <div className="text-[11px] font-semibold uppercase text-(--muted)">
              Proficiency Bonus
            </div>
            <div className="mt-2 text-2xl font-bold text-[#f0e6d2]">
              +{derivedStats.proficiencyBonus}
            </div>
          </div>

          <div className="rounded-sm border border-(--border) bg-[rgba(255,255,255,0.04)] px-4 py-3">
            <div className="text-[11px] font-semibold uppercase text-(--muted)">
              Speed
            </div>
            <div className="mt-2 text-2xl font-bold text-[#f0e6d2]">
              {derivedStats.speed} ft
            </div>
          </div>

          <div className="rounded-sm border border-(--border) bg-[rgba(255,255,255,0.04)] px-4 py-3">
            <div className="text-[11px] font-semibold uppercase text-(--muted)">
              Spell Save DC
            </div>
            <div className="mt-2 text-2xl font-bold text-[#f0e6d2]">
              {derivedStats.spellSaveDC}
            </div>
          </div>

          <div className="rounded-sm border border-(--border) bg-[rgba(255,255,255,0.04)] px-4 py-3">
            <div className="text-[11px] font-semibold uppercase text-(--muted)">
              Attack Bonus
            </div>
            <div className="mt-2 text-2xl font-bold text-[#f0e6d2]">
              +{derivedStats.attackBonus}
            </div>
          </div>

          <div className="rounded-sm border border-(--border) bg-[rgba(255,255,255,0.04)] px-4 py-3">
            <div className="text-[11px] font-semibold uppercase text-(--muted)">
              Carry Capacity
            </div>
            <div className="mt-2 text-xl font-bold text-[#f0e6d2]">
              {derivedStats.carryWeight.max} lb
            </div>
          </div>
        </div>
      </div>

      {/* Features & Traits */}
      <div className="rpg-panel ornate-border rounded-sm p-5">
        <SectionHeader title="Features & Traits" />
        <div className="grid gap-3 md:grid-cols-3">
          <div>
            <div className="text-[11px] font-semibold uppercase text-(--muted)">
              Class Feature
            </div>
            <div className="mt-2 rounded-sm border border-(--border) bg-[rgba(255,255,255,0.04)] px-3 py-2 text-sm text-[#f3e5c7]">
              {draft.classRule?.description || draft.classFeature || "Unset"}
            </div>
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase text-(--muted)">
              Racial Trait
            </div>
            <div className="mt-2 rounded-sm border border-(--border) bg-[rgba(255,255,255,0.04)] px-3 py-2 text-sm text-[#f3e5c7]">
              {draft.raceRule?.description || draft.raceTrait || "Unset"}
            </div>
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase text-(--muted)">
              Background Feature
            </div>
            <div className="mt-2 rounded-sm border border-(--border) bg-[rgba(255,255,255,0.04)] px-3 py-2 text-sm text-[#f3e5c7]">
              {draft.backgroundRule?.description ||
                draft.backgroundFeature ||
                "Unset"}
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      {draft.stats.str >= 0 && (
        <Card title="Character Summary" className="rpg-panel">
          <div className="space-y-2 text-sm leading-6 text-[#000000]">
            <p>
              A level {draft.level} {draft.classRule?.name || "class unknown"}{" "}
              {draft.raceRule?.name || "race unknown"} with{" "}
              {draft.backgroundRule?.name || "unknown background"}.
            </p>
            <p>
              Strongest in{" "}
              {
                ABILITY_NAMES[
                  ABILITY_KEYS.reduce((a, b) =>
                    draft.stats[a] > draft.stats[b] ? a : b,
                  )
                ]
              }
              , with solid{" "}
              {
                ABILITY_NAMES[
                  ABILITY_KEYS.reduce((a, b) =>
                    draft.stats[a] < draft.stats[b] ? a : b,
                  )
                ]
              }
              .
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
