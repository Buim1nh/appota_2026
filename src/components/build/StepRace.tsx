"use client";

import React, { useEffect, useMemo, useState } from "react";
import { fetchGameRules, type GameRuleDto } from "@/lib/gameRulesClient";
import { useBuildDraftStore } from "@/store/build-draft-store";
import RuleCard from "./RuleCard";

function toSelection(rule: GameRuleDto) {
  return {
    id: rule._id,
    name: rule.name,
    description: rule.description,
    category: rule.category,
  };
}

function buildTraitOptions(rule?: GameRuleDto | null) {
  if (!rule) return [] as string[];

  const modifierOptions = (rule.modifiers || []).map((modifier) => {
    return `${modifier.targetStat} · ${modifier.value}`;
  });

  const descriptionChunks = rule.description
    ? rule.description
        .split(".")
        .map((part) => part.trim())
        .filter(Boolean)
        .slice(0, 3)
    : [];

  return Array.from(
    new Set(
      [
        rule.description ? "Species overview" : "",
        ...descriptionChunks,
        ...modifierOptions,
      ].filter(Boolean),
    ),
  );
}

export default function StepRace() {
  const draft = useBuildDraftStore((state) => state.draft);
  const selectRace = useBuildDraftStore((state) => state.selectRace);
  const updateDraft = useBuildDraftStore((state) => state.updateDraft);

  const [races, setRaces] = useState<GameRuleDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadRaces() {
      try {
        setLoading(true);
        const data = await fetchGameRules("race");
        if (active) {
          setRaces(data);
        }
      } catch (loadError) {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load races.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadRaces();

    return () => {
      active = false;
    };
  }, []);

  const selectedRace = useMemo(
    () => races.find((rule) => rule._id === draft.raceRule?.id) ?? null,
    [draft.raceRule?.id, races],
  );

  const traitOptions = useMemo(
    () => buildTraitOptions(selectedRace),
    [selectedRace],
  );

  useEffect(() => {
    if (!traitOptions.length) {
      if (draft.raceTrait) {
        updateDraft({ raceTrait: "" });
      }
      return;
    }

    if (!traitOptions.includes(draft.raceTrait)) {
      updateDraft({ raceTrait: traitOptions[0] });
    }
  }, [draft.raceTrait, traitOptions, updateDraft]);

  return (
    <div className="space-y-5">
      <div className="rpg-panel ornate-border rounded-sm p-4 md:p-5">
        <h2 className="font-press text-xl text-[#f0e6d2] drop-shadow-[0_2px_0_rgba(0,0,0,0.9),0_0_10px_rgba(0,0,0,0.45)]">
          Step 2: Choose a Race
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[#f3e5c7]">
          Shape the bloodline and heritage of the build. Each race card reflects
          the stat modifiers and narrative details stored in the rule archive.
        </p>
      </div>

      {error ? (
        <div className="rounded-sm border border-[rgba(255,120,120,0.4)] bg-[rgba(64,18,18,0.6)] px-4 py-3 text-sm text-[#ffd9d2]">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {loading && races.length === 0 ? (
          <div className="rpg-panel ornate-border rounded-sm p-5 text-sm text-[#e8d9b6]">
            Loading races from the archive...
          </div>
        ) : (
          races.map((rule) => (
            <RuleCard
              key={rule._id}
              title={rule.name}
              description={rule.description}
              selected={draft.raceRule?.id === rule._id}
              onSelect={() => selectRace(toSelection(rule))}
              footer={
                <div className="flex flex-wrap gap-2 text-[11px] text-[color:var(--muted)]">
                  {(rule.modifiers || []).slice(0, 3).map((modifier) => (
                    <span key={`${modifier.targetStat}-${modifier.value}`}>
                      {modifier.targetStat} · {String(modifier.value)}
                    </span>
                  ))}
                </div>
              }
            />
          ))
        )}
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="rpg-panel ornate-border rounded-sm p-5">
          <h3 className="font-press text-sm text-[#f0e6d2]">Trait Dropdown</h3>
          <p className="mt-2 text-sm text-[color:var(--muted)]">
            Use the dropdown to lock in a trait focus for the selected race.
          </p>

          <label className="mt-4 flex flex-col gap-2 text-sm text-[#f3e5c7]">
            <span className="font-semibold">Racial Trait</span>
            <select
              className="rpg-control rounded-sm px-3 py-3"
              value={draft.raceTrait}
              onChange={(event) =>
                updateDraft({ raceTrait: event.target.value })
              }
              disabled={!traitOptions.length}
            >
              {traitOptions.length === 0 ? (
                <option value="">Select a race first</option>
              ) : null}
              {traitOptions.map((trait) => (
                <option key={trait} value={trait}>
                  {trait}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="rpg-panel ornate-border rounded-sm p-5">
          <h3 className="font-press text-sm text-[#f0e6d2]">Selected Race</h3>
          {selectedRace ? (
            <div className="mt-3 rounded-sm border border-[color:var(--border)] bg-[rgba(255,255,255,0.04)] p-4 text-sm text-[#f3e5c7]">
              <div className="font-semibold text-[#f0e6d2]">
                {selectedRace.name}
              </div>
              {selectedRace.description ? (
                <p className="mt-2 leading-6 text-[#e9ddc1]">
                  {selectedRace.description}
                </p>
              ) : null}
            </div>
          ) : (
            <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">
              Choose a race card to reveal its lore and trait options.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
