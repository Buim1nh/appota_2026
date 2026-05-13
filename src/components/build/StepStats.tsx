"use client";

import React, { useState } from "react";
import { useBuildDraftStore } from "@/store/build-draft-store";
import { rollAllStats } from "@/utils/statCalculations";
import Button from "../Button";

import { IBaseStats } from "@/types/database";

const ABILITY_NAMES: Record<keyof IBaseStats, string> = {
  str: "Strength",
  dex: "Dexterity",
  con: "Constitution",
  int: "Intelligence",
  wis: "Wisdom",
  cha: "Charisma",
};

const ABILITY_KEYS = ["str", "dex", "con", "int", "wis", "cha"] as const;

function getModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

function ModifierBadge({ score }: { score: number }) {
  const mod = getModifier(score);
  const sign = mod >= 0 ? "+" : "";
  return (
    <div className="rounded-sm border border-(--gold) bg-[rgba(182,139,42,0.1)] px-2 py-1 text-xs font-semibold text-[#f0e6d2]">
      {sign}
      {mod}
    </div>
  );
}

function formatSignedModifier(score: number) {
  const modifier = getModifier(score);
  return `${modifier >= 0 ? "+" : ""}${modifier}`;
}

export default function StepStats() {
  const draft = useBuildDraftStore((state) => state.draft);
  const updateDraft = useBuildDraftStore((state) => state.updateDraft);

  const [mode, setMode] = useState<"manual" | "roll">("manual");
  const [rolling, setRolling] = useState(false);
  const [rollHistory, setRollHistory] = useState<{ [key: string]: number }>({});

  const handleManualChange = (ability: string, value: string) => {
    const score = Math.max(3, Math.min(20, parseInt(value, 10) || 0));
    updateDraft({
      stats: {
        ...draft.stats,
        [ability]: score,
      },
    });
  };

  const handleRollAll = async () => {
    setRolling(true);

    // Animate each roll
    const newStats = { ...draft.stats };
    const history: { [key: string]: number } = {};

    for (const ability of ABILITY_KEYS) {
      // Simulate dice roll animation delay
      await new Promise((resolve) => setTimeout(resolve, 200));

      const rolled = rollAllStats();
      newStats[ability] = rolled[ability];
      history[ability] = rolled[ability];
    }

    setRollHistory(history);
    updateDraft({ stats: newStats });
    setRolling(false);
  };

  const handleRollSingle = (ability: string) => {
    const animationDuration = 300;
    let startTime: number | null = null; // Khởi tạo biến lưu trữ, không gọi hàm impure ở đây

    const animate = (currentTime: number) => {
      // Lần chạy đầu tiên, currentTime sẽ là timestamp từ trình duyệt
      if (startTime === null) {
        startTime = currentTime;
      }

      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Logic tính toán khi kết thúc animation
        const rolls = Array(4)
          .fill(0)
          .map(() => Math.floor(Math.random() * 6) + 1);
        rolls.sort((a, b) => b - a);
        const finalScore = rolls[0] + rolls[1] + rolls[2];

        updateDraft({
          stats: {
            ...draft.stats,
            [ability]: finalScore,
          },
        });

        setRollHistory((prev) => ({
          ...prev,
          [ability]: finalScore,
        }));
      }
    };

    requestAnimationFrame(animate);
  };

  return (
    <div className="space-y-5">
      <div className="rpg-panel ornate-border rounded-sm p-4 md:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="font-press text-xl text-[#f0e6d2] drop-shadow-[0_2px_0_rgba(0,0,0,0.9),0_0_10px_rgba(0,0,0,0.45)]">
              Step 4: Ability Scores
            </h2>
            <p className="mt-2 text-sm leading-6 text-(--muted)">
              Roll your ability scores using 4d6 drop lowest, or enter them
              manually. Each modifier is calculated below the score.
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant={mode === "manual" ? "primary" : "ghost"}
              className="px-4 py-3 text-sm"
              onClick={() => setMode("manual")}
            >
              Manual
            </Button>
            <Button
              variant={mode === "roll" ? "primary" : "ghost"}
              className="px-4 py-3 text-sm"
              onClick={() => setMode("roll")}
            >
              Roll
            </Button>
          </div>
        </div>
      </div>

      {mode === "roll" && (
        <div className="rpg-panel ornate-border rounded-sm p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-press text-sm text-[#f0e6d2]">
                Dice Rolling
              </h3>
              <p className="mt-1 text-sm text-(--muted)">
                Click Roll All to generate all six scores, or roll individual
                abilities.
              </p>
            </div>
            <Button
              variant="primary"
              className="px-6 py-3"
              onClick={handleRollAll}
              disabled={rolling}
            >
              {rolling ? "Rolling..." : "Roll All"}
            </Button>
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {ABILITY_KEYS.map((ability) => {
          const score = draft.stats[ability];
          const isRolled = rollHistory[ability] !== undefined;

          return (
            <div
              key={ability}
              className={[
                "rpg-panel ornate-border rounded-sm p-5 transition-all duration-300",
                isRolled
                  ? "shadow-[0_0_0_2px_rgba(182,139,42,0.7),0_0_20px_rgba(182,139,42,0.3)]"
                  : "",
              ].join(" ")}
            >
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-press text-sm text-[#f0e6d2]">
                  {ABILITY_NAMES[ability]}
                </h3>
                <ModifierBadge score={score} />
              </div>

              {mode === "manual" ? (
                <input
                  type="number"
                  min={3}
                  max={20}
                  value={score}
                  onChange={(e) => handleManualChange(ability, e.target.value)}
                  className="rpg-control w-full rounded-sm px-3 py-3 text-center text-lg font-bold"
                />
              ) : (
                <div className="space-y-3">
                  <div className="rounded-sm border border-(--border) bg-[rgba(255,255,255,0.04)] px-4 py-4 text-center">
                    <div
                      className={[
                        "text-4xl font-bold transition-all duration-200",
                        isRolled
                          ? "text-[#f0e6d2] drop-shadow-[0_0_10px_rgba(182,139,42,0.6)]"
                          : "text-(--muted)",
                      ].join(" ")}
                    >
                      {score}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    className="w-full px-3 py-2 text-sm"
                    onClick={() => handleRollSingle(ability)}
                    disabled={rolling}
                  >
                    Roll {ability.toUpperCase()}
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="rpg-panel ornate-border rounded-sm p-5">
        <h3 className="font-press text-sm text-[#f0e6d2]">Ability Summary</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {ABILITY_KEYS.map((ability) => (
            <div
              key={`summary-${ability}`}
              className="flex items-center justify-between rounded-sm border border-(--border) bg-[rgba(255,255,255,0.04)] px-3 py-2 text-sm"
            >
              <span className="text-(--muted)">{ABILITY_NAMES[ability]}</span>
              <span className="font-bold text-[#f0e6d2]">
                {draft.stats[ability]} (
                {formatSignedModifier(draft.stats[ability])})
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
