"use client";

import { ViewTransition } from "react";
import { useMemo, useState } from "react";

import { Button } from "@/components/shared/button";
import { Card, CardDescription, CardTitle } from "@/components/shared/card";
import { Field, Input } from "@/components/shared/field";
import { clampScore, rollStatValue } from "@/utils/character-builder-rules";

import { useAbilityScores, useWizardActions } from "./wizard-context";

const ABILITY_KEYS = ["str", "dex", "con", "int", "wis", "cha"] as const;
type AbilityKey = (typeof ABILITY_KEYS)[number];

export function StepStats() {
  const baseStats = useAbilityScores();
  const actions = useWizardActions();
  const [mode, setMode] = useState<"roll" | "manual">("roll");

  const total = useMemo(
    () => ABILITY_KEYS.reduce((sum, key) => sum + baseStats[key], 0),
    [baseStats],
  );

  const rollAll = () => {
    const rolled = {
      str: rollStatValue(),
      dex: rollStatValue(),
      con: rollStatValue(),
      int: rollStatValue(),
      wis: rollStatValue(),
      cha: rollStatValue(),
    };
    actions.setAllAbilityScores(rolled);
  };

  return (
    <ViewTransition enter="slide-up" exit="slide-down" default="none">
      <Card>
        <CardTitle>Ability Scores</CardTitle>
        <CardDescription>
          Choose Roll Dice for generated stats, or Manual Input for direct
          editing. Values are clamped to 1-30.
        </CardDescription>

        <div className="mt-5 flex flex-wrap gap-2">
          <Button
            type="button"
            variant={mode === "roll" ? "primary" : "ghost"}
            onClick={() => setMode("roll")}
          >
            Roll Dice
          </Button>
          <Button
            type="button"
            variant={mode === "manual" ? "primary" : "ghost"}
            onClick={() => setMode("manual")}
          >
            Manual Input
          </Button>
        </div>

        {mode === "roll" ? (
          <section className="mt-5 rounded-xl border border-[#3f3a30] bg-[#100e0a] p-4">
            <p className="text-sm text-[#bbb39f]">
              Uses 4d6 drop-lowest per stat and stores the result in
              Build.baseStats.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Button type="button" variant="secondary" onClick={rollAll}>
                Roll All Stats
              </Button>
              <p className="text-xs uppercase tracking-[0.1em] text-[#b4ad9a]">
                Total: {total}
              </p>
            </div>
          </section>
        ) : null}

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {ABILITY_KEYS.map((ability) => (
            <Field
              key={ability}
              label={ability.toUpperCase()}
              description="Integer from 1 to 30"
            >
              <Input
                type="number"
                min={1}
                max={30}
                value={baseStats[ability]}
                onChange={(event) => {
                  const value = clampScore(
                    Number.parseInt(event.target.value, 10),
                  );
                  actions.setAbilityScore(ability as AbilityKey, value);
                }}
              />
            </Field>
          ))}
        </div>
      </Card>
    </ViewTransition>
  );
}
