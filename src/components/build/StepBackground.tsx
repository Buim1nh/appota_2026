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

function buildBackgroundOptions(rule?: GameRuleDto | null) {
  if (!rule) return [] as string[];

  const abilityMatch = rule.description?.match(/Ability:\s*([^.]*)/i);
  const featMatch = rule.description?.match(/Feat:\s*([^.]*)/i);
  const fragments = rule.description
    ? rule.description
        .split(".")
        .map((part) => part.trim())
        .filter(Boolean)
        .slice(0, 3)
    : [];

  return Array.from(
    new Set(
      [
        rule.description ? "Background overview" : "",
        abilityMatch?.[1]?.trim() || "",
        featMatch?.[1]?.trim() || "",
        ...fragments,
      ].filter(Boolean),
    ),
  );
}

export default function StepBackground() {
  const draft = useBuildDraftStore((state) => state.draft);
  const selectBackground = useBuildDraftStore(
    (state) => state.selectBackground,
  );
  const updateDraft = useBuildDraftStore((state) => state.updateDraft);

  const [backgrounds, setBackgrounds] = useState<GameRuleDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadBackgrounds() {
      try {
        setLoading(true);
        const data = await fetchGameRules("background");
        if (active) {
          setBackgrounds(data);
        }
      } catch (loadError) {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load backgrounds.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadBackgrounds();

    return () => {
      active = false;
    };
  }, []);

  const selectedBackground = useMemo(
    () =>
      backgrounds.find((rule) => rule._id === draft.backgroundRule?.id) ?? null,
    [backgrounds, draft.backgroundRule?.id],
  );

  const featureOptions = useMemo(
    () => buildBackgroundOptions(selectedBackground),
    [selectedBackground],
  );

  useEffect(() => {
    if (!featureOptions.length) {
      if (draft.backgroundFeature) {
        updateDraft({ backgroundFeature: "" });
      }
      return;
    }

    if (!featureOptions.includes(draft.backgroundFeature)) {
      updateDraft({ backgroundFeature: featureOptions[0] });
    }
  }, [draft.backgroundFeature, featureOptions, updateDraft]);

  return (
    <div className="space-y-5">
      <div className="rpg-panel ornate-border rounded-sm p-4 md:p-5">
        <h2 className="font-press text-xl text-[#f0e6d2] drop-shadow-[0_2px_0_rgba(0,0,0,0.9),0_0_10px_rgba(0,0,0,0.45)]">
          Step 3: Choose a Background
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[#f3e5c7]">
          Ground the character in the world with a background that supplies the
          narrative hooks, proficiencies, and feature flavor for the build.
        </p>
      </div>

      {error ? (
        <div className="rounded-sm border border-[rgba(255,120,120,0.4)] bg-[rgba(64,18,18,0.6)] px-4 py-3 text-sm text-[#ffd9d2]">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {loading && backgrounds.length === 0 ? (
          <div className="rpg-panel ornate-border rounded-sm p-5 text-sm text-[#e8d9b6]">
            Loading backgrounds from the archive...
          </div>
        ) : (
          backgrounds.map((rule) => (
            <RuleCard
              key={rule._id}
              title={rule.name}
              description={rule.description}
              selected={draft.backgroundRule?.id === rule._id}
              onSelect={() => selectBackground(toSelection(rule))}
            />
          ))
        )}
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="rpg-panel ornate-border rounded-sm p-5">
          <h3 className="font-press text-sm text-[#f0e6d2]">
            Features and Proficiencies
          </h3>
          <p className="mt-2 text-sm text-(--muted)">
            Pick the background feature that best matches the dossier narrative.
          </p>

          <label className="mt-4 flex flex-col gap-2 text-sm text-[#f3e5c7]">
            <span className="font-semibold">Background Feature</span>
            <select
              className="rpg-control rounded-sm px-3 py-3"
              value={draft.backgroundFeature}
              onChange={(event) =>
                updateDraft({ backgroundFeature: event.target.value })
              }
              disabled={!featureOptions.length}
            >
              {featureOptions.length === 0 ? (
                <option value="">Select a background first</option>
              ) : null}
              {featureOptions.map((feature) => (
                <option key={feature} value={feature}>
                  {feature}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="rpg-panel ornate-border rounded-sm p-5">
          <h3 className="font-press text-sm text-[#f0e6d2]">
            Selected Background
          </h3>
          {selectedBackground ? (
            <div className="mt-3 rounded-sm border border-(--border) bg-[rgba(255,255,255,0.04)] p-4 text-sm text-[#f3e5c7]">
              <div className="font-semibold text-[#f0e6d2]">
                {selectedBackground.name}
              </div>
              {selectedBackground.description ? (
                <p className="mt-2 leading-6 text-[#e9ddc1]">
                  {selectedBackground.description}
                </p>
              ) : null}
            </div>
          ) : (
            <p className="mt-3 text-sm leading-6 text-(--muted)">
              Choose a background card to reveal its prose and feature dropdown.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
