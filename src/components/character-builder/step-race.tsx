"use client";

import { ViewTransition } from "react";
import { useEffect, useMemo, useState } from "react";

import { Card, CardDescription, CardTitle } from "@/components/shared/card";
import { Field, Select } from "@/components/shared/field";
import type { RuleRecord } from "@/types/character-builder";
import {
  getRulesByCategory,
  getRulesByParent,
  getTraitGroups,
} from "@/utils/character-builder-rules";

import { useWizardActions, useWizardSelector } from "./wizard-context";

export function StepRace() {
  const raceStep = useWizardSelector((state) => state.raceStep);
  const actions = useWizardActions();

  const [races, setRaces] = useState<RuleRecord[]>([]);
  const [subraces, setSubraces] = useState<RuleRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    getRulesByCategory("race")
      .then((rules) => {
        if (cancelled) return;
        setRaces(rules);
      })
      .finally(() => {
        if (cancelled) return;
        setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    if (!raceStep.raceId) {
      setSubraces([]);
      return;
    }

    getRulesByParent("subrace", raceStep.raceId)
      .then((rules) => {
        if (cancelled) return;
        setSubraces(rules);
      })
      .catch(() => {
        if (cancelled) return;
        setSubraces([]);
      });

    return () => {
      cancelled = true;
    };
  }, [raceStep.raceId]);

  const selectedRace = useMemo(
    () => races.find((entry) => entry._id === raceStep.raceId),
    [races, raceStep.raceId],
  );

  const traitGroups = useMemo(
    () => getTraitGroups(selectedRace, "Racial Trait"),
    [selectedRace],
  );

  return (
    <ViewTransition enter="slide-up" exit="slide-down" default="none">
      <Card>
        <CardTitle>Race Selection</CardTitle>
        <CardDescription>
          Pulled from /api/rules?category=race with dynamic subrace and trait
          options.
        </CardDescription>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label="Race" description="Choose your ancestry.">
            <Select
              value={raceStep.raceId}
              disabled={isLoading}
              onChange={(event) => actions.setRaceId(event.target.value)}
            >
              <option value="">Select race...</option>
              {races.map((entry) => (
                <option key={entry._id} value={entry._id}>
                  {entry.name}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Subrace" description="Optional specialization.">
            <Select
              value={raceStep.subraceId}
              disabled={subraces.length === 0}
              onChange={(event) => actions.setSubraceId(event.target.value)}
            >
              <option value="">Select subrace...</option>
              {subraces.map((entry) => (
                <option key={entry._id} value={entry._id}>
                  {entry.name}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        {selectedRace ? (
          <ViewTransition
            name={`race-details-${selectedRace._id}`}
            share="morph"
            default="none"
          >
            <article className="mt-6 rounded-xl border border-[#3f3a30] bg-[#100e0a] p-4">
              <h3 className="font-(family-name:--font-cormorant) text-xl text-[#f3ecd8]">
                {selectedRace.name}
              </h3>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-[#bab3a0]">
                {selectedRace.description || "No race details available."}
              </p>
            </article>
          </ViewTransition>
        ) : null}

        {traitGroups.length > 0 ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {traitGroups.map((group) => (
              <Field key={group.key} label={group.label}>
                <Select
                  value={raceStep.traitSelections[group.key] ?? ""}
                  onChange={(event) =>
                    actions.setRaceTraitSelection(group.key, event.target.value)
                  }
                >
                  <option value="">Choose trait...</option>
                  {group.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </Field>
            ))}
          </div>
        ) : null}
      </Card>
    </ViewTransition>
  );
}
