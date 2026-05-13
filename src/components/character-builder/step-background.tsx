"use client";

import { ViewTransition } from "react";
import { useEffect, useMemo, useState } from "react";

import { Card, CardDescription, CardTitle } from "@/components/shared/card";
import { Field, Select } from "@/components/shared/field";
import type { RuleRecord } from "@/types/character-builder";
import {
  getRulesByCategory,
  getTraitGroups,
} from "@/utils/character-builder-rules";

import { useWizardActions, useWizardSelector } from "./wizard-context";

export function StepBackground() {
  const backgroundStep = useWizardSelector((state) => state.backgroundStep);
  const actions = useWizardActions();

  const [backgrounds, setBackgrounds] = useState<RuleRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    setIsLoading(true);
    getRulesByCategory("background")
      .then((rules) => {
        if (cancelled) return;
        setBackgrounds(rules);
      })
      .finally(() => {
        if (cancelled) return;
        setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const selectedBackground = useMemo(
    () =>
      backgrounds.find((entry) => entry._id === backgroundStep.backgroundId),
    [backgroundStep.backgroundId, backgrounds],
  );

  const traitGroups = useMemo(
    () => getTraitGroups(selectedBackground, "Proficiency"),
    [selectedBackground],
  );

  return (
    <ViewTransition enter="slide-up" exit="slide-down" default="none">
      <Card>
        <CardTitle>Background Selection</CardTitle>
        <CardDescription>
          Loaded from /api/rules?category=background with dynamic proficiency
          choices.
        </CardDescription>

        <div className="mt-5 grid gap-4">
          <Field label="Background" description="Select your backstory anchor.">
            <Select
              value={backgroundStep.backgroundId}
              disabled={isLoading}
              onChange={(event) => actions.setBackgroundId(event.target.value)}
            >
              <option value="">Select background...</option>
              {backgrounds.map((entry) => (
                <option key={entry._id} value={entry._id}>
                  {entry.name}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        {selectedBackground ? (
          <ViewTransition
            name={`background-details-${selectedBackground._id}`}
            share="morph"
            default="none"
          >
            <article className="mt-6 rounded-xl border border-[#3f3a30] bg-[#100e0a] p-4">
              <h3 className="font-(family-name:--font-cormorant) text-xl text-[#f3ecd8]">
                {selectedBackground.name}
              </h3>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-[#bab3a0]">
                {selectedBackground.description ||
                  "No background details available."}
              </p>
            </article>
          </ViewTransition>
        ) : null}

        {traitGroups.length > 0 ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {traitGroups.map((group) => (
              <Field key={group.key} label={group.label}>
                <Select
                  value={backgroundStep.proficiencySelections[group.key] ?? ""}
                  onChange={(event) =>
                    actions.setBackgroundTraitSelection(
                      group.key,
                      event.target.value,
                    )
                  }
                >
                  <option value="">Choose option...</option>
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
